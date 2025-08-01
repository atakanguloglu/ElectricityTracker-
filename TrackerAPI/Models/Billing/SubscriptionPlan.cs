using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.Models.Billing
{
    public class SubscriptionPlan
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public decimal MonthlyFee { get; set; }
        
        public string Features { get; set; } = string.Empty; // JSON string
        
        public string Limits { get; set; } = string.Empty; // JSON string
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        public int SortOrder { get; set; } = 0;
        
        [MaxLength(20)]
        public string Currency { get; set; } = "TRY";
        
        public bool IsDefault { get; set; } = false;
        
        public bool IsPopular { get; set; } = false;
        
        [MaxLength(50)]
        public string? BadgeText { get; set; }
        
        public string? BadgeColor { get; set; }
    }
} 