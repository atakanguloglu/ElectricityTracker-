using ElectricityTrackerAPI.Services;
using System.Security.Claims;
using Microsoft.Extensions.DependencyInjection;

namespace ElectricityTrackerAPI.Middleware
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public RequestLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var startTime = DateTime.UtcNow;

            try
            {
                // Continue with the request pipeline
                await _next(context);

                // Log response using scoped service
                var logService = context.RequestServices.GetService<ILogService>();
                if (logService != null)
                {
                    var userId = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    var userEmail = context.User?.FindFirst(ClaimTypes.Email)?.Value;
                    var tenantId = context.User?.FindFirst("TenantId")?.Value;
                    var ipAddress = GetClientIpAddress(context);

                    logService.LogApiRequest(
                        context.Request.Method,
                        context.Request.Path,
                        userId,
                        userEmail,
                        tenantId,
                        ipAddress
                    );

                    logService.LogApiResponse(
                        context.Request.Method,
                        context.Request.Path,
                        context.Response.StatusCode,
                        userId,
                        userEmail,
                        tenantId
                    );
                }
            }
            catch (Exception ex)
            {
                var logService = context.RequestServices.GetService<ILogService>();
                logService?.LogError("Request processing failed", ex, "RequestLoggingMiddleware");
                throw;
            }
        }

        private string GetClientIpAddress(HttpContext context)
        {
            var forwardedHeader = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (!string.IsNullOrEmpty(forwardedHeader))
            {
                return forwardedHeader.Split(',')[0].Trim();
            }

            return context.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
        }
    }
} 