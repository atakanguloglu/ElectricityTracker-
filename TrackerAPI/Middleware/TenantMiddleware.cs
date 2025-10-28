using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.Services;
using Microsoft.EntityFrameworkCore;

namespace ElectricityTrackerAPI.Middleware
{
    public class TenantMiddleware
    {
        private readonly RequestDelegate _next;

        public TenantMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var tenantId = await ResolveTenantId(context);
            
            if (tenantId.HasValue)
            {
                context.Items["TenantId"] = tenantId.Value;
            }

            await _next(context);
        }

        private async Task<int?> ResolveTenantId(HttpContext context)
        {
            var host = context.Request.Host.Host.ToLower();
            
            // Skip for localhost or IP addresses
            if (host == "localhost" || host.Contains("127.0.0.1") || host.Contains("::1"))
            {
                return null;
            }

            // Cache key
            var cacheKey = $"tenant_{host}";
            var cacheService = context.RequestServices.GetRequiredService<ICacheService>();

            // Try to get from cache first
            var cachedTenantId = cacheService.Get<int?>(cacheKey);
            if (cachedTenantId.HasValue)
            {
                return cachedTenantId.Value;
            }

            // Not in cache, query database
            int? tenantId = null;
            var dbContext = context.RequestServices.GetRequiredService<ApplicationDbContext>();

            // Check for subdomain pattern (e.g., company1.electricitytracker.com)
            var subdomain = ExtractSubdomain(host);
            
            if (!string.IsNullOrEmpty(subdomain))
            {
                var tenant = await dbContext.Tenants
                    .AsNoTracking()
                    .FirstOrDefaultAsync(t => t.Subdomain == subdomain && t.IsActive);
                
                tenantId = tenant?.Id;
            }

            // Check for custom domain if subdomain not found
            if (!tenantId.HasValue)
            {
                var customTenant = await dbContext.Tenants
                    .AsNoTracking()
                    .FirstOrDefaultAsync(t => t.CustomDomain == host && t.IsActive);
                
                tenantId = customTenant?.Id;
            }

            // Cache the result (5 minutes)
            if (tenantId.HasValue)
            {
                cacheService.Set(cacheKey, tenantId, TimeSpan.FromMinutes(5));
            }

            return tenantId;
        }

        private string? ExtractSubdomain(string host)
        {
            var parts = host.Split('.');
            
            // Check if we have a subdomain (at least 3 parts: subdomain.domain.tld)
            if (parts.Length >= 3)
            {
                // Skip common subdomains that aren't tenant-specific
                var subdomain = parts[0];
                var excludedSubdomains = new[] { "www", "api", "admin", "app", "portal" };
                
                if (!excludedSubdomains.Contains(subdomain))
                {
                    return subdomain;
                }
            }
            
            return null;
        }
    }

    public static class TenantMiddlewareExtensions
    {
        public static IApplicationBuilder UseTenantResolution(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<TenantMiddleware>();
        }
    }
} 