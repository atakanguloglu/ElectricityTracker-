using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.Models.Admin
{
    public class ApiUsage
    {
        [Key]
        public int Id { get; set; }

        public int ApiKeyId { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow.Date;

        public int Calls { get; set; } = 0;

        public int Errors { get; set; } = 0;

        public int AvgResponseTime { get; set; } = 0;

        public string PeakHour { get; set; } = string.Empty;

        // Navigation properties
        public virtual ApiKey ApiKey { get; set; } = null!;
    }
} 