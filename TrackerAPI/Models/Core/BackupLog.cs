using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectricityTrackerAPI.Models.Core
{
    public class BackupLog
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string Type { get; set; } = "full"; // full, incremental, differential
        
        [Required]
        public string Status { get; set; } = "pending"; // pending, running, completed, failed
        
        [Required]
        public long SizeBytes { get; set; }
        
        public string SizeFormatted => FormatFileSize(SizeBytes);
        
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? CompletedAt { get; set; }
        
        public int DurationSeconds { get; set; }
        
        public string DurationFormatted => FormatDuration(DurationSeconds);
        
        public string? FilePath { get; set; }
        
        public string? ErrorMessage { get; set; }
        
        public string? Checksum { get; set; }
        
        public bool IsCompressed { get; set; } = true;
        
        public string? BackupLocation { get; set; } // local, cloud, external
        
        public string? RetentionPolicy { get; set; }
        
        public DateTime? ExpiresAt { get; set; }
        
        public bool IsDeleted { get; set; } = false;
        
        public DateTime? DeletedAt { get; set; }
        
        public string? DeletedBy { get; set; }
        
        // Navigation properties
        public int? TenantId { get; set; }
        
        [ForeignKey("TenantId")]
        public virtual Tenant? Tenant { get; set; }
        
        // Helper methods
        private string FormatFileSize(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB", "TB" };
            double len = bytes;
            int order = 0;
            
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len = len / 1024;
            }
            
            return $"{len:0.##} {sizes[order]}";
        }
        
        private string FormatDuration(int seconds)
        {
            if (seconds < 60)
                return $"{seconds} saniye";
            
            if (seconds < 3600)
                return $"{seconds / 60} dakika";
            
            var hours = seconds / 3600;
            var minutes = (seconds % 3600) / 60;
            return $"{hours} saat {minutes} dakika";
        }
    }
}
