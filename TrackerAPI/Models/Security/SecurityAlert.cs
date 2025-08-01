using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectricityTrackerAPI.Models.Security
{
    public class SecurityAlert
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string Type { get; set; } = string.Empty; // brute_force, suspicious_login, failed_2fa, data_breach_attempt, unusual_activity
        
        [Required]
        public string Severity { get; set; } = string.Empty; // low, medium, high, critical
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        public int? TenantId { get; set; }
        public int? UserId { get; set; }
        
        [Required]
        public string Status { get; set; } = string.Empty; // active, investigating, resolved
        
        public bool Resolved { get; set; } = false;
        
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        
        public DateTime? ResolvedAt { get; set; }
        
        public string? ResolvedBy { get; set; }
        
        public string? IpAddress { get; set; }
        
        public string? UserAgent { get; set; }
        
        public string? Location { get; set; }
        
        public string? Details { get; set; } // JSON string for additional details
        
        // Navigation properties
        [ForeignKey("TenantId")]
        public virtual Core.Tenant? Tenant { get; set; }
        
        [ForeignKey("UserId")]
        public virtual Core.User? User { get; set; }
    }
} 