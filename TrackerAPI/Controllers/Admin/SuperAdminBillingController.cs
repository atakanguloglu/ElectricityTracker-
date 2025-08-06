using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Models.Billing;
using ElectricityTrackerAPI.Models.Energy;
using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.Services;
using ElectricityTrackerAPI.DTOs.Billing;

namespace ElectricityTrackerAPI.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/billing")]
    [Authorize(Roles = "SuperAdmin")]
    public class SuperAdminBillingController : Common.BaseController
    {
        private readonly ILogService _logService;
        private readonly IBillingService _billingService;

        public SuperAdminBillingController(ApplicationDbContext context, ILogger<SuperAdminBillingController> logger, ILogService logService, IBillingService billingService) 
            : base(context, logger)
        {
            _logService = logService;
            _billingService = billingService;
        }

        #region Invoices

        [HttpGet("invoices")]
        public async Task<IActionResult> GetInvoices(
            [FromQuery] int? tenantId = null,
            [FromQuery] int? status = null,
            [FromQuery] int? subscriptionPlanId = null,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string? searchText = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var query = _context.Invoices
                    .Include(i => i.Tenant)
                    .Include(i => i.CreatedBy)
                    .Include(i => i.Items)
                    .Include(i => i.Payments)
                    .AsQueryable();

                // Apply filters
                if (tenantId.HasValue)
                    query = query.Where(i => i.TenantId == tenantId.Value);

                if (status.HasValue)
                    query = query.Where(i => (int)i.Status == status.Value);

                if (subscriptionPlanId.HasValue)
                    query = query.Where(i => i.SubscriptionPlanId == subscriptionPlanId.Value);

                if (startDate.HasValue)
                    query = query.Where(i => i.InvoiceDate >= startDate.Value);

                if (endDate.HasValue)
                    query = query.Where(i => i.InvoiceDate <= endDate.Value);

                if (!string.IsNullOrEmpty(searchText))
                {
                    query = query.Where(i => 
                        i.InvoiceNumber.Contains(searchText) ||
                        i.Tenant.CompanyName.Contains(searchText) ||
                        i.Description.Contains(searchText)
                    );
                }

                // Get total count
                var totalCount = await query.CountAsync();

                // Apply pagination
                var invoices = await query
                    .OrderByDescending(i => i.InvoiceDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(i => new
                    {
                        i.Id,
                        i.InvoiceNumber,
                        i.InvoiceDate,
                        i.DueDate,
                        i.TotalAmount,
                        i.TaxAmount,
                        i.NetAmount,
                        i.Currency,
                        i.TaxRate,
                        i.Status,
                        i.Type,
                        i.Description,
                        CustomerName = i.Tenant.CompanyName,
                        CustomerEmail = i.Tenant.AdminEmail,
                        TenantId = i.TenantId,
                        TenantName = i.Tenant.CompanyName,
                        CreatedById = i.CreatedById,
                        CreatedByName = i.CreatedBy != null ? $"{i.CreatedBy.FirstName} {i.CreatedBy.LastName}" : "Sistem",
                        i.CreatedAt,
                        i.UpdatedAt,
                        i.PaidAt,
                        i.SubscriptionPlanId,
                        SubscriptionPlanName = i.SubscriptionPlan != null ? i.SubscriptionPlan.Name : null,
                        i.BillingPeriod,
                        ItemsCount = i.Items.Count,
                        PaymentsCount = i.Payments.Count,
                        TotalPaid = i.Payments.Where(p => p.Status == PaymentStatus.Completed).Sum(p => p.Amount)
                    })
                    .ToListAsync();

                var result = new
                {
                    items = invoices,
                    totalCount,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                };

                _logService.LogInformation($"Invoices retrieved - Page: {page}, Count: {invoices.Count}", "BillingController");
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error retrieving invoices", ex, "BillingController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("invoices/{id}")]
        public async Task<IActionResult> GetInvoice(int id)
        {
            try
            {
                var invoice = await _context.Invoices
                    .Include(i => i.Tenant)
                    .Include(i => i.CreatedBy)
                    .Include(i => i.Items)
                    .Include(i => i.Payments)
                    .Include(i => i.SubscriptionPlan)
                    .FirstOrDefaultAsync(i => i.Id == id);

                if (invoice == null)
                {
                    return NotFound(new { message = "Invoice not found" });
                }

                var result = new
                {
                    invoice.Id,
                    invoice.InvoiceNumber,
                    invoice.InvoiceDate,
                    invoice.DueDate,
                    invoice.TotalAmount,
                    invoice.TaxAmount,
                    invoice.NetAmount,
                    invoice.Currency,
                    invoice.TaxRate,
                    invoice.Status,
                    invoice.Type,
                    invoice.Description,
                    CustomerName = invoice.Tenant.CompanyName,
                    CustomerEmail = invoice.Tenant.AdminEmail,
                    TenantId = invoice.TenantId,
                    TenantName = invoice.Tenant.CompanyName,
                    CreatedById = invoice.CreatedById,
                    CreatedByName = invoice.CreatedBy != null ? $"{invoice.CreatedBy.FirstName} {invoice.CreatedBy.LastName}" : "Sistem",
                    invoice.CreatedAt,
                    invoice.UpdatedAt,
                    invoice.PaidAt,
                    invoice.SubscriptionPlanId,
                    SubscriptionPlanName = invoice.SubscriptionPlan?.Name,
                    invoice.BillingPeriod,
                    Items = invoice.Items.Select(item => new
                    {
                        item.Id,
                        item.Description,
                        item.Quantity,
                        item.Unit,
                        item.UnitPrice,
                        item.TotalPrice,
                        item.TaxRate,
                        item.TaxAmount,
                        item.NetAmount,
                        item.ConsumptionStartDate,
                        item.ConsumptionEndDate,
                        item.Notes
                    }),
                    Payments = invoice.Payments.Select(payment => new
                    {
                        payment.Id,
                        payment.Amount,
                        payment.Currency,
                        payment.Method,
                        payment.Status,
                        payment.TransactionId,
                        payment.ReferenceNumber,
                        payment.Notes,
                        payment.PaymentDate,
                        payment.ProcessedDate
                    })
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error retrieving invoice", ex, "BillingController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("invoices")]
        public async Task<IActionResult> CreateInvoice([FromBody] CreateInvoiceDto dto)
        {
            try
            {
                // Validate tenant exists
                var tenant = await _context.Tenants.FindAsync(dto.TenantId);
                if (tenant == null)
                {
                    return BadRequest(new { message = "Tenant not found" });
                }

                // Validate subscription plan exists
                var subscriptionPlan = await _context.SubscriptionPlans.FindAsync(dto.SubscriptionPlanId);
                if (subscriptionPlan == null)
                {
                    return BadRequest(new { message = "Subscription plan not found" });
                }

                // Generate invoice number
                var invoiceNumber = await GenerateInvoiceNumber(dto.TenantId);

                var invoice = new Invoice
                {
                    InvoiceNumber = invoiceNumber,
                    InvoiceDate = DateTime.Parse(dto.InvoiceDate),
                    DueDate = DateTime.Parse(dto.DueDate),
                    TotalAmount = dto.TotalAmount,
                    TaxAmount = dto.TaxAmount,
                    NetAmount = dto.NetAmount,
                    Currency = dto.Currency,
                    TaxRate = dto.TaxRate,
                    Status = InvoiceStatus.Draft,
                    Type = InvoiceType.Subscription, // Uygulama kullanım bedeli
                    Description = dto.Description,
                    CustomerName = tenant.CompanyName,
                    CustomerEmail = tenant.AdminEmail,
                    TenantId = dto.TenantId,
                    SubscriptionPlanId = dto.SubscriptionPlanId,
                    BillingPeriod = dto.BillingPeriod,
                    CreatedById = GetCurrentUserId()
                };

                _context.Invoices.Add(invoice);
                await _context.SaveChangesAsync();

                // Add invoice items
                if (dto.Items != null && dto.Items.Any())
                {
                    foreach (var itemDto in dto.Items)
                    {
                        var item = new InvoiceItem
                        {
                            InvoiceId = invoice.Id,
                            Description = itemDto.Description,
                            Quantity = itemDto.Quantity,
                            Unit = "Adet",
                            UnitPrice = itemDto.UnitPrice,
                            TotalPrice = itemDto.Quantity * itemDto.UnitPrice,
                            TaxRate = dto.TaxRate,
                            TaxAmount = (itemDto.Quantity * itemDto.UnitPrice * dto.TaxRate) / 100,
                            NetAmount = itemDto.Quantity * itemDto.UnitPrice,
                            ResourceTypeId = itemDto.ResourceTypeId,
                            ConsumptionStartDate = null,
                            ConsumptionEndDate = null,
                            Notes = null
                        };
                        _context.InvoiceItems.Add(item);
                    }
                    await _context.SaveChangesAsync();
                }

                _logService.LogInformation($"Invoice created: {invoice.InvoiceNumber}", "BillingController");
                return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, invoice);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error creating invoice", ex, "BillingController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("invoices/{id}")]
        public async Task<IActionResult> UpdateInvoice(int id, [FromBody] UpdateInvoiceDto dto)
        {
            try
            {
                var invoice = await _context.Invoices.FindAsync(id);
                if (invoice == null)
                {
                    return NotFound(new { message = "Invoice not found" });
                }

                // Update invoice properties
                invoice.InvoiceDate = DateTime.Parse(dto.InvoiceDate);
                invoice.DueDate = DateTime.Parse(dto.DueDate);
                invoice.TotalAmount = dto.TotalAmount;
                invoice.TaxAmount = dto.TaxAmount;
                invoice.NetAmount = dto.NetAmount;
                invoice.Currency = dto.Currency;
                invoice.TaxRate = dto.TaxRate;
                invoice.Status = (InvoiceStatus)dto.Status;
                invoice.Type = (InvoiceType)dto.Type;
                invoice.Description = dto.Description;
                invoice.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logService.LogInformation($"Invoice updated: {invoice.InvoiceNumber}", "BillingController");
                return Ok(invoice);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error updating invoice", ex, "BillingController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpDelete("invoices/{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            try
            {
                var invoice = await _context.Invoices.FindAsync(id);
                if (invoice == null)
                {
                    return NotFound(new { message = "Invoice not found" });
                }

                // Check if invoice can be deleted
                if (invoice.Status == InvoiceStatus.Paid)
                {
                    return BadRequest(new { message = "Cannot delete paid invoice" });
                }

                _context.Invoices.Remove(invoice);
                await _context.SaveChangesAsync();

                _logService.LogInformation($"Invoice deleted: {invoice.InvoiceNumber}", "BillingController");
                return Ok(new { message = "Invoice deleted successfully" });
            }
            catch (Exception ex)
            {
                _logService.LogError("Error deleting invoice", ex, "BillingController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("invoices/{id}/send")]
        public async Task<IActionResult> SendInvoice(int id)
        {
            try
            {
                var invoice = await _context.Invoices
                    .Include(i => i.Tenant)
                    .FirstOrDefaultAsync(i => i.Id == id);

                if (invoice == null)
                {
                    return NotFound(new { message = "Invoice not found" });
                }

                // Update invoice status to sent
                invoice.Status = InvoiceStatus.Sent;
                invoice.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // TODO: Send email notification to tenant
                // await _emailService.SendInvoiceEmail(invoice);

                _logService.LogInformation($"Invoice sent: {invoice.InvoiceNumber}", "BillingController");
                return Ok(new { message = "Invoice sent successfully" });
            }
            catch (Exception ex)
            {
                _logService.LogError("Error sending invoice", ex, "BillingController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        #endregion

        #region Automatic Billing

        [HttpPost("process-automatic-billing")]
        public async Task<IActionResult> ProcessAutomaticBilling()
        {
            try
            {
                _logger.LogInformation("Manual automatic billing process triggered by SuperAdmin");
                
                await _billingService.ProcessAutomaticBilling();
                
                _logService.LogInformation(
                    "Automatic billing process completed - SuperAdmin triggered automatic billing process",
                    "SuperAdminBillingController"
                );

                return Ok(new { message = "Automatic billing process completed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in manual automatic billing process");
                
                _logService.LogError(
                    "Automatic billing process failed",
                    ex,
                    "SuperAdminBillingController"
                );

                return StatusCode(500, new { error = "Automatic billing process failed", details = ex.Message });
            }
        }

        [HttpGet("tenants-due-for-billing")]
        public async Task<IActionResult> GetTenantsDueForBilling()
        {
            try
            {
                var tenants = await _billingService.GetTenantsDueForBilling();
                
                var result = tenants.Select(t => new
                {
                    t.Id,
                    t.CompanyName,
                    t.AdminEmail,
                    t.Subscription,
                    t.SubscriptionEndDate,
                    t.MonthlyFee,
                    t.Currency,
                    t.IsActive
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting tenants due for billing");
                return StatusCode(500, new { error = "Failed to get tenants due for billing", details = ex.Message });
            }
        }

        #endregion

        #region Statistics

        [HttpGet("statistics")]
        public async Task<IActionResult> GetBillingStatistics(
            [FromQuery] int? tenantId = null,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var query = _context.Invoices.AsQueryable();

                if (tenantId.HasValue)
                    query = query.Where(i => i.TenantId == tenantId.Value);

                if (startDate.HasValue)
                    query = query.Where(i => i.InvoiceDate >= startDate.Value);

                if (endDate.HasValue)
                    query = query.Where(i => i.InvoiceDate <= endDate.Value);

                var totalInvoices = await query.CountAsync();
                var totalAmount = await query.SumAsync(i => i.TotalAmount);
                var paidInvoices = await query.Where(i => i.Status == InvoiceStatus.Paid).CountAsync();
                var overdueInvoices = await query.Where(i => i.Status == InvoiceStatus.Overdue).CountAsync();

                // This month statistics
                var thisMonthStart = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, DateTimeKind.Utc);
                var thisMonthInvoices = await query.Where(i => i.InvoiceDate >= thisMonthStart).CountAsync();
                var thisMonthRevenue = await query.Where(i => i.InvoiceDate >= thisMonthStart).SumAsync(i => i.TotalAmount);

                // Pending invoices
                var pendingInvoices = await query.Where(i => i.Status == InvoiceStatus.Sent || i.Status == InvoiceStatus.Draft).CountAsync();
                var pendingAmount = await query.Where(i => i.Status == InvoiceStatus.Sent || i.Status == InvoiceStatus.Draft).SumAsync(i => i.TotalAmount);

                var statusBreakdown = await query
                    .GroupBy(i => i.Status)
                    .Select(g => new { Status = g.Key, Count = g.Count() })
                    .ToListAsync();

                var typeBreakdown = await query
                    .GroupBy(i => i.Type)
                    .Select(g => new { Type = g.Key, Count = g.Count(), TotalAmount = g.Sum(i => i.TotalAmount) })
                    .ToListAsync();

                var monthlyBreakdown = await query
                    .GroupBy(i => new { Year = i.InvoiceDate.Year, Month = i.InvoiceDate.Month })
                    .Select(g => new
                    {
                        Year = g.Key.Year,
                        Month = g.Key.Month,
                        Count = g.Count(),
                        TotalAmount = g.Sum(i => i.TotalAmount)
                    })
                    .OrderByDescending(x => x.Year)
                    .ThenByDescending(x => x.Month)
                    .Take(12)
                    .ToListAsync();

                var result = new
                {
                    totalInvoices,
                    totalAmount,
                    paidInvoices,
                    overdueInvoices,
                    thisMonthInvoices,
                    thisMonthRevenue,
                    pendingInvoices,
                    pendingAmount,
                    paidRate = totalInvoices > 0 ? (double)paidInvoices / totalInvoices * 100 : 0,
                    statusBreakdown,
                    typeBreakdown,
                    monthlyBreakdown
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error retrieving billing statistics", ex, "BillingController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        #endregion

        #region Helper Methods

        private async Task<string> GenerateInvoiceNumber(int tenantId)
        {
            var tenant = await _context.Tenants.FindAsync(tenantId);
            var prefix = tenant?.CompanyName?.Substring(0, Math.Min(3, tenant.CompanyName.Length)).ToUpper() ?? "INV";
            var year = DateTime.Now.Year;
            var month = DateTime.Now.Month.ToString("00");

            var lastInvoice = await _context.Invoices
                .Where(i => i.TenantId == tenantId && i.InvoiceNumber.StartsWith($"{prefix}-{year}{month}"))
                .OrderByDescending(i => i.InvoiceNumber)
                .FirstOrDefaultAsync();

            int sequence = 1;
            if (lastInvoice != null)
            {
                var lastSequence = lastInvoice.InvoiceNumber.Split('-').Last();
                if (int.TryParse(lastSequence, out int lastNum))
                {
                    sequence = lastNum + 1;
                }
            }

            return $"{prefix}-{year}{month}-{sequence:D4}";
        }

        #endregion
    }
} 