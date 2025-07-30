using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.Models
{
    public class Facility
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Address { get; set; }

        [StringLength(50)]
        public string? FacilityCode { get; set; }

        public FacilityType Type { get; set; } = FacilityType.Office;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Foreign keys
        public int TenantId { get; set; }
        public int? DepartmentId { get; set; }

        // Navigation properties
        public virtual Tenant Tenant { get; set; } = null!;
        public virtual Department? Department { get; set; }
        public virtual ICollection<ElectricityMeter> ElectricityMeters { get; set; } = new List<ElectricityMeter>();
    }

    public enum FacilityType
    {
        Office,
        Factory,
        Warehouse,
        Retail,
        Hospital,
        School,
        Hotel,
        Restaurant,
        Other
    }
} 