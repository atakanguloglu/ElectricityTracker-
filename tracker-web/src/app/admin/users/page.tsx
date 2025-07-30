'use client';

import React, { useState, useMemo } from 'react';
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
  message,
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
  InputNumber
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

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// Mock data
const mockTenants = [
  { id: 1, name: 'ABC Şirketi', domain: 'abc.com' },
  { id: 2, name: 'XYZ Ltd.', domain: 'xyz.com' },
  { id: 3, name: 'Tech Solutions', domain: 'techsolutions.com' },
  { id: 4, name: 'Global Corp', domain: 'globalcorp.com' },
  { id: 5, name: 'Startup Inc', domain: 'startupinc.com' }
];

const mockUsers = [
  {
    id: 1,
    username: 'admin.abc',
    fullName: 'Ahmet Yılmaz',
    email: 'ahmet@abc.com',
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    role: 'admin',
    roleName: 'Admin',
    isActive: true,
    isLocked: false,
    lastLogin: '2024-01-15T10:30:00Z',
    lastLoginIp: '192.168.1.100',
    loginCount: 156,
    createdAt: '2023-06-15T09:00:00Z',
    phone: '+90 555 123 4567',
    department: 'IT',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet'
  },
  {
    id: 2,
    username: 'muhasebe.abc',
    fullName: 'Fatma Demir',
    email: 'fatma@abc.com',
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    role: 'accountant',
    roleName: 'Muhasebeci',
    isActive: true,
    isLocked: false,
    lastLogin: '2024-01-14T16:45:00Z',
    lastLoginIp: '192.168.1.101',
    loginCount: 89,
    createdAt: '2023-08-20T14:30:00Z',
    phone: '+90 555 234 5678',
    department: 'Muhasebe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatma'
  },
  {
    id: 3,
    username: 'analist.xyz',
    fullName: 'Mehmet Kaya',
    email: 'mehmet@xyz.com',
    tenantId: 2,
    tenantName: 'XYZ Ltd.',
    role: 'analyst',
    roleName: 'Analist',
    isActive: true,
    isLocked: false,
    lastLogin: '2024-01-15T08:15:00Z',
    lastLoginIp: '192.168.2.50',
    loginCount: 234,
    createdAt: '2023-05-10T11:20:00Z',
    phone: '+90 555 345 6789',
    department: 'Analiz',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mehmet'
  },
  {
    id: 4,
    username: 'rapor.tech',
    fullName: 'Ayşe Özkan',
    email: 'ayse@techsolutions.com',
    tenantId: 3,
    tenantName: 'Tech Solutions',
    role: 'viewer',
    roleName: 'Rapor Görücü',
    isActive: false,
    isLocked: true,
    lastLogin: '2024-01-10T12:00:00Z',
    lastLoginIp: '192.168.3.25',
    loginCount: 45,
    createdAt: '2023-09-05T15:45:00Z',
    phone: '+90 555 456 7890',
    department: 'Raporlama',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayse'
  },
  {
    id: 5,
    username: 'admin.global',
    fullName: 'Can Yıldız',
    email: 'can@globalcorp.com',
    tenantId: 4,
    tenantName: 'Global Corp',
    role: 'admin',
    roleName: 'Admin',
    isActive: true,
    isLocked: false,
    lastLogin: '2024-01-15T09:30:00Z',
    lastLoginIp: '192.168.4.10',
    loginCount: 312,
    createdAt: '2023-04-12T10:15:00Z',
    phone: '+90 555 567 8901',
    department: 'Yönetim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Can'
  }
];

const mockLoginHistory = [
  {
    id: 1,
    userId: 1,
    username: 'admin.abc',
    loginTime: '2024-01-15T10:30:00Z',
    logoutTime: '2024-01-15T17:45:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'success',
    sessionDuration: '7h 15m'
  },
  {
    id: 2,
    userId: 1,
    username: 'admin.abc',
    loginTime: '2024-01-14T09:15:00Z',
    logoutTime: '2024-01-14T18:30:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'success',
    sessionDuration: '9h 15m'
  },
  {
    id: 3,
    userId: 2,
    username: 'muhasebe.abc',
    loginTime: '2024-01-14T16:45:00Z',
    logoutTime: '2024-01-14T19:20:00Z',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    status: 'success',
    sessionDuration: '2h 35m'
  },
  {
    id: 4,
    userId: 4,
    username: 'rapor.tech',
    loginTime: '2024-01-10T12:00:00Z',
    logoutTime: null,
    ipAddress: '192.168.3.25',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'failed',
    sessionDuration: null
  }
];

