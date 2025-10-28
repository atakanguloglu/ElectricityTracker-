# 🐛 Debug Mode - Kullanım Kılavuzu

## 📋 Kurulum

### 1. Environment Variables Ayarla

**`tracker-web/.env.local` dosyası oluştur:**

```bash
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:5143
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_ENV=development
```

### 2. Frontend'i Restart Et

```bash
cd tracker-web
npm run dev
```

---

## 🎯 Debug Özellikleri

### ✅ Aktif Olan Loglar

#### 1. **API Request/Response Logging**
Her API çağrısı otomatik loglanır:
```
🔍 [ElectricityTracker] API REQUEST
📍 Method: GET
🔗 URL: http://localhost:5143/api/superadmin/tenants
📦 Data: {...}
⏰ Time: 22:45:30
```

```
🔍 [ElectricityTracker] API RESPONSE ✅
📍 Method: GET
🔗 URL: http://localhost:5143/api/superadmin/tenants
📊 Status: 200
📦 Data: {...}
⏱️ Duration: 125ms
⏰ Time: 22:45:31
```

#### 2. **Error Logging**
Hatalar detaylı loglanır:
```
🔍 [ElectricityTracker] ERROR
❌ Dashboard istatistikleri alınamadı
📦 Response Data: {...}
📊 Response Status: 404
📋 Response Headers: {...}
📚 Stack Trace: ...
```

#### 3. **React Query Logging**
- ✅ Query Success
- 🔴 Query Error
- 🔄 Cache Updates
- ✅ Mutation Success
- 🔴 Mutation Error

#### 4. **Global Error Handling**
- 💥 Window errors
- 🚫 Unhandled promise rejections

---

## 🔧 Logger Kullanımı

### Kodda Logger Kullan:

```typescript
import { logger } from '@/utils/logger'

// Success
logger.success('Tenant başarıyla kaydedildi', tenant)

// Error
logger.error('Tenant kaydedilemedi', error)

// Warning
logger.warning('API yanıt süresi yavaş', { duration: 5000 })

// Info
logger.info('Sayfa yüklendi', { page: '/tenants' })

// API Request (otomatik çağrılır)
logger.apiRequest('POST', '/api/superadmin/tenants', data)

// API Response (otomatik çağrılır)
logger.apiResponse('POST', '/api/superadmin/tenants', 200, responseData, 150)

// Debug
logger.debug('State güncellendi', { oldState, newState })

// User Action
logger.userAction('Button clicked', { buttonId: 'create-tenant' })

// Navigation
logger.navigation('/tenants', '/tenants/123')

// State Change
logger.stateChange('filters', oldFilters, newFilters)

// Table
logger.table(tenantsList)
```

---

## 📊 Console Output Örnekleri

### Success Log:
```
%c🔍 [ElectricityTracker] SUCCESS
background: #10b981; color: white; padding: 2px 6px; border-radius: 3px;
Tenant başarıyla oluşturuldu
{ id: 123, name: 'Test Tenant' }
```

### Error Log (Detailed):
```
%c🔍 [ElectricityTracker] ERROR
background: #ef4444; color: white; padding: 2px 6px; border-radius: 3px;
API çağrısı başarısız
📦 Response Data: { message: 'Tenant bulunamadı', statusCode: 404 }
📊 Response Status: 404
📋 Response Headers: { content-type: 'application/json' }
💥 Error Message: Request failed with status code 404
📚 Stack Trace: Error: Request failed with status code 404
    at createError (axios.js:123)
    at settle (axios.js:456)
    ...
```

### API Request Group:
```
▼ 🔍 [ElectricityTracker] API REQUEST
  📍 Method: POST
  🔗 URL: http://localhost:5143/api/superadmin/tenants
  📦 Data: { companyName: 'Test', email: 'test@example.com' }
  ⏰ Time: 22:45:30
```

### API Response Group (Success):
```
▼ 🔍 [ElectricityTracker] API RESPONSE ✅
  📍 Method: POST
  🔗 URL: http://localhost:5143/api/superadmin/tenants
  📊 Status: 201
  📦 Data: { id: 123, companyName: 'Test' }
  ⏱️ Duration: 250ms
  ⏰ Time: 22:45:31
```

