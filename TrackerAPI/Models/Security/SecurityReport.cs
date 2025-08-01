using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectricityTrackerAPI.Models.Security
{
    public class SecurityReport
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int TenantId { get; set; }
        
        [Required]
        public string ReportType { get; set; } = string.Empty; // daily, weekly, monthly, custom
        
        [Required]
        public DateTime ReportDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        // Report Data (JSON)
        [Required]
        public string ReportData { get; set; } = string.Empty; // JSON string containing report data
        
        // Summary Statistics
        public int TotalAlerts { get; set; } = 0;
        public int CriticalAlerts { get; set; } = 0;
        public int HighAlerts { get; set; } = 0;
        public int MediumAlerts { get; set; } = 0;
        public int LowAlerts { get; set; } = 0;
        public int ResolvedAlerts { get; set; } = 0;
        public int PendingAlerts { get; set; } = 0;
        
        public int TotalBlockedIPs { get; set; } = 0;
        public int TotalLockedAccounts { get; set; } = 0;
        public int TotalFailedLogins { get; set; } = 0;
        public int TotalSuccessfulLogins { get; set; } = 0;
        
        // Security Score
        public double SecurityScore { get; set; } = 0.0;
        public string SecurityScoreTrend { get; set; } = string.Empty; // improving, declining, stable
        
        // Recommendations
        public string? Recommendations { get; set; } // JSON array of recommendations
        
        // Export Information
        public string? ExportFormat { get; set; } // pdf, excel, csv, json
        public string? ExportPath { get; set; }
        public long? ExportFileSize { get; set; }
        public DateTime? ExportedAt { get; set; }
        public string? ExportedBy { get; set; }
        
        // Status
        [Required]
        public string Status { get; set; } = string.Empty; // generated, exported, archived
        
        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public string? CreatedBy { get; set; }
        
        // Navigation property
        [ForeignKey("TenantId")]
        public virtual Core.Tenant? Tenant { get; set; }
    }
} 