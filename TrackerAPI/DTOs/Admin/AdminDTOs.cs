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
        public int Id { get; set; }  // Id alanını ekle
        public string Type { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal MonthlyFee { get; set; }
        public List<string> Features { get; set; } = new List<string>();
        public string Limits { get; set; } = string.Empty;
    }

    public class UpdateSubscriptionPlanDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal MonthlyFee { get; set; }
        public string Currency { get; set; } = "TRY";
        public string Features { get; set; } = string.Empty;
        public string Limits { get; set; } = string.Empty;
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

    // Security DTOs
    public class SecurityAlertDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? TenantId { get; set; }
        public string? TenantName { get; set; }
        public int? UserId { get; set; }
        public string? UserName { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool Resolved { get; set; }
        public DateTime Timestamp { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public string? ResolvedBy { get; set; }
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
        public string? Location { get; set; }
        public string? Details { get; set; }
    }

    public class SecurityAlertDetailsDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Impact { get; set; } = string.Empty;
        public string Resolution { get; set; } = string.Empty;
        public List<string> Actions { get; set; } = new List<string>();
        public SecurityAlertDetailsInfoDto Details { get; set; } = new SecurityAlertDetailsInfoDto();
        public List<SecurityTimelineDto> Timeline { get; set; } = new List<SecurityTimelineDto>();
    }

    public class SecurityAlertDetailsInfoDto
    {
        public int AttemptCount { get; set; }
        public string? IpAddress { get; set; }
        public string? Location { get; set; }
        public string? DeviceType { get; set; }
        public string? Browser { get; set; }
        public string? Os { get; set; }
    }

    public class SecurityTimelineDto
    {
        public DateTime Time { get; set; }
        public string Event { get; set; } = string.Empty;
    }

    public class TenantSecurityReportDto
    {
        public int TenantId { get; set; }
        public string TenantName { get; set; } = string.Empty;
        public DateTime GeneratedAt { get; set; }
        public int SecurityScore { get; set; }
        public string RiskLevel { get; set; } = string.Empty;
        public TenantSecuritySummaryDto Summary { get; set; } = new TenantSecuritySummaryDto();
        public List<SecurityIssueDto> SecurityIssues { get; set; } = new List<SecurityIssueDto>();
        public List<string> Recommendations { get; set; } = new List<string>();
    }

    public class TenantSecuritySummaryDto
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int LockedUsers { get; set; }
        public int ApiKeys { get; set; }
        public int ActiveApiKeys { get; set; }
        public int ActiveAlerts { get; set; }
        public int BlockedIPs { get; set; }
    }

    public class SecurityIssueDto
    {
        public string Type { get; set; } = string.Empty;
        public int Count { get; set; }
        public string Severity { get; set; } = string.Empty;
    }

    public class UserSecurityHistoryDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string? TenantName { get; set; }
        public string AccountStatus { get; set; } = string.Empty;
        public UserSecurityStatsDto SecurityStats { get; set; } = new UserSecurityStatsDto();
        public List<SecurityEventDto> SecurityEvents { get; set; } = new List<SecurityEventDto>();
    }

    public class UserSecurityStatsDto
    {
        public int TotalLogins { get; set; }
        public int FailedLogins { get; set; }
        public int PasswordChanges { get; set; }
        public int SecurityAlerts { get; set; }
    }

    public class SecurityEventDto
    {
        public DateTime Timestamp { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? IpAddress { get; set; }
        public bool Resolved { get; set; }
    }

    public class BlockedIPDto
    {
        public int Id { get; set; }
        public string IpAddress { get; set; } = string.Empty;
        public int? TenantId { get; set; }
        public string? TenantName { get; set; }
        public string Reason { get; set; } = string.Empty;
        public DateTime BlockedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public bool IsActive { get; set; }
        public string? BlockedBy { get; set; }
        public int? AttemptCount { get; set; }
    }

    public class TenantSecurityScoreDto
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public string TenantName { get; set; } = string.Empty;
        public int SecurityScore { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public string PasswordPolicy { get; set; } = string.Empty;
        public DateTime LastSecurityAudit { get; set; }
        public int ActiveThreats { get; set; }
        public int BlockedIPs { get; set; }
        public string? SecurityRecommendations { get; set; }
    }

    // Analytics DTOs
    public class AnalyticsOverviewDto
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public decimal TotalRevenue { get; set; }
        public double AvgSessionTime { get; set; }
    }

    public class AnalyticsTrendDto
    {
        public string Date { get; set; } = string.Empty;
        public int Users { get; set; }
        public decimal Revenue { get; set; }
        public int Sessions { get; set; }
    }

    public class TopTenantDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public double Consumption { get; set; }
        public double Growth { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class DeviceUsageDto
    {
        public string Device { get; set; } = string.Empty;
        public int Usage { get; set; }
        public string Color { get; set; } = string.Empty;
    }

    // AI Analytics DTOs
    public class ConsumptionPredictionDto
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public string TenantName { get; set; } = string.Empty;
        public string ResourceType { get; set; } = string.Empty;
        public string ResourceName { get; set; } = string.Empty;
        public double CurrentMonth { get; set; }
        public double PredictedNextMonth { get; set; }
        public double PredictedYearly { get; set; }
        public int Confidence { get; set; }
        public string Trend { get; set; } = string.Empty;
        public List<string> Factors { get; set; } = new();
        public List<string> Recommendations { get; set; } = new();
    }

    public class CostSavingsDto
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public string TenantName { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public double CurrentCost { get; set; }
        public double PotentialSavings { get; set; }
        public double SavingsPercentage { get; set; }
        public List<string> Recommendations { get; set; } = new();
        public string ImplementationTime { get; set; } = string.Empty;
        public double ROI { get; set; }
        public string Priority { get; set; } = string.Empty;
    }

    public class DepartmentKPIDto
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public string TenantName { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public double EnergyEfficiency { get; set; }
        public double CostPerEmployee { get; set; }
        public double SustainabilityScore { get; set; }
        public List<string> ImprovementAreas { get; set; } = new();
    }

    public class CarbonFootprintDto
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public string TenantName { get; set; } = string.Empty;
        public double CurrentMonth { get; set; }
        public double PreviousMonth { get; set; }
        public double Reduction { get; set; }
        public double Target { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class ExecutiveKPIDto
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public string TenantName { get; set; } = string.Empty;
        public double TotalEnergyCost { get; set; }
        public double EnergyEfficiency { get; set; }
        public double SustainabilityScore { get; set; }
        public double CostSavings { get; set; }
        public double ComplianceScore { get; set; }
    }

} 