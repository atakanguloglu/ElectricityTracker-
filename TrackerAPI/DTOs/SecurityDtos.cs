using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.DTOs.Security
{
    public class TenantSecuritySettingsDto
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public string TenantName { get; set; } = string.Empty;
        
        // 2FA Settings
        public bool RequireTwoFactor { get; set; }
        public bool AllowSmsTwoFactor { get; set; }
        public bool AllowEmailTwoFactor { get; set; }
        public bool AllowAuthenticatorApp { get; set; }
        
        // Password Policy
        public int MinimumPasswordLength { get; set; }
        public bool RequireUppercase { get; set; }
        public bool RequireLowercase { get; set; }
        public bool RequireNumbers { get; set; }
        public bool RequireSpecialCharacters { get; set; }
        public int PasswordExpiryDays { get; set; }
        public bool PreventPasswordReuse { get; set; }
        public int PasswordHistoryCount { get; set; }
        
        // Session Management
        public int SessionTimeoutMinutes { get; set; }
        public bool ForceLogoutOnPasswordChange { get; set; }
        public bool AllowConcurrentSessions { get; set; }
        public int MaxConcurrentSessions { get; set; }
        
        // Login Security
        public int MaxFailedLoginAttempts { get; set; }
        public int AccountLockoutDurationMinutes { get; set; }
        public bool RequireCaptchaAfterFailedAttempts { get; set; }
        public int CaptchaThreshold { get; set; }
        
        // IP Security
        public bool EnableIpWhitelist { get; set; }
        public string? AllowedIpRanges { get; set; }
        public bool BlockSuspiciousIps { get; set; }
        public int SuspiciousIpThreshold { get; set; }
        
        // Audit and Monitoring
        public bool EnableSecurityAuditLog { get; set; }
        public bool LogFailedLoginAttempts { get; set; }
        public bool LogSuccessfulLogins { get; set; }
        public bool LogPasswordChanges { get; set; }
        public bool LogAdminActions { get; set; }
        
        // Notification Settings
        public bool NotifyOnFailedLogin { get; set; }
        public bool NotifyOnSuspiciousActivity { get; set; }
        public bool NotifyOnAccountLockout { get; set; }
        public string? NotificationEmails { get; set; }
        
        // Advanced Security
        public bool EnableBruteForceProtection { get; set; }
        public int BruteForceThreshold { get; set; }
        public int BruteForceWindowMinutes { get; set; }
        public bool EnableGeolocationBlocking { get; set; }
        public string? AllowedCountries { get; set; }
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class UpdateTenantSecuritySettingsDto
    {
        [Required]
        public int TenantId { get; set; }
        
        // 2FA Settings
        public bool RequireTwoFactor { get; set; }
        public bool AllowSmsTwoFactor { get; set; }
        public bool AllowEmailTwoFactor { get; set; }
        public bool AllowAuthenticatorApp { get; set; }
        
        // Password Policy
        [Range(6, 50)]
        public int MinimumPasswordLength { get; set; }
        public bool RequireUppercase { get; set; }
        public bool RequireLowercase { get; set; }
        public bool RequireNumbers { get; set; }
        public bool RequireSpecialCharacters { get; set; }
        [Range(30, 365)]
        public int PasswordExpiryDays { get; set; }
        public bool PreventPasswordReuse { get; set; }
        [Range(0, 20)]
        public int PasswordHistoryCount { get; set; }
        
        // Session Management
        [Range(5, 480)]
        public int SessionTimeoutMinutes { get; set; }
        public bool ForceLogoutOnPasswordChange { get; set; }
        public bool AllowConcurrentSessions { get; set; }
        [Range(1, 10)]
        public int MaxConcurrentSessions { get; set; }
        
        // Login Security
        [Range(1, 20)]
        public int MaxFailedLoginAttempts { get; set; }
        [Range(5, 1440)]
        public int AccountLockoutDurationMinutes { get; set; }
        public bool RequireCaptchaAfterFailedAttempts { get; set; }
        [Range(1, 10)]
        public int CaptchaThreshold { get; set; }
        
        // IP Security
        public bool EnableIpWhitelist { get; set; }
        public string? AllowedIpRanges { get; set; }
        public bool BlockSuspiciousIps { get; set; }
        [Range(1, 100)]
        public int SuspiciousIpThreshold { get; set; }
        
        // Audit and Monitoring
        public bool EnableSecurityAuditLog { get; set; }
        public bool LogFailedLoginAttempts { get; set; }
        public bool LogSuccessfulLogins { get; set; }
        public bool LogPasswordChanges { get; set; }
        public bool LogAdminActions { get; set; }
        
        // Notification Settings
        public bool NotifyOnFailedLogin { get; set; }
        public bool NotifyOnSuspiciousActivity { get; set; }
        public bool NotifyOnAccountLockout { get; set; }
        public string? NotificationEmails { get; set; }
        
        // Advanced Security
        public bool EnableBruteForceProtection { get; set; }
        [Range(1, 100)]
        public int BruteForceThreshold { get; set; }
        [Range(1, 60)]
        public int BruteForceWindowMinutes { get; set; }
        public bool EnableGeolocationBlocking { get; set; }
        public string? AllowedCountries { get; set; }
    }

    public class SecurityReportDto
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public string TenantName { get; set; } = string.Empty;
        public string ReportType { get; set; } = string.Empty;
        public DateTime ReportDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string ReportData { get; set; } = string.Empty;
        
        // Summary Statistics
        public int TotalAlerts { get; set; }
        public int CriticalAlerts { get; set; }
        public int HighAlerts { get; set; }
        public int MediumAlerts { get; set; }
        public int LowAlerts { get; set; }
        public int ResolvedAlerts { get; set; }
        public int PendingAlerts { get; set; }
        public int TotalBlockedIPs { get; set; }
        public int TotalLockedAccounts { get; set; }
        public int TotalFailedLogins { get; set; }
        public int TotalSuccessfulLogins { get; set; }
        
        // Security Score
        public double SecurityScore { get; set; }
        public string SecurityScoreTrend { get; set; } = string.Empty;
        public string? Recommendations { get; set; }
        
        // Export Information
        public string? ExportFormat { get; set; }
        public string? ExportPath { get; set; }
        public long? ExportFileSize { get; set; }
        public DateTime? ExportedAt { get; set; }
        public string? ExportedBy { get; set; }
        
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? CreatedBy { get; set; }
    }

    public class GenerateSecurityReportDto
    {
        [Required]
        public int TenantId { get; set; }
        
        [Required]
        public string ReportType { get; set; } = string.Empty; // daily, weekly, monthly, custom
        
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        
        public string? Title { get; set; }
        public string? Description { get; set; }
    }

    public class SecurityReportDownloadDto
    {
        public int ReportId { get; set; }
        public string Format { get; set; } = string.Empty; // pdf, excel, csv, json
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public byte[] FileContent { get; set; } = Array.Empty<byte>();
    }
} 