'use client';

import React, { useState, useMemo, useCallback } from 'react';
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
  Progress,
  Statistic,
  Tabs,
  List,
  Descriptions,
  DatePicker,
  InputNumber,
  Alert,
  Collapse,
  App
} from 'antd';
import {
  ApiOutlined,
  KeyOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CopyOutlined,
  ReloadOutlined,
  BarChartOutlined,
  SettingOutlined,
  SafetyOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  LinkOutlined,
  DownloadOutlined,
  UploadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// Mock data
const mockTenants = [
  { id: 1, name: 'ABC Şirketi', domain: 'abc.com' },
  { id: 2, name: 'XYZ Ltd.', domain: 'xyz.com' },
  { id: 3, name: 'Tech Solutions', domain: 'techsolutions.com' },
  { id: 4, name: 'Global Corp', domain: 'globalcorp.com' },
  { id: 5, name: 'Startup Inc', domain: 'startupinc.com' }
];

const mockApiKeys = [
  {
    id: 1,
    name: 'ABC Production API',
    key: 'abc_prod_sk_live_1234567890abcdef',
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    status: 'active',
    permissions: ['read', 'write', 'delete'],
    rateLimit: 1000,
    rateLimitPeriod: 'minute',
    createdAt: '2023-06-15T09:00:00Z',
    lastUsed: '2024-01-15T10:30:00Z',
    totalCalls: 15420,
    errorRate: 0.02,
    webhookUrl: 'https://webhook.abc.com/api/events',
    webhookStatus: 'active'
  },
  {
    id: 2,
    name: 'ABC Development API',
    key: 'abc_dev_sk_test_0987654321fedcba',
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    status: 'active',
    permissions: ['read', 'write'],
    rateLimit: 500,
    rateLimitPeriod: 'minute',
    createdAt: '2023-08-20T14:30:00Z',
    lastUsed: '2024-01-14T16:45:00Z',
    totalCalls: 8234,
    errorRate: 0.05,
    webhookUrl: null,
    webhookStatus: null
  },
  {
    id: 3,
    name: 'XYZ Production API',
    key: 'xyz_prod_sk_live_abcdef1234567890',
    tenantId: 2,
    tenantName: 'XYZ Ltd.',
    status: 'active',
    permissions: ['read', 'write', 'delete', 'admin'],
    rateLimit: 2000,
    rateLimitPeriod: 'minute',
    createdAt: '2023-05-10T11:20:00Z',
    lastUsed: '2024-01-15T08:15:00Z',
    totalCalls: 28756,
    errorRate: 0.01,
    webhookUrl: 'https://api.xyz.com/webhooks/events',
    webhookStatus: 'active'
  },
  {
    id: 4,
    name: 'Tech Solutions API',
    key: 'tech_sol_sk_live_1234567890abcdef',
    tenantId: 3,
    tenantName: 'Tech Solutions',
    status: 'inactive',
    permissions: ['read'],
    rateLimit: 100,
    rateLimitPeriod: 'minute',
    createdAt: '2023-09-05T15:45:00Z',
    lastUsed: '2024-01-10T12:00:00Z',
    totalCalls: 1234,
    errorRate: 0.15,
    webhookUrl: null,
    webhookStatus: null
  },
  {
    id: 5,
    name: 'Global Corp API',
    key: 'global_corp_sk_live_abcdef1234567890',
    tenantId: 4,
    tenantName: 'Global Corp',
    status: 'active',
    permissions: ['read', 'write'],
    rateLimit: 1500,
    rateLimitPeriod: 'minute',
    createdAt: '2023-04-12T10:15:00Z',
    lastUsed: '2024-01-15T09:30:00Z',
    totalCalls: 18923,
    errorRate: 0.03,
    webhookUrl: 'https://webhooks.globalcorp.com/api/v1/events',
    webhookStatus: 'error'
  }
];

const mockApiUsage = [
  {
    id: 1,
    apiKeyId: 1,
    date: '2024-01-15',
    calls: 1250,
    errors: 25,
    avgResponseTime: 245,
    peakHour: '14:00'
  },
  {
    id: 2,
    apiKeyId: 1,
    date: '2024-01-14',
    calls: 1180,
    errors: 18,
    avgResponseTime: 230,
    peakHour: '15:30'
  },
  {
    id: 3,
    apiKeyId: 2,
    date: '2024-01-15',
    calls: 650,
    errors: 32,
    avgResponseTime: 280,
    peakHour: '10:00'
  },
  {
    id: 4,
    apiKeyId: 3,
    date: '2024-01-15',
    calls: 2100,
    errors: 21,
    avgResponseTime: 195,
    peakHour: '16:00'
  }
];

const mockWebhooks = [
  {
    id: 1,
    apiKeyId: 1,
    name: 'ABC Events Webhook',
    url: 'https://webhook.abc.com/api/events',
    events: ['user.created', 'data.updated', 'payment.completed'],
    status: 'active',
    lastDelivery: '2024-01-15T10:30:00Z',
    successRate: 0.98,
    retryCount: 3
  },
  {
    id: 2,
    apiKeyId: 3,
    name: 'XYZ Integration Webhook',
    url: 'https://api.xyz.com/webhooks/events',
    events: ['all'],
    status: 'active',
    lastDelivery: '2024-01-15T08:15:00Z',
    successRate: 0.99,
    retryCount: 5
  },
  {
    id: 3,
    apiKeyId: 5,
    name: 'Global Corp Events',
    url: 'https://webhooks.globalcorp.com/api/v1/events',
    events: ['user.created', 'data.updated'],
    status: 'error',
    lastDelivery: '2024-01-14T18:20:00Z',
    successRate: 0.85,
    retryCount: 3
  }
];

const permissionOptions = [
  { value: 'read', label: 'Okuma', icon: <EyeOutlined />, color: '#1890ff' },
  { value: 'write', label: 'Yazma', icon: <EditOutlined />, color: '#52c41a' },
  { value: 'delete', label: 'Silme', icon: <DeleteOutlined />, color: '#ff4d4f' },
  { value: 'admin', label: 'Admin', icon: <SettingOutlined />, color: '#722ed1' }
];

  const rateLimitPeriods = [
    { value: 'second', label: 'Saniye' },
    { value: 'minute', label: 'Dakika' },
    { value: 'hour', label: 'Saat' },
    { value: 'day', label: 'Gün' }
  ];

export default function ApiManagementPage() {
  const { message } = App.useApp();

  // Memoized options for better performance
  const tenantOptions = useMemo(() => 
    mockTenants.map(tenant => (
      <Option key={tenant.id} value={tenant.id}>
        {tenant.name}
      </Option>
    )), []
  );

  const statusOptions = useMemo(() => [
    <Option key="active" value="active">Aktif</Option>,
    <Option key="inactive" value="inactive">Pasif</Option>
  ], []);

  const webhookOptions = useMemo(() => [
    <Option key="true" value={true}>Webhook Var</Option>,
    <Option key="false" value={false}>Webhook Yok</Option>
  ], []);

  // Memoized options for modal dropdowns
  const modalTenantOptions = useMemo(() => 
    mockTenants.map(tenant => (
      <Option key={tenant.id} value={tenant.id}>
        {tenant.name}
      </Option>
    )), []
  );

  const permissionSelectOptions = useMemo(() => 
    permissionOptions.map(perm => (
      <Option key={perm.value} value={perm.value}>
        <Space>
          {perm.icon}
          {perm.label}
        </Space>
      </Option>
    )), []
  );

  const rateLimitPeriodOptions = useMemo(() => 
    rateLimitPeriods.map(period => (
      <Option key={period.value} value={period.value}>
        {period.label}
      </Option>
    )), []
  );

  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [apiUsage, setApiUsage] = useState(mockApiUsage);
  const [webhooks, setWebhooks] = useState(mockWebhooks);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isWebhookModalVisible, setIsWebhookModalVisible] = useState(false);
  const [editingApiKey, setEditingApiKey] = useState<any>(null);
  const [selectedApiKey, setSelectedApiKey] = useState<any>(null);
  const [showApiKey, setShowApiKey] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [webhookForm] = Form.useForm();
  const [filters, setFilters] = useState({
    tenantId: undefined,
    status: undefined,
    hasWebhook: undefined
  });

  // Statistics
  const stats = useMemo(() => [
    {
      title: 'Toplam API Anahtarı',
      value: apiKeys.length,
      icon: <KeyOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Aktif API Anahtarları',
      value: apiKeys.filter(k => k.status === 'active').length,
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
      title: 'Toplam API Çağrısı (30 gün)',
      value: apiKeys.reduce((sum, key) => sum + key.totalCalls, 0).toLocaleString(),
      icon: <BarChartOutlined />,
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Ortalama Hata Oranı',
      value: `${(apiKeys.reduce((sum, key) => sum + key.errorRate, 0) / apiKeys.length * 100).toFixed(1)}%`,
      icon: <ExclamationCircleOutlined />,
      color: '#ff4d4f',
      gradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
    }
  ], [apiKeys]);

  // Filtered API keys
  const filteredApiKeys = useMemo(() => {
    return apiKeys.filter(key => {
      if (filters.tenantId && key.tenantId !== filters.tenantId) return false;
      if (filters.status && key.status !== filters.status) return false;
      if (filters.hasWebhook !== undefined) {
        const hasWebhook = key.webhookUrl !== null;
        if (filters.hasWebhook !== hasWebhook) return false;
      }
      return true;
    });
  }, [apiKeys, filters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Pasif';
      case 'error': return 'Hata';
      default: return 'Bilinmiyor';
    }
  };

  const getWebhookStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getWebhookStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Pasif';
      case 'error': return 'Hata';
      default: return 'Yok';
    }
  };

  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('API anahtarı kopyalandı!');
  };

  const columns: ColumnsType<any> = [
    {
      title: 'API Anahtarı',
      key: 'apiKey',
      width: 250,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: '4px' }}>{record.name}</div>
          <div style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
            {showApiKey === record.id ? record.key : `${record.key.substring(0, 20)}...`}
            <Button
              type="text"
              size="small"
              icon={showApiKey === record.id ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => setShowApiKey(showApiKey === record.id ? null : record.id)}
              style={{ marginLeft: '8px' }}
            />
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(record.key)}
              style={{ marginLeft: '4px' }}
            />
          </div>
        </div>
      )
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
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Badge
          status={getStatusColor(status) as any}
          text={getStatusText(status)}
        />
      )
    },
    {
      title: 'İzinler',
      key: 'permissions',
      width: 200,
      render: (_, record) => (
        <Space wrap>
          {record.permissions.map((perm: string) => {
            const permOption = permissionOptions.find(p => p.value === perm);
            return (
              <Tag key={perm} color={permOption?.color} icon={permOption?.icon}>
                {permOption?.label}
              </Tag>
            );
          })}
        </Space>
      )
    },
    {
      title: 'Rate Limit',
      key: 'rateLimit',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.rateLimit}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            / {record.rateLimitPeriod}
          </div>
        </div>
      )
    },
    {
      title: 'Kullanım (30 gün)',
      key: 'usage',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.totalCalls.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Hata: {(record.errorRate * 100).toFixed(1)}%
          </div>
        </div>
      )
    },
    {
      title: 'Webhook',
      key: 'webhook',
      width: 120,
      render: (_, record) => (
        <Badge
          status={getWebhookStatusColor(record.webhookStatus) as any}
          text={getWebhookStatusText(record.webhookStatus)}
        />
      )
    },
    {
      title: 'Son Kullanım',
      key: 'lastUsed',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{new Date(record.lastUsed).toLocaleDateString('tr-TR')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {new Date(record.lastUsed).toLocaleTimeString('tr-TR')}
          </div>
        </div>
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="Kullanım İstatistikleri">
            <Button
              type="text"
              icon={<BarChartOutlined />}
              onClick={() => handleViewStats(record)}
            />
          </Tooltip>
          <Tooltip title="Webhook Yönetimi">
            <Button
              type="text"
              icon={<LinkOutlined />}
              onClick={() => handleManageWebhook(record)}
            />
          </Tooltip>
          <Tooltip title="Düzenle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Yeniden Oluştur">
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={() => handleRegenerate(record)}
            />
          </Tooltip>
          <Popconfirm
            title="API anahtarını silmek istediğinizden emin misiniz?"
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

  const webhookColumns: ColumnsType<any> = [
    {
      title: 'Webhook Adı',
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      width: 300,
      render: (url) => (
        <Text code style={{ fontSize: '12px' }}>
          {url}
        </Text>
      )
    },
    {
      title: 'Olaylar',
      key: 'events',
      width: 200,
      render: (_, record) => (
        <Space wrap>
          {record.events.map((event: string) => (
            <Tag key={event} color="blue">
              {event}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Badge
          status={getWebhookStatusColor(status) as any}
          text={getWebhookStatusText(status)}
        />
      )
    },
    {
      title: 'Başarı Oranı',
      key: 'successRate',
      width: 120,
      render: (_, record) => (
        <Progress
          percent={record.successRate * 100}
          size="small"
          status={record.successRate > 0.95 ? 'success' : record.successRate > 0.8 ? 'normal' : 'exception'}
        />
      )
    },
    {
      title: 'Son Teslimat',
      key: 'lastDelivery',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{new Date(record.lastDelivery).toLocaleDateString('tr-TR')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {new Date(record.lastDelivery).toLocaleTimeString('tr-TR')}
          </div>
        </div>
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Düzenle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditWebhook(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Webhook'u silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDeleteWebhook(record.id)}
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

  const handleAdd = () => {
    setEditingApiKey(null);
    form.resetFields();
    form.setFieldsValue({
      status: 'active',
      permissions: ['read'],
      rateLimit: 1000,
      rateLimitPeriod: 'minute'
    });
    setIsModalVisible(true);
  };

  const handleEdit = (apiKey: any) => {
    setEditingApiKey(apiKey);
    form.setFieldsValue({
      name: apiKey.name,
      tenantId: apiKey.tenantId,
      status: apiKey.status,
      permissions: apiKey.permissions,
      rateLimit: apiKey.rateLimit,
      rateLimitPeriod: apiKey.rateLimitPeriod
    });
    setIsModalVisible(true);
  };

  const handleViewStats = (apiKey: any) => {
    setSelectedApiKey(apiKey);
    // Burada istatistik modalı açılabilir
    message.info(`${apiKey.name} için detaylı istatistikler yakında eklenecek`);
  };

  const handleManageWebhook = (apiKey: any) => {
    setSelectedApiKey(apiKey);
    setIsWebhookModalVisible(true);
  };

  const handleEditWebhook = (webhook: any) => {
    webhookForm.setFieldsValue({
      name: webhook.name,
      url: webhook.url,
      events: webhook.events,
      retryCount: webhook.retryCount
    });
    // Webhook düzenleme modalı açılabilir
  };

  const handleRegenerate = (apiKey: any) => {
    const newKey = generateApiKey();
    const updatedApiKeys = apiKeys.map(k =>
      k.id === apiKey.id ? { ...k, key: newKey } : k
    );
    setApiKeys(updatedApiKeys);
    message.success('API anahtarı yeniden oluşturuldu');
  };

  const handleDelete = (apiKeyId: number) => {
    setApiKeys(apiKeys.filter(k => k.id !== apiKeyId));
    message.success('API anahtarı silindi');
  };

  const handleDeleteWebhook = (webhookId: number) => {
    setWebhooks(webhooks.filter(w => w.id !== webhookId));
    message.success('Webhook silindi');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingApiKey) {
        // Update existing API key
        const updatedApiKeys = apiKeys.map(k =>
          k.id === editingApiKey.id ? { ...k, ...values } : k
        );
        setApiKeys(updatedApiKeys);
        message.success('API anahtarı güncellendi');
      } else {
        // Add new API key
        const newApiKey = {
          id: Math.max(...apiKeys.map(k => k.id)) + 1,
          ...values,
          key: generateApiKey(),
          tenantName: mockTenants.find(t => t.id === values.tenantId)?.name,
          createdAt: new Date().toISOString(),
          lastUsed: new Date().toISOString(),
          totalCalls: 0,
          errorRate: 0,
          webhookUrl: null,
          webhookStatus: null
        };
        setApiKeys([...apiKeys, newApiKey]);
        message.success('API anahtarı oluşturuldu');
      }
      setIsModalVisible(false);
    });
  };

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      tenantId: undefined,
      status: undefined,
      hasWebhook: undefined
    });
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <ApiOutlined /> API Yönetimi
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
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {tenantOptions}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Durum"
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              allowClear
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {statusOptions}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Webhook Durumu"
              style={{ width: '100%' }}
              value={filters.hasWebhook}
              onChange={(value) => handleFilterChange('hasWebhook', value)}
              allowClear
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {webhookOptions}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Yeni API Anahtarı
              </Button>
              <Button
                icon={<SettingOutlined />}
                onClick={clearFilters}
              >
                Filtreleri Temizle
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* API Keys Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredApiKeys}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} / ${total} API anahtarı`
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* Add/Edit API Key Modal */}
      <Modal
        title={editingApiKey ? 'API Anahtarı Düzenle' : 'Yeni API Anahtarı Oluştur'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        okText={editingApiKey ? 'Güncelle' : 'Oluştur'}
        cancelText="İptal"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="API Anahtarı Adı"
                rules={[{ required: true, message: 'API anahtarı adı gerekli!' }]}
              >
                <Input prefix={<KeyOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tenantId"
                label="Tenant"
                rules={[{ required: true, message: 'Tenant seçin!' }]}
              >
                <Select placeholder="Tenant seçin" getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                  {modalTenantOptions}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Durum"
              >
                <Switch checkedChildren="Aktif" unCheckedChildren="Pasif" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="permissions"
                label="İzinler"
                rules={[{ required: true, message: 'En az bir izin seçin!' }]}
              >
                <Select mode="multiple" placeholder="İzinler seçin" getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                  {permissionSelectOptions}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="rateLimit"
                label="Rate Limit"
                rules={[{ required: true, message: 'Rate limit gerekli!' }]}
              >
                <InputNumber
                  min={1}
                  max={10000}
                  style={{ width: '100%' }}
                  placeholder="İstek sayısı"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="rateLimitPeriod"
                label="Rate Limit Periyodu"
                rules={[{ required: true, message: 'Periyot seçin!' }]}
              >
                <Select placeholder="Periyot seçin" getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                  {rateLimitPeriodOptions}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Webhook Management Modal */}
      <Modal
        title={`${selectedApiKey?.name} - Webhook Yönetimi`}
        open={isWebhookModalVisible}
        onCancel={() => setIsWebhookModalVisible(false)}
        width={1000}
        footer={null}
      >
        <Tabs defaultActiveKey="webhooks">
          <TabPane tab="Webhook'lar" key="webhooks">
            <div style={{ marginBottom: '16px' }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => message.info('Webhook ekleme özelliği yakında eklenecek')}
              >
                Yeni Webhook Ekle
              </Button>
            </div>
            <Table
              columns={webhookColumns}
              dataSource={webhooks.filter(w => w.apiKeyId === selectedApiKey?.id)}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </TabPane>
          <TabPane tab="Webhook Ayarları" key="settings">
            <Alert
              message="Webhook Ayarları"
              description="Webhook'lar için genel ayarlar burada yapılandırılabilir."
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Collapse>
              <Panel header="Genel Ayarlar" key="general">
                <Form layout="vertical">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Maksimum Deneme Sayısı">
                        <InputNumber min={1} max={10} defaultValue={3} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Timeout (saniye)">
                        <InputNumber min={5} max={60} defaultValue={30} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Retry Delay (saniye)">
                        <InputNumber min={1} max={300} defaultValue={60} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Batch Size">
                        <InputNumber min={1} max={100} defaultValue={10} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Panel>
              <Panel header="Güvenlik Ayarları" key="security">
                <Form layout="vertical">
                  <Form.Item label="Webhook Secret">
                    <Input.Password placeholder="Webhook secret girin" />
                  </Form.Item>
                  <Form.Item label="IP Whitelist">
                    <Select 
                      mode="tags" 
                      placeholder="IP adresleri ekleyin"
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    >
                      <Option value="192.168.1.0/24">192.168.1.0/24</Option>
                      <Option value="10.0.0.0/8">10.0.0.0/8</Option>
                    </Select>
                  </Form.Item>
                </Form>
              </Panel>
            </Collapse>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
} 