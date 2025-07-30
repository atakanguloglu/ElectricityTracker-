using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Models;
using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.Services;

namespace ElectricityTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class LogController : BaseController
    {
        private readonly ILogService _logService;

        public LogController(ApplicationDbContext context, ILogger<LogController> logger, ILogService logService) 
            : base(context, logger)
        {
            _logService = logService;
        }

        [HttpGet]
        public async Task<IActionResult> GetLogs(
            [FromQuery] string? level = null,
            [FromQuery] string? source = null,
            [FromQuery] string? userId = null,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var query = _context.LogEntries.AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(level))
                    query = query.Where(l => l.Level == level);

                if (!string.IsNullOrEmpty(source))
                    query = query.Where(l => l.Source == source);

                if (!string.IsNullOrEmpty(userId))
                    query = query.Where(l => l.UserId == userId);

                if (startDate.HasValue)
                    query = query.Where(l => l.Timestamp >= startDate.Value);

                if (endDate.HasValue)
                    query = query.Where(l => l.Timestamp <= endDate.Value);

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
                        l.Message,
                        l.Source,
                        l.UserId,
                        l.UserEmail,
                        l.TenantId,
                        l.RequestPath,
                        l.RequestMethod,
                        l.IpAddress,
                        l.Exception,
                        l.AdditionalData,
                        l.CreatedAt
                    })
                    .ToListAsync();

                var result = new
                {
                    logs,
                    pagination = new
                    {
                        page,
                        pageSize,
                        totalCount,
                        totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                    }
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
                var query = _context.LogEntries.AsQueryable();

                if (startDate.HasValue)
                    query = query.Where(l => l.Timestamp >= startDate.Value);

                if (endDate.HasValue)
                    query = query.Where(l => l.Timestamp <= endDate.Value);

                var stats = await query
                    .GroupBy(l => l.Level)
                    .Select(g => new
                    {
                        Level = g.Key,
                        Count = g.Count()
                    })
                    .ToListAsync();

                var totalLogs = await query.CountAsync();
                var errorLogs = await query.Where(l => l.Level == "Error" || l.Level == "Fatal").CountAsync();

                var result = new
                {
                    totalLogs,
                    errorLogs,
                    errorRate = totalLogs > 0 ? (double)errorLogs / totalLogs * 100 : 0,
                    levelBreakdown = stats
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
                var oldLogs = await _context.LogEntries
                    .Where(l => l.Timestamp < cutoffDate)
                    .ToListAsync();

                _context.LogEntries.RemoveRange(oldLogs);
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
    }
} 