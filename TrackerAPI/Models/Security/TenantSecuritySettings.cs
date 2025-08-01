using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectricityTrackerAPI.Models.Security
{
    public class TenantSecuritySettings
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int TenantId { get; set; }
        
        // 2FA Settings
        public bool RequireTwoFactor { get; set; } = false;
        public bool AllowSmsTwoFactor { get; set; } = true;
        public bool AllowEmailTwoFactor { get; set; } = true;
        public bool AllowAuthenticatorApp { get; set; } = true;
        
        // Password Policy
        public int MinimumPasswordLength { get; set; } = 8;
        public bool RequireUppercase { get; set; } = true;
        public bool RequireLowercase { get; set; } = true;
        public bool RequireNumbers { get; set; } = true;
        public bool RequireSpecialCharacters { get; set; } = true;
        public int PasswordExpiryDays { get; set; } = 90;
        public bool PreventPasswordReuse { get; set; } = true;
        public int PasswordHistoryCount { get; set; } = 5;
        
        // Session Management
        public int SessionTimeoutMinutes { get; set; } = 30;
        public bool ForceLogoutOnPasswordChange { get; set; } = true;
        public bool AllowConcurrentSessions { get; set; } = false;
        public int MaxConcurrentSessions { get; set; } = 1;
        
        // Login Security
        public int MaxFailedLoginAttempts { get; set; } = 5;
        public int AccountLockoutDurationMinutes { get; set; } = 30;
        public bool RequireCaptchaAfterFailedAttempts { get; set; } = true;
        public int CaptchaThreshold { get; set; } = 3;
        
        // IP Security
        public bool EnableIpWhitelist { get; set; } = false;
        public string? AllowedIpRanges { get; set; } // JSON array of IP ranges
        public bool BlockSuspiciousIps { get; set; } = true;
        public int SuspiciousIpThreshold { get; set; } = 10;
        
        // Audit and Monitoring
        public bool EnableSecurityAuditLog { get; set; } = true;
        public bool LogFailedLoginAttempts { get; set; } = true;
        public bool LogSuccessfulLogins { get; set; } = false;
        public bool LogPasswordChanges { get; set; } = true;
        public bool LogAdminActions { get; set; } = true;
        
        // Notification Settings
        public bool NotifyOnFailedLogin { get; set; } = true;
        public bool NotifyOnSuspiciousActivity { get; set; } = true;
        public bool NotifyOnAccountLockout { get; set; } = true;
        public string? NotificationEmails { get; set; } // JSON array of email addresses
        
        // Advanced Security
        public bool EnableBruteForceProtection { get; set; } = true;
        public int BruteForceThreshold { get; set; } = 10;
        public int BruteForceWindowMinutes { get; set; } = 15;
        public bool EnableGeolocationBlocking { get; set; } = false;
        public string? AllowedCountries { get; set; } // JSON array of country codes
        
        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public string? UpdatedBy { get; set; }
        
        // Navigation property
        [ForeignKey("TenantId")]
        public virtual Core.Tenant? Tenant { get; set; }
    }
} 