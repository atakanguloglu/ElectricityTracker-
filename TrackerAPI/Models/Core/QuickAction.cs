using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectricityTrackerAPI.Models.Core
{
    public class QuickAction
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty; // billing, payment, reports, users, technical, settings
        
        [MaxLength(50)]
        public string? Icon { get; set; }
        
        public int UsageCount { get; set; } = 0;
        
        public bool IsActive { get; set; } = true;
        
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? LastUsedAt { get; set; }
        
        [MaxLength(20)]
        public string? Priority { get; set; } // high, medium, low
        
        public string? Metadata { get; set; } // JSON for additional data
    }
} 