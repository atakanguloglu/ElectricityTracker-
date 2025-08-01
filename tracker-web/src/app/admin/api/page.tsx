'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
  App,
  Spin
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
import { apiRequest } from '@/utils/auth';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5143/api';

// Types
interface Tenant {
  id: number;
  companyName: string;
  domain: string;
}

interface ApiKey {
  id: number;
  name: string;
  key: string;
  tenantId: number;
  tenantName: string;
  status: string;
  permissions: string;
  rateLimit: number;
  rateLimitPeriod: string;
  createdAt: string;
  lastUsed?: string;
  totalCalls: number;
  errorRate: number;
  webhookUrl?: string;
  webhookStatus?: string;
}

interface CreateApiKeyDto {
  name: string;
  tenantId: number;
  permissions: string;
  rateLimit: number;
  rateLimitPeriod: string;
  webhookUrl?: string;
}

interface UpdateApiKeyDto {
  name: string;
  permissions: string;
  rateLimit: number;
  rateLimitPeriod: string;
  webhookUrl?: string;
}

interface ApiUsageDto {
  id: number;
  date: string;
  calls: number;
  errors: number;
  avgResponseTime: number;
  peakHour: string;
}

interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Permission options
const permissionOptions = [
  { value: 'read', label: 'Okuma', icon: <EyeOutlined /> },
  { value: 'write', label: 'Yazma', icon: <EditOutlined /> },
  { value: 'delete', label: 'Silme', icon: <DeleteOutlined /> },
  { value: 'admin', label: 'Yönetici', icon: <SettingOutlined /> }
];

// Rate limit periods
const rateLimitPeriods = [
  { value: 'minute', label: 'Dakika' },
  { value: 'hour', label: 'Saat' },
  { value: 'day', label: 'Gün' }
];

