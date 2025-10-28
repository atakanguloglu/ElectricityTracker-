using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Models.Billing;
using ElectricityTrackerAPI.Data;

namespace ElectricityTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubscriptionPlansController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<SubscriptionPlansController> _logger;

        public SubscriptionPlansController(ApplicationDbContext context, ILogger<SubscriptionPlansController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAvailablePlans()
        {
            try
            {
                var plans = await _context.SubscriptionPlans
                    .Where(sp => sp.IsActive)
                    .OrderBy(sp => sp.SortOrder)
                    .Select(sp => new
                    {
                        id = sp.Id,
                        type = sp.Type,
                        name = sp.Name,
                        description = sp.Description,
                        monthlyFee = sp.MonthlyFee,
                        features = sp.Features,
                        limits = sp.Limits,
                        currency = sp.Currency,
                        isActive = sp.IsActive,
                        isDefault = sp.IsDefault,
                        isPopular = sp.IsPopular,
                        badgeText = sp.BadgeText,
                        badgeColor = sp.BadgeColor
                    })
                    .ToListAsync();

                return Ok(plans);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving subscription plans");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("compare")]
        public async Task<IActionResult> ComparePlans()
        {
            try
            {
                var plans = await _context.SubscriptionPlans
                    .Where(sp => sp.IsActive)
                    .OrderBy(sp => sp.SortOrder)
                    .ToListAsync();

                // Parse features and limits for comparison
                var comparisonData = new List<object>();
                
                // Get all unique features
                var allFeatures = new HashSet<string>();
                foreach (var plan in plans)
                {
                    if (!string.IsNullOrEmpty(plan.Features))
                    {
                        try
                        {
                            var features = System.Text.Json.JsonSerializer.Deserialize<string[]>(plan.Features);
                            if (features != null)
                            {
                                foreach (var feature in features)
                                {
                                    allFeatures.Add(feature);
                                }
                            }
                        }
                        catch
                        {
                            // Skip invalid JSON
                        }
                    }
                }

                // Create comparison matrix
                var comparison = allFeatures.Select(feature => new
                {
                    feature = feature,
                    basic = plans.Any(p => p.Type == "Basic" && 
                        !string.IsNullOrEmpty(p.Features) && 
                        p.Features.Contains(feature)),
                    standard = plans.Any(p => p.Type == "Standard" && 
                        !string.IsNullOrEmpty(p.Features) && 
                        p.Features.Contains(feature)),
                    premium = plans.Any(p => p.Type == "Premium" && 
                        !string.IsNullOrEmpty(p.Features) && 
                        p.Features.Contains(feature))
                }).ToList();

                var result = new
                {
                    plans = plans.Select(p => new
                    {
                        id = p.Id,
                        type = p.Type,
                        name = p.Name,
                        description = p.Description,
                        monthlyFee = p.MonthlyFee,
                        currency = p.Currency,
                        isDefault = p.IsDefault,
                        isPopular = p.IsPopular,
                        badgeText = p.BadgeText,
                        badgeColor = p.BadgeColor
                    }),
                    comparison = comparison
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error comparing subscription plans");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}
