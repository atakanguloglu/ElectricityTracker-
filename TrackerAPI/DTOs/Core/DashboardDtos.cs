using System.ComponentModel.DataAnnotations;

namespace ElectricityTrackerAPI.DTOs.Core
{
    public class DashboardStatsDto
    {
        public string TenantName { get; set; } = string.Empty;
        public int UserCount { get; set; }
        public int DepartmentCount { get; set; }
        public int FacilityCount { get; set; }
        public int MeterCount { get; set; }
        public decimal TotalConsumption { get; set; }
        public int ActiveAlerts { get; set; }
        public string SubscriptionStatus { get; set; } = string.Empty;
        public DateTime SubscriptionEndDate { get; set; }
    }

    public class ConsumptionChartDto
    {
        public string Month { get; set; } = string.Empty;
        public decimal Consumption { get; set; }
        public decimal Target { get; set; }
    }

    public class FacilityDistributionDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal Consumption { get; set; }
        public string Color { get; set; } = string.Empty;
    }

    public class AlertDto
    {
        public int Id { get; set; }
        public string Facility { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
} 