using ElectricityTrackerAPI.Models;
using BCrypt.Net;

namespace ElectricityTrackerAPI.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            // Veritabanının oluşturulduğundan emin ol
            context.Database.EnsureCreated();

            // Demo tenant var mı kontrol et
            if (!context.Tenants.Any())
            {
                // Demo tenant oluştur
                var demoTenant = new Tenant
                {
                    CompanyName = "Demo Şirketi",
                    ContactPerson = "Demo Admin",
                    Email = "admin@example.com",
                    Phone = "+90 212 555 0123",
                    Address = "Demo Adres, İstanbul",
                    Status = TenantStatus.Active,
                    SubscriptionStartDate = DateTime.UtcNow,
                    SubscriptionEndDate = DateTime.UtcNow.AddYears(1),
                    MaxUsers = 10,
                    MaxFacilities = 5,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                context.Tenants.Add(demoTenant);
                context.SaveChanges();

                // Demo admin kullanıcısı oluştur
                var demoUser = new User
                {
                    FirstName = "Admin",
                    LastName = "User",
                    Email = "admin@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                    Role = UserRole.Admin,
                    TenantId = demoTenant.Id,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.Add(demoUser);
                context.SaveChanges();

                Console.WriteLine("Demo tenant ve admin kullanıcısı oluşturuldu!");
                Console.WriteLine($"Email: admin@example.com");
                Console.WriteLine($"Şifre: password");
                Console.WriteLine($"Tenant ID: {demoTenant.Id}");
            }
            else
            {
                Console.WriteLine("Demo tenant zaten mevcut.");
            }
        }
    }
} 