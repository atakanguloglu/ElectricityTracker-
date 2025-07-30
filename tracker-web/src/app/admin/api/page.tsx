'use client'

import React, { useState } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Button, 
  Tag, 
  Progress, 
  Statistic, 
  Typography, 
  Divider,
  Space,
  Tooltip,
  Badge,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  Alert,
  Descriptions,
  Timeline
} from 'antd'
import { 
  ProCard,
  PageContainer 
} from '@ant-design/pro-components'
import { 
  ApiOutlined,
  KeyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  CloudOutlined,
  HddOutlined,
  CalendarOutlined,
  UserOutlined,
  RiseOutlined,
  FallOutlined,
  ReloadOutlined,
  SettingOutlined,
  LockOutlined,
  UnlockOutlined,
  SafetyOutlined,
  GlobalOutlined
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TextArea } = Input

export default function ApiManagementPage() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isKeyModalVisible, setIsKeyModalVisible] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [editingApi, setEditingApi] = useState<any>(null)
  const [form] = Form.useForm()
  const [keyForm] = Form.useForm()

  // Mock API management data
  const apiStats = [
    {
      title: 'Toplam API Anahtarı',
      value: '24',
      icon: <KeyOutlined style={{ fontSize: '24px', color: '#10b981' }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      change: '+3',
      changeType: 'increase'
    },
    {
      title: 'Aktif Çağrılar',
      value: '1,250',
      icon: <ThunderboltOutlined style={{ fontSize: '24px', color: '#f59e0b' }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      change: '+12.5%',
      changeType: 'increase'
    },
    {
      title: 'Başarı Oranı',
      value: '98.7%',
      icon: <CheckCircleOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      change: '+0.3%',
      changeType: 'increase'
    },
    {
      title: 'Ortalama Yanıt',
      value: '145ms',
      icon: <CloudOutlined style={{ fontSize: '24px', color: '#8b5cf6' }} />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      change: '-8ms',
      changeType: 'decrease'
    }
  ]

  const apiKeys = [
    {
      id: 1,
      name: 'ABC Şirketi API',
      key: 'sk_live_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
      tenant: 'ABC Şirketi',
      status: 'active',
      permissions: ['read', 'write'],
      rateLimit: 1000,
      usage: 750,
      lastUsed: '2024-01-15 14:30',
      createdAt: '2023-12-01',
      expiresAt: '2024-12-01'
    },
    {
      id: 2,
      name: 'XYZ Ltd. API',
      key: 'sk_live_xyz789abc012def345ghi678jkl901mno234pqr567stu890vwx',
      tenant: 'XYZ Ltd.',
      status: 'active',
      permissions: ['read'],
      rateLimit: 500,
      usage: 320,
      lastUsed: '2024-01-15 13:45',
      createdAt: '2023-11-15',
      expiresAt: '2024-11-15'
    },
    {
      id: 3,
      name: 'DEF Corp. API',
      key: 'sk_live_def456ghi789jkl012mno345pqr678stu901vwx234yz567abc',
      tenant: 'DEF Corp.',
      status: 'suspended',
      permissions: ['read', 'write', 'admin'],
      rateLimit: 2000,
      usage: 1850,
      lastUsed: '2024-01-14 16:20',
      createdAt: '2023-10-20',
      expiresAt: '2024-10-20'
    },
    {
      id: 4,
      name: 'GHI Inc. API',
      key: 'sk_live_ghi789jkl012mno345pqr678stu901vwx234yz567abc890def',
      tenant: 'GHI Inc.',
      status: 'active',
      permissions: ['read', 'write'],
      rateLimit: 800,
      usage: 420,
      lastUsed: '2024-01-15 12:15',
      createdAt: '2023-09-10',
      expiresAt: '2024-09-10'
    },
    {
      id: 5,
      name: 'JKL Co. API',
      key: 'sk_live_jkl012mno345pqr678stu901vwx234yz567abc890def123ghi',
      tenant: 'JKL Co.',
      status: 'expired',
      permissions: ['read'],
      rateLimit: 300,
      usage: 150,
      lastUsed: '2024-01-10 09:30',
      createdAt: '2023-08-25',
      expiresAt: '2024-01-10'
    }
  ]

  const apiUsageLogs = [
    {
      id: 1,
      endpoint: '/api/consumption',
      method: 'GET',
      status: 200,
      responseTime: 120,
      tenant: 'ABC Şirketi',
      timestamp: '2024-01-15 14:30:25',
      ipAddress: '192.168.1.100'
    },
    {
      id: 2,
      endpoint: '/api/billing',
      method: 'POST',
      status: 201,
      responseTime: 85,
      tenant: 'XYZ Ltd.',
      timestamp: '2024-01-15 14:29:18',
      ipAddress: '192.168.1.101'
    },
    {
      id: 3,
      endpoint: '/api/tenants',
      method: 'GET',
      status: 403,
      responseTime: 45,
      tenant: 'DEF Corp.',
      timestamp: '2024-01-15 14:28:42',
      ipAddress: '192.168.1.102'
    },
    {
      id: 4,
      endpoint: '/api/auth/login',
      method: 'POST',
      status: 200,
      responseTime: 95,
      tenant: 'GHI Inc.',
      timestamp: '2024-01-15 14:27:33',
      ipAddress: '192.168.1.103'
    },
    {
      id: 5,
      endpoint: '/api/reports',
      method: 'GET',
      status: 500,
      responseTime: 250,
      tenant: 'JKL Co.',
      timestamp: '2024-01-15 14:26:15',
      ipAddress: '192.168.1.104'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'suspended': return 'warning'
      case 'expired': return 'error'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif'
      case 'suspended': return 'Askıya Alındı'
      case 'expired': return 'Süresi Doldu'
      default: return 'Bilinmiyor'
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'green'
      case 'POST': return 'blue'
      case 'PUT': return 'orange'
      case 'DELETE': return 'red'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) return <CheckCircleOutlined style={{ color: '#10b981' }} />
    if (status >= 400 && status < 500) return <ExclamationCircleOutlined style={{ color: '#f59e0b' }} />
    if (status >= 500) return <ExclamationCircleOutlined style={{ color: '#ef4444' }} />
    return <ClockCircleOutlined style={{ color: '#64748b' }} />
  }

  const apiKeyColumns = [
    {
      title: 'API Anahtarı',
      key: 'apiKey',
      render: (record: any) => (
        <div className="api-key-info">
          <div className="api-key-name">
            <KeyOutlined style={{ marginRight: '8px', color: '#64748b' }} />
            {record.name}
          </div>
          <div className="api-key-preview">
            <Text code style={{ fontSize: '12px' }}>
              {record.key.substring(0, 20)}...
            </Text>
            <Button
              type="text"
              icon={showApiKey ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              size="small"
              onClick={() => setShowApiKey(!showApiKey)}
              className="show-key-button"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Tenant',
      dataIndex: 'tenant',
      key: 'tenant',
      render: (tenant: string) => (
        <div className="tenant-info">
          <UserOutlined style={{ marginRight: '8px', color: '#64748b' }} />
          {tenant}
        </div>
      ),
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={getStatusColor(status) as any} 
          text={getStatusText(status)}
        />
      ),
    },
    {
      title: 'İzinler',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <Space size="small">
          {permissions.map(perm => (
            <Tag 
              key={perm} 
              color={perm === 'admin' ? 'red' : perm === 'write' ? 'blue' : 'green'}
              className="permission-tag"
            >
              {perm === 'read' ? 'Okuma' : perm === 'write' ? 'Yazma' : 'Admin'}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Kullanım',
      key: 'usage',
      render: (record: any) => (
        <div className="usage-info">
          <div className="usage-text">
            {record.usage} / {record.rateLimit}
          </div>
          <Progress 
            percent={Math.round((record.usage / record.rateLimit) * 100)} 
            size="small"
            strokeColor={record.usage / record.rateLimit > 0.8 ? '#ef4444' : 
                        record.usage / record.rateLimit > 0.6 ? '#f59e0b' : '#10b981'}
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: 'Son Kullanım',
      dataIndex: 'lastUsed',
      key: 'lastUsed',
      render: (lastUsed: string) => (
        <div className="last-used">
          <CalendarOutlined style={{ marginRight: '4px', color: '#64748b' }} />
          {lastUsed}
        </div>
      ),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (record: any) => (
        <Space size="small">
          <Tooltip title="Kopyala">
            <Button 
              type="text" 
              icon={<CopyOutlined />} 
              size="small"
              className="action-button"
            />
          </Tooltip>
          <Tooltip title="Düzenle">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              className="action-button"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? 'Askıya Al' : 'Etkinleştir'}>
            <Button 
              type="text" 
              icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />} 
              size="small"
              className="action-button"
              style={{ color: record.status === 'active' ? '#ef4444' : '#10b981' }}
            />
          </Tooltip>
          <Tooltip title="Sil">
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              size="small"
              className="action-button delete-button"
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const usageLogColumns = [
    {
      title: 'Endpoint',
      dataIndex: 'endpoint',
      key: 'endpoint',
      render: (endpoint: string) => (
        <Text code style={{ fontSize: '12px' }}>{endpoint}</Text>
      ),
    },
    {
      title: 'Metod',
      dataIndex: 'method',
      key: 'method',
      render: (method: string) => (
        <Tag color={getMethodColor(method)} className="method-tag">
          {method}
        </Tag>
      ),
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <div className="status-info">
          {getStatusIcon(status)}
          <span className="status-code">{status}</span>
        </div>
      ),
    },
    {
      title: 'Yanıt Süresi',
      dataIndex: 'responseTime',
      key: 'responseTime',
      render: (time: number) => (
        <Text type="secondary">{time}ms</Text>
      ),
    },
    {
      title: 'Tenant',
      dataIndex: 'tenant',
      key: 'tenant',
      render: (tenant: string) => (
        <div className="tenant-info">
          <UserOutlined style={{ marginRight: '8px', color: '#64748b' }} />
          {tenant}
        </div>
      ),
    },
    {
      title: 'IP Adresi',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      render: (ip: string) => (
        <Text code style={{ fontSize: '12px' }}>{ip}</Text>
      ),
    },
    {
      title: 'Zaman',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => (
        <div className="timestamp">
          <CalendarOutlined style={{ marginRight: '4px', color: '#64748b' }} />
          {timestamp}
        </div>
      ),
    },
  ]

  const handleEdit = (apiKey: any) => {
    setEditingApi(apiKey)
    form.setFieldsValue(apiKey)
    setIsModalVisible(true)
  }

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      console.log('Form values:', values)
      setIsModalVisible(false)
      setEditingApi(null)
      form.resetFields()
    })
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    setEditingApi(null)
    form.resetFields()
  }

  const handleKeyModalOk = () => {
    keyForm.validateFields().then((values) => {
      console.log('Key form values:', values)
      setIsKeyModalVisible(false)
      keyForm.resetFields()
    })
  }

  const handleKeyModalCancel = () => {
    setIsKeyModalVisible(false)
    keyForm.resetFields()
  }

  return (
    <PageContainer
      header={{
        title: (
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
              <ApiOutlined style={{ fontSize: '20px', color: 'white' }} />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, color: '#1e293b' }}>
                API Yönetimi
              </Title>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                API anahtarlarını yönetin, kullanım istatistiklerini izleyin ve erişim kontrolü sağlayın.
              </Text>
            </div>
          </div>
        ),
        breadcrumb: {},
      }}
    >
      <div className="api-management-container">
        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          {apiStats.map((stat, index) => (
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
                    <div className={`stat-change ${stat.changeType}`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
                <div className="stat-card-overlay"></div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} className="mb-6">
          {/* API Keys Management */}
          <Col xs={24} lg={16}>
            <ProCard
              title={
                <div className="flex items-center space-x-2">
                  <KeyOutlined style={{ color: '#10b981', fontSize: '18px' }} />
                  <span style={{ color: '#1e293b', fontWeight: 600 }}>API Anahtarları</span>
                </div>
              }
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsKeyModalVisible(true)}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  Yeni API Anahtarı
                </Button>
              }
              className="api-keys-card"
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0'
              }}
            >
              <Table
                columns={apiKeyColumns}
                dataSource={apiKeys}
                rowKey="id"
                pagination={{
                  total: apiKeys.length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} API anahtarı`,
                }}
                className="api-keys-table"
              />
            </ProCard>
          </Col>

          {/* Quick Actions & Info */}
          <Col xs={24} lg={8}>
            <ProCard
              title={
                <div className="flex items-center space-x-2">
                  <SettingOutlined style={{ color: '#8b5cf6', fontSize: '18px' }} />
                  <span style={{ color: '#1e293b', fontWeight: 600 }}>Hızlı İşlemler</span>
                </div>
              }
              className="actions-card"
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0'
              }}
            >
              <div className="quick-actions">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  block
                  onClick={() => setIsKeyModalVisible(true)}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    border: 'none',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}
                >
                  Yeni API Anahtarı
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  size="large"
                  block
                  style={{
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}
                >
                  Kullanımı Yenile
                </Button>
                <Button
                  icon={<SafetyOutlined />}
                  size="large"
                  block
                  style={{
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}
                >
                  Güvenlik Raporu
                </Button>
                <Button
                  icon={<GlobalOutlined />}
                  size="large"
                  block
                  style={{
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                >
                  API Dokümantasyonu
                </Button>
              </div>

              <Divider />

              <div className="api-info">
                <Title level={5} style={{ marginBottom: '16px' }}>API İstatistikleri</Title>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Toplam Endpoint">24</Descriptions.Item>
                  <Descriptions.Item label="Aktif Anahtarlar">18</Descriptions.Item>
                  <Descriptions.Item label="Günlük Çağrı">45,230</Descriptions.Item>
                  <Descriptions.Item label="Ortalama Yanıt">145ms</Descriptions.Item>
                </Descriptions>
              </div>
            </ProCard>
          </Col>
        </Row>

        {/* API Usage Logs */}
        <ProCard
          title={
            <div className="flex items-center space-x-2">
              <CloudOutlined style={{ color: '#f59e0b', fontSize: '18px' }} />
              <span style={{ color: '#1e293b', fontWeight: 600 }}>API Kullanım Logları</span>
            </div>
          }
          className="logs-card"
          style={{
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0'
          }}
        >
          <Table
            columns={usageLogColumns}
            dataSource={apiUsageLogs}
            rowKey="id"
            pagination={{
              total: apiUsageLogs.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} log`,
            }}
            className="usage-logs-table"
          />
        </ProCard>

        {/* Edit API Key Modal */}
        <Modal
          title={
            <div className="flex items-center space-x-2">
              <EditOutlined style={{ color: '#3b82f6' }} />
              <span>{editingApi ? 'API Anahtarı Düzenle' : 'Yeni API Anahtarı'}</span>
            </div>
          }
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          width={600}
          okText="Kaydet"
          cancelText="İptal"
        >
          <Form
            form={form}
            layout="vertical"
            className="api-form"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="API Anahtarı Adı"
                  rules={[{ required: true, message: 'Ad gerekli!' }]}
                >
                  <Input placeholder="API Anahtarı Adı" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="tenant"
                  label="Tenant"
                  rules={[{ required: true, message: 'Tenant seçin!' }]}
                >
                  <Select placeholder="Tenant seçin">
                    <Option value="ABC Şirketi">ABC Şirketi</Option>
                    <Option value="XYZ Ltd.">XYZ Ltd.</Option>
                    <Option value="DEF Corp.">DEF Corp.</Option>
                    <Option value="GHI Inc.">GHI Inc.</Option>
                    <Option value="JKL Co.">JKL Co.</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="rateLimit"
                  label="Rate Limit (saatlik)"
                  rules={[{ required: true, message: 'Rate limit girin!' }]}
                >
                  <InputNumber 
                    min={1} 
                    max={10000} 
                    style={{ width: '100%' }} 
                    placeholder="1000"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Durum"
                  valuePropName="checked"
                >
                  <Switch 
                    checkedChildren="Aktif" 
                    unCheckedChildren="Pasif"
                    defaultChecked
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="permissions"
              label="İzinler"
              rules={[{ required: true, message: 'En az bir izin seçin!' }]}
            >
              <Select mode="multiple" placeholder="İzinler seçin">
                <Option value="read">Okuma</Option>
                <Option value="write">Yazma</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="description"
              label="Açıklama"
            >
              <TextArea rows={3} placeholder="API anahtarı açıklaması..." />
            </Form.Item>
          </Form>
        </Modal>

        {/* Create API Key Modal */}
        <Modal
          title={
            <div className="flex items-center space-x-2">
              <PlusOutlined style={{ color: '#3b82f6' }} />
              <span>Yeni API Anahtarı Oluştur</span>
            </div>
          }
          open={isKeyModalVisible}
          onOk={handleKeyModalOk}
          onCancel={handleKeyModalCancel}
          width={500}
          okText="Oluştur"
          cancelText="İptal"
        >
          <Form
            form={keyForm}
            layout="vertical"
            className="key-form"
          >
            <Form.Item
              name="name"
              label="API Anahtarı Adı"
              rules={[{ required: true, message: 'Ad gerekli!' }]}
            >
              <Input placeholder="API Anahtarı Adı" />
            </Form.Item>
            <Form.Item
              name="tenant"
              label="Tenant"
              rules={[{ required: true, message: 'Tenant seçin!' }]}
            >
              <Select placeholder="Tenant seçin">
                <Option value="ABC Şirketi">ABC Şirketi</Option>
                <Option value="XYZ Ltd.">XYZ Ltd.</Option>
                <Option value="DEF Corp.">DEF Corp.</Option>
                <Option value="GHI Inc.">GHI Inc.</Option>
                <Option value="JKL Co.">JKL Co.</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="permissions"
              label="İzinler"
              rules={[{ required: true, message: 'En az bir izin seçin!' }]}
            >
              <Select mode="multiple" placeholder="İzinler seçin">
                <Option value="read">Okuma</Option>
                <Option value="write">Yazma</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>
            <Alert
              message="Güvenlik Uyarısı"
              description="API anahtarı oluşturulduktan sonra sadece bir kez gösterilir. Lütfen güvenli bir yerde saklayın."
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          </Form>
        </Modal>

        <style jsx>{`
          .api-management-container {
            padding: 0;
          }
          
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
            margin-bottom: 4px;
          }
          
          .stat-change {
            font-size: 12px;
            font-weight: 600;
          }
          
          .stat-change.increase {
            color: #10b981;
          }
          
          .stat-change.decrease {
            color: #ef4444;
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
          
          .api-keys-card, .actions-card, .logs-card {
            transition: all 0.3s ease;
          }
          
          .api-keys-card:hover, .actions-card:hover, .logs-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
          }
          
          .api-key-info {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          
          .api-key-name {
            display: flex;
            align-items: center;
            font-weight: 600;
            color: #1e293b;
          }
          
          .api-key-preview {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .show-key-button {
            color: #64748b;
            transition: all 0.3s ease;
          }
          
          .show-key-button:hover {
            color: #3b82f6;
            transform: scale(1.1);
          }
          
          .tenant-info {
            display: flex;
            align-items: center;
            font-weight: 500;
          }
          
          .permission-tag {
            font-weight: 600;
            border-radius: 6px;
          }
          
          .usage-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          
          .usage-text {
            font-size: 12px;
            color: #64748b;
            font-weight: 500;
          }
          
          .last-used {
            color: #64748b;
            font-size: 12px;
            display: flex;
            align-items: center;
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
          
          .method-tag {
            font-weight: 600;
            border-radius: 6px;
          }
          
          .status-info {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .status-code {
            font-weight: 600;
            font-family: monospace;
          }
          
          .timestamp {
            color: #64748b;
            font-size: 12px;
            display: flex;
            align-items: center;
          }
          
          .quick-actions {
            padding: 8px 0;
          }
          
          .api-info {
            padding: 8px 0;
          }
          
          .api-keys-table :global(.ant-table-thead > tr > th),
          .usage-logs-table :global(.ant-table-thead > tr > th) {
            background: #f8fafc;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e2e8f0;
          }
          
          .api-keys-table :global(.ant-table-tbody > tr:hover > td),
          .usage-logs-table :global(.ant-table-tbody > tr:hover > td) {
            background: rgba(59, 130, 246, 0.05);
          }
          
          .api-form :global(.ant-form-item-label > label),
          .key-form :global(.ant-form-item-label > label) {
            font-weight: 600;
            color: #374151;
          }
          
          @media (max-width: 768px) {
            .stat-value {
              font-size: 24px;
            }
            
            .stat-title {
              font-size: 12px;
            }
            
            .api-key-info {
              gap: 4px;
            }
            
            .tenant-info {
              flex-direction: column;
              align-items: flex-start;
            }
            
            .tenant-info .anticon {
              margin-bottom: 4px;
              margin-right: 0;
            }
            
            .status-info {
              flex-direction: column;
              align-items: flex-start;
              gap: 4px;
            }
          }
        `}</style>
      </div>
    </PageContainer>
  )
} 