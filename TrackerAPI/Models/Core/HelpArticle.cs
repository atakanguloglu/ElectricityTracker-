using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectricityTrackerAPI.Models.Core
{
    public class HelpArticle
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Slug { get; set; } = string.Empty;

        [Required]
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public virtual HelpCategory Category { get; set; } = null!;

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "draft"; // draft, published, archived

        [StringLength(200)]
        public string? SeoTitle { get; set; }

        [StringLength(500)]
        public string? SeoDescription { get; set; }

        [StringLength(500)]
        public string? SeoKeywords { get; set; }

        [Required]
        public int AuthorId { get; set; }

        [StringLength(100)]
        public string AuthorName { get; set; } = string.Empty;

        public int ViewCount { get; set; } = 0;

        public int HelpfulCount { get; set; } = 0;

        public int NotHelpfulCount { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? PublishedAt { get; set; }

        // Navigation properties
        public virtual ICollection<HelpArticleInteraction> Interactions { get; set; } = new List<HelpArticleInteraction>();
    }

    public class HelpArticleInteraction
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ArticleId { get; set; }

        [ForeignKey("ArticleId")]
        public virtual HelpArticle Article { get; set; } = null!;

        [Required]
        [StringLength(20)]
        public string Type { get; set; } = string.Empty; // view, helpful, not_helpful

        [StringLength(45)]
        public string? IpAddress { get; set; }

        [StringLength(500)]
        public string? UserAgent { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
