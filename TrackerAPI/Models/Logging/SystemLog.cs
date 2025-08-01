using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.Models.Logging
{
    public class SystemLog
    {
        [Key]
        public int Id { get; set; }

        public int? TenantId { get; set; }

        public int? UserId { get; set; }

        [Required]
        [StringLength(50)]
        public string Level { get; set; } = string.Empty; // Info, Warning, Error, Debug

        [Required]
        [StringLength(100)]
        public string Category { get; set; } = string.Empty; // User, System, Security, API

        [Required]
        [StringLength(200)]
        public string Message { get; set; } = string.Empty;

        public string? Details { get; set; } // JSON string for additional data

        public string? IpAddress { get; set; }

        public string? UserAgent { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public string? Exception { get; set; }

        public string? StackTrace { get; set; }

        // Navigation properties
        public virtual Core.Tenant? Tenant { get; set; }
        public virtual Core.User? User { get; set; }
    }
} 