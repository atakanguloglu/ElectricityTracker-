// JWT Token yönetimi için utility fonksiyonları

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'SuperAdmin' | 'Admin' | 'Manager' | 'User' | 'Viewer'
  tenantName: string
  tenantId: number
  phone?: string
  lastLoginAt?: string
  // Backend'den gelen property'ler
  Id?: number
  FirstName?: string
  LastName?: string
  Email?: string
  Role?: 'SuperAdmin' | 'Admin' | 'Manager' | 'User' | 'Viewer'
  TenantName?: string
  TenantId?: number
  Phone?: string
  LastLoginAt?: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  expiresAt: string
  user: User
}

// Token'ı localStorage'dan al
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken')
}

// Token'ı localStorage'a kaydet
export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('authToken', token)
  
  // Cookie'ye de kaydet (middleware için)
  document.cookie = `authToken=${token}; path=/; max-age=86400; secure; samesite=strict`
}

// Token'ı localStorage'dan sil
export const removeToken = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('authToken')
  
  // Cookie'yi de temizle
  document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

// Kullanıcı bilgilerini localStorage'dan al
export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  
  try {
    return JSON.parse(userStr)
  } catch (error) {
    console.error('Error parsing user data:', error)
    return null
  }
}

// Kullanıcı bilgilerini localStorage'a kaydet
export const setUser = (user: User): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('user', JSON.stringify(user))
}

// Kullanıcı bilgilerini localStorage'dan sil
export const removeUser = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('user')
}

// Token'ın geçerli olup olmadığını kontrol et
export const isTokenValid = (): boolean => {
  const token = getToken()
  if (!token) return false
  
  try {
    // JWT token'ın payload kısmını decode et
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    
    // Token'ın süresi dolmuş mu kontrol et
    return payload.exp > currentTime
  } catch (error) {
    console.error('Error validating token:', error)
    return false
  }
}

// Kullanıcının giriş yapmış olup olmadığını kontrol et
export const isAuthenticated = (): boolean => {
  return isTokenValid() && getUser() !== null
}

// Tüm auth verilerini temizle (logout için)
export const clearAuth = (): void => {
  removeToken()
  removeUser()
}

// API istekleri için Authorization header'ı oluştur
export const getAuthHeaders = (): HeadersInit => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// Güvenli API isteği yap
export const apiRequest = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const headers = getAuthHeaders()
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  })
  
  // Token geçersizse logout yap
  if (response.status === 401) {
    clearAuth()
    window.location.href = '/login'
  }
  
  return response
}

// Rol bazlı yetki kontrolü
export const hasRole = (requiredRoles: User['role'][]): boolean => {
  const user = getUser()
  if (!user) return false
  
  // Backend'den gelen Role (büyük R) veya frontend'deki role (küçük r)
  const userRole = (user as any).Role || user.role
  return requiredRoles.includes(userRole as User['role'])
}

// SuperAdmin yetkisi kontrolü  
export const isSuperAdmin = (): boolean => {
  const user = getUser()
  if (!user) return false
  
  // Backend'den gelen Role (büyük R) veya frontend'deki role (küçük r)
  const userRole = (user as any).Role || user.role
  return userRole === 'SuperAdmin'
}

// Admin yetkisi kontrolü (tenant admin)
export const isAdmin = (): boolean => {
  return hasRole(['Admin'])
}

// Manager yetkisi kontrolü
export const isManager = (): boolean => {
  return hasRole(['Admin', 'Manager'])
}

// Kullanıcı yetkisi kontrolü
export const isUser = (): boolean => {
  return hasRole(['Admin', 'Manager', 'User'])
}

// Sadece görüntüleme yetkisi kontrolü
export const isViewer = (): boolean => {
  return hasRole(['Admin', 'Manager', 'User', 'Viewer'])
}

// Tenant ID'sini al
export const getTenantId = (): number | null => {
  const user = getUser()
  return user?.tenantId || null
}

// Kullanıcının tam adını al
export const getFullName = (): string => {
  const user = getUser()
  if (!user) return ''
  return `${user.firstName} ${user.lastName}`
} 