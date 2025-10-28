using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.Models.Core
{
    public class SmsProvider
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty; // twilio, nexmo, aws-sns, custom
        
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
        
        // API Settings
        [StringLength(255)]
        public string? ApiKey { get; set; }
        
        [StringLength(255)]
        public string? ApiSecret { get; set; }
        
        [StringLength(255)]
        public string? ApiEndpoint { get; set; }
        
        [StringLength(100)]
        public string? AccountSid { get; set; } // For Twilio
        
        [StringLength(100)]
        public string? AuthToken { get; set; } // For Twilio
        
        // Configuration
        [StringLength(20)]
        public string? FromNumber { get; set; }
        
        [StringLength(100)]
        public string? FromName { get; set; }
        
        [StringLength(100)]
        public string? SenderId { get; set; }
        
        public int MaxSmsPerHour { get; set; } = 100;
        
        public int MaxSmsPerDay { get; set; } = 1000;
        
        public decimal CostPerSms { get; set; } = 0.01m;
        
        public string? Currency { get; set; } = "TRY";
        
        // Features
        public bool SupportsUnicode { get; set; } = true;
        
        public bool SupportsLongMessages { get; set; } = true;
        
        public bool SupportsDeliveryReports { get; set; } = true;
        
        public bool SupportsScheduling { get; set; } = false;
        
        public int MaxMessageLength { get; set; } = 160;
        
        // Status and Monitoring
        public bool IsHealthy { get; set; } = true;
        
        public DateTime? LastHealthCheck { get; set; }
        
        public string? LastError { get; set; }
        
        public DateTime? LastErrorAt { get; set; }
        
        public int ErrorCount { get; set; } = 0;
        
        public int SuccessCount { get; set; } = 0;
        
        public DateTime? LastUsedAt { get; set; }
        
        public int RemainingCredits { get; set; } = 0;
        
        public decimal RemainingBalance { get; set; } = 0;
        
        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public string? CreatedBy { get; set; }
        
        public string? UpdatedBy { get; set; }
    }
}
