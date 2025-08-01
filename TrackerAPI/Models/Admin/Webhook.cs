using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.Models.Admin
{
    public class Webhook
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Url { get; set; } = string.Empty;

        public int ApiKeyId { get; set; }

        public WebhookStatus Status { get; set; } = WebhookStatus.Active;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastDelivery { get; set; }

        public decimal SuccessRate { get; set; } = 0;

        public int RetryCount { get; set; } = 3;

        public string Events { get; set; } = "[]"; // JSON array of events

        // Navigation properties
        public virtual ApiKey ApiKey { get; set; } = null!;
    }
} 