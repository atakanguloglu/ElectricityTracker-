'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Card,
  Row,
  Col,
  Button,
  Tag,
  Badge,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Popconfirm,
  Space,
  Typography,
  Divider,
  Tooltip,
  Avatar,
  Statistic,
  Tabs,
  List,
  Descriptions,
  DatePicker,
  InputNumber,
  Spin,
  Alert,
  App
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  KeyOutlined,
  SearchOutlined,
  FilterOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
  FileTextOutlined,
  CrownOutlined,
  CalculatorOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useResetPassword } from '@/hooks/useUsers';
import type { User, CreateUserDto, UpdateUserDto, UserFilters, Tenant, PagedResult } from '@/types/api.types';
import { apiRequest } from '@/utils/auth';
import { useQueryClient } from '@tanstack/react-query';

const { Title, Text } = Typography;
const { Option } = Select;

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5143/api/superadmin'

// Local types
interface LoginHistory {
  id: number
  timestamp: string
  ipAddress?: string
  userAgent?: string
  status: string
  details?: string
}

export default function UsersPage() {
  const { message, modal } = App.useApp()
  const queryClient = useQueryClient()
  
  // Filters state
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    pageSize: 10,
    search: '',
    tenantId: undefined,
    role: undefined,
    isActive: undefined,
  })

  // React Query hooks for data fetching
  const { data: usersData, isLoading, error, refetch } = useUsers(filters)
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()
  const resetPasswordMutation = useResetPassword()

  // UI state
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loginHistoryVisible, setLoginHistoryVisible] = useState(false)
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([])
  const [loginHistoryLoading, setLoginHistoryLoading] = useState(false)
  const [currentPasswordInfo, setCurrentPasswordInfo] = useState<any>(null)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [form] = Form.useForm()

  // Fetch tenants on mount
  useEffect(() => {
    fetchTenants()
  }, [])

  // ✅ fetchUsers removed - useUsers hook handles this automatically

  const fetchTenants = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/tenants?pageSize=100`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Tenants API Error Response:', errorText)
        throw new Error(`Tenant listesi alınamadı (${response.status}): ${errorText}`)
      }
      
      const data: any = await response.json()
      
      // Transform PascalCase to camelCase
      const items = (data.Items || data.items || []).map((tenant: any) => ({
        id: tenant.Id || tenant.id,
        companyName: tenant.CompanyName || tenant.companyName,
        tenantName: tenant.TenantName || tenant.tenantName,
        contactEmail: tenant.ContactEmail || tenant.contactEmail,
        contactPhone: tenant.ContactPhone || tenant.contactPhone,
        isActive: tenant.IsActive ?? tenant.isActive,
        subscriptionPlan: tenant.SubscriptionPlan || tenant.subscriptionPlan,
        createdAt: tenant.CreatedAt || tenant.createdAt
      }))
      
      setTenants(items)
    } catch (err) {
      console.error('Tenants fetch error:', err)
      setTenants([])
    }
  }

  const fetchLoginHistory = async (userId: number) => {
    try {
      setLoginHistoryLoading(true)
      const response = await apiRequest(`${API_BASE_URL}/users/${userId}/login-history`)
      if (!response.ok) throw new Error('Giriş geçmişi alınamadı')
      
      const history: LoginHistory[] = await response.json()
      setLoginHistory(history)
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Giriş geçmişi alınırken hata oluştu')
      console.error('Login history fetch error:', err)
    } finally {
      setLoginHistoryLoading(false)
    }
  }

  const fetchCurrentPassword = async (userId: number) => {
    try {
      setPasswordLoading(true)
      const response = await apiRequest(`${API_BASE_URL}/users/${userId}/current-password`)
      if (!response.ok) throw new Error('Şifre bilgisi alınamadı')
      
      const passwordInfo = await response.json()
      setCurrentPasswordInfo(passwordInfo)
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Şifre bilgisi alınırken hata oluştu')
      console.error('Password info fetch error:', err)
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleAdd = () => {
    setModalType('add')
    setSelectedUser(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = async (user: User) => {
    setModalType('edit')
    // Normalize user object to ensure id is set
    const normalizedUser = {
      ...user,
      id: user.id || (user as any).Id
    }
    setSelectedUser(normalizedUser)
    const fullName = user.fullName || user.FullName || ''
    form.setFieldsValue({
      firstName: fullName.split(' ')[0],
      lastName: fullName.split(' ').slice(1).join(' '),
      email: user.email || user.Email,
      phone: user.phone || user.Phone,
      role: (user as any).Role || user.role,
      isActive: user.isActive || user.IsActive,
      isLocked: user.isLocked || user.IsLocked,
      tenantId: user.tenantId || user.TenantId
    })
    setModalVisible(true)
    
    // Fetch current password info
    await fetchCurrentPassword(user.id || user.Id || 0)
  }

  const handleViewHistory = async (user: User) => {
    setSelectedUser(user)
    setLoginHistoryVisible(true)
    await fetchLoginHistory(user.id || user.Id || 0)
  }

  const handleToggleLock = async (user: User) => {
    try {
      const userId = user.id || (user as any).Id
      const response = await apiRequest(`${API_BASE_URL}/users/${userId}/toggle-lock`, {
        method: 'POST'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Kullanıcı kilidi değiştirilemedi')
      }

      const result = await response.json()
      message.success(result.message)
      
      // ✨ Optimistic Update: Instantly update the cache
      queryClient.setQueryData<PagedResult<User>>(
        ['users', 'list', filters],
        (oldData) => {
          if (!oldData) return oldData
          
          return {
            ...oldData,
            items: oldData.items.map((u) =>
              u.id === userId
                ? { ...u, isLocked: result.isLocked, IsLocked: result.isLocked }
                : u
            ),
          }
        }
      )
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Kullanıcı kilidi değiştirilirken hata oluştu')
      console.error('Toggle lock error:', err)
    }
  }

  const handleResetPassword = async (user: User) => {
    try {
              const response = await apiRequest(`${API_BASE_URL}/users/${user.id || user.Id || 0}/reset-password`, {
        method: 'POST'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Şifre sıfırlanamadı')
      }

      const result = await response.json()
      message.success(result.message)
      
      // Show temporary password in a modal
      modal.info({
        title: 'Şifre Bilgileri',
        content: (
          <div>
            <p><strong>Kullanıcı:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            
            <div style={{ margin: '15px 0', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#333' }}>
                🔑 Mevcut Şifre (Hash):
              </p>
              <div style={{ 
                background: '#fff', 
                padding: '8px', 
                borderRadius: '4px', 
                fontFamily: 'monospace',
                fontSize: '12px',
                border: '1px solid #d9d9d9',
                wordBreak: 'break-all',
                maxHeight: '60px',
                overflow: 'auto'
              }}>
                {user.passwordHash || 'Şifre hash bilgisi mevcut değil'}
              </div>
            </div>

            <div style={{ margin: '15px 0', padding: '10px', background: '#e6f7ff', borderRadius: '4px', border: '1px solid #91d5ff' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#1890ff' }}>
                🆕 Yeni Geçici Şifre:
              </p>
              <div style={{ 
                background: '#fff', 
                padding: '10px', 
                borderRadius: '4px', 
                fontFamily: 'monospace',
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                border: '1px solid #91d5ff',
                color: '#1890ff'
              }}>
                {result.temporaryPassword}
              </div>
            </div>

            <div style={{ 
              background: '#fff7e6', 
              padding: '10px', 
              borderRadius: '4px', 
              border: '1px solid #ffd591',
              marginTop: '15px'
            }}>
              <p style={{ margin: 0, color: '#d46b08', fontSize: '12px' }}>
                <strong>⚠️ Güvenlik Notu:</strong> Bu şifreyi güvenli bir şekilde kullanıcıya iletin. 
                Kullanıcı ilk girişte şifresini değiştirmek zorunda kalacaktır.
              </p>
            </div>
          </div>
        ),
        okText: 'Tamam',
        width: 600,
        centered: true,
        getContainer: () => document.body,
        style: { 
          top: '50%',
          transform: 'translateY(-50%)',
          margin: '0 auto'
        },
        styles: {
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(2px)'
          }
        }
      })
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Şifre sıfırlanırken hata oluştu')
      console.error('Reset password error:', err)
    }
  }

  const handleDelete = async (userId: number) => {
    try {
      await deleteMutation.mutateAsync(userId)
    } catch (err) {
      // Error already handled by mutation's onError
      console.error('Delete user error:', err)
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()

      if (modalType === 'add') {
        const createDto: CreateUserDto = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          phone: values.phone,
          role: values.role,
          isActive: values.isActive,
          tenantId: values.tenantId,
          departmentId: values.departmentId
        }

        await createMutation.mutateAsync(createDto)
        setModalVisible(false)
      } else if (modalType === 'edit' && selectedUser) {
        const userId = selectedUser.id || (selectedUser as any).Id
        if (!userId) {
          message.error('Kullanıcı ID bulunamadı')
          return
        }
        
        const updateDto: UpdateUserDto = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          role: values.role,
          isActive: values.isActive,
          isLocked: values.isLocked,
          departmentId: values.departmentId
        }

        await updateMutation.mutateAsync({ id: userId, data: updateDto })
        setModalVisible(false)
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('validation')) {
        // Form validation error - don't show message
        return
      }
      // Error already handled by mutation's onError
      console.error('Modal operation error:', err)
    }
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setFilters(prev => ({ ...prev, page: 1 })) // Reset to first page
  }

  const clearFilters = () => {
    setFilters({
      page: 1,
      pageSize: 10,
      search: '',
      tenantId: undefined,
      role: undefined,
      isActive: undefined,
    })
  }

  // User statistics
  const userStats = useMemo(() => ({
    total: usersData?.totalCount || 0,
    active: usersData?.items?.filter(u => u.isActive && !u.isLocked).length || 0,
    locked: usersData?.items?.filter(u => u.isLocked).length || 0,
    admins: usersData?.items?.filter(u => u.role?.toLowerCase() === 'admin').length || 0
  }), [usersData])

  const getRoleIcon = (role: string) => {
    if (!role) return <UserOutlined />
    switch (role.toLowerCase()) {
      case 'admin': return <CrownOutlined />
      case 'accountant': return <CalculatorOutlined />
      case 'analyst': return <BarChartOutlined />
      case 'reportviewer': return <FileTextOutlined />
      default: return <UserOutlined />
    }
  }

  const getRoleColor = (role: string) => {
    if (!role) return 'default'
    switch (role.toLowerCase()) {
      case 'admin': return 'purple'
      case 'accountant': return 'blue'
      case 'analyst': return 'green'
      case 'reportviewer': return 'orange'
      default: return 'default'
    }
  }

  const getStatusIcon = (isActive: boolean, isLocked: boolean) => {
    if (isLocked) return <LockOutlined />
    return isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />
  }

  const getStatusText = (isActive: boolean, isLocked: boolean) => {
    if (isLocked) return 'Kilitli'
    return isActive ? 'Aktif' : 'Pasif'
  }

  const getStatusColor = (isActive: boolean, isLocked: boolean) => {
    if (isLocked) return 'error'
    return isActive ? 'success' : 'default'
  }

  // Table columns
  const columns: ColumnsType<User> = [
    {
      title: 'Kullanıcı',
      key: 'user',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            icon={<UserOutlined />}
            style={{ backgroundColor: '#3b82f6' }}
          />
          <div>
            <div className="font-medium">{record.fullName || record.FullName || '-'}</div>
            <div className="text-sm text-gray-500">{record.username || record.Username || '-'}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Email',
      key: 'email',
      render: (_, record) => <Text copyable>{record.email || record.Email || '-'}</Text>
    },
    {
      title: 'Tenant',
      key: 'tenantName',
      render: (_, record) => (
        <Tag color="blue" icon={<GlobalOutlined />}>
          {record.tenantName || record.TenantName || '-'}
        </Tag>
      )
    },
    {
      title: 'Rol',
      key: 'roleName',
      render: (_, record) => {
        const role = record.role || record.Role || ''
        const roleName = record.roleName || record.RoleName || ''
        return (
          <Tag color={getRoleColor(role)} icon={getRoleIcon(role)}>
            {roleName}
          </Tag>
        )
      }
    },
    {
      title: 'Durum',
      key: 'status',
      render: (_, record) => {
        const isActive = record.isActive || record.IsActive || false
        const isLocked = record.isLocked || record.IsLocked || false
        return (
          <Tag 
            color={getStatusColor(isActive, isLocked)}
            icon={getStatusIcon(isActive, isLocked)}
          >
            {getStatusText(isActive, isLocked)}
          </Tag>
        )
      }
    },
    {
      title: 'Son Giriş',
      key: 'lastLogin',
      render: (_, record) => {
        const lastLogin = record.lastLogin || record.LastLogin
        return (
          <div className="flex items-center">
            <ClockCircleOutlined style={{ marginRight: '4px', color: '#64748b' }} />
            <Text style={{ fontSize: '12px' }}>
              {lastLogin ? new Date(lastLogin).toLocaleString('tr-TR') : 'Hiç giriş yapmamış'}
            </Text>
          </div>
        )
      }
    },
    {
      title: 'Giriş Sayısı',
      key: 'loginCount',
      render: (_, record) => {
        const count = record.loginCount || record.LoginCount || 0
        return (
          <Badge count={count} style={{ backgroundColor: '#8b5cf6' }} />
        )
      }
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Giriş Geçmişi">
            <Button
              type="text"
              icon={<ClockCircleOutlined />}
              onClick={() => handleViewHistory(record)}
            />
          </Tooltip>
          <Tooltip title={record.isLocked ? 'Kilidi Aç' : 'Kilitle'}>
            <Button
              type="text"
              icon={record.isLocked ? <UnlockOutlined /> : <LockOutlined />}
              onClick={() => handleToggleLock(record)}
              style={{ color: record.isLocked ? '#10b981' : '#ef4444' }}
            />
          </Tooltip>
          <Tooltip title="Şifre Sıfırla">
            <Button
              type="text"
              icon={<KeyOutlined />}
              onClick={() => handleResetPassword(record)}
              style={{ color: '#f59e0b' }}
            />
          </Tooltip>
          <Tooltip title="Düzenle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Kullanıcıyı silmek istediğinizden emin misiniz?"
            description="Bu işlem geri alınamaz."
            onConfirm={() => handleDelete(record.id || record.Id || 0)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Tooltip title="Sil">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ]

  // Login history columns
  const loginHistoryColumns: ColumnsType<LoginHistory> = [
    {
      title: 'Tarih',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => new Date(timestamp).toLocaleString('tr-TR')
    },
    {
      title: 'IP Adresi',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      render: (ip: string) => <Text code>{ip || 'N/A'}</Text>
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Başarılı' ? 'success' : 'error'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Detaylar',
      dataIndex: 'details',
      key: 'details',
      render: (details: string) => <Text>{details || 'N/A'}</Text>
    }
  ]

  // Loading state
  const hasNoData = !usersData?.items || usersData.items.length === 0
  if (isLoading && hasNoData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '20px' }}>Kullanıcı listesi yükleniyor...</div>
      </div>
    )
  }

  // Error state  
  if (error && (!usersData?.items || usersData.items.length === 0)) {
    return (
      <Alert
        message="Hata"
        description={error instanceof Error ? error.message : 'Kullanıcılar yüklenirken hata oluştu'}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={() => setFilters({...filters})}>
            Tekrar Dene
          </Button>
        }
      />
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <TeamOutlined /> Kullanıcı Yönetimi
      </Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {/* Total Users */}
        <Col xs={24} sm={12} lg={6} key="total">
          <Card
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{userStats.total}</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Toplam Kullanıcı</div>
              </div>
              <div style={{ fontSize: '32px', opacity: 0.8 }}>
                <TeamOutlined />
              </div>
            </div>
          </Card>
        </Col>
        {/* Active Users */}
        <Col xs={24} sm={12} lg={6} key="active">
          <Card
            style={{
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              color: 'white',
              border: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{userStats.active}</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Aktif Kullanıcı</div>
              </div>
              <div style={{ fontSize: '32px', opacity: 0.8 }}>
                <CheckCircleOutlined />
              </div>
            </div>
          </Card>
        </Col>
        {/* Locked Accounts */}
        <Col xs={24} sm={12} lg={6} key="locked">
          <Card
            style={{
              background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
              color: 'white',
              border: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{userStats.locked}</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Kilitli Hesap</div>
              </div>
              <div style={{ fontSize: '32px', opacity: 0.8 }}>
                <LockOutlined />
              </div>
            </div>
          </Card>
        </Col>
        {/* Users Today */}
        <Col xs={24} sm={12} lg={6} key="today">
          <Card
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{userStats.admins}</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Bugün Giriş Yapan</div>
              </div>
              <div style={{ fontSize: '32px', opacity: 0.8 }}>
                <ClockCircleOutlined />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6}>
            <Select
              placeholder="Tenant Seçin"
              style={{ width: '100%' }}
              value={filters.tenantId}
              onChange={(value) => handleFilterChange('tenantId', value)}
              allowClear
              getPopupContainer={(triggerNode) => document.body}
              onMouseDown={(e) => e.stopPropagation()}
              styles={{ popup: { root: { zIndex: 1050 } } }}
            >
              {tenants?.map(tenant => (
                <Option key={tenant.id} value={tenant.id}>
                  {tenant.companyName}
                </Option>
              )) || []}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Rol Seçin"
              style={{ width: '100%' }}
              value={filters.role}
              onChange={(value) => handleFilterChange('role', value)}
              allowClear
              getPopupContainer={(triggerNode) => document.body}
              onMouseDown={(e) => e.stopPropagation()}
              styles={{ popup: { root: { zIndex: 1050 } } }}
            >
              {/* Assuming roleOptions is defined elsewhere or removed if not needed */}
              {/* For now, we'll use a placeholder or remove if not used */}
              {/* <Option value="admin">Admin</Option>
              <Option value="accountant">Muhasebeci</Option>
              <Option value="analyst">Analist</Option>
              <Option value="viewer">Rapor Görücü</Option> */}
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Select
              placeholder="Durum"
              style={{ width: '100%' }}
              value={filters.isActive}
              onChange={(value) => handleFilterChange('isActive', value)}
              allowClear
              getPopupContainer={(triggerNode) => document.body}
              onMouseDown={(e) => e.stopPropagation()}
              styles={{ popup: { root: { zIndex: 1050 } } }}
            >
              <Option value={true}>Aktif</Option>
              <Option value={false}>Pasif</Option>
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Select
              placeholder="Kilit Durumu"
              style={{ width: '100%' }}
              value={filters.isLocked}
              onChange={(value) => handleFilterChange('isLocked', value)}
              allowClear
              getPopupContainer={(triggerNode) => document.body}
              onMouseDown={(e) => e.stopPropagation()}
              styles={{ popup: { root: { zIndex: 1050 } } }}
            >
              <Option value={true}>Kilitli</Option>
              <Option value={false}>Açık</Option>
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Yeni Kullanıcı
              </Button>
              <Button
                icon={<FilterOutlined />}
                onClick={clearFilters}
              >
                Filtreleri Temizle
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={usersData?.items || []}
          rowKey={(record) => record.id?.toString() || record.Id?.toString() || `user-${Math.random()}`}
          loading={isLoading}
          pagination={{
            current: filters.page,
            pageSize: filters.pageSize,
            total: usersData?.totalCount || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} / ${total} kullanıcı`
          }}
          onChange={(pagination) => {
            setFilters(prev => ({
              ...prev,
              page: pagination.current || 1,
              pageSize: pagination.pageSize || 10
            }))
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Add/Edit User Modal */}
      <Modal
        title={selectedUser ? (selectedUser.id === 0 ? 'Yeni Kullanıcı Ekle' : 'Kullanıcı Düzenle') : 'Kullanıcı Ekle'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText={selectedUser ? 'Güncelle' : 'Oluştur'}
        cancelText="İptal"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        centered={true}
        destroyOnHidden={true}
        getContainer={() => document.body}
        style={{ 
          top: '50%',
          transform: 'translateY(-50%)',
          margin: '0 auto'
        }}
        styles={{
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(2px)'
          }
        }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="Ad"
                rules={[{ required: true, message: 'Ad gerekli!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Soyad"
                rules={[{ required: true, message: 'Soyad gerekli!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="E-posta"
                rules={[
                  { required: true, message: 'E-posta gerekli!' },
                  { type: 'email', message: 'Geçerli bir e-posta girin!' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Telefon"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tenantId"
                label="Tenant"
                rules={[{ required: true, message: 'Tenant seçin!' }]}
              >
                <Select 
                  placeholder="Tenant seçin"
                  getPopupContainer={(triggerNode) => document.body}
                  onMouseDown={(e) => e.stopPropagation()}
                  styles={{ popup: { root: { zIndex: 1050 } } }}
                >
                  {tenants?.map(tenant => (
                    <Option key={tenant.id} value={tenant.id}>
                      {tenant.companyName}
                    </Option>
                  )) || []}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Rol"
                rules={[{ required: true, message: 'Rol seçin!' }]}
              >
                <Select 
                  placeholder="Rol seçin"
                  getPopupContainer={(triggerNode) => document.body}
                  onMouseDown={(e) => e.stopPropagation()}
                  styles={{ popup: { root: { zIndex: 1050 } } }}
                >
                  <Option value="admin">Admin</Option>
                  <Option value="accountant">Muhasebeci</Option>
                  <Option value="analyst">Analist</Option>
                  <Option value="reportviewer">Rapor Görücü</Option>
                  <Option value="manager">Yönetici</Option>
                  <Option value="user">Kullanıcı</Option>
                  <Option value="viewer">İzleyici</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Departman"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="Aktif"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          {/* Şifre Bilgisi - Sadece düzenleme modunda göster */}
          {modalType === 'edit' && selectedUser && (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Mevcut Şifre Bilgisi"
                >
                  <div style={{ 
                    background: '#f5f5f5', 
                    padding: '12px', 
                    borderRadius: '6px',
                    border: '1px solid #d9d9d9'
                  }}>
                    {passwordLoading ? (
                      <div style={{ textAlign: 'center' }}>
                        <Spin size="small" /> Şifre bilgisi yükleniyor...
                      </div>
                    ) : currentPasswordInfo ? (
                      <div>
                        <Row gutter={16}>
                          <Col span={8}>
                            <div style={{ fontSize: '12px', color: '#666' }}>Hash Önizleme:</div>
                            <div style={{ 
                              fontFamily: 'monospace', 
                              fontSize: '11px',
                              background: '#fff',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid #d9d9d9'
                            }}>
                              {currentPasswordInfo.passwordHash}
                            </div>
                          </Col>
                          <Col span={8}>
                            <div style={{ fontSize: '12px', color: '#666' }}>Hash Uzunluğu:</div>
                            <div style={{ fontWeight: 'bold' }}>
                              {currentPasswordInfo.passwordLength} karakter
                            </div>
                          </Col>
                          <Col span={8}>
                            <div style={{ fontSize: '12px', color: '#666' }}>Son Değişiklik:</div>
                            <div style={{ fontSize: '12px' }}>
                              {currentPasswordInfo.lastChanged 
                                ? new Date(currentPasswordInfo.lastChanged).toLocaleString('tr-TR')
                                : 'Bilinmiyor'
                              }
                            </div>
                          </Col>
                        </Row>
                        {currentPasswordInfo.requireChange && (
                          <div style={{ 
                            marginTop: '8px', 
                            padding: '4px 8px', 
                            background: '#fff7e6', 
                            border: '1px solid #ffd591',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: '#d46b08'
                          }}>
                            ⚠️ Kullanıcı ilk girişte şifresini değiştirmek zorunda
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ color: '#999', textAlign: 'center' }}>
                        Şifre bilgisi yüklenemedi
                      </div>
                    )}
                  </div>
                </Form.Item>
              </Col>
            </Row>
          )}

          {modalType === 'edit' && selectedUser && (
            <Form.Item
              name="isLocked"
              label="Kilitli"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* Login History Modal */}
      <Modal
        title={`${selectedUser?.fullName} - Giriş Geçmişi`}
        open={loginHistoryVisible}
        onCancel={() => setLoginHistoryVisible(false)}
        width={800}
        footer={null}
        confirmLoading={loginHistoryLoading}
        centered={true}
        destroyOnHidden={true}
        getContainer={() => document.body}
        style={{ 
          top: '50%',
          transform: 'translateY(-50%)',
          margin: '0 auto'
        }}
        styles={{
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(2px)'
          }
        }}
      >
        <Table
          columns={loginHistoryColumns}
          dataSource={loginHistory}
          rowKey={(record) => record.id?.toString() || `history-${Math.random()}`}
          pagination={false}
          size="small"
          loading={loginHistoryLoading}
        />
      </Modal>
    </div>
  );
} 