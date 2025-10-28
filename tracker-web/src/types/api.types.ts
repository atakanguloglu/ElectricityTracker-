// ==================== Common Types ====================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
  statusCode: number
  timestamp: string
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ==================== Tenant Types ====================

export interface Tenant {
  id: number
  companyName: string
  facilityCode: string
  domain: string
  adminEmail: string
  status: 'Active' | 'Suspended' | 'Trial' | 'Expired'
  subscription: 'Free' | 'Basic' | 'Professional' | 'Enterprise'
  userCount: number
  facilityCount: number
  createdAt: string
  lastLogin?: string
  licenseExpiry?: string
  totalConsumption: number
  paymentStatus: 'Paid' | 'Pending' | 'Overdue'
  currency: string
  language: string
  logo?: string
  monthlyFee: number
  lastPayment?: string
}

export interface CreateTenantDto {
  companyName: string
  facilityCode: string
  domain: string
  adminEmail: string
  subscription: string
  subscriptionEndDate: string
  monthlyFee: number
  currency: string
  language: string
  logo?: string
  createAdminUser: boolean
  adminPassword?: string
}

export interface UpdateTenantDto {
  companyName?: string
  domain?: string
  adminEmail?: string
  subscription?: string
  subscriptionEndDate?: string
  status?: string
  monthlyFee?: number
  currency?: string
  language?: string
  logo?: string
}

export interface TenantFilters extends PaginationParams {
  status?: string
  subscription?: string
}

// ==================== User Types ====================

export interface User {
  id: number
  firstName: string
  lastName: string
  fullName?: string
  username?: string
  email: string
  role: 'SuperAdmin' | 'Admin' | 'Manager' | 'User' | 'Viewer'
  roleName?: string
  tenantId: number
  tenantName: string
  isActive: boolean
  isLocked?: boolean
  phone?: string
  department?: string
  position?: string
  lastLoginAt?: string
  lastLogin?: string
  loginCount?: number
  passwordHash?: string
  createdAt: string
  // Backend PascalCase support
  Id?: number
  FirstName?: string
  LastName?: string
  FullName?: string
  Username?: string
  Email?: string
  Role?: 'SuperAdmin' | 'Admin' | 'Manager' | 'User' | 'Viewer'
  RoleName?: string
  TenantId?: number
  IsLocked?: boolean
  LastLogin?: string
  LoginCount?: number
  PasswordHash?: string
  TenantName?: string
  IsActive?: boolean
  Phone?: string
  Department?: string
  Position?: string
  LastLoginAt?: string
  CreatedAt?: string
}

export interface CreateUserDto {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
  tenantId: number
  phone?: string
  department?: string
  departmentId?: number
  position?: string
  isActive: boolean
}

export interface UpdateUserDto {
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  phone?: string
  department?: string
  departmentId?: number
  position?: string
  isActive?: boolean
  isLocked?: boolean
}

export interface UserFilters extends PaginationParams {
  tenantId?: number
  role?: string
  isActive?: boolean
  isLocked?: boolean
  search?: string
}

// ==================== Billing Types ====================

export interface Invoice {
  id: number
  tenantId: number
  tenantName: string
  invoiceNumber: string
  amount: number
  currency: string
  status: 'Paid' | 'Pending' | 'Overdue' | 'Cancelled'
  issueDate: string
  dueDate: string
  paidDate?: string
  description?: string
}

export interface BillingFilters extends PaginationParams {
  tenantId?: number
  status?: string
  startDate?: string
  endDate?: string
}

// ==================== Monitoring Types ====================

export interface SystemStats {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkUsage: number
  databaseConnections: number
  activeSessions: number
}

export interface SystemLog {
  id: number
  level: 'Info' | 'Warning' | 'Error' | 'Debug'
  message: string
  source: string
  timestamp: string
  userId?: number
  tenantId?: number
  additionalData?: any
}

export interface LogFilters extends PaginationParams {
  level?: string
  source?: string
  startDate?: string
  endDate?: string
  tenantId?: number
  userId?: number
}

// ==================== Security Types ====================

export interface SecurityEvent {
  id: number
  eventType: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  description: string
  ipAddress?: string
  userId?: number
  tenantId?: number
  timestamp: string
}

export interface SecurityFilters extends PaginationParams {
  eventType?: string
  severity?: string
  startDate?: string
  endDate?: string
}

// ==================== Analytics Types ====================

export interface DashboardStats {
  totalTenants: number
  activeTenants: number
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  monthlyRevenue: number
  totalConsumption: number
  systemHealth: number
  totalLogs: number
  todayLogs: number
  securityScore: number
}

export interface TenantGrowth {
  date: string
  count: number
  type: 'new' | 'churned' | 'active'
}

export interface RevenueData {
  date: string
  amount: number
  currency: string
}

// ==================== Subscription Plans ====================

export interface SubscriptionPlan {
  id: number
  name: string
  description: string
  price: number
  currency: string
  billingPeriod: 'Monthly' | 'Yearly'
  maxUsers: number
  maxFacilities: number
  features: string[]
  isActive: boolean
}

// ==================== File Upload ====================

export interface UploadResponse {
  fileName: string
  fileUrl: string
  fileSize: number
  contentType: string
}

// ==================== Export ====================

export interface ExportOptions {
  format: 'excel' | 'pdf' | 'csv'
  fileName?: string
  includeHeaders?: boolean
  columns?: string[]
}

