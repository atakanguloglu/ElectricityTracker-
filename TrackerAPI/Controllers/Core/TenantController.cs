using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Models.Core;
using ElectricityTrackerAPI.Models.Billing;
using ElectricityTrackerAPI.DTOs.Core;
using ElectricityTrackerAPI.Data;
using System.Security.Claims;

namespace ElectricityTrackerAPI.Controllers.Core
{
    [ApiController]
    [Route("api/[controller]")]
    public class TenantController : Common.BaseController
    {
        public TenantController(ApplicationDbContext context, ILogger<TenantController> logger) 
            : base(context, logger)
        {
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterTenant([FromBody] TenantRegistrationDto registrationDto)
        {
            try
            {
                // Check if subdomain is already taken
                if (!string.IsNullOrEmpty(registrationDto.Subdomain))
                {
                    var existingTenant = await _context.Tenants
                        .FirstOrDefaultAsync(t => t.Subdomain == registrationDto.Subdomain);
                    
                    if (existingTenant != null)
                    {
                        return BadRequest(new { message = "Subdomain already taken" });
                    }
                }

                // Check if custom domain is already taken
                if (!string.IsNullOrEmpty(registrationDto.CustomDomain))
                {
                    var existingTenant = await _context.Tenants
                        .FirstOrDefaultAsync(t => t.CustomDomain == registrationDto.CustomDomain);
                    
                    if (existingTenant != null)
                    {
                        return BadRequest(new { message = "Custom domain already taken" });
                    }
                }

                var tenant = new Tenant
                {
                    CompanyName = registrationDto.CompanyName,
                    ContactPerson = registrationDto.ContactPerson,
                    AdminEmail = registrationDto.Email,
                    Phone = registrationDto.Phone,
                    Address = registrationDto.Address,
                    TaxNumber = registrationDto.TaxNumber,
                    TaxOffice = registrationDto.TaxOffice,
                    Subdomain = registrationDto.Subdomain,
                    CustomDomain = registrationDto.CustomDomain,
                    Status = TenantStatus.Pending,
                    SubscriptionStartDate = DateTime.UtcNow,
                    SubscriptionEndDate = DateTime.UtcNow.AddYears(1),
                    MaxUsers = registrationDto.MaxUsers ?? 10,
                    MaxFacilities = registrationDto.MaxFacilities ?? 5,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Tenants.Add(tenant);
                await _context.SaveChangesAsync();

                // Create default admin user
                var adminUser = new User
                {
                    FirstName = registrationDto.AdminFirstName,
                    LastName = registrationDto.AdminLastName,
                    Email = registrationDto.AdminEmail,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(registrationDto.AdminPassword),
                    Role = UserRole.Admin,
                    TenantId = tenant.Id,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(adminUser);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Tenant registered successfully", 
                    tenantId = tenant.Id,
                    status = "Pending approval"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering tenant");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("info")]
        public async Task<IActionResult> GetTenantInfo()
        {
            var tenantId = GetCurrentTenantId();
            
            if (!tenantId.HasValue)
            {
                return TenantNotFound();
            }

            var tenant = await _context.Tenants
                .Include(t => t.Users)
                .Include(t => t.Facilities)
                .Include(t => t.Departments)
                .FirstOrDefaultAsync(t => t.Id == tenantId.Value);

            if (tenant == null)
            {
                return TenantNotFound();
            }

            var tenantInfo = new
            {
                tenant.Id,
                tenant.CompanyName,
                tenant.ContactPerson,
                tenant.AdminEmail,
                tenant.Phone,
                tenant.Address,
                tenant.Subdomain,
                tenant.CustomDomain,
                tenant.Status,
                tenant.SubscriptionStartDate,
                tenant.SubscriptionEndDate,
                tenant.MaxUsers,
                tenant.MaxFacilities,
                UserCount = tenant.Users.Count,
                FacilityCount = tenant.Facilities.Count,
                DepartmentCount = tenant.Departments.Count,
                tenant.CreatedAt
            };

            return Ok(tenantInfo);
        }

        [HttpPut("update")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateTenant([FromBody] TenantUpdateDto updateDto)
        {
            var tenantId = GetCurrentTenantId();
            
            if (!tenantId.HasValue)
            {
                return TenantNotFound();
            }

            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Id == tenantId.Value);

            if (tenant == null)
            {
                return TenantNotFound();
            }

            // Update allowed fields
            if (!string.IsNullOrEmpty(updateDto.ContactPerson))
                tenant.ContactPerson = updateDto.ContactPerson;
            
            if (!string.IsNullOrEmpty(updateDto.Phone))
                tenant.Phone = updateDto.Phone;
            
            if (!string.IsNullOrEmpty(updateDto.Address))
                tenant.Address = updateDto.Address;

            tenant.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Tenant updated successfully" });
        }

        [HttpGet("users")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetTenantUsers()
        {
            var tenantId = GetCurrentTenantId();
            
            if (!tenantId.HasValue)
            {
                return TenantNotFound();
            }

            var users = await _context.Users
                .Include(u => u.Department)
                .Where(u => u.TenantId == tenantId.Value)
                .Select(u => new
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.Phone,
                    u.Role,
                    u.IsActive,
                    DepartmentName = u.Department != null ? u.Department.Name : null,
                    u.CreatedAt,
                    u.LastLoginAt
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("departments")]
        public async Task<IActionResult> GetTenantDepartments()
        {
            var tenantId = GetCurrentTenantId();
            
            if (!tenantId.HasValue)
            {
                return TenantNotFound();
            }

            var departments = await _context.Departments
                .Where(d => d.TenantId == tenantId.Value && d.IsActive)
                .Select(d => new
                {
                    d.Id,
                    d.Name,
                    d.Description,
                    d.ManagerName,
                    d.ManagerEmail,
                    UserCount = d.Users.Count,
                    FacilityCount = d.Facilities.Count
                })
                .ToListAsync();

            return Ok(departments);
        }

        // Subscription endpoints
        [HttpGet("subscription")]
        public async Task<IActionResult> GetTenantSubscription()
        {
            var tenantId = GetCurrentTenantId();
            
            if (!tenantId.HasValue)
            {
                return TenantNotFound();
            }

            var tenant = await _context.Tenants
                .Include(t => t.Users)
                .Include(t => t.Facilities)
                .FirstOrDefaultAsync(t => t.Id == tenantId.Value);

            if (tenant == null)
            {
                return TenantNotFound();
            }

            // Get subscription plan
            var subscriptionPlan = await _context.SubscriptionPlans
                .FirstOrDefaultAsync(sp => sp.Type == tenant.Subscription.ToString());

            if (subscriptionPlan == null)
            {
                return NotFound(new { message = "Subscription plan not found" });
            }

            // Parse limits
            var limits = new
            {
                users = subscriptionPlan.Limits.Contains("\"users\"") ? 
                    int.Parse(System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(subscriptionPlan.Limits)["users"].ToString()) : -1,
                facilities = subscriptionPlan.Limits.Contains("\"facilities\"") ? 
                    int.Parse(System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(subscriptionPlan.Limits)["facilities"].ToString()) : -1,
                api_calls = subscriptionPlan.Limits.Contains("\"api_calls\"") ? 
                    int.Parse(System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(subscriptionPlan.Limits)["api_calls"].ToString()) : -1,
                storage_gb = subscriptionPlan.Limits.Contains("\"storage_gb\"") ? 
                    int.Parse(System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(subscriptionPlan.Limits)["storage_gb"].ToString()) : -1
            };

            // Parse features
            var features = !string.IsNullOrEmpty(subscriptionPlan.Features) ? 
                System.Text.Json.JsonSerializer.Deserialize<string[]>(subscriptionPlan.Features) : new string[0];

            var subscriptionInfo = new
            {
                tenantId = tenant.Id,
                subscriptionType = tenant.Subscription.ToString(),
                subscriptionStartDate = tenant.SubscriptionStartDate.ToString("yyyy-MM-dd"),
                subscriptionEndDate = tenant.SubscriptionEndDate?.ToString("yyyy-MM-dd"),
                maxUsers = tenant.MaxUsers,
                maxFacilities = tenant.MaxFacilities,
                monthlyFee = subscriptionPlan.MonthlyFee,
                currency = subscriptionPlan.Currency,
                paymentStatus = tenant.PaymentStatus.ToString(),
                lastPayment = tenant.LastPayment?.ToString("yyyy-MM-dd"),
                currentUsage = new
                {
                    users = tenant.Users.Count,
                    facilities = tenant.Facilities.Count,
                    apiCalls = 0, // TODO: Implement API call tracking
                    storageUsed = 0 // TODO: Implement storage tracking
                },
                subscriptionPlan = new
                {
                    id = subscriptionPlan.Id,
                    type = subscriptionPlan.Type,
                    name = subscriptionPlan.Name,
                    description = subscriptionPlan.Description,
                    monthlyFee = subscriptionPlan.MonthlyFee,
                    features = features,
                    limits = limits,
                    currency = subscriptionPlan.Currency,
                    isActive = subscriptionPlan.IsActive
                }
            };

            return Ok(subscriptionInfo);
        }

        [HttpPost("change-plan")]
        public async Task<IActionResult> ChangeTenantPlan([FromBody] ChangePlanDto changePlanDto)
        {
            var tenantId = GetCurrentTenantId();
            
            if (!tenantId.HasValue)
            {
                return TenantNotFound();
            }

            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Id == tenantId.Value);

            if (tenant == null)
            {
                return TenantNotFound();
            }

            // Check if new plan exists
            var newPlan = await _context.SubscriptionPlans
                .FirstOrDefaultAsync(sp => sp.Type == changePlanDto.NewPlanType);

            if (newPlan == null)
            {
                return BadRequest(new { message = "Invalid plan type" });
            }

            // Update tenant subscription
            tenant.Subscription = Enum.Parse<SubscriptionType>(changePlanDto.NewPlanType);
            tenant.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Plan changed successfully",
                newPlan = new
                {
                    id = newPlan.Id,
                    type = newPlan.Type,
                    name = newPlan.Name,
                    description = newPlan.Description,
                    monthlyFee = newPlan.MonthlyFee,
                    currency = newPlan.Currency
                },
                effectiveDate = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-dd")
            });
        }

        [HttpGet("usage-stats")]
        public async Task<IActionResult> GetTenantUsageStats()
        {
            var tenantId = GetCurrentTenantId();
            
            if (!tenantId.HasValue)
            {
                return TenantNotFound();
            }

            var tenant = await _context.Tenants
                .Include(t => t.Users)
                .Include(t => t.Facilities)
                .FirstOrDefaultAsync(t => t.Id == tenantId.Value);

            if (tenant == null)
            {
                return TenantNotFound();
            }

            var usageStats = new
            {
                users = tenant.Users.Count,
                facilities = tenant.Facilities.Count,
                apiCalls = 0, // TODO: Implement API call tracking
                storageUsed = 0, // TODO: Implement storage tracking
                lastUpdated = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss")
            };

            return Ok(usageStats);
        }

        [HttpGet("usage-limits")]
        public async Task<IActionResult> GetTenantUsageLimits()
        {
            var tenantId = GetCurrentTenantId();
            
            if (!tenantId.HasValue)
            {
                return TenantNotFound();
            }

            var tenant = await _context.Tenants
                .Include(t => t.Users)
                .Include(t => t.Facilities)
                .FirstOrDefaultAsync(t => t.Id == tenantId.Value);

            if (tenant == null)
            {
                return TenantNotFound();
            }

            var subscriptionPlan = await _context.SubscriptionPlans
                .FirstOrDefaultAsync(sp => sp.Type == tenant.Subscription.ToString());

            if (subscriptionPlan == null)
            {
                return NotFound(new { message = "Subscription plan not found" });
            }

            // Parse limits
            var limits = new
            {
                users = subscriptionPlan.Limits.Contains("\"users\"") ? 
                    int.Parse(System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(subscriptionPlan.Limits)["users"].ToString()) : -1,
                facilities = subscriptionPlan.Limits.Contains("\"facilities\"") ? 
                    int.Parse(System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(subscriptionPlan.Limits)["facilities"].ToString()) : -1,
                api_calls = subscriptionPlan.Limits.Contains("\"api_calls\"") ? 
                    int.Parse(System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(subscriptionPlan.Limits)["api_calls"].ToString()) : -1,
                storage_gb = subscriptionPlan.Limits.Contains("\"storage_gb\"") ? 
                    int.Parse(System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(subscriptionPlan.Limits)["storage_gb"].ToString()) : -1
            };

            var usageLimits = new
            {
                users = new
                {
                    current = tenant.Users.Count,
                    limit = limits.users,
                    remaining = limits.users == -1 ? -1 : Math.Max(0, limits.users - tenant.Users.Count),
                    percentage = limits.users == -1 ? 0 : Math.Min(100, (tenant.Users.Count * 100) / limits.users)
                },
                facilities = new
                {
                    current = tenant.Facilities.Count,
                    limit = limits.facilities,
                    remaining = limits.facilities == -1 ? -1 : Math.Max(0, limits.facilities - tenant.Facilities.Count),
                    percentage = limits.facilities == -1 ? 0 : Math.Min(100, (tenant.Facilities.Count * 100) / limits.facilities)
                },
                apiCalls = new
                {
                    current = 0, // TODO: Implement API call tracking
                    limit = limits.api_calls,
                    remaining = limits.api_calls == -1 ? -1 : Math.Max(0, limits.api_calls - 0),
                    percentage = limits.api_calls == -1 ? 0 : 0
                },
                storage = new
                {
                    current = 0, // TODO: Implement storage tracking
                    limit = limits.storage_gb,
                    remaining = limits.storage_gb == -1 ? -1 : Math.Max(0, limits.storage_gb - 0),
                    percentage = limits.storage_gb == -1 ? 0 : 0
                }
            };

            return Ok(usageLimits);
        }
    }
} 