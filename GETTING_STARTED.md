# 🚀 Projeyi Ayağa Kaldırma Rehberi

## 📋 Ön Gereksinimler

Projeyi çalıştırmadan önce sisteminizde şunlar kurulu olmalı:

### Gerekli Programlar
- ✅ **.NET 9.0 SDK** - [İndir](https://dotnet.microsoft.com/download/dotnet/9.0)
- ✅ **Node.js 18+** - [İndir](https://nodejs.org/)
- ✅ **PostgreSQL 15+** - [İndir](https://www.postgresql.org/download/)
- ✅ **Git** - [İndir](https://git-scm.com/)

### İsteğe Bağlı
- Visual Studio 2022 / VS Code
- Postman (API test için)
- pgAdmin (PostgreSQL yönetimi için)

---

## 🏁 HIZLI BAŞLANGIÇ (5 Dakika)

### Adım 1: Veritabanını Hazırla

**PostgreSQL'i başlat** ve veritabanı oluştur:

```sql
-- PostgreSQL'e bağlan (pgAdmin veya terminal)
CREATE DATABASE ElectricityTrackerDB;
```

Veya komut satırından:
```bash
# Windows (PowerShell)
psql -U postgres

# Komut satırında
CREATE DATABASE ElectricityTrackerDB;
```

### Adım 2: Backend'i Çalıştır

```bash
# Proje klasörüne git
cd TrackerAPI

# Paketleri yükle
dotnet restore

# Veritabanı migration'larını uygula
dotnet ef database update

# Projeyi çalıştır
dotnet run
```

✅ Backend şu adreste çalışacak: **http://localhost:5143**
✅ Swagger UI: **http://localhost:5143**

### Adım 3: Frontend'i Çalıştır

**YENİ bir terminal/PowerShell penceresi aç:**

```bash
# Frontend klasörüne git
cd tracker-web

# Paketleri yükle (ilk kez)
npm install

# Development server'ı başlat
npm run dev
```

✅ Frontend şu adreste çalışacak: **http://localhost:3000**

### Adım 4: Giriş Yap

Tarayıcıda **http://localhost:3000** adresine git ve şu bilgilerle giriş yap:

```
Email: admin@demo-elektrik.com
Password: password
```

🎉 **Tebrikler! Proje çalışıyor!**

---

## 📝 DETAYLI KURULUM

### 1️⃣ PostgreSQL Kurulumu ve Yapılandırma

#### Windows'ta PostgreSQL Kurulumu

1. PostgreSQL'i indirin ve kurun
2. Kurulum sırasında şifre belirleyin (örn: `admin`)
3. Port: **5432** (varsayılan)

#### Veritabanı Oluşturma

```sql
-- pgAdmin veya psql ile bağlanın
CREATE DATABASE ElectricityTrackerDB;

-- Kullanıcı oluştur (isteğe bağlı)
CREATE USER electricity_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ElectricityTrackerDB TO electricity_user;
```

### 2️⃣ Backend Kurulumu (TrackerAPI)

#### Development Ayarları

**`TrackerAPI/appsettings.Development.json` dosyasını kontrol edin:**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=ElectricityTrackerDB;Username=postgres;Password=admin"
  },
  "Jwt": {
    "Key": "development-jwt-secret-key-min-32-characters-required-for-security",
    "Issuer": "ElectricityTrackerAPI",
    "Audience": "ElectricityTrackerAPI"
  },
  "GeminiAPI": {
    "ApiKey": "YOUR_API_KEY_HERE"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000"
    ]
  }
}
```

⚠️ **ÖNEMLİ:** PostgreSQL şifrenizi `Password=` kısmına yazın!

#### Backend'i Çalıştırma

```bash
cd TrackerAPI

# Paketleri yükle
dotnet restore

# Build et
dotnet build

# Migration'ları uygula
dotnet ef database update

# Çalıştır
dotnet run
```

#### Başarı Kontrolü

Tarayıcıda **http://localhost:5143** adresine gidin. Swagger UI görmelisiniz.

### 3️⃣ Frontend Kurulumu (tracker-web)

#### Environment Variables Oluştur

**`.env.local` dosyası oluşturun** (tracker-web klasöründe):

```bash
cd tracker-web

# Windows PowerShell
New-Item -Path ".env.local" -ItemType File

# Linux/Mac
touch .env.local
```

**`.env.local` dosyasına şunu yazın:**

```env
NEXT_PUBLIC_API_URL=http://localhost:5143
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_ENV=development
```

#### Frontend'i Çalıştırma

```bash
cd tracker-web

# Paketleri yükle (ilk kez)
npm install

# Development server'ı başlat
npm run dev
```

#### Başarı Kontrolü

Tarayıcıda **http://localhost:3000** adresine gidin. Login sayfası görmelisiniz.

---

## 🔑 Test Kullanıcıları

Sistem otomatik olarak şu test kullanıcılarını oluşturur:

### SuperAdmin
```
Email: admin@demo-elektrik.com
Password: password
Panel: /super-admin
```

### Tenant Admin
```
Email: admin@example.com
Password: password
Panel: /tenant-dashboard
```

### Diğer Kullanıcılar
```
Email: muhasebe@demo-elektrik.com
Password: password

Email: analist@demo-elektrik.com
Password: password

Email: operasyon@demo-elektrik.com
Password: password

Email: it@demo-elektrik.com
Password: password
```

---

## 🛠️ Geliştirme Araçları

### Hot Reload (Otomatik Yenileme)

**Backend:**
```bash
dotnet watch run
```

**Frontend:**
```bash
npm run dev
# Zaten hot reload aktif
```

### Database Temizle ve Yeniden Oluştur

```bash
cd TrackerAPI

# Veritabanını sil
dotnet ef database drop

# Yeniden oluştur
dotnet ef database update
```

### Yeni Migration Ekle

```bash
cd TrackerAPI
dotnet ef migrations add YourMigrationName
dotnet ef database update
```

---

## 🔧 Sorun Giderme

### Sorun 1: Backend Çalışmıyor

**Hata:** `Unable to connect to database`

**Çözüm:**
1. PostgreSQL çalışıyor mu kontrol edin
2. `appsettings.Development.json` içindeki şifreyi kontrol edin
3. Veritabanı adını kontrol edin

```bash
# PostgreSQL durumunu kontrol et (Windows)
Get-Service postgresql*

# Başlat
Start-Service postgresql-x64-15
```

**Hata:** `Port 5143 already in use`

**Çözüm:**
```bash
# Windows
netstat -ano | findstr :5143
taskkill /PID <PID_NUMBER> /F

# Veya farklı port kullan
dotnet run --urls "http://localhost:5144"
```

### Sorun 2: Frontend Çalışmıyor

**Hata:** `Cannot connect to API`

**Çözüm:**
1. Backend çalışıyor mu kontrol edin
2. `.env.local` dosyası var mı kontrol edin
3. CORS ayarlarını kontrol edin

**Hata:** `Port 3000 already in use`

**Çözüm:**
```bash
# Farklı port kullan
npm run dev -- -p 3001
```

### Sorun 3: Migration Hataları

**Hata:** `Migration failed`

**Çözüm:**
```bash
# Tüm migration'ları kaldır ve tekrar uygula
dotnet ef database drop --force
dotnet ef database update

# Veya sıfırdan başla
dotnet ef migrations remove --force
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Sorun 4: npm install Hataları

**Çözüm:**
```bash
# Cache'i temizle
npm cache clean --force

# node_modules'u sil
rm -rf node_modules
rm package-lock.json

# Yeniden yükle
npm install
```

---

## 🐛 Debug Modu

### Backend Debug (VS Code)

`.vscode/launch.json` oluşturun:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": ".NET Core Launch (web)",
      "type": "coreclr",
      "request": "launch",
      "preLaunchTask": "build",
      "program": "${workspaceFolder}/TrackerAPI/bin/Debug/net9.0/TrackerAPI.dll",
      "args": [],
      "cwd": "${workspaceFolder}/TrackerAPI",
      "stopAtEntry": false,
      "env": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  ]
}
```

### Frontend Debug (Chrome)

VS Code'da **F5** tuşuna basın veya:
1. Chrome DevTools açın (F12)
2. Sources sekmesine gidin
3. Breakpoint ekleyin

---

## 📊 Performans Kontrolleri

### Backend Logs

Loglar şurada: `TrackerAPI/logs/api-YYYYMMDD.txt`

```bash
# Son logları göster (PowerShell)
Get-Content TrackerAPI/logs/api-$(Get-Date -Format 'yyyyMMdd').txt -Tail 50 -Wait
```

### Database İstatistikleri

```sql
-- Tablo boyutları
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🚀 Production'a Geçiş

Production'a deploy etmeden önce:

1. 📖 [`DEPLOYMENT.md`](./DEPLOYMENT.md) dosyasını okuyun
2. 🔒 [`SECURITY.md`](./SECURITY.md) dosyasını okuyun
3. ✅ Güvenlik checklistini tamamlayın

---

## 🆘 Yardım ve Destek

### Yararlı Komutlar

```bash
# .NET SDK versiyonu
dotnet --version

# Node.js versiyonu
node --version
npm --version

# PostgreSQL versiyonu
psql --version

# Tüm .NET process'leri durdur
dotnet clean
dotnet restore
```

### Logları Kontrol Et

```bash
# Backend logs
cd TrackerAPI/logs
ls

# Frontend logs
# Terminalde görünür
```

### Veritabanı Backup

```bash
# Backup al
pg_dump -U postgres -d ElectricityTrackerDB > backup.sql

# Restore et
psql -U postgres -d ElectricityTrackerDB < backup.sql
```

---

## 📞 İletişim

Sorun yaşarsanız:
1. Bu dokümandaki sorun giderme bölümünü kontrol edin
2. Logs dosyalarını kontrol edin
3. GitHub Issues'da sorun bildirin

---

**Başarılar! 🎉**

Son Güncelleme: 2024

