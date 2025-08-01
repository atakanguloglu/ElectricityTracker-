namespace ElectricityTrackerAPI.DTOs.Admin
{
    public class DashboardStatsDto
    {
        public int TotalTenants { get; set; }
        public int ActiveTenants { get; set; }
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int TotalLogs { get; set; }
        public int TodayLogs { get; set; }
        public int SystemHealth { get; set; }
        public int SecurityScore { get; set; }
    }

    public class RecentActivityDto
    {
        public int Id { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string? TenantName { get; set; }
        public string? UserName { get; set; }
    }

    public class SystemResourcesDto
    {
        public int CpuUsage { get; set; }
        public int MemoryUsage { get; set; }
        public int DiskUsage { get; set; }
        public int NetworkUsage { get; set; }
        public int DatabaseConnections { get; set; }
        public int ActiveSessions { get; set; }
    }

    public class TenantDto
    {
        public int Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string FacilityCode { get; set; } = string.Empty;
        public string Domain { get; set; } = string.Empty;
        public string AdminEmail { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Subscription { get; set; } = string.Empty;
        public int UserCount { get; set; }
        public int FacilityCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime? LicenseExpiry { get; set; }
        public string? TotalConsumption { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string? Logo { get; set; }
        public decimal MonthlyFee { get; set; }
        public DateTime? LastPayment { get; set; }
    }

    public class CreateTenantDto
    {
        public string CompanyName { get; set; } = string.Empty;
        public string FacilityCode { get; set; } = string.Empty;
        public string Domain { get; set; } = string.Empty;
        public string AdminEmail { get; set; } = string.Empty;
        public string Subscription { get; set; } = string.Empty;
        public string Currency { get; set; } = "TRY";
        public string Language { get; set; } = "tr";
        public bool AutoCreateAdmin { get; set; } = true;
    }

    public class UpdateTenantDto
    {
        public string CompanyName { get; set; } = string.Empty;
        public string FacilityCode { get; set; } = string.Empty;
        public string Domain { get; set; } = string.Empty;
        public string AdminEmail { get; set; } = string.Empty;
        public string Subscription { get; set; } = string.Empty;
        public string Currency { get; set; } = "TRY";
        public string Language { get; set; } = "tr";
    }

    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int TenantId { get; set; }
        public string TenantName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool IsLocked { get; set; }
        public DateTime? LastLogin { get; set; }
        public string? LastLoginIp { get; set; }
        public int LoginCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Phone { get; set; }
        public string? Department { get; set; }
        public string? PasswordHash { get; set; }
    }

    public class CreateUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public int TenantId { get; set; }
        public int? DepartmentId { get; set; }
    }

    public class UpdateUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public bool? IsLocked { get; set; }
        public int? DepartmentId { get; set; }
    }

    public class LoginHistoryDto
    {
        public int Id { get; set; }
        public DateTime Timestamp { get; set; }
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Details { get; set; }
    }

    public class ApiKeyDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Key { get; set; } = string.Empty;
        public int TenantId { get; set; }
        public string TenantName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Permissions { get; set; } = string.Empty;
        public int RateLimit { get; set; }
        public string RateLimitPeriod { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? LastUsed { get; set; }
        public int TotalCalls { get; set; }
        public decimal ErrorRate { get; set; }
        public string? WebhookUrl { get; set; }
        public string? WebhookStatus { get; set; }
    }

    public class CreateApiKeyDto
    {
        public string Name { get; set; } = string.Empty;
        public int TenantId { get; set; }
        public string Permissions { get; set; } = string.Empty;
        public int RateLimit { get; set; } = 1000;
        public string RateLimitPeriod { get; set; } = "minute";
        public string? WebhookUrl { get; set; }
    }

    public class UpdateApiKeyDto
    {
        public string Name { get; set; } = string.Empty;
        public string Permissions { get; set; } = string.Empty;
        public int RateLimit { get; set; } = 1000;
        public string RateLimitPeriod { get; set; } = "minute";
        public string? WebhookUrl { get; set; }
    }

    public class ApiUsageDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int Calls { get; set; }
        public int Errors { get; set; }
        public int AvgResponseTime { get; set; }
        public string PeakHour { get; set; } = string.Empty;
    }

    public class SubscriptionPlanDto
    {
        public string Type { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal MonthlyFee { get; set; }
        public List<string> Features { get; set; } = new List<string>();
        public Dictionary<string, int> Limits { get; set; } = new Dictionary<string, int>();
    }

    public class UpdateSubscriptionPlanDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal MonthlyFee { get; set; }
        public string Currency { get; set; } = "TRY";
        public List<string> Features { get; set; } = new List<string>();
        public Dictionary<string, int> Limits { get; set; } = new Dictionary<string, int>();
    }

    public class CurrencyDto
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Symbol { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
    }

    public class TenantAccessDto
    {
        public int TenantId { get; set; }
        public string AccessUrl { get; set; } = string.Empty;
        public string AccessToken { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public string TenantStatus { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
    }

    public class SuspendTenantDto
    {
        public string Reason { get; set; } = string.Empty;
    }

    public class TenantStatusCheckDto
    {
        public int TenantId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public DateTime? SubscriptionEndDate { get; set; }
        public string? SuspensionReason { get; set; }
        public DateTime? SuspendedAt { get; set; }
        public int ActiveUsers { get; set; }
        public int TotalUsers { get; set; }
        public int ActiveApiKeys { get; set; }
        public int TotalApiKeys { get; set; }
        public bool CanActivate { get; set; }
        public bool CanSuspend { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime CreatedAt { get; set; }
    }
} 