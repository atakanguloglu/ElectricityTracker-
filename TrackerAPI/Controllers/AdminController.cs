using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Models;
using ElectricityTrackerAPI.Data;

namespace ElectricityTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : BaseController
    {
        public AdminController(ApplicationDbContext context, ILogger<AdminController> logger) 
            : base(context, logger)
        {
        }

        [HttpGet("tenants")]
        public async Task<IActionResult> GetAllTenants()
        {
            try
            {
                var tenants = await _context.Tenants
                    .Include(t => t.Users)
                    .Include(t => t.Facilities)
                    .Include(t => t.Departments)
                    .Select(t => new
                    {
                        t.Id,
                        t.CompanyName,
                        t.ContactPerson,
                        t.Email,
                        t.Phone,
                        t.Address,
                        t.Subdomain,
                        t.CustomDomain,
                        t.Status,
                        t.SubscriptionStartDate,
                        t.SubscriptionEndDate,
                        t.MaxUsers,
                        t.MaxFacilities,
                        UserCount = t.Users.Count,
                        FacilityCount = t.Facilities.Count,
                        DepartmentCount = t.Departments.Count,
                        t.CreatedAt
                    })
                    .ToListAsync();

                return Ok(tenants);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching all tenants");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("tenants/{id}/status")]
        public async Task<IActionResult> UpdateTenantStatus(int id, [FromBody] TenantStatusUpdateDto statusDto)
        {
            try
            {
                var tenant = await _context.Tenants.FindAsync(id);
                
                if (tenant == null)
                {
                    return NotFound(new { message = "Tenant not found" });
                }

                if (Enum.TryParse<TenantStatus>(statusDto.Status, out var newStatus))
                {
                    tenant.Status = newStatus;
                    tenant.UpdatedAt = DateTime.UtcNow;

                    await _context.SaveChangesAsync();

                    return Ok(new { message = "Tenant status updated successfully" });
                }
                else
                {
                    return BadRequest(new { message = "Invalid status value" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating tenant status");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var totalTenants = await _context.Tenants.CountAsync();
                var activeTenants = await _context.Tenants.CountAsync(t => t.Status == TenantStatus.Active);
                var pendingTenants = await _context.Tenants.CountAsync(t => t.Status == TenantStatus.Pending);
                var totalUsers = await _context.Users.CountAsync();
                var totalFacilities = await _context.Facilities.CountAsync();
                var totalDepartments = await _context.Departments.CountAsync();

                var recentTenants = await _context.Tenants
                    .OrderByDescending(t => t.CreatedAt)
                    .Take(5)
                    .Select(t => new
                    {
                        t.Id,
                        t.CompanyName,
                        t.Status,
                        t.CreatedAt
                    })
                    .ToListAsync();

                var stats = new
                {
                    totalTenants,
                    activeTenants,
                    pendingTenants,
                    totalUsers,
                    totalFacilities,
                    totalDepartments,
                    recentTenants
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching dashboard stats");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }

    public class TenantStatusUpdateDto
    {
        public string Status { get; set; } = string.Empty;
    }
} 