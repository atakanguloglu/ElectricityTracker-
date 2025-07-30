'use client'

import React, { useState } from 'react'
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Tag, 
  Avatar, 
  Modal, 
  Form, 
  Select, 
  Switch,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Badge,
  Tooltip
} from 'antd'
import { 
  ProCard,
  PageContainer 
} from '@ant-design/pro-components'
import { 
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
  TeamOutlined,
  CrownOutlined,
  UserSwitchOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Search } = Input
const { Option } = Select

export default function UserManagementPage() {
  const [searchText, setSearchText] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [form] = Form.useForm()

  // Mock user data
  const users = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet.yilmaz@example.com',
      role: 'admin',
      status: 'active',
      tenant: 'ABC Şirketi',
      lastLogin: '2024-01-15 10:30',
      avatar: 'AY',
      phone: '+90 555 123 4567',
      createdAt: '2023-12-01'
    },
    {
      id: 2,
      name: 'Fatma Demir',
      email: 'fatma.demir@example.com',
      role: 'manager',
      status: 'active',
      tenant: 'XYZ Ltd.',
      lastLogin: '2024-01-15 09:15',
      avatar: 'FD',
      phone: '+90 555 987 6543',
      createdAt: '2023-11-15'
    },
    {
      id: 3,
      name: 'Mehmet Kaya',
      email: 'mehmet.kaya@example.com',
      role: 'user',
      status: 'inactive',
      tenant: 'DEF Corp.',
      lastLogin: '2024-01-10 14:20',
      avatar: 'MK',
      phone: '+90 555 456 7890',
      createdAt: '2023-10-20'
    },
    {
      id: 4,
      name: 'Ayşe Özkan',
      email: 'ayse.ozkan@example.com',
      role: 'manager',
      status: 'active',
      tenant: 'GHI Inc.',
      lastLogin: '2024-01-15 11:45',
      avatar: 'AÖ',
      phone: '+90 555 321 0987',
      createdAt: '2023-09-10'
    },
    {
      id: 5,
      name: 'Ali Çelik',
      email: 'ali.celik@example.com',
      role: 'user',
      status: 'active',
      tenant: 'JKL Co.',
      lastLogin: '2024-01-14 16:30',
      avatar: 'AÇ',
      phone: '+90 555 654 3210',
      createdAt: '2023-08-25'
    }
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red'
      case 'manager': return 'blue'
      case 'user': return 'green'
      default: return 'default'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <CrownOutlined />
      case 'manager': return <UserSwitchOutlined />
      case 'user': return <UserOutlined />
      default: return <UserOutlined />
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'green' : 'red'
  }

  const columns = [
    {
      title: 'Kullanıcı',
      key: 'user',
      render: (record: any) => (
        <div className="user-info">
          <Avatar 
            size={40}
            style={{ 
              backgroundColor: '#3b82f6',
              marginRight: '12px'
            }}
          >
            {record.avatar}
          </Avatar>
          <div>
            <div className="user-name">{record.name}</div>
            <div className="user-email">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag 
          color={getRoleColor(role)} 
          icon={getRoleIcon(role)}
          className="role-tag"
        >
          {role === 'admin' ? 'Admin' : role === 'manager' ? 'Yönetici' : 'Kullanıcı'}
        </Tag>
      ),
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'active' ? 'success' : 'error'} 
          text={status === 'active' ? 'Aktif' : 'Pasif'}
        />
      ),
    },
    {
      title: 'Tenant',
      dataIndex: 'tenant',
      key: 'tenant',
      render: (tenant: string) => (
        <Tag color="blue" className="tenant-tag">
          {tenant}
        </Tag>
      ),
    },
    {
      title: 'Son Giriş',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (lastLogin: string) => (
        <div className="last-login">
          <CalendarOutlined style={{ marginRight: '4px', color: '#64748b' }} />
          {lastLogin}
        </div>
      ),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (record: any) => (
        <Space size="small">
          <Tooltip title="Görüntüle">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
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
          <Tooltip title={record.status === 'active' ? 'Devre Dışı Bırak' : 'Etkinleştir'}>
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

  const handleEdit = (user: any) => {
    setEditingUser(user)
    form.setFieldsValue(user)
    setIsModalVisible(true)
  }

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      console.log('Form values:', values)
      setIsModalVisible(false)
      setEditingUser(null)
      form.resetFields()
    })
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    setEditingUser(null)
    form.resetFields()
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase()) ||
    user.tenant.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <PageContainer
      header={{
        title: (
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
              <TeamOutlined style={{ fontSize: '20px', color: 'white' }} />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, color: '#1e293b' }}>
                Kullanıcı Yönetimi
              </Title>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                Sistem kullanıcılarını yönetin, rollerini düzenleyin ve durumlarını kontrol edin.
              </Text>
            </div>
          </div>
        ),
        breadcrumb: {},
      }}
    >
      <div className="user-management-container">
        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none', borderRadius: '12px' }}>
              <div className="stat-content">
                <div className="stat-icon">
                  <UserOutlined style={{ fontSize: '24px', color: 'white' }} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">156</div>
                  <div className="stat-title">Toplam Kullanıcı</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '12px' }}>
              <div className="stat-content">
                <div className="stat-icon">
                  <UserOutlined style={{ fontSize: '24px', color: 'white' }} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">142</div>
                  <div className="stat-title">Aktif Kullanıcı</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', borderRadius: '12px' }}>
              <div className="stat-content">
                <div className="stat-icon">
                  <CrownOutlined style={{ fontSize: '24px', color: 'white' }} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">8</div>
                  <div className="stat-title">Admin</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', border: 'none', borderRadius: '12px' }}>
              <div className="stat-content">
                <div className="stat-icon">
                  <UserSwitchOutlined style={{ fontSize: '24px', color: 'white' }} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">24</div>
                  <div className="stat-title">Yönetici</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Search and Actions */}
        <ProCard
          className="search-card"
          style={{
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0',
            marginBottom: '24px'
          }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12}>
              <Search
                placeholder="Kullanıcı ara..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="search-input"
              />
            </Col>
            <Col xs={24} md={12} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => setIsModalVisible(true)}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  border: 'none',
                  borderRadius: '8px'
                }}
              >
                Yeni Kullanıcı Ekle
              </Button>
            </Col>
          </Row>
        </ProCard>

        {/* Users Table */}
        <ProCard
          className="table-card"
          style={{
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0'
          }}
        >
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            pagination={{
              total: filteredUsers.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kullanıcı`,
            }}
            className="users-table"
          />
        </ProCard>

        {/* Edit User Modal */}
        <Modal
          title={
            <div className="flex items-center space-x-2">
              <EditOutlined style={{ color: '#3b82f6' }} />
              <span>{editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}</span>
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
            className="user-form"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Ad Soyad"
                  rules={[{ required: true, message: 'Ad soyad gerekli!' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Ad Soyad" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="E-posta"
                  rules={[
                    { required: true, message: 'E-posta gerekli!' },
                    { type: 'email', message: 'Geçerli bir e-posta girin!' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="E-posta" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Telefon"
                  rules={[{ required: true, message: 'Telefon gerekli!' }]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="Telefon" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="role"
                  label="Rol"
                  rules={[{ required: true, message: 'Rol seçin!' }]}
                >
                  <Select placeholder="Rol seçin">
                    <Option value="user">Kullanıcı</Option>
                    <Option value="manager">Yönetici</Option>
                    <Option value="admin">Admin</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
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
          </Form>
        </Modal>

        <style jsx>{`
          .user-management-container {
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
          
          .stat-content {
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
          
          .search-card, .table-card {
            transition: all 0.3s ease;
          }
          
          .search-card:hover, .table-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
          }
          
          .search-input :global(.ant-input-search-button) {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            border: none;
            border-radius: 0 6px 6px 0;
          }
          
          .user-info {
            display: flex;
            align-items: center;
          }
          
          .user-name {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 2px;
          }
          
          .user-email {
            font-size: 12px;
            color: #64748b;
          }
          
          .role-tag, .tenant-tag {
            font-weight: 600;
            border-radius: 6px;
          }
          
          .last-login {
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
          
          .users-table :global(.ant-table-thead > tr > th) {
            background: #f8fafc;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e2e8f0;
          }
          
          .users-table :global(.ant-table-tbody > tr:hover > td) {
            background: rgba(59, 130, 246, 0.05);
          }
          
          .user-form :global(.ant-form-item-label > label) {
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
            
            .user-info {
              flex-direction: column;
              align-items: flex-start;
            }
            
            .user-info .ant-avatar {
              margin-bottom: 8px;
              margin-right: 0;
            }
          }
        `}</style>
      </div>
    </PageContainer>
  )
} 