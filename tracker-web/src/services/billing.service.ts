import { apiClient } from './apiClient'
import type {
  Invoice,
  BillingFilters,
  PagedResult,
} from '@/types/api.types'

const BASE_URL = '/api/superadmin'

export const billingService = {
  /**
   * Get paginated list of invoices
   */
  async getInvoices(filters?: BillingFilters): Promise<PagedResult<Invoice>> {
    const params = new URLSearchParams()
    
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.tenantId) params.append('tenantId', filters.tenantId.toString())
    if (filters?.status) params.append('status', filters.status)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)

    const response = await apiClient.get<any>(
      `${BASE_URL}/billing/invoices?${params.toString()}`
    )
    
    // Transform PascalCase (backend) to camelCase (frontend)
    const data = response.data
    const rawItems = data.Items || data.items || []
    
    // Transform each invoice object
    const transformedItems = rawItems.map((invoice: any) => ({
      id: invoice.Id || invoice.id,
      invoiceNumber: invoice.InvoiceNumber || invoice.invoiceNumber,
      tenantId: invoice.TenantId || invoice.tenantId,
      tenantName: invoice.TenantName || invoice.tenantName,
      subscriptionPlanId: invoice.SubscriptionPlanId || invoice.subscriptionPlanId,
      subscriptionPlanName: invoice.SubscriptionPlanName || invoice.subscriptionPlanName,
      billingPeriod: invoice.BillingPeriod || invoice.billingPeriod,
      issueDate: invoice.IssueDate || invoice.issueDate,
      dueDate: invoice.DueDate || invoice.dueDate,
      paidDate: invoice.PaidDate || invoice.paidDate,
      amount: invoice.Amount || invoice.amount,
      tax: invoice.Tax || invoice.tax,
      total: invoice.Total || invoice.total,
      status: invoice.Status ?? invoice.status,
      customerName: invoice.CustomerName || invoice.customerName,
      customerEmail: invoice.CustomerEmail || invoice.customerEmail,
      items: invoice.Items || invoice.items,
      notes: invoice.Notes || invoice.notes,
      createdAt: invoice.CreatedAt || invoice.createdAt,
    }))
    
    return {
      items: transformedItems,
      totalCount: data.TotalCount || data.totalCount || 0,
      page: data.Page || data.page || 1,
      pageSize: data.PageSize || data.pageSize || 10,
      totalPages: data.TotalPages || data.totalPages || 0,
    }
  },

  /**
   * Get single invoice by ID
   */
  async getInvoice(id: number): Promise<Invoice> {
    const response = await apiClient.get<Invoice>(`${BASE_URL}/billing/invoices/${id}`)
    return response.data
  },

  /**
   * Create new invoice
   */
  async createInvoice(data: Partial<Invoice>): Promise<Invoice> {
    const response = await apiClient.post<Invoice>(`${BASE_URL}/billing/invoices`, data)
    return response.data
  },

  /**
   * Mark invoice as paid
   */
  async markAsPaid(id: number): Promise<void> {
    await apiClient.post(`${BASE_URL}/billing/invoices/${id}/mark-paid`)
  },

  /**
   * Cancel invoice
   */
  async cancelInvoice(id: number): Promise<void> {
    await apiClient.post(`${BASE_URL}/billing/invoices/${id}/cancel`)
  },

  /**
   * Get billing summary
   */
  async getBillingSummary(): Promise<any> {
    const response = await apiClient.get(`${BASE_URL}/billing/summary`)
    return response.data
  },

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(startDate: string, endDate: string): Promise<any> {
    const response = await apiClient.get(
      `${BASE_URL}/billing/revenue?startDate=${startDate}&endDate=${endDate}`
    )
    return response.data
  },
}

