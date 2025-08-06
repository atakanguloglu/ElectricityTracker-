using Microsoft.Extensions.Logging;
using ElectricityTrackerAPI.Models.Logging;
using ElectricityTrackerAPI.Data;
using System.Text.Json;

namespace ElectricityTrackerAPI.Services
{
    public class LogService : ILogService
    {
        private readonly ILogger<LogService> _logger;
        private readonly ApplicationDbContext _context;

        public LogService(ILogger<LogService> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public void LogDebug(string message, string? source = null, object? additionalData = null)
        {
            _logger.LogDebug(message);
            SaveToDatabase("Debug", message, source, additionalData);
        }

        public void LogInformation(string message, string? source = null, object? additionalData = null)
        {
            _logger.LogInformation(message);
            SaveToDatabase("Information", message, source, additionalData);
        }

        public void LogWarning(string message, string? source = null, object? additionalData = null)
        {
            _logger.LogWarning(message);
            SaveToDatabase("Warning", message, source, additionalData);
        }

        public void LogError(string message, Exception? exception = null, string? source = null, object? additionalData = null)
        {
            _logger.LogError(exception, message);
            SaveToDatabase("Error", message, source, additionalData, exception);
        }

        public void LogFatal(string message, Exception? exception = null, string? source = null, object? additionalData = null)
        {
            _logger.LogCritical(exception, message);
            SaveToDatabase("Fatal", message, source, additionalData, exception);
        }

        public void LogUserActivity(string userId, string userEmail, string activity, string? tenantId = null, object? additionalData = null)
        {
            var message = $"User Activity: {activity} - User: {userEmail}";
            _logger.LogInformation(message);
            SaveToDatabase("Information", message, "UserActivity", additionalData, null, userId, userEmail, tenantId);
        }

        public void LogApiRequest(string method, string path, string? userId = null, string? userEmail = null, string? tenantId = null, string? ipAddress = null)
        {
            var message = $"API Request: {method} {path}";
            _logger.LogInformation(message);
            SaveToDatabase("Information", message, "ApiRequest", null, null, userId, userEmail, tenantId, path, method, ipAddress);
        }

        public void LogApiResponse(string method, string path, int statusCode, string? userId = null, string? userEmail = null, string? tenantId = null)
        {
            var level = statusCode >= 400 ? "Warning" : "Information";
            var message = $"API Response: {method} {path} - Status: {statusCode}";
            _logger.Log(level == "Warning" ? Microsoft.Extensions.Logging.LogLevel.Warning : Microsoft.Extensions.Logging.LogLevel.Information, message);
            SaveToDatabase(level, message, "ApiResponse", null, null, userId, userEmail, tenantId, path, method);
        }

        private void SaveToDatabase(string level, string message, string? source = null, object? additionalData = null, 
            Exception? exception = null, string? userId = null, string? userEmail = null, string? tenantId = null, 
            string? requestPath = null, string? requestMethod = null, string? ipAddress = null)
        {
            try
            {
                var logEntry = new LogEntry
                {
                    Level = level,
                    Message = message != null && message.Length > 500 ? message.Substring(0, 497) + "..." : message,
                    Source = source != null && source.Length > 500 ? source.Substring(0, 497) + "..." : source,
                    UserId = userId,
                    UserEmail = userEmail,
                    TenantId = tenantId,
                    RequestPath = requestPath,
                    RequestMethod = requestMethod,
                    IpAddress = ipAddress,
                    Exception = exception?.ToString() != null && exception.ToString().Length > 500 ? exception.ToString().Substring(0, 497) + "..." : exception?.ToString(),
                    AdditionalData = additionalData != null ? JsonSerializer.Serialize(additionalData) : null,
                    Timestamp = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow
                };

                _context.LogEntries.Add(logEntry);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to save log entry to database");
            }
        }
    }
} 