using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.Models
{
    public class ConsumptionRecord
    {
        [Key]
        public int Id { get; set; }

        public DateTime ReadingDate { get; set; }

        public decimal CurrentReading { get; set; }

        public decimal PreviousReading { get; set; }

        public decimal Consumption { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal TotalCost { get; set; }

        public ReadingSource Source { get; set; } = ReadingSource.Manual;

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Foreign keys
        public int TenantId { get; set; }
        public int ElectricityMeterId { get; set; }

        // Navigation properties
        public virtual Tenant Tenant { get; set; } = null!;
        public virtual ElectricityMeter ElectricityMeter { get; set; } = null!;
    }

    public enum ReadingSource
    {
        Manual,
        API,
        SmartMeter,
        Import
    }
} 