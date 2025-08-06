using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectricityTrackerAPI.Models.Core
{
    public class KnowledgeBaseArticle
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty; // billing, technical, reports, users, general
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        public int Views { get; set; } = 0;
        
        public int HelpfulCount { get; set; } = 0;
        
        public int NotHelpfulCount { get; set; } = 0;
        
        public bool IsPublished { get; set; } = true;
        
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? LastUpdatedAt { get; set; }
        
        [MaxLength(100)]
        public string? Author { get; set; }
        
        [MaxLength(500)]
        public string? Summary { get; set; }
        
        public string? Tags { get; set; } // JSON array of tags
        
        public string? Metadata { get; set; } // JSON for additional data
    }
} 