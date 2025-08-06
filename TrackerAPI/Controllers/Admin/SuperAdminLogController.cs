using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Models.Logging;
using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.Services;

namespace ElectricityTrackerAPI.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/logs")]
    [Authorize(Roles = "SuperAdmin")]
    public class SuperAdminLogController : Common.BaseController
    {
        private readonly ILogService _logService;

        public SuperAdminLogController(ApplicationDbContext context, ILogger<SuperAdminLogController> logger, ILogService logService) 
            : base(context, logger)
        {
            _logService = logService;
        }

        [HttpGet]
        public async Task<IActionResult> GetLogs(
            [FromQuery] string? level = null,
            [FromQuery] string? category = null,
            [FromQuery] int? tenantId = null,
            [FromQuery] int? userId = null,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string? searchText = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var query = _context.SystemLogs
                    .Include(l => l.Tenant)
                    .Include(l => l.User)
                    .AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(level))
                    query = query.Where(l => l.Level == level);

                if (!string.IsNullOrEmpty(category))
                    query = query.Where(l => l.Category == category);

                if (tenantId.HasValue)
                    query = query.Where(l => l.TenantId == tenantId.Value);

                if (userId.HasValue)
                    query = query.Where(l => l.UserId == userId.Value);

                if (startDate.HasValue)
                    query = query.Where(l => l.Timestamp >= startDate.Value);

                if (endDate.HasValue)
                    query = query.Where(l => l.Timestamp <= endDate.Value);

                if (!string.IsNullOrEmpty(searchText))
                {
                    query = query.Where(l => 
                        (l.Message != null && l.Message.Contains(searchText)) || 
                        (l.Details != null && l.Details.Contains(searchText)) ||
                        (l.Exception != null && l.Exception.Contains(searchText)) ||
                        (l.Tenant != null && l.Tenant.CompanyName.Contains(searchText)) ||
                        (l.User != null && (l.User.FirstName.Contains(searchText) || l.User.LastName.Contains(searchText)))
                    );
                }

                // Get total count
                var totalCount = await query.CountAsync();

                // Apply pagination
                var logs = await query
                    .OrderByDescending(l => l.Timestamp)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(l => new
                    {
                        l.Id,
                        l.Timestamp,
                        l.Level,
                        l.Category,
                        l.Message,
                        l.Details,
                        l.IpAddress,
                        l.UserAgent,
                        l.Exception,
                        l.StackTrace,
                        TenantId = l.TenantId,
                        TenantName = l.Tenant != null ? l.Tenant.CompanyName : null,
                        UserId = l.UserId,
                        UserName = l.User != null ? $"{l.User.FirstName} {l.User.LastName}" : null,
                        UserEmail = l.User != null ? l.User.Email : null
                    })
                    .ToListAsync();

                var result = new
                {
                    items = logs,
                    totalCount,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                };

                _logService.LogInformation($"Logs retrieved - Page: {page}, Count: {logs.Count}", "LogController");
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error retrieving logs", ex, "LogController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetLogStats([FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var query = _context.SystemLogs.AsQueryable();

                if (startDate.HasValue)
                    query = query.Where(l => l.Timestamp >= startDate.Value);

                if (endDate.HasValue)
                    query = query.Where(l => l.Timestamp <= endDate.Value);

                var levelStats = await query
                    .GroupBy(l => l.Level)
                    .Select(g => new
                    {
                        Level = g.Key,
                        Count = g.Count()
                    })
                    .ToListAsync();

                var categoryStats = await query
                    .GroupBy(l => l.Category)
                    .Select(g => new
                    {
                        Category = g.Key,
                        Count = g.Count()
                    })
                    .ToListAsync();

                var totalLogs = await query.CountAsync();
                var errorLogs = await query.Where(l => l.Level == "Error" || l.Level == "Fatal").CountAsync();
                var warningLogs = await query.Where(l => l.Level == "Warning").CountAsync();
                var infoLogs = await query.Where(l => l.Level == "Info").CountAsync();

                var result = new
                {
                    totalLogs,
                    errorLogs,
                    warningLogs,
                    infoLogs,
                    errorRate = totalLogs > 0 ? (double)errorLogs / totalLogs * 100 : 0,
                    levelBreakdown = levelStats,
                    categoryBreakdown = categoryStats
                };

                _logService.LogInformation("Log statistics retrieved", "LogController");
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error retrieving log statistics", ex, "LogController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpDelete("cleanup")]
        public async Task<IActionResult> CleanupOldLogs([FromQuery] int daysToKeep = 30)
        {
            try
            {
                var cutoffDate = DateTime.UtcNow.AddDays(-daysToKeep);
                var oldLogs = await _context.SystemLogs
                    .Where(l => l.Timestamp < cutoffDate)
                    .ToListAsync();

                _context.SystemLogs.RemoveRange(oldLogs);
                await _context.SaveChangesAsync();

                _logService.LogInformation($"Cleaned up {oldLogs.Count} old log entries older than {daysToKeep} days", "LogController");
                return Ok(new { message = $"Cleaned up {oldLogs.Count} old log entries" });
            }
            catch (Exception ex)
            {
                _logService.LogError("Error cleaning up old logs", ex, "LogController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("test")]
        public IActionResult TestExport()
        {
            return Ok(new { message = "Export test endpoint is working", timestamp = DateTime.UtcNow });
        }

        [HttpGet("export")]
        public async Task<IActionResult> ExportLogs(
            [FromQuery] string format = "json",
            [FromQuery] string? level = null,
            [FromQuery] string? category = null,
            [FromQuery] int? tenantId = null,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string? searchText = null,
            [FromQuery] int pageSize = 10000)
        {
            try
            {
                var query = _context.SystemLogs
                    .Include(l => l.Tenant)
                    .Include(l => l.User)
                    .AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(level))
                    query = query.Where(l => l.Level == level);

                if (!string.IsNullOrEmpty(category))
                    query = query.Where(l => l.Category == category);

                if (tenantId.HasValue)
                    query = query.Where(l => l.TenantId == tenantId.Value);

                if (startDate.HasValue)
                    query = query.Where(l => l.Timestamp >= startDate.Value);

                if (endDate.HasValue)
                    query = query.Where(l => l.Timestamp <= endDate.Value);

                if (!string.IsNullOrEmpty(searchText))
                {
                    query = query.Where(l => 
                        l.Message.Contains(searchText) || 
                        (l.Details != null && l.Details.Contains(searchText)) ||
                        (l.Exception != null && l.Exception.Contains(searchText)) ||
                        (l.Tenant != null && l.Tenant.CompanyName.Contains(searchText)) ||
                        (l.User != null && (l.User.FirstName.Contains(searchText) || l.User.LastName.Contains(searchText)))
                    );
                }

                var logs = await query
                    .OrderByDescending(l => l.Timestamp)
                    .Take(pageSize)
                    .Select(l => new
                    {
                        l.Id,
                        l.Timestamp,
                        l.Level,
                        l.Category,
                        l.Message,
                        l.Details,
                        l.IpAddress,
                        l.UserAgent,
                        l.Exception,
                        l.StackTrace,
                        TenantId = l.TenantId,
                        TenantName = l.Tenant != null ? l.Tenant.CompanyName : null,
                        UserId = l.UserId,
                        UserName = l.User != null ? $"{l.User.FirstName} {l.User.LastName}" : null,
                        UserEmail = l.User != null ? l.User.Email : null
                    })
                    .ToListAsync();

                switch (format.ToLower())
                {
                    case "json":
                        return File(
                            System.Text.Encoding.UTF8.GetBytes(System.Text.Json.JsonSerializer.Serialize(logs, new System.Text.Json.JsonSerializerOptions { WriteIndented = true })),
                            "application/json",
                            $"logs_{DateTime.UtcNow:yyyyMMdd}.json"
                        );

                    case "csv":
                        var csvContent = "ID,Timestamp,Level,Category,Message,TenantName,UserName,UserEmail,IPAddress\n";
                        foreach (var log in logs)
                        {
                            csvContent += $"{log.Id},{log.Timestamp:yyyy-MM-dd HH:mm:ss},{log.Level},{log.Category},\"{log.Message}\",{log.TenantName ?? ""},{log.UserName ?? ""},{log.UserEmail ?? ""},{log.IpAddress ?? ""}\n";
                        }
                        return File(
                            System.Text.Encoding.UTF8.GetBytes(csvContent),
                            "text/csv",
                            $"logs_{DateTime.UtcNow:yyyyMMdd}.csv"
                        );

                    case "excel":
                        // For Excel, we'll return JSON for now
                        // In a real implementation, you'd use a library like EPPlus or ClosedXML
                        return File(
                            System.Text.Encoding.UTF8.GetBytes(System.Text.Json.JsonSerializer.Serialize(logs, new System.Text.Json.JsonSerializerOptions { WriteIndented = true })),
                            "application/json",
                            $"logs_{DateTime.UtcNow:yyyyMMdd}.json"
                        );

                    default:
                        return BadRequest(new { message = "Unsupported export format" });
                }
            }
            catch (Exception ex)
            {
                _logService.LogError("Error exporting logs", ex, "LogController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLog(int id)
        {
            try
            {
                var log = await _context.SystemLogs
                    .Include(l => l.Tenant)
                    .Include(l => l.User)
                    .FirstOrDefaultAsync(l => l.Id == id);

                if (log == null)
                {
                    return NotFound(new { message = "Log entry not found" });
                }

                var result = new
                {
                    log.Id,
                    log.Timestamp,
                    log.Level,
                    log.Category,
                    log.Message,
                    log.Details,
                    log.IpAddress,
                    log.UserAgent,
                    log.Exception,
                    log.StackTrace,
                    TenantId = log.TenantId,
                    TenantName = log.Tenant != null ? log.Tenant.CompanyName : null,
                    UserId = log.UserId,
                    UserName = log.User != null ? $"{log.User.FirstName} {log.User.LastName}" : null,
                    UserEmail = log.User != null ? log.User.Email : null
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error retrieving log entry", ex, "LogController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLog(int id)
        {
            try
            {
                var log = await _context.SystemLogs.FindAsync(id);
                if (log == null)
                {
                    return NotFound(new { message = "Log entry not found" });
                }

                _context.SystemLogs.Remove(log);
                await _context.SaveChangesAsync();

                _logService.LogInformation($"Log entry {id} deleted", "LogController");
                return Ok(new { message = "Log entry deleted successfully" });
            }
            catch (Exception ex)
            {
                _logService.LogError("Error deleting log entry", ex, "LogController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
} 