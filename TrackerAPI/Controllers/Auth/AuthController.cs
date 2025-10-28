using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.ComponentModel.DataAnnotations;
using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.DTOs.Auth;
using ElectricityTrackerAPI.Models.Core;
using ElectricityTrackerAPI.Models.Common;
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

                // Refresh token oluştur
                var refreshToken = GenerateRefreshToken();
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();

                // Refresh token'ı veritabanına kaydet
                var refreshTokenEntity = new RefreshToken
                {
                    UserId = user.Id,
                    Token = refreshToken,
                    ExpiresAt = DateTime.UtcNow.AddDays(7), // 7 gün geçerli
                    CreatedAt = DateTime.UtcNow,
                    CreatedByIp = ipAddress
                };

                _context.RefreshTokens.Add(refreshTokenEntity);
                await _context.SaveChangesAsync();

                var response = new LoginResponseDto
                {
                    Token = token,
                    RefreshToken = refreshToken,
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

        [HttpPost("refresh-token")]
        public async Task<ActionResult<LoginResponseDto>> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                // Refresh token'ı veritabanında bul
                var refreshToken = await _context.RefreshTokens
                    .Include(rt => rt.User)
                        .ThenInclude(u => u!.Tenant)
                    .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

                if (refreshToken == null || !refreshToken.IsActive)
                {
                    return Unauthorized(ApiResponse<LoginResponseDto>.ErrorResponse(
                        "Geçersiz veya süresi dolmuş refresh token",
                        "Lütfen tekrar giriş yapın",
                        401
                    ));
                }

                var user = refreshToken.User!;

                // Yeni JWT token oluştur
                var newJwtToken = GenerateJwtToken(user);

                // Yeni refresh token oluştur
                var newRefreshToken = GenerateRefreshToken();
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();

                // Eski token'ı revoke et
                refreshToken.RevokedAt = DateTime.UtcNow;
                refreshToken.RevokedByIp = ipAddress;
                refreshToken.ReplacedByToken = newRefreshToken;
                refreshToken.ReasonRevoked = "Replaced by new token";

                // Yeni token'ı kaydet
                var newRefreshTokenEntity = new RefreshToken
                {
                    UserId = user.Id,
                    Token = newRefreshToken,
                    ExpiresAt = DateTime.UtcNow.AddDays(7),
                    CreatedAt = DateTime.UtcNow,
                    CreatedByIp = ipAddress
                };

                _context.RefreshTokens.Add(newRefreshTokenEntity);
                await _context.SaveChangesAsync();

                var response = new LoginResponseDto
                {
                    Token = newJwtToken,
                    RefreshToken = newRefreshToken,
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

                return Ok(ApiResponse<LoginResponseDto>.SuccessResponse(
                    data: response,
                    message: "Token yenilendi",
                    statusCode: 200
                ));
            }
            catch (Exception ex)
            {
                _logService.LogError("Refresh token error", ex, "AuthController");
                return StatusCode(500, ApiResponse<LoginResponseDto>.ErrorResponse(
                    "Token yenileme işlemi sırasında bir hata oluştu",
                    ex.Message,
                    500
                ));
            }
        }

        [HttpPost("revoke-token")]
        public async Task<ActionResult> RevokeToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                var refreshToken = await _context.RefreshTokens
                    .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

                if (refreshToken == null || !refreshToken.IsActive)
                {
                    return BadRequest(ApiResponse.ErrorResponse(
                        "Geçersiz refresh token",
                        "Token bulunamadı veya zaten iptal edilmiş",
                        400
                    ));
                }

                // Token'ı iptal et
                refreshToken.RevokedAt = DateTime.UtcNow;
                refreshToken.RevokedByIp = HttpContext.Connection.RemoteIpAddress?.ToString();
                refreshToken.ReasonRevoked = "Revoked by user";

                await _context.SaveChangesAsync();

                return Ok(ApiResponse.SuccessResponse(
                    "Token başarıyla iptal edildi",
                    200
                ));
            }
            catch (Exception ex)
            {
                _logService.LogError("Revoke token error", ex, "AuthController");
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "Token iptal işlemi sırasında bir hata oluştu",
                    ex.Message,
                    500
                ));
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

            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new InvalidOperationException("JWT Key is not configured!");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            
            // Configuration'dan expiration süresini oku, varsayılan 24 saat
            var expirationHours = _configuration.GetValue<int>("Jwt:ExpirationHours", 24);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(expirationHours),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }
    }

    public class RefreshTokenRequest
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
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