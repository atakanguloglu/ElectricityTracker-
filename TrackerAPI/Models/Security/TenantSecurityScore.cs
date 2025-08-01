using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectricityTrackerAPI.Models.Security
{
    public class TenantSecurityScore
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int TenantId { get; set; }
        
        [Required]
        public int SecurityScore { get; set; } // 0-100
        
        public bool TwoFactorEnabled { get; set; } = false;
        
        [Required]
        public string PasswordPolicy { get; set; } = string.Empty; // weak, medium, strong
        
        public DateTime LastSecurityAudit { get; set; } = DateTime.UtcNow;
        
        public int ActiveThreats { get; set; } = 0;
        
        public int BlockedIPs { get; set; } = 0;
        
        public string? SecurityRecommendations { get; set; } // JSON string for recommendations
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        [ForeignKey("TenantId")]
        public virtual Core.Tenant Tenant { get; set; } = null!;
    }
} 