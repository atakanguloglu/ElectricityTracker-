using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.Models.Admin;
using System.Diagnostics;

namespace ElectricityTrackerAPI.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    public class MonitoringController : Common.BaseController
    {
        public MonitoringController(ApplicationDbContext context, ILogger<MonitoringController> logger) 
            : base(context, logger)
        {
        }

        [HttpGet("system-health")]
        public async Task<IActionResult> GetSystemHealth()
        {
            try
            {
                var process = Process.GetCurrentProcess();
                var memoryInfo = GC.GetGCMemoryInfo();
                
                var health = new
                {
                    Status = "Healthy",
                    Timestamp = DateTime.UtcNow,
                    System = new
                    {
                        CpuUsage = GetCpuUsage(),
                        MemoryUsage = process.WorkingSet64,
                        MemoryLimit = memoryInfo.TotalAvailableMemoryBytes,
                        MemoryPercentage = (double)process.WorkingSet64 / memoryInfo.TotalAvailableMemoryBytes * 100,
                        ThreadCount = process.Threads.Count,
                        HandleCount = process.HandleCount,
                        ProcessTime = process.TotalProcessorTime.TotalSeconds
                    },
                    Database = new
                    {
                        Status = "Connected",
                        ConnectionString = _context.Database.CanConnect() ? "OK" : "Failed",
                        PendingMigrations = await _context.Database.GetPendingMigrationsAsync()
                    },
                    Services = new
                    {
                        ApiService = "Running",
                        LogService = "Active",
                        AuthService = "Active"
                    }
                };

                return Ok(health);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "System health check failed");
                return StatusCode(500, new { error = "System health check failed", details = ex.Message });
            }
        }

        [HttpGet("performance-metrics")]
        public async Task<IActionResult> GetPerformanceMetrics([FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var end = endDate ?? DateTime.UtcNow;
                var start = startDate ?? end.AddHours(-24);

                var process = Process.GetCurrentProcess();
                var memoryInfo = GC.GetGCMemoryInfo();

                var metrics = new
                {
                    Timestamp = DateTime.UtcNow,
                    TimeRange = new { Start = start, End = end },
                    System = new
                    {
                        CpuUsage = GetCpuUsage(),
                        MemoryUsage = process.WorkingSet64,
                        MemoryLimit = memoryInfo.TotalAvailableMemoryBytes,
                        MemoryPercentage = (double)process.WorkingSet64 / memoryInfo.TotalAvailableMemoryBytes * 100,
                        ThreadCount = process.Threads.Count,
                        HandleCount = process.HandleCount,
                        ProcessTime = process.TotalProcessorTime.TotalSeconds
                    },
                    Database = new
                    {
                        TotalTenants = await _context.Tenants.CountAsync(),
                        TotalUsers = await _context.Users.CountAsync(),
                        TotalApiKeys = await _context.ApiKeys.CountAsync(),
                        ActiveApiKeys = await _context.ApiKeys.CountAsync(ak => ak.Status == ApiKeyStatus.Active),
                        TotalLogs = await _context.SystemLogs.CountAsync(),
                        RecentLogs = await _context.SystemLogs.CountAsync(l => l.Timestamp >= start)
                    },
                    ApiUsage = new
                    {
                        TotalRequests = await GetTotalRequests(start, end),
                        ErrorRate = await GetErrorRate(start, end),
                        AverageResponseTime = await GetAverageResponseTime(start, end),
                        PeakHour = await GetPeakHour(start, end)
                    }
                };

                return Ok(metrics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Performance metrics retrieval failed");
                return StatusCode(500, new { error = "Performance metrics retrieval failed", details = ex.Message });
            }
        }

        [HttpGet("alerts")]
        public async Task<IActionResult> GetAlerts([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var alerts = new List<object>();

                // System alerts
                var process = Process.GetCurrentProcess();
                var memoryInfo = GC.GetGCMemoryInfo();
                var memoryPercentage = (double)process.WorkingSet64 / memoryInfo.TotalAvailableMemoryBytes * 100;

                if (memoryPercentage > 80)
                {
                    alerts.Add(new
                    {
                        Id = Guid.NewGuid(),
                        Type = "System",
                        Level = "Warning",
                        Title = "Yüksek Bellek Kullanımı",
                        Message = $"Bellek kullanımı %{memoryPercentage:F1} seviyesinde",
                        Timestamp = DateTime.UtcNow,
                        IsActive = true
                    });
                }

                if (process.Threads.Count > 100)
                {
                    alerts.Add(new
                    {
                        Id = Guid.NewGuid(),
                        Type = "System",
                        Level = "Warning",
                        Title = "Yüksek Thread Sayısı",
                        Message = $"Thread sayısı {process.Threads.Count} seviyesinde",
                        Timestamp = DateTime.UtcNow,
                        IsActive = true
                    });
                }

                // Database alerts
                var recentErrors = await _context.SystemLogs
                    .Where(l => l.Level == "Error" && l.Timestamp >= DateTime.UtcNow.AddHours(-1))
                    .CountAsync();

                if (recentErrors > 10)
                {
                    alerts.Add(new
                    {
                        Id = Guid.NewGuid(),
                        Type = "Database",
                        Level = "Error",
                        Title = "Yüksek Hata Oranı",
                        Message = $"Son 1 saatte {recentErrors} hata logu",
                        Timestamp = DateTime.UtcNow,
                        IsActive = true
                    });
                }

                // API alerts
                var inactiveApiKeys = await _context.ApiKeys
                    .Where(ak => ak.Status == ApiKeyStatus.Inactive)
                    .CountAsync();

                if (inactiveApiKeys > 5)
                {
                    alerts.Add(new
                    {
                        Id = Guid.NewGuid(),
                        Type = "API",
                        Level = "Info",
                        Title = "Pasif API Anahtarları",
                        Message = $"{inactiveApiKeys} adet pasif API anahtarı mevcut",
                        Timestamp = DateTime.UtcNow,
                        IsActive = true
                    });
                }

                var result = new
                {
                    Items = alerts.Skip((page - 1) * pageSize).Take(pageSize),
                    TotalCount = alerts.Count,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)alerts.Count / pageSize)
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Alerts retrieval failed");
                return StatusCode(500, new { error = "Alerts retrieval failed", details = ex.Message });
            }
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetMonitoringDashboard()
        {
            try
            {
                var process = Process.GetCurrentProcess();
                var memoryInfo = GC.GetGCMemoryInfo();
                var now = DateTime.UtcNow;
                var last24Hours = now.AddHours(-24);

                var dashboard = new
                {
                    SystemStatus = new
                    {
                        Status = "Healthy",
                        Uptime = (now - process.StartTime).TotalHours,
                        CpuUsage = GetCpuUsage(),
                        MemoryUsage = (double)process.WorkingSet64 / memoryInfo.TotalAvailableMemoryBytes * 100,
                        ThreadCount = process.Threads.Count
                    },
                    DatabaseMetrics = new
                    {
                        TotalTenants = await _context.Tenants.CountAsync(),
                        ActiveTenants = await _context.Tenants.CountAsync(t => t.IsActive),
                        TotalUsers = await _context.Users.CountAsync(),
                        ActiveUsers = await _context.Users.CountAsync(u => u.IsActive),
                        TotalApiKeys = await _context.ApiKeys.CountAsync(),
                        ActiveApiKeys = await _context.ApiKeys.CountAsync(ak => ak.Status == ApiKeyStatus.Active)
                    },
                    RecentActivity = new
                    {
                        NewLogs = await _context.SystemLogs.CountAsync(l => l.Timestamp >= last24Hours),
                        ErrorLogs = await _context.SystemLogs.CountAsync(l => l.Level == "Error" && l.Timestamp >= last24Hours),
                        WarningLogs = await _context.SystemLogs.CountAsync(l => l.Level == "Warning" && l.Timestamp >= last24Hours),
                        NewUsers = await _context.Users.CountAsync(u => u.CreatedAt >= last24Hours),
                        NewApiKeys = await _context.ApiKeys.CountAsync(ak => ak.CreatedAt >= last24Hours)
                    },
                    Performance = new
                    {
                        AverageResponseTime = await GetAverageResponseTime(last24Hours, now),
                        ErrorRate = await GetErrorRate(last24Hours, now),
                        TotalRequests = await GetTotalRequests(last24Hours, now)
                    }
                };

                return Ok(dashboard);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Monitoring dashboard retrieval failed");
                return StatusCode(500, new { error = "Monitoring dashboard retrieval failed", details = ex.Message });
            }
        }

        private double GetCpuUsage()
        {
            try
            {
                var process = Process.GetCurrentProcess();
                var startTime = process.StartTime;
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
                return 0.0;
            }
        }

        private async Task<int> GetTotalRequests(DateTime start, DateTime end)
        {
            // Bu metod gerçek API kullanım verilerini döndürmeli
            // Şimdilik sabit bir değer döndürüyoruz
            return await Task.FromResult(new Random().Next(1000, 5000));
        }

        private async Task<double> GetErrorRate(DateTime start, DateTime end)
        {
            var totalLogs = await _context.SystemLogs.CountAsync(l => l.Timestamp >= start && l.Timestamp <= end);
            var errorLogs = await _context.SystemLogs.CountAsync(l => l.Level == "Error" && l.Timestamp >= start && l.Timestamp <= end);
            
            return totalLogs > 0 ? (double)errorLogs / totalLogs * 100 : 0;
        }

        private async Task<double> GetAverageResponseTime(DateTime start, DateTime end)
        {
            // Bu metod gerçek response time verilerini döndürmeli
            // Şimdilik sabit bir değer döndürüyoruz
            return await Task.FromResult(new Random().NextDouble() * 500 + 100);
        }

        private async Task<string> GetPeakHour(DateTime start, DateTime end)
        {
            // Bu metod gerçek peak hour verilerini döndürmeli
            // Şimdilik sabit bir değer döndürüyoruz
            return await Task.FromResult("14:00");
        }
    }
} 