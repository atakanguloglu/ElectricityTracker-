import { apiRequest } from './apiService';

export interface SystemInfo {
  version: string;
  buildDate: string;
  uptime: string;
  lastBackup: string;
  databaseSize: string;
  totalUsers: number;
  activeTenants: number;
  systemHealth: number;
}

export interface BackupLog {
  id: number;
  name: string;
  size: string;
  type: string;
  status: string;
  createdAt: string;
  duration: string;
}

export interface EmailProvider {
  id: number;
  name: string;
  type: string;
  smtpServer?: string;
  smtpPort?: number;
  username?: string;
  apiKey?: string;
  fromEmail: string;
  isActive: boolean;
  sortOrder: number;
}

export interface SmsProvider {
  id: number;
  name: string;
  type: string;
  apiKey: string;
  apiSecret: string;
  fromNumber: string;
  costPerSms: number;
  isActive: boolean;
}

export interface SystemSettings {
  id: number;
  systemName: string;
  defaultLanguage: string;
  defaultCurrency: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  maintenanceMode: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  autoBackup: boolean;
  backupFrequency: string;
  backupTime: string;
  backupType: string;
  minPasswordLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecialChar: boolean;
  passwordExpiryDays: number;
  maxSessionHours: number;
  require2FA: boolean;
  maxLoginAttempts: number;
  lockoutDuration: number;
  ipRestriction: boolean;
}

export const settingsService = {
  // Sistem bilgilerini getir
  getSystemInfo: async (): Promise<SystemInfo> => {
    return apiRequest<SystemInfo>('GET', '/api/admin/settings/system-info');
  },

  // Sistem ayarlarını getir
  getSystemSettings: async (): Promise<SystemSettings> => {
    return apiRequest<SystemSettings>('GET', '/api/admin/settings');
  },

  // Sistem ayarlarını güncelle
  updateSystemSettings: async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
    return apiRequest<SystemSettings>('PUT', '/api/admin/settings', settings);
  },

  // Yedekleme geçmişini getir
  getBackupLogs: async (): Promise<BackupLog[]> => {
    return apiRequest<BackupLog[]>('GET', '/api/admin/settings/backups');
  },

  // Manuel yedekleme başlat
  startBackup: async (): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>('POST', '/api/admin/settings/backups/start');
  },

  // E-posta sağlayıcılarını getir
  getEmailProviders: async (): Promise<EmailProvider[]> => {
    return apiRequest<EmailProvider[]>('GET', '/api/admin/settings/email-providers');
  },

  // E-posta sağlayıcısını güncelle
  updateEmailProvider: async (id: number, provider: Partial<EmailProvider>): Promise<EmailProvider> => {
    return apiRequest<EmailProvider>('PUT', `/api/admin/settings/email-providers/${id}`, provider);
  },

  // Test e-postası gönder
  testEmail: async (): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>('POST', '/api/admin/settings/email-providers/test');
  },

  // SMS sağlayıcılarını getir
  getSmsProviders: async (): Promise<SmsProvider[]> => {
    return apiRequest<SmsProvider[]>('GET', '/api/admin/settings/sms-providers');
  },

  // SMS sağlayıcısını güncelle
  updateSmsProvider: async (id: number, provider: Partial<SmsProvider>): Promise<SmsProvider> => {
    return apiRequest<SmsProvider>('PUT', `/api/admin/settings/sms-providers/${id}`, provider);
  },

  // Test SMS gönder
  testSms: async (): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>('POST', '/api/admin/settings/sms-providers/test');
  },

  // Bakım modunu aç/kapat
  toggleMaintenanceMode: async (enabled: boolean): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>('POST', '/api/admin/settings/maintenance-mode', { enabled });
  },

  // Sistem sağlığını kontrol et
  checkSystemHealth: async (): Promise<{ health: number; issues: string[] }> => {
    return apiRequest<{ health: number; issues: string[] }>('GET', '/api/admin/settings/system-health');
  }
};
