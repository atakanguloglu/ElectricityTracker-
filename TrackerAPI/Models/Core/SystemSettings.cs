using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectricityTrackerAPI.Models.Core
{
    public class SystemSettings
    {
        [Key]
        public int Id { get; set; }
        
        // Basic System Settings
        [Required]
        [StringLength(100)]
        public string SystemName { get; set; } = "Electricity Tracker";
        
        [Required]
        [EmailAddress]
        public string AdminEmail { get; set; } = "admin@electricitytracker.com";
        
        [Required]
        public int MaxUsers { get; set; } = 1000;
        
        [Required]
        public int MaxTenants { get; set; } = 100;
        
        // Backup Settings
        [Required]
        public string BackupFrequency { get; set; } = "daily"; // daily, weekly, monthly
        
        [Required]
        public string BackupRetentionDays { get; set; } = "30";
        
        [Required]
        public bool AutoBackup { get; set; } = true;
        
        [Required]
        public string BackupTime { get; set; } = "23:00";
        
        // Maintenance Settings
        [Required]
        public bool MaintenanceMode { get; set; } = false;
        
        public string? MaintenanceMessage { get; set; }
        
        public DateTime? MaintenanceStartTime { get; set; }
        
        public DateTime? MaintenanceEndTime { get; set; }
        
        // Notification Settings
        [Required]
        public bool EmailNotifications { get; set; } = true;
        
        [Required]
        public bool SmsNotifications { get; set; } = false;
        
        [Required]
        public bool PushNotifications { get; set; } = true;
        
        // Email Provider Settings
        [Required]
        public string EmailProvider { get; set; } = "smtp";
        
        public string? SmtpHost { get; set; }
        
        public int? SmtpPort { get; set; }
        
        public string? SmtpUsername { get; set; }
        
        public string? SmtpPassword { get; set; }
        
        public bool SmtpUseSsl { get; set; } = true;
        
        // SMS Provider Settings
        public string? SmsProvider { get; set; }
        
        public string? SmsApiKey { get; set; }
        
        public string? SmsApiSecret { get; set; }
        
        public string? SmsFromNumber { get; set; }
        
        // Localization Settings
        [Required]
        public string DefaultLanguage { get; set; } = "tr";
        
        [Required]
        public string DefaultCurrency { get; set; } = "TRY";
        
        [Required]
        public string TimeZone { get; set; } = "Europe/Istanbul";
        
        [Required]
        public string DateFormat { get; set; } = "dd/MM/yyyy";
        
        [Required]
        public string TimeFormat { get; set; } = "HH:mm:ss";
        
        // Security Settings
        [Required]
        public bool RequireEmailVerification { get; set; } = true;
        
        [Required]
        public bool RequirePhoneVerification { get; set; } = false;
        
        [Required]
        public int SessionTimeoutMinutes { get; set; } = 30;
        
        [Required]
        public bool EnableAuditLog { get; set; } = true;
        
        // Performance Settings
        [Required]
        public int CacheTimeoutMinutes { get; set; } = 15;
        
        [Required]
        public bool EnableCompression { get; set; } = true;
        
        [Required]
        public int MaxFileUploadSizeMB { get; set; } = 10;
        
        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public string? UpdatedBy { get; set; }
    }
}
