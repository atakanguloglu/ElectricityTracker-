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
  Popconfirm
} from 'antd'
import { 
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined
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
      domain: 'abc.example.com',
      adminEmail: 'admin@abc.example.com',
      status: 'active',
      createdAt: '2024-01-10',
      userCount: 25,
      facilityCount: 8,
      subscription: 'premium',
      lastLogin: '2024-01-15 09:30:00'
    },
    {
      id: 2,
      companyName: 'XYZ Ltd.',
      domain: 'xyz.example.com',
      adminEmail: 'admin@xyz.example.com',
      status: 'active',
      createdAt: '2024-01-08',
      userCount: 15,
      facilityCount: 5,
      subscription: 'standard',
      lastLogin: '2024-01-15 08:15:00'
    },
    {
      id: 3,
      companyName: 'DEF Teknoloji',
      domain: 'def.example.com',
      adminEmail: 'admin@def.example.com',
      status: 'suspended',
      createdAt: '2024-01-05',
      userCount: 8,
      facilityCount: 3,
      subscription: 'basic',
      lastLogin: '2024-01-14 16:45:00'
    },
    {
      id: 4,
      companyName: 'GHI Endüstri',
      domain: 'ghi.example.com',
      adminEmail: 'admin@ghi.example.com',
      status: 'active',
      createdAt: '2024-01-12',
      userCount: 32,
      facilityCount: 12,
      subscription: 'premium',
      lastLogin: '2024-01-15 10:20:00'
    },
    {
      id: 5,
      companyName: 'JKL Enerji',
      domain: 'jkl.example.com',
      adminEmail: 'admin@jkl.example.com',
      status: 'pending',
      createdAt: '2024-01-15',
      userCount: 0,
      facilityCount: 0,
      subscription: 'basic',
      lastLogin: null
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

  const handleAddTenant = () => {
    setModalType('add')
    setSelectedTenant(null)
    form.resetFields()
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
          lastLogin: null
        }
        setTenants(prev => [...prev, newTenant])
        message.success('Tenant başarıyla eklendi')
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
      title: 'İşlemler',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewTenant(record)}
          />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditTenant(record)}
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

      {/* Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <Card className="text-center shadow-sm border-l-4 border-l-blue-500">
            <Statistic
              title="Toplam Tenant"
              value={tenantStats.total}
              valueStyle={{ color: '#3b82f6' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center shadow-sm border-l-4 border-l-green-500">
            <Statistic
              title="Aktif"
              value={tenantStats.active}
              valueStyle={{ color: '#22c55e' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center shadow-sm border-l-4 border-l-red-500">
            <Statistic
              title="Askıya Alınmış"
              value={tenantStats.suspended}
              valueStyle={{ color: '#ef4444' }}
              prefix={<StopOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center shadow-sm border-l-4 border-l-orange-500">
            <Statistic
              title="Beklemede"
              value={tenantStats.pending}
              valueStyle={{ color: '#f97316' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
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
        width={600}
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
                name="domain"
                label="Domain"
                rules={[{ required: true, message: 'Domain gerekli' }]}
              >
                <Input placeholder="example.com" />
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
                  <Option value="basic">Temel</Option>
                  <Option value="standard">Standart</Option>
                  <Option value="premium">Premium</Option>
                </Select>
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