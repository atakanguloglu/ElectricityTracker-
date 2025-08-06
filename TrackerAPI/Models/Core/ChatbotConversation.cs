using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectricityTrackerAPI.Models.Core
{
    public class ChatbotConversation
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public int TenantId { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? LastMessageAt { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "active"; // active, closed, archived
        
        public int MessageCount { get; set; } = 0;
        
        [MaxLength(50)]
        public string? Category { get; set; } // general, technical, billing, support
        
        public int? Satisfaction { get; set; } // 1-5 rating
        
        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
        
        [ForeignKey("TenantId")]
        public virtual Tenant Tenant { get; set; } = null!;
        
        public virtual ICollection<ChatbotMessage> Messages { get; set; } = new List<ChatbotMessage>();
    }
} 