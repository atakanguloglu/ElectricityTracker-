using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.Models
{
    public class LogEntry
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [Required]
        [StringLength(50)]
        public string Level { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Message { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Source { get; set; }

        [StringLength(100)]
        public string? UserId { get; set; }

        [StringLength(100)]
        public string? UserEmail { get; set; }

        [StringLength(50)]
        public string? TenantId { get; set; }

        [StringLength(255)]
        public string? RequestPath { get; set; }

        [StringLength(20)]
        public string? RequestMethod { get; set; }

        [StringLength(45)]
        public string? IpAddress { get; set; }

        [StringLength(500)]
        public string? Exception { get; set; }

        [StringLength(1000)]
        public string? AdditionalData { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum LogLevel
    {
        Debug,
        Information,
        Warning,
        Error,
        Fatal
    }
} 