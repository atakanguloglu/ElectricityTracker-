using ElectricityTrackerAPI.Models;

namespace ElectricityTrackerAPI.Services
{
    public interface ILogService
    {
        void LogDebug(string message, string? source = null, object? additionalData = null);
        void LogInformation(string message, string? source = null, object? additionalData = null);
        void LogWarning(string message, string? source = null, object? additionalData = null);
        void LogError(string message, Exception? exception = null, string? source = null, object? additionalData = null);
        void LogFatal(string message, Exception? exception = null, string? source = null, object? additionalData = null);
        
        void LogUserActivity(string userId, string userEmail, string activity, string? tenantId = null, object? additionalData = null);
        void LogApiRequest(string method, string path, string? userId = null, string? userEmail = null, string? tenantId = null, string? ipAddress = null);
        void LogApiResponse(string method, string path, int statusCode, string? userId = null, string? userEmail = null, string? tenantId = null);
    }
} 