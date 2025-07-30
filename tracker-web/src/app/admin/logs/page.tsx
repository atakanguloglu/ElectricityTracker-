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
  Progress,
  Statistic,
  Tabs,
  List,
  Descriptions,
  DatePicker,
  InputNumber,
  Alert,
  Collapse,
  Drawer,
  Timeline,
  Avatar,
  Steps,
  Upload,
  Dropdown
} from 'antd';
import {
  FileTextOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SettingOutlined,
  SafetyOutlined,
  GlobalOutlined,
  UserOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  BugOutlined,
  LockOutlined,
  UnlockOutlined,
  KeyOutlined,
  TeamOutlined,
  DollarOutlined,
  BarChartOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileZipOutlined,
  CalendarOutlined,
  ClearOutlined,
  ExportOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Step } = Steps;

// Mock data
const mockTenants = [
  { id: 1, name: 'ABC Şirketi', domain: 'abc.com' },
  { id: 2, name: 'XYZ Ltd.', domain: 'xyz.com' },
  { id: 3, name: 'Tech Solutions', domain: 'techsolutions.com' },
  { id: 4, name: 'Global Corp', domain: 'globalcorp.com' },
  { id: 5, name: 'Startup Inc', domain: 'startupinc.com' }
];

const mockLogs = [
  {
    id: 1,
    timestamp: '2024-01-15T10:30:00Z',
    level: 'info',
    category: 'user_action',
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    userId: 1,
    username: 'admin.abc',
    action: 'tenant_created',
    description: 'Yeni tenant oluşturuldu: ABC Şirketi',
    details: {
      tenantName: 'ABC Şirketi',
      domain: 'abc.com',
      subscription: 'Pro',
      adminEmail: 'admin@abc.com'
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_123456789',
    duration: 1250,
    status: 'success'
  },
  {
    id: 2,
    timestamp: '2024-01-15T10:25:00Z',
    level: 'error',
    category: 'system_error',
    tenantId: null,
    tenantName: null,
    userId: null,
    username: null,
    action: 'database_connection_failed',
    description: 'Veritabanı bağlantısı başarısız',
    details: {
      errorCode: 'DB_CONN_001',
      errorMessage: 'Connection timeout after 30 seconds',
      database: 'electricity_tracker_prod',
      retryCount: 3
    },
    ipAddress: '10.0.0.1',
    userAgent: null,
    sessionId: null,
    duration: 30000,
    status: 'failed'
  },
  {
    id: 3,
    timestamp: '2024-01-15T10:20:00Z',
    level: 'warning',
    category: 'security',
    tenantId: 2,
    tenantName: 'XYZ Ltd.',
    userId: null,
    username: 'unknown_user',
    action: 'failed_login_attempt',
    description: 'Başarısız giriş denemesi',
    details: {
      attemptedUsername: 'admin@xyz.com',
      reason: 'Invalid password',
      attemptCount: 5,
      lockoutDuration: 300
    },
    ipAddress: '192.168.2.50',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    sessionId: null,
    duration: 0,
    status: 'failed'
  },
  {
    id: 4,
    timestamp: '2024-01-15T10:15:00Z',
    level: 'info',
    category: 'user_action',
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    userId: 2,
    username: 'muhasebe.abc',
    action: 'invoice_created',
    description: 'Yeni fatura oluşturuldu',
    details: {
      invoiceNumber: 'INV-2024-001',
      amount: 1250.50,
      currency: 'TRY',
      customerName: 'ABC Şirketi',
      items: [
        { name: 'Elektrik Tüketimi', quantity: 1000, unit: 'kWh', price: 1.25 }
      ]
    },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_123456790',
    duration: 850,
    status: 'success'
  },
  {
    id: 5,
    timestamp: '2024-01-15T10:10:00Z',
    level: 'error',
    category: 'system_error',
    tenantId: 3,
    tenantName: 'Tech Solutions',
    userId: 3,
    username: 'analist.tech',
    action: 'api_rate_limit_exceeded',
    description: 'API rate limit aşıldı',
    details: {
      endpoint: '/api/consumption/data',
      rateLimit: 1000,
      currentUsage: 1050,
      resetTime: '2024-01-15T11:00:00Z'
    },
    ipAddress: '192.168.3.25',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_123456791',
    duration: 0,
    status: 'failed'
  },
  {
    id: 6,
    timestamp: '2024-01-15T10:05:00Z',
    level: 'info',
    category: 'user_action',
    tenantId: 4,
    tenantName: 'Global Corp',
    userId: 5,
    username: 'admin.global',
    action: 'user_created',
    description: 'Yeni kullanıcı oluşturuldu',
    details: {
      newUserId: 6,
      newUsername: 'analist.global',
      newUserEmail: 'analist@globalcorp.com',
      role: 'analyst',
      department: 'Analiz'
    },
    ipAddress: '192.168.4.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_123456792',
    duration: 650,
    status: 'success'
  },
  {
    id: 7,
    timestamp: '2024-01-15T10:00:00Z',
    level: 'warning',
    category: 'security',
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    userId: 1,
    username: 'admin.abc',
    action: 'suspicious_activity',
    description: 'Şüpheli aktivite tespit edildi',
    details: {
      activityType: 'multiple_failed_requests',
      requestCount: 150,
      timeWindow: '5 minutes',
      threshold: 100
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_123456793',
    duration: 0,
    status: 'warning'
  },
  {
    id: 8,
    timestamp: '2024-01-15T09:55:00Z',
    level: 'info',
    category: 'user_action',
    tenantId: 2,
    tenantName: 'XYZ Ltd.',
    userId: 3,
    username: 'analist.xyz',
    action: 'report_generated',
    description: 'Rapor oluşturuldu',
    details: {
      reportType: 'consumption_analysis',
      reportFormat: 'PDF',
      reportSize: '2.5 MB',
      timeRange: '2024-01-01 to 2024-01-15'
    },
    ipAddress: '192.168.2.50',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    sessionId: 'sess_123456794',
    duration: 3200,
    status: 'success'
  }
];

const logCategories = [
  { value: 'user_action', label: 'Kullanıcı Aksiyonları', icon: <UserOutlined />, color: '#1890ff' },
  { value: 'system_error', label: 'Sistem Hataları', icon: <BugOutlined />, color: '#ff4d4f' },
  { value: 'security', label: 'Güvenlik', icon: <SafetyOutlined />, color: '#faad14' },
  { value: 'api', label: 'API', icon: <KeyOutlined />, color: '#722ed1' },
  { value: 'database', label: 'Veritabanı', icon: <BarChartOutlined />, color: '#52c41a' }
];

const logLevels = [
  { value: 'info', label: 'Bilgi', icon: <InfoCircleOutlined />, color: '#1890ff' },
  { value: 'warning', label: 'Uyarı', icon: <WarningOutlined />, color: '#faad14' },
  { value: 'error', label: 'Hata', icon: <ExclamationCircleOutlined />, color: '#ff4d4f' },
  { value: 'debug', label: 'Debug', icon: <BugOutlined />, color: '#722ed1' }
];

export default function LogsPage() {
  const [logs, setLogs] = useState(mockLogs);
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [filters, setFilters] = useState<{
    tenantId?: number;
    category?: string;
    level?: string;
    dateRange?: [any, any] | null;
    searchText: string;
    status?: string;
  }>({
    tenantId: undefined,
    category: undefined,
    level: undefined,
    dateRange: undefined,
    searchText: '',
    status: undefined
  });

  // Statistics
  const stats = useMemo(() => [
    {
      title: 'Toplam Log',
      value: logs.length,
      icon: <FileTextOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Hata Logları',
      value: logs.filter(l => l.level === 'error').length,
      icon: <ExclamationCircleOutlined />,
      color: '#ff4d4f',
      gradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
    },
    {
      title: 'Güvenlik Uyarıları',
      value: logs.filter(l => l.category === 'security').length,
      icon: <SafetyOutlined />,
      color: '#faad14',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Bugün',
      value: logs.filter(l => {
        const today = new Date().toDateString();
        const logDate = new Date(l.timestamp).toDateString();
        return logDate === today;
      }).length,
      icon: <ClockCircleOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    }
  ], [logs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Tenant filter
      if (filters.tenantId && log.tenantId !== filters.tenantId) return false;
      
      // Category filter
      if (filters.category && log.category !== filters.category) return false;
      
      // Level filter
      if (filters.level && log.level !== filters.level) return false;
      
      // Status filter
      if (filters.status && log.status !== filters.status) return false;
      
      // Date range filter
      if (filters.dateRange && filters.dateRange.length === 2) {
        const logDate = new Date(log.timestamp);
        const startDate = filters.dateRange[0]?.startOf('day')?.toDate();
        const endDate = filters.dateRange[1]?.endOf('day')?.toDate();
        if (startDate && endDate && (logDate < startDate || logDate > endDate)) return false;
      }
      
      // Search text filter
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const searchableText = [
          log.description,
          log.action,
          log.username,
          log.tenantName,
          log.ipAddress,
          JSON.stringify(log.details)
        ].join(' ').toLowerCase();
        if (!searchableText.includes(searchLower)) return false;
      }
      
      return true;
    });
  }, [logs, filters]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'blue';
      case 'warning': return 'orange';
      case 'error': return 'red';
      case 'debug': return 'purple';
      default: return 'default';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info': return <InfoCircleOutlined />;
      case 'warning': return <WarningOutlined />;
      case 'error': return <ExclamationCircleOutlined />;
      case 'debug': return <BugOutlined />;
      default: return <InfoCircleOutlined />;
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = logCategories.find(c => c.value === category);
    return cat?.color || '#666';
  };

  const getCategoryIcon = (category: string) => {
    const cat = logCategories.find(c => c.value === category);
    return cat?.icon || <FileTextOutlined />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'failed': return 'error';
      case 'warning': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'Başarılı';
      case 'failed': return 'Başarısız';
      case 'warning': return 'Uyarı';
      default: return 'Bilinmiyor';
    }
  };

  const formatDuration = (duration: number) => {
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Zaman',
      key: 'timestamp',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{new Date(record.timestamp).toLocaleDateString('tr-TR')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {new Date(record.timestamp).toLocaleTimeString('tr-TR')}
          </div>
        </div>
      )
    },
    {
      title: 'Seviye',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level) => (
        <Tag color={getLevelColor(level)} icon={getLevelIcon(level)}>
          {logLevels.find(l => l.value === level)?.label}
        </Tag>
      )
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category) => (
        <Tag color={getCategoryColor(category)} icon={getCategoryIcon(category)}>
          {logCategories.find(c => c.value === category)?.label}
        </Tag>
      )
    },
    {
      title: 'Açıklama',
      key: 'description',
      width: 250,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: '4px' }}>
            {record.description}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.action}
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
        tenantName ? (
          <Tag color="blue" icon={<GlobalOutlined />}>
            {tenantName}
          </Tag>
        ) : (
          <Text type="secondary">-</Text>
        )
      )
    },
    {
      title: 'Kullanıcı',
      key: 'user',
      width: 150,
      render: (_, record) => (
        record.username ? (
          <div>
            <div style={{ fontWeight: 500 }}>{record.username}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.ipAddress}
            </div>
          </div>
        ) : (
          <Text type="secondary">-</Text>
        )
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
      title: 'Süre',
      key: 'duration',
      width: 100,
      render: (_, record) => (
        record.duration > 0 ? (
          <Text code>{formatDuration(record.duration)}</Text>
        ) : (
          <Text type="secondary">-</Text>
        )
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Detayları Görüntüle">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bu logu silmek istediğinizden emin misiniz?"
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

  const handleViewDetails = (log: any) => {
    setSelectedLog(log);
    setIsDetailDrawerVisible(true);
  };

  const handleDelete = (logId: number) => {
    setLogs(logs.filter(l => l.id !== logId));
    message.success('Log silindi');
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      tenantId: undefined,
      category: undefined,
      level: undefined,
      dateRange: undefined,
      searchText: '',
      status: undefined
    });
  };

  const exportLogs = (format: string) => {
    const data = filteredLogs.map(log => ({
      ID: log.id,
      Zaman: new Date(log.timestamp).toLocaleString('tr-TR'),
      Seviye: logLevels.find(l => l.value === log.level)?.label,
      Kategori: logCategories.find(c => c.value === log.category)?.label,
      Açıklama: log.description,
      Aksiyon: log.action,
      Tenant: log.tenantName || '-',
      Kullanıcı: log.username || '-',
      IP: log.ipAddress || '-',
      Durum: getStatusText(log.status),
      Süre: log.duration > 0 ? formatDuration(log.duration) : '-',
      Detaylar: JSON.stringify(log.details, null, 2)
    }));

    if (format === 'excel') {
      message.info('Excel export özelliği yakında eklenecek');
    } else if (format === 'csv') {
      message.info('CSV export özelliği yakında eklenecek');
    } else if (format === 'json') {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      message.success('JSON dosyası indirildi');
    }
  };

  const exportMenuItems = [
    {
      key: 'excel',
      icon: <FileExcelOutlined />,
      label: 'Excel (.xlsx)',
      onClick: () => exportLogs('excel')
    },
    {
      key: 'csv',
      icon: <FileTextOutlined />,
      label: 'CSV (.csv)',
      onClick: () => exportLogs('csv')
    },
    {
      key: 'json',
      icon: <FileTextOutlined />,
      label: 'JSON (.json)',
      onClick: () => exportLogs('json')
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <FileTextOutlined /> Sistem Logları
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
            <Input
              placeholder="Log ara..."
              prefix={<SearchOutlined />}
              value={filters.searchText}
              onChange={(e) => handleFilterChange('searchText', e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={4}>
            <Select
              placeholder="Tenant"
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
          <Col xs={24} sm={4}>
            <Select
              placeholder="Kategori"
              style={{ width: '100%' }}
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
              allowClear
            >
              {logCategories.map(cat => (
                <Option key={cat.value} value={cat.value}>
                  {cat.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Select
              placeholder="Seviye"
              style={{ width: '100%' }}
              value={filters.level}
              onChange={(value) => handleFilterChange('level', value)}
              allowClear
            >
              {logLevels.map(level => (
                <Option key={level.value} value={level.value}>
                  {level.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Select
              placeholder="Durum"
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              allowClear
            >
              <Option value="success">Başarılı</Option>
              <Option value="failed">Başarısız</Option>
              <Option value="warning">Uyarı</Option>
            </Select>
          </Col>
          <Col xs={24} sm={2}>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={clearFilters}
              >
                Temizle
              </Button>
            </Space>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col xs={24} sm={8}>
            <RangePicker
              style={{ width: '100%' }}
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
              placeholder={['Başlangıç Tarihi', 'Bitiş Tarihi']}
            />
          </Col>
          <Col xs={24} sm={16}>
            <Space>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => message.info('Loglar yenilendi')}
              >
                Yenile
              </Button>
              <Dropdown
                menu={{ items: exportMenuItems }}
                placement="bottomRight"
              >
                <Button icon={<ExportOutlined />}>
                  Dışa Aktar
                </Button>
              </Dropdown>
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => message.info('Toplu silme özelliği yakında eklenecek')}
              >
                Toplu Sil
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Logs Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredLogs}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} / ${total} log`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Log Detail Drawer */}
      <Drawer
        title="Log Detayları"
        placement="right"
        width={600}
        open={isDetailDrawerVisible}
        onClose={() => setIsDetailDrawerVisible(false)}
        extra={
          <Space>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                if (selectedLog) {
                  const jsonStr = JSON.stringify(selectedLog, null, 2);
                  const blob = new Blob([jsonStr], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `log_${selectedLog.id}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  message.success('Log detayları indirildi');
                }
              }}
            >
              JSON İndir
            </Button>
          </Space>
        }
      >
        {selectedLog && (
          <div>
            <Tabs defaultActiveKey="overview">
              <TabPane tab="Genel Bakış" key="overview">
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="ID">{selectedLog.id}</Descriptions.Item>
                  <Descriptions.Item label="Zaman">
                    {new Date(selectedLog.timestamp).toLocaleString('tr-TR')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Seviye">
                    <Tag color={getLevelColor(selectedLog.level)} icon={getLevelIcon(selectedLog.level)}>
                      {logLevels.find(l => l.value === selectedLog.level)?.label}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Kategori">
                    <Tag color={getCategoryColor(selectedLog.category)} icon={getCategoryIcon(selectedLog.category)}>
                      {logCategories.find(c => c.value === selectedLog.category)?.label}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Aksiyon">{selectedLog.action}</Descriptions.Item>
                  <Descriptions.Item label="Açıklama">{selectedLog.description}</Descriptions.Item>
                  <Descriptions.Item label="Durum">
                    <Badge status={getStatusColor(selectedLog.status) as any} text={getStatusText(selectedLog.status)} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Süre">
                    {selectedLog.duration > 0 ? formatDuration(selectedLog.duration) : '-'}
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Title level={5}>Kullanıcı Bilgileri</Title>
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Tenant">{selectedLog.tenantName || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Kullanıcı">{selectedLog.username || '-'}</Descriptions.Item>
                  <Descriptions.Item label="IP Adresi">{selectedLog.ipAddress || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Session ID">{selectedLog.sessionId || '-'}</Descriptions.Item>
                  <Descriptions.Item label="User Agent">
                    <Text code style={{ fontSize: '12px' }}>
                      {selectedLog.userAgent || '-'}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>

              <TabPane tab="Detaylar" key="details">
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>JSON Görünümü:</Text>
                </div>
                <TextArea
                  value={JSON.stringify(selectedLog.details, null, 2)}
                  rows={15}
                  style={{ fontFamily: 'monospace', fontSize: '12px' }}
                  readOnly
                />
              </TabPane>

              <TabPane tab="Timeline" key="timeline">
                <Timeline>
                  <Timeline.Item color="blue">
                    <p>Log Oluşturuldu</p>
                    <p style={{ fontSize: '12px', color: '#666' }}>
                      {new Date(selectedLog.timestamp).toLocaleString('tr-TR')}
                    </p>
                  </Timeline.Item>
                  {selectedLog.duration > 0 && (
                    <Timeline.Item color="green">
                      <p>İşlem Tamamlandı</p>
                      <p style={{ fontSize: '12px', color: '#666' }}>
                        Süre: {formatDuration(selectedLog.duration)}
                      </p>
                    </Timeline.Item>
                  )}
                  <Timeline.Item color={selectedLog.status === 'success' ? 'green' : 'red'}>
                    <p>Sonuç: {getStatusText(selectedLog.status)}</p>
                  </Timeline.Item>
                </Timeline>
              </TabPane>
            </Tabs>
          </div>
        )}
      </Drawer>
    </div>
  );
} 