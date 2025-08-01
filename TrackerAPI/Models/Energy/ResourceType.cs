using System.ComponentModel.DataAnnotations;using System.ComponentModel.DataAnnotations.Schema;

namespace ElectricityTrackerAPI.Models.Energy
{
    public class ResourceType
    {
        [Key]
        public int Id { get; set; }

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
        [Column(TypeName = "decimal(18,2)")]
        public decimal DefaultPrice { get; set; } = 0.0m;

        [Required]
        [StringLength(3)]
        public string Currency { get; set; } = "TRY";

        [Required]
        public bool IsActive { get; set; } = true;

        // Tenant relationship (null for global types)
        public int? TenantId { get; set; }
        public virtual Core.Tenant? Tenant { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<ElectricityMeter> ElectricityMeters { get; set; } = new List<ElectricityMeter>();
        public virtual ICollection<ConsumptionRecord> ConsumptionRecords { get; set; } = new List<ConsumptionRecord>();
        public virtual ICollection<Billing.InvoiceItem> InvoiceItems { get; set; } = new List<Billing.InvoiceItem>();
    }

    public enum ResourceCategory
    {
        Electricity = 0,
        Water = 1,
        Gas = 2,
        Fuel = 3,
        Heat = 4,
        Other = 5
    }
} 