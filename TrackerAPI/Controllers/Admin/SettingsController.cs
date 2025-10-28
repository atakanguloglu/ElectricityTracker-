using Microsoft.AspNetCore.Mvc;
using ElectricityTrackerAPI.Services;
using ElectricityTrackerAPI.Models.Core;
using ElectricityTrackerAPI.Controllers.Common;

namespace ElectricityTrackerAPI.Controllers.Admin
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : BaseController
    {
        private readonly ISettingsService _settingsService;

        public SettingsController(ISettingsService settingsService, ILogger<SettingsController> logger) : base(null, logger)
        {
            _settingsService = settingsService;
        }

        #region System Settings

        [HttpGet("system")]
        public async Task<IActionResult> GetSystemSettings()
        {
            try
            {
                var settings = await _settingsService.GetSystemSettingsAsync();
                return Ok(settings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system settings");
                return StatusCode(500, new { message = "Sistem ayarları alınırken hata oluştu" });
            }
        }

        [HttpPut("system")]
        public async Task<IActionResult> UpdateSystemSettings([FromBody] SystemSettings settings)
        {
            try
            {
                var updatedSettings = await _settingsService.UpdateSystemSettingsAsync(settings);
                return Ok(updatedSettings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating system settings");
                return StatusCode(500, new { message = "Sistem ayarları güncellenirken hata oluştu" });
            }
        }

        #endregion

        #region Backup Management

        [HttpGet("backups")]
        public async Task<IActionResult> GetBackupLogs([FromQuery] int? tenantId = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var backups = await _settingsService.GetBackupLogsAsync(tenantId, page, pageSize);
                return Ok(backups);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting backup logs");
                return StatusCode(500, new { message = "Backup logları alınırken hata oluştu" });
            }
        }

        [HttpPost("backups")]
        public async Task<IActionResult> CreateBackup([FromQuery] int? tenantId = null)
        {
            try
            {
                var backup = await _settingsService.CreateBackupAsync(tenantId);
                return Ok(backup);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating backup");
                return StatusCode(500, new { message = "Backup oluşturulurken hata oluştu" });
            }
        }

        [HttpDelete("backups/{id}")]
        public async Task<IActionResult> DeleteBackup(int id)
        {
            try
            {
                var result = await _settingsService.DeleteBackupAsync(id);
                if (result)
                    return Ok(new { message = "Backup başarıyla silindi" });
                else
                    return NotFound(new { message = "Backup bulunamadı" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting backup {BackupId}", id);
                return StatusCode(500, new { message = "Backup silinirken hata oluştu" });
            }
        }

        [HttpGet("backups/{id}")]
        public async Task<IActionResult> GetBackupById(int id)
        {
            try
            {
                var backup = await _settingsService.GetBackupByIdAsync(id);
                if (backup == null)
                    return NotFound(new { message = "Backup bulunamadı" });
                
                return Ok(backup);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting backup {BackupId}", id);
                return StatusCode(500, new { message = "Backup bilgisi alınırken hata oluştu" });
            }
        }

        #endregion

        #region Email Providers

        [HttpGet("email-providers")]
        public async Task<IActionResult> GetEmailProviders()
        {
            try
            {
                var providers = await _settingsService.GetEmailProvidersAsync();
                return Ok(providers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting email providers");
                return StatusCode(500, new { message = "Email sağlayıcıları alınırken hata oluştu" });
            }
        }

        [HttpGet("email-providers/{id}")]
        public async Task<IActionResult> GetEmailProviderById(int id)
        {
            try
            {
                var provider = await _settingsService.GetEmailProviderByIdAsync(id);
                if (provider == null)
                    return NotFound(new { message = "Email sağlayıcısı bulunamadı" });
                
                return Ok(provider);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting email provider {ProviderId}", id);
                return StatusCode(500, new { message = "Email sağlayıcısı bilgisi alınırken hata oluştu" });
            }
        }

        [HttpPost("email-providers")]
        public async Task<IActionResult> CreateEmailProvider([FromBody] EmailProvider provider)
        {
            try
            {
                var createdProvider = await _settingsService.CreateEmailProviderAsync(provider);
                return CreatedAtAction(nameof(GetEmailProviderById), new { id = createdProvider.Id }, createdProvider);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating email provider");
                return StatusCode(500, new { message = "Email sağlayıcısı oluşturulurken hata oluştu" });
            }
        }

        [HttpPut("email-providers/{id}")]
        public async Task<IActionResult> UpdateEmailProvider(int id, [FromBody] EmailProvider provider)
        {
            try
            {
                provider.Id = id;
                var updatedProvider = await _settingsService.UpdateEmailProviderAsync(provider);
                return Ok(updatedProvider);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating email provider {ProviderId}", id);
                return StatusCode(500, new { message = "Email sağlayıcısı güncellenirken hata oluştu" });
            }
        }

        [HttpDelete("email-providers/{id}")]
        public async Task<IActionResult> DeleteEmailProvider(int id)
        {
            try
            {
                var result = await _settingsService.DeleteEmailProviderAsync(id);
                if (result)
                    return Ok(new { message = "Email sağlayıcısı başarıyla silindi" });
                else
                    return NotFound(new { message = "Email sağlayıcısı bulunamadı" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting email provider {ProviderId}", id);
                return StatusCode(500, new { message = "Email sağlayıcısı silinirken hata oluştu" });
            }
        }

        [HttpPost("email-providers/{id}/set-default")]
        public async Task<IActionResult> SetDefaultEmailProvider(int id)
        {
            try
            {
                var provider = await _settingsService.SetDefaultEmailProviderAsync(id);
                return Ok(provider);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting default email provider {ProviderId}", id);
                return StatusCode(500, new { message = "Varsayılan email sağlayıcısı ayarlanırken hata oluştu" });
            }
        }

        #endregion

        #region SMS Providers

        [HttpGet("sms-providers")]
        public async Task<IActionResult> GetSmsProviders()
        {
            try
            {
                var providers = await _settingsService.GetSmsProvidersAsync();
                return Ok(providers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting SMS providers");
                return StatusCode(500, new { message = "SMS sağlayıcıları alınırken hata oluştu" });
            }
        }

        [HttpGet("sms-providers/{id}")]
        public async Task<IActionResult> GetSmsProviderById(int id)
        {
            try
            {
                var provider = await _settingsService.GetSmsProviderByIdAsync(id);
                if (provider == null)
                    return NotFound(new { message = "SMS sağlayıcısı bulunamadı" });
                
                return Ok(provider);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting SMS provider {ProviderId}", id);
                return StatusCode(500, new { message = "SMS sağlayıcısı bilgisi alınırken hata oluştu" });
            }
        }

        [HttpPost("sms-providers")]
        public async Task<IActionResult> CreateSmsProvider([FromBody] SmsProvider provider)
        {
            try
            {
                var createdProvider = await _settingsService.CreateSmsProviderAsync(provider);
                return CreatedAtAction(nameof(GetSmsProviderById), new { id = createdProvider.Id }, createdProvider);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating SMS provider");
                return StatusCode(500, new { message = "SMS sağlayıcısı oluşturulurken hata oluştu" });
            }
        }

        [HttpPut("sms-providers/{id}")]
        public async Task<IActionResult> UpdateSmsProvider(int id, [FromBody] SmsProvider provider)
        {
            try
            {
                provider.Id = id;
                var updatedProvider = await _settingsService.UpdateSmsProviderAsync(provider);
                return Ok(updatedProvider);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating SMS provider {ProviderId}", id);
                return StatusCode(500, new { message = "SMS sağlayıcısı güncellenirken hata oluştu" });
            }
        }

        [HttpDelete("sms-providers/{id}")]
        public async Task<IActionResult> DeleteSmsProvider(int id)
        {
            try
            {
                var result = await _settingsService.DeleteSmsProviderAsync(id);
                if (result)
                    return Ok(new { message = "SMS sağlayıcısı başarıyla silindi" });
                else
                    return NotFound(new { message = "SMS sağlayıcısı bulunamadı" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting SMS provider {ProviderId}", id);
                return StatusCode(500, new { message = "SMS sağlayıcısı silinirken hata oluştu" });
            }
        }

        [HttpPost("sms-providers/{id}/set-default")]
        public async Task<IActionResult> SetDefaultSmsProvider(int id)
        {
            try
            {
                var provider = await _settingsService.SetDefaultSmsProviderAsync(id);
                return Ok(provider);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting default SMS provider {ProviderId}", id);
                return StatusCode(500, new { message = "Varsayılan SMS sağlayıcısı ayarlanırken hata oluştu" });
            }
        }

        #endregion

        #region System Health

        [HttpGet("health")]
        public async Task<IActionResult> GetSystemHealth()
        {
            try
            {
                var health = await _settingsService.GetSystemHealthAsync();
                return Ok(health);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system health");
                return StatusCode(500, new { message = "Sistem sağlığı bilgisi alınırken hata oluştu" });
            }
        }

        [HttpGet("statistics")]
        public async Task<IActionResult> GetSystemStatistics()
        {
            try
            {
                var stats = await _settingsService.GetSystemStatisticsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system statistics");
                return StatusCode(500, new { message = "Sistem istatistikleri alınırken hata oluştu" });
            }
        }

        #endregion

        #region Maintenance Mode

        [HttpPost("maintenance")]
        public async Task<IActionResult> SetMaintenanceMode([FromBody] MaintenanceModeRequest request)
        {
            try
            {
                var result = await _settingsService.SetMaintenanceModeAsync(
                    request.Enabled, 
                    request.Message, 
                    request.StartTime, 
                    request.EndTime);
                
                return Ok(new { message = "Bakım modu başarıyla ayarlandı" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting maintenance mode");
                return StatusCode(500, new { message = "Bakım modu ayarlanırken hata oluştu" });
            }
        }

        [HttpGet("maintenance")]
        public async Task<IActionResult> GetMaintenanceStatus()
        {
            try
            {
                var status = await _settingsService.GetMaintenanceStatusAsync();
                return Ok(status);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting maintenance status");
                return StatusCode(500, new { message = "Bakım durumu alınırken hata oluştu" });
            }
        }

        #endregion
    }

    public class MaintenanceModeRequest
    {
        public bool Enabled { get; set; }
        public string? Message { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
    }
}
