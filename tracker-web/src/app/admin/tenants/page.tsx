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
  message,
  Popconfirm,
  Divider
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
  DollarOutlined,
  CalendarOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  BuildOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  GlobalOutlined,
  FlagOutlined
} from '@ant-design/icons'
import { getUser, isAdmin, getFullName } from '@/utils/auth'
import { logger } from '@/utils/logger'

const { Title, Text } = Typography
const { Option } = Select

export default function AdminTenantsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tenants, setTenants] = useState<any[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add')
  const [selectedTenant, setSelectedTenant] = useState<any>(null)
  const [form] = Form.useForm()
  const router = useRouter()

  // Mock tenant data
  const mockTenants = [
    {
      id: 1,
      companyName: 'ABC Şirketi',
      facilityCode: 'ABC001',
      domain: 'abc.example.com',
      adminEmail: 'admin@abc.example.com',
      status: 'active',
      createdAt: '2024-01-10',
      userCount: 25,
      facilityCount: 8,
      subscription: 'premium',
      lastLogin: '2024-01-15 09:30:00',
      licenseExpiry: '2024-12-31',
      totalConsumption: '1,250 kWh',
      paymentStatus: 'paid',
      currency: 'TRY',
      language: 'tr',
      logo: 'https://via.placeholder.com/100x40/3b82f6/ffffff?text=ABC',
      monthlyFee: 299.99,
      lastPayment: '2024-01-01'
    },
    {
      id: 2,
      companyName: 'XYZ Ltd.',
      facilityCode: 'XYZ002',
      domain: 'xyz.example.com',
      adminEmail: 'admin@xyz.example.com',
      status: 'active',
      createdAt: '2024-01-08',
      userCount: 15,
      facilityCount: 5,
      subscription: 'standard',
      lastLogin: '2024-01-15 08:15:00',
      licenseExpiry: '2024-11-30',
      totalConsumption: '850 kWh',
      paymentStatus: 'paid',
      currency: 'USD',
      language: 'en',
      logo: 'https://via.placeholder.com/100x40/10b981/ffffff?text=XYZ',
      monthlyFee: 199.99,
      lastPayment: '2024-01-01'
    },
    {
      id: 3,
      companyName: 'DEF Teknoloji',
      facilityCode: 'DEF003',
      domain: 'def.example.com',
      adminEmail: 'admin@def.example.com',
      status: 'suspended',
      createdAt: '2024-01-05',
      userCount: 8,
      facilityCount: 3,
      subscription: 'basic',
      lastLogin: '2024-01-14 16:45:00',
      licenseExpiry: '2024-10-31',
      totalConsumption: '450 kWh',
      paymentStatus: 'overdue',
      currency: 'TRY',
      language: 'tr',
      logo: 'https://via.placeholder.com/100x40/ef4444/ffffff?text=DEF',
      monthlyFee: 99.99,
      lastPayment: '2023-12-01'
    },
    {
      id: 4,
      companyName: 'GHI Endüstri',
      facilityCode: 'GHI004',
      domain: 'ghi.example.com',
      adminEmail: 'admin@ghi.example.com',
      status: 'active',
      createdAt: '2024-01-12',
      userCount: 32,
      facilityCount: 12,
      subscription: 'premium',
      lastLogin: '2024-01-15 10:20:00',
      licenseExpiry: '2024-12-31',
      totalConsumption: '2,100 kWh',
      paymentStatus: 'paid',
      currency: 'TRY',
      language: 'tr',
      logo: 'https://via.placeholder.com/100x40/10b981/ffffff?text=GHI',
      monthlyFee: 399.99,
      lastPayment: '2024-01-01'
    },
    {
      id: 5,
      companyName: 'JKL Enerji',
      facilityCode: 'JKL005',
      domain: 'jkl.example.com',
      adminEmail: 'admin@jkl.example.com',
      status: 'pending',
      createdAt: '2024-01-15',
      userCount: 0,
      facilityCount: 0,
      subscription: 'basic',
      lastLogin: null,
      licenseExpiry: '2024-12-31',
      totalConsumption: '0 kWh',
      paymentStatus: 'pending',
      currency: 'TRY',
      language: 'tr',
      logo: 'https://via.placeholder.com/100x40/f59e0b/ffffff?text=JKL',
      monthlyFee: 99.99,
      lastPayment: null
    }
  ]



  useEffect(() => {
    const currentUser = getUser()
    
    if (!currentUser) {
      message.error('Oturum bulunamadı. Lütfen giriş yapın.')
      router.push('/login')
      return
    }

    if (!isAdmin()) {
      message.error('Bu sayfaya erişim yetkiniz yok.')
      router.push('/dashboard')
      return
    }

    setUser(currentUser)
    setTenants(mockTenants)
    setLoading(false)
    
    // Log admin tenants page access
    logger.info('Admin tenants page accessed', 'AdminTenantsPage', {
      userId: currentUser.id,
      userEmail: currentUser.email
    })
  }, [router])

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

  const handleEditTenant = (tenant: any) => {
    setModalType('edit')
    setSelectedTenant(tenant)
    form.setFieldsValue(tenant)
    setModalVisible(true)
  }

  const handleViewTenant = (tenant: any) => {
    setModalType('view')
    setSelectedTenant(tenant)
    form.setFieldsValue(tenant)
    setModalVisible(true)
  }

  const handleDeleteTenant = (tenant: any) => {
    setTenants(prev => prev.filter(t => t.id !== tenant.id))
    message.success(`${tenant.companyName} başarıyla silindi`)
  }

  const handleAccessTenant = (tenant: any) => {
    // Tenant paneline admin olarak giriş yapma simülasyonu
    message.success(`${tenant.companyName} paneline yönlendiriliyorsunuz...`)
    
    // Gerçek uygulamada burada tenant'a özel URL'ye yönlendirme yapılır
    // router.push(`/tenant/${tenant.domain}/admin`)
    
    // Şimdilik yeni sekmede açma simülasyonu
    setTimeout(() => {
      window.open(`http://${tenant.domain}`, '_blank')
    }, 1000)
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      
      if (modalType === 'add') {
        const newTenant = {
          id: Math.max(...tenants.map(t => t.id)) + 1,
          ...values,
          status: 'pending',
          createdAt: new Date().toISOString().split('T')[0],
          userCount: 0,
          facilityCount: 0,
          lastLogin: null,
          totalConsumption: '0 kWh',
          paymentStatus: 'pending',
          monthlyFee: values.subscription === 'premium' ? 299.99 : 
                     values.subscription === 'standard' ? 199.99 : 99.99,
          lastPayment: null
        }
        setTenants(prev => [...prev, newTenant])
        message.success('Tenant başarıyla eklendi')
        
        // Otomatik admin kullanıcısı oluşturma simülasyonu
        if (values.autoCreateAdmin) {
          message.info('Admin kullanıcısı otomatik olarak oluşturuldu')
        }
      } else if (modalType === 'edit') {
        setTenants(prev => prev.map(t => 
          t.id === selectedTenant.id ? { ...t, ...values } : t
        ))
        message.success('Tenant başarıyla güncellendi')
      }
      
      setModalVisible(false)
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green'
      case 'suspended':
        return 'red'
      case 'pending':
        return 'orange'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleOutlined />
      case 'suspended':
        return <StopOutlined />
      case 'pending':
        return <ClockCircleOutlined />
      default:
        return <ClockCircleOutlined />
    }
  }

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case 'premium':
        return 'purple'
      case 'standard':
        return 'blue'
      case 'basic':
        return 'green'
      default:
        return 'default'
    }
  }

  const columns = [
    {
      title: 'Şirket Adı',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Tesis Kodu',
      dataIndex: 'facilityCode',
      key: 'facilityCode',
      render: (code: string) => (
        <Tag color="blue" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
          {code}
        </Tag>
      )
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain',
      render: (text: string) => <Text className="text-gray-600">{text}</Text>
    },
    {
      title: 'Admin Email',
      dataIndex: 'adminEmail',
      key: 'adminEmail',
      render: (text: string) => <Text className="text-blue-600">{text}</Text>
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status === 'active' ? 'Aktif' : 
           status === 'suspended' ? 'Askıya Alınmış' : 'Beklemede'}
        </Tag>
      )
    },
    {
      title: 'Abonelik',
      dataIndex: 'subscription',
      key: 'subscription',
      render: (subscription: string) => (
        <Tag color={getSubscriptionColor(subscription)}>
          {subscription === 'premium' ? 'Premium' : 
           subscription === 'standard' ? 'Standart' : 'Temel'}
        </Tag>
      )
    },
    {
      title: 'Kullanıcı',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count: number) => <Text>{count}</Text>
    },
    {
      title: 'Tesis',
      dataIndex: 'facilityCount',
      key: 'facilityCount',
      render: (count: number) => <Text>{count}</Text>
    },
    {
      title: 'Lisans Süresi',
      dataIndex: 'licenseExpiry',
      key: 'licenseExpiry',
      render: (date: string) => (
        <div className="flex items-center">
          <CalendarOutlined style={{ marginRight: '4px', color: '#64748b' }} />
          <Text style={{ fontSize: '12px' }}>{date}</Text>
        </div>
      )
    },
    {
      title: 'Aylık Ücret',
      dataIndex: 'monthlyFee',
      key: 'monthlyFee',
      render: (fee: number) => (
        <div className="flex items-center">
          <DollarOutlined style={{ marginRight: '4px', color: '#f59e0b' }} />
          <Text style={{ fontSize: '12px', fontWeight: '600' }}>₺{fee?.toLocaleString()}</Text>
        </div>
      )
    },
    {
      title: 'Toplam Tüketim',
      dataIndex: 'totalConsumption',
      key: 'totalConsumption',
      render: (consumption: string) => (
        <div className="flex items-center">
          <BarChartOutlined style={{ marginRight: '4px', color: '#8b5cf6' }} />
          <Text style={{ fontSize: '12px' }}>{consumption}</Text>
        </div>
      )
    },
    {
      title: 'Para Birimi',
      dataIndex: 'currency',
      key: 'currency',
      render: (currency: string) => (
        <Tag color="blue" style={{ fontSize: '11px' }}>
          {currency}
        </Tag>
      )
    },
    {
      title: 'Dil',
      dataIndex: 'language',
      key: 'language',
      render: (lang: string) => (
        <Tag color="green" style={{ fontSize: '11px' }}>
          {lang === 'tr' ? 'Türkçe' : 'English'}
        </Tag>
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewTenant(record)}
            title="Detayları Görüntüle"
          />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditTenant(record)}
            title="Düzenle"
          />
          <Button
            type="text"
            size="small"
            icon={<GlobalOutlined />}
            onClick={() => handleAccessTenant(record)}
            style={{ color: '#10b981' }}
            title="Tenant Paneline Gir"
          />
          <Popconfirm
            title="Bu tenant'ı silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDeleteTenant(record)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
              title="Sil"
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  const tenantStats = {
    total: tenants.length,
    active: tenants.filter(t => t.status === 'active').length,
    suspended: tenants.filter(t => t.status === 'suspended').length,
    pending: tenants.filter(t => t.status === 'pending').length
  }

  // Enhanced tenant statistics cards
  const tenantStatCards = [
    {
      title: 'Toplam Tenant',
      value: tenantStats.total,
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
    },
    {
      title: 'Aktif Tenant',
      value: tenantStats.active,
      icon: <CheckCircleOutlined style={{ fontSize: '24px', color: '#10b981' }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)'
    },
    {
      title: 'Toplam Kullanıcı',
      value: tenants.reduce((sum, t) => sum + t.userCount, 0),
      icon: <UserOutlined style={{ fontSize: '24px', color: '#8b5cf6' }} />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    },
    {
      title: 'Aylık Gelir',
      value: `₺${tenants.reduce((sum, t) => sum + (t.monthlyFee || 0), 0).toLocaleString()}`,
      icon: <DollarOutlined style={{ fontSize: '24px', color: '#f59e0b' }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
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
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddTenant}
          >
            Yeni Tenant Ekle
          </Button>
        }
        className="shadow-sm"
      >
        <Table
          columns={columns}
          dataSource={tenants}
          rowKey="id"
          pagination={{
            pageSize: 10,
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
        width={800}
        okText={modalType === 'add' ? 'Ekle' : 'Güncelle'}
        cancelText="İptal"
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
                      
                      const existingTenant = tenants.find(t => 
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
            <Col span={12}>
              <Form.Item
                name="subscription"
                label="Abonelik"
                rules={[{ required: true, message: 'Abonelik seçin' }]}
              >
                <Select placeholder="Abonelik seçin">
                  <Option value="basic">Temel (₺99.99/ay)</Option>
                  <Option value="standard">Standart (₺199.99/ay)</Option>
                  <Option value="premium">Premium (₺299.99/ay)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="currency"
                label="Para Birimi"
                rules={[{ required: true, message: 'Para birimi seçin' }]}
              >
                <Select placeholder="Para birimi seçin">
                  <Option value="TRY">Türk Lirası (₺)</Option>
                  <Option value="USD">Amerikan Doları ($)</Option>
                  <Option value="EUR">Euro (€)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="language"
                label="Dil"
                rules={[{ required: true, message: 'Dil seçin' }]}
              >
                <Select placeholder="Dil seçin">
                  <Option value="tr">Türkçe</Option>
                  <Option value="en">English</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="licenseExpiry"
                label="Lisans Bitiş Tarihi"
                rules={[{ required: true, message: 'Lisans bitiş tarihi gerekli' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="logo"
                label="Logo URL"
              >
                <Input placeholder="https://example.com/logo.png" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Otomatik Kullanıcı Oluşturma</Divider>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="autoCreateAdmin"
                label="Admin Kullanıcısı Oluştur"
                valuePropName="checked"
              >
                <Select placeholder="Admin kullanıcısı oluşturulsun mu?">
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
    </div>
  )
} 