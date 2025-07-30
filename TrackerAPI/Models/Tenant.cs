using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.Models
{
    public class Tenant
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string ContactPerson { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Address { get; set; }

        [StringLength(50)]
        public string? TaxNumber { get; set; }

        [StringLength(50)]
        public string? TaxOffice { get; set; }

        // Multi-tenant specific fields
        [StringLength(50)]
        public string? Subdomain { get; set; }

        [StringLength(100)]
        public string? CustomDomain { get; set; }

        public TenantStatus Status { get; set; } = TenantStatus.Active;

        public DateTime SubscriptionStartDate { get; set; } = DateTime.UtcNow;

        public DateTime? SubscriptionEndDate { get; set; }

        public int MaxUsers { get; set; } = 10;

        public int MaxFacilities { get; set; } = 5;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<Facility> Facilities { get; set; } = new List<Facility>();
        public virtual ICollection<User> Users { get; set; } = new List<User>();
        public virtual ICollection<ElectricityMeter> ElectricityMeters { get; set; } = new List<ElectricityMeter>();
        public virtual ICollection<Department> Departments { get; set; } = new List<Department>();
    }

    public enum TenantStatus
    {
        Active,
        Suspended,
        Expired,
        Pending
    }
} 