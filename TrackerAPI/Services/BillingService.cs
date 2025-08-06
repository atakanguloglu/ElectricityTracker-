using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.Models.Billing;
using ElectricityTrackerAPI.Models.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElectricityTrackerAPI.Services
{
    public class BillingService : IBillingService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<BillingService> _logger;

        public BillingService(ApplicationDbContext context, ILogger<BillingService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<Tenant>> GetTenantsDueForBilling()
        {
            try
            {
                var today = DateTime.UtcNow.Date;
                var nextMonth = today.AddMonths(1);

                // Aktif tenant'ları al ve subscription end date'i yaklaşanları bul
                var tenantsDueForBilling = await _context.Tenants
                    .Where(t => t.IsActive && 
                               t.SubscriptionEndDate.HasValue && 
                               t.SubscriptionEndDate.Value.Date <= nextMonth &&
                               t.SubscriptionEndDate.Value.Date >= today)
                    .ToListAsync();

                _logger.LogInformation($"Found {tenantsDueForBilling.Count} tenants due for billing");
                return tenantsDueForBilling;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting tenants due for billing");
                return new List<Tenant>();
            }
        }

        public async Task<bool> IsInvoiceAlreadyCreated(Tenant tenant, DateTime billingDate)
        {
            try
            {
                var billingPeriod = billingDate.ToString("MMMM yyyy");
                
                var existingInvoice = await _context.Invoices
                    .AnyAsync(i => i.TenantId == tenant.Id && 
                                  i.BillingPeriod == billingPeriod &&
                                  i.Type == InvoiceType.Subscription);

                return existingInvoice;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking if invoice already exists");
                return false;
            }
        }

        public async Task<Invoice> CreateAutomaticInvoice(Tenant tenant, SubscriptionPlan plan)
        {
            try
            {
                var billingDate = DateTime.UtcNow;
                var dueDate = billingDate.AddDays(30); // 30 gün sonra ödeme tarihi
                var billingPeriod = billingDate.ToString("MMMM yyyy");

                // Fatura numarası oluştur
                var invoiceNumber = $"INV-{tenant.Id:D4}-{billingDate:yyyyMM}-{DateTime.UtcNow.Ticks % 10000:D4}";

                var invoice = new Invoice
                {
                    InvoiceNumber = invoiceNumber,
                    InvoiceDate = billingDate,
                    DueDate = dueDate,
                    BillingPeriod = billingPeriod,
                    Currency = plan.Currency ?? "TRY",
                    TaxRate = 20, // %20 KDV
                    Status = InvoiceStatus.Draft,
                    Type = InvoiceType.Subscription,
                    Description = $"{plan.Name} - {billingPeriod} Abonelik Faturası",
                    CustomerName = tenant.CompanyName,
                    CustomerEmail = tenant.AdminEmail,
                    TenantId = tenant.Id,
                    CreatedById = 1, // SuperAdmin
                    CreatedAt = billingDate,
                    SubscriptionPlanId = plan.Id,

                    NetAmount = plan.MonthlyFee,
                    TaxAmount = plan.MonthlyFee * 0.20m,
                    TotalAmount = plan.MonthlyFee * 1.20m
                };

                // Invoice items oluştur
                var invoiceItem = new InvoiceItem
                {
                    Description = $"{plan.Name} - {billingPeriod} Abonelik Ücreti",
                    Quantity = 1,
                    Unit = "Ay",
                    UnitPrice = plan.MonthlyFee,
                    TotalPrice = plan.MonthlyFee,
                    TaxRate = 20,
                    TaxAmount = plan.MonthlyFee * 0.20m,
                    NetAmount = plan.MonthlyFee,
                    ResourceTypeId = 1 // Subscription
                };

                invoice.Items = new List<InvoiceItem> { invoiceItem };

                _context.Invoices.Add(invoice);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Automatic invoice created for tenant {tenant.CompanyName}: {invoiceNumber} - Amount: {invoice.TotalAmount} {invoice.Currency}");

                return invoice;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error creating automatic invoice for tenant {tenant.CompanyName}");
                throw;
            }
        }

        public async Task ProcessAutomaticBilling()
        {
            try
            {
                _logger.LogInformation("Starting automatic billing process...");

                var tenantsDueForBilling = await GetTenantsDueForBilling();
                var createdInvoices = new List<Invoice>();

                foreach (var tenant in tenantsDueForBilling)
                {
                    try
                    {
                        // Bu ay için fatura zaten oluşturulmuş mu kontrol et
                        var billingDate = DateTime.UtcNow;
                        if (await IsInvoiceAlreadyCreated(tenant, billingDate))
                        {
                            _logger.LogInformation($"Invoice already exists for tenant {tenant.CompanyName} for {billingDate:MMMM yyyy}");
                            continue;
                        }

                        // Subscription plan'ı tenant'ın subscription type'ına göre al
                        var plan = await _context.SubscriptionPlans
                            .FirstOrDefaultAsync(p => p.Type == tenant.Subscription.ToString());

                        if (plan == null)
                        {
                            _logger.LogWarning($"No subscription plan found for tenant {tenant.CompanyName} with type {tenant.Subscription}");
                            continue;
                        }

                        // Otomatik fatura oluştur
                        var invoice = await CreateAutomaticInvoice(tenant, plan);
                        createdInvoices.Add(invoice);

                        // Tenant'ın subscription end date'ini güncelle
                        tenant.SubscriptionEndDate = tenant.SubscriptionEndDate?.AddMonths(1) ?? DateTime.UtcNow.AddMonths(1);
                        _context.Tenants.Update(tenant);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Error processing automatic billing for tenant {tenant.CompanyName}");
                    }
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Automatic billing completed. Created {createdInvoices.Count} invoices.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in automatic billing process");
            }
        }
    }
} 