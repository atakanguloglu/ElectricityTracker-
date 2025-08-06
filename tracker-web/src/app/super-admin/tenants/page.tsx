'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Table,
  Button,
  Space,
  Tag,
  Statistic,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Divider,
  Spin,
  Alert,
  App
} from 'antd'
import { 
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  PlayCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  BuildOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  GlobalOutlined,
  FlagOutlined,
  GiftOutlined
} from '@ant-design/icons'
import { getUser, isAdmin, getFullName, apiRequest } from '@/utils/auth'
import { logger } from '@/utils/logger'

const { Title, Text } = Typography
const { Option } = Select

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5143/api'

// Types
interface Tenant {
  id?: number
  Id?: number
  companyName?: string
  CompanyName?: string
  facilityCode?: string
  FacilityCode?: string
  domain?: string
  Domain?: string
  adminEmail?: string
  AdminEmail?: string
  status?: string
  Status?: string
  subscription?: string
  Subscription?: string
  userCount?: number
  UserCount?: number
  facilityCount?: number
  FacilityCount?: number
  createdAt?: string
  CreatedAt?: string
  lastLogin?: string
  LastLogin?: string
  licenseExpiry?: string
  LicenseExpiry?: string
  totalConsumption?: string
  TotalConsumption?: string
  paymentStatus?: string
  PaymentStatus?: string
  currency?: string
  Currency?: string
  language?: string
  Language?: string
  logo?: string
  Logo?: string
  monthlyFee?: number
  MonthlyFee?: number
  lastPayment?: string
  LastPayment?: string
}

interface CreateTenantDto {
  companyName: string
  facilityCode: string
  domain: string
  adminEmail: string
  subscription: string
  currency: string
  language: string
  autoCreateAdmin: boolean
}

interface UpdateTenantDto {
  companyName: string
  facilityCode: string
  domain: string
  adminEmail: string
  subscription: string
  currency: string
  language: string
}

interface PagedResult<T> {
  items?: T[]
  Items?: T[] // C# JSON serialization için
  totalCount?: number
  TotalCount?: number // C# JSON serialization için
  page?: number
  Page?: number // C# JSON serialization için
  pageSize?: number
  PageSize?: number // C# JSON serialization için
  totalPages?: number
  TotalPages?: number // C# JSON serialization için
}

