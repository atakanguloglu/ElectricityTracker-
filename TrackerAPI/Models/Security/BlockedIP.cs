using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectricityTrackerAPI.Models.Security
{
    public class BlockedIP
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string IpAddress { get; set; } = string.Empty;
        
        public int? TenantId { get; set; }
        
        [Required]
        public string Reason { get; set; } = string.Empty;
        
        public DateTime BlockedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? ExpiresAt { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public string? BlockedBy { get; set; }
        
        public int? AttemptCount { get; set; }
        
        public string? LastAttemptDetails { get; set; } // JSON string for additional details
        
        // Navigation properties
        [ForeignKey("TenantId")]
        public virtual Core.Tenant? Tenant { get; set; }
    }
} 