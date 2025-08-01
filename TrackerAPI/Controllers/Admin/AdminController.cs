using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.Models.Core;
using ElectricityTrackerAPI.Models.Admin;
using ElectricityTrackerAPI.Models.Logging;
using ElectricityTrackerAPI.DTOs.Admin;
using System.Security.Cryptography;
using System.Text;
using System.Diagnostics;

namespace ElectricityTrackerAPI.Controllers.Admin
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : Common.BaseController
    {
        public AdminController(ApplicationDbContext context, ILogger<AdminController> logger) 
            : base(context, logger)
        {
        }

        #region Dashboard Statistics

        [HttpGet("dashboard/stats")]
        public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
        {
            try
            {
                var totalTenants = await _context.Tenants.CountAsync();
                var activeTenants = await _context.Tenants.CountAsync(t => t.Status == TenantStatus.Active);
                var totalUsers = await _context.Users.CountAsync();
                var activeUsers = await _context.Users.CountAsync(u => u.IsActive);
                var totalLogs = await _context.SystemLogs.CountAsync();
                var todayLogs = await _context.SystemLogs.CountAsync(l => l.Timestamp.Date == DateTime.UtcNow.Date);

                var stats = new DashboardStatsDto
                {
                    TotalTenants = totalTenants,
                    ActiveTenants = activeTenants,
                    TotalUsers = totalUsers,
                    ActiveUsers = activeUsers,
                    TotalLogs = totalLogs,
                    TodayLogs = todayLogs,
                    SystemHealth = CalculateSystemHealth(),
                    SecurityScore = CalculateSecurityScore()
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Dashboard istatistikleri alınırken hata oluştu", error = ex.Message });
            }
        }

        [HttpGet("dashboard/recent-activities")]
        public async Task<ActionResult<List<RecentActivityDto>>> GetRecentActivities()
        {
            try
            {
                var activities = await _context.SystemLogs
                    .Include(l => l.Tenant)
                    .Include(l => l.User)
                    .OrderByDescending(l => l.Timestamp)
                    .Take(10)
                    .Select(l => new RecentActivityDto
                    {
                        Id = l.Id,
                        Message = l.Message,
                        Level = l.Level,
                        Category = l.Category,
                        Timestamp = l.Timestamp,
                        TenantName = l.Tenant != null ? l.Tenant.CompanyName : null,
                        UserName = l.User != null ? $"{l.User.FirstName} {l.User.LastName}" : null
                    })
                    .ToListAsync();

                return Ok(activities);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Son aktiviteler alınırken hata oluştu", error = ex.Message });
            }
        }

        [HttpGet("dashboard/system-resources")]
        public ActionResult<SystemResourcesDto> GetSystemResources()
        {
            try
            {
                var process = Process.GetCurrentProcess();
                var memoryInfo = GC.GetGCMemoryInfo();
                
                var resources = new SystemResourcesDto
                {
                    CpuUsage = (int)GetCpuUsage(),
                    MemoryUsage = (int)((double)process.WorkingSet64 / memoryInfo.TotalAvailableMemoryBytes * 100),
                    DiskUsage = GetDiskUsage(),
                    NetworkUsage = GetNetworkUsage(),
                    DatabaseConnections = GetDatabaseConnections(),
                    ActiveSessions = GetActiveSessions()
                };

                return Ok(resources);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Sistem kaynakları alınırken hata oluştu", error = ex.Message });
            }
        }

        #endregion

        #region Tenant Management

        [HttpGet("tenants")]
        public async Task<ActionResult<PagedResult<TenantDto>>> GetTenants(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] string? status = null,
            [FromQuery] string? subscription = null)
        {
            try
            {
                var query = _context.Tenants.AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(t => 
                        t.CompanyName.Contains(search) || 
                        t.FacilityCode.Contains(search) || 
                        t.Domain.Contains(search) ||
                        t.AdminEmail.Contains(search));
                }

                if (!string.IsNullOrEmpty(status) && Enum.TryParse<TenantStatus>(status, out var statusEnum))
                {
                    query = query.Where(t => t.Status == statusEnum);
                }

                if (!string.IsNullOrEmpty(subscription) && Enum.TryParse<SubscriptionType>(subscription, out var subscriptionEnum))
                {
                    query = query.Where(t => t.Subscription == subscriptionEnum);
                }

                var totalCount = await query.CountAsync();

                var tenants = await query
                    .OrderByDescending(t => t.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(t => new TenantDto
                    {
                        Id = t.Id,
                        CompanyName = t.CompanyName,
                        FacilityCode = t.FacilityCode,
                        Domain = t.Domain,
                        AdminEmail = t.AdminEmail,
                        Status = t.Status.ToString(),
                        Subscription = t.Subscription.ToString(),
                        UserCount = t.Users.Count,
                        FacilityCount = t.Facilities.Count,
                        CreatedAt = t.CreatedAt,
                        LastLogin = t.LastLogin,
                        LicenseExpiry = t.SubscriptionEndDate,
                        TotalConsumption = t.TotalConsumption,
                        PaymentStatus = t.PaymentStatus.ToString(),
                        Currency = t.Currency,
                        Language = t.Language,
                        Logo = t.Logo,
                        MonthlyFee = t.MonthlyFee,
                        LastPayment = t.LastPayment
                    })
                    .ToListAsync();

                var result = new PagedResult<TenantDto>
                {
                    Items = tenants,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Tenant listesi alınırken hata oluştu", error = ex.Message });
            }
        }

        [HttpPost("tenants")]
        public async Task<ActionResult<TenantDto>> CreateTenant([FromBody] CreateTenantDto dto)
        {
            try
            {
                // Check if facility code already exists
                if (await _context.Tenants.AnyAsync(t => t.FacilityCode == dto.FacilityCode))
                {
                    return BadRequest(new { message = "Bu tesis kodu zaten kullanılıyor" });
                }

                // Check if domain already exists
                if (await _context.Tenants.AnyAsync(t => t.Domain == dto.Domain))
                {
                    return BadRequest(new { message = "Bu domain zaten kullanılıyor" });
                }

                var tenant = new Tenant
                {
                    CompanyName = dto.CompanyName,
                    FacilityCode = dto.FacilityCode,
                    Domain = dto.Domain,
                    AdminEmail = dto.AdminEmail,
                    Subscription = Enum.Parse<SubscriptionType>(dto.Subscription),
                    Currency = dto.Currency,
                    Language = dto.Language,
                    MonthlyFee = GetMonthlyFee(Enum.Parse<SubscriptionType>(dto.Subscription)),
                    Status = TenantStatus.Pending,
                    PaymentStatus = PaymentStatus.Pending
                };

                _context.Tenants.Add(tenant);
                await _context.SaveChangesAsync();

                // Create admin user if requested
                if (dto.AutoCreateAdmin)
                {
                    var adminUser = new User
                    {
                        FirstName = "Admin",
                        LastName = tenant.CompanyName,
                        Email = tenant.AdminEmail,
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                        Role = UserRole.Admin,
                        TenantId = tenant.Id,
                        IsActive = true
                    };

                    _context.Users.Add(adminUser);
                    await _context.SaveChangesAsync();
                }

                // Log the action
                await LogSystemAction("Tenant oluşturuldu", $"Tenant: {tenant.CompanyName} ({tenant.FacilityCode})", "User");

                return CreatedAtAction(nameof(GetTenant), new { id = tenant.Id }, new TenantDto
                {
                    Id = tenant.Id,
                    CompanyName = tenant.CompanyName,
                    FacilityCode = tenant.FacilityCode,
                    Domain = tenant.Domain,
                    AdminEmail = tenant.AdminEmail,
                    Status = tenant.Status.ToString(),
                    Subscription = tenant.Subscription.ToString()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Tenant oluşturulurken hata oluştu", error = ex.Message });
            }
        }

        [HttpGet("tenants/{id}")]
        public async Task<ActionResult<TenantDto>> GetTenant(int id)
        {
            try
            {
                var tenant = await _context.Tenants
                    .Include(t => t.Users)
                    .Include(t => t.Facilities)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (tenant == null)
                {
                    return NotFound(new { message = "Tenant bulunamadı" });
                }

                var dto = new TenantDto
                {
                    Id = tenant.Id,
                    CompanyName = tenant.CompanyName,
                    FacilityCode = tenant.FacilityCode,
                    Domain = tenant.Domain,
                    AdminEmail = tenant.AdminEmail,
                    Status = tenant.Status.ToString(),
                    Subscription = tenant.Subscription.ToString(),
                    UserCount = tenant.Users.Count,
                    FacilityCount = tenant.Facilities.Count,
                    CreatedAt = tenant.CreatedAt,
                    LastLogin = tenant.LastLogin,
                    LicenseExpiry = tenant.SubscriptionEndDate,
                    TotalConsumption = tenant.TotalConsumption,
                    PaymentStatus = tenant.PaymentStatus.ToString(),
                    Currency = tenant.Currency,
                    Language = tenant.Language,
                    Logo = tenant.Logo,
                    MonthlyFee = tenant.MonthlyFee,
                    LastPayment = tenant.LastPayment
                };

                return Ok(dto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Tenant detayları alınırken hata oluştu", error = ex.Message });
            }
        }

        [HttpPut("tenants/{id}")]
        public async Task<ActionResult<TenantDto>> UpdateTenant(int id, [FromBody] UpdateTenantDto dto)
        {
            try
            {
                var tenant = await _context.Tenants.FindAsync(id);
                if (tenant == null)
                {
                    return NotFound(new { message = "Tenant bulunamadı" });
                }

                // Check if facility code already exists (excluding current tenant)
                if (await _context.Tenants.AnyAsync(t => t.FacilityCode == dto.FacilityCode && t.Id != id))
                {
                    return BadRequest(new { message = "Bu tesis kodu zaten kullanılıyor" });
                }

                // Check if domain already exists (excluding current tenant)
                if (await _context.Tenants.AnyAsync(t => t.Domain == dto.Domain && t.Id != id))
                {
                    return BadRequest(new { message = "Bu domain zaten kullanılıyor" });
                }

                tenant.CompanyName = dto.CompanyName;
                tenant.FacilityCode = dto.FacilityCode;
                tenant.Domain = dto.Domain;
                tenant.AdminEmail = dto.AdminEmail;
                tenant.Subscription = Enum.Parse<SubscriptionType>(dto.Subscription);
                tenant.Currency = dto.Currency;
                tenant.Language = dto.Language;
                tenant.MonthlyFee = GetMonthlyFee(Enum.Parse<SubscriptionType>(dto.Subscription));
                tenant.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Log the action
                await LogSystemAction("Tenant güncellendi", $"Tenant: {tenant.CompanyName} ({tenant.FacilityCode})", "User");

                return Ok(new TenantDto
                {
                    Id = tenant.Id,
                    CompanyName = tenant.CompanyName,
                    FacilityCode = tenant.FacilityCode,
                    Domain = tenant.Domain,
                    AdminEmail = tenant.AdminEmail,
                    Status = tenant.Status.ToString(),
                    Subscription = tenant.Subscription.ToString(),
                    UserCount = await _context.Users.CountAsync(u => u.TenantId == tenant.Id),
                    FacilityCount = await _context.Facilities.CountAsync(f => f.TenantId == tenant.Id),
                    CreatedAt = tenant.CreatedAt,
                    LastLogin = tenant.LastLogin,
                    LicenseExpiry = tenant.SubscriptionEndDate,
                    TotalConsumption = tenant.TotalConsumption,
                    PaymentStatus = tenant.PaymentStatus.ToString(),
                    Currency = tenant.Currency,
                    Language = tenant.Language,
                    Logo = tenant.Logo,
                    MonthlyFee = tenant.MonthlyFee,
                    LastPayment = tenant.LastPayment
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Tenant güncellenirken hata oluştu", error = ex.Message });
            }
        }

        [HttpDelete("tenants/{id}")]
        public async Task<ActionResult> DeleteTenant(int id)
        {
            try
            {
                var tenant = await _context.Tenants.FindAsync(id);
                if (tenant == null)
                {
                    return NotFound(new { message = "Tenant bulunamadı" });
                }

                // Log the action before deletion
                await LogSystemAction("Tenant silindi", $"Tenant: {tenant.CompanyName} ({tenant.FacilityCode})", "User");

                _context.Tenants.Remove(tenant);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Tenant başarıyla silindi" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Tenant silinirken hata oluştu", error = ex.Message });
            }
        }

        #endregion

        #region User Management

        [HttpGet("users")]
        public async Task<ActionResult<PagedResult<UserDto>>> GetUsers(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] int? tenantId = null,
            [FromQuery] string? role = null,
            [FromQuery] bool? isActive = null)
        {
            try
            {
                var query = _context.Users
                    .Include(u => u.Tenant)
                    .Include(u => u.Department)
                    .AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(u => 
                        u.FirstName.Contains(search) || 
                        u.LastName.Contains(search) || 
                        u.Email.Contains(search));
                }

                if (tenantId.HasValue)
                {
                    query = query.Where(u => u.TenantId == tenantId.Value);
                }

                if (!string.IsNullOrEmpty(role))
                {
                    if (Enum.TryParse<UserRole>(role, true, out var userRole))
                    {
                        query = query.Where(u => u.Role == userRole);
                    }
                }

                if (isActive.HasValue)
                {
                    query = query.Where(u => u.IsActive == isActive.Value);
                }

                var totalCount = await query.CountAsync();
                var users = await query
                    .OrderByDescending(u => u.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var userDtos = users.Select(u => new UserDto
                    {
                        Id = u.Id,
                        Username = $"{u.FirstName.ToLower()}.{u.LastName.ToLower()}",
                        FullName = $"{u.FirstName} {u.LastName}",
                        Email = u.Email,
                        TenantId = u.TenantId,
                    TenantName = u.Tenant != null ? u.Tenant.CompanyName : "Bilinmeyen Tenant",
                        Role = u.Role.ToString(),
                        RoleName = GetRoleDisplayName(u.Role),
                        IsActive = u.IsActive,
                        IsLocked = u.IsLocked,
                        LastLogin = u.LastLoginAt,
                        LastLoginIp = u.LastLoginIp,
                    LoginCount = u.LoginAttempts,
                        CreatedAt = u.CreatedAt,
                        Phone = u.Phone,
                    Department = u.Department != null ? u.Department.Name : null,
                    PasswordHash = u.PasswordHash
                }).ToList();

                var result = new PagedResult<UserDto>
                {
                    Items = userDtos,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetUsers error: {Message}", ex.Message);
                return StatusCode(500, new { message = "Kullanıcı listesi alınırken hata oluştu", error = ex.Message });
            }
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Tenant)
                    .Include(u => u.Department)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                {
                    return NotFound(new { message = "Kullanıcı bulunamadı" });
                }

                var userDto = new UserDto
                {
                    Id = user.Id,
                    Username = $"{user.FirstName.ToLower()}.{user.LastName.ToLower()}",
                    FullName = $"{user.FirstName} {user.LastName}",
                    Email = user.Email,
                    TenantId = user.TenantId,
                    TenantName = user.Tenant != null ? user.Tenant.CompanyName : "Bilinmeyen Tenant",
                    Role = user.Role.ToString(),
                    RoleName = GetRoleDisplayName(user.Role),
                    IsActive = user.IsActive,
                    IsLocked = user.IsLocked,
                    LastLogin = user.LastLoginAt,
                    LastLoginIp = user.LastLoginIp,
                    LoginCount = user.LoginAttempts,
                    CreatedAt = user.CreatedAt,
                    Phone = user.Phone,
                    Department = user.Department != null ? user.Department.Name : null,
                    PasswordHash = user.PasswordHash
                };

                return Ok(userDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kullanıcı bilgileri alınırken hata oluştu", error = ex.Message });
            }
        }

        [HttpPost("users")]
        public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto dto)
        {
            try
            {
                // Check if tenant exists
                var tenant = await _context.Tenants.FindAsync(dto.TenantId);
                if (tenant == null)
                {
                    return BadRequest(new { message = "Geçersiz tenant ID" });
                }

                // Check if email already exists
                if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                {
                    return BadRequest(new { message = "Bu email adresi zaten kullanılıyor" });
                }

                // Hash password
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

                var user = new User
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Email = dto.Email,
                    PasswordHash = passwordHash,
                    Phone = dto.Phone,
                    Role = Enum.Parse<UserRole>(dto.Role, true),
                    IsActive = dto.IsActive,
                    TenantId = dto.TenantId,
                    DepartmentId = dto.DepartmentId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Log the action
                await LogSystemAction(
                    $"Yeni kullanıcı oluşturuldu: {user.FirstName} {user.LastName}",
                    $"Tenant: {tenant.CompanyName}, Rol: {dto.Role}",
                    "User"
                );

                var userDto = new UserDto
                {
                    Id = user.Id,
                    Username = $"{user.FirstName.ToLower()}.{user.LastName.ToLower()}",
                    FullName = $"{user.FirstName} {user.LastName}",
                    Email = user.Email,
                    TenantId = user.TenantId,
                    TenantName = tenant.CompanyName,
                    Role = user.Role.ToString(),
                    RoleName = GetRoleDisplayName(user.Role),
                    IsActive = user.IsActive,
                    IsLocked = user.IsLocked,
                    LastLogin = user.LastLoginAt,
                    LastLoginIp = user.LastLoginIp,
                    LoginCount = user.LoginAttempts,
                    CreatedAt = user.CreatedAt,
                    Phone = user.Phone
                };

                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, userDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kullanıcı oluşturulurken hata oluştu", error = ex.Message });
            }
        }

        [HttpPut("users/{id}")]
        public async Task<ActionResult<UserDto>> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Tenant)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                {
                    return NotFound(new { message = "Kullanıcı bulunamadı" });
                }

                // Check if email already exists (excluding current user)
                if (await _context.Users.AnyAsync(u => u.Email == dto.Email && u.Id != id))
                {
                    return BadRequest(new { message = "Bu email adresi zaten kullanılıyor" });
                }

                user.FirstName = dto.FirstName;
                user.LastName = dto.LastName;
                user.Email = dto.Email;
                user.Phone = dto.Phone;
                user.Role = Enum.Parse<UserRole>(dto.Role, true);
                user.IsActive = dto.IsActive;
                if (dto.IsLocked.HasValue)
                {
                    user.IsLocked = dto.IsLocked.Value;
                }
                user.DepartmentId = dto.DepartmentId;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Log the action
                await LogSystemAction(
                    $"Kullanıcı güncellendi: {user.FirstName} {user.LastName}",
                    $"Tenant: {user.Tenant.CompanyName}, Rol: {dto.Role}",
                    "User"
                );

                var userDto = new UserDto
                {
                    Id = user.Id,
                    Username = $"{user.FirstName.ToLower()}.{user.LastName.ToLower()}",
                    FullName = $"{user.FirstName} {user.LastName}",
                    Email = user.Email,
                    TenantId = user.TenantId,
                    TenantName = user.Tenant.CompanyName,
                    Role = user.Role.ToString(),
                    RoleName = GetRoleDisplayName(user.Role),
                    IsActive = user.IsActive,
                    IsLocked = user.IsLocked,
                    LastLogin = user.LastLoginAt,
                    LastLoginIp = user.LastLoginIp,
                    LoginCount = user.LoginAttempts,
                    CreatedAt = user.CreatedAt,
                    Phone = user.Phone
                };

                return Ok(userDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kullanıcı güncellenirken hata oluştu", error = ex.Message });
            }
        }

        [HttpDelete("users/{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Tenant)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                {
                    return NotFound(new { message = "Kullanıcı bulunamadı" });
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                // Log the action
                await LogSystemAction(
                    $"Kullanıcı silindi: {user.FirstName} {user.LastName}",
                    $"Tenant: {user.Tenant.CompanyName}",
                    "User"
                );

                return Ok(new { message = "Kullanıcı başarıyla silindi" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kullanıcı silinirken hata oluştu", error = ex.Message });
            }
        }

        [HttpPost("users/{id}/toggle-lock")]
        public async Task<ActionResult> ToggleUserLock(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Tenant)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                {
                    return NotFound(new { message = "Kullanıcı bulunamadı" });
                }

                user.IsLocked = !user.IsLocked;
                user.LockedAt = user.IsLocked ? DateTime.UtcNow : null;
                user.LockReason = user.IsLocked ? "Admin tarafından kilitlendi" : null;

                await _context.SaveChangesAsync();

                // Log the action
                var action = user.IsLocked ? "kilitlendi" : "kilidi açıldı";
                await LogSystemAction(
                    $"Kullanıcı {action}: {user.FirstName} {user.LastName}",
                    $"Tenant: {user.Tenant.CompanyName}",
                    "Security"
                );

                return Ok(new { 
                    message = $"Kullanıcı başarıyla {action}",
                    isLocked = user.IsLocked 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kullanıcı kilidi değiştirilirken hata oluştu", error = ex.Message });
            }
        }

        [HttpPost("users/{id}/reset-password")]
        public async Task<ActionResult> ResetUserPassword(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Tenant)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                {
                    return NotFound(new { message = "Kullanıcı bulunamadı" });
                }

                // Generate temporary password
                var tempPassword = GenerateTemporaryPassword();
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(tempPassword);

                user.PasswordHash = passwordHash;
                user.RequirePasswordChange = true;
                user.PasswordChangedAt = DateTime.UtcNow;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Log the action
                await LogSystemAction(
                    $"Kullanıcı şifresi sıfırlandı: {user.FirstName} {user.LastName}",
                    $"Tenant: {user.Tenant.CompanyName}",
                    "Security"
                );

                return Ok(new { 
                    message = "Şifre başarıyla sıfırlandı",
                    temporaryPassword = tempPassword // In production, this should be sent via email
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Şifre sıfırlanırken hata oluştu", error = ex.Message });
            }
        }

        [HttpGet("users/{id}/login-history")]
        public async Task<ActionResult<List<LoginHistoryDto>>> GetUserLoginHistory(int id)
        {
            try
            {
                var loginHistory = await _context.SystemLogs
                    .Where(l => l.UserId == id && l.Category == "Login")
                    .OrderByDescending(l => l.Timestamp)
                    .Take(20)
                    .Select(l => new LoginHistoryDto
                    {
                        Id = l.Id,
                        Timestamp = l.Timestamp,
                        IpAddress = l.IpAddress,
                        UserAgent = l.UserAgent,
                        Status = l.Level == "Info" ? "Başarılı" : "Başarısız",
                        Details = l.Message
                    })
                    .ToListAsync();

                return Ok(loginHistory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Giriş geçmişi alınırken hata oluştu", error = ex.Message });
            }
        }

        [HttpGet("users/{id}/current-password")]
        public async Task<ActionResult> GetCurrentPassword(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Tenant)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                {
                    return NotFound(new { message = "Kullanıcı bulunamadı" });
                }

                // For security, we'll return a masked version of the hash
                // This is not the actual password but a representation
                var maskedHash = user.PasswordHash?.Length > 10 
                    ? user.PasswordHash.Substring(0, 10) + "..." 
                    : "Hash mevcut değil";

                return Ok(new { 
                    passwordHash = maskedHash,
                    passwordLength = user.PasswordHash?.Length ?? 0,
                    lastChanged = user.PasswordChangedAt,
                    requireChange = user.RequirePasswordChange
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Şifre bilgisi alınırken hata oluştu", error = ex.Message });
            }
        }

        private string GetRoleDisplayName(UserRole role)
        {
            return role switch
            {
                UserRole.Admin => "Admin",
                UserRole.Accountant => "Muhasebeci",
                UserRole.Analyst => "Analist",
                UserRole.ReportViewer => "Rapor Görücü",
                UserRole.Manager => "Yönetici",
                UserRole.User => "Kullanıcı",
                UserRole.Viewer => "Görücü",
                _ => role.ToString()
            };
        }

        private string GenerateTemporaryPassword()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 8).Select(s => s[random.Next(s.Length)]).ToArray());
        }

        #endregion

        #region API Management

        [HttpGet("api-keys")]
        public async Task<ActionResult<PagedResult<ApiKeyDto>>> GetApiKeys(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] int? tenantId = null,
            [FromQuery] string? status = null,
            [FromQuery] bool? hasWebhook = null)
        {
            try
            {
                var query = _context.ApiKeys
                    .Include(ak => ak.Tenant)
                    .AsQueryable();

                // Apply filters
                if (tenantId.HasValue)
                {
                    query = query.Where(ak => ak.TenantId == tenantId.Value);
                }

                if (!string.IsNullOrEmpty(status))
                {
                    if (Enum.TryParse<ApiKeyStatus>(status, true, out var apiKeyStatus))
                    {
                        query = query.Where(ak => ak.Status == apiKeyStatus);
                    }
                }

                if (hasWebhook.HasValue)
                {
                    if (hasWebhook.Value)
                    {
                        query = query.Where(ak => !string.IsNullOrEmpty(ak.WebhookUrl));
                    }
                    else
                    {
                        query = query.Where(ak => string.IsNullOrEmpty(ak.WebhookUrl));
                    }
                }

                var totalCount = await query.CountAsync();
                var apiKeys = await query
                    .OrderByDescending(ak => ak.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(ak => new ApiKeyDto
                    {
                        Id = ak.Id,
                        Name = ak.Name,
                        Key = ak.Key,
                        TenantId = ak.TenantId,
                        TenantName = ak.Tenant.CompanyName,
                        Status = ak.Status.ToString(),
                        Permissions = ak.Permissions,
                        RateLimit = ak.RateLimit,
                        RateLimitPeriod = ak.RateLimitPeriod,
                        CreatedAt = ak.CreatedAt,
                        LastUsed = ak.LastUsed,
                        TotalCalls = ak.TotalCalls,
                        ErrorRate = ak.ErrorRate,
                        WebhookUrl = ak.WebhookUrl,
                        WebhookStatus = ak.WebhookStatus.HasValue ? ak.WebhookStatus.Value.ToString() : null
                    })
                    .ToListAsync();

                var result = new PagedResult<ApiKeyDto>
                {
                    Items = apiKeys,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "API anahtarları alınırken hata oluştu", error = ex.Message });
            }
        }

        [HttpGet("api-keys/{id}")]
        public async Task<ActionResult<ApiKeyDto>> GetApiKey(int id)
        {
            try
            {
                var apiKey = await _context.ApiKeys
                    .Include(ak => ak.Tenant)
                    .FirstOrDefaultAsync(ak => ak.Id == id);

                if (apiKey == null)
                {
                    return NotFound(new { message = "API anahtarı bulunamadı" });
                }

                var apiKeyDto = new ApiKeyDto
                {
                    Id = apiKey.Id,
                    Name = apiKey.Name,
                    Key = apiKey.Key,
                    TenantId = apiKey.TenantId,
                    TenantName = apiKey.Tenant.CompanyName,
                    Status = apiKey.Status.ToString(),
                    Permissions = apiKey.Permissions,
                    RateLimit = apiKey.RateLimit,
                    RateLimitPeriod = apiKey.RateLimitPeriod,
                    CreatedAt = apiKey.CreatedAt,
                    LastUsed = apiKey.LastUsed,
                    TotalCalls = apiKey.TotalCalls,
                    ErrorRate = apiKey.ErrorRate,
                    WebhookUrl = apiKey.WebhookUrl,
                    WebhookStatus = apiKey.WebhookStatus.HasValue ? apiKey.WebhookStatus.Value.ToString() : null
                };

                return Ok(apiKeyDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "API anahtarı bilgileri alınırken hata oluştu", error = ex.Message });
            }
        }

        [HttpPost("api-keys")]
        public async Task<ActionResult<ApiKeyDto>> CreateApiKey([FromBody] CreateApiKeyDto dto)
        {
            try
            {
                // Check if tenant exists
                var tenant = await _context.Tenants.FindAsync(dto.TenantId);
                if (tenant == null)
                {
                    return BadRequest(new { message = "Geçersiz tenant ID" });
                }

                // Generate API key
                var apiKey = GenerateApiKey();

                var newApiKey = new Models.Admin.ApiKey
                {
                    Name = dto.Name,
                    Key = apiKey,
                    TenantId = dto.TenantId,
                    Status = ApiKeyStatus.Active,
                    Permissions = dto.Permissions,
                    RateLimit = dto.RateLimit,
                    RateLimitPeriod = dto.RateLimitPeriod,
                    WebhookUrl = dto.WebhookUrl,
                    WebhookStatus = !string.IsNullOrEmpty(dto.WebhookUrl) ? WebhookStatus.Active : null,
                    CreatedAt = DateTime.UtcNow
                };

                _context.ApiKeys.Add(newApiKey);
                await _context.SaveChangesAsync();

                // Log the action
                await LogSystemAction(
                    $"Yeni API anahtarı oluşturuldu: {newApiKey.Name}",
                    $"Tenant: {tenant.CompanyName}",
                    "API"
                );

                var apiKeyDto = new ApiKeyDto
                {
                    Id = newApiKey.Id,
                    Name = newApiKey.Name,
                    Key = newApiKey.Key,
                    TenantId = newApiKey.TenantId,
                    TenantName = tenant.CompanyName,
                    Status = newApiKey.Status.ToString(),
                    Permissions = newApiKey.Permissions,
                    RateLimit = newApiKey.RateLimit,
                    RateLimitPeriod = newApiKey.RateLimitPeriod,
                    CreatedAt = newApiKey.CreatedAt,
                    LastUsed = newApiKey.LastUsed,
                    TotalCalls = newApiKey.TotalCalls,
                    ErrorRate = newApiKey.ErrorRate,
                    WebhookUrl = newApiKey.WebhookUrl,
                    WebhookStatus = newApiKey.WebhookStatus.HasValue ? newApiKey.WebhookStatus.Value.ToString() : null
                };

                return CreatedAtAction(nameof(GetApiKey), new { id = newApiKey.Id }, apiKeyDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "API anahtarı oluşturulurken hata oluştu", error = ex.Message });
            }
        }

        [HttpPut("api-keys/{id}")]
        public async Task<ActionResult<ApiKeyDto>> UpdateApiKey(int id, [FromBody] UpdateApiKeyDto dto)
        {
            try
            {
                var apiKey = await _context.ApiKeys
                    .Include(ak => ak.Tenant)
                    .FirstOrDefaultAsync(ak => ak.Id == id);

                if (apiKey == null)
                {
                    return NotFound(new { message = "API anahtarı bulunamadı" });
                }

                apiKey.Name = dto.Name;
                apiKey.Permissions = dto.Permissions;
                apiKey.RateLimit = dto.RateLimit;
                apiKey.RateLimitPeriod = dto.RateLimitPeriod;
                apiKey.WebhookUrl = dto.WebhookUrl;
                apiKey.WebhookStatus = !string.IsNullOrEmpty(dto.WebhookUrl) ? WebhookStatus.Active : null;

                await _context.SaveChangesAsync();

                // Log the action
                await LogSystemAction(
                    $"API anahtarı güncellendi: {apiKey.Name}",
                    $"Tenant: {apiKey.Tenant.CompanyName}",
                    "API"
                );

                var apiKeyDto = new ApiKeyDto
                {
                    Id = apiKey.Id,
                    Name = apiKey.Name,
                    Key = apiKey.Key,
                    TenantId = apiKey.TenantId,
                    TenantName = apiKey.Tenant.CompanyName,
                    Status = apiKey.Status.ToString(),
                    Permissions = apiKey.Permissions,
                    RateLimit = apiKey.RateLimit,
                    RateLimitPeriod = apiKey.RateLimitPeriod,
                    CreatedAt = apiKey.CreatedAt,
                    LastUsed = apiKey.LastUsed,
                    TotalCalls = apiKey.TotalCalls,
                    ErrorRate = apiKey.ErrorRate,
                    WebhookUrl = apiKey.WebhookUrl,
                    WebhookStatus = apiKey.WebhookStatus?.ToString()
                };

                return Ok(apiKeyDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "API anahtarı güncellenirken hata oluştu", error = ex.Message });
            }
        }

        [HttpDelete("api-keys/{id}")]
        public async Task<ActionResult> DeleteApiKey(int id)
        {
            try
            {
                var apiKey = await _context.ApiKeys
                    .Include(ak => ak.Tenant)
                    .FirstOrDefaultAsync(ak => ak.Id == id);

                if (apiKey == null)
                {
                    return NotFound(new { message = "API anahtarı bulunamadı" });
                }

                _context.ApiKeys.Remove(apiKey);
                await _context.SaveChangesAsync();

                // Log the action
                await LogSystemAction(
                    $"API anahtarı silindi: {apiKey.Name}",
                    $"Tenant: {apiKey.Tenant.CompanyName}",
                    "API"
                );

                return Ok(new { message = "API anahtarı başarıyla silindi" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "API anahtarı silinirken hata oluştu", error = ex.Message });
            }
        }

        [HttpPost("api-keys/{id}/regenerate")]
        public async Task<ActionResult<ApiKeyDto>> RegenerateApiKey(int id)
        {
            try
            {
                var apiKey = await _context.ApiKeys
                    .Include(ak => ak.Tenant)
                    .FirstOrDefaultAsync(ak => ak.Id == id);

                if (apiKey == null)
                {
                    return NotFound(new { message = "API anahtarı bulunamadı" });
                }

                // Generate new API key
                var newKey = GenerateApiKey();
                apiKey.Key = newKey;
                apiKey.LastUsed = null; // Reset usage stats

                await _context.SaveChangesAsync();

                // Log the action
                await LogSystemAction(
                    $"API anahtarı yeniden oluşturuldu: {apiKey.Name}",
                    $"Tenant: {apiKey.Tenant.CompanyName}",
                    "API"
                );

                var apiKeyDto = new ApiKeyDto
                {
                    Id = apiKey.Id,
                    Name = apiKey.Name,
                    Key = apiKey.Key,
                    TenantId = apiKey.TenantId,
                    TenantName = apiKey.Tenant.CompanyName,
                    Status = apiKey.Status.ToString(),
                    Permissions = apiKey.Permissions,
                    RateLimit = apiKey.RateLimit,
                    RateLimitPeriod = apiKey.RateLimitPeriod,
                    CreatedAt = apiKey.CreatedAt,
                    LastUsed = apiKey.LastUsed,
                    TotalCalls = apiKey.TotalCalls,
                    ErrorRate = apiKey.ErrorRate,
                    WebhookUrl = apiKey.WebhookUrl,
                    WebhookStatus = apiKey.WebhookStatus.HasValue ? apiKey.WebhookStatus.Value.ToString() : null
                };

                return Ok(apiKeyDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "API anahtarı yeniden oluşturulurken hata oluştu", error = ex.Message });
            }
        }

        [HttpPost("api-keys/{id}/toggle-status")]
        public async Task<ActionResult> ToggleApiKeyStatus(int id)
        {
            try
            {
                var apiKey = await _context.ApiKeys
                    .Include(ak => ak.Tenant)
                    .FirstOrDefaultAsync(ak => ak.Id == id);

                if (apiKey == null)
                {
                    return NotFound(new { message = "API anahtarı bulunamadı" });
                }

                apiKey.Status = apiKey.Status == ApiKeyStatus.Active ? ApiKeyStatus.Inactive : ApiKeyStatus.Active;

                await _context.SaveChangesAsync();

                // Log the action
                var action = apiKey.Status == ApiKeyStatus.Active ? "aktifleştirildi" : "devre dışı bırakıldı";
                await LogSystemAction(
                    $"API anahtarı {action}: {apiKey.Name}",
                    $"Tenant: {apiKey.Tenant.CompanyName}",
                    "API"
                );

                return Ok(new { 
                    message = $"API anahtarı başarıyla {action}",
                    status = apiKey.Status.ToString()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "API anahtarı durumu değiştirilirken hata oluştu", error = ex.Message });
            }
        }

        [HttpGet("api-keys/{id}/usage-stats")]
        public async Task<ActionResult<List<ApiUsageDto>>> GetApiKeyUsageStats(int id)
        {
            try
            {
                var usageStats = await _context.ApiUsages
                    .Where(au => au.ApiKeyId == id)
                    .OrderByDescending(au => au.Date)
                    .Take(30) // Last 30 days
                    .Select(au => new ApiUsageDto
                    {
                        Id = au.Id,
                        Date = au.Date,
                        Calls = au.Calls,
                        Errors = au.Errors,
                        AvgResponseTime = au.AvgResponseTime,
                        PeakHour = au.PeakHour
                    })
                    .ToListAsync();

                return Ok(usageStats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "API kullanım istatistikleri alınırken hata oluştu", error = ex.Message });
            }
        }

        private string GenerateApiKey()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            var key = new string(Enumerable.Repeat(chars, 32).Select(s => s[random.Next(s.Length)]).ToArray());
            return $"sk_live_{key}";
        }

        #endregion

        #region Helper Methods

        private decimal GetMonthlyFee(SubscriptionType subscription)
        {
            return subscription switch
            {
                SubscriptionType.Basic => 99.99m,
                SubscriptionType.Standard => 199.99m,
                SubscriptionType.Premium => 299.99m,
                _ => 99.99m
            };
        }

        private int CalculateSystemHealth()
        {
            // Simulate system health calculation
            return new Random().Next(85, 100);
        }

        private int CalculateSecurityScore()
        {
            // Simulate security score calculation
            return new Random().Next(70, 95);
        }

        private int GetRandomUsage(int min, int max)
        {
            return new Random().Next(min, max);
        }

        private async Task LogSystemAction(string message, string details, string category)
        {
            var log = new SystemLog
            {
                Level = "Info",
                Category = category,
                Message = message,
                Details = details,
                Timestamp = DateTime.UtcNow
            };

            _context.SystemLogs.Add(log);
            await _context.SaveChangesAsync();
        }

        // System Resource Methods
        private double GetCpuUsage()
        {
            try
            {
                var process = Process.GetCurrentProcess();
                var startTime = DateTime.Now;
                var startCpuUsage = process.TotalProcessorTime;
                
                Thread.Sleep(100); // Kısa bir bekleme
                
                var endTime = DateTime.Now;
                var endCpuUsage = process.TotalProcessorTime;
                
                var cpuUsedMs = (endCpuUsage - startCpuUsage).TotalMilliseconds;
                var totalMsPassed = (endTime - startTime).TotalMilliseconds;
                
                return (cpuUsedMs / totalMsPassed) * 100;
            }
            catch
            {
                return new Random().Next(50, 80);
            }
        }

        private int GetDiskUsage()
        {
            try
            {
                var drive = new DriveInfo(Path.GetPathRoot(Environment.SystemDirectory));
                var usagePercentage = (int)((double)(drive.TotalSize - drive.AvailableFreeSpace) / drive.TotalSize * 100);
                return usagePercentage;
            }
            catch
            {
                return new Random().Next(50, 80);
            }
        }

        private int GetNetworkUsage()
        {
            try
            {
                // Basit network kullanım simülasyonu
                return new Random().Next(30, 70);
            }
            catch
            {
                return new Random().Next(30, 70);
            }
        }

        private int GetDatabaseConnections()
        {
            try
            {
                // Database bağlantı sayısı simülasyonu
                return new Random().Next(10, 50);
            }
            catch
            {
                return new Random().Next(10, 50);
            }
        }

        private int GetActiveSessions()
        {
            try
            {
                // Aktif session sayısı simülasyonu
                return new Random().Next(5, 30);
            }
            catch
            {
                return new Random().Next(5, 30);
            }
        }

        #endregion

        #region Subscription Plans

        [HttpGet("subscription-plans")]
        public async Task<ActionResult<List<SubscriptionPlanDto>>> GetSubscriptionPlans()
        {
            try
            {
                var plans = await _context.SubscriptionPlans
                    .Where(p => p.IsActive)
                    .OrderBy(p => p.SortOrder)
                    .ToListAsync();

                var planDtos = plans.Select(p => new SubscriptionPlanDto
                {
                    Type = p.Type,
                    Name = p.Name,
                    Description = p.Description,
                    MonthlyFee = p.MonthlyFee,
                    Features = System.Text.Json.JsonSerializer.Deserialize<List<string>>(p.Features) ?? new List<string>(),
                    Limits = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, int>>(p.Limits) ?? new Dictionary<string, int>()
                }).ToList();

                return Ok(planDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Abonelik planları alınırken hata oluştu", error = ex.Message });
            }
        }

        [HttpPut("subscription-plans/{type}")]
        public async Task<ActionResult<SubscriptionPlanDto>> UpdateSubscriptionPlan(string type, [FromBody] UpdateSubscriptionPlanDto dto)
        {
            try
            {
                var plan = await _context.SubscriptionPlans
                    .FirstOrDefaultAsync(p => p.Type == type && p.IsActive);

                if (plan == null)
                {
                    return NotFound(new { message = "Abonelik planı bulunamadı" });
                }

                // Plan bilgilerini güncelle
                plan.Name = dto.Name;
                plan.Description = dto.Description;
                plan.MonthlyFee = dto.MonthlyFee;
                plan.Currency = dto.Currency;
                plan.Features = System.Text.Json.JsonSerializer.Serialize(dto.Features ?? new List<string>());
                plan.Limits = System.Text.Json.JsonSerializer.Serialize(dto.Limits ?? new Dictionary<string, int>());
                plan.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Güncellenmiş planı DTO olarak döndür
                var updatedPlanDto = new SubscriptionPlanDto
                {
                    Type = plan.Type,
                    Name = plan.Name,
                    Description = plan.Description,
                    MonthlyFee = plan.MonthlyFee,
                    Features = System.Text.Json.JsonSerializer.Deserialize<List<string>>(plan.Features) ?? new List<string>(),
                    Limits = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, int>>(plan.Limits) ?? new Dictionary<string, int>()
                };

                return Ok(updatedPlanDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Abonelik planı güncellenirken hata oluştu", error = ex.Message });
            }
        }

        #endregion

        #region Currencies

        [HttpGet("currencies")]
        public ActionResult<List<CurrencyDto>> GetCurrencies()
        {
            try
            {
                var currencies = new List<CurrencyDto>
                {
                    new CurrencyDto { Code = "TRY", Name = "Türk Lirası", Symbol = "₺", IsDefault = true },
                    new CurrencyDto { Code = "USD", Name = "Amerikan Doları", Symbol = "$", IsDefault = false },
                    new CurrencyDto { Code = "EUR", Name = "Euro", Symbol = "€", IsDefault = false },
                    new CurrencyDto { Code = "GBP", Name = "İngiliz Sterlini", Symbol = "£", IsDefault = false },
                    new CurrencyDto { Code = "JPY", Name = "Japon Yeni", Symbol = "¥", IsDefault = false },
                    new CurrencyDto { Code = "CNY", Name = "Çin Yuanı", Symbol = "¥", IsDefault = false },
                    new CurrencyDto { Code = "RUB", Name = "Rus Rublesi", Symbol = "₽", IsDefault = false },
                    new CurrencyDto { Code = "INR", Name = "Hint Rupisi", Symbol = "₹", IsDefault = false }
                };

                return Ok(currencies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Para birimleri alınırken hata oluştu", error = ex.Message });
            }
        }

        #endregion

        #region Tenant Status Management

        [HttpPost("tenants/{id}/toggle-status")]
        public async Task<ActionResult> ToggleTenantStatus(int id)
        {
            try
            {
                var tenant = await _context.Tenants.FindAsync(id);
                if (tenant == null)
                {
                    return NotFound(new { message = "Tenant bulunamadı" });
                }

                // Durumu değiştir
                tenant.Status = tenant.Status == TenantStatus.Active ? TenantStatus.Suspended : TenantStatus.Active;
                tenant.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Sistem logu oluştur
                await LogSystemAction(
                    $"Tenant durumu değiştirildi: {tenant.CompanyName}",
                    $"Tenant ID: {id}, Yeni Durum: {tenant.Status}",
                    "Tenant Management"
                );

                return Ok(new { 
                    message = $"Tenant durumu başarıyla {(tenant.Status == TenantStatus.Active ? "aktif" : "askıya alınmış")} olarak güncellendi",
                    status = tenant.Status.ToString()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Tenant durumu güncellenirken hata oluştu", error = ex.Message });
            }
        }

        [HttpPost("tenants/{id}/suspend")]
        public async Task<ActionResult> SuspendTenant(int id, [FromBody] SuspendTenantDto dto)
        {
            try
            {
                var tenant = await _context.Tenants.FindAsync(id);
                if (tenant == null)
                {
                    return NotFound(new { message = "Tenant bulunamadı" });
                }

                // Tenant'ı askıya al
                tenant.Status = TenantStatus.Suspended;
                tenant.SuspensionReason = dto.Reason;
                tenant.SuspendedAt = DateTime.UtcNow;
                tenant.UpdatedAt = DateTime.UtcNow;

                // Tüm kullanıcıları da pasif yap
                var users = await _context.Users.Where(u => u.TenantId == id).ToListAsync();
                foreach (var user in users)
                {
                    user.IsActive = false;
                }

                // API anahtarlarını da pasif yap
                var apiKeys = await _context.ApiKeys.Where(ak => ak.TenantId == id).ToListAsync();
                foreach (var apiKey in apiKeys)
                {
                    apiKey.IsActive = false;
                }

                await _context.SaveChangesAsync();

                // Sistem logu oluştur
                await LogSystemAction(
                    $"Tenant askıya alındı: {tenant.CompanyName}",
                    $"Tenant ID: {id}, Sebep: {dto.Reason}",
                    "Tenant Management"
                );

                return Ok(new { 
                    message = "Tenant başarıyla askıya alındı",
                    suspendedUsers = users.Count,
                    suspendedApiKeys = apiKeys.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Tenant askıya alınırken hata oluştu", error = ex.Message });
            }
        }

        [HttpPost("tenants/{id}/activate")]
        public async Task<ActionResult> ActivateTenant(int id)
        {
            try
            {
                var tenant = await _context.Tenants.FindAsync(id);
                if (tenant == null)
                {
                    return NotFound(new { message = "Tenant bulunamadı" });
                }

                // Ödeme durumunu kontrol et
                if (tenant.PaymentStatus == PaymentStatus.Overdue)
                {
                    return BadRequest(new { message = "Ödeme gecikmiş. Tenant'ı aktifleştirmek için önce ödeme yapılmalı." });
                }

                // Tenant'ı aktifleştir
                tenant.Status = TenantStatus.Active;
                tenant.SuspensionReason = null;
                tenant.SuspendedAt = null;
                tenant.UpdatedAt = DateTime.UtcNow;

                // Kullanıcıları da aktifleştir (admin hariç)
                var users = await _context.Users.Where(u => u.TenantId == id && u.Role != UserRole.Admin).ToListAsync();
                foreach (var user in users)
                {
                    user.IsActive = true;
                }

                // API anahtarlarını da aktifleştir
                var apiKeys = await _context.ApiKeys.Where(ak => ak.TenantId == id).ToListAsync();
                foreach (var apiKey in apiKeys)
                {
                    apiKey.IsActive = true;
                }

                await _context.SaveChangesAsync();

                // Sistem logu oluştur
                await LogSystemAction(
                    $"Tenant aktifleştirildi: {tenant.CompanyName}",
                    $"Tenant ID: {id}",
                    "Tenant Management"
                );

                return Ok(new { 
                    message = "Tenant başarıyla aktifleştirildi",
                    activatedUsers = users.Count,
                    activatedApiKeys = apiKeys.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Tenant aktifleştirilirken hata oluştu", error = ex.Message });
            }
        }

        [HttpGet("tenants/{id}/status-check")]
        public async Task<ActionResult<TenantStatusCheckDto>> CheckTenantStatus(int id)
        {
            try
            {
                var tenant = await _context.Tenants
                    .Include(t => t.Users)
                    .Include(t => t.ApiKeys)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (tenant == null)
                {
                    return NotFound(new { message = "Tenant bulunamadı" });
                }

                var statusCheck = new TenantStatusCheckDto
                {
                    TenantId = tenant.Id,
                    CompanyName = tenant.CompanyName,
                    Status = tenant.Status.ToString(),
                    PaymentStatus = tenant.PaymentStatus.ToString(),
                    SubscriptionEndDate = tenant.SubscriptionEndDate,
                    SuspensionReason = tenant.SuspensionReason,
                    SuspendedAt = tenant.SuspendedAt,
                    ActiveUsers = tenant.Users.Count(u => u.IsActive),
                    TotalUsers = tenant.Users.Count,
                    ActiveApiKeys = tenant.ApiKeys.Count(ak => ak.IsActive),
                    TotalApiKeys = tenant.ApiKeys.Count,
                    CanActivate = tenant.Status == TenantStatus.Suspended && tenant.PaymentStatus != PaymentStatus.Overdue,
                    CanSuspend = tenant.Status == TenantStatus.Active,
                    LastLogin = tenant.LastLogin,
                    CreatedAt = tenant.CreatedAt
                };

                return Ok(statusCheck);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Tenant durumu kontrol edilirken hata oluştu", error = ex.Message });
            }
        }

        #endregion

        #region Tenant Access

        [HttpPost("tenants/{id}/access")]
        public async Task<ActionResult<TenantAccessDto>> AccessTenant(int id)
        {
            try
            {
                var tenant = await _context.Tenants.FindAsync(id);
                if (tenant == null)
                {
                    return NotFound(new { message = "Tenant bulunamadı" });
                }

                // Tenant aktif mi kontrol et
                if (tenant.Status != TenantStatus.Active)
                {
                    return BadRequest(new { message = "Tenant aktif değil. Erişim sağlanamıyor." });
                }

                // Ödeme durumunu kontrol et
                if (tenant.PaymentStatus == PaymentStatus.Overdue)
                {
                    return BadRequest(new { message = "Ödeme gecikmiş. Erişim sağlanamıyor." });
                }

                // Abonelik süresi dolmuş mu kontrol et
                if (tenant.SubscriptionEndDate.HasValue && tenant.SubscriptionEndDate.Value < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Abonelik süresi dolmuş. Erişim sağlanamıyor." });
                }

                // Erişim token'ı oluştur
                var accessToken = Guid.NewGuid().ToString();
                var expiresAt = DateTime.UtcNow.AddHours(24);

                // Sistem logu oluştur
                await LogSystemAction(
                    $"Tenant erişimi sağlandı: {tenant.CompanyName}",
                    $"Tenant ID: {id}, Token: {accessToken.Substring(0, 8)}...",
                    "Tenant Access"
                );

                return Ok(new TenantAccessDto
                {
                    TenantId = id,
                    AccessUrl = $"http://localhost:3000/tenant/{id}",
                    AccessToken = accessToken,
                    ExpiresAt = expiresAt,
                    TenantStatus = tenant.Status.ToString(),
                    PaymentStatus = tenant.PaymentStatus.ToString()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Tenant erişimi sağlanırken hata oluştu", error = ex.Message });
            }
        }

        #endregion
    }
} 