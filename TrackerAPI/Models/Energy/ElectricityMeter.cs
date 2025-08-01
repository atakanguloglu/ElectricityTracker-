using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.Models.Energy
{
    public class ElectricityMeter
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string MeterNumber { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Description { get; set; }

        public MeterType Type { get; set; } = MeterType.Digital;

        public decimal CurrentReading { get; set; }

        public decimal PreviousReading { get; set; }

        public DateTime LastReadingDate { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Foreign keys
        public int TenantId { get; set; }
        public int FacilityId { get; set; }

        // Navigation properties
        public virtual Core.Tenant Tenant { get; set; } = null!;
        public virtual Core.Facility Facility { get; set; } = null!;
        public virtual ICollection<ConsumptionRecord> ConsumptionRecords { get; set; } = new List<ConsumptionRecord>();
    }

    public enum MeterType
    {
        Digital,
        Analog,
        Smart,
        Prepaid
    }
} 