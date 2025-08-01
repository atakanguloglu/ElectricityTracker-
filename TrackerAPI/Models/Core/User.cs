using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.Models.Core
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Phone { get; set; }

        public UserRole Role { get; set; } = UserRole.User;

        public bool IsActive { get; set; } = true;

        public bool IsLocked { get; set; } = false;

        public DateTime? LockedAt { get; set; }

        public string? LockReason { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public DateTime? LastLoginAt { get; set; }

        public string? LastLoginIp { get; set; }

        public string? LastLoginUserAgent { get; set; }

        public int LoginAttempts { get; set; } = 0;

        public DateTime? LastFailedLogin { get; set; }

        public bool RequirePasswordChange { get; set; } = false;

        public DateTime? PasswordChangedAt { get; set; }

        // Foreign keys
        public int TenantId { get; set; }
        public int? DepartmentId { get; set; }

        // Navigation properties
        public virtual Tenant Tenant { get; set; } = null!;
        public virtual Department? Department { get; set; }
        public virtual ICollection<Logging.SystemLog> SystemLogs { get; set; } = new List<Logging.SystemLog>();
    }

    public enum UserRole
    {
        Admin,
        Accountant,
        Analyst,
        ReportViewer,
        Manager,
        User,
        Viewer
    }
} 