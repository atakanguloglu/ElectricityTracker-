using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectricityTrackerAPI.Models.Core
{
    public class ChatbotMessage
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int ConversationId { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string Sender { get; set; } = string.Empty; // user, bot, admin
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        [Required]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        
        [MaxLength(20)]
        public string? MessageType { get; set; } // text, image, file, system
        
        public bool IsRead { get; set; } = false;
        
        public string? Metadata { get; set; } // JSON for additional data
        
        // Navigation property
        [ForeignKey("ConversationId")]
        public virtual ChatbotConversation Conversation { get; set; } = null!;
    }
} 