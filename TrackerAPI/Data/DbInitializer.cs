using ElectricityTrackerAPI.Models.Core;
using ElectricityTrackerAPI.Models.Energy;
using ElectricityTrackerAPI.Models.Admin;
using ElectricityTrackerAPI.Models.Billing;
using ElectricityTrackerAPI.Models.Logging;
using ElectricityTrackerAPI.Models.Security;
using BCrypt.Net;
using PaymentStatus = ElectricityTrackerAPI.Models.Core.PaymentStatus;

namespace ElectricityTrackerAPI.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(ApplicationDbContext context)
        {
            // Veritabanının oluşturulduğundan emin ol
            context.Database.EnsureCreated();

            // Eski demo verileri temizle ve yeni kapsamlı verileri ekle
            Console.WriteLine("Demo veriler temizleniyor ve yeniden oluşturuluyor...");
            
            // Eski verileri temizle (foreign key sırasına göre)
            context.PaymentRecords.RemoveRange(context.PaymentRecords);
            context.InvoiceItems.RemoveRange(context.InvoiceItems);
            context.Invoices.RemoveRange(context.Invoices);
            context.ResourceTypes.RemoveRange(context.ResourceTypes);
            context.ConsumptionRecords.RemoveRange(context.ConsumptionRecords);
            context.ElectricityMeters.RemoveRange(context.ElectricityMeters);
            context.ApiKeys.RemoveRange(context.ApiKeys);
            context.Facilities.RemoveRange(context.Facilities);
            context.Users.RemoveRange(context.Users);
            context.Departments.RemoveRange(context.Departments);
            context.Tenants.RemoveRange(context.Tenants);
            context.SubscriptionPlans.RemoveRange(context.SubscriptionPlans);
            context.SecurityAlerts.RemoveRange(context.SecurityAlerts);
            context.BlockedIPs.RemoveRange(context.BlockedIPs);
            context.TenantSecurityScores.RemoveRange(context.TenantSecurityScores);
            context.TenantSecuritySettings.RemoveRange(context.TenantSecuritySettings);
            context.SecurityReports.RemoveRange(context.SecurityReports);
            context.SystemLogs.RemoveRange(context.SystemLogs);
            context.SaveChanges();
            
            // Yeni kapsamlı verileri oluştur
            await CreateDemoData(context);
        }

        private static async Task CreateDemoData(ApplicationDbContext context)
        {
            Console.WriteLine("Demo veriler oluşturuluyor...");

            // 1. Admin Paneli için Çoklu Tenant'lar oluştur
            var tenants = new List<Tenant>
            {
                new Tenant
                {
                    CompanyName = "Sistem Yönetimi",
                    FacilityCode = "SYS01",
                    Domain = "system.com",
                    AdminEmail = "superadmin@system.com",
                    ContactPerson = "Sistem Yöneticisi",
                    Phone = "+90 212 999 9999",
                    Address = "Sistem Merkezi",
                    TaxNumber = "0000000000",
                    TaxOffice = "Sistem",
                    Subdomain = "system",
                    Status = TenantStatus.Active,
                    Subscription = SubscriptionType.Premium,
                    SubscriptionStartDate = DateTime.UtcNow.AddMonths(-12),
                    SubscriptionEndDate = DateTime.UtcNow.AddYears(10),
                    MaxUsers = 1000,
                    MaxFacilities = 1000,
                    IsActive = true,
                    Currency = "TRY",
                    Language = "tr",
                    MonthlyFee = 0m,
                    PaymentStatus = PaymentStatus.Paid,
                    LastPayment = DateTime.UtcNow.AddDays(-1),
                    TotalConsumption = "0 kWh",
                    CreatedAt = DateTime.UtcNow.AddMonths(-12)
                },
                new Tenant
                {
                    CompanyName = "Demo Elektrik A.Ş.",
                    FacilityCode = "DEMO01",
                    Domain = "demo-elektrik.com",
                    AdminEmail = "admin@demo-elektrik.com",
                    ContactPerson = "Ahmet Yılmaz",
                    Phone = "+90 212 555 0123",
                    Address = "Atatürk Caddesi No:123, Şişli/İstanbul",
                    TaxNumber = "1234567890",
                    TaxOffice = "Şişli",
                    Subdomain = "demo",
                    Status = TenantStatus.Active,
                    Subscription = SubscriptionType.Premium,
                    SubscriptionStartDate = DateTime.UtcNow.AddMonths(-6),
                    SubscriptionEndDate = DateTime.UtcNow.AddMonths(6),
                    MaxUsers = 50,
                    MaxFacilities = 20,
                    IsActive = true,
                    Currency = "TRY",
                    Language = "tr",
                    MonthlyFee = 299.99m,
                    PaymentStatus = PaymentStatus.Paid,
                    LastPayment = DateTime.UtcNow.AddDays(-15),
                    TotalConsumption = "125,450 kWh",
                    CreatedAt = DateTime.UtcNow.AddMonths(-6)
                },
                new Tenant
                {
                    CompanyName = "İstanbul Fabrika Ltd. Şti.",
                    FacilityCode = "IST01",
                    Domain = "istanbul-fabrika.com",
                    AdminEmail = "admin@istanbul-fabrika.com",
                    ContactPerson = "Mehmet Kaya",
                    Phone = "+90 216 444 5678",
                    Address = "Organize Sanayi Bölgesi No:45, Gebze/Kocaeli",
                    TaxNumber = "9876543210",
                    TaxOffice = "Gebze",
                    Subdomain = "istanbul",
                    Status = TenantStatus.Active,
                    Subscription = SubscriptionType.Standard,
                    SubscriptionStartDate = DateTime.UtcNow.AddMonths(-3),
                    SubscriptionEndDate = DateTime.UtcNow.AddMonths(9),
                    MaxUsers = 25,
                    MaxFacilities = 10,
                    IsActive = true,
                    Currency = "TRY",
                    Language = "tr",
                    MonthlyFee = 199.99m,
                    PaymentStatus = PaymentStatus.Paid,
                    LastPayment = DateTime.UtcNow.AddDays(-5),
                    TotalConsumption = "89,230 kWh",
                    CreatedAt = DateTime.UtcNow.AddMonths(-3)
                },
                new Tenant
                {
                    CompanyName = "Ankara Ofis Merkezi",
                    FacilityCode = "ANK01",
                    Domain = "ankara-ofis.com",
                    AdminEmail = "admin@ankara-ofis.com",
                    ContactPerson = "Ayşe Demir",
                    Phone = "+90 312 333 9999",
                    Address = "Kızılay Meydanı No:78, Çankaya/Ankara",
                    TaxNumber = "5556667778",
                    TaxOffice = "Çankaya",
                    Subdomain = "ankara",
                    Status = TenantStatus.Active,
                    Subscription = SubscriptionType.Basic,
                    SubscriptionStartDate = DateTime.UtcNow.AddMonths(-1),
                    SubscriptionEndDate = DateTime.UtcNow.AddMonths(11),
                    MaxUsers = 15,
                    MaxFacilities = 5,
                    IsActive = true,
                    Currency = "TRY",
                    Language = "tr",
                    MonthlyFee = 99.99m,
                    PaymentStatus = PaymentStatus.Paid,
                    LastPayment = DateTime.UtcNow.AddDays(-20),
                    TotalConsumption = "45,120 kWh",
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                },
                new Tenant
                {
                    CompanyName = "İzmir Depo A.Ş.",
                    FacilityCode = "IZM01",
                    Domain = "izmir-depo.com",
                    AdminEmail = "admin@izmir-depo.com",
                    ContactPerson = "Can Özkan",
                    Phone = "+90 232 222 8888",
                    Address = "Liman Caddesi No:12, Konak/İzmir",
                    TaxNumber = "1112223334",
                    TaxOffice = "Konak",
                    Subdomain = "izmir",
                    Status = TenantStatus.Suspended,
                    Subscription = SubscriptionType.Standard,
                    SubscriptionStartDate = DateTime.UtcNow.AddMonths(-2),
                    SubscriptionEndDate = DateTime.UtcNow.AddMonths(10),
                    MaxUsers = 20,
                    MaxFacilities = 8,
                    IsActive = false,
                    Currency = "TRY",
                    Language = "tr",
                    MonthlyFee = 199.99m,
                    PaymentStatus = PaymentStatus.Overdue,
                    LastPayment = DateTime.UtcNow.AddDays(-45),
                    TotalConsumption = "67,890 kWh",
                    CreatedAt = DateTime.UtcNow.AddMonths(-2)
                },
                new Tenant
                {
                    CompanyName = "Bursa Üretim Ltd.",
                    FacilityCode = "BRS01",
                    Domain = "bursa-uretim.com",
                    AdminEmail = "admin@bursa-uretim.com",
                    ContactPerson = "Fatma Şahin",
                    Phone = "+90 224 111 7777",
                    Address = "Sanayi Mahallesi No:34, Nilüfer/Bursa",
                    TaxNumber = "9998887776",
                    TaxOffice = "Nilüfer",
                    Subdomain = "bursa",
                    Status = TenantStatus.Pending,
                    Subscription = SubscriptionType.Premium,
                    SubscriptionStartDate = DateTime.UtcNow.AddDays(-5),
                    SubscriptionEndDate = DateTime.UtcNow.AddMonths(12),
                    MaxUsers = 40,
                    MaxFacilities = 15,
                    IsActive = false,
                    Currency = "TRY",
                    Language = "tr",
                    MonthlyFee = 299.99m,
                    PaymentStatus = PaymentStatus.Pending,
                    LastPayment = null,
                    TotalConsumption = "0 kWh",
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                }
            };

            context.Tenants.AddRange(tenants);
            context.SaveChanges();

            // 2. İlk tenant için departmanlar oluştur
            var departments = new List<Department>
            {
                new Department
                {
                    Name = "Yönetim",
                    Description = "Genel yönetim departmanı",
                    TenantId = tenants[0].Id,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddMonths(-6)
                },
                new Department
                {
                    Name = "Muhasebe",
                    Description = "Muhasebe ve finans departmanı",
                    TenantId = tenants[0].Id,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddMonths(-6)
                },
                new Department
                {
                    Name = "Operasyon",
                    Description = "Operasyon ve bakım departmanı",
                    TenantId = tenants[0].Id,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddMonths(-6)
                },
                new Department
                {
                    Name = "IT",
                    Description = "Bilgi teknolojileri departmanı",
                    TenantId = tenants[0].Id,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddMonths(-6)
                }
            };

            context.Departments.AddRange(departments);
                context.SaveChanges();

            // 3. İlk tenant için kullanıcılar oluştur
            var users = new List<User>
            {
                new User
                {
                    FirstName = "Super Admin",
                    LastName = "System",
                    Email = "admin@demo-elektrik.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                    Phone = "+90 532 123 4567",
                    Role = UserRole.SuperAdmin,  // Paket yazılımı sağlayan şirket admin'i
                    TenantId = tenants[0].Id, // Sistem tenant'ı
                    DepartmentId = null, // SuperAdmin'in departmanı yok
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddMonths(-6)
                },
                new User
                {
                    FirstName = "Super",
                    LastName = "Admin",
                    Email = "superadmin@demo-elektrik.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                    Phone = "+90 532 999 9999",
                    Role = UserRole.SuperAdmin,  // Paket yazılımı sağlayan şirket admin'i
                    TenantId = tenants[0].Id, // Sistem tenant'ı
                    DepartmentId = null, // SuperAdmin'in departmanı yok
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddMonths(-6)
                },
                new User
                {
                    FirstName = "Muhasebe",
                    LastName = "Sorumlusu",
                    Email = "muhasebe@demo-elektrik.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                    Phone = "+90 533 234 5678",
                    Role = UserRole.Accountant,
                    TenantId = tenants[0].Id,
                    DepartmentId = departments[1].Id, // Muhasebe
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddMonths(-5)
                },
                new User
                {
                    FirstName = "Analist",
                    LastName = "Uzmanı",
                    Email = "analist@demo-elektrik.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                    Phone = "+90 534 345 6789",
                    Role = UserRole.Analyst,
                    TenantId = tenants[0].Id,
                    DepartmentId = departments[2].Id, // Operasyon
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddMonths(-5)
                },
                new User
                {
                    FirstName = "Operasyon",
                    LastName = "Müdürü",
                    Email = "operasyon@demo-elektrik.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                    Phone = "+90 535 456 7890",
                    Role = UserRole.Manager,
                    TenantId = tenants[0].Id,
                    DepartmentId = departments[2].Id, // Operasyon
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddMonths(-4)
                },
                new User
                {
                    FirstName = "IT",
                    LastName = "Uzmanı",
                    Email = "it@demo-elektrik.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                    Phone = "+90 536 567 8901",
                    Role = UserRole.User,
                    TenantId = tenants[0].Id,
                    DepartmentId = departments[3].Id, // IT
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddMonths(-4)
                }
            };

            context.Users.AddRange(users);
            context.SaveChanges();

            // 4. İlk tenant için tesisler oluştur
            var facilities = new List<Facility>
            {
                new Facility
                {
                    Name = "Ana Fabrika",
                    Address = "Organize Sanayi Bölgesi, 1. Cadde No:15, İstanbul",
                    FacilityCode = "FAB-001",
                    Type = FacilityType.Factory,
                    IsActive = true,
                    TenantId = tenants[0].Id,
                    CreatedAt = DateTime.UtcNow.AddMonths(-6)
                },
                new Facility
                {
                    Name = "Depo Merkezi",
                    Address = "Lojistik Merkezi, 2. Cadde No:8, İstanbul",
                    FacilityCode = "DEP-001",
                    Type = FacilityType.Warehouse,
                    IsActive = true,
                    TenantId = tenants[0].Id,
                    CreatedAt = DateTime.UtcNow.AddMonths(-5)
                },
                new Facility
                {
                    Name = "Ofis Binası",
                    Address = "Levent Mahallesi, Büyükdere Caddesi No:45, İstanbul",
                    FacilityCode = "OFI-001",
                    Type = FacilityType.Office,
                    IsActive = true,
                    TenantId = tenants[0].Id,
                    CreatedAt = DateTime.UtcNow.AddMonths(-5)
                },
                new Facility
                {
                    Name = "Ar-Ge Merkezi",
                    Address = "Teknoloji Vadisi, İnovasyon Caddesi No:12, İstanbul",
                    FacilityCode = "ARG-001",
                    Type = FacilityType.Other,
                    IsActive = true,
                    TenantId = tenants[0].Id,
                    CreatedAt = DateTime.UtcNow.AddMonths(-4)
                }
            };

            context.Facilities.AddRange(facilities);
            context.SaveChanges();

            // 5. İlk tenant için elektrik sayaçları oluştur
            var meters = new List<ElectricityMeter>
            {
                new ElectricityMeter
                {
                    MeterNumber = "MTR-001",
                    Description = "Ana fabrika elektrik sayacı",
                    Type = MeterType.Digital,
                    CurrentReading = 125450.50m,
                    PreviousReading = 120000.00m,
                    LastReadingDate = DateTime.UtcNow.AddDays(-1),
                    IsActive = true,
                    TenantId = tenants[0].Id,
                    FacilityId = facilities[0].Id,
                    CreatedAt = DateTime.UtcNow.AddMonths(-6)
                },
                new ElectricityMeter
                {
                    MeterNumber = "MTR-002",
                    Description = "Depo merkezi elektrik sayacı",
                    Type = MeterType.Digital,
                    CurrentReading = 45678.25m,
                    PreviousReading = 44000.00m,
                    LastReadingDate = DateTime.UtcNow.AddDays(-1),
                    IsActive = true,
                    TenantId = tenants[0].Id,
                    FacilityId = facilities[1].Id,
                    CreatedAt = DateTime.UtcNow.AddMonths(-5)
                },
                new ElectricityMeter
                {
                    MeterNumber = "MTR-003",
                    Description = "Ofis binası elektrik sayacı",
                    Type = MeterType.Digital,
                    CurrentReading = 23456.75m,
                    PreviousReading = 22000.00m,
                    LastReadingDate = DateTime.UtcNow.AddDays(-1),
                    IsActive = true,
                    TenantId = tenants[0].Id,
                    FacilityId = facilities[2].Id,
                    CreatedAt = DateTime.UtcNow.AddMonths(-5)
                },
                new ElectricityMeter
                {
                    MeterNumber = "MTR-004",
                    Description = "Ar-Ge merkezi elektrik sayacı",
                    Type = MeterType.Digital,
                    CurrentReading = 15678.50m,
                    PreviousReading = 15000.00m,
                    LastReadingDate = DateTime.UtcNow.AddDays(-1),
                    IsActive = true,
                    TenantId = tenants[0].Id,
                    FacilityId = facilities[3].Id,
                    CreatedAt = DateTime.UtcNow.AddMonths(-4)
                }
                };

            context.ElectricityMeters.AddRange(meters);
                context.SaveChanges();

            // 6. İlk tenant için tüketim kayıtları oluştur (son 6 ay)
            var consumptionRecords = new List<ConsumptionRecord>();
            var random = new Random();

            foreach (var meter in meters)
            {
                var currentReading = meter.PreviousReading;
                var baseDate = DateTime.UtcNow.AddMonths(-6);

                for (int month = 0; month < 6; month++)
                {
                    for (int day = 0; day < 6; day++) // Her ay için 6 gün
                    {
                        var readingDate = baseDate.AddMonths(month).AddDays(day * 5);
                        var consumption = (decimal)(random.NextDouble() * 100 + 50); // 50-150 kWh arası
                        currentReading += consumption;

                        consumptionRecords.Add(new ConsumptionRecord
                        {
                            ReadingDate = readingDate,
                            Timestamp = readingDate,
                            CurrentReading = currentReading,
                            PreviousReading = currentReading - consumption,
                            Consumption = consumption,
                            UnitPrice = 1.25m,
                            TotalCost = consumption * 1.25m,
                            Source = ReadingSource.SmartMeter,
                            Notes = $"Aylık okuma - {readingDate:MMMM yyyy}",
                            TenantId = tenants[0].Id,
                            ElectricityMeterId = meter.Id,
                            CreatedAt = readingDate
                        });
                    }
                }
            }

            context.ConsumptionRecords.AddRange(consumptionRecords);
            context.SaveChanges();

            // 7. API anahtarları oluştur
            var apiKeys = new List<ApiKey>
            {
                new ApiKey
                {
                    Name = "Demo API Key 1",
                    Key = Guid.NewGuid().ToString("N"),
                    TenantId = tenants[0].Id,
                    Status = ApiKeyStatus.Active,
                    CreatedAt = DateTime.UtcNow.AddMonths(-6),
                    TotalCalls = 1250,
                    ErrorRate = 0.02m,
                    RateLimit = 1000,
                    RateLimitPeriod = "hour",
                    Permissions = "read,write"
                },
                new ApiKey
                {
                    Name = "Demo API Key 2",
                    Key = Guid.NewGuid().ToString("N"),
                    TenantId = tenants[0].Id,
                    Status = ApiKeyStatus.Active,
                    CreatedAt = DateTime.UtcNow.AddMonths(-3),
                    TotalCalls = 850,
                    ErrorRate = 0.01m,
                    RateLimit = 500,
                    RateLimitPeriod = "hour",
                    Permissions = "read"
                }
            };

            context.ApiKeys.AddRange(apiKeys);
            context.SaveChanges();

            // 8. Abonelik planları oluştur
            var subscriptionPlans = new List<SubscriptionPlan>
            {
                new SubscriptionPlan
                {
                    Type = "Basic",
                    Name = "Temel Plan",
                    Description = "Küçük işletmeler için temel özellikler",
                    MonthlyFee = 99.99m,
                    Features = "[\"5 kullanıcı\",\"2 tesis\",\"Temel raporlama\",\"Email desteği\"]",
                    Limits = "{\"users\":5,\"facilities\":2,\"api_calls\":1000,\"storage_gb\":10}",
                    IsActive = true,
                    SortOrder = 1,
                    Currency = "TRY",
                    IsDefault = false,
                    IsPopular = false,
                    BadgeText = null,
                    BadgeColor = null
                },
                new SubscriptionPlan
                {
                    Type = "Standard",
                    Name = "Standart Plan",
                    Description = "Orta ölçekli işletmeler için gelişmiş özellikler",
                    MonthlyFee = 199.99m,
                    Features = "[\"15 kullanıcı\",\"5 tesis\",\"Gelişmiş raporlama\",\"API erişimi\",\"Öncelikli destek\"]",
                    Limits = "{\"users\":15,\"facilities\":5,\"api_calls\":5000,\"storage_gb\":50}",
                    IsActive = true,
                    SortOrder = 2,
                    Currency = "TRY",
                    IsDefault = true,
                    IsPopular = true,
                    BadgeText = "Popüler",
                    BadgeColor = "#1890ff"
                },
                new SubscriptionPlan
                {
                    Type = "Premium",
                    Name = "Premium Plan",
                    Description = "Büyük işletmeler için tam özellikler",
                    MonthlyFee = 299.99m,
                    Features = "[\"Sınırsız kullanıcı\",\"Sınırsız tesis\",\"AI analitik\",\"Özel entegrasyonlar\",\"7/24 destek\",\"Özel eğitim\"]",
                    Limits = "{\"users\":-1,\"facilities\":-1,\"api_calls\":50000,\"storage_gb\":500}",
                    IsActive = true,
                    SortOrder = 3,
                    Currency = "TRY",
                    IsDefault = false,
                    IsPopular = false,
                    BadgeText = "Premium",
                    BadgeColor = "#722ed1"
                }
            };

            context.SubscriptionPlans.AddRange(subscriptionPlans);
            context.SaveChanges();

            // 9. Sistem Logları oluştur
            CreateDemoLogs(context, tenants, users);
            
            // 10. Güvenlik Verileri oluştur
            CreateDemoSecurityData(context, tenants, users);
            
            // 11. Tenant Güvenlik Ayarları oluştur
            CreateDemoSecuritySettings(context, tenants);
            
            // 12. Güvenlik Raporları oluştur
            CreateDemoSecurityReports(context, tenants);
            
            // 13. API Anahtarları oluştur
            CreateDemoApiKeys(context, tenants);

            // 14. Chatbot verilerini oluştur
            await ChatbotDataSeeder.SeedChatbotData(context);
            
            // 15. Help ve Settings verilerini oluştur
            await SeedHelpData(context);
            await SeedSettingsData(context);

            Console.WriteLine("✅ Demo veriler başarıyla oluşturuldu!");
            Console.WriteLine($"📊 Tenant: {tenants.Count} adet");
            Console.WriteLine($"👥 Kullanıcılar: {users.Count} adet");
            Console.WriteLine($"🏢 Tesisler: {facilities.Count} adet");
            Console.WriteLine($"⚡ Sayaçlar: {meters.Count} adet");
            Console.WriteLine($"📈 Tüketim Kayıtları: {consumptionRecords.Count} adet");
            Console.WriteLine($"🔑 API Anahtarları: {apiKeys.Count} adet");
            Console.WriteLine($"📦 Abonelik Planları: {subscriptionPlans.Count} adet");
            Console.WriteLine($"📝 Sistem Logları: Oluşturuldu");
            Console.WriteLine($"🤖 Chatbot Verileri: Oluşturuldu");
            
            // Billing ve Consumption verilerini oluştur
            CreateDemoBillingData(context, tenants, users);
            CreateDemoConsumptionData(context, tenants, meters);
            
            Console.WriteLine($"🔐 Login Bilgileri:");
            Console.WriteLine($"   Email: admin@demo-elektrik.com");
            Console.WriteLine($"   Şifre: password");
            Console.WriteLine($"   Diğer kullanıcılar: muhasebe@demo-elektrik.com, analist@demo-elektrik.com, operasyon@demo-elektrik.com, it@demo-elektrik.com");
        }

        private static async Task SeedHelpData(ApplicationDbContext context)
        {
            if (!context.HelpCategories.Any())
            {
                var categories = new List<HelpCategory>
                {
                    new HelpCategory
                    {
                        Name = "Kullanıcı Yönetimi",
                        Description = "Kullanıcı hesapları ve yetkilendirme ile ilgili yardım",
                        Icon = "UserOutlined",
                        Color = "#1890ff",
                        SortOrder = 1,
                        IsActive = true,
                        IsPublic = true,
                        Slug = "kullanici-yonetimi"
                    },
                    new HelpCategory
                    {
                        Name = "Sistem",
                        Description = "Sistem ayarları ve genel kullanım ile ilgili yardım",
                        Icon = "SettingOutlined",
                        Color = "#52c41a",
                        SortOrder = 2,
                        IsActive = true,
                        IsPublic = true,
                        Slug = "sistem"
                    },
                    new HelpCategory
                    {
                        Name = "API",
                        Description = "API kullanımı ve entegrasyon ile ilgili yardım",
                        Icon = "ApiOutlined",
                        Color = "#722ed1",
                        SortOrder = 3,
                        IsActive = true,
                        IsPublic = true,
                        Slug = "api"
                    },
                    new HelpCategory
                    {
                        Name = "Raporlama",
                        Description = "Rapor oluşturma ve analiz ile ilgili yardım",
                        Icon = "BarChartOutlined",
                        Color = "#faad14",
                        SortOrder = 4,
                        IsActive = true,
                        IsPublic = true,
                        Slug = "raporlama"
                    },
                    new HelpCategory
                    {
                        Name = "Güvenlik",
                        Description = "Güvenlik ayarları ve güvenlik önlemleri ile ilgili yardım",
                        Icon = "SecurityScanOutlined",
                        Color = "#f5222d",
                        SortOrder = 5,
                        IsActive = true,
                        IsPublic = true,
                        Slug = "guvenlik"
                    }
                };

                context.HelpCategories.AddRange(categories);
                await context.SaveChangesAsync();

                // Add sample help articles
                var articles = new List<HelpArticle>
                {
                    new HelpArticle
                    {
                        Title = "Admin panelinde nasıl yeni kullanıcı ekleyebilirim?",
                        Content = "Kullanıcı Yönetimi sayfasına gidin ve \"Yeni Kullanıcı Ekle\" butonuna tıklayın. Gerekli bilgileri doldurduktan sonra kaydedin.",
                        CategoryId = categories[0].Id,
                        Status = "published",
                        IsActive = true,
                        Slug = "admin-panelinde-nasil-yeni-kullanici-ekleyebilirim",
                        AuthorId = 1,
                        AuthorName = "Admin",
                        ViewCount = 15,
                        HelpfulCount = 12
                    },
                    new HelpArticle
                    {
                        Title = "Sistem loglarını nasıl görüntüleyebilirim?",
                        Content = "Sistem Logları sayfasından tüm log kayıtlarını görüntüleyebilir, filtreleyebilir ve dışa aktarabilirsiniz.",
                        CategoryId = categories[1].Id,
                        Status = "published",
                        IsActive = true,
                        Slug = "sistem-loglarini-nasil-goruntuleyebilirim",
                        AuthorId = 1,
                        AuthorName = "Admin",
                        ViewCount = 23,
                        HelpfulCount = 18
                    },
                    new HelpArticle
                    {
                        Title = "API anahtarlarını nasıl yönetebilirim?",
                        Content = "API Yönetimi sayfasından mevcut API anahtarlarını görüntüleyebilir, yeni anahtar oluşturabilir veya mevcut anahtarları silebilirsiniz.",
                        CategoryId = categories[2].Id,
                        Status = "published",
                        IsActive = true,
                        Slug = "api-anahtarlarini-nasil-yonetebilirim",
                        AuthorId = 1,
                        AuthorName = "Admin",
                        ViewCount = 18,
                        HelpfulCount = 14
                    }
                };

                context.HelpArticles.AddRange(articles);
                await context.SaveChangesAsync();
            }
        }

        private static async Task SeedSettingsData(ApplicationDbContext context)
        {
            if (!context.SystemSettings.Any())
            {
                var systemSettings = new SystemSettings
                {
                    SystemName = "Electricity Tracker",
                    AdminEmail = "admin@electricitytracker.com",
                    MaxUsers = 1000,
                    MaxTenants = 100,
                    BackupFrequency = "daily",
                    BackupRetentionDays = "30",
                    AutoBackup = true,
                    BackupTime = "23:00",
                    MaintenanceMode = false,
                    EmailNotifications = true,
                    SmsNotifications = false,
                    PushNotifications = true,
                    EmailProvider = "smtp",
                    DefaultLanguage = "tr",
                    DefaultCurrency = "TRY",
                    TimeZone = "Europe/Istanbul",
                    DateFormat = "dd/MM/yyyy",
                    TimeFormat = "HH:mm:ss",
                    RequireEmailVerification = true,
                    RequirePhoneVerification = false,
                    SessionTimeoutMinutes = 30,
                    EnableAuditLog = true,
                    CacheTimeoutMinutes = 15,
                    EnableCompression = true,
                    MaxFileUploadSizeMB = 10
                };

                context.SystemSettings.Add(systemSettings);
                await context.SaveChangesAsync();
            }

            if (!context.EmailProviders.Any())
            {
                var emailProviders = new List<EmailProvider>
                {
                    new EmailProvider
                    {
                        Name = "smtp",
                        Type = "smtp",
                        DisplayName = "SMTP",
                        Icon = "MailOutlined",
                        IsActive = true,
                        IsDefault = true,
                        SortOrder = 1,
                        SmtpHost = "smtp.gmail.com",
                        SmtpPort = 587,
                        SmtpUseSsl = true,
                        MaxEmailsPerHour = 1000,
                        MaxEmailsPerDay = 10000
                    },
                    new EmailProvider
                    {
                        Name = "sendgrid",
                        Type = "sendgrid",
                        DisplayName = "SendGrid",
                        Icon = "MailOutlined",
                        IsActive = true,
                        IsDefault = false,
                        SortOrder = 2,
                        MaxEmailsPerHour = 1000,
                        MaxEmailsPerDay = 10000
                    },
                    new EmailProvider
                    {
                        Name = "mailgun",
                        Type = "mailgun",
                        DisplayName = "Mailgun",
                        Icon = "MailOutlined",
                        IsActive = true,
                        IsDefault = false,
                        SortOrder = 3,
                        MaxEmailsPerHour = 1000,
                        MaxEmailsPerDay = 10000
                    }
                };

                context.EmailProviders.AddRange(emailProviders);
                await context.SaveChangesAsync();
            }

            if (!context.SmsProviders.Any())
            {
                var smsProviders = new List<SmsProvider>
                {
                    new SmsProvider
                    {
                        Name = "twilio",
                        Type = "twilio",
                        DisplayName = "Twilio",
                        Icon = "MessageOutlined",
                        IsActive = true,
                        IsDefault = true,
                        MaxSmsPerHour = 100,
                        MaxSmsPerDay = 1000,
                        CostPerSms = 0.01m,
                        Currency = "TRY",
                        SupportsUnicode = true,
                        SupportsLongMessages = true,
                        SupportsDeliveryReports = true,
                        MaxMessageLength = 160
                    },
                    new SmsProvider
                    {
                        Name = "nexmo",
                        Type = "nexmo",
                        DisplayName = "Nexmo",
                        Icon = "MessageOutlined",
                        IsActive = true,
                        IsDefault = false,
                        MaxSmsPerHour = 100,
                        MaxSmsPerDay = 1000,
                        CostPerSms = 0.01m,
                        Currency = "TRY",
                        SupportsUnicode = true,
                        SupportsLongMessages = true,
                        SupportsDeliveryReports = true,
                        MaxMessageLength = 160
                    }
                };

                context.SmsProviders.AddRange(smsProviders);
                await context.SaveChangesAsync();
            }
        }

        private static void CreateDemoApiKeys(ApplicationDbContext context, List<Tenant> tenants)
        {
            var apiKeys = new List<ApiKey>();
            var random = new Random();

            foreach (var tenant in tenants)
            {
                // Her tenant için 2-4 API anahtarı oluştur
                var keyCount = random.Next(2, 5);
                
                for (int i = 0; i < keyCount; i++)
                {
                    var apiKey = new ApiKey
                    {
                        Name = $"API Key {i + 1} - {tenant.CompanyName}",
                        Key = GenerateApiKey(),
                        TenantId = tenant.Id,
                        Status = random.Next(100) < 80 ? ApiKeyStatus.Active : ApiKeyStatus.Inactive, // %80 aktif
                        Permissions = GetRandomPermissions(),
                        RateLimit = random.Next(100, 10001), // 100-10000 arası
                        RateLimitPeriod = random.Next(100) < 50 ? "hour" : "day",
                        CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 91)), // Son 90 gün içinde
                        LastUsed = random.Next(100) < 70 ? DateTime.UtcNow.AddHours(-random.Next(1, 168)) : null, // %70 kullanılmış
                        TotalCalls = random.Next(0, 100001), // 0-100000 arası çağrı
                        ErrorRate = (decimal)(random.NextDouble() * 0.1), // %0-10 arası hata oranı
                        WebhookUrl = random.Next(100) < 30 ? $"https://webhook.{tenant.Domain}/api/events" : null, // %30 webhook var
                        WebhookStatus = random.Next(100) < 30 ? (random.Next(100) < 80 ? WebhookStatus.Active : WebhookStatus.Error) : null
                    };

                    apiKeys.Add(apiKey);
                }
            }

            context.ApiKeys.AddRange(apiKeys);
            context.SaveChanges();
            
            Console.WriteLine($"🔑 API Anahtarları: {apiKeys.Count} adet oluşturuldu");
        }

        private static string GenerateApiKey()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 32).Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private static string GetRandomPermissions()
        {
            var allPermissions = new[] { "read", "write", "delete", "admin", "billing", "reports", "analytics" };
            var random = new Random();
            var count = random.Next(2, 5); // 2-4 izin
            var selectedPermissions = allPermissions.OrderBy(x => random.Next()).Take(count);
            return string.Join(",", selectedPermissions);
        }

        private static void CreateDemoLogs(ApplicationDbContext context, List<Tenant> tenants, List<User> users)
        {
            var logs = new List<SystemLog>();
            var random = new Random();

            // Son 30 gün için log oluştur
            for (int i = 0; i < 30; i++)
            {
                var date = DateTime.UtcNow.AddDays(-i);
                
                // Her gün için 5-15 log oluştur
                var dailyLogs = random.Next(5, 16);
                
                for (int j = 0; j < dailyLogs; j++)
                {
                    var logTime = date.AddHours(random.Next(0, 24)).AddMinutes(random.Next(0, 60));
                    var tenant = tenants[random.Next(tenants.Count)];
                    var user = users[random.Next(users.Count)];
                    
                    var logLevels = new[] { "Info", "Warning", "Error", "Debug" };
                    var logCategories = new[] { "User", "System", "Security", "API" };
                    var level = logLevels[random.Next(logLevels.Length)];
                    var category = logCategories[random.Next(logCategories.Length)];

                    var log = new SystemLog
                    {
                        Timestamp = logTime,
                        Level = level,
                        Category = category,
                        Message = GetLogMessage(level, category, user),
                        Details = GetLogDetails(category),
                        IpAddress = GetRandomIp(),
                        UserAgent = GetRandomUserAgent(),
                        TenantId = tenant.Id,
                        UserId = user.Id,
                        Exception = level == "Error" ? GetRandomException() : null,
                        StackTrace = level == "Error" ? GetRandomStackTrace() : null
                    };

                    logs.Add(log);
                }
            }

            context.SystemLogs.AddRange(logs);
            context.SaveChanges();
        }

        private static string GetLogMessage(string level, string category, User user)
        {
            var messages = new Dictionary<string, Dictionary<string, string[]>>
            {
                ["Info"] = new Dictionary<string, string[]>
                {
                    ["User"] = new[] { 
                        $"{user.FirstName} {user.LastName} giriş yaptı",
                        $"{user.FirstName} {user.LastName} rapor indirdi",
                        $"{user.FirstName} {user.LastName} ayarları güncelledi"
                    },
                    ["System"] = new[] { 
                        "Sistem başlatıldı",
                        "Veritabanı yedekleme tamamlandı",
                        "Günlük rapor oluşturuldu"
                    },
                    ["Security"] = new[] { 
                        "Güvenlik taraması tamamlandı",
                        "Kullanıcı yetkileri güncellendi",
                        "Oturum başarıyla sonlandırıldı"
                    },
                    ["API"] = new[] { 
                        "API isteği başarıyla işlendi",
                        "Veri senkronizasyonu tamamlandı",
                        "Webhook gönderildi"
                    }
                },
                ["Warning"] = new Dictionary<string, string[]>
                {
                    ["User"] = new[] { 
                        $"{user.FirstName} {user.LastName} şifre değiştirme uyarısı",
                        $"{user.FirstName} {user.LastName} oturum süresi uzatıldı"
                    },
                    ["System"] = new[] { 
                        "Disk alanı %80 doldu",
                        "Yedekleme gecikti",
                        "Performans uyarısı"
                    },
                    ["Security"] = new[] { 
                        "Şüpheli giriş denemesi tespit edildi",
                        "Başarısız oturum açma denemesi",
                        "IP adresi kısıtlandı"
                    },
                    ["API"] = new[] { 
                        "API rate limit yaklaşıyor",
                        "Yavaş API yanıtı",
                        "Webhook gönderimi başarısız"
                    }
                },
                ["Error"] = new Dictionary<string, string[]>
                {
                    ["User"] = new[] { 
                        $"{user.FirstName} {user.LastName} giriş hatası",
                        $"{user.FirstName} {user.LastName} veri kaydetme hatası"
                    },
                    ["System"] = new[] { 
                        "Veritabanı bağlantı hatası",
                        "Dosya okuma hatası",
                        "Sistem çökmesi"
                    },
                    ["Security"] = new[] { 
                        "Yetkilendirme hatası",
                        "Token doğrulama hatası",
                        "Güvenlik ihlali"
                    },
                    ["API"] = new[] { 
                        "API endpoint bulunamadı",
                        "Veri doğrulama hatası",
                        "Sunucu hatası"
                    }
                },
                ["Debug"] = new Dictionary<string, string[]>
                {
                    ["User"] = new[] { 
                        $"{user.FirstName} {user.LastName} debug modunda",
                        "Kullanıcı oturumu debug edildi"
                    },
                    ["System"] = new[] { 
                        "Sistem debug bilgisi",
                        "Performans metrikleri",
                        "Debug log kaydı"
                    },
                    ["Security"] = new[] { 
                        "Güvenlik debug bilgisi",
                        "Token debug edildi",
                        "Yetki debug edildi"
                    },
                    ["API"] = new[] { 
                        "API debug bilgisi",
                        "Request debug edildi",
                        "Response debug edildi"
                    }
                }
            };

            return messages[level][category][new Random().Next(messages[level][category].Length)];
        }

        private static string GetLogDetails(string category)
        {
            var details = new Dictionary<string, string>
            {
                ["User"] = "{\"action\":\"user_activity\",\"timestamp\":\"" + DateTime.UtcNow.ToString("O") + "\"}",
                ["System"] = "{\"action\":\"system_operation\",\"timestamp\":\"" + DateTime.UtcNow.ToString("O") + "\"}",
                ["Security"] = "{\"action\":\"security_check\",\"timestamp\":\"" + DateTime.UtcNow.ToString("O") + "\"}",
                ["API"] = "{\"action\":\"api_request\",\"timestamp\":\"" + DateTime.UtcNow.ToString("O") + "\"}"
            };

            return details[category];
        }

        private static string GetRandomIp()
        {
            var random = new Random();
            return $"{random.Next(1, 255)}.{random.Next(0, 255)}.{random.Next(0, 255)}.{random.Next(0, 255)}";
        }

        private static string GetRandomUserAgent()
        {
            var userAgents = new[]
            {
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
                "PostmanRuntime/7.32.3"
            };

            return userAgents[new Random().Next(userAgents.Length)];
        }

        private static string GetRandomException()
        {
            var exceptions = new[]
            {
                "System.NullReferenceException: Object reference not set to an instance of an object.",
                "System.ArgumentException: Invalid parameter provided.",
                "System.UnauthorizedAccessException: Access denied.",
                "System.TimeoutException: The operation timed out."
            };

            return exceptions[new Random().Next(exceptions.Length)];
        }

        private static string GetRandomStackTrace()
        {
            return @"at ElectricityTrackerAPI.Controllers.AdminController.GetUsers() in C:\src\Controllers\AdminController.cs:line 123
at System.Threading.Tasks.Task`1.InnerInvoke()
at System.Threading.Tasks.Task.Execute()";
        }

        private static void CreateDemoSecurityData(ApplicationDbContext context, List<Tenant> tenants, List<User> users)
        {
            var random = new Random();
            var securityAlerts = new List<SecurityAlert>();
            var blockedIPs = new List<BlockedIP>();
            var tenantSecurityScores = new List<TenantSecurityScore>();

            // Güvenlik Alarmları oluştur
            var alertTypes = new[] { "brute_force", "suspicious_login", "failed_2fa", "data_breach_attempt", "unusual_activity" };
            var severities = new[] { "low", "medium", "high", "critical" };
            var statuses = new[] { "active", "investigating", "resolved" };

            for (int i = 0; i < 20; i++)
            {
                var tenant = tenants[random.Next(tenants.Count)];
                var user = users.FirstOrDefault(u => u.TenantId == tenant.Id);
                var alertType = alertTypes[random.Next(alertTypes.Length)];
                var severity = severities[random.Next(severities.Length)];
                var status = statuses[random.Next(statuses.Length)];
                var resolved = status == "resolved";

                var alert = new SecurityAlert
                {
                    Type = alertType,
                    Severity = severity,
                    Title = GetSecurityAlertTitle(alertType),
                    Description = GetSecurityAlertDescription(alertType, user),
                    TenantId = tenant.Id,
                    UserId = user?.Id,
                    Status = status,
                    Resolved = resolved,
                    Timestamp = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    ResolvedAt = resolved ? DateTime.UtcNow.AddDays(-random.Next(1, 10)) : null,
                    ResolvedBy = resolved ? "admin" : null,
                    IpAddress = GetRandomIp(),
                    UserAgent = GetRandomUserAgent(),
                    Location = GetRandomLocation(),
                    Details = GetSecurityAlertDetails(alertType)
                };

                securityAlerts.Add(alert);
            }

            // Engellenen IP'ler oluştur
            for (int i = 0; i < 8; i++)
            {
                var tenant = tenants[random.Next(tenants.Count)];
                var blockedIP = new BlockedIP
                {
                    IpAddress = GetRandomIp(),
                    TenantId = tenant.Id,
                    Reason = GetBlockedIPReason(),
                    BlockedAt = DateTime.UtcNow.AddDays(-random.Next(1, 60)),
                    ExpiresAt = DateTime.UtcNow.AddDays(random.Next(1, 365)),
                    IsActive = random.Next(2) == 1,
                    BlockedBy = "admin",
                    AttemptCount = random.Next(5, 50)
                };

                blockedIPs.Add(blockedIP);
            }

            // Tenant Güvenlik Skorları oluştur
            foreach (var tenant in tenants)
            {
                var securityScore = new TenantSecurityScore
                {
                    TenantId = tenant.Id,
                    SecurityScore = random.Next(60, 95),
                    TwoFactorEnabled = random.Next(2) == 1,
                    PasswordPolicy = random.Next(3) switch { 0 => "weak", 1 => "medium", _ => "strong" },
                    LastSecurityAudit = DateTime.UtcNow.AddDays(-random.Next(1, 90)),
                    ActiveThreats = random.Next(0, 5),
                    BlockedIPs = random.Next(0, 3),
                    SecurityRecommendations = GetSecurityRecommendations()
                };

                tenantSecurityScores.Add(securityScore);
            }

            context.SecurityAlerts.AddRange(securityAlerts);
            context.BlockedIPs.AddRange(blockedIPs);
            context.TenantSecurityScores.AddRange(tenantSecurityScores);
            context.SaveChanges();
        }

        private static string GetSecurityAlertTitle(string alertType)
        {
            return alertType switch
            {
                "brute_force" => "Brute Force Saldırısı Tespit Edildi",
                "suspicious_login" => "Şüpheli Giriş Tespit Edildi",
                "failed_2fa" => "2FA Doğrulama Başarısız",
                "data_breach_attempt" => "Veri Sızıntısı Girişimi Tespit Edildi",
                "unusual_activity" => "Olağandışı Aktivite Tespit Edildi",
                _ => "Güvenlik Alarmı"
            };
        }

        private static string GetSecurityAlertDescription(string alertType, User? user)
        {
            var userName = user != null ? $"{user.FirstName} {user.LastName}" : "Bilinmeyen Kullanıcı";
            
            return alertType switch
            {
                "brute_force" => $"{userName} hesabına brute force saldırısı tespit edildi",
                "suspicious_login" => $"{userName} hesabından şüpheli giriş tespit edildi",
                "failed_2fa" => $"{userName} için 2FA doğrulama başarısız oldu",
                "data_breach_attempt" => $"{userName} hesabından veri sızıntısı girişimi tespit edildi",
                "unusual_activity" => $"{userName} hesabında olağandışı aktivite tespit edildi",
                _ => "Genel güvenlik alarmı"
            };
        }

        private static string GetSecurityAlertDetails(string alertType)
        {
            var random = new Random();
            
            return alertType switch
            {
                "brute_force" => $"{{\"attemptCount\":{random.Next(10, 100)},\"timeWindow\":\"{random.Next(5, 30)} minutes\",\"targetUsername\":\"admin@example.com\",\"blocked\":true}}",
                "suspicious_login" => $"{{\"ipAddress\":\"{GetRandomIp()}\",\"location\":\"Unknown Location\",\"userAgent\":\"Suspicious Browser\",\"previousLogin\":\"{DateTime.UtcNow.AddDays(-1):O}\",\"locationChanged\":true}}",
                "failed_2fa" => $"{{\"username\":\"user@example.com\",\"attemptCount\":{random.Next(1, 5)},\"lastSuccessful\":\"{DateTime.UtcNow.AddDays(-1):O}\",\"deviceInfo\":\"Mobile App\"}}",
                "data_breach_attempt" => $"{{\"ipAddress\":\"{GetRandomIp()}\",\"endpoint\":\"/api/users/data\",\"requestCount\":{random.Next(100, 1000)},\"timeWindow\":\"{random.Next(5, 60)} minutes\",\"blocked\":true,\"reported\":true}}",
                "unusual_activity" => $"{{\"username\":\"user@example.com\",\"activityType\":\"mass_data_export\",\"recordCount\":{random.Next(1000, 10000)},\"timeWindow\":\"{random.Next(1, 24)} hours\",\"flagged\":true}}",
                _ => "{\"action\":\"security_check\",\"timestamp\":\"" + DateTime.UtcNow.ToString("O") + "\"}"
            };
        }

        private static string GetBlockedIPReason()
        {
            var reasons = new[]
            {
                "Brute force saldırısı",
                "Şüpheli aktivite",
                "Çok fazla başarısız giriş denemesi",
                "Geçersiz API istekleri",
                "Spam aktivitesi"
            };

            return reasons[new Random().Next(reasons.Length)];
        }

        private static string GetRandomLocation()
        {
            var locations = new[]
            {
                "İstanbul, Türkiye",
                "Ankara, Türkiye",
                "İzmir, Türkiye",
                "Bursa, Türkiye",
                "Antalya, Türkiye",
                "Unknown Location"
            };

            return locations[new Random().Next(locations.Length)];
        }

        private static string GetSecurityRecommendations()
        {
            var recommendations = new[]
            {
                "İki faktörlü kimlik doğrulamayı etkinleştirin",
                "Güçlü şifre politikası uygulayın",
                "Düzenli güvenlik denetimleri yapın",
                "Kullanıcı eğitimleri düzenleyin",
                "Güvenlik loglarını düzenli kontrol edin"
            };

            return string.Join(",", recommendations);
        }

        private static void CreateDemoSecuritySettings(ApplicationDbContext context, List<Tenant> tenants)
        {
            var securitySettings = new List<TenantSecuritySettings>();

            foreach (var tenant in tenants)
            {
                var settings = new TenantSecuritySettings
                {
                    TenantId = tenant.Id,
                    RequireTwoFactor = tenant.Subscription == SubscriptionType.Premium,
                    AllowSmsTwoFactor = true,
                    AllowEmailTwoFactor = true,
                    AllowAuthenticatorApp = true,
                    MinimumPasswordLength = 8,
                    RequireUppercase = true,
                    RequireLowercase = true,
                    RequireNumbers = true,
                    RequireSpecialCharacters = true,
                    PasswordExpiryDays = 90,
                    PreventPasswordReuse = true,
                    PasswordHistoryCount = 5,
                    SessionTimeoutMinutes = 30,
                    ForceLogoutOnPasswordChange = true,
                    AllowConcurrentSessions = false,
                    MaxConcurrentSessions = 1,
                    MaxFailedLoginAttempts = 5,
                    AccountLockoutDurationMinutes = 30,
                    RequireCaptchaAfterFailedAttempts = true,
                    CaptchaThreshold = 3,
                    EnableIpWhitelist = false,
                    AllowedIpRanges = null,
                    BlockSuspiciousIps = true,
                    SuspiciousIpThreshold = 10,
                    EnableSecurityAuditLog = true,
                    LogFailedLoginAttempts = true,
                    LogSuccessfulLogins = false,
                    LogPasswordChanges = true,
                    LogAdminActions = true,
                    NotifyOnFailedLogin = true,
                    NotifyOnSuspiciousActivity = true,
                    NotifyOnAccountLockout = true,
                    NotificationEmails = "[\"admin@" + tenant.Domain + "\"]",
                    EnableBruteForceProtection = true,
                    BruteForceThreshold = 10,
                    BruteForceWindowMinutes = 15,
                    EnableGeolocationBlocking = false,
                    AllowedCountries = null,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedBy = "System"
                };

                securitySettings.Add(settings);
            }

            context.TenantSecuritySettings.AddRange(securitySettings);
            context.SaveChanges();
        }

        private static void CreateDemoSecurityReports(ApplicationDbContext context, List<Tenant> tenants)
        {
            var securityReports = new List<SecurityReport>();
            var random = new Random();

            foreach (var tenant in tenants)
            {
                // Son 30 gün için günlük raporlar oluştur
                for (int i = 0; i < 30; i++)
                {
                    var reportDate = DateTime.UtcNow.AddDays(-i);
                    var startDate = reportDate.Date;
                    var endDate = reportDate.Date.AddDays(1).AddSeconds(-1);

                    var totalAlerts = random.Next(0, 10);
                    var criticalAlerts = random.Next(0, Math.Min(3, totalAlerts));
                    var highAlerts = random.Next(0, Math.Min(5, totalAlerts - criticalAlerts));
                    var mediumAlerts = random.Next(0, Math.Min(8, totalAlerts - criticalAlerts - highAlerts));
                    var lowAlerts = totalAlerts - criticalAlerts - highAlerts - mediumAlerts;
                    var resolvedAlerts = random.Next(0, totalAlerts + 1);
                    var pendingAlerts = totalAlerts - resolvedAlerts;

                    var totalBlockedIPs = random.Next(0, 5);
                    var totalLockedAccounts = random.Next(0, 3);
                    var totalFailedLogins = random.Next(0, 20);
                    var totalSuccessfulLogins = random.Next(10, 50);

                    var securityScore = Math.Max(0, Math.Min(100, 100 - (criticalAlerts * 15) - (highAlerts * 10) - (totalLockedAccounts * 5) - (totalFailedLogins / 2)));
                    var securityScoreTrend = securityScore >= 80 ? "improving" : securityScore >= 60 ? "stable" : "declining";

                    var recommendations = new[]
                    {
                        "Güvenlik skorunu artırmak için güvenlik önlemlerini gözden geçirin",
                        "İki faktörlü kimlik doğrulamayı etkinleştirin",
                        "Güçlü şifre politikası uygulayın",
                        "IP whitelist'leri düzenli olarak güncelleyin"
                    };

                    var reportData = new
                    {
                        Period = new { Start = startDate, End = endDate },
                        Alerts = new object[0],
                        BlockedIPs = new object[0],
                        LockedAccounts = new object[0],
                        LoginStats = new { Failed = totalFailedLogins, Successful = totalSuccessfulLogins }
                    };

                    var report = new SecurityReport
                    {
                        TenantId = tenant.Id,
                        ReportType = "daily",
                        ReportDate = reportDate,
                        StartDate = startDate,
                        EndDate = endDate,
                        Title = $"Günlük Güvenlik Raporu - {tenant.CompanyName}",
                        Description = $"{reportDate:dd.MM.yyyy} tarihli günlük güvenlik raporu",
                        ReportData = System.Text.Json.JsonSerializer.Serialize(reportData),
                        TotalAlerts = totalAlerts,
                        CriticalAlerts = criticalAlerts,
                        HighAlerts = highAlerts,
                        MediumAlerts = mediumAlerts,
                        LowAlerts = lowAlerts,
                        ResolvedAlerts = resolvedAlerts,
                        PendingAlerts = pendingAlerts,
                        TotalBlockedIPs = totalBlockedIPs,
                        TotalLockedAccounts = totalLockedAccounts,
                        TotalFailedLogins = totalFailedLogins,
                        TotalSuccessfulLogins = totalSuccessfulLogins,
                        SecurityScore = securityScore,
                        SecurityScoreTrend = securityScoreTrend,
                        Recommendations = System.Text.Json.JsonSerializer.Serialize(recommendations),
                        Status = "generated",
                        CreatedAt = reportDate,
                        UpdatedAt = reportDate,
                        CreatedBy = "System"
                    };

                    securityReports.Add(report);
                }
            }

            context.SecurityReports.AddRange(securityReports);
            context.SaveChanges();
        }

        private static void CreateDemoBillingData(ApplicationDbContext context, List<Tenant> tenants, List<User> users)
        {
            var resourceTypes = new List<ResourceType>
            {
                new ResourceType
                {
                    Name = "Elektrik",
                    Unit = "kWh",
                    Description = "Elektrik enerjisi tüketimi",
                    Icon = "⚡",
                    Category = ResourceCategory.Electricity,
                    DefaultPrice = 1.25m,
                    Currency = "TRY",
                    IsActive = true,
                    TenantId = null // Global
                },
                new ResourceType
                {
                    Name = "Su",
                    Unit = "m³",
                    Description = "Su tüketimi",
                    Icon = "💧",
                    Category = ResourceCategory.Water,
                    DefaultPrice = 8.50m,
                    Currency = "TRY",
                    IsActive = true,
                    TenantId = null // Global
                },
                new ResourceType
                {
                    Name = "Doğalgaz",
                    Unit = "m³",
                    Description = "Doğalgaz tüketimi",
                    Icon = "🔥",
                    Category = ResourceCategory.Gas,
                    DefaultPrice = 2.80m,
                    Currency = "TRY",
                    IsActive = true,
                    TenantId = null // Global
                }
            };

            context.ResourceTypes.AddRange(resourceTypes);
            context.SaveChanges();

            var invoices = new List<Invoice>();
            var random = new Random();

            foreach (var tenant in tenants)
            {
                // Her tenant için 5-15 fatura oluştur
                var invoiceCount = random.Next(5, 16);
                var adminUser = users.FirstOrDefault(u => u.TenantId == tenant.Id && u.Role == UserRole.Admin);

                for (int i = 0; i < invoiceCount; i++)
                {
                    var invoiceDate = DateTime.UtcNow.AddDays(-random.Next(1, 90));
                    var dueDate = invoiceDate.AddDays(30);
                    var totalAmount = random.Next(500, 5000);
                    var taxRate = 18.0m;
                    var taxAmount = totalAmount * (taxRate / 100);
                    var netAmount = totalAmount - taxAmount;

                    // Tenant'ın abonelik planını bul
                    var subscriptionPlan = context.SubscriptionPlans.FirstOrDefault(sp => sp.Type == tenant.Subscription.ToString());
                    
                    var invoice = new Invoice
                    {
                        InvoiceNumber = $"INV-{tenant.CompanyName.Substring(0, 3).ToUpper()}-{DateTime.Now.Year}{DateTime.Now.Month:D2}-{i + 1:D4}",
                        InvoiceDate = invoiceDate,
                        DueDate = dueDate,
                        TotalAmount = subscriptionPlan?.MonthlyFee ?? 199.99m,
                        TaxAmount = (subscriptionPlan?.MonthlyFee ?? 199.99m) * 0.18m,
                        NetAmount = (subscriptionPlan?.MonthlyFee ?? 199.99m) * 0.82m,
                        Currency = "TRY",
                        TaxRate = 18.0m,
                        Status = (InvoiceStatus)random.Next(0, 4), // Draft, Sent, Paid, Overdue
                        Type = InvoiceType.Subscription, // Artık sadece Subscription
                        Description = $"Uygulama kullanım faturası - {invoiceDate:MMMM yyyy}",
                        CustomerName = tenant.CompanyName,
                        CustomerEmail = tenant.AdminEmail,
                        CustomerAddress = tenant.Address,
                        CustomerTaxNumber = tenant.TaxNumber,
                        TenantId = tenant.Id,
                        SubscriptionPlanId = subscriptionPlan?.Id,
                        BillingPeriod = $"{invoiceDate:MMMM yyyy}",
                        CreatedById = adminUser?.Id,
                        CreatedAt = invoiceDate,
                        PaidAt = random.Next(0, 3) == 0 ? invoiceDate.AddDays(random.Next(1, 15)) : null
                    };

                    invoices.Add(invoice);
                }
            }

            context.Invoices.AddRange(invoices);
            context.SaveChanges();

            // Invoice items oluştur - Artık sadece uygulama kullanım bedeli
            var invoiceItems = new List<InvoiceItem>();
            foreach (var invoice in invoices)
            {
                // Her fatura için tek bir kalem - uygulama kullanım bedeli
                var item = new InvoiceItem
                {
                    InvoiceId = invoice.Id,
                    Description = "Uygulama Kullanım Bedeli",
                    Quantity = 1,
                    Unit = "Adet",
                    UnitPrice = invoice.NetAmount,
                    TotalPrice = invoice.NetAmount,
                    TaxRate = invoice.TaxRate,
                    TaxAmount = invoice.TaxAmount,
                    NetAmount = invoice.NetAmount,
                    ResourceTypeId = null, // Artık kaynak türü yok
                    ConsumptionStartDate = null,
                    ConsumptionEndDate = null,
                    Notes = $"Aylık uygulama kullanım bedeli - {invoice.BillingPeriod}"
                };

                invoiceItems.Add(item);
            }

            context.InvoiceItems.AddRange(invoiceItems);
            context.SaveChanges();

            Console.WriteLine($"💰 Faturalar: {invoices.Count} adet");
            Console.WriteLine($"📋 Fatura Kalemleri: {invoiceItems.Count} adet");
            Console.WriteLine($"⚡ Kaynak Türleri: {resourceTypes.Count} adet");
        }

        private static void CreateDemoConsumptionData(ApplicationDbContext context, List<Tenant> tenants, List<ElectricityMeter> meters)
        {
            var consumptionRecords = new List<ConsumptionRecord>();
            var random = new Random();

            // Son 90 gün için tüketim kayıtları oluştur
            for (int day = 0; day < 90; day++)
            {
                var readingDate = DateTime.UtcNow.AddDays(-day);
                
                foreach (var meter in meters)
                {
                    // Günlük tüketim değeri (100-500 kWh arası)
                    var consumption = random.Next(100, 501);
                    var unitPrice = 1.25m; // kWh başına 1.25 TL
                    var totalCost = consumption * unitPrice;

                    var record = new ConsumptionRecord
                    {
                        ReadingDate = readingDate,
                        Timestamp = readingDate,
                        CurrentReading = meter.CurrentReading + consumption,
                        PreviousReading = meter.CurrentReading,
                        Consumption = consumption,
                        UnitPrice = unitPrice,
                        TotalCost = totalCost,
                        Source = (ReadingSource)random.Next(0, 3), // Manual, API, SmartMeter
                        Notes = $"Günlük sayaç okuması - {readingDate:dd.MM.yyyy}",
                        TenantId = meter.TenantId,
                        ElectricityMeterId = meter.Id,
                        CreatedAt = readingDate
                    };

                    consumptionRecords.Add(record);
                    
                    // Meter'ın son okumasını güncelle
                    meter.CurrentReading += consumption;
                }
            }

            context.ConsumptionRecords.AddRange(consumptionRecords);
            context.SaveChanges();

            Console.WriteLine($"📊 Tüketim Kayıtları: {consumptionRecords.Count} adet");
        }
    }
} 