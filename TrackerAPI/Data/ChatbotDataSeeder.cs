using ElectricityTrackerAPI.Models.Core;
using Microsoft.EntityFrameworkCore;

namespace ElectricityTrackerAPI.Data
{
    public static class ChatbotDataSeeder
    {
        public static async Task SeedChatbotData(ApplicationDbContext context)
        {
            // Seed Quick Actions
            if (!await context.QuickActions.AnyAsync())
            {
                var quickActions = new List<QuickAction>
                {
                    new QuickAction
                    {
                        Title = "Fatura Oluşturma",
                        Description = "Yeni fatura oluşturma rehberi",
                        Category = "billing",
                        Icon = "FileTextOutlined",
                        UsageCount = 45,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        Priority = "high"
                    },
                    new QuickAction
                    {
                        Title = "Ödeme İşlemleri",
                        Description = "Ödeme yöntemleri ve süreçleri",
                        Category = "payment",
                        Icon = "DollarOutlined",
                        UsageCount = 32,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        Priority = "medium"
                    },
                    new QuickAction
                    {
                        Title = "Rapor Oluşturma",
                        Description = "Enerji tüketim raporları",
                        Category = "reports",
                        Icon = "BarChartOutlined",
                        UsageCount = 28,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        Priority = "medium"
                    },
                    new QuickAction
                    {
                        Title = "Kullanıcı Yönetimi",
                        Description = "Kullanıcı ekleme ve yetkilendirme",
                        Category = "users",
                        Icon = "TeamOutlined",
                        UsageCount = 19,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        Priority = "low"
                    },
                    new QuickAction
                    {
                        Title = "API Entegrasyonu",
                        Description = "API kullanımı ve entegrasyon",
                        Category = "technical",
                        Icon = "ApiOutlined",
                        UsageCount = 15,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        Priority = "high"
                    },
                    new QuickAction
                    {
                        Title = "Sistem Ayarları",
                        Description = "Genel sistem konfigürasyonu",
                        Category = "settings",
                        Icon = "SettingOutlined",
                        UsageCount = 12,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        Priority = "medium"
                    }
                };

                context.QuickActions.AddRange(quickActions);
                await context.SaveChangesAsync();
            }

            // Seed Knowledge Base Articles
            if (!await context.KnowledgeBaseArticles.AnyAsync())
            {
                var articles = new List<KnowledgeBaseArticle>
                {
                    new KnowledgeBaseArticle
                    {
                        Title = "Fatura Sistemi Kullanım Kılavuzu",
                        Category = "billing",
                        Content = @"# Fatura Sistemi Kullanım Kılavuzu

## Genel Bakış
Elektrik takip sistemimizde fatura oluşturma ve yönetim süreçleri oldukça basittir.

## Fatura Oluşturma Adımları
1. **Müşteri Seçimi**: Öncelikle fatura oluşturulacak müşteriyi seçin
2. **Tüketim Verileri**: Elektrik tüketim verilerini sisteme girin
3. **Tarife Hesaplama**: Sistem otomatik olarak tarife hesaplaması yapar
4. **Fatura Oluşturma**: Tüm bilgiler doğruysa faturayı oluşturun

## Önemli Notlar
- Fatura oluşturulduktan sonra düzenleme yapılamaz
- Tüketim verileri gerçek zamanlı olarak güncellenir
- Sistem otomatik olarak vergi hesaplaması yapar

## Sorun Giderme
Eğer fatura oluştururken sorun yaşıyorsanız:
1. Tarayıcınızı yenileyin
2. Farklı bir tarayıcı deneyin
3. Teknik destek ile iletişime geçin",
                        Views = 1250,
                        HelpfulCount = 89,
                        NotHelpfulCount = 5,
                        IsPublished = true,
                        CreatedAt = DateTime.UtcNow,
                        Author = "Sistem Yöneticisi",
                        Summary = "Detaylı fatura oluşturma ve yönetim rehberi",
                        Tags = "[\"fatura\", \"kullanım\", \"rehber\"]"
                    },
                    new KnowledgeBaseArticle
                    {
                        Title = "API Entegrasyon Dokümantasyonu",
                        Category = "technical",
                        Content = @"# API Entegrasyon Dokümantasyonu

## API Endpoint'leri

### Tüketim Verileri
```
GET /api/consumption/{tenantId}
POST /api/consumption
PUT /api/consumption/{id}
DELETE /api/consumption/{id}
```

### Fatura İşlemleri
```
GET /api/invoices/{tenantId}
POST /api/invoices
PUT /api/invoices/{id}
```

## Authentication
API kullanımı için JWT token gereklidir. Token'ı header'da şu şekilde gönderin:
```
Authorization: Bearer {your-token}
```

## Rate Limiting
- Dakikada maksimum 100 istek
- Saatte maksimum 1000 istek
- Günlük maksimum 10000 istek

## Hata Kodları
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error",
                        Views = 890,
                        HelpfulCount = 67,
                        NotHelpfulCount = 8,
                        IsPublished = true,
                        CreatedAt = DateTime.UtcNow,
                        Author = "Teknik Ekip",
                        Summary = "API endpoint'leri ve kullanım örnekleri",
                        Tags = "[\"api\", \"entegrasyon\", \"dokümantasyon\"]"
                    },
                    new KnowledgeBaseArticle
                    {
                        Title = "Raporlama Özellikleri",
                        Category = "reports",
                        Content = @"# Raporlama Özellikleri

## Mevcut Rapor Türleri

### 1. Tüketim Raporları
- Günlük tüketim raporu
- Aylık tüketim raporu
- Yıllık tüketim raporu
- Karşılaştırmalı tüketim raporu

### 2. Fatura Raporları
- Fatura özeti
- Ödeme durumu raporu
- Gecikmiş ödemeler raporu

### 3. Analitik Raporlar
- Trend analizi
- Anomali tespiti
- Tahmin raporları

## Rapor Oluşturma
1. Rapor türünü seçin
2. Tarih aralığını belirleyin
3. Filtreleri uygulayın
4. Raporu oluşturun

## Dışa Aktarma Seçenekleri
- PDF formatında indirme
- Excel formatında indirme
- CSV formatında indirme
- E-posta ile gönderme",
                        Views = 756,
                        HelpfulCount = 54,
                        NotHelpfulCount = 12,
                        IsPublished = true,
                        CreatedAt = DateTime.UtcNow,
                        Author = "Raporlama Ekibi",
                        Summary = "Mevcut rapor türleri ve özelleştirme seçenekleri",
                        Tags = "[\"rapor\", \"analitik\", \"dışa aktarma\"]"
                    }
                };

                context.KnowledgeBaseArticles.AddRange(articles);
                await context.SaveChangesAsync();
            }

            // Seed some sample conversations if they don't exist
            if (!await context.ChatbotConversations.AnyAsync())
            {
                var users = await context.Users.Take(3).ToListAsync();
                var tenants = await context.Tenants.Take(3).ToListAsync();

                Console.WriteLine($"ChatbotDataSeeder: Found {users.Count} users and {tenants.Count} tenants");

                if (users.Any() && tenants.Any())
                {
                    var conversations = new List<ChatbotConversation>
                    {
                        new ChatbotConversation
                        {
                            UserId = users[0].Id,
                            TenantId = tenants[0].Id,
                            Title = "Fatura sistemi ile ilgili sorun",
                            Status = "active",
                            Category = "technical",
                            MessageCount = 8,
                            Satisfaction = 4,
                            CreatedAt = DateTime.UtcNow.AddDays(-2),
                            LastMessageAt = DateTime.UtcNow.AddHours(-1)
                        },
                        new ChatbotConversation
                        {
                            UserId = users[1].Id,
                            TenantId = tenants[1].Id,
                            Title = "Ödeme işlemi tamamlandı",
                            Status = "resolved",
                            Category = "billing",
                            MessageCount = 12,
                            Satisfaction = 5,
                            CreatedAt = DateTime.UtcNow.AddDays(-3),
                            LastMessageAt = DateTime.UtcNow.AddHours(-2)
                        },
                        new ChatbotConversation
                        {
                            UserId = users[2].Id,
                            TenantId = tenants[2].Id,
                            Title = "Yeni özellik hakkında bilgi",
                            Status = "pending",
                            Category = "general",
                            MessageCount = 3,
                            Satisfaction = null,
                            CreatedAt = DateTime.UtcNow.AddDays(-1),
                            LastMessageAt = DateTime.UtcNow.AddHours(-3)
                        }
                    };

                    context.ChatbotConversations.AddRange(conversations);
                    await context.SaveChangesAsync();
                    
                    Console.WriteLine($"ChatbotDataSeeder: Created {conversations.Count} conversations");

                    // Add some sample messages
                    var messages = new List<ChatbotMessage>
                    {
                        new ChatbotMessage
                        {
                            ConversationId = conversations[0].Id,
                            Sender = "user",
                            Content = "Merhaba, fatura sistemi ile ilgili sorun yaşıyorum",
                            Timestamp = DateTime.UtcNow.AddHours(-2),
                            MessageType = "text",
                            IsRead = true
                        },
                        new ChatbotMessage
                        {
                            ConversationId = conversations[0].Id,
                            Sender = "bot",
                            Content = "Merhaba! Fatura sistemi ile ilgili sorununuzu dinliyorum. Hangi konuda yardıma ihtiyacınız var?",
                            Timestamp = DateTime.UtcNow.AddHours(-2).AddSeconds(30),
                            MessageType = "text",
                            IsRead = true
                        },
                        new ChatbotMessage
                        {
                            ConversationId = conversations[0].Id,
                            Sender = "user",
                            Content = "Fatura oluştururken hata alıyorum. \"Sistem hatası\" mesajı çıkıyor",
                            Timestamp = DateTime.UtcNow.AddHours(-1),
                            MessageType = "text",
                            IsRead = true
                        },
                        new ChatbotMessage
                        {
                            ConversationId = conversations[0].Id,
                            Sender = "bot",
                            Content = "Anlıyorum. Bu sorunu çözmek için birkaç adım atalım:\n\n1. Tarayıcınızı yenileyin\n2. Farklı bir tarayıcı deneyin\n3. Hala sorun devam ederse, lütfen ekran görüntüsü paylaşın",
                            Timestamp = DateTime.UtcNow.AddHours(-1).AddSeconds(30),
                            MessageType = "text",
                            IsRead = false
                        }
                    };

                    context.ChatbotMessages.AddRange(messages);
                    await context.SaveChangesAsync();
                    
                    Console.WriteLine($"ChatbotDataSeeder: Created {messages.Count} messages");
                }
                else
                {
                    Console.WriteLine("ChatbotDataSeeder: No users or tenants found, skipping conversation creation");
                }
            }
        }
    }
} 