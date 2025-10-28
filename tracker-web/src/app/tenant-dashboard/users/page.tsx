'use client'

import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Switch,
  Typography,
  Row,
  Col,
  Statistic,
  Tooltip,
  Popconfirm,
  message,
  App,
  Avatar,
  Badge,
  Divider
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  TeamOutlined,
  CrownOutlined,
  SettingOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { getUser } from '@/utils/auth'

const { Title, Text } = Typography
const { Option } = Select

// User interface
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  departmentName?: string;
  createdAt: string;
  lastLoginAt?: string;
}

// Department interface
interface Department {
  id: number;
  name: string;
  description?: string;
}

export default function TenantUsersPage() {
  const { message: messageApi } = App.useApp()
  const [users, setUsers] = useState<User[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'edit'>('create')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [form] = Form.useForm()

  const currentUser = getUser()

  useEffect(() => {
    if (currentUser?.tenantId) {
      loadUsers()
      loadDepartments()
    }
  }, [currentUser])

  const loadUsers = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      const mockUsers: User[] = [
        {
          id: 1,
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          email: 'ahmet.yilmaz@company.com',
          phone: '+90 555 123 4567',
          role: 'Admin',
          isActive: true,
          departmentName: 'IT',
          createdAt: '2024-01-15',
          lastLoginAt: '2024-01-20'
        },
        {
          id: 2,
          firstName: 'Fatma',
          lastName: 'Demir',
          email: 'fatma.demir@company.com',
          phone: '+90 555 987 6543',
          role: 'Manager',
          isActive: true,
          departmentName: 'Operations',
          createdAt: '2024-01-10',
          lastLoginAt: '2024-01-19'
        },
        {
          id: 3,
          firstName: 'Mehmet',
          lastName: 'Kaya',
          email: 'mehmet.kaya@company.com',
          phone: '+90 555 456 7890',
          role: 'User',
          isActive: false,
          departmentName: 'Sales',
          createdAt: '2024-01-05',
          lastLoginAt: '2024-01-15'
        }
      ]
      setUsers(mockUsers)
    } catch (error) {
      console.error('Users load error:', error)
      messageApi.error('Kullanıcılar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const loadDepartments = async () => {
    try {
      // TODO: Replace with actual API call
      const mockDepartments: Department[] = [
        { id: 1, name: 'IT', description: 'Information Technology' },
        { id: 2, name: 'Operations', description: 'Operations Management' },
        { id: 3, name: 'Sales', description: 'Sales & Marketing' },
        { id: 4, name: 'Finance', description: 'Finance & Accounting' }
      ]
      setDepartments(mockDepartments)
    } catch (error) {
      console.error('Departments load error:', error)
    }
  }

  const handleCreateUser = async (values: any) => {
    try {
      // TODO: Replace with actual API call
      const newUser: User = {
        id: users.length + 1,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        role: values.role,
        isActive: true,
        departmentName: departments.find(d => d.id === values.departmentId)?.name,
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      setUsers([...users, newUser])
      setModalVisible(false)
      form.resetFields()
      messageApi.success('Kullanıcı başarıyla oluşturuldu')
    } catch (error) {
      console.error('Create user error:', error)
      messageApi.error('Kullanıcı oluşturulamadı')
    }
  }

  const handleEditUser = async (values: any) => {
    try {
      // TODO: Replace with actual API call
      const updatedUsers = users.map(user => 
        user.id === selectedUser?.id 
          ? { 
              ...user, 
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              phone: values.phone,
              role: values.role,
              departmentName: departments.find(d => d.id === values.departmentId)?.name
            }
          : user
      )
      
      setUsers(updatedUsers)
      setModalVisible(false)
      setSelectedUser(null)
      form.resetFields()
      messageApi.success('Kullanıcı başarıyla güncellendi')
    } catch (error) {
      console.error('Update user error:', error)
      messageApi.error('Kullanıcı güncellenemedi')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      // TODO: Replace with actual API call
      setUsers(users.filter(user => user.id !== userId))
      messageApi.success('Kullanıcı başarıyla silindi')
    } catch (error) {
      console.error('Delete user error:', error)
      messageApi.error('Kullanıcı silinemedi')
    }
  }

  const handleToggleUserStatus = async (userId: number) => {
    try {
      // TODO: Replace with actual API call
      const updatedUsers = users.map(user => 
        user.id === userId 
          ? { ...user, isActive: !user.isActive }
          : user
      )
      
      setUsers(updatedUsers)
      messageApi.success(`Kullanıcı ${users.find(u => u.id === userId)?.isActive ? 'deaktif' : 'aktif'} edildi`)
    } catch (error) {
      console.error('Toggle user status error:', error)
      messageApi.error('Kullanıcı durumu değiştirilemedi')
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'red'
      case 'manager': return 'blue'
      case 'user': return 'green'
      default: return 'default'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return <CrownOutlined />
      case 'manager': return <SettingOutlined />
      case 'user': return <UserOutlined />
      default: return <UserOutlined />
    }
  }

  const columns = [
    {
      title: 'Kullanıcı',
      key: 'user',
      render: (record: User) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold' }}>
              {record.firstName} {record.lastName}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.email}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={getRoleColor(role)} icon={getRoleIcon(role)}>
          {role}
        </Tag>
      )
    },
    {
      title: 'Departman',
      dataIndex: 'departmentName',
      key: 'departmentName',
      render: (departmentName: string) => (
        <Tag color="blue">{departmentName || 'Atanmamış'}</Tag>
      )
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || '-'
    },
    {
      title: 'Durum',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Aktif' : 'Pasif'}
        </Tag>
      )
    },
    {
      title: 'Son Giriş',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      render: (lastLoginAt: string) => lastLoginAt || 'Hiç giriş yapmamış'
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (record: User) => (
        <Space>
          <Tooltip title="Düzenle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedUser(record)
                setModalType('edit')
                form.setFieldsValue({
                  firstName: record.firstName,
                  lastName: record.lastName,
                  email: record.email,
                  phone: record.phone,
                  role: record.role,
                  departmentId: departments.find(d => d.name === record.departmentName)?.id
                })
                setModalVisible(true)
              }}
            />
          </Tooltip>
          <Tooltip title={record.isActive ? 'Deaktif Et' : 'Aktif Et'}>
            <Button
              type="text"
              icon={record.isActive ? <LockOutlined /> : <UnlockOutlined />}
              onClick={() => handleToggleUserStatus(record.id)}
            />
          </Tooltip>
          <Popconfirm
            title="Kullanıcıyı silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Tooltip title="Sil">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ]

  // Statistics
  const stats = [
    {
      title: 'Toplam Kullanıcı',
      value: users.length,
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      color: '#1890ff'
    },
    {
      title: 'Aktif Kullanıcı',
      value: users.filter(u => u.isActive).length,
      icon: <UserOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      color: '#52c41a'
    },
    {
      title: 'Admin Kullanıcı',
      value: users.filter(u => u.role === 'Admin').length,
      icon: <CrownOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
      color: '#faad14'
    },
    {
      title: 'Departman Sayısı',
      value: departments.length,
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      color: '#722ed1'
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <TeamOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          Kullanıcı Yönetimi
        </Title>
        <Text type="secondary">
          Tenant'ınıza ait kullanıcıları yönetin ve yeni kullanıcılar ekleyin
        </Text>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Users Table */}
      <Card
        title="Kullanıcı Listesi"
        extra={
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={loadUsers}
              loading={loading}
            >
              Yenile
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                setModalType('create')
                setSelectedUser(null)
                form.resetFields()
                setModalVisible(true)
              }}
            >
              Yeni Kullanıcı
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kullanıcı`
          }}
          locale={{
            emptyText: 'Henüz kullanıcı bulunmuyor'
          }}
        />
      </Card>

      {/* Create/Edit User Modal */}
      <Modal
        title={modalType === 'create' ? 'Yeni Kullanıcı Ekle' : 'Kullanıcı Düzenle'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setSelectedUser(null)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={modalType === 'create' ? handleCreateUser : handleEditUser}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="Ad"
                rules={[{ required: true, message: 'Ad gerekli' }]}
              >
                <Input placeholder="Kullanıcı adı" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Soyad"
                rules={[{ required: true, message: 'Soyad gerekli' }]}
              >
                <Input placeholder="Kullanıcı soyadı" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="E-posta"
            rules={[
              { required: true, message: 'E-posta gerekli' },
              { type: 'email', message: 'Geçerli e-posta adresi girin' }
            ]}
          >
            <Input placeholder="kullanici@company.com" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefon"
          >
            <Input placeholder="+90 555 123 4567" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Rol"
                rules={[{ required: true, message: 'Rol gerekli' }]}
              >
                <Select placeholder="Rol seçin">
                  <Option value="User">Kullanıcı</Option>
                  <Option value="Manager">Yönetici</Option>
                  <Option value="Admin">Admin</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="departmentId"
                label="Departman"
              >
                <Select placeholder="Departman seçin" allowClear>
                  {departments.map(dept => (
                    <Option key={dept.id} value={dept.id}>
                      {dept.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                icon={modalType === 'create' ? <PlusOutlined /> : <EditOutlined />}
              >
                {modalType === 'create' ? 'Oluştur' : 'Güncelle'}
              </Button>
              <Button onClick={() => {
                setModalVisible(false)
                setSelectedUser(null)
                form.resetFields()
              }}>
                İptal
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
