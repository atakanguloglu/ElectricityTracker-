using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.Models.Core
{
    public class Tenant
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        [StringLength(6)]
        public string FacilityCode { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Domain { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string AdminEmail { get; set; } = string.Empty;

        [StringLength(100)]
        public string? ContactPerson { get; set; }

        [StringLength(20)]
        public string? Phone { get; set; }

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

        public TenantStatus Status { get; set; } = TenantStatus.Pending;

        public SubscriptionType Subscription { get; set; } = SubscriptionType.Basic;

        public DateTime SubscriptionStartDate { get; set; } = DateTime.UtcNow;

        public DateTime? SubscriptionEndDate { get; set; }

        public int MaxUsers { get; set; } = 10;

        public int MaxFacilities { get; set; } = 5;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public DateTime? LastLogin { get; set; }

        public string Currency { get; set; } = "TRY";

        public string Language { get; set; } = "tr";

        public string? Logo { get; set; }

        public decimal MonthlyFee { get; set; } = 99.99m;

        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

        public DateTime? LastPayment { get; set; }

        public string? TotalConsumption { get; set; } = "0 kWh";

        // Suspension fields
        public string? SuspensionReason { get; set; }
        public DateTime? SuspendedAt { get; set; }

        // Navigation properties
        public virtual ICollection<Facility> Facilities { get; set; } = new List<Facility>();
        public virtual ICollection<User> Users { get; set; } = new List<User>();
        public virtual ICollection<Energy.ElectricityMeter> ElectricityMeters { get; set; } = new List<Energy.ElectricityMeter>();
        public virtual ICollection<Department> Departments { get; set; } = new List<Department>();
        public virtual ICollection<Admin.ApiKey> ApiKeys { get; set; } = new List<Admin.ApiKey>();
        public virtual ICollection<Logging.SystemLog> SystemLogs { get; set; } = new List<Logging.SystemLog>();
    }

    public enum TenantStatus
    {
        Active,
        Suspended,
        Expired,
        Pending
    }

    public enum SubscriptionType
    {
        Basic,
        Standard,
        Premium
    }

    public enum PaymentStatus
    {
        Paid,
        Pending,
        Overdue,
        Cancelled
    }
} 