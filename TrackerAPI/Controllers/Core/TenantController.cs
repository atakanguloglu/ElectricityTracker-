using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Models.Core;
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
    }
} 