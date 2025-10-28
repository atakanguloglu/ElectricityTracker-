import { apiClient } from './apiClient'
import type {
  Tenant,
  CreateTenantDto,
  UpdateTenantDto,
  TenantFilters,
  PagedResult,
  ApiResponse,
} from '@/types/api.types'

const BASE_URL = '/api/superadmin'

export const tenantService = {
  /**
   * Get paginated list of tenants
   */
  async getTenants(filters?: TenantFilters): Promise<PagedResult<Tenant>> {
    const params = new URLSearchParams()
    
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.subscription) params.append('subscription', filters.subscription)

    const response = await apiClient.get<any>(
      `${BASE_URL}/tenants?${params.toString()}`
    )
    
    // Transform PascalCase (backend) to camelCase (frontend)
    const data = response.data
    const rawItems = data.Items || data.items || []
    
    // Transform each tenant object from PascalCase to camelCase
    const items = rawItems.map((t: any) => ({
      id: t.Id || t.id,
      companyName: t.CompanyName || t.companyName,
      facilityCode: t.FacilityCode || t.facilityCode,
      domain: t.Domain || t.domain,
      adminEmail: t.AdminEmail || t.adminEmail,
      status: t.Status || t.status,
      subscription: t.Subscription || t.subscription,
      userCount: t.UserCount || t.userCount,
      facilityCount: t.FacilityCount || t.facilityCount,
      createdAt: t.CreatedAt || t.createdAt,
      lastLogin: t.LastLogin || t.lastLogin,
      licenseExpiry: t.LicenseExpiry || t.licenseExpiry,
      totalConsumption: t.TotalConsumption || t.totalConsumption,
      paymentStatus: t.PaymentStatus || t.paymentStatus,
      currency: t.Currency || t.currency,
      language: t.Language || t.language,
      logo: t.Logo || t.logo,
      monthlyFee: t.MonthlyFee || t.monthlyFee,
      lastPayment: t.LastPayment || t.lastPayment,
    }))
    
    return {
      items,
      totalCount: data.TotalCount || data.totalCount || 0,
      page: data.Page || data.page || 1,
      pageSize: data.PageSize || data.pageSize || 10,
      totalPages: data.TotalPages || data.totalPages || 0,
    }
  },

  /**
   * Get single tenant by ID
   */
  async getTenant(id: number): Promise<Tenant> {
    const response = await apiClient.get<Tenant>(`${BASE_URL}/tenants/${id}`)
    return response.data
  },

  /**
   * Create new tenant
   */
  async createTenant(data: CreateTenantDto): Promise<Tenant> {
    const response = await apiClient.post<Tenant>(`${BASE_URL}/tenants`, data)
    return response.data
  },

  /**
   * Update existing tenant
   */
  async updateTenant(id: number, data: UpdateTenantDto): Promise<Tenant> {
    const response = await apiClient.put<Tenant>(`${BASE_URL}/tenants/${id}`, data)
    return response.data
  },

  /**
   * Delete tenant
   */
  async deleteTenant(id: number): Promise<void> {
    await apiClient.delete(`${BASE_URL}/tenants/${id}`)
  },

  /**
   * Suspend tenant
   */
  async suspendTenant(id: number, reason: string): Promise<void> {
    await apiClient.post(`${BASE_URL}/tenants/${id}/suspend`, { reason })
  },

  /**
   * Activate tenant
   */
  async activateTenant(id: number): Promise<void> {
    await apiClient.post(`${BASE_URL}/tenants/${id}/activate`)
  },

  /**
   * Get tenant statistics
   */
  async getTenantStats(id: number): Promise<any> {
    const response = await apiClient.get(`${BASE_URL}/tenants/${id}/stats`)
    return response.data
  },
}

