using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.Services;

namespace ElectricityTrackerAPI.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/reports")]
    [Authorize(Roles = "SuperAdmin")]
    public class SuperAdminReportsController : Common.BaseController
    {
        private readonly ILogService _logService;

        public SuperAdminReportsController(ApplicationDbContext context, ILogger<SuperAdminReportsController> logger, ILogService logService) 
            : base(context, logger)
        {
            _logService = logService;
        }

        #region Energy Reports

        [HttpGet("energy/consumption")]
        public async Task<IActionResult> GetEnergyConsumptionReport(
            [FromQuery] int? tenantId = null,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string? resourceType = null)
        {
            try
            {
                var query = _context.ConsumptionRecords
                    .Include(ec => ec.Tenant)
                    .Include(ec => ec.ElectricityMeter)
                    .AsQueryable();

                if (tenantId.HasValue)
                    query = query.Where(ec => ec.TenantId == tenantId.Value);

                if (startDate.HasValue)
                    query = query.Where(ec => ec.ReadingDate >= startDate.Value);

                if (endDate.HasValue)
                    query = query.Where(ec => ec.ReadingDate <= endDate.Value);

                var consumptions = await query
                    .OrderBy(ec => ec.ReadingDate)
                    .Select(ec => new
                    {
                        ec.Id,
                        ReadingDate = ec.ReadingDate,
                        ConsumptionValue = ec.Consumption,
                        Unit = "kWh",
                        Cost = ec.TotalCost,
                        Currency = "TRY",
                        TenantId = ec.TenantId,
                        TenantName = ec.Tenant.CompanyName,
                        MeterId = ec.ElectricityMeterId,
                        MeterName = ec.ElectricityMeter.MeterNumber
                    })
                    .ToListAsync();

                var summary = new
                {
                    totalConsumption = consumptions.Sum(c => c.ConsumptionValue),
                    totalCost = consumptions.Sum(c => c.Cost),
                    averageDailyConsumption = consumptions.Any() ? consumptions.Average(c => c.ConsumptionValue) : 0,
                    peakConsumption = consumptions.Any() ? consumptions.Max(c => c.ConsumptionValue) : 0,
                    consumptionByMeter = consumptions
                        .GroupBy(c => c.MeterName)
                        .Select(g => new
                        {
                            meterName = g.Key,
                            totalConsumption = g.Sum(c => c.ConsumptionValue),
                            totalCost = g.Sum(c => c.Cost),
                            averageConsumption = g.Average(c => c.ConsumptionValue)
                        })
                        .ToList()
                };

                var result = new
                {
                    consumptions,
                    summary
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error retrieving energy consumption report", ex, "ReportsController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("energy/cost-analysis")]
        public async Task<IActionResult> GetEnergyCostAnalysisReport(
            [FromQuery] int? tenantId = null,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var query = _context.ConsumptionRecords
                    .Include(ec => ec.Tenant)
                    .Include(ec => ec.ElectricityMeter)
                    .AsQueryable();

                if (tenantId.HasValue)
                    query = query.Where(ec => ec.TenantId == tenantId.Value);

                if (startDate.HasValue)
                    query = query.Where(ec => ec.ReadingDate >= startDate.Value);

                if (endDate.HasValue)
                    query = query.Where(ec => ec.ReadingDate <= endDate.Value);

                var consumptions = await query.ToListAsync();

                var costAnalysis = consumptions
                    .GroupBy(ec => new { ec.TenantId, ec.Tenant.CompanyName, ec.ElectricityMeter.MeterNumber })
                    .Select(g => new
                    {
                        tenantId = g.Key.TenantId,
                        tenantName = g.Key.CompanyName,
                        meterNumber = g.Key.MeterNumber,
                        totalConsumption = g.Sum(c => c.Consumption),
                        totalCost = g.Sum(c => c.TotalCost),
                        averageCostPerUnit = g.Average(c => c.TotalCost / c.Consumption),
                        monthlyAverage = g.GroupBy(c => new { c.ReadingDate.Year, c.ReadingDate.Month })
                            .Select(mg => new
                            {
                                year = mg.Key.Year,
                                month = mg.Key.Month,
                                consumption = mg.Sum(c => c.Consumption),
                                cost = mg.Sum(c => c.TotalCost)
                            })
                            .OrderBy(x => x.year)
                            .ThenBy(x => x.month)
                            .ToList()
                    })
                    .ToList();

                return Ok(costAnalysis);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error retrieving energy cost analysis report", ex, "ReportsController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        #endregion

        #region Billing Reports

        [HttpGet("billing/summary")]
        public async Task<IActionResult> GetBillingSummaryReport(
            [FromQuery] int? tenantId = null,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var query = _context.Invoices
                    .Include(i => i.Tenant)
                    .AsQueryable();

                if (tenantId.HasValue)
                    query = query.Where(i => i.TenantId == tenantId.Value);

                if (startDate.HasValue)
                    query = query.Where(i => i.InvoiceDate >= startDate.Value);

                if (endDate.HasValue)
                    query = query.Where(i => i.InvoiceDate <= endDate.Value);

                var invoices = await query.ToListAsync();

                var summary = new
                {
                    totalInvoices = invoices.Count,
                    totalAmount = invoices.Sum(i => i.TotalAmount),
                    paidAmount = invoices.Where(i => i.Status == Models.Billing.InvoiceStatus.Paid).Sum(i => i.TotalAmount),
                    unpaidAmount = invoices.Where(i => i.Status == Models.Billing.InvoiceStatus.Draft).Sum(i => i.TotalAmount),
                    overdueAmount = invoices.Where(i => i.Status == Models.Billing.InvoiceStatus.Overdue).Sum(i => i.TotalAmount),
                    averageInvoiceAmount = invoices.Any() ? invoices.Average(i => i.TotalAmount) : 0,
                    invoicesByStatus = invoices
                        .GroupBy(i => i.Status)
                        .Select(g => new
                        {
                            status = g.Key.ToString(),
                            count = g.Count(),
                            totalAmount = g.Sum(i => i.TotalAmount)
                        })
                        .ToList(),
                    invoicesByType = invoices
                        .GroupBy(i => i.Type)
                        .Select(g => new
                        {
                            type = g.Key.ToString(),
                            count = g.Count(),
                            totalAmount = g.Sum(i => i.TotalAmount)
                        })
                        .ToList(),
                    monthlyBreakdown = invoices
                        .GroupBy(i => new { i.InvoiceDate.Year, i.InvoiceDate.Month })
                        .Select(g => new
                        {
                            year = g.Key.Year,
                            month = g.Key.Month,
                            count = g.Count(),
                            totalAmount = g.Sum(i => i.TotalAmount),
                            paidAmount = g.Where(i => i.Status == Models.Billing.InvoiceStatus.Paid).Sum(i => i.TotalAmount)
                        })
                        .OrderByDescending(x => x.year)
                        .ThenByDescending(x => x.month)
                        .Take(12)
                        .ToList()
                };

                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error retrieving billing summary report", ex, "ReportsController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        #endregion

        #region Tenant Reports

        [HttpGet("tenants/performance")]
        public async Task<IActionResult> GetTenantPerformanceReport(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var query = _context.Tenants
                    .Include(t => t.ConsumptionRecords)
                    .Include(t => t.Invoices)
                    .AsQueryable();

                var tenants = await query.ToListAsync();

                var performanceData = tenants.Select(tenant => new
                {
                    tenantId = tenant.Id,
                    tenantName = tenant.CompanyName,
                    totalConsumption = tenant.ConsumptionRecords
                        .Where(ec => (!startDate.HasValue || ec.ReadingDate >= startDate.Value) &&
                                   (!endDate.HasValue || ec.ReadingDate <= endDate.Value))
                        .Sum(ec => ec.Consumption),
                    totalCost = tenant.ConsumptionRecords
                        .Where(ec => (!startDate.HasValue || ec.ReadingDate >= startDate.Value) &&
                                   (!endDate.HasValue || ec.ReadingDate <= endDate.Value))
                        .Sum(ec => ec.TotalCost),
                    totalInvoices = tenant.Invoices
                        .Where(i => (!startDate.HasValue || i.InvoiceDate >= startDate.Value) &&
                                  (!endDate.HasValue || i.InvoiceDate <= endDate.Value))
                        .Count(),
                    totalInvoiceAmount = tenant.Invoices
                        .Where(i => (!startDate.HasValue || i.InvoiceDate >= startDate.Value) &&
                                  (!endDate.HasValue || i.InvoiceDate <= endDate.Value))
                        .Sum(i => i.TotalAmount),
                    paidInvoices = tenant.Invoices
                        .Where(i => (!startDate.HasValue || i.InvoiceDate >= startDate.Value) &&
                                  (!endDate.HasValue || i.InvoiceDate <= endDate.Value) &&
                                  i.Status == Models.Billing.InvoiceStatus.Paid)
                        .Count(),
                    overdueInvoices = tenant.Invoices
                        .Where(i => (!startDate.HasValue || i.InvoiceDate >= startDate.Value) &&
                                  (!endDate.HasValue || i.InvoiceDate <= endDate.Value) &&
                                  i.Status == Models.Billing.InvoiceStatus.Overdue)
                        .Count()
                })
                .OrderByDescending(t => t.totalCost)
                .ToList();

                return Ok(performanceData);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error retrieving tenant performance report", ex, "ReportsController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        #endregion

        #region System Reports

        [HttpGet("system/usage")]
        public async Task<IActionResult> GetSystemUsageReport(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var systemLogs = await _context.SystemLogs
                    .Where(sl => (!startDate.HasValue || sl.Timestamp >= startDate.Value) &&
                               (!endDate.HasValue || sl.Timestamp <= endDate.Value))
                    .ToListAsync();

                var usageReport = new
                {
                    systemHealth = new
                    {
                        totalLogs = systemLogs.Count,
                        errorLogs = systemLogs.Count(sl => sl.Level == "Error"),
                        warningLogs = systemLogs.Count(sl => sl.Level == "Warning"),
                        infoLogs = systemLogs.Count(sl => sl.Level == "Information"),
                        logsByLevel = systemLogs
                            .GroupBy(sl => sl.Level)
                            .Select(g => new
                            {
                                level = g.Key,
                                count = g.Count()
                            })
                            .ToList()
                    }
                };

                return Ok(usageReport);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error retrieving system usage report", ex, "ReportsController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        #endregion

        #region Export Reports

        [HttpGet("export/energy-consumption")]
        public async Task<IActionResult> ExportEnergyConsumptionReport(
            [FromQuery] int? tenantId = null,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string format = "json")
        {
            try
            {
                var query = _context.ConsumptionRecords
                    .Include(ec => ec.Tenant)
                    .Include(ec => ec.ElectricityMeter)
                    .AsQueryable();

                if (tenantId.HasValue)
                    query = query.Where(ec => ec.TenantId == tenantId.Value);

                if (startDate.HasValue)
                    query = query.Where(ec => ec.ReadingDate >= startDate.Value);

                if (endDate.HasValue)
                    query = query.Where(ec => ec.ReadingDate <= endDate.Value);

                var consumptions = await query
                    .OrderBy(ec => ec.ReadingDate)
                    .Select(ec => new
                    {
                        ReadingDate = ec.ReadingDate,
                        ConsumptionValue = ec.Consumption,
                        Unit = "kWh",
                        Cost = ec.TotalCost,
                        Currency = "TRY",
                        TenantName = ec.Tenant.CompanyName,
                        MeterNumber = ec.ElectricityMeter.MeterNumber
                    })
                    .ToListAsync();

                if (format.ToLower() == "csv")
                {
                    var csv = "Tarih,Tüketim Değeri,Birim,Maliyet,Para Birimi,Tenant,Sayaç Numarası\n";
                    csv += string.Join("\n", consumptions.Select(c => 
                        $"{c.ReadingDate:yyyy-MM-dd},{c.ConsumptionValue},{c.Unit},{c.Cost},{c.Currency},{c.TenantName},{c.MeterNumber}"));

                    return File(System.Text.Encoding.UTF8.GetBytes(csv), "text/csv", "energy-consumption-report.csv");
                }

                return Ok(consumptions);
            }
            catch (Exception ex)
            {
                _logService.LogError("Error exporting energy consumption report", ex, "ReportsController");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        #endregion
    }
} 