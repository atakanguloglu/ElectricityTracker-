using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Models.Core;
using ElectricityTrackerAPI.Models.Energy;
using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.DTOs.Core;
using ElectricityTrackerAPI.Models.Core;

namespace ElectricityTrackerAPI.Controllers.Core
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : Common.BaseController
    {
        public DashboardController(ApplicationDbContext context, ILogger<DashboardController> logger) 
            : base(context, logger)
        {
        }

        [HttpGet("stats")]
        [Authorize]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                // SuperAdmin kullanıcıları için özel kontrol
                var userId = GetCurrentUserId();
                if (userId.HasValue)
                {
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId.Value);
                    if (user?.Role == UserRole.SuperAdmin)
                    {
                        return BadRequest(new { message = "SuperAdmin kullanıcıları tenant dashboard'ını kullanamaz. Admin paneline gidin." });
                    }
                }

                var tenantId = GetCurrentTenantId();
                if (!tenantId.HasValue)
                {
                    return TenantNotFound();
                }

                // Get tenant info
                var tenant = await _context.Tenants
                    .FirstOrDefaultAsync(t => t.Id == tenantId.Value);

                if (tenant == null)
                {
                    return TenantNotFound();
                }

                // Get user count
                var userCount = await _context.Users
                    .CountAsync(u => u.TenantId == tenantId.Value && u.IsActive);

                // Get department count
                var departmentCount = await _context.Departments
                    .CountAsync(d => d.TenantId == tenantId.Value && d.IsActive);

                // Get facility count
                var facilityCount = await _context.Facilities
                    .CountAsync(f => f.TenantId == tenantId.Value && f.IsActive);

                // Get meter count
                var meterCount = await _context.ElectricityMeters
                    .CountAsync(m => m.TenantId == tenantId.Value && m.IsActive);

                // Get total consumption for current month
                var currentMonth = DateTime.UtcNow.Month;
                var currentYear = DateTime.UtcNow.Year;
                var totalConsumption = await _context.ConsumptionRecords
                    .Where(c => c.TenantId == tenantId.Value && 
                               c.Timestamp.Month == currentMonth && 
                               c.Timestamp.Year == currentYear)
                    .SumAsync(c => c.Consumption);

                // Get alerts count (mock data for now)
                var activeAlerts = 3; // Mock data

                var stats = new DashboardStatsDto
                {
                    TenantName = tenant.CompanyName,
                    UserCount = userCount,
                    DepartmentCount = departmentCount,
                    FacilityCount = facilityCount,
                    MeterCount = meterCount,
                    TotalConsumption = totalConsumption,
                    ActiveAlerts = activeAlerts,
                    SubscriptionStatus = tenant.Status.ToString(),
                    SubscriptionEndDate = tenant.SubscriptionEndDate ?? DateTime.UtcNow.AddYears(1)
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dashboard stats");
                return StatusCode(500, new { message = "Dashboard istatistikleri alınırken hata oluştu" });
            }
        }

        [HttpGet("consumption-chart")]
        [Authorize]
        public async Task<IActionResult> GetConsumptionChart()
        {
            try
            {
                var tenantId = GetCurrentTenantId();
                if (!tenantId.HasValue)
                {
                    return TenantNotFound();
                }

                // Get consumption data for last 6 months
                var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);
                var consumptionData = await _context.ConsumptionRecords
                    .Where(c => c.TenantId == tenantId.Value && 
                               c.Timestamp >= sixMonthsAgo)
                    .GroupBy(c => new { c.Timestamp.Year, c.Timestamp.Month })
                    .Select(g => new ConsumptionChartDto
                    {
                        Month = $"{g.Key.Year}-{g.Key.Month:D2}",
                        Consumption = g.Sum(c => c.Consumption),
                        Target = 1000 // Mock target
                    })
                    .OrderBy(c => c.Month)
                    .ToListAsync();

                return Ok(consumptionData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting consumption chart data");
                return StatusCode(500, new { message = "Tüketim grafik verisi alınırken hata oluştu" });
            }
        }

        [HttpGet("facility-distribution")]
        [Authorize]
        public async Task<IActionResult> GetFacilityDistribution()
        {
            try
            {
                var tenantId = GetCurrentTenantId();
                if (!tenantId.HasValue)
                {
                    return TenantNotFound();
                }

                var facilityData = await _context.Facilities
                    .Where(f => f.TenantId == tenantId.Value && f.IsActive)
                    .Select(f => new FacilityDistributionDto
                    {
                        Name = f.Name,
                        Consumption = f.ElectricityMeters
                            .Where(m => m.IsActive)
                            .SelectMany(m => m.ConsumptionRecords)
                            .Where(c => c.Timestamp.Month == DateTime.UtcNow.Month)
                            .Sum(c => c.Consumption),
                        Color = GetRandomColor()
                    })
                    .ToListAsync();

                return Ok(facilityData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting facility distribution");
                return StatusCode(500, new { message = "Tesis dağılımı alınırken hata oluştu" });
            }
        }

        [HttpGet("recent-alerts")]
        [Authorize]
        public async Task<IActionResult> GetRecentAlerts()
        {
            try
            {
                var tenantId = GetCurrentTenantId();
                if (!tenantId.HasValue)
                {
                    return TenantNotFound();
                }

                // Mock alerts data for now
                var alerts = new List<AlertDto>
                {
                    new AlertDto
                    {
                        Id = 1,
                        Facility = "Ana Bina",
                        Type = "Yüksek Tüketim",
                        Severity = "Kritik",
                        Time = "2 saat önce",
                        Status = "Aktif"
                    },
                    new AlertDto
                    {
                        Id = 2,
                        Facility = "Depo",
                        Type = "Anormal Kullanım",
                        Severity = "Uyarı",
                        Time = "5 saat önce",
                        Status = "Çözüldü"
                    },
                    new AlertDto
                    {
                        Id = 3,
                        Facility = "Üretim",
                        Type = "Ekipman Arızası",
                        Severity = "Kritik",
                        Time = "1 gün önce",
                        Status = "Aktif"
                    }
                };

                return Ok(alerts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting recent alerts");
                return StatusCode(500, new { message = "Son uyarılar alınırken hata oluştu" });
            }
        }

        private string GetRandomColor()
        {
            var colors = new[] { "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4" };
            return colors[new Random().Next(colors.Length)];
        }
    }
} 