export default function AdminTenantsPage() {
  const { message } = App.useApp()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add')
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [form] = Form.useForm()
  
  // Delete confirmation modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null)
  
  // Suspend confirmation modal
  const [suspendModalVisible, setSuspendModalVisible] = useState(false)
  const [tenantToSuspend, setTenantToSuspend] = useState<Tenant | null>(null)
  const router = useRouter()
  
  // Yeni state'ler
  const [currencies, setCurrencies] = useState<any[]>([])
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([])
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [subscriptionForm] = Form.useForm()

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  // Fetch tenants on component mount
  useEffect(() => {
    fetchTenants()
    fetchCurrencies()
    fetchSubscriptionPlans()
  }, [pagination.current, pagination.pageSize])

  const fetchTenants = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: pagination.current.toString(),
        pageSize: pagination.pageSize.toString()
      })

      console.log('Fetching tenants from:', `${API_BASE_URL}/admin/tenants?${params}`)

      const response = await apiRequest(`${API_BASE_URL}/admin/tenants?${params}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Tenants API Error Response:', errorText)
        throw new Error(`Tenant listesi alınamadı (${response.status}): ${errorText}`)
      }
      
      const data: PagedResult<Tenant> = await response.json()
      
      console.log('Tenants API Response:', data)
      
      // data.Items veya data.items'ın undefined olup olmadığını kontrol et (C# JSON serialization)
      const items = data.Items || data.items
      if (!data || !items) {
        console.error('Tenants API response is missing items:', data)
        setTenants([])
        setPagination(prev => ({
          ...prev,
          total: 0
        }))
        return
      }
      
      setTenants(items)
      setPagination(prev => ({
        ...prev,
        total: data.TotalCount || data.totalCount || 0
      }))
    } catch (err) {
      console.error('Tenant fetch error:', err)
      
      // Network hatası kontrolü
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('API sunucusuna bağlanılamıyor. Lütfen API\'nin çalıştığından emin olun.')
      } else {
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata oluştu')
      }
      
      // Hata durumunda tenants'ı boş array yap
      setTenants([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCurrencies = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/currencies`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Currencies API Error Response:', errorText)
        throw new Error(`Para birimleri alınamadı (${response.status}): ${errorText}`)
      }
      const data = await response.json()
      
      if (!data) {
        console.error('Currencies API response is missing data:', data)
        setCurrencies([])
        return
      }
      
      setCurrencies(data)
    } catch (err) {
      console.error('Currency fetch error:', err)
      setCurrencies([])
    }
  }

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/subscription-plans`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Subscription Plans API Error Response:', errorText)
        throw new Error(`Abonelik planları alınamadı (${response.status}): ${errorText}`)
      }
      const data = await response.json()
      
      if (!data) {
        console.error('Subscription Plans API response is missing data:', data)
        setSubscriptionPlans([])
        return
      }
      
      setSubscriptionPlans(data)
    } catch (err) {
      console.error('Subscription plans fetch error:', err)
      setSubscriptionPlans([])
    }
  }

  const generateFacilityCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    let result = ''

    // 3 harf
    for (let i = 0; i < 3; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    // 3 rakam
    for (let i = 0; i < 3; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length))
    }

    return result
  }

  const handleAddTenant = () => {
    setModalType('add')
    setSelectedTenant(null)
    form.resetFields()
    // Otomatik tesis kodu oluştur
    form.setFieldsValue({
      facilityCode: generateFacilityCode()
    })
    setModalVisible(true)
  }

  const handleEditTenant = (tenant: Tenant) => {
    setModalType('edit')
    setSelectedTenant(tenant)
    form.setFieldsValue({
      companyName: tenant.companyName,
      facilityCode: tenant.facilityCode,
      domain: tenant.domain,
      adminEmail: tenant.adminEmail,
      subscription: tenant.subscription,
      currency: tenant.currency,
      language: tenant.language
    })
    setModalVisible(true)
  }

  const handleViewTenant = (tenant: Tenant) => {
    setModalType('view')
    setSelectedTenant(tenant)
    form.setFieldsValue({
      companyName: tenant.companyName,
      facilityCode: tenant.facilityCode,
      domain: tenant.domain,
      adminEmail: tenant.adminEmail,
      subscription: tenant.subscription,
      currency: tenant.currency,
      language: tenant.language
    })
    setModalVisible(true)
  }

  const handleDeleteTenant = (tenant: Tenant) => {
    setTenantToDelete(tenant)
    setDeleteModalVisible(true)
  }

  const confirmDeleteTenant = async () => {
    if (!tenantToDelete) return
    
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/tenants/${tenantToDelete.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Tenant silinemedi')

      message.success('Tenant başarıyla silindi')
      setDeleteModalVisible(false)
      setTenantToDelete(null)
      fetchTenants() // Refresh list
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Tenant silinirken hata oluştu')
      console.error('Delete tenant error:', err)
    }
  }

  const handleAccessTenant = async (tenant: Tenant) => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/tenants/${tenant.id}/access`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Tenant erişimi sağlanamadı')
      
      const accessData = await response.json()
      message.success(`${tenant.companyName} paneline yönlendiriliyorsunuz...`)
      
      // Yeni sekmede tenant paneline aç
      window.open(accessData.accessUrl, '_blank')
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Tenant erişimi sağlanırken hata oluştu')
      console.error('Tenant access error:', err)
    }
  }

  const handleToggleTenantStatus = async (tenant: Tenant) => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/tenants/${tenant.id}/toggle-status`, {
        method: 'POST'
      })

      if (!response.ok) throw new Error('Tenant durumu güncellenemedi')

      const data = await response.json()
      message.success(data.message)
      fetchTenants() // Listeyi yenile
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Tenant durumu güncellenirken hata oluştu')
      console.error('Toggle tenant status error:', err)
    }
  }

  const handleSuspendTenant = (tenant: Tenant) => {
    setTenantToSuspend(tenant)
    setSuspendModalVisible(true)
  }

  const confirmSuspendTenant = async () => {
    if (!tenantToSuspend) return
    
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/tenants/${tenantToSuspend.id}/suspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'Admin tarafından askıya alındı' })
      })

      if (!response.ok) throw new Error('Tenant askıya alınamadı')

      const data = await response.json()
      message.success(data.message)
      setSuspendModalVisible(false)
      setTenantToSuspend(null)
      fetchTenants() // Listeyi yenile
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Tenant askıya alınırken hata oluştu')
      console.error('Suspend tenant error:', err)
    }
  }

  const handleActivateTenant = async (tenant: Tenant) => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/tenants/${tenant.id}/activate`, {
        method: 'POST'
      })

      if (!response.ok) throw new Error('Tenant aktifleştirilemedi')

      const data = await response.json()
      message.success(data.message)
      fetchTenants() // Listeyi yenile
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Tenant aktifleştirilirken hata oluştu')
      console.error('Activate tenant error:', err)
    }
  }

  const handleManageSubscriptions = () => {
    router.push('/admin/subscription-plans')
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()

      if (modalType === 'add') {
        const createDto: CreateTenantDto = {
          ...values,
          autoCreateAdmin: true
        }

        const response = await apiRequest(`${API_BASE_URL}/admin/tenants`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(createDto)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Tenant oluşturulamadı')
        }

        const newTenant = await response.json()
        message.success('Tenant başarıyla oluşturuldu')
        setModalVisible(false)
        fetchTenants() // Refresh list
      } else if (modalType === 'edit' && selectedTenant) {
        const updateDto: UpdateTenantDto = values

        const response = await apiRequest(`${API_BASE_URL}/admin/tenants/${selectedTenant.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateDto)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Tenant güncellenemedi')
        }

        const updatedTenant = await response.json()
        message.success('Tenant başarıyla güncellendi')
        setModalVisible(false)
        fetchTenants() // Refresh list
      }
    } catch (err) {
      console.error('Modal operation error:', err)
      
      if (err instanceof Error) {
        if (err.message.includes('validation')) {
          // Form validation error - don't show message
          return
        }
        message.error(err.message)
      } else {
        message.error('İşlem sırasında hata oluştu')
      }
    }
  }

  const getStatusColor = (status: string) => {
    if (!status) return 'default'
    switch (status.toLowerCase()) {
      case 'active': return 'success'
      case 'suspended': return 'warning'
      case 'expired': return 'error'
      case 'pending': return 'processing'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    if (!status) return <ClockCircleOutlined />
    switch (status.toLowerCase()) {
      case 'active': return <CheckCircleOutlined />
      case 'suspended': return <StopOutlined />
      case 'expired': return <ClockCircleOutlined />
      case 'pending': return <ClockCircleOutlined />
      default: return <ClockCircleOutlined />
    }
  }

  const getSubscriptionColor = (subscription: string) => {
    if (!subscription) return 'default'
    switch (subscription.toLowerCase()) {
      case 'premium': return 'purple'
      case 'standard': return 'blue'
      case 'basic': return 'green'
      default: return 'default'
    }
  }

  // Tenant statistics
  const tenantStatCards = [
    {
      title: 'Toplam Tenant',
      value: tenants?.length || 0,
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
    },
    {
      title: 'Aktif Tenant',
      value: tenants?.filter(t => (t.status || t.Status) === 'Active').length || 0,
      icon: <CheckCircleOutlined style={{ fontSize: '24px', color: '#10b981' }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)'
    },
    {
      title: 'Toplam Kullanıcı',
      value: tenants?.reduce((sum, t) => sum + (t.userCount || t.UserCount || 0), 0) || 0,
      icon: <UserOutlined style={{ fontSize: '24px', color: '#8b5cf6' }} />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    },
    {
      title: 'Toplam Tesis',
      value: tenants?.reduce((sum, t) => sum + (t.facilityCount || t.FacilityCount || 0), 0) || 0,
      icon: <BuildOutlined style={{ fontSize: '24px', color: '#f59e0b' }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    }
  ]

  // Table columns
  const columns = [
    {
      title: 'Şirket Adı',
      key: 'companyName',
      render: (record: Tenant) => <Text strong>{record.companyName || record.CompanyName || '-'}</Text>
    },
    {
      title: 'Tesis Kodu',
      key: 'facilityCode',
      render: (record: Tenant) => (
        <Tag color="blue" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
          {record.facilityCode || record.FacilityCode || '-'}
        </Tag>
      )
    },
    {
      title: 'Domain',
      key: 'domain',
      render: (record: Tenant) => <Text code>{record.domain || record.Domain || '-'}</Text>
    },
    {
      title: 'Admin Email',
      key: 'adminEmail',
      render: (record: Tenant) => <Text>{record.adminEmail || record.AdminEmail || '-'}</Text>
    },
    {
      title: 'Durum',
      key: 'status',
      render: (record: Tenant) => {
        const status = record.status || record.Status || ''
        const paymentStatus = record.paymentStatus || record.PaymentStatus || ''
        return (
          <Space direction="vertical" size="small">
            <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
              {status === 'Active' ? 'Aktif' : 
               status === 'Suspended' ? 'Askıya Alınmış' :
               status === 'Expired' ? 'Süresi Dolmuş' :
               status === 'Pending' ? 'Beklemede' : status}
            </Tag>
            <Tag 
              color={paymentStatus === 'Overdue' ? 'error' : 
                     paymentStatus === 'Paid' ? 'success' : 
                     paymentStatus === 'Pending' ? 'warning' : 'default'}
              style={{ fontSize: '10px' }}
            >
              {paymentStatus === 'Overdue' ? 'Ödeme Gecikmiş' :
               paymentStatus === 'Paid' ? 'Ödendi' :
               paymentStatus === 'Pending' ? 'Beklemede' :
               paymentStatus === 'Cancelled' ? 'İptal' : paymentStatus}
            </Tag>
          </Space>
        )
      }
    },
    {
      title: 'Paket',
      key: 'subscription',
      render: (record: Tenant) => {
        const subscription = record.subscription || record.Subscription || ''
        return (
          <Tag color={getSubscriptionColor(subscription)}>
            {subscription === 'Premium' ? 'Premium' :
             subscription === 'Standard' ? 'Standard' :
             subscription === 'Basic' ? 'Basic' : subscription}
          </Tag>
        )
      }
    },
    {
      title: 'Kullanıcı Sayısı',
      key: 'userCount',
      render: (record: Tenant) => {
        const count = record.userCount || record.UserCount || 0
        return (
          <div className="flex items-center">
            <UserOutlined style={{ marginRight: '4px', color: '#8b5cf6' }} />
            <Text>{count}</Text>
          </div>
        )
      }
    },
    {
      title: 'Tesis Sayısı',
      key: 'facilityCount',
      render: (record: Tenant) => {
        const count = record.facilityCount || record.FacilityCount || 0
        return (
          <div className="flex items-center">
            <BuildOutlined style={{ marginRight: '4px', color: '#f59e0b' }} />
            <Text>{count}</Text>
          </div>
        )
      }
    },
    {
      title: 'Oluşturulma Tarihi',
      key: 'createdAt',
      render: (record: Tenant) => {
        const date = record.createdAt || record.CreatedAt
        return (
          <div className="flex items-center">
            <CalendarOutlined style={{ marginRight: '4px', color: '#10b981' }} />
            <Text>{date ? new Date(date).toLocaleDateString('tr-TR') : 'Invalid Date'}</Text>
          </div>
        )
      }
    },
    {
      title: 'Son Giriş',
      key: 'lastLogin',
      render: (record: Tenant) => {
        const date = record.lastLogin || record.LastLogin
        return (
          <div className="flex items-center">
            <ClockCircleOutlined style={{ marginRight: '4px', color: '#3b82f6' }} />
            <Text>{date ? new Date(date).toLocaleString('tr-TR') : 'Hiç giriş yapmamış'}</Text>
          </div>
        )
      }
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: any, record: Tenant) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewTenant(record)}
            title="Görüntüle"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditTenant(record)}
            title="Düzenle"
          />
          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={() => handleAccessTenant(record)}
            title="Tenant Paneline Gir"
            style={{ color: '#8b5cf6' }}
          />
          {/* Durum Toggle Butonu */}
          <Button
            type="text"
            icon={(record.status || record.Status) === 'Active' ? <StopOutlined /> : <PlayCircleOutlined />}
            onClick={() => handleToggleTenantStatus(record)}
            style={{ 
              color: (record.status || record.Status) === 'Active' ? '#f59e0b' : '#10b981' 
            }}
            title={(record.status || record.Status) === 'Active' ? 'Pasifleştir' : 'Aktifleştir'}
          />
          
          {/* Manuel Askıya Alma (Detaylı) */}
          {(record.status || record.Status) === 'Active' && (
            <Button
              type="text"
              icon={<StopOutlined />}
              style={{ color: '#dc2626' }}
              title="Askıya Al (Detaylı)"
              onClick={() => handleSuspendTenant(record)}
            />
          )}
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            title="Sil"
            onClick={() => handleDeleteTenant(record)}
          />
        </Space>
      )
    }
  ]

  // Loading state
  if (loading && (!tenants || tenants.length === 0)) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '20px' }}>Tenant listesi yükleniyor...</div>
      </div>
    )
  }

  // Error state
  if (error && (!tenants || tenants.length === 0)) {
    return (
      <Alert
        message="Hata"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={fetchTenants}>
            Tekrar Dene
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <Title level={2} className="mb-2 flex items-center">
          <TeamOutlined className="mr-3 text-blue-600" />
          Tenant Yönetimi
        </Title>
        <Text className="text-gray-600">
          Sistem tenant'larını yönetin, ekleyin ve düzenleyin.
        </Text>
      </div>

      {/* Enhanced Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        {tenantStatCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card 
              className="stat-card"
              style={{
                background: stat.gradient,
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div className="stat-card-content">
                <div className="stat-icon">
                  {stat.icon}
                </div>
                <div className="stat-info">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-title">{stat.title}</div>
                </div>
              </div>
              <div className="stat-card-overlay"></div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Tenants Table */}
      <Card 
        title="Tenant Listesi"
                extra={
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddTenant}
            >
              Yeni Tenant Ekle
            </Button>
            <Button 
              icon={<GiftOutlined />} 
              onClick={handleManageSubscriptions}
            >
              Paket Yönetimi
            </Button>
          </Space>
        }
        className="shadow-sm"
      >
        <Table
          columns={columns}
          dataSource={tenants || []}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} / ${total} tenant`
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* Add/Edit/View Modal */}
      <Modal
        title={
          modalType === 'add' ? 'Yeni Tenant Ekle' :
          modalType === 'edit' ? 'Tenant Düzenle' : 'Tenant Detayları'
        }
        open={modalVisible}
        onOk={modalType !== 'view' ? handleModalOk : undefined}
        onCancel={() => setModalVisible(false)}
        width="90%"
        okText={modalType === 'add' ? 'Ekle' : 'Güncelle'}
        cancelText="İptal"
                  styles={{
            mask: { zIndex: 999 },
            wrapper: { zIndex: 1000 }
          }}
          centered
          destroyOnHidden
          getContainer={() => document.body}
      >
        <Form
          form={form}
          layout="vertical"
          disabled={modalType === 'view'}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="companyName"
                label="Şirket Adı"
                rules={[{ required: true, message: 'Şirket adı gerekli' }]}
              >
                <Input placeholder="Şirket adını girin" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="facilityCode"
                label="Tesis Kodu"
                rules={[
                  { required: true, message: 'Tesis kodu gerekli' },
                  { pattern: /^[A-Z]{3}\d{3}$/, message: 'Format: ABC123 (3 harf + 3 rakam)' },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve()
                      
                      const existingTenant = tenants?.find(t => 
                        t.facilityCode === value && 
                        (!selectedTenant || t.id !== selectedTenant.id)
                      )
                      
                      if (existingTenant) {
                        return Promise.reject(new Error('Bu tesis kodu zaten kullanılıyor'))
                      }
                      
                      return Promise.resolve()
                    }
                  }
                ]}
                tooltip="Kurumların giriş yaparken kullanacağı benzersiz kod"
              >
                <Input 
                  placeholder="ABC123" 
                  style={{ fontFamily: 'monospace' }}
                  maxLength={6}
                  suffix={
                    <Button
                      type="text"
                      size="small"
                      onClick={() => form.setFieldsValue({ facilityCode: generateFacilityCode() })}
                      style={{ marginRight: -7 }}
                    >
                      🔄
                    </Button>
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          
                    <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="domain"
                label="Domain"
                rules={[{ required: true, message: 'Domain gerekli' }]}
              >
                <Input placeholder="example.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="adminEmail"
                label="Admin Email"
                rules={[
                  { required: true, message: 'Admin email gerekli' },
                  { type: 'email', message: 'Geçerli email adresi girin' }
                ]}
              >
                <Input placeholder="admin@example.com" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="subscription"
                label="Abonelik"
                rules={[{ required: true, message: 'Abonelik seçin' }]}
              >
                <Select 
                  placeholder="Abonelik seçin"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                  optionFilterProp="children"
                  styles={{
                    popup: {
                      root: { zIndex: 1050 }
                    }
                  }}
                  getPopupContainer={(triggerNode) => document.body}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {subscriptionPlans?.map(plan => (
                    <Option key={plan.type} value={plan.type}>
                      {plan.name} ({plan.currency === 'TRY' ? '₺' : plan.currency === 'USD' ? '$' : plan.currency === 'EUR' ? '€' : plan.currency}{plan.monthlyFee}/ay)
                    </Option>
                  )) || []}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="currency"
                label="Para Birimi"
                rules={[{ required: true, message: 'Para birimi seçin' }]}
              >
                <Select 
                  placeholder="Para birimi seçin"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                  optionFilterProp="children"
                  styles={{
                    popup: {
                      root: { zIndex: 1050 }
                    }
                  }}
                  getPopupContainer={(triggerNode) => document.body}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {currencies?.map(currency => (
                    <Option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </Option>
                  )) || []}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="language"
                label="Dil"
                rules={[{ required: true, message: 'Dil seçin' }]}
              >
                <Select 
                  placeholder="Dil seçin"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                  optionFilterProp="children"
                  styles={{
                    popup: {
                      root: { zIndex: 1050 }
                    }
                  }}
                  getPopupContainer={(triggerNode) => document.body}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Option value="tr">Türkçe</Option>
                  <Option value="en">English</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="licenseExpiry"
                label="Lisans Bitiş Tarihi"
                rules={[{ required: true, message: 'Lisans bitiş tarihi gerekli' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="logo"
                label="Logo URL"
              >
                <Input placeholder="https://example.com/logo.png" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="autoCreateAdmin"
                label="Admin Kullanıcısı Oluştur"
                valuePropName="checked"
              >
                <Select 
                  placeholder="Admin kullanıcısı oluşturulsun mu?"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                  optionFilterProp="children"
                  styles={{
                    popup: {
                      root: { zIndex: 1050 }
                    }
                  }}
                  getPopupContainer={(triggerNode) => document.body}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Option value={true}>Evet, otomatik oluştur</Option>
                  <Option value={false}>Hayır, manuel oluştur</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="adminPassword"
                label="Admin Şifresi"
                rules={[
                  { required: true, message: 'Admin şifresi gerekli' },
                  { min: 6, message: 'Şifre en az 6 karakter olmalı' }
                ]}
              >
                <Input.Password placeholder="Güçlü şifre girin" />
              </Form.Item>
            </Col>
          </Row>

          {modalType === 'view' && selectedTenant && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Oluşturulma Tarihi">
                  <Text>{selectedTenant.createdAt}</Text>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Son Giriş">
                  <Text>{selectedTenant.lastLogin || 'Henüz giriş yapılmadı'}</Text>
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Modal>

      <style jsx>{`
        .tenants-container {
          padding: 0;
        }
        
        /* Enhanced Statistics Cards */
        .stat-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15) !important;
        }
        
        .stat-card-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          color: white;
        }
        
        .stat-icon {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 12px;
          backdrop-filter: blur(10px);
        }
        
        .stat-info {
          text-align: right;
        }
        
        .stat-value {
          font-size: 28px;
          font-weight: bold;
          line-height: 1;
          margin-bottom: 4px;
        }
        
        .stat-title {
          font-size: 14px;
          opacity: 0.9;
          font-weight: 500;
        }
        
        .stat-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
          z-index: 1;
        }
        
        /* Responsive table styles */
        :global(.ant-table) {
          overflow-x: auto;
        }
        
        :global(.ant-table-thead > tr > th),
        :global(.ant-table-tbody > tr > td) {
          white-space: nowrap;
          min-width: 120px;
        }
        
        :global(.ant-table-thead > tr > th) {
          background: #f8fafc;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e2e8f0;
        }
        
        :global(.ant-table-tbody > tr:hover > td) {
          background: rgba(59, 130, 246, 0.05);
        }
        
        .action-button {
          transition: all 0.3s ease;
          border-radius: 6px;
        }
        
        .action-button:hover {
          transform: scale(1.1);
          background: rgba(59, 130, 246, 0.1);
        }
        
        .delete-button:hover {
          background: rgba(239, 68, 68, 0.1) !important;
        }
        
        .status-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .subscription-badge {
          font-weight: 600;
          border-radius: 6px;
        }
        
        @media (max-width: 768px) {
          :global(.ant-table-thead > tr > th),
          :global(.ant-table-tbody > tr > td) {
            min-width: 100px;
            font-size: 12px;
          }
        }
      `}</style>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Tenant Silme Onayı"
        open={deleteModalVisible}
        onOk={confirmDeleteTenant}
        onCancel={() => {
          setDeleteModalVisible(false)
          setTenantToDelete(null)
        }}
        okText="Evet, Sil"
        cancelText="İptal"
        okButtonProps={{ danger: true }}
        centered
        destroyOnHidden
        getContainer={() => document.body}
        width={500}
        style={{ zIndex: 1000 }}
        styles={{
          mask: { zIndex: 999 },
          wrapper: { zIndex: 1000 }
        }}
      >
        <div style={{ padding: '20px 0' }}>
          <p>
            <strong>{tenantToDelete?.companyName}</strong> adlı tenant'ı silmek istediğinizden emin misiniz?
          </p>
          <p style={{ color: '#666', marginTop: '10px' }}>
            Bu işlem geri alınamaz ve tenant'a ait tüm veriler kalıcı olarak silinecektir.
          </p>
        </div>
      </Modal>

      {/* Suspend Confirmation Modal */}
      <Modal
        title="Tenant Askıya Alma Onayı"
        open={suspendModalVisible}
        onOk={confirmSuspendTenant}
        onCancel={() => {
          setSuspendModalVisible(false)
          setTenantToSuspend(null)
        }}
        okText="Evet, Askıya Al"
        cancelText="İptal"
        okButtonProps={{ style: { backgroundColor: '#dc2626', borderColor: '#dc2626' } }}
        centered
        destroyOnHidden
        getContainer={() => document.body}
        width={500}
        style={{ zIndex: 1000 }}
        styles={{
          mask: { zIndex: 999 },
          wrapper: { zIndex: 1000 }
        }}
      >
        <div style={{ padding: '20px 0' }}>
          <p>
            <strong>{tenantToSuspend?.companyName}</strong> adlı tenant'ı askıya almak istediğinizden emin misiniz?
          </p>
          <p style={{ color: '#666', marginTop: '10px' }}>
            Bu işlem tenant'ın tüm kullanıcılarını ve API anahtarlarını pasif yapacaktır.
          </p>
        </div>
      </Modal>
    </div>
  )
} 