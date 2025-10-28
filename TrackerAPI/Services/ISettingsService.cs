using ElectricityTrackerAPI.Models.Core;

namespace ElectricityTrackerAPI.Services
{
    public interface ISettingsService
    {
        // System Settings
        Task<SystemSettings> GetSystemSettingsAsync();
        Task<SystemSettings> UpdateSystemSettingsAsync(SystemSettings settings);
        
        // Backup Management
        Task<List<BackupLog>> GetBackupLogsAsync(int? tenantId = null, int page = 1, int pageSize = 20);
        Task<BackupLog> CreateBackupAsync(int? tenantId = null);
        Task<bool> DeleteBackupAsync(int backupId);
        Task<BackupLog> GetBackupByIdAsync(int backupId);
        
        // Email Providers
        Task<List<EmailProvider>> GetEmailProvidersAsync();
        Task<EmailProvider> GetEmailProviderByIdAsync(int id);
        Task<EmailProvider> CreateEmailProviderAsync(EmailProvider provider);
        Task<EmailProvider> UpdateEmailProviderAsync(EmailProvider provider);
        Task<bool> DeleteEmailProviderAsync(int id);
        Task<EmailProvider> SetDefaultEmailProviderAsync(int id);
        
        // SMS Providers
        Task<List<SmsProvider>> GetSmsProvidersAsync();
        Task<SmsProvider> GetSmsProviderByIdAsync(int id);
        Task<SmsProvider> CreateSmsProviderAsync(SmsProvider provider);
        Task<SmsProvider> UpdateSmsProviderAsync(SmsProvider provider);
        Task<bool> DeleteSmsProviderAsync(int id);
        Task<SmsProvider> SetDefaultSmsProviderAsync(int id);
        
        // System Health
        Task<object> GetSystemHealthAsync();
        Task<object> GetSystemStatisticsAsync();
        
        // Maintenance Mode
        Task<bool> SetMaintenanceModeAsync(bool enabled, string? message = null, DateTime? startTime = null, DateTime? endTime = null);
        Task<object> GetMaintenanceStatusAsync();
    }
}