export default function ApiManagementPage() {
  const { message } = App.useApp();

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [apiUsage, setApiUsage] = useState<ApiUsageDto[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | null>(null);
  const [showApiKey, setShowApiKey] = useState<number | null>(null);
  const [form] = Form.useForm();

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Filters state
  const [filters, setFilters] = useState({
    tenantId: undefined as number | undefined,
    status: undefined as string | undefined,
    hasWebhook: undefined as boolean | undefined
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchApiKeys();
    fetchTenants();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.current.toString(),
        pageSize: pagination.pageSize.toString()
      });

      if (filters.tenantId) params.append('tenantId', filters.tenantId.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.hasWebhook !== undefined) params.append('hasWebhook', filters.hasWebhook.toString());

      const response = await apiRequest(`${API_BASE_URL}/admin/api-keys?${params}`);
      if (!response.ok) throw new Error('API anahtarları alınamadı');
      
      const data: PagedResult<ApiKey> = await response.json();
      
      setApiKeys(data.items);
      setPagination(prev => ({
        ...prev,
        total: data.totalCount
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata oluştu');
      console.error('API keys fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/tenants?pageSize=100`);
      if (!response.ok) throw new Error('Tenant listesi alınamadı');
      
      const data: PagedResult<Tenant> = await response.json();
      setTenants(data.items);
    } catch (err) {
      console.error('Tenants fetch error:', err);
    }
  };

  const fetchApiUsage = async (apiKeyId: number) => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/api-keys/${apiKeyId}/usage-stats`);
      if (!response.ok) throw new Error('API kullanım istatistikleri alınamadı');
      
      const data: ApiUsageDto[] = await response.json();
      setApiUsage(data);
    } catch (err) {
      message.error('API kullanım istatistikleri alınamadı');
      console.error('API usage fetch error:', err);
    }
  };

  // Memoized options for better performance
  const tenantOptions = useMemo(() => 
    tenants.map(tenant => (
      <Option key={tenant.id} value={tenant.id}>
        {tenant.companyName}
      </Option>
    )), [tenants]
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
    tenants.map(tenant => (
      <Option key={tenant.id} value={tenant.id}>
        {tenant.companyName}
      </Option>
    )), [tenants]
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
      value: apiKeys.length > 0 
        ? `${(apiKeys.reduce((sum, key) => sum + key.errorRate, 0) / apiKeys.length * 100).toFixed(1)}%`
        : '0%',
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
        const hasWebhook = key.webhookUrl !== null && key.webhookUrl !== undefined;
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
    message.success('API anahtarı panoya kopyalandı');
  };

  const handleAdd = () => {
    setModalType('add');
    setSelectedApiKey(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (apiKey: ApiKey) => {
    setModalType('edit');
    setSelectedApiKey(apiKey);
    form.setFieldsValue({
      name: apiKey.name,
      tenantId: apiKey.tenantId,
      permissions: apiKey.permissions,
      rateLimit: apiKey.rateLimit,
      rateLimitPeriod: apiKey.rateLimitPeriod,
      webhookUrl: apiKey.webhookUrl
    });
    setModalVisible(true);
  };

  const handleViewStats = async (apiKey: ApiKey) => {
    await fetchApiUsage(apiKey.id);
    // Show stats in a modal or drawer
    message.info(`${apiKey.name} için istatistikler yüklendi`);
  };

  const handleRegenerate = async (apiKey: ApiKey) => {
    try {
          const response = await apiRequest(`${API_BASE_URL}/admin/api-keys/${apiKey.id}/regenerate`, {
      method: 'POST'
    });

      if (!response.ok) throw new Error('API anahtarı yenilenemedi');

      const updatedApiKey: ApiKey = await response.json();
      
      setApiKeys(prev => prev.map(key => 
        key.id === apiKey.id ? updatedApiKey : key
      ));

      message.success('API anahtarı başarıyla yenilendi');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'API anahtarı yenilenirken hata oluştu');
      console.error('Regenerate API key error:', err);
    }
  };

  const handleToggleStatus = async (apiKey: ApiKey) => {
    try {
          const response = await apiRequest(`${API_BASE_URL}/admin/api-keys/${apiKey.id}/toggle-status`, {
      method: 'POST'
    });

      if (!response.ok) throw new Error('API anahtarı durumu değiştirilemedi');

      // Refresh the list
      fetchApiKeys();
      message.success('API anahtarı durumu başarıyla değiştirildi');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'API anahtarı durumu değiştirilirken hata oluştu');
      console.error('Toggle API key status error:', err);
    }
  };

  const handleDelete = async (apiKeyId: number) => {
    try {
          const response = await apiRequest(`${API_BASE_URL}/admin/api-keys/${apiKeyId}`, {
      method: 'DELETE'
    });

      if (!response.ok) throw new Error('API anahtarı silinemedi');

      message.success('API anahtarı başarıyla silindi');
      fetchApiKeys(); // Refresh list
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'API anahtarı silinirken hata oluştu');
      console.error('Delete API key error:', err);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (modalType === 'add') {
        const createDto: CreateApiKeyDto = {
          ...values,
          permissions: Array.isArray(values.permissions) ? values.permissions.join(',') : values.permissions
        };

            const response = await apiRequest(`${API_BASE_URL}/admin/api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createDto)
    });

        if (!response.ok) throw new Error('API anahtarı oluşturulamadı');

        message.success('API anahtarı başarıyla oluşturuldu');
        setModalVisible(false);
        fetchApiKeys(); // Refresh list
      } else if (modalType === 'edit' && selectedApiKey) {
        const updateDto: UpdateApiKeyDto = {
          ...values,
          permissions: Array.isArray(values.permissions) ? values.permissions.join(',') : values.permissions
        };

            const response = await apiRequest(`${API_BASE_URL}/admin/api-keys/${selectedApiKey.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateDto)
    });

        if (!response.ok) throw new Error('API anahtarı güncellenemedi');

        message.success('API anahtarı başarıyla güncellendi');
        setModalVisible(false);
        fetchApiKeys(); // Refresh list
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('validation')) {
        // Form validation error - don't show message
        return;
      }
      message.error(err instanceof Error ? err.message : 'İşlem sırasında hata oluştu');
      console.error('Modal operation error:', err);
    }
  };

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      tenantId: undefined,
      status: undefined,
      hasWebhook: undefined
    });
    setPagination(prev => ({ ...prev, current: 1 }));
  }, []);

  // Table columns
  const columns: ColumnsType<ApiKey> = [
    {
      title: 'API Anahtarı',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.key.substring(0, 8)}...{record.key.substring(record.key.length - 8)}
          </div>
        </div>
      )
    },
    {
      title: 'Tenant',
      dataIndex: 'tenantName',
      key: 'tenantName',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={getStatusColor(status) as any} 
          text={getStatusText(status)} 
        />
      )
    },
    {
      title: 'İzinler',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
        <Space>
          {permissions.split(',').map((perm: string, index: number) => (
            <Tag key={index} color="green" style={{ marginBottom: '2px' }}>
              {perm.trim()}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      title: 'Rate Limit',
      key: 'rateLimit',
      render: (_, record) => (
        <div>
          <div>{record.rateLimit} / {record.rateLimitPeriod}</div>
        </div>
      )
    },
    {
      title: 'Kullanım',
      key: 'usage',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            {record.totalCalls.toLocaleString()} çağrı
          </div>
          <div style={{ fontSize: '12px', color: '#ff4d4f' }}>
            %{(record.errorRate * 100).toFixed(1)} hata
          </div>
        </div>
      )
    },
    {
      title: 'Webhook',
      key: 'webhook',
      render: (_, record) => (
        <div>
          {record.webhookUrl ? (
            <Badge 
              status={getWebhookStatusColor(record.webhookStatus || '') as any} 
              text={getWebhookStatusText(record.webhookStatus || '')} 
            />
          ) : (
            <Tag color="default">Yok</Tag>
          )}
        </div>
      )
    },
    {
      title: 'Son Kullanım',
      dataIndex: 'lastUsed',
      key: 'lastUsed',
      render: (lastUsed) => (
        <div>
          {lastUsed ? (
            <div style={{ fontSize: '12px' }}>
              {new Date(lastUsed).toLocaleDateString('tr-TR')}
            </div>
          ) : (
            <Text type="secondary">Hiç kullanılmadı</Text>
          )}
        </div>
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="İstatistikleri Görüntüle">
            <Button 
              type="text" 
              icon={<BarChartOutlined />} 
              size="small"
              onClick={() => handleViewStats(record)}
            />
          </Tooltip>
          <Tooltip title="API Anahtarını Göster/Gizle">
            <Button 
              type="text" 
              icon={showApiKey === record.id ? <EyeInvisibleOutlined /> : <EyeOutlined />} 
              size="small"
              onClick={() => setShowApiKey(showApiKey === record.id ? null : record.id)}
            />
          </Tooltip>
          <Tooltip title="Kopyala">
            <Button 
              type="text" 
              icon={<CopyOutlined />} 
              size="small"
              onClick={() => copyToClipboard(record.key)}
            />
          </Tooltip>
          <Tooltip title="Yenile">
            <Popconfirm
              title="API anahtarını yenilemek istediğinizden emin misiniz?"
              onConfirm={() => handleRegenerate(record)}
              okText="Evet"
              cancelText="Hayır"
            >
              <Button 
                type="text" 
                icon={<ReloadOutlined />} 
                size="small"
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Durumu Değiştir">
            <Button 
              type="text" 
              icon={record.status === 'active' ? <CloseCircleOutlined /> : <CheckCircleOutlined />} 
              size="small"
              onClick={() => handleToggleStatus(record)}
            />
          </Tooltip>
          <Tooltip title="Düzenle">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Sil">
            <Popconfirm
              title="Bu API anahtarını silmek istediğinizden emin misiniz?"
              onConfirm={() => handleDelete(record.id)}
              okText="Evet"
              cancelText="Hayır"
            >
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                size="small"
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  // Loading state
  if (loading && apiKeys.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '20px' }}>API anahtarları yükleniyor...</div>
      </div>
    );
  }

  // Error state
  if (error && apiKeys.length === 0) {
    return (
      <Alert
        message="Hata"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={fetchApiKeys}>
            Tekrar Dene
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>API Yönetimi</Title>
        <Text type="secondary">
          Sistem genelinde API anahtarlarını yönetin, kullanım istatistiklerini takip edin ve webhook entegrasyonlarını yapılandırın.
        </Text>
      </div>

      {/* Statistics Cards */}
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

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} lg={6}>
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
          <Col xs={24} sm={8} lg={6}>
            <Select
              placeholder="Durum Seçin"
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              allowClear
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {statusOptions}
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={6}>
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
          <Col xs={24} sm={8} lg={6}>
            <Space>
              <Button onClick={clearFilters}>
                Filtreleri Temizle
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                Yeni API Anahtarı
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
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} / ${total} API anahtarı`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || 10
              }));
            }
          }}
          loading={loading}
        />
      </Card>

      {/* API Key Modal */}
      <Modal
        title={modalType === 'add' ? 'Yeni API Anahtarı' : 'API Anahtarını Düzenle'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText={modalType === 'add' ? 'Oluştur' : 'Güncelle'}
        cancelText="İptal"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            rateLimit: 1000,
            rateLimitPeriod: 'minute',
            permissions: ['read']
          }}
        >
          <Form.Item
            name="name"
            label="API Anahtarı Adı"
            rules={[{ required: true, message: 'API anahtarı adı gerekli' }]}
          >
            <Input placeholder="Örn: Production API" />
          </Form.Item>

          <Form.Item
            name="tenantId"
            label="Tenant"
            rules={[{ required: true, message: 'Tenant seçimi gerekli' }]}
          >
            <Select
              placeholder="Tenant seçin"
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {modalTenantOptions}
            </Select>
          </Form.Item>

          <Form.Item
            name="permissions"
            label="İzinler"
            rules={[{ required: true, message: 'En az bir izin seçimi gerekli' }]}
          >
            <Select
              mode="multiple"
              placeholder="İzinler seçin"
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {permissionSelectOptions}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="rateLimit"
                label="Rate Limit"
                rules={[{ required: true, message: 'Rate limit gerekli' }]}
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
                name="rateLimitPeriod"
                label="Periyot"
                rules={[{ required: true, message: 'Periyot seçimi gerekli' }]}
              >
                <Select
                  placeholder="Periyot seçin"
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {rateLimitPeriodOptions}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="webhookUrl"
            label="Webhook URL (Opsiyonel)"
          >
            <Input placeholder="https://webhook.example.com/api/events" />
          </Form.Item>
        </Form>
      </Modal>

      {/* API Key Display Modal */}
      {showApiKey && (
        <Modal
          title="API Anahtarı"
          open={!!showApiKey}
          onCancel={() => setShowApiKey(null)}
          footer={[
            <Button key="copy" type="primary" onClick={() => {
              const apiKey = apiKeys.find(k => k.id === showApiKey);
              if (apiKey) copyToClipboard(apiKey.key);
            }}>
              Kopyala
            </Button>,
            <Button key="close" onClick={() => setShowApiKey(null)}>
              Kapat
            </Button>
          ]}
        >
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Text code style={{ fontSize: '16px', wordBreak: 'break-all' }}>
              {apiKeys.find(k => k.id === showApiKey)?.key}
            </Text>
            <div style={{ marginTop: '16px' }}>
              <Text type="secondary">
                Bu anahtarı güvenli bir yerde saklayın ve kimseyle paylaşmayın.
              </Text>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
} 