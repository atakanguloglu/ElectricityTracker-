# AI Integration Documentation

Bu dokümantasyon, Electricity Tracker API'sine entegre edilen Google Gemini AI servisinin kullanımını açıklar.

## Genel Bakış

Sistem, Google'ın Gemini 2.0 Flash modelini kullanarak aşağıdaki AI özelliklerini sunar:

- **AI Sohbet**: Genel sorulara yanıt verme
- **Tüketim Analizi**: Elektrik tüketim verilerinin AI ile analizi
- **Enerji Optimizasyonu**: Tesis bazlı enerji tasarrufu önerileri
- **Rapor Üretimi**: AI destekli rapor oluşturma
- **İçerik Üretimi**: Özelleştirilmiş içerik oluşturma

## API Endpoints

### SuperAdmin AI Endpoints

#### 1. AI Bağlantı Testi
```http
POST /api/admin/ai/test-connection
Authorization: Bearer {token}
```

#### 2. İçerik Üretimi
```http
POST /api/admin/ai/generate-content
Authorization: Bearer {token}
Content-Type: application/json

{
  "prompt": "Elektrik tasarrufu hakkında bir makale yaz",
  "context": "Endüstriyel tesisler için"
}
```

#### 3. Tüketim Analizi
```http
POST /api/admin/ai/analyze-consumption
Authorization: Bearer {token}
Content-Type: application/json

{
  "consumptionData": "Aylık tüketim verileri...",
  "facilityName": "Ana Tesis",
  "dataPoints": 30
}
```

#### 4. Rapor Üretimi
```http
POST /api/admin/ai/generate-report
Authorization: Bearer {token}
Content-Type: application/json

{
  "reportType": "Aylık Tüketim Raporu",
  "data": "Rapor verileri...",
  "tenantName": "ABC Şirketi"
}
```

#### 5. Enerji Optimizasyonu
```http
POST /api/admin/ai/energy-optimization
Authorization: Bearer {token}
Content-Type: application/json

{
  "facilityData": "Tesis bilgileri...",
  "facilityName": "Üretim Tesisi",
  "currentConsumption": 5000.0
}
```

#### 6. AI Kullanım İstatistikleri
```http
GET /api/admin/ai/usage-stats
Authorization: Bearer {token}
```

### Tenant AI Endpoints

#### 1. AI Sohbet
```http
POST /api/ai/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "question": "Elektrik faturasını nasıl düşürebilirim?",
  "context": "Küçük ofis ortamı"
}
```

#### 2. Tüketim Analizi
```http
POST /api/ai/analyze-consumption
Authorization: Bearer {token}
Content-Type: application/json

{
  "consumptionData": "Tüketim verileri...",
  "facilityName": "Ofis",
  "dataPoints": 15
}
```

#### 3. Enerji Optimizasyonu
```http
POST /api/ai/energy-optimization
Authorization: Bearer {token}
Content-Type: application/json

{
  "facilityData": "Ofis ekipmanları ve kullanım bilgileri",
  "facilityName": "Ana Ofis",
  "currentConsumption": 1200.0
}
```

#### 4. Rapor Üretimi
```http
POST /api/ai/generate-report
Authorization: Bearer {token}
Content-Type: application/json

{
  "reportType": "Haftalık Özet",
  "data": "Haftalık tüketim verileri"
}
```

## Yanıt Formatı

Tüm AI endpoint'leri aşağıdaki formatında yanıt verir:

```json
{
  "success": true,
  "content": "AI tarafından üretilen içerik...",
  "error": null,
  "generatedAt": "2024-01-15T10:30:00Z"
}
```

## Konfigürasyon

### appsettings.json
```json
{
  "GeminiAPI": {
    "ApiKey": "your-gemini-api-key-here"
  }
}
```

### Program.cs
```csharp
// AI Service Registration
builder.Services.AddScoped<IAIService, AIService>();
builder.Services.AddHttpClient<AIService>();
```

## Güvenlik

- Tüm AI endpoint'leri JWT token gerektirir
- SuperAdmin endpoint'leri sadece SuperAdmin rolüne sahip kullanıcılar tarafından erişilebilir
- Tenant endpoint'leri tüm yetkili kullanıcılar tarafından erişilebilir
- Tüm AI etkileşimleri sistem loglarında kaydedilir

## Hata Yönetimi

AI servisi aşağıdaki durumlarda hata döner:

- API anahtarı geçersiz
- Gemini API'ye erişim sorunu
- Rate limiting
- Geçersiz prompt formatı

Hata durumunda yanıt:
```json
{
  "success": false,
  "content": null,
  "error": "Hata mesajı",
  "generatedAt": "2024-01-15T10:30:00Z"
}
```

## Test Etme

AI entegrasyonunu test etmek için:

1. API'yi çalıştırın
2. JWT token alın
3. `test-ai.ps1` scriptini çalıştırın

```powershell
.\test-ai.ps1
```

## Örnek Kullanım Senaryoları

### 1. Enerji Tasarrufu Önerileri
```json
{
  "question": "Aylık 5000 kWh tüketen bir fabrika için enerji tasarrufu önerileri nelerdir?",
  "context": "Üretim tesisi, 3 vardiya çalışma"
}
```

### 2. Tüketim Trend Analizi
```json
{
  "consumptionData": "Son 6 ayın günlük tüketim verileri...",
  "facilityName": "Üretim Tesisi A",
  "dataPoints": 180
}
```

### 3. Maliyet Raporu
```json
{
  "reportType": "Maliyet Analizi Raporu",
  "data": "Fiyat ve tüketim verileri..."
}
```

## Performans Notları

- Gemini API yanıt süresi genellikle 2-5 saniye arasındadır
- Büyük veri setleri için timeout ayarları yapılandırılabilir
- Rate limiting için kullanım istatistikleri takip edilir

## Gelecek Geliştirmeler

- Çoklu dil desteği
- Görsel analiz (grafik yorumlama)
- Gerçek zamanlı öneriler
- Makine öğrenmesi entegrasyonu
- Sesli komut desteği 