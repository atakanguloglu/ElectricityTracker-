using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.Models.Core;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace ElectricityTrackerAPI.Services
{
    public class SettingsService : ISettingsService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<SettingsService> _logger;

        public SettingsService(ApplicationDbContext context, ILogger<SettingsService> logger)
        {
            _context = context;
            _logger = logger;
        }

        #region System Settings

        public async Task<SystemSettings> GetSystemSettingsAsync()
        {
            var settings = await _context.SystemSettings.FirstOrDefaultAsync();
            
            if (settings == null)
            {
                // Create default settings if none exist
                settings = new SystemSettings();
                _context.SystemSettings.Add(settings);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Default system settings created");
            }
            
            return settings;
        }

        public async Task<SystemSettings> UpdateSystemSettingsAsync(SystemSettings settings)
        {
            var existingSettings = await _context.SystemSettings.FirstOrDefaultAsync();
            
            if (existingSettings == null)
            {
                _context.SystemSettings.Add(settings);
            }
            else
            {
                // Update existing settings
                _context.Entry(existingSettings).CurrentValues.SetValues(settings);
                existingSettings.UpdatedAt = DateTime.UtcNow;
            }
            
            await _context.SaveChangesAsync();
            _logger.LogInformation("System settings updated");
            
            return settings;
        }

        #endregion

        #region Backup Management

        public async Task<List<BackupLog>> GetBackupLogsAsync(int? tenantId = null, int page = 1, int pageSize = 20)
        {
            var query = _context.BackupLogs.AsQueryable();
            
            if (tenantId.HasValue)
                query = query.Where(b => b.TenantId == tenantId);
            
            return await query
                .OrderByDescending(b => b.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<BackupLog> CreateBackupAsync(int? tenantId = null)
        {
            var backup = new BackupLog
            {
                Name = $"backup_{DateTime.UtcNow:yyyy_MM_dd_HHmmss}.zip",
                Type = "full",
                Status = "running",
                SizeBytes = 0,
                CreatedAt = DateTime.UtcNow,
                TenantId = tenantId
            };
            
            _context.BackupLogs.Add(backup);
            await _context.SaveChangesAsync();
            
            // Simulate backup process
            _ = Task.Run(async () =>
            {
                try
                {
                    await SimulateBackupProcess(backup.Id);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Backup process failed for backup {BackupId}", backup.Id);
                }
            });
            
            return backup;
        }

        public async Task<bool> DeleteBackupAsync(int backupId)
        {
            var backup = await _context.BackupLogs.FindAsync(backupId);
            if (backup == null) return false;
            
            backup.IsDeleted = true;
            backup.DeletedAt = DateTime.UtcNow;
            backup.DeletedBy = "system"; // TODO: Get from current user context
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<BackupLog> GetBackupByIdAsync(int backupId)
        {
            return await _context.BackupLogs.FindAsync(backupId);
        }

        #endregion

        #region Email Providers

        public async Task<List<EmailProvider>> GetEmailProvidersAsync()
        {
            return await _context.EmailProviders
                .OrderBy(e => e.SortOrder)
                .ThenBy(e => e.Name)
                .ToListAsync();
        }

        public async Task<EmailProvider> GetEmailProviderByIdAsync(int id)
        {
            return await _context.EmailProviders.FindAsync(id);
        }

        public async Task<EmailProvider> CreateEmailProviderAsync(EmailProvider provider)
        {
            provider.CreatedAt = DateTime.UtcNow;
            provider.UpdatedAt = DateTime.UtcNow;
            
            _context.EmailProviders.Add(provider);
            await _context.SaveChangesAsync();
            
            return provider;
        }

        public async Task<EmailProvider> UpdateEmailProviderAsync(EmailProvider provider)
        {
            var existing = await _context.EmailProviders.FindAsync(provider.Id);
            if (existing == null) throw new ArgumentException("Email provider not found");
            
            _context.Entry(existing).CurrentValues.SetValues(provider);
            existing.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteEmailProviderAsync(int id)
        {
            var provider = await _context.EmailProviders.FindAsync(id);
            if (provider == null) return false;
            
            _context.EmailProviders.Remove(provider);
            await _context.SaveChangesAsync();
            
            return true;
        }

        public async Task<EmailProvider> SetDefaultEmailProviderAsync(int id)
        {
            // Remove default from all providers
            await _context.EmailProviders
                .Where(e => e.IsDefault)
                .ExecuteUpdateAsync(e => e.SetProperty(p => p.IsDefault, false));
            
            // Set new default
            var provider = await _context.EmailProviders.FindAsync(id);
            if (provider != null)
            {
                provider.IsDefault = true;
                provider.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            
            return provider;
        }

        #endregion

        #region SMS Providers

        public async Task<List<SmsProvider>> GetSmsProvidersAsync()
        {
            return await _context.SmsProviders
                .OrderBy(s => s.Name)
                .ToListAsync();
        }

        public async Task<SmsProvider> GetSmsProviderByIdAsync(int id)
        {
            return await _context.SmsProviders.FindAsync(id);
        }

        public async Task<SmsProvider> CreateSmsProviderAsync(SmsProvider provider)
        {
            provider.CreatedAt = DateTime.UtcNow;
            provider.UpdatedAt = DateTime.UtcNow;
            
            _context.SmsProviders.Add(provider);
            await _context.SaveChangesAsync();
            
            return provider;
        }

        public async Task<SmsProvider> UpdateSmsProviderAsync(SmsProvider provider)
        {
            var existing = await _context.SmsProviders.FindAsync(provider.Id);
            if (existing == null) throw new ArgumentException("SMS provider not found");
            
            _context.Entry(existing).CurrentValues.SetValues(provider);
            existing.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteSmsProviderAsync(int id)
        {
            var provider = await _context.SmsProviders.FindAsync(id);
            if (provider == null) return false;
            
            _context.SmsProviders.Remove(provider);
            await _context.SaveChangesAsync();
            
            return true;
        }

        public async Task<SmsProvider> SetDefaultSmsProviderAsync(int id)
        {
            // Remove default from all providers
            await _context.SmsProviders
                .Where(s => s.IsDefault)
                .ExecuteUpdateAsync(s => s.SetProperty(p => p.IsDefault, false));
            
            // Set new default
            var provider = await _context.SmsProviders.FindAsync(id);
            if (provider != null)
            {
                provider.IsDefault = true;
                provider.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            
            return provider;
        }

        #endregion

        #region System Health

        public async Task<object> GetSystemHealthAsync()
        {
            var stats = await GetSystemStatisticsAsync();
            
            return new
            {
                Status = "healthy",
                Timestamp = DateTime.UtcNow,
                Statistics = stats
            };
        }

        public async Task<object> GetSystemStatisticsAsync()
        {
            var totalUsers = await _context.Users.CountAsync();
            var activeTenants = await _context.Tenants.CountAsync(t => t.IsActive);
            var totalInvoices = await _context.Invoices.CountAsync();
            var totalConsumptionRecords = await _context.ConsumptionRecords.CountAsync();
            
            return new
            {
                TotalUsers = totalUsers,
                ActiveTenants = activeTenants,
                TotalInvoices = totalInvoices,
                TotalConsumptionRecords = totalConsumptionRecords,
                DatabaseSize = "2.4 GB", // TODO: Implement actual database size calculation
                SystemUptime = GetSystemUptime(),
                LastBackup = await GetLastBackupTime()
            };
        }

        #endregion

        #region Maintenance Mode

        public async Task<bool> SetMaintenanceModeAsync(bool enabled, string? message = null, DateTime? startTime = null, DateTime? endTime = null)
        {
            var settings = await GetSystemSettingsAsync();
            settings.MaintenanceMode = enabled;
            settings.MaintenanceMessage = message;
            settings.MaintenanceStartTime = startTime;
            settings.MaintenanceEndTime = endTime;
            settings.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Maintenance mode set to {Enabled}", enabled);
            return true;
        }

        public async Task<object> GetMaintenanceStatusAsync()
        {
            var settings = await GetSystemSettingsAsync();
            
            return new
            {
                IsEnabled = settings.MaintenanceMode,
                Message = settings.MaintenanceMessage,
                StartTime = settings.MaintenanceStartTime,
                EndTime = settings.MaintenanceEndTime,
                IsActive = settings.MaintenanceMode && 
                           (!settings.MaintenanceStartTime.HasValue || DateTime.UtcNow >= settings.MaintenanceStartTime) &&
                           (!settings.MaintenanceEndTime.HasValue || DateTime.UtcNow <= settings.MaintenanceEndTime)
            };
        }

        #endregion

        #region Private Methods

        private async Task SimulateBackupProcess(int backupId)
        {
            var stopwatch = Stopwatch.StartNew();
            
            // Simulate backup process
            await Task.Delay(5000); // 5 seconds
            
            var backup = await _context.BackupLogs.FindAsync(backupId);
            if (backup != null)
            {
                backup.Status = "completed";
                backup.CompletedAt = DateTime.UtcNow;
                backup.DurationSeconds = (int)stopwatch.Elapsed.TotalSeconds;
                backup.SizeBytes = new Random().Next(100 * 1024 * 1024, 500 * 1024 * 1024); // 100-500 MB
                
                await _context.SaveChangesAsync();
            }
            
            stopwatch.Stop();
        }

        private string GetSystemUptime()
        {
            var uptime = DateTime.UtcNow - Process.GetCurrentProcess().StartTime.ToUniversalTime();
            return $"{uptime.Days} gün {uptime.Hours} saat {uptime.Minutes} dakika";
        }

        private async Task<string> GetLastBackupTime()
        {
            var lastBackup = await _context.BackupLogs
                .Where(b => b.Status == "completed")
                .OrderByDescending(b => b.CompletedAt)
                .FirstOrDefaultAsync();
            
            return lastBackup?.CompletedAt?.ToString("yyyy-MM-dd HH:mm:ss") ?? "Hiç backup yapılmamış";
        }

        #endregion
    }
}
