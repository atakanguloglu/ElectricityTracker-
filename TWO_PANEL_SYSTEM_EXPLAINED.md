# 🎯 İki Panel Sistemi - SuperAdmin vs Tenant

**Projende 2 farklı yönetim paneli var!**

---

## 🔴 **1. SuperAdmin Panel** (SENİN KULLANDIĞIN)

### **Amaç:**
Tüm sistemi yöneten **SÜPER YÖNETİCİ** paneli.

### **Kim Kullanır:**
- **Sadece sen** (SuperAdmin)
- Sistemin sahibi
- Tüm tenant'ları yönetir

### **Özellikler:**
```
✅ Tenant yönetimi (Oluştur, Sil, Düzenle)
✅ Kullanıcı yönetimi (Tüm tenant'ların kullanıcıları)
✅ Faturalama ve ödeme takibi
✅ Sistem monitöring (CPU, RAM, Disk)
✅ Loglar ve güvenlik
✅ Raporlar ve analytics
✅ Abonelik planları
```

### **Erişim:**
```
Frontend: /super-admin
Backend API: /api/superadmin
Login: admin@example.com / password123
Rol: SuperAdmin
```

### **Sayfalar:**
```
/super-admin                 → Dashboard
/super-admin/tenants         → Tenant Yönetimi
/super-admin/users           → Kullanıcı Yönetimi
/super-admin/billing         → Faturalama
/super-admin/monitoring      → Sistem İzleme
/super-admin/logs            → Loglar
/super-admin/security        → Güvenlik
/super-admin/reports         → Raporlar
/super-admin/settings        → Ayarlar
```

---

## 🟢 **2. Tenant Dashboard** (MÜŞTERİLERİN KULLANDIĞI)

### **Amaç:**
Her **tenant'ın kendi** kullanıcıları için panel.

### **Kim Kullanır:**
- Tenant şirketinin Admin'i
- Tenant şirketinin kullanıcıları (Manager, User, Viewer)
- Her tenant **sadece kendi verilerini** görür

### **Özellikler:**
```
✅ Kendi tenant'ının kullanıcıları
✅ Kendi tesislerinin elektrik tüketimi
✅ Kendi faturaları
✅ Kendi raporları
✅ Chatbot desteği
✅ Abonelik bilgileri
```

### **Erişim:**
```
Frontend: /tenant-dashboard
Backend API: /api/tenant veya /api/core
Login: tenant-admin@company.com / password
Rol: Admin, Manager, User, Viewer
```

### **Sayfalar:**
```
/tenant-dashboard              → Dashboard
/tenant-dashboard/users        → Kendi kullanıcıları
/tenant-dashboard/consumption  → Elektrik tüketimi
/tenant-dashboard/reports      → Raporlar
/tenant-dashboard/alerts       → Uyarılar
/tenant-dashboard/facilities   → Tesisler
/tenant-dashboard/chatbot      → AI Chatbot
/tenant-dashboard/subscription → Abonelik bilgisi
```

---

## 📊 **KARŞILAŞTIRMA**

| Özellik | SuperAdmin Panel | Tenant Dashboard |
|---------|------------------|------------------|
| **Kullanıcı** | Sen (Sistem sahibi) | Müşteriler (Tenant'lar) |
| **Erişim** | Tüm sistem | Sadece kendi verileri |
| **Tenant Yönetimi** | ✅ Evet | ❌ Hayır |
| **Kullanıcı Yönetimi** | ✅ Tüm kullanıcılar | ✅ Sadece kendi tenant'ı |
| **Sistem Monitoring** | ✅ Evet | ❌ Hayır |
| **Faturalama** | ✅ Tüm faturalar | ✅ Sadece kendi faturaları |
| **Tüketim Takibi** | ✅ Tüm tenant'lar | ✅ Sadece kendi tesisleri |
| **Route** | `/super-admin` | `/tenant-dashboard` |
| **API** | `/api/superadmin` | `/api/tenant` |
| **Rol** | SuperAdmin | Admin/Manager/User/Viewer |

---

## 🎯 **SENARYODa NASIL ÇALIŞIR?**

### **Örnek: ABC Şirketi**

1. **Sen (SuperAdmin):**
   - SuperAdmin Panel'e giriş yaparsın
   - "Yeni Tenant" diyerek ABC Şirketini eklersin
   - ABC için admin kullanıcısı oluşturursun: `admin@abc.com`
   - ABC'ye Basic abonelik atarsın
   - ABC'nin faturasını görürsün

2. **ABC Şirketi (Müşteri):**
   - `admin@abc.com` ile **Tenant Dashboard**'a giriş yapar
   - Kendi şirketinin kullanıcılarını ekler (Manager, User)
   - Kendi tesislerinin elektrik tüketimini takip eder
   - Kendi raporlarını görür
   - Chatbot ile destek alır
   - **Sen'in yönetim panelini görmez!**

---

## 🔒 **GÜVENLİK**

### **SuperAdmin Panel:**
```csharp
[Authorize(Roles = "SuperAdmin")]  // Sadece SuperAdmin erişebilir
```

### **Tenant Dashboard:**
```csharp
[Authorize(Roles = "Admin,Manager,User,Viewer")]  // Tenant kullanıcıları
// + TenantId kontrolü (Sadece kendi tenant'ının verileri)
```

---

## 📝 **ÖZET**

```
SuperAdmin Panel:
  ├─ Sen kullanırsın
  ├─ Tüm sistemi yönetirsin
  ├─ /super-admin
  └─ /api/superadmin

Tenant Dashboard:
  ├─ Müşteriler kullanır
  ├─ Sadece kendi verilerini görür
  ├─ /tenant-dashboard
  └─ /api/tenant
```

**ŞİMDİ NETLEŞTİ Mİ? 😊**

Test et:
1. SuperAdmin panel → Tenant oluştur
2. O tenant'ın admin'i ile login ol
3. Tenant Dashboard'u gör!

