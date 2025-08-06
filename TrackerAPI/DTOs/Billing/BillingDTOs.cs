using System.ComponentModel.DataAnnotations;
using ElectricityTrackerAPI.Models.Billing;
using ElectricityTrackerAPI.Models.Energy;

namespace ElectricityTrackerAPI.DTOs.Billing
{
    #region Invoice DTOs

    public class CreateInvoiceDto
    {
        [Required]
        public string InvoiceDate { get; set; } = string.Empty;

        [Required]
        public string DueDate { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal TotalAmount { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal TaxAmount { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal NetAmount { get; set; }

        [Required]
        [StringLength(3)]
        public string Currency { get; set; } = "TRY";

        [Required]
        [Range(0, 100)]
        public decimal TaxRate { get; set; } = 18.0m;

        [Required]
        public int Status { get; set; } = 0; // InvoiceStatus.Draft

        [Required]
        public int Type { get; set; } = 0; // InvoiceType.Utility

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(100)]
        public string? CustomerName { get; set; }

        [StringLength(100)]
        [EmailAddress]
        public string? CustomerEmail { get; set; }

        [StringLength(200)]
        public string? CustomerAddress { get; set; }

        [StringLength(50)]
        public string? CustomerTaxNumber { get; set; }

        [Required]
        public int TenantId { get; set; }

        [Required]
        public int SubscriptionPlanId { get; set; }

        [StringLength(50)]
        public string? BillingPeriod { get; set; }

        public List<CreateInvoiceItemDto>? Items { get; set; }
    }

    public class UpdateInvoiceDto
    {
        [Required]
        public string InvoiceDate { get; set; } = string.Empty;

        [Required]
        public string DueDate { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal TotalAmount { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal TaxAmount { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal NetAmount { get; set; }

        [Required]
        [StringLength(3)]
        public string Currency { get; set; } = "TRY";

        [Required]
        [Range(0, 100)]
        public decimal TaxRate { get; set; } = 18.0m;

        [Required]
        public int Status { get; set; }

        [Required]
        public int Type { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(100)]
        public string? CustomerName { get; set; }

        [StringLength(100)]
        [EmailAddress]
        public string? CustomerEmail { get; set; }

        [StringLength(200)]
        public string? CustomerAddress { get; set; }

        [StringLength(50)]
        public string? CustomerTaxNumber { get; set; }

        [Required]
        public int SubscriptionPlanId { get; set; }

        [StringLength(50)]
        public string? BillingPeriod { get; set; }
    }

    public class CreateInvoiceItemDto
    {
        [Required]
        [StringLength(100)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Quantity { get; set; }

        [Required]
        [StringLength(20)]
        public string Unit { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal UnitPrice { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal TotalPrice { get; set; }

        [Required]
        [Range(0, 100)]
        public decimal TaxRate { get; set; } = 18.0m;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal TaxAmount { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal NetAmount { get; set; }

        public int? ResourceTypeId { get; set; }

        public DateTime? ConsumptionStartDate { get; set; }

        public DateTime? ConsumptionEndDate { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }
    }

    #endregion

    #region Resource Type DTOs

    public class CreateResourceTypeDto
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Unit { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Description { get; set; }

        [StringLength(50)]
        public string? Icon { get; set; }

        [Required]
        public ResourceCategory Category { get; set; } = ResourceCategory.Electricity;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal DefaultPrice { get; set; } = 0.0m;

        [Required]
        [StringLength(3)]
        public string Currency { get; set; } = "TRY";

        [Required]
        public bool IsActive { get; set; } = true;

        public int? TenantId { get; set; }
    }

    public class UpdateResourceTypeDto
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Unit { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Description { get; set; }

        [StringLength(50)]
        public string? Icon { get; set; }

        [Required]
        public ResourceCategory Category { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal DefaultPrice { get; set; }

        [Required]
        [StringLength(3)]
        public string Currency { get; set; } = "TRY";

        [Required]
        public bool IsActive { get; set; }
    }

    #endregion

    #region Payment DTOs

    public class CreatePaymentDto
    {
        [Required]
        public int InvoiceId { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(3)]
        public string Currency { get; set; } = "TRY";

        [Required]
        public PaymentMethod Method { get; set; }

        [StringLength(100)]
        public string? TransactionId { get; set; }

        [StringLength(100)]
        public string? ReferenceNumber { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; }
    }

    #endregion
} 