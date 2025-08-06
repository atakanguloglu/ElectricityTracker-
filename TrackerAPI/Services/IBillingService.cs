using ElectricityTrackerAPI.Models.Billing;
using ElectricityTrackerAPI.Models.Core;

namespace ElectricityTrackerAPI.Services
{
    public interface IBillingService
    {
        Task<List<Tenant>> GetTenantsDueForBilling();
        Task<Invoice> CreateAutomaticInvoice(Tenant tenant, SubscriptionPlan plan);
        Task ProcessAutomaticBilling();
        Task<bool> IsInvoiceAlreadyCreated(Tenant tenant, DateTime billingDate);
    }
} 