using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.ComponentModel.DataAnnotations;
using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.DTOs.Auth;
using ElectricityTrackerAPI.Models.Core;
using ElectricityTrackerAPI.Services;
using BCrypt.Net;

namespace ElectricityTrackerAPI.Controllers.Auth
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogService _logService;

        public AuthController(ApplicationDbContext context, IConfiguration configuration, ILogService logService)
        {
            _context = context;
            _configuration = configuration;
            _logService = logService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login(LoginDto loginDto)
        {
            try
            {
                // Kullanıcıyı e-posta ile bul
                var user = await _context.Users
                    .Include(u => u.Tenant)
                    .FirstOrDefaultAsync(u => u.Email == loginDto.Email && u.IsActive);

                if (user == null)
                {
                    _logService.LogWarning($"Failed login attempt - Email: {loginDto.Email}", "AuthController");
                    return Unauthorized(new { message = "Geçersiz e-posta veya şifre" });
                }

                // Şifreyi doğrula
                if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                {
                    _logService.LogWarning($"Failed login attempt - Email: {loginDto.Email}", "AuthController");
                    return Unauthorized(new { message = "Geçersiz e-posta veya şifre" });
                }

                // Son giriş zamanını güncelle
                user.LastLoginAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                // Log successful login
                _logService.LogUserActivity(
                    user.Id.ToString(),
                    user.Email,
                    "Login successful",
                    user.TenantId.ToString()
                );

                // JWT token oluştur
                var token = GenerateJwtToken(user);

                var response = new LoginResponseDto
                {
                    Token = token,
                    RefreshToken = Guid.NewGuid().ToString(), // Basit refresh token
                    ExpiresAt = DateTime.UtcNow.AddHours(24),
                    User = new UserDto
                    {
                        Id = user.Id,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        Role = user.Role.ToString(),
                        TenantId = user.TenantId,
                        TenantName = user.Tenant.CompanyName
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Giriş işlemi sırasında bir hata oluştu", error = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<LoginResponseDto>> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                // E-posta kontrolü
                if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                {
                    return BadRequest(new { message = "Bu e-posta adresi zaten kullanılıyor" });
                }

                // Tenant oluştur
                var tenant = new Tenant
                {
                    CompanyName = registerDto.CompanyName,
                    ContactPerson = registerDto.ContactPerson,
                    AdminEmail = registerDto.Email,
                    Phone = registerDto.Phone,
                    Address = registerDto.Address,
                    TaxNumber = registerDto.TaxNumber,
                    TaxOffice = registerDto.TaxOffice,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Tenants.Add(tenant);
                await _context.SaveChangesAsync();

                // Admin kullanıcısı oluştur
                var user = new User
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Email = registerDto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                    Role = UserRole.Admin,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    TenantId = tenant.Id
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // JWT token oluştur
                var token = GenerateJwtToken(user);

                var response = new LoginResponseDto
                {
                    Token = token,
                    RefreshToken = Guid.NewGuid().ToString(),
                    ExpiresAt = DateTime.UtcNow.AddHours(24),
                    User = new UserDto
                    {
                        Id = user.Id,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        Role = user.Role.ToString(),
                        TenantId = user.TenantId,
                        TenantName = tenant.CompanyName
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kayıt işlemi sırasında bir hata oluştu", error = ex.Message });
            }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim("TenantId", user.TenantId.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "your-secret-key-here"));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "ElectricityTrackerAPI",
                audience: _configuration["Jwt:Audience"] ?? "ElectricityTrackerAPI",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class RegisterDto
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        public string ContactPerson { get; set; } = string.Empty;

        [Required]
        public string Phone { get; set; } = string.Empty;

        public string? Address { get; set; }

        public string? TaxNumber { get; set; }

        public string? TaxOffice { get; set; }
    }
} 