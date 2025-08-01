using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ElectricityTrackerAPI.Data;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Models.Core;

namespace ElectricityTrackerAPI.Controllers.Common
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public abstract class BaseController : ControllerBase
    {
        protected readonly ApplicationDbContext _context;
        protected readonly ILogger<BaseController> _logger;

        protected BaseController(ApplicationDbContext context, ILogger<BaseController> logger)
        {
            _context = context;
            _logger = logger;
        }

        protected int? GetCurrentTenantId()
        {
            if (HttpContext.Items.TryGetValue("TenantId", out var tenantId))
            {
                return (int)tenantId;
            }
            return null;
        }

        protected int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                return userId;
            }
            return null;
        }

        protected async Task<bool> ValidateTenantAccess(int? tenantId)
        {
            if (!tenantId.HasValue)
            {
                return false;
            }

            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Id == tenantId.Value && t.IsActive);

            return tenant != null && tenant.Status == TenantStatus.Active;
        }

        protected async Task<bool> ValidateUserTenantAccess(int userId, int? tenantId)
        {
            if (!tenantId.HasValue)
            {
                return false;
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId && u.TenantId == tenantId.Value && u.IsActive);

            return user != null;
        }

        protected async Task<bool> ValidateUserDepartmentAccess(int userId, int? departmentId)
        {
            if (!departmentId.HasValue)
            {
                return true; // No department restriction
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId && u.DepartmentId == departmentId.Value && u.IsActive);

            return user != null;
        }

        protected IActionResult TenantNotFound()
        {
            return NotFound(new { message = "Tenant not found or inactive" });
        }

        protected IActionResult UnauthorizedTenant()
        {
            return Unauthorized(new { message = "Unauthorized access to tenant" });
        }

        protected IActionResult DepartmentAccessDenied()
        {
            return Forbid("Department access denied");
        }
    }
} 