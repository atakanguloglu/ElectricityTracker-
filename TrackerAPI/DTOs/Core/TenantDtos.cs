using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.DTOs.Core
{
    public class TenantRegistrationDto
    {
        [Required]
        [StringLength(100)]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string ContactPerson { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Address { get; set; }

        [StringLength(50)]
        public string? TaxNumber { get; set; }

        [StringLength(50)]
        public string? TaxOffice { get; set; }

        [StringLength(50)]
        public string? Subdomain { get; set; }

        [StringLength(100)]
        public string? CustomDomain { get; set; }

        public int? MaxUsers { get; set; }

        public int? MaxFacilities { get; set; }

        // Admin user information
        [Required]
        [StringLength(100)]
        public string AdminFirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string AdminLastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string AdminEmail { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string AdminPassword { get; set; } = string.Empty;
    }

    public class TenantUpdateDto
    {
        [StringLength(100)]
        public string? ContactPerson { get; set; }

        [StringLength(20)]
        public string? Phone { get; set; }

        [StringLength(200)]
        public string? Address { get; set; }
    }

    public class TenantInfoDto
    {
        public int Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? Subdomain { get; set; }
        public string? CustomDomain { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime SubscriptionStartDate { get; set; }
        public DateTime? SubscriptionEndDate { get; set; }
        public int MaxUsers { get; set; }
        public int MaxFacilities { get; set; }
        public int UserCount { get; set; }
        public int FacilityCount { get; set; }
        public int DepartmentCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
} 