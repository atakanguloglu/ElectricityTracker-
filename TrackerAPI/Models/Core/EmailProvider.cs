using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.Models.Core
{
    public class EmailProvider
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty; // smtp, sendgrid, mailgun, aws-ses
        
        [Required]
        [StringLength(100)]
        public string DisplayName { get; set; } = string.Empty;
        
        [StringLength(255)]
        public string? Description { get; set; }
        
        [StringLength(100)]
        public string? Icon { get; set; }
        
        [Required]
        public bool IsActive { get; set; } = true;
        
        [Required]
        public bool IsDefault { get; set; } = false;
        
        [Required]
        public int SortOrder { get; set; } = 0;
        
        // SMTP Settings
        [StringLength(255)]
        public string? SmtpHost { get; set; }
        
        public int? SmtpPort { get; set; }
        
        [StringLength(100)]
        public string? SmtpUsername { get; set; }
        
        [StringLength(255)]
        public string? SmtpPassword { get; set; }
        
        public bool SmtpUseSsl { get; set; } = true;
        
        public bool SmtpUseTls { get; set; } = false;
        
        // API Settings
        [StringLength(255)]
        public string? ApiKey { get; set; }
        
        [StringLength(255)]
        public string? ApiSecret { get; set; }
        
        [StringLength(255)]
        public string? ApiEndpoint { get; set; }
        
        // Configuration
        [StringLength(100)]
        public string? FromEmail { get; set; }
        
        [StringLength(100)]
        public string? FromName { get; set; }
        
        public int MaxEmailsPerHour { get; set; } = 1000;
        
        public int MaxEmailsPerDay { get; set; } = 10000;
        
        // Status and Monitoring
        public bool IsHealthy { get; set; } = true;
        
        public DateTime? LastHealthCheck { get; set; }
        
        public string? LastError { get; set; }
        
        public DateTime? LastErrorAt { get; set; }
        
        public int ErrorCount { get; set; } = 0;
        
        public int SuccessCount { get; set; } = 0;
        
        public DateTime? LastUsedAt { get; set; }
        
        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public string? CreatedBy { get; set; }
        
        public string? UpdatedBy { get; set; }
    }
}
