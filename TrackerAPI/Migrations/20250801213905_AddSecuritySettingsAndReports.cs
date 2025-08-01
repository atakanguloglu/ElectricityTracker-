using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TrackerAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddSecuritySettingsAndReports : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SecurityReports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    ReportType = table.Column<string>(type: "text", nullable: false),
                    ReportDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    ReportData = table.Column<string>(type: "text", nullable: false),
                    TotalAlerts = table.Column<int>(type: "integer", nullable: false),
                    CriticalAlerts = table.Column<int>(type: "integer", nullable: false),
                    HighAlerts = table.Column<int>(type: "integer", nullable: false),
                    MediumAlerts = table.Column<int>(type: "integer", nullable: false),
                    LowAlerts = table.Column<int>(type: "integer", nullable: false),
                    ResolvedAlerts = table.Column<int>(type: "integer", nullable: false),
                    PendingAlerts = table.Column<int>(type: "integer", nullable: false),
                    TotalBlockedIPs = table.Column<int>(type: "integer", nullable: false),
                    TotalLockedAccounts = table.Column<int>(type: "integer", nullable: false),
                    TotalFailedLogins = table.Column<int>(type: "integer", nullable: false),
                    TotalSuccessfulLogins = table.Column<int>(type: "integer", nullable: false),
                    SecurityScore = table.Column<double>(type: "double precision", nullable: false),
                    SecurityScoreTrend = table.Column<string>(type: "text", nullable: false),
                    Recommendations = table.Column<string>(type: "text", nullable: true),
                    ExportFormat = table.Column<string>(type: "text", nullable: true),
                    ExportPath = table.Column<string>(type: "text", nullable: true),
                    ExportFileSize = table.Column<long>(type: "bigint", nullable: true),
                    ExportedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ExportedBy = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SecurityReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SecurityReports_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TenantSecuritySettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    RequireTwoFactor = table.Column<bool>(type: "boolean", nullable: false),
                    AllowSmsTwoFactor = table.Column<bool>(type: "boolean", nullable: false),
                    AllowEmailTwoFactor = table.Column<bool>(type: "boolean", nullable: false),
                    AllowAuthenticatorApp = table.Column<bool>(type: "boolean", nullable: false),
                    MinimumPasswordLength = table.Column<int>(type: "integer", nullable: false),
                    RequireUppercase = table.Column<bool>(type: "boolean", nullable: false),
                    RequireLowercase = table.Column<bool>(type: "boolean", nullable: false),
                    RequireNumbers = table.Column<bool>(type: "boolean", nullable: false),
                    RequireSpecialCharacters = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordExpiryDays = table.Column<int>(type: "integer", nullable: false),
                    PreventPasswordReuse = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHistoryCount = table.Column<int>(type: "integer", nullable: false),
                    SessionTimeoutMinutes = table.Column<int>(type: "integer", nullable: false),
                    ForceLogoutOnPasswordChange = table.Column<bool>(type: "boolean", nullable: false),
                    AllowConcurrentSessions = table.Column<bool>(type: "boolean", nullable: false),
                    MaxConcurrentSessions = table.Column<int>(type: "integer", nullable: false),
                    MaxFailedLoginAttempts = table.Column<int>(type: "integer", nullable: false),
                    AccountLockoutDurationMinutes = table.Column<int>(type: "integer", nullable: false),
                    RequireCaptchaAfterFailedAttempts = table.Column<bool>(type: "boolean", nullable: false),
                    CaptchaThreshold = table.Column<int>(type: "integer", nullable: false),
                    EnableIpWhitelist = table.Column<bool>(type: "boolean", nullable: false),
                    AllowedIpRanges = table.Column<string>(type: "text", nullable: true),
                    BlockSuspiciousIps = table.Column<bool>(type: "boolean", nullable: false),
                    SuspiciousIpThreshold = table.Column<int>(type: "integer", nullable: false),
                    EnableSecurityAuditLog = table.Column<bool>(type: "boolean", nullable: false),
                    LogFailedLoginAttempts = table.Column<bool>(type: "boolean", nullable: false),
                    LogSuccessfulLogins = table.Column<bool>(type: "boolean", nullable: false),
                    LogPasswordChanges = table.Column<bool>(type: "boolean", nullable: false),
                    LogAdminActions = table.Column<bool>(type: "boolean", nullable: false),
                    NotifyOnFailedLogin = table.Column<bool>(type: "boolean", nullable: false),
                    NotifyOnSuspiciousActivity = table.Column<bool>(type: "boolean", nullable: false),
                    NotifyOnAccountLockout = table.Column<bool>(type: "boolean", nullable: false),
                    NotificationEmails = table.Column<string>(type: "text", nullable: true),
                    EnableBruteForceProtection = table.Column<bool>(type: "boolean", nullable: false),
                    BruteForceThreshold = table.Column<int>(type: "integer", nullable: false),
                    BruteForceWindowMinutes = table.Column<int>(type: "integer", nullable: false),
                    EnableGeolocationBlocking = table.Column<bool>(type: "boolean", nullable: false),
                    AllowedCountries = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TenantSecuritySettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TenantSecuritySettings_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SecurityReports_TenantId",
                table: "SecurityReports",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_TenantSecuritySettings_TenantId",
                table: "TenantSecuritySettings",
                column: "TenantId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SecurityReports");

            migrationBuilder.DropTable(
                name: "TenantSecuritySettings");
        }
    }
}
