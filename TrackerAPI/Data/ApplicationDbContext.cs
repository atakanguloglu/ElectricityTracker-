using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Models.Core;
using ElectricityTrackerAPI.Models.Admin;
using ElectricityTrackerAPI.Models.Energy;
using ElectricityTrackerAPI.Models.Logging;
using ElectricityTrackerAPI.Models.Billing;
using ElectricityTrackerAPI.Models.Security;


namespace ElectricityTrackerAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Facility> Facilities { get; set; }
        public DbSet<ElectricityMeter> ElectricityMeters { get; set; }
        public DbSet<ConsumptionRecord> ConsumptionRecords { get; set; }
        public DbSet<LogEntry> LogEntries { get; set; }
        public DbSet<ApiKey> ApiKeys { get; set; }
        public DbSet<Webhook> Webhooks { get; set; }
        public DbSet<ApiUsage> ApiUsages { get; set; }
        public DbSet<SystemLog> SystemLogs { get; set; }
        
        // Billing
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceItem> InvoiceItems { get; set; }
        public DbSet<PaymentRecord> PaymentRecords { get; set; }
        public DbSet<ResourceType> ResourceTypes { get; set; }
        public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }
        
        // Security
        public DbSet<SecurityAlert> SecurityAlerts { get; set; }
        public DbSet<BlockedIP> BlockedIPs { get; set; }
        public DbSet<TenantSecurityScore> TenantSecurityScores { get; set; }
        public DbSet<TenantSecuritySettings> TenantSecuritySettings { get; set; }
        public DbSet<SecurityReport> SecurityReports { get; set; }
        
        // Chatbot
        public DbSet<ChatbotConversation> ChatbotConversations { get; set; }
        public DbSet<ChatbotMessage> ChatbotMessages { get; set; }
        public DbSet<QuickAction> QuickActions { get; set; }
        public DbSet<KnowledgeBaseArticle> KnowledgeBaseArticles { get; set; }

        // Settings and Help
        public DbSet<SystemSettings> SystemSettings { get; set; }
        public DbSet<BackupLog> BackupLogs { get; set; }
        public DbSet<EmailProvider> EmailProviders { get; set; }
        public DbSet<SmsProvider> SmsProviders { get; set; }
        public DbSet<HelpCategory> HelpCategories { get; set; }
        public DbSet<HelpArticle> HelpArticles { get; set; }
        public DbSet<HelpArticleInteraction> HelpArticleInteractions { get; set; }
        public DbSet<ContactRequest> ContactRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Tenant configuration
            modelBuilder.Entity<Tenant>(entity =>
            {
                entity.HasIndex(e => e.FacilityCode).IsUnique();
                entity.HasIndex(e => e.Domain).IsUnique();
                entity.HasIndex(e => e.AdminEmail).IsUnique();
                entity.HasIndex(e => e.TaxNumber).IsUnique();
            });

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasOne(e => e.Tenant)
                    .WithMany(e => e.Users)
                    .HasForeignKey(e => e.TenantId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Department)
                    .WithMany(e => e.Users)
                    .HasForeignKey(e => e.DepartmentId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // RefreshToken configuration
            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Token).IsUnique();
                entity.HasIndex(e => new { e.UserId, e.ExpiresAt });
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Department configuration
            modelBuilder.Entity<Department>(entity =>
            {
                entity.HasIndex(e => new { e.TenantId, e.Name }).IsUnique();
                entity.HasOne(e => e.Tenant)
                    .WithMany(e => e.Departments)
                    .HasForeignKey(e => e.TenantId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Facility configuration
            modelBuilder.Entity<Facility>(entity =>
            {
                entity.HasIndex(e => new { e.TenantId, e.FacilityCode }).IsUnique();
                entity.HasOne(e => e.Tenant)
                    .WithMany(e => e.Facilities)
                    .HasForeignKey(e => e.TenantId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Department)
                    .WithMany(e => e.Facilities)
                    .HasForeignKey(e => e.DepartmentId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ElectricityMeter configuration
            modelBuilder.Entity<ElectricityMeter>(entity =>
            {
                entity.HasIndex(e => new { e.TenantId, e.MeterNumber }).IsUnique();
                entity.HasOne(e => e.Tenant)
                    .WithMany(e => e.ElectricityMeters)
                    .HasForeignKey(e => e.TenantId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Facility)
                    .WithMany(e => e.ElectricityMeters)
                    .HasForeignKey(e => e.FacilityId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ConsumptionRecord configuration
            modelBuilder.Entity<ConsumptionRecord>(entity =>
            {
                entity.HasIndex(e => new { e.TenantId, e.ElectricityMeterId, e.ReadingDate });
                entity.HasOne(e => e.Tenant)
                    .WithMany()
                    .HasForeignKey(e => e.TenantId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.ElectricityMeter)
                    .WithMany(e => e.ConsumptionRecords)
                    .HasForeignKey(e => e.ElectricityMeterId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ApiKey configuration
            modelBuilder.Entity<ApiKey>(entity =>
            {
                entity.HasIndex(e => e.Key).IsUnique();
                entity.HasOne(e => e.Tenant)
                    .WithMany(e => e.ApiKeys)
                    .HasForeignKey(e => e.TenantId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Webhook configuration
            modelBuilder.Entity<Webhook>(entity =>
            {
                entity.HasOne(e => e.ApiKey)
                    .WithMany(e => e.Webhooks)
                    .HasForeignKey(e => e.ApiKeyId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ApiUsage configuration
            modelBuilder.Entity<ApiUsage>(entity =>
            {
                entity.HasIndex(e => new { e.ApiKeyId, e.Date });
                entity.HasOne(e => e.ApiKey)
                    .WithMany(e => e.ApiUsages)
                    .HasForeignKey(e => e.ApiKeyId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // SystemLog configuration
            modelBuilder.Entity<SystemLog>(entity =>
            {
                entity.HasIndex(e => e.Timestamp);
                entity.HasIndex(e => new { e.TenantId, e.Timestamp });
                entity.HasIndex(e => new { e.UserId, e.Timestamp });
                entity.HasOne(e => e.Tenant)
                    .WithMany(e => e.SystemLogs)
                    .HasForeignKey(e => e.TenantId)
                    .OnDelete(DeleteBehavior.SetNull);
                entity.HasOne(e => e.User)
                    .WithMany(e => e.SystemLogs)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Invoice configuration
            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.HasIndex(e => e.InvoiceNumber).IsUnique();
                entity.HasIndex(e => new { e.TenantId, e.InvoiceDate });
                entity.HasOne(e => e.Tenant)
                    .WithMany()
                    .HasForeignKey(e => e.TenantId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.CreatedBy)
                    .WithMany()
                    .HasForeignKey(e => e.CreatedById)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // InvoiceItem configuration
            modelBuilder.Entity<InvoiceItem>(entity =>
            {
                entity.HasOne(e => e.Invoice)
                    .WithMany(e => e.Items)
                    .HasForeignKey(e => e.InvoiceId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.ResourceType)
                    .WithMany(e => e.InvoiceItems)
                    .HasForeignKey(e => e.ResourceTypeId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // PaymentRecord configuration
            modelBuilder.Entity<PaymentRecord>(entity =>
            {
                entity.HasIndex(e => new { e.InvoiceId, e.PaymentDate });
                entity.HasOne(e => e.Invoice)
                    .WithMany(e => e.Payments)
                    .HasForeignKey(e => e.InvoiceId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.RecordedBy)
                    .WithMany()
                    .HasForeignKey(e => e.RecordedById)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ResourceType configuration
            modelBuilder.Entity<ResourceType>(entity =>
            {
                entity.HasIndex(e => new { e.TenantId, e.Name }).IsUnique();
                entity.HasOne(e => e.Tenant)
                    .WithMany()
                    .HasForeignKey(e => e.TenantId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // SystemSettings configuration
            modelBuilder.Entity<SystemSettings>(entity =>
            {
                entity.HasIndex(e => e.SystemName).IsUnique();
            });

            // BackupLog configuration
            modelBuilder.Entity<BackupLog>(entity =>
            {
                entity.HasIndex(e => e.CreatedAt);
                entity.HasIndex(e => new { e.TenantId, e.CreatedAt });
                entity.HasOne(e => e.Tenant)
                    .WithMany()
                    .HasForeignKey(e => e.TenantId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // EmailProvider configuration
            modelBuilder.Entity<EmailProvider>(entity =>
            {
                entity.HasIndex(e => e.Name).IsUnique();
                entity.HasIndex(e => e.Type);
            });

            // SmsProvider configuration
            modelBuilder.Entity<SmsProvider>(entity =>
            {
                entity.HasIndex(e => e.Name).IsUnique();
                entity.HasIndex(e => e.Type);
            });

            // Help system configuration
            modelBuilder.Entity<HelpCategory>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.Icon).HasMaxLength(50);
                entity.Property(e => e.Color).HasMaxLength(20);
                entity.Property(e => e.Slug).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.HasIndex(e => e.TenantId);
                
                entity.HasOne(e => e.ParentCategory)
                    .WithMany(e => e.SubCategories)
                    .HasForeignKey(e => e.ParentCategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<HelpArticle>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.Slug).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
                entity.Property(e => e.SeoTitle).HasMaxLength(200);
                entity.Property(e => e.SeoDescription).HasMaxLength(500);
                entity.Property(e => e.SeoKeywords).HasMaxLength(500);
                entity.Property(e => e.AuthorName).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.HasIndex(e => e.CategoryId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.IsActive);
                
                entity.HasOne(e => e.Category)
                    .WithMany()
                    .HasForeignKey(e => e.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<HelpArticleInteraction>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Type).IsRequired().HasMaxLength(20);
                entity.Property(e => e.IpAddress).HasMaxLength(45);
                entity.Property(e => e.UserAgent).HasMaxLength(500);
                entity.HasIndex(e => e.ArticleId);
                entity.HasIndex(e => e.Type);
                entity.HasIndex(e => e.CreatedAt);
                
                entity.HasOne(e => e.Article)
                    .WithMany(e => e.Interactions)
                    .HasForeignKey(e => e.ArticleId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Seed data - Kaldırıldı, DbInitializer kullanılıyor
            // SeedData(modelBuilder);
        }

        // SeedData metodu kaldırıldı - DbInitializer kullanılıyor
    }
} 