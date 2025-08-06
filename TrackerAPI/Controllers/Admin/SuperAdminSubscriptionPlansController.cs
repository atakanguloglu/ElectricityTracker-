using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Models.Billing;
using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.Services;

namespace ElectricityTrackerAPI.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/subscription-plans")]
    [Authorize(Roles = "SuperAdmin")]
    public class SuperAdminSubscriptionPlansController : Common.BaseController
    {
        private readonly ILogService _logService;

        public SuperAdminSubscriptionPlansController(ApplicationDbContext context, ILogger<SuperAdminSubscriptionPlansController> logger, ILogService logService) 
            : base(context, logger)
        {
            _logService = logService;
        }

        [HttpGet]
        public async Task<IActionResult> GetSubscriptionPlans()
        {
            try
            {
                // Database'den temiz veri çek
                var plans = await _context.SubscriptionPlans
                    .Where(sp => sp.IsActive)
                    .OrderBy(sp => sp.SortOrder)
                    .ThenBy(sp => sp.Name)
                    .ToListAsync();

                // Database'den gelen verilerle response oluştur
                var result = plans.Select(sp => new
                {
                    Id = sp.Id,
                    Type = sp.Type,
                    Name = sp.Name,
                    Description = sp.Description,
                    MonthlyFee = sp.MonthlyFee,
                    Currency = sp.Currency,
                    Features = sp.Features,
                    Limits = sp.Limits,
                    IsActive = sp.IsActive,
                    IsDefault = sp.IsDefault,
                    IsPopular = sp.IsPopular,
                    BadgeText = sp.BadgeText,
                    BadgeColor = sp.BadgeColor,
                    CreatedAt = sp.CreatedAt,
                    UpdatedAt = sp.UpdatedAt,
                    SortOrder = sp.SortOrder
                }).ToList();

                _logService.LogInformation($"Plans retrieved from DB - Count: {result.Count}, IDs: {string.Join(", ", result.Select(r => r.Id))}", "SubscriptionPlansController");
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error retrieving subscription plans", ex, "SubscriptionPlansController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubscriptionPlan(int id)
        {
            try
            {
                var subscriptionPlan = await _context.SubscriptionPlans
                    .FirstOrDefaultAsync(sp => sp.Id == id);

                if (subscriptionPlan == null)
                {
                    return NotFound(new { message = "Subscription plan not found" });
                }

                return Ok(subscriptionPlan);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error retrieving subscription plan", ex, "SubscriptionPlansController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateSubscriptionPlan([FromBody] CreateSubscriptionPlanDto dto)
        {
            try
            {
                var subscriptionPlan = new SubscriptionPlan
                {
                    Name = dto.Name,
                    Type = dto.Type,
                    Description = dto.Description,
                    MonthlyFee = dto.MonthlyFee,
                    Currency = dto.Currency,
                    Features = dto.Features,
                    Limits = dto.Limits,
                    IsActive = dto.IsActive,
                    IsDefault = dto.IsDefault,
                    IsPopular = dto.IsPopular,
                    BadgeText = dto.BadgeText,
                    BadgeColor = dto.BadgeColor,
                    SortOrder = dto.SortOrder
                };

                _context.SubscriptionPlans.Add(subscriptionPlan);
                await _context.SaveChangesAsync();

                _logService.LogInformation($"Subscription plan created: {subscriptionPlan.Name}", "SubscriptionPlansController");
                return CreatedAtAction(nameof(GetSubscriptionPlan), new { id = subscriptionPlan.Id }, subscriptionPlan);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error creating subscription plan", ex, "SubscriptionPlansController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubscriptionPlan(int id, [FromBody] UpdateSubscriptionPlanDto dto)
        {
            try
            {
                var subscriptionPlan = await _context.SubscriptionPlans.FindAsync(id);
                if (subscriptionPlan == null)
                {
                    return NotFound(new { message = "Subscription plan not found" });
                }

                subscriptionPlan.Name = dto.Name;
                subscriptionPlan.Type = dto.Type;
                subscriptionPlan.Description = dto.Description;
                subscriptionPlan.MonthlyFee = dto.MonthlyFee;
                subscriptionPlan.Currency = dto.Currency;
                subscriptionPlan.Features = dto.Features;
                subscriptionPlan.Limits = dto.Limits;
                subscriptionPlan.IsActive = dto.IsActive;
                subscriptionPlan.IsDefault = dto.IsDefault;
                subscriptionPlan.IsPopular = dto.IsPopular;
                subscriptionPlan.BadgeText = dto.BadgeText;
                subscriptionPlan.BadgeColor = dto.BadgeColor;
                subscriptionPlan.SortOrder = dto.SortOrder;
                subscriptionPlan.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logService.LogInformation($"Subscription plan updated: {subscriptionPlan.Name}", "SubscriptionPlansController");
                return Ok(subscriptionPlan);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error updating subscription plan", ex, "SubscriptionPlansController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("type/{type}")]
        public async Task<IActionResult> UpdateSubscriptionPlanByType(string type, [FromBody] UpdateSubscriptionPlanDto dto)
        {
            try
            {
                var subscriptionPlan = await _context.SubscriptionPlans
                    .FirstOrDefaultAsync(sp => sp.Type == type);
                
                if (subscriptionPlan == null)
                {
                    return NotFound(new { message = "Subscription plan not found" });
                }

                subscriptionPlan.Name = dto.Name;
                subscriptionPlan.Type = dto.Type;
                subscriptionPlan.Description = dto.Description;
                subscriptionPlan.MonthlyFee = dto.MonthlyFee;
                subscriptionPlan.Currency = dto.Currency;
                subscriptionPlan.Features = dto.Features;
                subscriptionPlan.Limits = dto.Limits;
                subscriptionPlan.IsActive = dto.IsActive;
                subscriptionPlan.IsDefault = dto.IsDefault;
                subscriptionPlan.IsPopular = dto.IsPopular;
                subscriptionPlan.BadgeText = dto.BadgeText;
                subscriptionPlan.BadgeColor = dto.BadgeColor;
                subscriptionPlan.SortOrder = dto.SortOrder;
                subscriptionPlan.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logService.LogInformation($"Subscription plan updated by type: {subscriptionPlan.Name}", "SubscriptionPlansController");
                return Ok(subscriptionPlan);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error updating subscription plan by type", ex, "SubscriptionPlansController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubscriptionPlan(int id)
        {
            try
            {
                var subscriptionPlan = await _context.SubscriptionPlans.FindAsync(id);
                if (subscriptionPlan == null)
                {
                    return NotFound(new { message = "Subscription plan not found" });
                }

                // Check if subscription plan is being used by tenants
                var isUsedByTenants = await _context.Tenants
                    .AnyAsync(t => t.Subscription.ToString() == subscriptionPlan.Type);

                if (isUsedByTenants)
                {
                    return BadRequest(new { message = "Cannot delete subscription plan that is being used by tenants" });
                }

                _context.SubscriptionPlans.Remove(subscriptionPlan);
                await _context.SaveChangesAsync();

                _logService.LogInformation($"Subscription plan deleted: {subscriptionPlan.Name}", "SubscriptionPlansController");
                return Ok(new { message = "Subscription plan deleted successfully" });
            }
            catch (Exception ex)
            {
                _logService.LogError("Error deleting subscription plan", ex, "SubscriptionPlansController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }

    public class CreateSubscriptionPlanDto
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal MonthlyFee { get; set; }
        public string Currency { get; set; } = "TRY";
        public string Features { get; set; } = string.Empty;
        public string Limits { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public bool IsDefault { get; set; } = false;
        public bool IsPopular { get; set; } = false;
        public string? BadgeText { get; set; }
        public string? BadgeColor { get; set; }
        public int SortOrder { get; set; } = 0;
    }

    public class UpdateSubscriptionPlanDto
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal MonthlyFee { get; set; }
        public string Currency { get; set; } = "TRY";
        public string Features { get; set; } = string.Empty;
        public string Limits { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public bool IsDefault { get; set; } = false;
        public bool IsPopular { get; set; } = false;
        public string? BadgeText { get; set; }
        public string? BadgeColor { get; set; }
        public int SortOrder { get; set; } = 0;
    }

    public class SubscriptionPlanResponseDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal MonthlyFee { get; set; }
        public string Currency { get; set; } = "TRY";
        public string Features { get; set; } = string.Empty;
        public string Limits { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public bool IsDefault { get; set; } = false;
        public bool IsPopular { get; set; } = false;
        public string? BadgeText { get; set; }
        public string? BadgeColor { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int SortOrder { get; set; } = 0;
    }
} 