using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.DTOs
{
    public class DepartmentCreateDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(100)]
        public string? ManagerName { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? ManagerEmail { get; set; }
    }

    public class DepartmentUpdateDto
    {
        [StringLength(100)]
        public string? Name { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(100)]
        public string? ManagerName { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? ManagerEmail { get; set; }
    }

    public class DepartmentInfoDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ManagerName { get; set; }
        public string? ManagerEmail { get; set; }
        public int UserCount { get; set; }
        public int FacilityCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
} 