### API Response Group (Error):
```
▼ 🔍 [ElectricityTracker] API RESPONSE ❌
  📍 Method: GET
  🔗 URL: http://localhost:5143/api/admin/dashboard/stats
  📊 Status: 404
  📦 Data: null
  ⏱️ Duration: 50ms
  ⏰ Time: 22:45:32
```

---

## 🎨 Log Renkleri

- 🟢 **Success** → Yeşil (`#10b981`)
- 🔴 **Error** → Kırmızı (`#ef4444`)
- 🟠 **Warning** → Turuncu (`#f59e0b`)
- 🔵 **Info** → Mavi (`#3b82f6`)
- 🟣 **API** → Mor (`#8b5cf6`)
- 🟦 **Debug** → İndigo (`#6366f1`)

---

## 🚀 Production'da Disable Etme

Production'da loglar otomatik olarak **kapatılır**:

```typescript
// logger.ts içinde
const isDebugEnabled = process.env.NEXT_PUBLIC_DEBUG === 'true' || isDevelopment
```

Production build:
```bash
npm run build
# NEXT_PUBLIC_DEBUG=false olduğunda loglar görünmez
```

---

## 🔍 Troubleshooting

### Log'lar görünmüyor?

1. **.env.local** dosyasını kontrol et:
   ```bash
   NEXT_PUBLIC_DEBUG=true
   ```

2. Frontend'i restart et:
   ```bash
   npm run dev
   ```

3. Browser console'u aç:
   ```
   F12 → Console tab
   ```

4. Console filter'ını temizle (boş olmalı)

---

## 📦 Logger API Reference

| Method | Açıklama | Kullanım |
|--------|----------|----------|
| `logger.success()` | Başarılı işlemler | `logger.success('İşlem tamam', data)` |
| `logger.error()` | Hatalar | `logger.error('Hata oluştu', error)` |
| `logger.warning()` | Uyarılar | `logger.warning('Dikkat!', details)` |
| `logger.info()` | Bilgi mesajları | `logger.info('Bilgi', data)` |
| `logger.apiRequest()` | API istekleri | Otomatik çağrılır |
| `logger.apiResponse()` | API yanıtları | Otomatik çağrılır |
| `logger.debug()` | Debug mesajları | `logger.debug('Debug', state)` |
| `logger.table()` | Tablo formatı | `logger.table(arrayData)` |
| `logger.userAction()` | Kullanıcı eylemleri | `logger.userAction('Click', btn)` |
| `logger.navigation()` | Sayfa geçişleri | `logger.navigation(from, to)` |
| `logger.stateChange()` | State değişiklikleri | `logger.stateChange(name, old, new)` |

---

## 🎯 Örnek Senaryo

### Tenant oluşturma işlemi:

```typescript
// 1. User action
logger.userAction('Create Tenant Button Clicked', { formData })

// 2. API Request (otomatik)
🔍 API REQUEST → POST /api/superadmin/tenants

// 3. API Response (otomatik)
🔍 API RESPONSE ✅ → 201 Created

// 4. React Query Mutation Success (otomatik)
✅ React Query Mutation Success

// 5. Success message
logger.success('Tenant başarıyla oluşturuldu', tenant)

// 6. Navigation
logger.navigation('/tenants/create', '/tenants')
```

---

## 💡 Best Practices

1. **Production'da kapatılıyor mu kontrol et**
   - `NEXT_PUBLIC_DEBUG=false` → Log yok ✅

2. **Sensitive data loglama**
   - Şifre, token gibi verileri loglama!
   - Production'da zaten kapalı ama dikkat et

3. **Performance**
   - Log'lar development'ta minimal overhead
   - Production'da hiç çalışmıyor

4. **Console temizliği**
   - Grupları kapat (collapsed) (sol okla)
   - Filter kullan: `[ElectricityTracker]`

---

## 🔥 ARTIK HER ŞEY CONSOLE'DA!

✅ Tüm API çağrıları
✅ Tüm hatalar (detaylı stack trace ile)
✅ React Query durumu
✅ Network timing (duration)
✅ Request/Response data
✅ Global errors & promise rejections

**Browser console'u aç ve her şeyi gör! 🚀**

