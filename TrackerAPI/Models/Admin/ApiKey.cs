using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.Models.Admin
{
    public class ApiKey
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(64)]
        public string Key { get; set; } = string.Empty;

        [Required]
        public int TenantId { get; set; }

        public ApiKeyStatus Status { get; set; } = ApiKeyStatus.Active;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastUsed { get; set; }

        public int TotalCalls { get; set; } = 0;

        public decimal ErrorRate { get; set; } = 0;

        public int RateLimit { get; set; } = 1000;

        public string RateLimitPeriod { get; set; } = "minute";

        public string? WebhookUrl { get; set; }

        public WebhookStatus? WebhookStatus { get; set; }

        public string Permissions { get; set; } = "read"; // JSON string of permissions

        // Navigation properties
        public virtual Core.Tenant Tenant { get; set; } = null!;
        public virtual ICollection<Webhook> Webhooks { get; set; } = new List<Webhook>();
        public virtual ICollection<ApiUsage> ApiUsages { get; set; } = new List<ApiUsage>();
    }

    public enum ApiKeyStatus
    {
        Active,
        Inactive,
        Revoked
    }

    public enum WebhookStatus
    {
        Active,
        Inactive,
        Error
    }
} 