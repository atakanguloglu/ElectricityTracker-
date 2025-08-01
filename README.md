# ⚡ Elektrik Takip Sistemi

Şirketlerin elektrik tüketimlerini takip etmek için geliştirilmiş modern web uygulaması.

## 🚀 Hızlı Başlangıç

### Otomatik Kurulum (Önerilen)

1. **PowerShell Script'i Çalıştırın:**
   ```powershell
   .\setup.ps1
   ```

2. **Veya Batch Dosyasını Çalıştırın:**
   ```cmd
   setup.bat
   ```

Bu script otomatik olarak:
- ✅ Backend'i build eder
- ✅ Veritabanı migration'larını uygular
- ✅ Test verilerini ekler
- ✅ Backend'i başlatır
- ✅ Frontend'i başlatır

### Manuel Kurulum

#### Gereksinimler
- .NET 9.0 SDK
- Node.js 18+
- PostgreSQL

#### Backend Kurulumu
```bash
cd TrackerAPI
dotnet restore
dotnet build
dotnet ef database update
dotnet run
```

#### Frontend Kurulumu
```bash
cd tracker-web
npm install
npm run dev
```

## 🔐 Login Bilgileri

### Demo Kullanıcıları
- **Admin:** `admin@demo-elektrik.com` / `password`
- **Muhasebe:** `muhasebe@demo-elektrik.com` / `password`
- **Analist:** `analist@demo-elektrik.com` / `password`
- **Operasyon:** `operasyon@demo-elektrik.com` / `password`
- **IT:** `it@demo-elektrik.com` / `password`

### Eski Demo Kullanıcısı
- **Admin:** `admin@example.com` / `password`

## 📊 Test Verileri

Sistem şu test verilerini içerir:
- 🏢 **1 Demo Tenant** - Demo Elektrik A.Ş.
- 👥 **5 Kullanıcı** - Farklı rollerde
- 🏗️ **4 Departman** - Yönetim, Muhasebe, Operasyon, IT
- 🏭 **4 Tesis** - Ana Fabrika, Depo, Ofis, Ar-Ge
- ⚡ **4 Elektrik Sayacı** - Her tesiste bir tane
- 📈 **24 Tüketim Kaydı** - Son 6 ay için
- 🔑 **2 API Anahtarı** - Dashboard ve Mobile için

## 🌐 Erişim Adresleri

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5143
- **Swagger Docs:** http://localhost:5143

## 🛠️ Teknolojiler

### Backend
- **.NET 9.0** - Web API framework
- **Entity Framework Core** - ORM
- **PostgreSQL** - Veritabanı
- **JWT** - Kimlik doğrulama
- **Serilog** - Logging

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Tip güvenliği
- **Ant Design** - UI kütüphanesi
- **Recharts** - Grafik kütüphanesi
- **Tailwind CSS** - Styling

## 📁 Proje Yapısı

```
ElectricityTracker/
├── TrackerAPI/                 # Backend (.NET)
│   ├── Controllers/           # API controllers
│   ├── Models/               # Entity models
│   ├── Data/                 # Database context
│   ├── DTOs/                 # Data transfer objects
│   └── Services/             # Business logic
├── tracker-web/               # Frontend (Next.js)
│   ├── src/
│   │   ├── app/             # Pages (App Router)
│   │   ├── components/      # React components
│   │   └── utils/           # Utility functions
│   └── public/              # Static files
└── setup.ps1                 # Otomatik kurulum script'i
```

## 🔧 API Endpoints

### Auth
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/tenant/register` - Tenant kaydı

### Dashboard
- `GET /api/dashboard/stats` - Dashboard istatistikleri
- `GET /api/dashboard/consumption-chart` - Tüketim grafiği
- `GET /api/dashboard/facility-distribution` - Tesis dağılımı
- `GET /api/dashboard/recent-alerts` - Son uyarılar

### Admin
- `GET /api/admin/users` - Kullanıcı listesi
- `GET /api/admin/tenants` - Tenant listesi
- `GET /api/admin/logs` - Sistem logları

### Core
- `GET /api/department` - Departman listesi
- `POST /api/department` - Departman oluşturma

## 🚀 Deployment

### Production Build
```bash
# Backend
cd TrackerAPI
dotnet publish -c Release

# Frontend
cd tracker-web
npm run build
```

### Environment Variables
```env
# Backend
ConnectionStrings__DefaultConnection=your_postgres_connection_string
Jwt__Key=your_jwt_secret_key
Jwt__Issuer=your_issuer
Jwt__Audience=your_audience

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5143/api
```

## 📝 Geliştirme

### Yeni Migration Ekleme
```bash
cd TrackerAPI
dotnet ef migrations add MigrationName
dotnet ef database update
```

### Yeni API Endpoint Ekleme
1. `Controllers/` klasöründe yeni controller oluştur
2. `DTOs/` klasöründe gerekli DTO'ları ekle
3. `Models/` klasöründe entity'leri güncelle

### Yeni Sayfa Ekleme
1. `tracker-web/src/app/` altında yeni klasör oluştur
2. `page.tsx` dosyası ekle
3. Gerekirse `components/` altında component'ler oluştur

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🆘 Destek

Herhangi bir sorun yaşarsanız:
1. GitHub Issues'da sorun bildirin
2. Detaylı hata mesajlarını paylaşın
3. Hangi adımda sorun yaşadığınızı belirtin

---

**Not:** Bu proje geliştirme aşamasındadır. Production kullanımı için ek güvenlik önlemleri alınmalıdır. 