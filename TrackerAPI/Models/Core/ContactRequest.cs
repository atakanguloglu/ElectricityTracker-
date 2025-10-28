using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectricityTrackerAPI.Models.Core
{
    public class ContactRequest
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string? Phone { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Subject { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty; // general, technical, billing, support
        
        [Required]
        [StringLength(20)]
        public string Priority { get; set; } = "medium"; // low, medium, high, urgent
        
        [Required]
        public string Message { get; set; } = string.Empty;
        
        [Required]
        public string Status { get; set; } = "new"; // new, in-progress, resolved, closed
        
        [StringLength(50)]
        public string? AssignedTo { get; set; }
        
        public int? AssignedToUserId { get; set; }
        
        [ForeignKey("AssignedToUserId")]
        public virtual User? AssignedToUser { get; set; }
        
        // Response
        public string? Response { get; set; }
        
        public DateTime? RespondedAt { get; set; }
        
        public string? RespondedBy { get; set; }
        
        public int? ResponseTimeHours { get; set; }
        
        // Customer Information
        [StringLength(100)]
        public string? Company { get; set; }
        
        [StringLength(50)]
        public string? Department { get; set; }
        
        [StringLength(100)]
        public string? Location { get; set; }
        
        // Additional Details
        public string? AdditionalInfo { get; set; } // JSON object for additional fields
        
        public string? Attachments { get; set; } // JSON array of file paths
        
        public string? Tags { get; set; } // JSON array of tags
        
        // Customer Satisfaction
        public int? Rating { get; set; } // 1-5 stars
        
        public string? Feedback { get; set; }
        
        public bool IsResolved { get; set; } = false;
        
        public DateTime? ResolvedAt { get; set; }
        
        public string? ResolutionNotes { get; set; }
        
        // Follow-up
        public bool RequiresFollowUp { get; set; } = false;
        
        public DateTime? FollowUpDate { get; set; }
        
        public string? FollowUpNotes { get; set; }
        
        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public string? CreatedBy { get; set; }
        
        public string? UpdatedBy { get; set; }
        
        // Tenant-specific
        public int? TenantId { get; set; }
        
        [ForeignKey("TenantId")]
        public virtual Tenant? Tenant { get; set; }
        
        // Source tracking
        [StringLength(100)]
        public string? Source { get; set; } // website, mobile-app, email, phone
        
        [StringLength(255)]
        public string? UserAgent { get; set; }
        
        [StringLength(45)]
        public string? IpAddress { get; set; }
    }
}
