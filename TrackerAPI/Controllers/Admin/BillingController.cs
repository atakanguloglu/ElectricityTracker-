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
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    public class BillingController : Common.BaseController
    {
        private readonly ILogService _logService;

        public BillingController(ApplicationDbContext context, ILogger<BillingController> logger, ILogService logService) 
            : base(context, logger)
        {
            _logService = logService;
        }

        #region Invoices

        [HttpGet("invoices")]
        public async Task<IActionResult> GetInvoices(
            [FromQuery] int? tenantId = null,
            [FromQuery] InvoiceStatus? status = null,
            [FromQuery] InvoiceType? type = null,
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
                    query = query.Where(i => i.Status == status.Value);

                if (type.HasValue)
                    query = query.Where(i => i.Type == type.Value);

                if (startDate.HasValue)
                    query = query.Where(i => i.InvoiceDate >= startDate.Value);

                if (endDate.HasValue)
                    query = query.Where(i => i.InvoiceDate <= endDate.Value);

                if (!string.IsNullOrEmpty(searchText))
                {
                    query = query.Where(i => 
                        i.InvoiceNumber.Contains(searchText) ||
                        i.CustomerName.Contains(searchText) ||
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
                        i.CustomerName,
                        i.CustomerEmail,
                        TenantId = i.TenantId,
                        TenantName = i.Tenant.CompanyName,
                        CreatedById = i.CreatedById,
                        CreatedByName = i.CreatedBy != null ? $"{i.CreatedBy.FirstName} {i.CreatedBy.LastName}" : null,
                        i.CreatedAt,
                        i.UpdatedAt,
                        i.PaidAt,
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
                    invoice.CustomerName,
                    invoice.CustomerEmail,
                    invoice.CustomerAddress,
                    invoice.CustomerTaxNumber,
                    TenantId = invoice.TenantId,
                    TenantName = invoice.Tenant.CompanyName,
                    CreatedById = invoice.CreatedById,
                    CreatedByName = invoice.CreatedBy != null ? $"{invoice.CreatedBy.FirstName} {invoice.CreatedBy.LastName}" : null,
                    invoice.CreatedAt,
                    invoice.UpdatedAt,
                    invoice.PaidAt,
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

                // Generate invoice number
                var invoiceNumber = await GenerateInvoiceNumber(dto.TenantId);

                var invoice = new Invoice
                {
                    InvoiceNumber = invoiceNumber,
                    InvoiceDate = dto.InvoiceDate,
                    DueDate = dto.DueDate,
                    TotalAmount = dto.TotalAmount,
                    TaxAmount = dto.TaxAmount,
                    NetAmount = dto.NetAmount,
                    Currency = dto.Currency,
                    TaxRate = dto.TaxRate,
                    Status = dto.Status,
                    Type = dto.Type,
                    Description = dto.Description,
                    CustomerName = dto.CustomerName,
                    CustomerEmail = dto.CustomerEmail,
                    CustomerAddress = dto.CustomerAddress,
                    CustomerTaxNumber = dto.CustomerTaxNumber,
                    TenantId = dto.TenantId,
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
                            Unit = itemDto.Unit,
                            UnitPrice = itemDto.UnitPrice,
                            TotalPrice = itemDto.TotalPrice,
                            TaxRate = itemDto.TaxRate,
                            TaxAmount = itemDto.TaxAmount,
                            NetAmount = itemDto.NetAmount,
                            ResourceTypeId = itemDto.ResourceTypeId,
                            ConsumptionStartDate = itemDto.ConsumptionStartDate,
                            ConsumptionEndDate = itemDto.ConsumptionEndDate,
                            Notes = itemDto.Notes
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
                invoice.InvoiceDate = dto.InvoiceDate;
                invoice.DueDate = dto.DueDate;
                invoice.TotalAmount = dto.TotalAmount;
                invoice.TaxAmount = dto.TaxAmount;
                invoice.NetAmount = dto.NetAmount;
                invoice.Currency = dto.Currency;
                invoice.TaxRate = dto.TaxRate;
                invoice.Status = dto.Status;
                invoice.Type = dto.Type;
                invoice.Description = dto.Description;
                invoice.CustomerName = dto.CustomerName;
                invoice.CustomerEmail = dto.CustomerEmail;
                invoice.CustomerAddress = dto.CustomerAddress;
                invoice.CustomerTaxNumber = dto.CustomerTaxNumber;
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

        #endregion

        #region Resource Types

        [HttpGet("resource-types")]
        public async Task<IActionResult> GetResourceTypes(
            [FromQuery] int? tenantId = null,
            [FromQuery] ResourceCategory? category = null,
            [FromQuery] bool? isActive = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var query = _context.ResourceTypes
                    .Include(rt => rt.Tenant)
                    .AsQueryable();

                // Apply filters
                if (tenantId.HasValue)
                    query = query.Where(rt => rt.TenantId == tenantId.Value || rt.TenantId == null);

                if (category.HasValue)
                    query = query.Where(rt => rt.Category == category.Value);

                if (isActive.HasValue)
                    query = query.Where(rt => rt.IsActive == isActive.Value);

                // Get total count
                var totalCount = await query.CountAsync();

                // Apply pagination
                var resourceTypes = await query
                    .OrderBy(rt => rt.Name)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(rt => new
                    {
                        rt.Id,
                        rt.Name,
                        rt.Unit,
                        rt.Description,
                        rt.Icon,
                        rt.Category,
                        rt.DefaultPrice,
                        rt.Currency,
                        rt.IsActive,
                        TenantId = rt.TenantId,
                        TenantName = rt.Tenant != null ? rt.Tenant.CompanyName : "Global",
                        rt.CreatedAt,
                        rt.UpdatedAt
                    })
                    .ToListAsync();

                var result = new
                {
                    items = resourceTypes,
                    totalCount,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error retrieving resource types", ex, "BillingController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("resource-types")]
        public async Task<IActionResult> CreateResourceType([FromBody] CreateResourceTypeDto dto)
        {
            try
            {
                var resourceType = new ResourceType
                {
                    Name = dto.Name,
                    Unit = dto.Unit,
                    Description = dto.Description,
                    Icon = dto.Icon,
                    Category = dto.Category,
                    DefaultPrice = dto.DefaultPrice,
                    Currency = dto.Currency,
                    IsActive = dto.IsActive,
                    TenantId = dto.TenantId
                };

                _context.ResourceTypes.Add(resourceType);
                await _context.SaveChangesAsync();

                _logService.LogInformation($"Resource type created: {resourceType.Name}", "BillingController");
                return CreatedAtAction(nameof(GetResourceTypes), new { id = resourceType.Id }, resourceType);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error creating resource type", ex, "BillingController");
                return StatusCode(500, new { message = "Internal server error" });
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