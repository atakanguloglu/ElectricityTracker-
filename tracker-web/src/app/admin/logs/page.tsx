'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Dropdown,
  Spin,
  App
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
  ExportOutlined,
  ApiOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { apiRequest } from '@/utils/auth';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Step } = Steps;

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5143/api';

// Types
interface Tenant {
  id: number;
  companyName: string;
  domain: string;
}

interface SystemLog {
  id: number;
  timestamp: string;
  level: string;
  category: string;
  message: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  exception?: string;
  stackTrace?: string;
  tenantId?: number;
  tenantName?: string;
  userId?: number;
  userName?: string;
  userEmail?: string;
}

interface LogStats {
  totalLogs: number;
  errorLogs: number;
  warningLogs: number;
  infoLogs: number;
  errorRate: number;
  levelBreakdown: Array<{ level: string; count: number }>;
  categoryBreakdown: Array<{ category: string; count: number }>;
}

interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function LogsPage() {
  const { message } = App.useApp();

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [logStats, setLogStats] = useState<LogStats | null>(null);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [logToDelete, setLogToDelete] = useState<SystemLog | null>(null);
  const [cleanupModalVisible, setCleanupModalVisible] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [form] = Form.useForm();

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0
  });

  // Filters state
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

  // Fetch data on component mount
  useEffect(() => {
    fetchLogs();
    fetchTenants();
    fetchLogStats();
  }, []); // Only run once on mount

  // Fetch logs when filters change
  useEffect(() => {
    fetchLogs();
  }, [pagination.current, pagination.pageSize, filters.tenantId, filters.category, filters.level, filters.dateRange, filters.searchText]);

  // Fetch stats when date range changes
  useEffect(() => {
    fetchLogStats();
  }, [filters.dateRange]);

  // Global click handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Export dropdown dışına tıklandıysa kapat
      if (!target.closest('.ant-dropdown') && !target.closest('.ant-btn[data-export-button]')) {
        setDropdownOpen(false);
      }
      
      // DatePicker dışına tıklandıysa kapat
      if (!target.closest('.ant-picker-dropdown') && !target.closest('.ant-picker')) {
        setDatePickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.current.toString(),
        pageSize: pagination.pageSize.toString()
      });

      if (filters.tenantId) params.append('tenantId', filters.tenantId.toString());
      if (filters.category) params.append('category', filters.category);
      if (filters.level) params.append('level', filters.level);
      if (filters.searchText) params.append('searchText', filters.searchText);
      if (filters.dateRange && filters.dateRange.length === 2) {
        params.append('startDate', filters.dateRange[0].toISOString());
        params.append('endDate', filters.dateRange[1].toISOString());
      }

      console.log('Fetching logs with params:', params.toString());

      const response = await apiRequest(`${API_BASE_URL}/admin/log?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Log listesi alınamadı');
      }
      
      const data: PagedResult<SystemLog> = await response.json();
      
      console.log('Logs fetched successfully:', data.items.length, 'items');
      
      setLogs(data.items);
      setPagination(prev => ({
        ...prev,
        total: data.totalCount
      }));
    } catch (err) {
      console.error('Logs fetch error:', err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata oluştu');
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

  const fetchLogStats = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.dateRange && filters.dateRange.length === 2) {
        params.append('startDate', filters.dateRange[0].toISOString());
        params.append('endDate', filters.dateRange[1].toISOString());
      }

      console.log('Fetching log stats with params:', params.toString());

      const response = await apiRequest(`${API_BASE_URL}/admin/log/stats?${params}`);
      if (!response.ok) throw new Error('Log istatistikleri alınamadı');
      
      const data: LogStats = await response.json();
      console.log('Log stats received:', data);
      setLogStats(data);
    } catch (err) {
      console.error('Log stats fetch error:', err);
    }
  };

  const handleViewDetails = async (log: SystemLog) => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/log/${log.id}`);
      if (!response.ok) throw new Error('Log detayları alınamadı');
      
      const logDetail: SystemLog = await response.json();
      setSelectedLog(logDetail);
      setDetailDrawerVisible(true);
    } catch (err) {
      message.error('Log detayları alınamadı');
      console.error('Log detail fetch error:', err);
    }
  };

  const handleDelete = (log: SystemLog) => {
    setLogToDelete(log);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!logToDelete) return;
    
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/log/${logToDelete.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Log silinemedi');
      }

      message.success('Log başarıyla silindi');
      setDeleteModalVisible(false);
      setLogToDelete(null);
      fetchLogs(); // Refresh list
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Log silinirken hata oluştu');
      console.error('Delete log error:', err);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    console.log(`Filter changed: ${key} =`, value);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
    
    // Debounce search text changes
    if (key === 'searchText') {
      const timeout = setTimeout(() => {
        fetchLogs();
      }, 500);
      setSearchTimeout(timeout);
    }
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
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const exportLogs = async (format: string) => {
    try {
      console.log(`Exporting logs in ${format} format...`);
      message.loading(`${format.toUpperCase()} export başlatılıyor...`, 0);
      
      const params = new URLSearchParams({
        format: format,
        pageSize: '10000' // Export all logs
      });

      if (filters.tenantId) params.append('tenantId', filters.tenantId.toString());
      if (filters.category) params.append('category', filters.category);
      if (filters.level) params.append('level', filters.level);
      if (filters.searchText) params.append('searchText', filters.searchText);
      if (filters.dateRange && filters.dateRange.length === 2) {
        params.append('startDate', filters.dateRange[0].toISOString());
        params.append('endDate', filters.dateRange[1].toISOString());
      }

      console.log('Export params:', params.toString());

      const response = await apiRequest(`${API_BASE_URL}/admin/log/export?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Log export edilemedi');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs_${new Date().toISOString().split('T')[0]}.${format}`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      message.destroy();
      message.success(`${format.toUpperCase()} formatında loglar export edildi`);
      console.log(`Export completed: ${format}`);
    } catch (err) {
      message.destroy();
      console.error('Export logs error:', err);
      message.error(err instanceof Error ? err.message : 'Log export edilirken hata oluştu');
    }
  };

  const cleanupOldLogs = async (daysToKeep: number = 30) => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/log/cleanup?daysToKeep=${daysToKeep}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Eski loglar temizlenemedi');
      }

      const result = await response.json();
      message.success(result.message);
      setCleanupModalVisible(false);
      fetchLogs(); // Refresh list
      fetchLogStats(); // Refresh stats
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Eski loglar temizlenirken hata oluştu');
      console.error('Cleanup logs error:', err);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'processing';
      case 'debug': return 'default';
      default: return 'default';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error': return <ExclamationCircleOutlined />;
      case 'warning': return <WarningOutlined />;
      case 'info': return <InfoCircleOutlined />;
      case 'debug': return <BugOutlined />;
      default: return <FileTextOutlined />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'user': return 'blue';
      case 'system': return 'green';
      case 'security': return 'red';
      case 'api': return 'purple';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'user': return <UserOutlined />;
      case 'system': return <SettingOutlined />;
      case 'security': return <SafetyOutlined />;
      case 'api': return <ApiOutlined />;
      default: return <FileTextOutlined />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'processing';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'Başarılı';
      case 'error': return 'Hata';
      case 'warning': return 'Uyarı';
      case 'info': return 'Bilgi';
      default: return 'Bilinmiyor';
    }
  };

  const formatDuration = (duration: number) => {
    if (duration < 1000) return `${duration}ms`;
    if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`;
    return `${(duration / 60000).toFixed(1)}m`;
  };

  // Statistics
  const stats = useMemo(() => [
    {
      title: 'Toplam Log',
      value: logStats?.totalLogs || 0,
      icon: <FileTextOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Hata Logları',
      value: logStats?.errorLogs || 0,
      icon: <ExclamationCircleOutlined />,
      color: '#ff4d4f',
      gradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
    },
    {
      title: 'Uyarı Logları',
      value: logStats?.warningLogs || 0,
      icon: <WarningOutlined />,
      color: '#faad14',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Hata Oranı',
      value: logStats ? `${logStats.errorRate.toFixed(1)}%` : '0%',
      icon: <BarChartOutlined />,
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  ], [logStats]);

  // Table columns
  const columns: ColumnsType<SystemLog> = [
    {
      title: 'Zaman',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp) => (
        <div>
          <div>{new Date(timestamp).toLocaleDateString('tr-TR')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {new Date(timestamp).toLocaleTimeString('tr-TR')}
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
        <Badge
          status={getLevelColor(level) as any}
          text={level}
        />
      )
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category) => (
        <Tag color={getCategoryColor(category)} icon={getCategoryIcon(category)}>
          {category}
        </Tag>
      )
    },
    {
      title: 'Mesaj',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (message) => (
        <Tooltip title={message}>
          <div style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {message}
          </div>
        </Tooltip>
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
      dataIndex: 'userName',
      key: 'userName',
      width: 150,
      render: (userName, record) => (
        userName ? (
          <div>
            <div>{userName}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.userEmail}
            </div>
          </div>
        ) : (
          <Text type="secondary">-</Text>
        )
      )
    },
    {
      title: 'IP Adresi',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 120,
      render: (ipAddress) => (
        ipAddress ? (
          <Text code style={{ fontSize: '12px' }}>
            {ipAddress}
          </Text>
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
        <Space size="small">
          <Tooltip title="Detayları Görüntüle">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Sil">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // Loading state
  if (loading && logs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '20px' }}>Loglar yükleniyor...</div>
      </div>
    );
  }

  // Error state
  if (error && logs.length === 0) {
    return (
      <Alert
        message="Hata"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={fetchLogs}>
            Tekrar Dene
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>Sistem Logları</Title>
        <Text type="secondary">
          Sistem genelinde oluşan tüm logları görüntüleyin, filtreleyin ve yönetin.
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
              getPopupContainer={(triggerNode) => document.body}
              onMouseDown={(e) => e.stopPropagation()}
              styles={{ popup: { root: { zIndex: 1050 } } }}
            >
              {tenants.map(tenant => (
                <Option key={tenant.id} value={tenant.id}>
                  {tenant.companyName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={6}>
            <Select
              placeholder="Kategori Seçin"
              style={{ width: '100%' }}
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
              allowClear
              getPopupContainer={(triggerNode) => document.body}
              onMouseDown={(e) => e.stopPropagation()}
              styles={{ popup: { root: { zIndex: 1050 } } }}
            >
              <Option value="User">Kullanıcı</Option>
              <Option value="System">Sistem</Option>
              <Option value="Security">Güvenlik</Option>
              <Option value="API">API</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={6}>
            <Select
              placeholder="Seviye Seçin"
              style={{ width: '100%' }}
              value={filters.level}
              onChange={(value) => handleFilterChange('level', value)}
              allowClear
              getPopupContainer={(triggerNode) => document.body}
              onMouseDown={(e) => e.stopPropagation()}
              styles={{ popup: { root: { zIndex: 1050 } } }}
            >
              <Option value="Info">Bilgi</Option>
              <Option value="Warning">Uyarı</Option>
              <Option value="Error">Hata</Option>
              <Option value="Debug">Debug</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={6}>
            <RangePicker
              style={{ width: '100%' }}
              value={filters.dateRange}
              onChange={(dates) => {
                console.log('Date range changed:', dates);
                handleFilterChange('dateRange', dates);
              }}
              placeholder={['Başlangıç', 'Bitiş']}
              format="DD/MM/YYYY"
              allowClear
              showTime={false}
              disabledDate={(current) => current && current.isAfter(new Date())}
              disabled={loading}
              suffixIcon={loading ? <Spin size="small" /> : undefined}
              getPopupContainer={(triggerNode) => document.body}
              open={datePickerOpen}
              onOpenChange={(open) => {
                setDatePickerOpen(open);
              }}
            />
          </Col>
          <Col xs={24} sm={8} lg={6}>
            <Input
              placeholder="Arama..."
              prefix={<SearchOutlined />}
              value={filters.searchText}
              onChange={(e) => handleFilterChange('searchText', e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} lg={6}>
            <Space>
              <Button onClick={clearFilters}>
                Filtreleri Temizle
              </Button>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Button 
                  icon={<ExportOutlined />}
                  data-export-button="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                  }}
                >
                  Export
                </Button>
                {dropdownOpen && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      zIndex: 1050,
                      background: 'white',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
                      minWidth: '120px'
                    }}
                  >
                    <div 
                      style={{
                        padding: '4px 0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '12px',
                        paddingRight: '12px',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => {
                        console.log('Excel export clicked');
                        exportLogs('excel');
                        setDropdownOpen(false);
                      }}
                    >
                      <FileExcelOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                      Excel Export
                    </div>
                    <div 
                      style={{
                        padding: '4px 0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '12px',
                        paddingRight: '12px',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => {
                        console.log('CSV export clicked');
                        exportLogs('csv');
                        setDropdownOpen(false);
                      }}
                    >
                      <FileExcelOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                      CSV Export
                    </div>
                    <div 
                      style={{
                        padding: '4px 0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '12px',
                        paddingRight: '12px',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => {
                        console.log('JSON export clicked');
                        exportLogs('json');
                        setDropdownOpen(false);
                      }}
                    >
                      <FileTextOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                      JSON Export
                    </div>
                  </div>
                )}
              </div>
              <Button 
                icon={<DeleteOutlined />} 
                danger
                onClick={() => setCleanupModalVisible(true)}
              >
                Temizle
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Logs Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={logs}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} / ${total} log`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || 50
              }));
            }
          }}
          loading={loading}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Log Silme Onayı"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setLogToDelete(null);
        }}
        okText="Evet, Sil"
        cancelText="İptal"
        okButtonProps={{ danger: true }}
        centered
        destroyOnHidden
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
        <p>
          <strong>"{logToDelete?.message}"</strong> logunu silmek istediğinizden emin misiniz?
        </p>
        <p style={{ color: '#666', fontSize: '12px' }}>
          Bu işlem geri alınamaz.
        </p>
      </Modal>

      {/* Cleanup Confirmation Modal */}
      <Modal
        title="Eski Logları Temizleme Onayı"
        open={cleanupModalVisible}
        onOk={() => cleanupOldLogs(30)}
        onCancel={() => setCleanupModalVisible(false)}
        okText="Evet, Temizle"
        cancelText="İptal"
        okButtonProps={{ danger: true }}
        centered
        destroyOnHidden
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
        <p>
          30 günden eski tüm logları silmek istediğinizden emin misiniz?
        </p>
        <p style={{ color: '#666', fontSize: '12px' }}>
          Bu işlem geri alınamaz ve tüm eski loglar kalıcı olarak silinecektir.
        </p>
      </Modal>

      {/* Log Detail Drawer */}
      <Drawer
        title="Log Detayları"
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          <Space>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                if (selectedLog) {
                  const dataStr = JSON.stringify(selectedLog, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = window.URL.createObjectURL(dataBlob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `log_${selectedLog.id}.json`;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                }
              }}
            >
              JSON İndir
            </Button>
            <Button onClick={() => setDetailDrawerVisible(false)}>
              Kapat
            </Button>
          </Space>
        }
      >
        {selectedLog && (
          <div>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="ID">{selectedLog.id}</Descriptions.Item>
              <Descriptions.Item label="Zaman">
                {new Date(selectedLog.timestamp).toLocaleString('tr-TR')}
              </Descriptions.Item>
                             <Descriptions.Item label="Seviye">
                 <Badge
                   status={getLevelColor(selectedLog.level) as any}
                   text={selectedLog.level}
                 />
               </Descriptions.Item>
              <Descriptions.Item label="Kategori">
                <Tag color={getCategoryColor(selectedLog.category)} icon={getCategoryIcon(selectedLog.category)}>
                  {selectedLog.category}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Mesaj">{selectedLog.message}</Descriptions.Item>
              {selectedLog.tenantName && (
                <Descriptions.Item label="Tenant">
                  <Tag color="blue">{selectedLog.tenantName}</Tag>
                </Descriptions.Item>
              )}
              {selectedLog.userName && (
                <Descriptions.Item label="Kullanıcı">
                  <div>
                    <div>{selectedLog.userName}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {selectedLog.userEmail}
                    </div>
                  </div>
                </Descriptions.Item>
              )}
              {selectedLog.ipAddress && (
                <Descriptions.Item label="IP Adresi">
                  <Text code>{selectedLog.ipAddress}</Text>
                </Descriptions.Item>
              )}
              {selectedLog.userAgent && (
                <Descriptions.Item label="User Agent">
                  <Text style={{ fontSize: '12px' }}>{selectedLog.userAgent}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedLog.details && (
              <div style={{ marginTop: '16px' }}>
                <Title level={5}>Detaylar</Title>
                <TextArea
                  value={selectedLog.details}
                  rows={4}
                  readOnly
                />
              </div>
            )}

            {selectedLog.exception && (
              <div style={{ marginTop: '16px' }}>
                <Title level={5}>Hata</Title>
                <TextArea
                  value={selectedLog.exception}
                  rows={6}
                  readOnly
                  style={{ fontFamily: 'monospace', fontSize: '12px' }}
                />
              </div>
            )}

            {selectedLog.stackTrace && (
              <div style={{ marginTop: '16px' }}>
                <Title level={5}>Stack Trace</Title>
                <TextArea
                  value={selectedLog.stackTrace}
                  rows={8}
                  readOnly
                  style={{ fontFamily: 'monospace', fontSize: '11px' }}
                />
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
} 