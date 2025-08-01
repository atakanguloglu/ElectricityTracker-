# Elektrik Takip Sistemi - Otomatik Kurulum Script'i
# PowerShell versiyonu

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Elektrik Takip Sistemi - Otomatik Kurulum" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Backend Build
Write-Host "[1/5] Backend build ediliyor..." -ForegroundColor Yellow
Set-Location "TrackerAPI"
try {
    dotnet build
    if ($LASTEXITCODE -ne 0) {
        throw "Backend build başarısız!"
    }
    Write-Host "✅ Backend build başarılı!" -ForegroundColor Green
} catch {
    Write-Host "❌ HATA: $_" -ForegroundColor Red
    Read-Host "Devam etmek için bir tuşa basın..."
    exit 1
}
Write-Host ""

# 2. Database Migration
Write-Host "[2/5] Veritabanı migration'ları uygulanıyor..." -ForegroundColor Yellow
try {
    dotnet ef database update
    if ($LASTEXITCODE -ne 0) {
        throw "Database migration başarısız!"
    }
    Write-Host "✅ Database migration başarılı!" -ForegroundColor Green
} catch {
    Write-Host "❌ HATA: $_" -ForegroundColor Red
    Read-Host "Devam etmek için bir tuşa basın..."
    exit 1
}
Write-Host ""

# 3. Backend Başlat
Write-Host "[3/5] Backend başlatılıyor (arka planda)..." -ForegroundColor Yellow
try {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; dotnet run" -WindowStyle Normal
    Write-Host "✅ Backend başlatıldı!" -ForegroundColor Green
} catch {
    Write-Host "❌ HATA: Backend başlatılamadı!" -ForegroundColor Red
}
Write-Host ""

# 4. Frontend Dependencies
Write-Host "[4/5] Frontend bağımlılıkları kontrol ediliyor..." -ForegroundColor Yellow
Set-Location "..\tracker-web"
if (-not (Test-Path "node_modules")) {
    Write-Host "Node modules yükleniyor..." -ForegroundColor Yellow
    try {
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "npm install başarısız!"
        }
        Write-Host "✅ Node modules yüklendi!" -ForegroundColor Green
    } catch {
        Write-Host "❌ HATA: $_" -ForegroundColor Red
        Read-Host "Devam etmek için bir tuşa basın..."
        exit 1
    }
} else {
    Write-Host "✅ Frontend bağımlılıkları hazır!" -ForegroundColor Green
}
Write-Host ""

# 5. Frontend Başlat
Write-Host "[5/5] Frontend başlatılıyor..." -ForegroundColor Yellow
try {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal
    Write-Host "✅ Frontend başlatıldı!" -ForegroundColor Green
} catch {
    Write-Host "❌ HATA: Frontend başlatılamadı!" -ForegroundColor Red
}
Write-Host ""

# Tamamlandı
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 Kurulum Tamamlandı!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Backend: http://localhost:5143" -ForegroundColor White
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Login Bilgileri:" -ForegroundColor Yellow
Write-Host "   Email: admin@demo-elektrik.com" -ForegroundColor White
Write-Host "   Şifre: password" -ForegroundColor White
Write-Host ""
Write-Host "   Alternatif:" -ForegroundColor Yellow
Write-Host "   Email: admin@example.com" -ForegroundColor White
Write-Host "   Şifre: password" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Backend'in tamamen başlaması için 10-15 saniye bekleyin..." -ForegroundColor Yellow
Write-Host ""
Read-Host "Devam etmek için Enter'a basın..." 