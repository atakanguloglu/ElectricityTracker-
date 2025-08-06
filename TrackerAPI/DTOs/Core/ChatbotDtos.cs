using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.DTOs.Core
{
    public class ChatbotConversationDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Category { get; set; }
        public int MessageCount { get; set; }
        public int? Satisfaction { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastMessageAt { get; set; }
        public string LastMessage { get; set; } = string.Empty;
    }

    public class ChatbotMessageDto
    {
        public int Id { get; set; }
        public int ConversationId { get; set; }
        public string Sender { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string? MessageType { get; set; }
        public bool IsRead { get; set; }
        public string? Metadata { get; set; }
    }

    public class CreateConversationDto
    {
        public string? Title { get; set; }
        public string? Category { get; set; }
    }

    public class SendMessageDto
    {
        public string Content { get; set; } = string.Empty;
    }

    public class CreateChatbotMessageDto
    {
        [Required]
        public string Sender { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        public string? MessageType { get; set; }
        
        public string? Metadata { get; set; }
    }

    public class UpdateSatisfactionDto
    {
        public int Satisfaction { get; set; } // 1-5
    }

    public class QuickActionDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Icon { get; set; }
        public int UsageCount { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastUsedAt { get; set; }
        public string? Priority { get; set; }
        public string? Metadata { get; set; }
    }

    public class CreateQuickActionDto
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string? Icon { get; set; }
        
        [MaxLength(20)]
        public string? Priority { get; set; }
        
        public string? Metadata { get; set; }
    }

    public class UpdateQuickActionDto
    {
        [MaxLength(100)]
        public string? Title { get; set; }
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        [MaxLength(50)]
        public string? Category { get; set; }
        
        [MaxLength(50)]
        public string? Icon { get; set; }
        
        public bool? IsActive { get; set; }
        
        [MaxLength(20)]
        public string? Priority { get; set; }
        
        public string? Metadata { get; set; }
    }

    public class KnowledgeBaseArticleDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int Views { get; set; }
        public int HelpfulCount { get; set; }
        public int NotHelpfulCount { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastUpdatedAt { get; set; }
        public string? Author { get; set; }
        public string? Summary { get; set; }
        public string? Tags { get; set; }
        public string? Metadata { get; set; }
    }

    public class CreateKnowledgeBaseArticleDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string? Author { get; set; }
        
        [MaxLength(500)]
        public string? Summary { get; set; }
        
        public string? Tags { get; set; }
        
        public string? Metadata { get; set; }
    }

    public class UpdateKnowledgeBaseArticleDto
    {
        [MaxLength(200)]
        public string? Title { get; set; }
        
        [MaxLength(50)]
        public string? Category { get; set; }
        
        public string? Content { get; set; }
        
        public bool? IsPublished { get; set; }
        
        [MaxLength(100)]
        public string? Author { get; set; }
        
        [MaxLength(500)]
        public string? Summary { get; set; }
        
        public string? Tags { get; set; }
        
        public string? Metadata { get; set; }
    }

    public class ChatbotStatisticsDto
    {
        public int ActiveConversations { get; set; }
        public double AverageSatisfaction { get; set; }
        public double ResolutionRate { get; set; }
        public int DailyMessages { get; set; }
        public int TotalConversations { get; set; }
        public int TotalMessages { get; set; }
        public int TotalQuickActions { get; set; }
        public int TotalKnowledgeArticles { get; set; }
    }
} 