using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Models;

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
        public DbSet<Department> Departments { get; set; }
        public DbSet<Facility> Facilities { get; set; }
        public DbSet<ElectricityMeter> ElectricityMeters { get; set; }
        public DbSet<ConsumptionRecord> ConsumptionRecords { get; set; }
        public DbSet<LogEntry> LogEntries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Tenant configuration
            modelBuilder.Entity<Tenant>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
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

            // Seed data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Tenant
            modelBuilder.Entity<Tenant>().HasData(new Tenant
            {
                Id = 1,
                CompanyName = "Demo Şirketi A.Ş.",
                ContactPerson = "Ahmet Yılmaz",
                Email = "info@demosirketi.com",
                Phone = "+90 212 555 0123",
                Address = "İstanbul, Türkiye",
                TaxNumber = "1234567890",
                TaxOffice = "Kadıköy",
                IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            });

            // Seed Department
            modelBuilder.Entity<Department>().HasData(new Department
            {
                Id = 1,
                Name = "Genel Yönetim",
                Description = "Şirket genel yönetim departmanı",
                ManagerName = "Ahmet Yılmaz",
                ManagerEmail = "ahmet@demosirketi.com",
                IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                TenantId = 1
            });

            // Seed User
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 1,
                FirstName = "Admin",
                LastName = "User",
                Email = "admin@example.com",
                PasswordHash = "$2a$11$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O", // "password" hash'i
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                TenantId = 1,
                DepartmentId = 1
            });

            // Seed Facility
            modelBuilder.Entity<Facility>().HasData(new Facility
            {
                Id = 1,
                Name = "Ana Ofis",
                Address = "Kadıköy, İstanbul",
                FacilityCode = "OFIS001",
                Type = FacilityType.Office,
                IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                TenantId = 1,
                DepartmentId = 1
            });

            // Seed ElectricityMeter
            modelBuilder.Entity<ElectricityMeter>().HasData(new ElectricityMeter
            {
                Id = 1,
                MeterNumber = "MTR001",
                Description = "Ana ofis elektrik sayacı",
                Type = MeterType.Digital,
                CurrentReading = 1500.50m,
                PreviousReading = 1400.00m,
                LastReadingDate = new DateTime(2023, 12, 31, 0, 0, 0, DateTimeKind.Utc),
                IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                TenantId = 1,
                FacilityId = 1
            });
        }
    }
} 