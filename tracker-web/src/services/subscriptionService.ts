import { apiRequest } from './apiService'

// Subscription plan limits interface
export interface SubscriptionLimits {
  users: number;
  facilities: number;
  api_calls: number;
  storage_gb: number;
}

// Subscription plan interface
export interface SubscriptionPlan {
  id: number;
  type: string;
  name: string;
  description: string;
  monthlyFee: number;
  features: string[];
  limits: SubscriptionLimits;
  currency: string;
  isActive: boolean;
  isDefault?: boolean;
  isPopular?: boolean;
  badgeText?: string;
  badgeColor?: string;
}

// Tenant subscription info interface
export interface TenantSubscriptionInfo {
  tenantId: number;
  subscriptionType: string;
  subscriptionStartDate: string;
  subscriptionEndDate?: string;
  maxUsers: number;
  maxFacilities: number;
  monthlyFee: number;
  currency: string;
  paymentStatus: string;
  lastPayment?: string;
  currentUsage: {
    users: number;
    facilities: number;
    apiCalls: number;
    storageUsed: number;
  };
  subscriptionPlan: SubscriptionPlan;
}

export const subscriptionService = {
  // Tenant'ın subscription plan bilgilerini al
  getTenantSubscriptionInfo: async (tenantId: number): Promise<TenantSubscriptionInfo> => {
    return apiRequest<TenantSubscriptionInfo>('GET', `/api/tenant/${tenantId}/subscription`);
  },

  // Tenant'ın subscription plan'ını güncelle
  updateTenantSubscription: async (tenantId: number, planType: string): Promise<TenantSubscriptionInfo> => {
    return apiRequest<TenantSubscriptionInfo>('PUT', `/api/tenant/${tenantId}/subscription`, { planType });
  },

  // Tenant'ın kullanım istatistiklerini al
  getTenantUsageStats: async (tenantId: number): Promise<{
    users: number;
    facilities: number;
    apiCalls: number;
    storageUsed: number;
    lastUpdated: string;
  }> => {
    return apiRequest<any>('GET', `/api/tenant/${tenantId}/usage-stats`);
  },

  // Mevcut subscription plan'ları listele
  getAvailablePlans: async (): Promise<SubscriptionPlan[]> => {
    return apiRequest<SubscriptionPlan[]>('GET', '/api/subscription-plans');
  },

  // Plan karşılaştırması
  comparePlans: async (): Promise<{
    plans: SubscriptionPlan[];
    comparison: {
      feature: string;
      basic: boolean;
      standard: boolean;
      premium: boolean;
    }[];
  }> => {
    return apiRequest<any>('GET', '/api/subscription-plans/compare');
  },

  // Plan yükseltme/düşürme
  changePlan: async (tenantId: number, newPlanType: string): Promise<{
    success: boolean;
    message: string;
    newPlan: SubscriptionPlan;
    effectiveDate: string;
  }> => {
    return apiRequest<any>('POST', `/api/tenant/${tenantId}/change-plan`, { newPlanType });
  },

  // Fatura geçmişi
  getBillingHistory: async (tenantId: number): Promise<{
    invoices: Array<{
      id: number;
      invoiceNumber: string;
      amount: number;
      currency: string;
      status: string;
      dueDate: string;
      paidDate?: string;
      planType: string;
    }>;
    totalPaid: number;
    totalPending: number;
  }> => {
    return apiRequest<any>('GET', `/api/tenant/${tenantId}/billing-history`);
  },

  // Ödeme yöntemi yönetimi
  getPaymentMethods: async (tenantId: number): Promise<{
    methods: Array<{
      id: number;
      type: string;
      last4?: string;
      expiryDate?: string;
      isDefault: boolean;
    }>;
  }> => {
    return apiRequest<any>('GET', `/api/tenant/${tenantId}/payment-methods`);
  },

  // Kullanım limitleri kontrolü
  checkUsageLimits: async (tenantId: number): Promise<{
    users: { current: number; limit: number; remaining: number; percentage: number };
    facilities: { current: number; limit: number; remaining: number; percentage: number };
    apiCalls: { current: number; limit: number; remaining: number; percentage: number };
    storage: { current: number; limit: number; remaining: number; percentage: number };
  }> => {
    return apiRequest<any>('GET', `/api/tenant/${tenantId}/usage-limits`);
  }
}
