using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectricityTrackerAPI.Models.Core
{
    public class HelpCategory
    {
        [Key]
        public int Id { get; set; }
        
            [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Slug { get; set; } = string.Empty;
    
    [StringLength(255)]
    public string? Description { get; set; }
        
        [StringLength(100)]
        public string? Icon { get; set; }
        
        [StringLength(50)]
        public string? Color { get; set; }
        
        [Required]
        public int SortOrder { get; set; } = 0;
        
        [Required]
        public bool IsActive { get; set; } = true;
        
        [Required]
        public bool IsPublic { get; set; } = true;
        
        public int? ParentCategoryId { get; set; }
        
        [ForeignKey("ParentCategoryId")]
        public virtual HelpCategory? ParentCategory { get; set; }
        
        public virtual ICollection<HelpCategory> SubCategories { get; set; } = new List<HelpCategory>();
        
        public virtual ICollection<HelpArticle> Articles { get; set; } = new List<HelpArticle>();
        
        // Statistics
        public int ArticleCount { get; set; } = 0;
        
        public int ViewCount { get; set; } = 0;
        
        public int HelpfulCount { get; set; } = 0;
        
        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public string? CreatedBy { get; set; }
        
        public string? UpdatedBy { get; set; }
        
        // Tenant-specific
        public int? TenantId { get; set; }
        
        [ForeignKey("TenantId")]
        public virtual Tenant? Tenant { get; set; }
    }
}
