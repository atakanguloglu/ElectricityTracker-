@echo off
echo ========================================
echo Elektrik Takip Sistemi - Otomatik Kurulum
echo ========================================
echo.

echo [1/5] Backend build ediliyor...
cd TrackerAPI
dotnet build
if %errorlevel% neq 0 (
    echo HATA: Backend build başarısız!
    pause
    exit /b 1
)
echo ✅ Backend build başarılı!
echo.

echo [2/5] Veritabanı migration'ları uygulanıyor...
dotnet ef database update
if %errorlevel% neq 0 (
    echo HATA: Database migration başarısız!
    pause
    exit /b 1
)
echo ✅ Database migration başarılı!
echo.

echo [3/5] Backend başlatılıyor (arka planda)...
start "Backend" cmd /k "dotnet run"
echo ✅ Backend başlatıldı!
echo.

echo [4/5] Frontend bağımlılıkları kontrol ediliyor...
cd ..\tracker-web
if not exist "node_modules" (
    echo Node modules yükleniyor...
    npm install
    if %errorlevel% neq 0 (
        echo HATA: npm install başarısız!
        pause
        exit /b 1
    )
)
echo ✅ Frontend bağımlılıkları hazır!
echo.

echo [5/5] Frontend başlatılıyor...
start "Frontend" cmd /k "npm run dev"
echo ✅ Frontend başlatıldı!
echo.

echo ========================================
echo 🎉 Kurulum Tamamlandı!
echo ========================================
echo.
echo 📊 Backend: http://localhost:5143
echo 🌐 Frontend: http://localhost:3000
echo.
echo 🔐 Login Bilgileri:
echo    Email: admin@demo-elektrik.com
echo    Şifre: password
echo.
echo    Alternatif:
echo    Email: admin@example.com
echo    Şifre: password
echo.
echo ⏳ Backend'in tamamen başlaması için 10-15 saniye bekleyin...
echo.
pause 