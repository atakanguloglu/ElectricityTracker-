using ElectricityTrackerAPI.Models.Core;
using ElectricityTrackerAPI.Models.Energy;
using ElectricityTrackerAPI.Models.Admin;
using ElectricityTrackerAPI.Models.Billing;
using ElectricityTrackerAPI.Models.Logging;
using BCrypt.Net;
using PaymentStatus = ElectricityTrackerAPI.Models.Core.PaymentStatus;

namespace ElectricityTrackerAPI.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            // Veritabanının oluşturulduğundan emin ol
            context.Database.EnsureCreated();

            // Eski demo verileri temizle ve yeni kapsamlı verileri ekle
            Console.WriteLine("Demo veriler temizleniyor ve yeniden oluşturuluyor...");
            
            // Eski verileri temizle (foreign key sırasına göre)
            context.ConsumptionRecords.RemoveRange(context.ConsumptionRecords);
            context.ElectricityMeters.RemoveRange(context.ElectricityMeters);
            context.ApiKeys.RemoveRange(context.ApiKeys);
            context.Facilities.RemoveRange(context.Facilities);
            context.Users.RemoveRange(context.Users);
            context.Departments.RemoveRange(context.Departments);
            context.Tenants.RemoveRange(context.Tenants);
            context.SubscriptionPlans.RemoveRange(context.SubscriptionPlans);
            context.SaveChanges();
            
            // Yeni kapsamlı verileri oluştur
            CreateDemoData(context);
        }

        private static void CreateDemoData(ApplicationDbContext context)
        {
            Console.WriteLine("Demo veriler oluşturuluyor...");

            // 1. Admin Paneli için Çoklu Tenant'lar oluştur
            var tenants = new List<Tenant>
            {
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
                    FirstName = "Admin",
                    LastName = "User",
                    Email = "admin@demo-elektrik.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                    Phone = "+90 532 123 4567",
                    Role = UserRole.Admin,
                    TenantId = tenants[0].Id,
                    DepartmentId = departments[0].Id, // Yönetim
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

            Console.WriteLine("✅ Demo veriler başarıyla oluşturuldu!");
            Console.WriteLine($"📊 Tenant: {tenants.Count} adet");
            Console.WriteLine($"👥 Kullanıcılar: {users.Count} adet");
            Console.WriteLine($"🏢 Tesisler: {facilities.Count} adet");
            Console.WriteLine($"⚡ Sayaçlar: {meters.Count} adet");
            Console.WriteLine($"📈 Tüketim Kayıtları: {consumptionRecords.Count} adet");
            Console.WriteLine($"🔑 API Anahtarları: {apiKeys.Count} adet");
            Console.WriteLine($"📦 Abonelik Planları: {subscriptionPlans.Count} adet");
            Console.WriteLine($"📝 Sistem Logları: Oluşturuldu");
            Console.WriteLine($"🔐 Login Bilgileri:");
            Console.WriteLine($"   Email: admin@demo-elektrik.com");
            Console.WriteLine($"   Şifre: password");
            Console.WriteLine($"   Diğer kullanıcılar: muhasebe@demo-elektrik.com, analist@demo-elektrik.com, operasyon@demo-elektrik.com, it@demo-elektrik.com");
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
    }
} 