const roleOptions = [
  { value: 'admin', label: 'Admin', icon: <CrownOutlined />, color: '#ff4d4f' },
  { value: 'accountant', label: 'Muhasebeci', icon: <CalculatorOutlined />, color: '#1890ff' },
  { value: 'analyst', label: 'Analist', icon: <BarChartOutlined />, color: '#52c41a' },
  { value: 'viewer', label: 'Rapor Görücü', icon: <FileTextOutlined />, color: '#722ed1' }
];

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [loginHistory, setLoginHistory] = useState(mockLoginHistory);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    tenantId: undefined,
    role: undefined,
    isActive: undefined,
    isLocked: undefined
  });

  // Statistics
  const stats = useMemo(() => [
    {
      title: 'Toplam Kullanıcı',
      value: users.length,
      icon: <TeamOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Aktif Kullanıcılar',
      value: users.filter(u => u.isActive).length,
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
      title: 'Kilitli Hesaplar',
      value: users.filter(u => u.isLocked).length,
      icon: <LockOutlined />,
      color: '#ff4d4f',
      gradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
    },
    {
      title: 'Bugün Giriş Yapan',
      value: users.filter(u => {
        const today = new Date().toDateString();
        const lastLogin = new Date(u.lastLogin).toDateString();
        return lastLogin === today;
      }).length,
      icon: <ClockCircleOutlined />,
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  ], [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (filters.tenantId && user.tenantId !== filters.tenantId) return false;
      if (filters.role && user.role !== filters.role) return false;
      if (filters.isActive !== undefined && user.isActive !== filters.isActive) return false;
      if (filters.isLocked !== undefined && user.isLocked !== filters.isLocked) return false;
      return true;
    });
  }, [users, filters]);

  const getRoleIcon = (role: string) => {
    const roleOption = roleOptions.find(r => r.value === role);
    return roleOption?.icon || <UserOutlined />;
  };

  const getRoleColor = (role: string) => {
    const roleOption = roleOptions.find(r => r.value === role);
    return roleOption?.color || '#666';
  };

  const getStatusIcon = (isActive: boolean, isLocked: boolean) => {
    if (isLocked) return <LockOutlined style={{ color: '#ff4d4f' }} />;
    if (isActive) return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
  };

  const getStatusText = (isActive: boolean, isLocked: boolean) => {
    if (isLocked) return 'Kilitli';
    if (isActive) return 'Aktif';
    return 'Pasif';
  };

  const getStatusColor = (isActive: boolean, isLocked: boolean) => {
    if (isLocked) return 'error';
    if (isActive) return 'success';
    return 'default';
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Kullanıcı',
      key: 'user',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} size={40}>
            {record.fullName.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.fullName}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.username}</div>
          </div>
        </Space>
      )
    },
    {
      title: 'E-posta',
      dataIndex: 'email',
      key: 'email',
      width: 180
    },
    {
      title: 'Tenant',
      dataIndex: 'tenantName',
      key: 'tenantName',
      width: 150,
      render: (tenantName) => (
        <Tag color="blue" icon={<GlobalOutlined />}>
          {tenantName}
        </Tag>
      )
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      width: 150,
      render: (role) => (
        <Tag color={getRoleColor(role)} icon={getRoleIcon(role)}>
          {roleOptions.find(r => r.value === role)?.label}
        </Tag>
      )
    },
    {
      title: 'Durum',
      key: 'status',
      width: 120,
      render: (_, record) => (
        <Badge
          status={getStatusColor(record.isActive, record.isLocked) as any}
          text={getStatusText(record.isActive, record.isLocked)}
        />
      )
    },
    {
      title: 'Son Giriş',
      key: 'lastLogin',
      width: 180,
      render: (_, record) => (
        <div>
          <div>{new Date(record.lastLogin).toLocaleDateString('tr-TR')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.lastLoginIp}
          </div>
        </div>
      )
    },
    {
      title: 'Giriş Sayısı',
      dataIndex: 'loginCount',
      key: 'loginCount',
      width: 100,
      render: (count) => (
        <Tag color="geekblue">
          {count} giriş
        </Tag>
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="Giriş Geçmişi">
            <Button
              type="text"
              icon={<ClockCircleOutlined />}
              onClick={() => handleViewHistory(record)}
            />
          </Tooltip>
          <Tooltip title="Düzenle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title={record.isLocked ? 'Kilidi Aç' : 'Kilitle'}>
            <Button
              type="text"
              icon={record.isLocked ? <UnlockOutlined /> : <LockOutlined />}
              onClick={() => handleToggleLock(record)}
            />
          </Tooltip>
          <Tooltip title="Şifre Sıfırla">
            <Button
              type="text"
              icon={<KeyOutlined />}
              onClick={() => handleResetPassword(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Kullanıcıyı silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDelete(record.id)}
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
  ];

  const loginHistoryColumns: ColumnsType<any> = [
    {
      title: 'Giriş Zamanı',
      dataIndex: 'loginTime',
      key: 'loginTime',
      render: (time) => new Date(time).toLocaleString('tr-TR')
    },
    {
      title: 'Çıkış Zamanı',
      dataIndex: 'logoutTime',
      key: 'logoutTime',
      render: (time) => time ? new Date(time).toLocaleString('tr-TR') : '-'
    },
    {
      title: 'IP Adresi',
      dataIndex: 'ipAddress',
      key: 'ipAddress'
    },
    {
      title: 'Süre',
      dataIndex: 'sessionDuration',
      key: 'sessionDuration',
      render: (duration) => duration || '-'
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'success' ? 'success' : 'error'}>
          {status === 'success' ? 'Başarılı' : 'Başarısız'}
        </Tag>
      )
    }
  ];

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
      isActive: user.isActive,
      isLocked: user.isLocked,
      phone: user.phone,
      department: user.department
    });
    setIsModalVisible(true);
  };

  const handleViewHistory = (user: any) => {
    setSelectedUser(user);
    setIsHistoryModalVisible(true);
  };

  const handleToggleLock = (user: any) => {
    const updatedUsers = users.map(u =>
      u.id === user.id ? { ...u, isLocked: !u.isLocked } : u
    );
    setUsers(updatedUsers);
    message.success(`Kullanıcı ${user.isLocked ? 'kilidi açıldı' : 'kilitlendi'}`);
  };

  const handleResetPassword = (user: any) => {
    message.success(`${user.fullName} için şifre sıfırlama e-postası gönderildi`);
  };

  const handleDelete = (userId: number) => {
    setUsers(users.filter(u => u.id !== userId));
    message.success('Kullanıcı silindi');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        // Update existing user
        const updatedUsers = users.map(u =>
          u.id === editingUser.id ? { ...u, ...values } : u
        );
        setUsers(updatedUsers);
        message.success('Kullanıcı güncellendi');
      } else {
        // Add new user
        const newUser = {
          id: Math.max(...users.map(u => u.id)) + 1,
          ...values,
          tenantName: mockTenants.find(t => t.id === values.tenantId)?.name,
          roleName: roleOptions.find(r => r.value === values.role)?.label,
          lastLogin: null,
          lastLoginIp: null,
          loginCount: 0,
          createdAt: new Date().toISOString(),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.fullName}`
        };
        setUsers([...users, newUser]);
        message.success('Kullanıcı oluşturuldu');
      }
      setIsModalVisible(false);
    });
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      tenantId: undefined,
      role: undefined,
      isActive: undefined,
      isLocked: undefined
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <TeamOutlined /> Kullanıcı Yönetimi
      </Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              style={{
                background: stat.gradient,
                color: 'white',
                border: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stat.value}</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>{stat.title}</div>
                </div>
                <div style={{ fontSize: '32px', opacity: 0.8 }}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
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
            >
              {mockTenants.map(tenant => (
                <Option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Rol Seçin"
              style={{ width: '100%' }}
              value={filters.role}
              onChange={(value) => handleFilterChange('role', value)}
              allowClear
            >
              {roleOptions.map(role => (
                <Option key={role.value} value={role.value}>
                  {role.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Select
              placeholder="Durum"
              style={{ width: '100%' }}
              value={filters.isActive}
              onChange={(value) => handleFilterChange('isActive', value)}
              allowClear
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
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} / ${total} kullanıcı`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Add/Edit User Modal */}
      <Modal
        title={editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        okText={editingUser ? 'Güncelle' : 'Oluştur'}
        cancelText="İptal"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Kullanıcı Adı"
                rules={[{ required: true, message: 'Kullanıcı adı gerekli!' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Ad Soyad"
                rules={[{ required: true, message: 'Ad soyad gerekli!' }]}
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
                <Select placeholder="Tenant seçin">
                  {mockTenants.map(tenant => (
                    <Option key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Rol"
                rules={[{ required: true, message: 'Rol seçin!' }]}
              >
                <Select placeholder="Rol seçin">
                  {roleOptions.map(role => (
                    <Option key={role.value} value={role.value}>
                      <Space>
                        {role.icon}
                        {role.label}
                      </Space>
                    </Option>
                  ))}
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

          {editingUser && (
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
        open={isHistoryModalVisible}
        onCancel={() => setIsHistoryModalVisible(false)}
        width={800}
        footer={null}
      >
        <Table
          columns={loginHistoryColumns}
          dataSource={loginHistory.filter(h => h.userId === selectedUser?.id)}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Modal>
    </div>
  );
} 