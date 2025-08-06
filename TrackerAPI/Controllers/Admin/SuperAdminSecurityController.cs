using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.Models.Security;
using ElectricityTrackerAPI.Models.Core;
using ElectricityTrackerAPI.Models.Admin;
using ElectricityTrackerAPI.DTOs.Admin;
using ElectricityTrackerAPI.DTOs.Security;
using System.Text.Json;

namespace ElectricityTrackerAPI.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/security")]
    [Authorize(Roles = "SuperAdmin")]
    public class SuperAdminSecurityController : Common.BaseController
    {
        public SuperAdminSecurityController(ApplicationDbContext context, ILogger<SuperAdminSecurityController> logger) 
            : base(context, logger)
        {
        }

        [HttpGet("test")]
        public ActionResult TestSecurityAPI()
        {
            return Ok(new { message = "Security API is working", timestamp = DateTime.UtcNow });
        }

        [HttpGet("debug-alerts")]
        public async Task<ActionResult> DebugSecurityAlerts()
        {
            try
            {
                var totalAlerts = await _context.SecurityAlerts.CountAsync();
                var alertsWithTenant = await _context.SecurityAlerts.Where(sa => sa.Tenant != null).CountAsync();
                var alertsWithoutTenant = await _context.SecurityAlerts.Where(sa => sa.Tenant == null).CountAsync();
                
                var sampleAlerts = await _context.SecurityAlerts
                    .Take(5)
                    .Select(sa => new { 
                        sa.Id, 
                        sa.Title, 
                        sa.Type, 
                        sa.Severity, 
                        sa.TenantId, 
                        TenantName = sa.Tenant != null ? sa.Tenant.CompanyName : "NULL",
                        sa.Timestamp 
                    })
                    .ToListAsync();

                return Ok(new { 
                    totalAlerts,
                    alertsWithTenant,
                    alertsWithoutTenant,
                    sampleAlerts
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Debug failed", details = ex.Message });
            }
        }

        [HttpGet("create-test-alerts")]
        public async Task<ActionResult> CreateTestSecurityAlerts()
        {
            try
            {
                var random = new Random();
                var tenants = await _context.Tenants.Take(2).ToListAsync();
                var users = await _context.Users.Take(5).ToListAsync();

                if (!tenants.Any() || !users.Any())
                {
                    return BadRequest(new { error = "Tenant veya User bulunamadı" });
                }

                var alertTypes = new[] { "brute_force", "suspicious_login", "failed_2fa", "data_breach_attempt", "unusual_activity" };
                var severities = new[] { "low", "medium", "high", "critical" };
                var statuses = new[] { "active", "investigating", "resolved" };

                var securityAlerts = new List<SecurityAlert>();

                for (int i = 0; i < 10; i++)
                {
                    var tenant = tenants[random.Next(tenants.Count)];
                    var user = users[random.Next(users.Count)];
                    var alertType = alertTypes[random.Next(alertTypes.Length)];
                    var severity = severities[random.Next(severities.Length)];
                    var status = statuses[random.Next(statuses.Length)];
                    var resolved = status == "resolved";

                    var alert = new SecurityAlert
                    {
                        Type = alertType,
                        Severity = severity,
                        Title = GetSecurityAlertTitle(alertType),
                        Description = GetSecurityAlertDescription(alertType, user),
                        TenantId = tenant.Id,
                        UserId = user.Id,
                        Status = status,
                        Resolved = resolved,
                        Timestamp = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                        ResolvedAt = resolved ? DateTime.UtcNow.AddDays(-random.Next(1, 10)) : null,
                        ResolvedBy = resolved ? "admin" : null,
                        IpAddress = GetRandomIp(),
                        UserAgent = GetRandomUserAgent(),
                        Location = GetRandomLocation(),
                        Details = GetSecurityAlertDetails(alertType)
                    };

                    securityAlerts.Add(alert);
                }

                _context.SecurityAlerts.AddRange(securityAlerts);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Test security alerts created successfully", 
                    count = securityAlerts.Count,
                    alerts = securityAlerts.Select(a => new { a.Id, a.Title, a.Type, a.Severity })
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Test security alerts creation failed");
                return StatusCode(500, new { error = "Test security alerts creation failed", details = ex.Message });
            }
        }

        private string GetRandomIp()
        {
            var random = new Random();
            return $"{random.Next(1, 255)}.{random.Next(0, 255)}.{random.Next(0, 255)}.{random.Next(0, 255)}";
        }

        private string GetRandomUserAgent()
        {
            var userAgents = new[]
            {
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
                "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15"
            };
            return userAgents[new Random().Next(userAgents.Length)];
        }

        private string GetRandomLocation()
        {
            var locations = new[]
            {
                "İstanbul, Türkiye",
                "Ankara, Türkiye",
                "İzmir, Türkiye",
                "Bursa, Türkiye",
                "Antalya, Türkiye",
                "New York, USA",
                "London, UK",
                "Berlin, Germany",
                "Paris, France",
                "Tokyo, Japan"
            };
            return locations[new Random().Next(locations.Length)];
        }

        private string GetSecurityAlertTitle(string alertType)
        {
            return alertType switch
            {
                "brute_force" => "Brute Force Saldırısı Tespit Edildi",
                "suspicious_login" => "Şüpheli Giriş Tespit Edildi",
                "failed_2fa" => "2FA Doğrulama Başarısız",
                "data_breach_attempt" => "Veri Sızıntısı Girişimi Tespit Edildi",
                "unusual_activity" => "Olağandışı Aktivite Tespit Edildi",
                _ => "Güvenlik Alarmı"
            };
        }

        private string GetSecurityAlertDescription(string alertType, User user)
        {
            return alertType switch
            {
                "brute_force" => $"{user?.FirstName} {user?.LastName} hesabına brute force saldırısı tespit edildi",
                "suspicious_login" => $"{user?.FirstName} {user?.LastName} hesabından şüpheli giriş tespit edildi",
                "failed_2fa" => $"{user?.FirstName} {user?.LastName} hesabı için 2FA doğrulama başarısız oldu",
                "data_breach_attempt" => $"{user?.FirstName} {user?.LastName} hesabından veri sızıntısı girişimi tespit edildi",
                "unusual_activity" => $"{user?.FirstName} {user?.LastName} hesabında olağandışı aktivite tespit edildi",
                _ => "Güvenlik alarmı tespit edildi"
            };
        }

        private string GetSecurityAlertDetails(string alertType)
        {
            var random = new Random();
            var details = new Dictionary<string, object>
            {
                ["attemptCount"] = random.Next(5, 50),
                ["deviceType"] = random.Next(3) switch { 0 => "Desktop", 1 => "Mobile", _ => "Tablet" },
                ["browser"] = random.Next(4) switch { 0 => "Chrome", 1 => "Firefox", 2 => "Safari", _ => "Edge" },
                ["os"] = random.Next(4) switch { 0 => "Windows", 1 => "macOS", 2 => "Linux", _ => "iOS" }
            };

            return System.Text.Json.JsonSerializer.Serialize(details);
        }

        [HttpGet("alerts")]
        public async Task<ActionResult<PagedResult<SecurityAlertDto>>> GetSecurityAlerts(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] int? tenantId = null,
            [FromQuery] string? type = null,
            [FromQuery] string? severity = null,
            [FromQuery] string? status = null)
        {
            try
            {
                var query = _context.SecurityAlerts
                    .Include(sa => sa.Tenant)
                    .Include(sa => sa.User)
                    .AsQueryable();

                if (tenantId.HasValue)
                    query = query.Where(sa => sa.TenantId == tenantId);

                if (!string.IsNullOrEmpty(type))
                    query = query.Where(sa => sa.Type == type);

                if (!string.IsNullOrEmpty(severity))
                    query = query.Where(sa => sa.Severity == severity);

                if (!string.IsNullOrEmpty(status))
                    query = query.Where(sa => sa.Status == status);

                var totalCount = await query.CountAsync();
                var items = await query
                    .OrderByDescending(sa => sa.Timestamp)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(sa => new SecurityAlertDto
                    {
                        Id = sa.Id,
                        Type = sa.Type,
                        Severity = sa.Severity,
                        Title = sa.Title,
                        Description = sa.Description,
                        TenantId = sa.TenantId,
                        TenantName = sa.Tenant != null ? sa.Tenant.CompanyName : null,
                        UserId = sa.UserId,
                        UserName = sa.User != null ? $"{sa.User.FirstName} {sa.User.LastName}" : null,
                        Status = sa.Status,
                        Resolved = sa.Resolved,
                        Timestamp = sa.Timestamp,
                        ResolvedAt = sa.ResolvedAt,
                        ResolvedBy = sa.ResolvedBy,
                        IpAddress = sa.IpAddress,
                        UserAgent = sa.UserAgent,
                        Location = sa.Location,
                        Details = sa.Details
                    })
                    .ToListAsync();

                return Ok(new PagedResult<SecurityAlertDto>
                {
                    Items = items,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Security alerts retrieval failed");
                return StatusCode(500, new { error = "Security alerts retrieval failed", details = ex.Message });
            }
        }

        [HttpGet("alerts/{id}")]
        public async Task<ActionResult<SecurityAlertDetailsDto>> GetSecurityAlertDetails(int id)
        {
            try
            {
                _logger.LogInformation($"Getting security alert details for alert {id}");
                
                var alert = await _context.SecurityAlerts
                    .Include(sa => sa.Tenant)
                    .Include(sa => sa.User)
                    .FirstOrDefaultAsync(sa => sa.Id == id);

                if (alert == null)
                {
                    _logger.LogWarning($"Security alert {id} not found");
                    return NotFound(new { error = "Security alert not found" });
                }

                _logger.LogInformation($"Security alert found: {alert.Title}");

                var details = !string.IsNullOrEmpty(alert.Details) 
                    ? JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(alert.Details) 
                    : new Dictionary<string, JsonElement>();

                _logger.LogInformation($"Alert details parsed successfully");

                var alertDetails = new SecurityAlertDetailsDto
                {
                    Id = alert.Id,
                    Type = alert.Type,
                    Title = alert.Title,
                    Description = alert.Description,
                    Severity = alert.Severity,
                    Category = GetAlertCategory(alert.Type),
                    Impact = GetAlertImpact(alert.Type),
                    Resolution = GetAlertResolution(alert.Type),
                    Actions = GetAlertActions(alert.Type),
                    Details = new SecurityAlertDetailsInfoDto
                    {
                        AttemptCount = details.ContainsKey("attemptCount") ? details["attemptCount"].GetInt32() : 0,
                        IpAddress = alert.IpAddress,
                        Location = alert.Location,
                        DeviceType = details.ContainsKey("deviceType") ? details["deviceType"].GetString() ?? "Unknown" : "Unknown",
                        Browser = details.ContainsKey("browser") ? details["browser"].GetString() ?? "Unknown" : "Unknown",
                        Os = details.ContainsKey("os") ? details["os"].GetString() ?? "Unknown" : "Unknown"
                    },
                    Timeline = GetAlertTimeline(alert)
                };

                _logger.LogInformation($"Security alert details generated successfully for alert {id}");
                return Ok(alertDetails);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Security alert details retrieval failed for alert {AlertId}", id);
                return StatusCode(500, new { error = "Security alert details retrieval failed", details = ex.Message });
            }
        }

        [HttpPost("alerts/{id}/resolve")]
        public async Task<ActionResult> ResolveSecurityAlert(int id)
        {
            try
            {
                var alert = await _context.SecurityAlerts.FindAsync(id);
                if (alert == null)
                    return NotFound(new { error = "Security alert not found" });

                alert.Resolved = true;
                alert.Status = "resolved";
                alert.ResolvedAt = DateTime.UtcNow;
                alert.ResolvedBy = "admin"; // TODO: Get from current user

                await _context.SaveChangesAsync();

                return Ok(new { message = "Security alert resolved successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Security alert resolution failed");
                return StatusCode(500, new { error = "Security alert resolution failed", details = ex.Message });
            }
        }

        [HttpDelete("alerts/{id}")]
        public async Task<ActionResult> DeleteSecurityAlert(int id)
        {
            try
            {
                var alert = await _context.SecurityAlerts.FindAsync(id);
                if (alert == null)
                    return NotFound(new { error = "Security alert not found" });

                _context.SecurityAlerts.Remove(alert);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Security alert deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Security alert deletion failed");
                return StatusCode(500, new { error = "Security alert deletion failed", details = ex.Message });
            }
        }

        [HttpGet("tenants/{id}/report")]
        public async Task<ActionResult<TenantSecurityReportDto>> GetTenantSecurityReport(int id)
        {
            try
            {
                _logger.LogInformation($"Getting security report for tenant {id}");
                
                var tenant = await _context.Tenants.FindAsync(id);
                if (tenant == null)
                {
                    _logger.LogWarning($"Tenant {id} not found");
                    return NotFound(new { error = "Tenant not found" });
                }

                _logger.LogInformation($"Tenant found: {tenant.CompanyName}");

                var securityScore = await _context.TenantSecurityScores
                    .FirstOrDefaultAsync(tss => tss.TenantId == id);

                _logger.LogInformation($"Security score retrieved: {securityScore?.SecurityScore ?? 75}");

                var totalUsers = await _context.Users.CountAsync(u => u.TenantId == id);
                var activeUsers = await _context.Users.CountAsync(u => u.TenantId == id && u.IsActive);
                var lockedUsers = await _context.Users.CountAsync(u => u.TenantId == id && u.IsLocked);
                
                _logger.LogInformation($"User counts - Total: {totalUsers}, Active: {activeUsers}, Locked: {lockedUsers}");

                var apiKeys = await _context.ApiKeys.CountAsync(ak => ak.TenantId == id);
                var activeApiKeys = await _context.ApiKeys.CountAsync(ak => ak.TenantId == id && ak.Status == ApiKeyStatus.Active);
                
                _logger.LogInformation($"API key counts - Total: {apiKeys}, Active: {activeApiKeys}");

                var activeAlerts = await _context.SecurityAlerts
                    .CountAsync(sa => sa.TenantId == id && !sa.Resolved);

                var blockedIPs = await _context.BlockedIPs
                    .CountAsync(bip => bip.TenantId == id && bip.IsActive);

                _logger.LogInformation($"Security counts - Active Alerts: {activeAlerts}, Blocked IPs: {blockedIPs}");

                var securityIssues = await GetSecurityIssues(id);
                var recommendations = GetSecurityRecommendations(securityScore?.SecurityScore ?? 75, totalUsers, lockedUsers, activeAlerts);

                var report = new TenantSecurityReportDto
                {
                    TenantId = id,
                    TenantName = tenant.CompanyName,
                    GeneratedAt = DateTime.UtcNow,
                    SecurityScore = securityScore?.SecurityScore ?? 75,
                    RiskLevel = GetRiskLevel(securityScore?.SecurityScore ?? 75),
                    Summary = new TenantSecuritySummaryDto
                    {
                        TotalUsers = totalUsers,
                        ActiveUsers = activeUsers,
                        LockedUsers = lockedUsers,
                        ApiKeys = apiKeys,
                        ActiveApiKeys = activeApiKeys,
                        ActiveAlerts = activeAlerts,
                        BlockedIPs = blockedIPs
                    },
                    SecurityIssues = securityIssues,
                    Recommendations = recommendations
                };

                _logger.LogInformation($"Security report generated successfully for tenant {id}");
                return Ok(report);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Tenant security report retrieval failed for tenant {TenantId}", id);
                return StatusCode(500, new { error = "Tenant security report retrieval failed", details = ex.Message });
            }
        }

        [HttpGet("users/{id}/history")]
        public async Task<ActionResult<UserSecurityHistoryDto>> GetUserSecurityHistory(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Tenant)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                    return NotFound(new { error = "User not found" });

                var securityAlerts = await _context.SecurityAlerts
                    .Where(sa => sa.UserId == id)
                    .OrderByDescending(sa => sa.Timestamp)
                    .Take(10)
                    .ToListAsync();

                var totalLogins = await _context.SystemLogs
                    .CountAsync(sl => sl.UserId == id && sl.Category == "User" && sl.Message.Contains("login"));

                var failedLogins = await _context.SystemLogs
                    .CountAsync(sl => sl.UserId == id && sl.Category == "User" && sl.Message.Contains("failed login"));

                var passwordChanges = await _context.SystemLogs
                    .CountAsync(sl => sl.UserId == id && sl.Category == "User" && sl.Message.Contains("password"));

                var history = new UserSecurityHistoryDto
                {
                    UserId = id,
                    UserName = $"{user.FirstName} {user.LastName}",
                    TenantName = user.Tenant?.CompanyName,
                    AccountStatus = user.IsActive ? (user.IsLocked ? "Locked" : "Active") : "Inactive",
                    SecurityStats = new UserSecurityStatsDto
                    {
                        TotalLogins = totalLogins,
                        FailedLogins = failedLogins,
                        PasswordChanges = passwordChanges,
                        SecurityAlerts = securityAlerts.Count
                    },
                    SecurityEvents = securityAlerts.Select(sa => new SecurityEventDto
                    {
                        Timestamp = sa.Timestamp,
                        Type = sa.Type,
                        Severity = sa.Severity,
                        Description = sa.Description,
                        IpAddress = sa.IpAddress,
                        Resolved = sa.Resolved
                    }).ToList()
                };

                return Ok(history);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "User security history retrieval failed");
                return StatusCode(500, new { error = "User security history retrieval failed", details = ex.Message });
            }
        }

        [HttpGet("blocked-ips")]
        public async Task<ActionResult<PagedResult<BlockedIPDto>>> GetBlockedIPs(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] int? tenantId = null)
        {
            try
            {
                var query = _context.BlockedIPs
                    .Include(bip => bip.Tenant)
                    .Where(bip => bip.Tenant != null) // Only include blocked IPs for existing tenants
                    .AsQueryable();

                if (tenantId.HasValue)
                    query = query.Where(bip => bip.TenantId == tenantId);

                var totalCount = await query.CountAsync();
                var items = await query
                    .OrderByDescending(bip => bip.BlockedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(bip => new BlockedIPDto
                    {
                        Id = bip.Id,
                        IpAddress = bip.IpAddress,
                        TenantId = bip.TenantId,
                        TenantName = bip.Tenant != null ? bip.Tenant.CompanyName : null,
                        Reason = bip.Reason,
                        BlockedAt = bip.BlockedAt,
                        ExpiresAt = bip.ExpiresAt,
                        IsActive = bip.IsActive,
                        BlockedBy = bip.BlockedBy,
                        AttemptCount = bip.AttemptCount
                    })
                    .ToListAsync();

                return Ok(new PagedResult<BlockedIPDto>
                {
                    Items = items,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Blocked IPs retrieval failed");
                return StatusCode(500, new { error = "Blocked IPs retrieval failed", details = ex.Message });
            }
        }

        [HttpPost("blocked-ips/{id}/unblock")]
        public async Task<ActionResult> UnblockIP(int id)
        {
            try
            {
                var blockedIP = await _context.BlockedIPs.FindAsync(id);
                if (blockedIP == null)
                    return NotFound(new { error = "Blocked IP not found" });

                blockedIP.IsActive = false;
                await _context.SaveChangesAsync();

                return Ok(new { message = "IP unblocked successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "IP unblock failed");
                return StatusCode(500, new { error = "IP unblock failed", details = ex.Message });
            }
        }

        [HttpGet("tenant-scores")]
        public async Task<ActionResult<List<TenantSecurityScoreDto>>> GetTenantSecurityScores()
        {
            try
            {
                var scores = await _context.TenantSecurityScores
                    .Include(tss => tss.Tenant)
                    .Where(tss => tss.Tenant != null) // Only include scores for existing tenants
                    .OrderByDescending(tss => tss.SecurityScore)
                    .Select(tss => new TenantSecurityScoreDto
                    {
                        Id = tss.Id,
                        TenantId = tss.TenantId,
                        TenantName = tss.Tenant.CompanyName,
                        SecurityScore = tss.SecurityScore,
                        TwoFactorEnabled = tss.TwoFactorEnabled,
                        PasswordPolicy = tss.PasswordPolicy,
                        LastSecurityAudit = tss.LastSecurityAudit,
                        ActiveThreats = tss.ActiveThreats,
                        BlockedIPs = tss.BlockedIPs,
                        SecurityRecommendations = tss.SecurityRecommendations
                    })
                    .ToListAsync();

                return Ok(scores);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Tenant security scores retrieval failed");
                return StatusCode(500, new { error = "Tenant security scores retrieval failed", details = ex.Message });
            }
        }

        // Helper methods
        private string GetAlertCategory(string type)
        {
            return type switch
            {
                "brute_force" => "Authentication",
                "suspicious_login" => "Authentication",
                "failed_2fa" => "Two-Factor Authentication",
                "data_breach_attempt" => "Data Security",
                "unusual_activity" => "User Behavior",
                _ => "General"
            };
        }

        private string GetAlertImpact(string type)
        {
            return type switch
            {
                "brute_force" => "Account Security",
                "suspicious_login" => "Account Security",
                "failed_2fa" => "Two-Factor Security",
                "data_breach_attempt" => "Data Protection",
                "unusual_activity" => "User Security",
                _ => "System Security"
            };
        }

        private string GetAlertResolution(string type)
        {
            return type switch
            {
                "brute_force" => "IP adresini engelleyin ve kullanıcı hesabını kontrol edin",
                "suspicious_login" => "Kullanıcı hesabını kontrol edin ve gerekirse şifre sıfırlayın",
                "failed_2fa" => "2FA ayarlarını kontrol edin ve gerekirse yeniden yapılandırın",
                "data_breach_attempt" => "Veri erişim loglarını inceleyin ve güvenlik önlemlerini artırın",
                "unusual_activity" => "Kullanıcı aktivitelerini inceleyin ve gerekirse hesabı kilitleyin",
                _ => "Genel güvenlik incelemesi yapın"
            };
        }

        private List<string> GetAlertActions(string type)
        {
            return type switch
            {
                "brute_force" => new List<string>
                {
                    "IP adresini engelleyin",
                    "Kullanıcı hesabını kontrol edin",
                    "Şifre sıfırlama işlemi başlatın",
                    "Güvenlik loglarını inceleyin"
                },
                "suspicious_login" => new List<string>
                {
                    "Kullanıcı hesabını kontrol edin",
                    "Şifre sıfırlama işlemi başlatın",
                    "Konum bilgilerini inceleyin",
                    "Cihaz bilgilerini kontrol edin"
                },
                "failed_2fa" => new List<string>
                {
                    "2FA ayarlarını kontrol edin",
                    "Kullanıcı ile iletişime geçin",
                    "2FA cihazını yeniden yapılandırın",
                    "Geçici olarak 2FA'yı devre dışı bırakın"
                },
                "data_breach_attempt" => new List<string>
                {
                    "Veri erişim loglarını inceleyin",
                    "Güvenlik önlemlerini artırın",
                    "IP adresini engelleyin",
                    "Veri sızıntısı raporu oluşturun"
                },
                "unusual_activity" => new List<string>
                {
                    "Kullanıcı aktivitelerini inceleyin",
                    "Hesabı geçici olarak kilitleyin",
                    "Kullanıcı ile iletişime geçin",
                    "Aktivite loglarını analiz edin"
                },
                _ => new List<string>
                {
                    "Güvenlik incelemesi yapın",
                    "Logları analiz edin",
                    "Gerekli önlemleri alın"
                }
            };
        }

        private List<SecurityTimelineDto> GetAlertTimeline(SecurityAlert alert)
        {
            var timeline = new List<SecurityTimelineDto>
            {
                new SecurityTimelineDto
                {
                    Time = alert.Timestamp,
                    Event = "Alarm oluşturuldu"
                }
            };

            if (alert.ResolvedAt.HasValue)
            {
                timeline.Add(new SecurityTimelineDto
                {
                    Time = alert.ResolvedAt.Value,
                    Event = $"Alarm çözüldü - {alert.ResolvedBy}"
                });
            }

            return timeline;
        }

        private string GetRiskLevel(int securityScore)
        {
            return securityScore switch
            {
                >= 90 => "Low",
                >= 70 => "Medium",
                >= 50 => "High",
                _ => "Critical"
            };
        }

        private async Task<List<SecurityIssueDto>> GetSecurityIssues(int tenantId)
        {
            var issues = new List<SecurityIssueDto>();

            var weakPasswords = await _context.Users
                .CountAsync(u => u.TenantId == tenantId && u.PasswordHash.Length < 60);
            if (weakPasswords > 0)
            {
                issues.Add(new SecurityIssueDto
                {
                    Type = "Weak Passwords",
                    Count = weakPasswords,
                    Severity = "Medium"
                });
            }

            var inactiveUsers = await _context.Users
                .CountAsync(u => u.TenantId == tenantId && !u.IsActive);
            if (inactiveUsers > 0)
            {
                issues.Add(new SecurityIssueDto
                {
                    Type = "Inactive Users",
                    Count = inactiveUsers,
                    Severity = "Low"
                });
            }

            var expiredApiKeys = await _context.ApiKeys
                .CountAsync(ak => ak.TenantId == tenantId && ak.Status == ApiKeyStatus.Inactive);
            if (expiredApiKeys > 0)
            {
                issues.Add(new SecurityIssueDto
                {
                    Type = "Expired API Keys",
                    Count = expiredApiKeys,
                    Severity = "Low"
                });
            }

            return issues;
        }

        private List<string> GetSecurityRecommendations(int securityScore, int totalUsers, int lockedUsers, int activeAlerts)
        {
            var recommendations = new List<string>();

            if (securityScore < 90)
                recommendations.Add("Güvenlik skorunu artırmak için güvenlik önlemlerini gözden geçirin");

            if (lockedUsers > 0)
                recommendations.Add("Kilitli kullanıcı hesaplarını kontrol edin");

            if (activeAlerts > 0)
                recommendations.Add("Aktif güvenlik alarmlarını inceleyin ve çözün");

            if (totalUsers > 10)
                recommendations.Add("İki faktörlü kimlik doğrulamayı etkinleştirin");

            recommendations.Add("Düzenli güvenlik denetimleri yapın");
            recommendations.Add("Kullanıcı şifrelerini güçlendirin");

            return recommendations;
        }

        // Tenant Security Settings Endpoints
        [HttpGet("tenants/{tenantId}/settings")]
        public async Task<ActionResult<TenantSecuritySettingsDto>> GetTenantSecuritySettings(int tenantId)
        {
            try
            {
                // First check if the tenant exists
                var tenant = await _context.Tenants.FindAsync(tenantId);
                if (tenant == null)
                {
                    return NotFound(new { error = "Tenant not found", tenantId = tenantId });
                }

                var settings = await _context.TenantSecuritySettings
                    .Include(ts => ts.Tenant)
                    .FirstOrDefaultAsync(ts => ts.TenantId == tenantId);

                if (settings == null)
                {
                    // Create default settings if none exist (only for existing tenants)
                    settings = new TenantSecuritySettings
                    {
                        TenantId = tenantId,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.TenantSecuritySettings.Add(settings);
                    await _context.SaveChangesAsync();
                }
                
                return Ok(new TenantSecuritySettingsDto
                {
                    Id = settings.Id,
                    TenantId = settings.TenantId,
                    TenantName = tenant?.CompanyName ?? "Unknown Tenant",
                    RequireTwoFactor = settings.RequireTwoFactor,
                    AllowSmsTwoFactor = settings.AllowSmsTwoFactor,
                    AllowEmailTwoFactor = settings.AllowEmailTwoFactor,
                    AllowAuthenticatorApp = settings.AllowAuthenticatorApp,
                    MinimumPasswordLength = settings.MinimumPasswordLength,
                    RequireUppercase = settings.RequireUppercase,
                    RequireLowercase = settings.RequireLowercase,
                    RequireNumbers = settings.RequireNumbers,
                    RequireSpecialCharacters = settings.RequireSpecialCharacters,
                    PasswordExpiryDays = settings.PasswordExpiryDays,
                    PreventPasswordReuse = settings.PreventPasswordReuse,
                    PasswordHistoryCount = settings.PasswordHistoryCount,
                    SessionTimeoutMinutes = settings.SessionTimeoutMinutes,
                    ForceLogoutOnPasswordChange = settings.ForceLogoutOnPasswordChange,
                    AllowConcurrentSessions = settings.AllowConcurrentSessions,
                    MaxConcurrentSessions = settings.MaxConcurrentSessions,
                    MaxFailedLoginAttempts = settings.MaxFailedLoginAttempts,
                    AccountLockoutDurationMinutes = settings.AccountLockoutDurationMinutes,
                    RequireCaptchaAfterFailedAttempts = settings.RequireCaptchaAfterFailedAttempts,
                    CaptchaThreshold = settings.CaptchaThreshold,
                    EnableIpWhitelist = settings.EnableIpWhitelist,
                    AllowedIpRanges = settings.AllowedIpRanges,
                    BlockSuspiciousIps = settings.BlockSuspiciousIps,
                    SuspiciousIpThreshold = settings.SuspiciousIpThreshold,
                    EnableSecurityAuditLog = settings.EnableSecurityAuditLog,
                    LogFailedLoginAttempts = settings.LogFailedLoginAttempts,
                    LogSuccessfulLogins = settings.LogSuccessfulLogins,
                    LogPasswordChanges = settings.LogPasswordChanges,
                    LogAdminActions = settings.LogAdminActions,
                    NotifyOnFailedLogin = settings.NotifyOnFailedLogin,
                    NotifyOnSuspiciousActivity = settings.NotifyOnSuspiciousActivity,
                    NotifyOnAccountLockout = settings.NotifyOnAccountLockout,
                    NotificationEmails = settings.NotificationEmails,
                    EnableBruteForceProtection = settings.EnableBruteForceProtection,
                    BruteForceThreshold = settings.BruteForceThreshold,
                    BruteForceWindowMinutes = settings.BruteForceWindowMinutes,
                    EnableGeolocationBlocking = settings.EnableGeolocationBlocking,
                    AllowedCountries = settings.AllowedCountries,
                    CreatedAt = settings.CreatedAt,
                    UpdatedAt = settings.UpdatedAt,
                    UpdatedBy = settings.UpdatedBy
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get tenant security settings for tenant {TenantId}", tenantId);
                return StatusCode(500, new { error = "Failed to get tenant security settings", details = ex.Message });
            }
        }

        [HttpPut("tenants/{tenantId}/settings")]
        public async Task<ActionResult> UpdateTenantSecuritySettings(int tenantId, [FromBody] UpdateTenantSecuritySettingsDto dto)
        {
            try
            {
                if (tenantId != dto.TenantId)
                {
                    return BadRequest("Tenant ID mismatch");
                }

                // First check if the tenant exists
                var tenant = await _context.Tenants.FindAsync(tenantId);
                if (tenant == null)
                {
                    return NotFound(new { error = "Tenant not found", tenantId = tenantId });
                }

                var settings = await _context.TenantSecuritySettings
                    .FirstOrDefaultAsync(ts => ts.TenantId == tenantId);

                if (settings == null)
                {
                    settings = new TenantSecuritySettings
                    {
                        TenantId = tenantId,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.TenantSecuritySettings.Add(settings);
                }

                // Update settings
                settings.RequireTwoFactor = dto.RequireTwoFactor;
                settings.AllowSmsTwoFactor = dto.AllowSmsTwoFactor;
                settings.AllowEmailTwoFactor = dto.AllowEmailTwoFactor;
                settings.AllowAuthenticatorApp = dto.AllowAuthenticatorApp;
                settings.MinimumPasswordLength = dto.MinimumPasswordLength;
                settings.RequireUppercase = dto.RequireUppercase;
                settings.RequireLowercase = dto.RequireLowercase;
                settings.RequireNumbers = dto.RequireNumbers;
                settings.RequireSpecialCharacters = dto.RequireSpecialCharacters;
                settings.PasswordExpiryDays = dto.PasswordExpiryDays;
                settings.PreventPasswordReuse = dto.PreventPasswordReuse;
                settings.PasswordHistoryCount = dto.PasswordHistoryCount;
                settings.SessionTimeoutMinutes = dto.SessionTimeoutMinutes;
                settings.ForceLogoutOnPasswordChange = dto.ForceLogoutOnPasswordChange;
                settings.AllowConcurrentSessions = dto.AllowConcurrentSessions;
                settings.MaxConcurrentSessions = dto.MaxConcurrentSessions;
                settings.MaxFailedLoginAttempts = dto.MaxFailedLoginAttempts;
                settings.AccountLockoutDurationMinutes = dto.AccountLockoutDurationMinutes;
                settings.RequireCaptchaAfterFailedAttempts = dto.RequireCaptchaAfterFailedAttempts;
                settings.CaptchaThreshold = dto.CaptchaThreshold;
                settings.EnableIpWhitelist = dto.EnableIpWhitelist;
                settings.AllowedIpRanges = dto.AllowedIpRanges;
                settings.BlockSuspiciousIps = dto.BlockSuspiciousIps;
                settings.SuspiciousIpThreshold = dto.SuspiciousIpThreshold;
                settings.EnableSecurityAuditLog = dto.EnableSecurityAuditLog;
                settings.LogFailedLoginAttempts = dto.LogFailedLoginAttempts;
                settings.LogSuccessfulLogins = dto.LogSuccessfulLogins;
                settings.LogPasswordChanges = dto.LogPasswordChanges;
                settings.LogAdminActions = dto.LogAdminActions;
                settings.NotifyOnFailedLogin = dto.NotifyOnFailedLogin;
                settings.NotifyOnSuspiciousActivity = dto.NotifyOnSuspiciousActivity;
                settings.NotifyOnAccountLockout = dto.NotifyOnAccountLockout;
                settings.NotificationEmails = dto.NotificationEmails;
                settings.EnableBruteForceProtection = dto.EnableBruteForceProtection;
                settings.BruteForceThreshold = dto.BruteForceThreshold;
                settings.BruteForceWindowMinutes = dto.BruteForceWindowMinutes;
                settings.EnableGeolocationBlocking = dto.EnableGeolocationBlocking;
                settings.AllowedCountries = dto.AllowedCountries;
                settings.UpdatedAt = DateTime.UtcNow;
                settings.UpdatedBy = "Admin"; // TODO: Get from current user

                await _context.SaveChangesAsync();

                return Ok(new { message = "Tenant security settings updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update tenant security settings for tenant {TenantId}", tenantId);
                return StatusCode(500, new { error = "Failed to update tenant security settings", details = ex.Message });
            }
        }

        // Security Report Endpoints
        [HttpPost("reports/generate")]
        public async Task<ActionResult<SecurityReportDto>> GenerateSecurityReport([FromBody] GenerateSecurityReportDto dto)
        {
            try
            {
                var tenant = await _context.Tenants.FindAsync(dto.TenantId);
                if (tenant == null)
                {
                    return NotFound("Tenant not found");
                }

                // Calculate date range
                var startDate = dto.StartDate ?? DateTime.UtcNow.AddDays(-7);
                var endDate = dto.EndDate ?? DateTime.UtcNow;

                // Get security data for the period
                var alerts = await _context.SecurityAlerts
                    .Where(sa => sa.TenantId == dto.TenantId && sa.Timestamp >= startDate && sa.Timestamp <= endDate)
                    .ToListAsync();

                var blockedIPs = await _context.BlockedIPs
                    .Where(bip => bip.TenantId == dto.TenantId && bip.BlockedAt >= startDate && bip.BlockedAt <= endDate)
                    .ToListAsync();

                var lockedAccounts = await _context.Users
                    .Where(u => u.TenantId == dto.TenantId && u.IsLocked)
                    .ToListAsync();

                var failedLogins = await _context.LogEntries
                    .Where(le => le.TenantId == dto.TenantId.ToString() && le.Level.Equals("Warning", StringComparison.OrdinalIgnoreCase) && le.Message.Contains("Failed login"))
                    .CountAsync();

                var successfulLogins = await _context.LogEntries
                    .Where(le => le.TenantId == dto.TenantId.ToString() && le.Level.Equals("Information", StringComparison.OrdinalIgnoreCase) && le.Message.Contains("Successful login"))
                    .CountAsync();

                // Calculate security score
                var totalAlerts = alerts.Count;
                var criticalAlerts = alerts.Count(a => a.Severity.Equals("critical", StringComparison.OrdinalIgnoreCase));
                var highAlerts = alerts.Count(a => a.Severity.Equals("high", StringComparison.OrdinalIgnoreCase));
                var mediumAlerts = alerts.Count(a => a.Severity.Equals("medium", StringComparison.OrdinalIgnoreCase));
                var lowAlerts = alerts.Count(a => a.Severity.Equals("low", StringComparison.OrdinalIgnoreCase));
                var resolvedAlerts = alerts.Count(a => a.Resolved);
                var pendingAlerts = alerts.Count(a => !a.Resolved);

                var securityScore = CalculateSecurityScore(totalAlerts, criticalAlerts, highAlerts, lockedAccounts.Count, failedLogins);
                var securityScoreTrend = DetermineSecurityTrend(dto.TenantId, securityScore);

                // Generate recommendations
                var recommendations = GenerateSecurityRecommendations(securityScore, totalAlerts, lockedAccounts.Count, criticalAlerts);

                // Create report data
                var reportData = new
                {
                    Period = new { Start = startDate, End = endDate },
                    Alerts = alerts.Select(a => new { a.Type, a.Severity, a.Status, a.Timestamp }),
                    BlockedIPs = blockedIPs.Select(bip => new { bip.IpAddress, bip.BlockedAt, bip.Reason }),
                    LockedAccounts = lockedAccounts.Select(la => new { la.Email, la.LockedAt, la.LockReason }),
                    LoginStats = new { Failed = failedLogins, Successful = successfulLogins }
                };

                var report = new SecurityReport
                {
                    TenantId = dto.TenantId,
                    ReportType = dto.ReportType,
                    ReportDate = DateTime.UtcNow,
                    StartDate = startDate,
                    EndDate = endDate,
                    Title = dto.Title ?? $"Güvenlik Raporu - {tenant.CompanyName}",
                    Description = dto.Description,
                    ReportData = JsonSerializer.Serialize(reportData),
                    TotalAlerts = totalAlerts,
                    CriticalAlerts = criticalAlerts,
                    HighAlerts = highAlerts,
                    MediumAlerts = mediumAlerts,
                    LowAlerts = lowAlerts,
                    ResolvedAlerts = resolvedAlerts,
                    PendingAlerts = pendingAlerts,
                    TotalBlockedIPs = blockedIPs.Count,
                    TotalLockedAccounts = lockedAccounts.Count,
                    TotalFailedLogins = failedLogins,
                    TotalSuccessfulLogins = successfulLogins,
                    SecurityScore = securityScore,
                    SecurityScoreTrend = securityScoreTrend,
                    Recommendations = JsonSerializer.Serialize(recommendations),
                    Status = "generated",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "Admin" // TODO: Get from current user
                };

                _context.SecurityReports.Add(report);
                await _context.SaveChangesAsync();

                return Ok(new SecurityReportDto
                {
                    Id = report.Id,
                    TenantId = report.TenantId,
                    TenantName = tenant.CompanyName,
                    ReportType = report.ReportType,
                    ReportDate = report.ReportDate,
                    StartDate = report.StartDate,
                    EndDate = report.EndDate,
                    Title = report.Title,
                    Description = report.Description,
                    ReportData = report.ReportData,
                    TotalAlerts = report.TotalAlerts,
                    CriticalAlerts = report.CriticalAlerts,
                    HighAlerts = report.HighAlerts,
                    MediumAlerts = report.MediumAlerts,
                    LowAlerts = report.LowAlerts,
                    ResolvedAlerts = report.ResolvedAlerts,
                    PendingAlerts = report.PendingAlerts,
                    TotalBlockedIPs = report.TotalBlockedIPs,
                    TotalLockedAccounts = report.TotalLockedAccounts,
                    TotalFailedLogins = report.TotalFailedLogins,
                    TotalSuccessfulLogins = report.TotalSuccessfulLogins,
                    SecurityScore = report.SecurityScore,
                    SecurityScoreTrend = report.SecurityScoreTrend,
                    Recommendations = report.Recommendations,
                    ExportFormat = report.ExportFormat,
                    ExportPath = report.ExportPath,
                    ExportFileSize = report.ExportFileSize,
                    ExportedAt = report.ExportedAt,
                    ExportedBy = report.ExportedBy,
                    Status = report.Status,
                    CreatedAt = report.CreatedAt,
                    UpdatedAt = report.UpdatedAt,
                    CreatedBy = report.CreatedBy
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate security report for tenant {TenantId}", dto.TenantId);
                return StatusCode(500, new { error = "Failed to generate security report", details = ex.Message });
            }
        }

        [HttpGet("reports/{reportId}/download")]
        public async Task<ActionResult> DownloadSecurityReport(int reportId, [FromQuery] string format = "pdf")
        {
            try
            {
                var report = await _context.SecurityReports
                    .Include(sr => sr.Tenant)
                    .FirstOrDefaultAsync(sr => sr.Id == reportId);

                if (report == null)
                {
                    return NotFound("Security report not found");
                }

                // Generate file content based on format
                var fileName = $"security_report_{report.Tenant?.CompanyName?.Replace(" ", "_")}_{report.ReportDate:yyyyMMdd}.{format}";
                var contentType = GetContentType(format);
                var fileContent = GenerateReportFile(report, format);

                // Update report export information
                report.ExportFormat = format;
                report.ExportPath = fileName;
                report.ExportFileSize = fileContent.Length;
                report.ExportedAt = DateTime.UtcNow;
                report.ExportedBy = "Admin"; // TODO: Get from current user
                report.Status = "exported";
                report.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return File(fileContent, contentType, fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to download security report {ReportId}", reportId);
                return StatusCode(500, new { error = "Failed to download security report", details = ex.Message });
            }
        }

        [HttpGet("reports")]
        public async Task<ActionResult<List<SecurityReportDto>>> GetSecurityReports([FromQuery] int? tenantId = null)
        {
            try
            {
                var query = _context.SecurityReports
                    .Include(sr => sr.Tenant)
                    .AsQueryable();

                if (tenantId.HasValue)
                {
                    query = query.Where(sr => sr.TenantId == tenantId);
                }

                var reports = await query
                    .OrderByDescending(sr => sr.CreatedAt)
                    .Select(sr => new SecurityReportDto
                    {
                        Id = sr.Id,
                        TenantId = sr.TenantId,
                        TenantName = sr.Tenant != null ? sr.Tenant.CompanyName : "Unknown Tenant",
                        ReportType = sr.ReportType,
                        ReportDate = sr.ReportDate,
                        StartDate = sr.StartDate,
                        EndDate = sr.EndDate,
                        Title = sr.Title,
                        Description = sr.Description,
                        ReportData = sr.ReportData,
                        TotalAlerts = sr.TotalAlerts,
                        CriticalAlerts = sr.CriticalAlerts,
                        HighAlerts = sr.HighAlerts,
                        MediumAlerts = sr.MediumAlerts,
                        LowAlerts = sr.LowAlerts,
                        ResolvedAlerts = sr.ResolvedAlerts,
                        PendingAlerts = sr.PendingAlerts,
                        TotalBlockedIPs = sr.TotalBlockedIPs,
                        TotalLockedAccounts = sr.TotalLockedAccounts,
                        TotalFailedLogins = sr.TotalFailedLogins,
                        TotalSuccessfulLogins = sr.TotalSuccessfulLogins,
                        SecurityScore = sr.SecurityScore,
                        SecurityScoreTrend = sr.SecurityScoreTrend,
                        Recommendations = sr.Recommendations,
                        ExportFormat = sr.ExportFormat,
                        ExportPath = sr.ExportPath,
                        ExportFileSize = sr.ExportFileSize,
                        ExportedAt = sr.ExportedAt,
                        ExportedBy = sr.ExportedBy,
                        Status = sr.Status,
                        CreatedAt = sr.CreatedAt,
                        UpdatedAt = sr.UpdatedAt,
                        CreatedBy = sr.CreatedBy
                    })
                    .ToListAsync();

                return Ok(reports);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get security reports");
                return StatusCode(500, new { error = "Failed to get security reports", details = ex.Message });
            }
        }

        // Helper methods for security reports
        private double CalculateSecurityScore(int totalAlerts, int criticalAlerts, int highAlerts, int lockedAccounts, int failedLogins)
        {
            var baseScore = 100.0;
            
            // Deduct points for security issues
            baseScore -= criticalAlerts * 15; // Critical alerts are very serious
            baseScore -= highAlerts * 10;     // High alerts are serious
            baseScore -= lockedAccounts * 5;  // Locked accounts indicate issues
            baseScore -= failedLogins * 0.5;  // Failed logins are minor issues
            
            return Math.Max(0, Math.Min(100, baseScore));
        }

        private string DetermineSecurityTrend(int tenantId, double currentScore)
        {
            // This is a simplified implementation
            // In a real application, you would compare with historical data
            return currentScore >= 80 ? "improving" : currentScore >= 60 ? "stable" : "declining";
        }

        private List<string> GenerateSecurityRecommendations(double securityScore, int totalAlerts, int lockedAccounts, int criticalAlerts)
        {
            var recommendations = new List<string>();

            if (securityScore < 80)
                recommendations.Add("Güvenlik skorunu artırmak için güvenlik önlemlerini gözden geçirin");

            if (criticalAlerts > 0)
                recommendations.Add("Kritik güvenlik alarmlarını öncelikli olarak çözün");

            if (lockedAccounts > 0)
                recommendations.Add("Kilitli kullanıcı hesaplarını kontrol edin ve gerekirse kilidini açın");

            if (totalAlerts > 10)
                recommendations.Add("Güvenlik alarmlarını düzenli olarak inceleyin");

            recommendations.Add("İki faktörlü kimlik doğrulamayı etkinleştirin");
            recommendations.Add("Güçlü şifre politikası uygulayın");
            recommendations.Add("IP whitelist'leri düzenli olarak güncelleyin");

            return recommendations;
        }

        private string GetContentType(string format)
        {
            return format.ToLower() switch
            {
                "pdf" => "application/pdf",
                "excel" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "csv" => "text/csv",
                "json" => "application/json",
                _ => "application/octet-stream"
            };
        }

        private byte[] GenerateReportFile(SecurityReport report, string format)
        {
            // This is a simplified implementation
            // In a real application, you would use proper libraries to generate PDF, Excel, etc.
            var reportData = JsonSerializer.Deserialize<object>(report.ReportData);
            var content = JsonSerializer.Serialize(reportData, new JsonSerializerOptions { WriteIndented = true });
            
            return System.Text.Encoding.UTF8.GetBytes(content);
        }
    }
} 