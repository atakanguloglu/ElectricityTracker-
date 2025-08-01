using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectricityTrackerAPI.Models.Billing
{
    public class Invoice
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string InvoiceNumber { get; set; } = string.Empty;

        [Required]
        public DateTime InvoiceDate { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TaxAmount { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal NetAmount { get; set; }

        [Required]
        [StringLength(3)]
        public string Currency { get; set; } = "TRY";

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal TaxRate { get; set; } = 18.0m;

        [Required]
        public InvoiceStatus Status { get; set; } = InvoiceStatus.Draft;

        [Required]
        public InvoiceType Type { get; set; } = InvoiceType.Utility;

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(100)]
        public string? CustomerName { get; set; }

        [StringLength(100)]
        public string? CustomerEmail { get; set; }

        [StringLength(200)]
        public string? CustomerAddress { get; set; }

        [StringLength(50)]
        public string? CustomerTaxNumber { get; set; }

        // Tenant relationship
        [Required]
        public int TenantId { get; set; }
        public virtual Core.Tenant Tenant { get; set; } = null!;

        // User who created the invoice
        public int? CreatedById { get; set; }
        public virtual Core.User? CreatedBy { get; set; }

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? PaidAt { get; set; }

        // Navigation properties
        public virtual ICollection<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();
        public virtual ICollection<PaymentRecord> Payments { get; set; } = new List<PaymentRecord>();
    }

    public enum InvoiceStatus
    {
        Draft = 0,
        Sent = 1,
        Paid = 2,
        Overdue = 3,
        Cancelled = 4,
        Disputed = 5
    }

    public enum InvoiceType
    {
        Utility = 0,      // Electricity, Water, Gas, etc.
        Subscription = 1, // Software subscription
        Service = 2,      // Maintenance, support
        Other = 3
    }
} 