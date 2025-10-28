using System.Net;
using System.Text.Json;
using ElectricityTrackerAPI.Models.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ElectricityTrackerAPI.Middleware
{
    /// <summary>
    /// Global Exception Handler Middleware
    /// Tüm unhandled exception'ları yakalar ve standart formatta döner
    /// </summary>
    public class GlobalExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;
        private readonly IHostEnvironment _environment;

        public GlobalExceptionHandlerMiddleware(
            RequestDelegate next,
            ILogger<GlobalExceptionHandlerMiddleware> logger,
            IHostEnvironment environment)
        {
            _next = next;
            _logger = logger;
            _environment = environment;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception occurred: {Message}", ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var response = exception switch
            {
                ApplicationException _ => CreateResponse(
                    HttpStatusCode.BadRequest,
                    "İşlem sırasında bir uygulama hatası oluştu",
                    exception),

                KeyNotFoundException _ => CreateResponse(
                    HttpStatusCode.NotFound,
                    "İstenen kaynak bulunamadı",
                    exception),

                UnauthorizedAccessException _ => CreateResponse(
                    HttpStatusCode.Unauthorized,
                    "Bu işlem için yetkiniz bulunmuyor",
                    exception),

                InvalidOperationException _ => CreateResponse(
                    HttpStatusCode.BadRequest,
                    "Geçersiz işlem",
                    exception),

                ArgumentException _ => CreateResponse(
                    HttpStatusCode.BadRequest,
                    "Geçersiz parametre",
                    exception),

                TimeoutException _ => CreateResponse(
                    HttpStatusCode.RequestTimeout,
                    "İşlem zaman aşımına uğradı",
                    exception),

                _ => CreateResponse(
                    HttpStatusCode.InternalServerError,
                    "Sunucu hatası oluştu",
                    exception)
            };

            context.Response.StatusCode = (int)response.StatusCode;

            var result = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = null, // PascalCase
                WriteIndented = true
            });

            await context.Response.WriteAsync(result);
        }

        private ApiResponse CreateResponse(HttpStatusCode statusCode, string message, Exception exception)
        {
            var errors = new List<string>();

            // Development'ta detaylı hata bilgisi ver
            if (_environment.IsDevelopment())
            {
                errors.Add($"Exception Type: {exception.GetType().Name}");
                errors.Add($"Message: {exception.Message}");
                
                if (exception.InnerException != null)
                {
                    errors.Add($"Inner Exception: {exception.InnerException.Message}");
                }
                
                if (!string.IsNullOrEmpty(exception.StackTrace))
                {
                    errors.Add($"Stack Trace: {exception.StackTrace}");
                }
            }
            else
            {
                // Production'da sadece genel mesaj
                errors.Add("Detaylı hata bilgisi sistem yöneticisine iletildi.");
            }

            return new ApiResponse
            {
                Success = false,
                Message = message,
                Errors = errors,
                StatusCode = (int)statusCode,
                Timestamp = DateTime.UtcNow
            };
        }
    }

    /// <summary>
    /// Extension method for middleware registration
    /// </summary>
    public static class GlobalExceptionHandlerMiddlewareExtensions
    {
        public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<GlobalExceptionHandlerMiddleware>();
        }
    }
}

