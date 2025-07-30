using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using ElectricityTrackerAPI.Data;
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

            // Check for subdomain pattern (e.g., company1.electricitytracker.com)
            var subdomain = ExtractSubdomain(host);
            
            if (!string.IsNullOrEmpty(subdomain))
            {
                var dbContext = context.RequestServices.GetRequiredService<ApplicationDbContext>();
                var tenant = await dbContext.Tenants
                    .FirstOrDefaultAsync(t => t.Subdomain == subdomain && t.IsActive);
                
                return tenant?.Id;
            }

            // Check for custom domain
            var dbContext2 = context.RequestServices.GetRequiredService<ApplicationDbContext>();
            var customTenant = await dbContext2.Tenants
                .FirstOrDefaultAsync(t => t.CustomDomain == host && t.IsActive);
            
            return customTenant?.Id;
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