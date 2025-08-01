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
  Timeline,
  Avatar,
  Steps,
  Upload,
  Dropdown,
  App
} from 'antd';
import {
  MonitorOutlined,
  DatabaseOutlined,
  CloudServerOutlined,
  ThunderboltOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SettingOutlined,
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
  SecurityScanOutlined,
  StopOutlined,
  PlayCircleOutlined,
  FireOutlined,
  DesktopOutlined,
  HddOutlined,
  WifiOutlined,
  SyncOutlined,
  BellOutlined,
  MailOutlined,
  MessageOutlined,
  DashboardOutlined,
  LineChartOutlined,
  PieChartOutlined,
  AreaChartOutlined
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
interface SystemHealth {
  status: string;
  timestamp: string;
  system: {
    cpuUsage: number;
    memoryUsage: number;
    memoryLimit: number;
    memoryPercentage: number;
    threadCount: number;
    handleCount: number;
    processTime: number;
  };
  database: {
    status: string;
    connectionString: string;
    pendingMigrations: string[];
  };
  services: {
    apiService: string;
    logService: string;
    authService: string;
  };
}

interface PerformanceMetrics {
  timestamp: string;
  timeRange: {
    start: string;
    end: string;
  };
  system: {
    cpuUsage: number;
    memoryUsage: number;
    memoryLimit: number;
    memoryPercentage: number;
    threadCount: number;
    handleCount: number;
    processTime: number;
  };
  database: {
    totalTenants: number;
    totalUsers: number;
    totalApiKeys: number;
    activeApiKeys: number;
    totalLogs: number;
    recentLogs: number;
  };
  apiUsage: {
    totalRequests: number;
    errorRate: number;
    averageResponseTime: number;
    peakHour: string;
  };
}

interface Alert {
  id: string;
  type: string;
  level: string;
  title: string;
  message: string;
  timestamp: string;
  isActive: boolean;
}

interface MonitoringDashboard {
  systemStatus: {
    status: string;
    uptime: number;
    cpuUsage: number;
    memoryUsage: number;
    threadCount: number;
  };
  databaseMetrics: {
    totalTenants: number;
    activeTenants: number;
    totalUsers: number;
    activeUsers: number;
    totalApiKeys: number;
    activeApiKeys: number;
  };
  recentActivity: {
    newLogs: number;
    errorLogs: number;
    warningLogs: number;
    newUsers: number;
    newApiKeys: number;
  };
  performance: {
    averageResponseTime: number;
    errorRate: number;
    totalRequests: number;
  };
}

// Mock data
const mockServers = [
  {
    id: 1,
    name: 'Web Server 1',
    ip: '192.168.1.10',
    type: 'web',
    status: 'online',
    cpu: 45,
    ram: 67,
    disk: 23,
    network: 12,
    uptime: '15 days, 8 hours',
    lastUpdate: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Database Server',
    ip: '192.168.1.20',
    type: 'database',
    status: 'online',
    cpu: 78,
    ram: 89,
    disk: 45,
    network: 8,
    uptime: '30 days, 12 hours',
    lastUpdate: '2024-01-15T10:30:00Z'
  },
  {
    id: 3,
    name: 'Cache Server',
    ip: '192.168.1.30',
    type: 'cache',
    status: 'online',
    cpu: 23,
    ram: 34,
    disk: 12,
    network: 5,
    uptime: '7 days, 3 hours',
    lastUpdate: '2024-01-15T10:30:00Z'
  },
  {
    id: 4,
    name: 'Background Job Server',
    ip: '192.168.1.40',
    type: 'job',
    status: 'warning',
    cpu: 92,
    ram: 95,
    disk: 67,
    network: 15,
    uptime: '5 days, 18 hours',
    lastUpdate: '2024-01-15T10:30:00Z'
  }
];

const mockDatabaseMetrics = [
  {
    id: 1,
    name: 'Main Database',
    type: 'PostgreSQL',
    status: 'online',
    connections: 45,
    maxConnections: 100,
    activeQueries: 12,
    slowQueries: 2,
    responseTime: 15,
    lastBackup: '2024-01-15T02:00:00Z',
    size: '2.5 GB'
  },
  {
    id: 2,
    name: 'Read Replica',
    type: 'PostgreSQL',
    status: 'online',
    connections: 23,
    maxConnections: 50,
    activeQueries: 8,
    slowQueries: 0,
    responseTime: 8,
    lastBackup: '2024-01-15T02:00:00Z',
    size: '2.5 GB'
  }
];

const mockCacheMetrics = [
  {
    id: 1,
    name: 'Redis Cache',
    type: 'Redis',
    status: 'online',
    memoryUsage: 67,
    maxMemory: '1 GB',
    hitRate: 89,
    missRate: 11,
    keys: 15420,
    connections: 8,
    lastUpdate: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Application Cache',
    type: 'In-Memory',
    status: 'online',
    memoryUsage: 34,
    maxMemory: '512 MB',
    hitRate: 92,
    missRate: 8,
    keys: 8230,
    connections: 4,
    lastUpdate: '2024-01-15T10:30:00Z'
  }
];

const mockBackgroundJobs = [
  {
    id: 1,
    name: 'Email Queue Processor',
    type: 'email',
    status: 'running',
    progress: 75,
    totalJobs: 150,
    completedJobs: 112,
    failedJobs: 3,
    avgProcessingTime: 2.5,
    lastRun: '2024-01-15T10:25:00Z',
    nextRun: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Report Generator',
    type: 'report',
    status: 'idle',
    progress: 0,
    totalJobs: 0,
    completedJobs: 0,
    failedJobs: 0,
    avgProcessingTime: 15.2,
    lastRun: '2024-01-15T09:00:00Z',
    nextRun: '2024-01-15T11:00:00Z'
  },
  {
    id: 3,
    name: 'Data Sync Job',
    type: 'sync',
    status: 'failed',
    progress: 0,
    totalJobs: 50,
    completedJobs: 23,
    failedJobs: 27,
    avgProcessingTime: 8.7,
    lastRun: '2024-01-15T10:15:00Z',
    nextRun: '2024-01-15T10:45:00Z'
  }
];

const mockMicroservices = [
  {
    id: 1,
    name: 'User Service',
    endpoint: '/api/users',
    status: 'healthy',
    uptime: 99.8,
    responseTime: 45,
    errorRate: 0.1,
    requestsPerMinute: 120,
    lastCheck: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Billing Service',
    endpoint: '/api/billing',
    status: 'warning',
    uptime: 98.5,
    responseTime: 120,
    errorRate: 2.3,
    requestsPerMinute: 85,
    lastCheck: '2024-01-15T10:30:00Z'
  },
  {
    id: 3,
    name: 'Notification Service',
    endpoint: '/api/notifications',
    status: 'healthy',
    uptime: 99.9,
    responseTime: 25,
    errorRate: 0.05,
    requestsPerMinute: 200,
    lastCheck: '2024-01-15T10:30:00Z'
  },
  {
    id: 4,
    name: 'Analytics Service',
    endpoint: '/api/analytics',
    status: 'down',
    uptime: 0,
    responseTime: 0,
    errorRate: 100,
    requestsPerMinute: 0,
    lastCheck: '2024-01-15T10:25:00Z'
  }
];

const mockAlerts = [
  {
    id: 1,
    type: 'critical',
    title: 'Database Server CPU Usage Critical',
    description: 'CPU usage exceeded 90% threshold',
    server: 'Database Server',
    timestamp: '2024-01-15T10:28:00Z',
    status: 'active',
    sentVia: ['email', 'sms']
  },
  {
    id: 2,
    type: 'warning',
    title: 'Background Job Failed',
    description: 'Data Sync Job failed with 27 errors',
    server: 'Background Job Server',
    timestamp: '2024-01-15T10:20:00Z',
    status: 'active',
    sentVia: ['email']
  },
  {
    id: 3,
    type: 'info',
    title: 'Microservice Response Time High',
    description: 'Billing Service response time > 100ms',
    server: 'Billing Service',
    timestamp: '2024-01-15T10:15:00Z',
    status: 'resolved',
    sentVia: ['email']
  }
];

const serverTypes = [
  { value: 'web', label: 'Web Server', icon: <DesktopOutlined />, color: '#1890ff' },
  { value: 'database', label: 'Database', icon: <DatabaseOutlined />, color: '#52c41a' },
  { value: 'cache', label: 'Cache', icon: <ThunderboltOutlined />, color: '#faad14' },
  { value: 'job', label: 'Background Job', icon: <SyncOutlined />, color: '#722ed1' }
];

const alertTypes = [
  { value: 'critical', label: 'Kritik', color: '#ff4d4f' },
  { value: 'warning', label: 'Uyarı', color: '#faad14' },
  { value: 'info', label: 'Bilgi', color: '#1890ff' }
];

export default function SystemMonitoringPage() {
  const { message } = App.useApp();
  const [servers, setServers] = useState(mockServers);
  const [databaseMetrics, setDatabaseMetrics] = useState(mockDatabaseMetrics);
  const [cacheMetrics, setCacheMetrics] = useState(mockCacheMetrics);
  const [backgroundJobs, setBackgroundJobs] = useState(mockBackgroundJobs);
  const [microservices, setMicroservices] = useState(mockMicroservices);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filters, setFilters] = useState({
    serverType: undefined,
    status: undefined,
    alertType: undefined
  });

  // Backend API states
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [monitoringDashboard, setMonitoringDashboard] = useState<MonitoringDashboard | null>(null);
  const [backendAlerts, setBackendAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch backend data
  const fetchSystemHealth = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`${API_BASE_URL}/monitoring/system-health`);
      if (!response.ok) throw new Error('Sistem sağlığı alınamadı');
      const data = await response.json();
      setSystemHealth(data);
    } catch (err) {
      setError('Sistem sağlığı alınırken hata oluştu');
      console.error('System health fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformanceMetrics = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`${API_BASE_URL}/monitoring/performance-metrics`);
      if (!response.ok) throw new Error('Performans metrikleri alınamadı');
      const data = await response.json();
      setPerformanceMetrics(data);
    } catch (err) {
      setError('Performans metrikleri alınırken hata oluştu');
      console.error('Performance metrics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonitoringDashboard = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`${API_BASE_URL}/monitoring/dashboard`);
      if (!response.ok) throw new Error('Monitoring dashboard alınamadı');
      const data = await response.json();
      setMonitoringDashboard(data);
    } catch (err) {
      setError('Monitoring dashboard alınırken hata oluştu');
      console.error('Monitoring dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`${API_BASE_URL}/monitoring/alerts`);
      if (!response.ok) throw new Error('Uyarılar alınamadı');
      const data = await response.json();
      setBackendAlerts(data.items || []);
    } catch (err) {
      setError('Uyarılar alınırken hata oluştu');
      console.error('Alerts fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchSystemHealth();
    fetchPerformanceMetrics();
    fetchMonitoringDashboard();
    fetchAlerts();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh backend data
      fetchSystemHealth();
      fetchPerformanceMetrics();
      fetchMonitoringDashboard();
      fetchAlerts();
      
      // Simulate real-time updates for mock data
      setServers(prev => prev.map(server => ({
        ...server,
        cpu: Math.floor(Math.random() * 100),
        ram: Math.floor(Math.random() * 100),
        disk: Math.floor(Math.random() * 100),
        network: Math.floor(Math.random() * 100),
        lastUpdate: new Date().toISOString()
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Statistics
  const stats = useMemo(() => [
    {
      title: 'Toplam Sunucu',
      value: servers.length,
      icon: <CloudServerOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Ortalama CPU',
      value: `${Math.round(servers.reduce((sum, s) => sum + s.cpu, 0) / servers.length)}%`,
      icon: <DesktopOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
      title: 'Ortalama RAM',
      value: `${Math.round(servers.reduce((sum, s) => sum + s.ram, 0) / servers.length)}%`,
      icon: <HddOutlined />,
      color: '#faad14',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Aktif Alarm',
      value: alerts.filter(a => a.status === 'active').length,
      icon: <AlertOutlined />,
      color: '#ff4d4f',
      gradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
    }
  ], [servers, alerts]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'green';
      case 'warning': return 'orange';
      case 'offline': return 'red';
      case 'down': return 'red';
      case 'healthy': return 'green';
      case 'running': return 'green';
      case 'idle': return 'blue';
      case 'failed': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'healthy':
      case 'running':
        return <CheckCircleOutlined />;
      case 'warning':
      case 'idle':
        return <ClockCircleOutlined />;
      case 'offline':
      case 'down':
      case 'failed':
        return <StopOutlined />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  const serverColumns: ColumnsType<any> = [
    {
      title: 'Sunucu',
      key: 'server',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.ip}</div>
        </div>
      )
    },
    {
      title: 'Tür',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => {
        const serverType = serverTypes.find(t => t.value === type);
        return (
          <Tag color={serverType?.color} icon={serverType?.icon}>
            {serverType?.label}
          </Tag>
        );
      }
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Badge
          status={status === 'online' ? 'success' : status === 'warning' ? 'warning' : 'error'}
          text={status === 'online' ? 'Çevrimiçi' : status === 'warning' ? 'Uyarı' : 'Çevrimdışı'}
        />
      )
    },
    {
      title: 'CPU',
      key: 'cpu',
      width: 100,
      render: (_, record) => (
        <div>
          <Progress
            percent={record.cpu}
            strokeColor={record.cpu > 80 ? '#ff4d4f' : record.cpu > 60 ? '#faad14' : '#52c41a'}
            format={(percent) => `${percent}%`}
            size="small"
          />
        </div>
      )
    },
    {
      title: 'RAM',
      key: 'ram',
      width: 100,
      render: (_, record) => (
        <div>
          <Progress
            percent={record.ram}
            strokeColor={record.ram > 80 ? '#ff4d4f' : record.ram > 60 ? '#faad14' : '#52c41a'}
            format={(percent) => `${percent}%`}
            size="small"
          />
        </div>
      )
    },
    {
      title: 'Disk',
      key: 'disk',
      width: 100,
      render: (_, record) => (
        <div>
          <Progress
            percent={record.disk}
            strokeColor={record.disk > 80 ? '#ff4d4f' : record.disk > 60 ? '#faad14' : '#52c41a'}
            format={(percent) => `${percent}%`}
            size="small"
          />
        </div>
      )
    },
    {
      title: 'Network',
      key: 'network',
      width: 100,
      render: (_, record) => (
        <div>
          <Progress
            percent={record.network}
            strokeColor={record.network > 80 ? '#ff4d4f' : record.network > 60 ? '#faad14' : '#52c41a'}
            format={(percent) => `${percent}%`}
            size="small"
          />
        </div>
      )
    },
    {
      title: 'Uptime',
      dataIndex: 'uptime',
      key: 'uptime',
      width: 150
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
              onClick={() => handleViewServerDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Yenile">
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={() => handleRefreshServer(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const databaseColumns: ColumnsType<any> = [
    {
      title: 'Veritabanı',
      dataIndex: 'name',
      key: 'name',
      width: 150
    },
    {
      title: 'Tür',
      dataIndex: 'type',
      key: 'type',
      width: 120
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Badge
          status={status === 'online' ? 'success' : 'error'}
          text={status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
        />
      )
    },
    {
      title: 'Bağlantılar',
      key: 'connections',
      width: 120,
      render: (_, record) => (
        <div>
          <Text>{record.connections}</Text>
          <Text type="secondary"> / {record.maxConnections}</Text>
        </div>
      )
    },
    {
      title: 'Aktif Sorgular',
      dataIndex: 'activeQueries',
      key: 'activeQueries',
      width: 120
    },
    {
      title: 'Yavaş Sorgular',
      dataIndex: 'slowQueries',
      key: 'slowQueries',
      width: 120,
      render: (queries) => (
        <Tag color={queries > 0 ? 'red' : 'green'}>{queries}</Tag>
      )
    },
    {
      title: 'Yanıt Süresi',
      key: 'responseTime',
      width: 120,
      render: (_, record) => (
        <Text>{record.responseTime}ms</Text>
      )
    },
    {
      title: 'Son Yedekleme',
      key: 'lastBackup',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{new Date(record.lastBackup).toLocaleDateString('tr-TR')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {new Date(record.lastBackup).toLocaleTimeString('tr-TR')}
          </div>
        </div>
      )
    }
  ];

  const cacheColumns: ColumnsType<any> = [
    {
      title: 'Cache',
      dataIndex: 'name',
      key: 'name',
      width: 150
    },
    {
      title: 'Tür',
      dataIndex: 'type',
      key: 'type',
      width: 120
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Badge
          status={status === 'online' ? 'success' : 'error'}
          text={status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
        />
      )
    },
    {
      title: 'Bellek Kullanımı',
      key: 'memoryUsage',
      width: 150,
      render: (_, record) => (
        <div>
          <Progress
            percent={record.memoryUsage}
            strokeColor={record.memoryUsage > 80 ? '#ff4d4f' : record.memoryUsage > 60 ? '#faad14' : '#52c41a'}
            format={(percent) => `${percent}%`}
            size="small"
          />
        </div>
      )
    },
    {
      title: 'Hit Rate',
      key: 'hitRate',
      width: 100,
      render: (_, record) => (
        <Text>{record.hitRate}%</Text>
      )
    },
    {
      title: 'Miss Rate',
      key: 'missRate',
      width: 100,
      render: (_, record) => (
        <Text>{record.missRate}%</Text>
      )
    },
    {
      title: 'Anahtar Sayısı',
      dataIndex: 'keys',
      key: 'keys',
      width: 120
    },
    {
      title: 'Bağlantılar',
      dataIndex: 'connections',
      key: 'connections',
      width: 100
    }
  ];

  const jobColumns: ColumnsType<any> = [
    {
      title: 'Job Adı',
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: 'Tür',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag color={
          type === 'email' ? 'blue' :
          type === 'report' ? 'green' :
          type === 'sync' ? 'orange' : 'default'
        }>
          {type}
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
          status={status === 'running' ? 'processing' : status === 'idle' ? 'default' : 'error'}
          text={status === 'running' ? 'Çalışıyor' : status === 'idle' ? 'Beklemede' : 'Başarısız'}
        />
      )
    },
    {
      title: 'İlerleme',
      key: 'progress',
      width: 120,
      render: (_, record) => (
        <div>
          <Progress
            percent={record.progress}
            strokeColor={record.status === 'failed' ? '#ff4d4f' : '#52c41a'}
            format={(percent) => `${percent}%`}
            size="small"
          />
        </div>
      )
    },
    {
      title: 'Tamamlanan',
      key: 'completed',
      width: 120,
      render: (_, record) => (
        <div>
          <Text>{record.completedJobs}</Text>
          <Text type="secondary"> / {record.totalJobs}</Text>
        </div>
      )
    },
    {
      title: 'Başarısız',
      dataIndex: 'failedJobs',
      key: 'failedJobs',
      width: 100,
      render: (failed) => (
        <Tag color={failed > 0 ? 'red' : 'green'}>{failed}</Tag>
      )
    },
    {
      title: 'Ort. İşlem Süresi',
      key: 'avgProcessingTime',
      width: 150,
      render: (_, record) => (
        <Text>{record.avgProcessingTime}s</Text>
      )
    },
    {
      title: 'Son Çalışma',
      key: 'lastRun',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{new Date(record.lastRun).toLocaleDateString('tr-TR')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {new Date(record.lastRun).toLocaleTimeString('tr-TR')}
          </div>
        </div>
      )
    }
  ];

  const microserviceColumns: ColumnsType<any> = [
    {
      title: 'Servis',
      dataIndex: 'name',
      key: 'name',
      width: 150
    },
    {
      title: 'Endpoint',
      dataIndex: 'endpoint',
      key: 'endpoint',
      width: 200,
      render: (endpoint) => (
        <Text code>{endpoint}</Text>
      )
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Badge
          status={status === 'healthy' ? 'success' : status === 'warning' ? 'warning' : 'error'}
          text={status === 'healthy' ? 'Sağlıklı' : status === 'warning' ? 'Uyarı' : 'Çevrimdışı'}
        />
      )
    },
    {
      title: 'Uptime',
      key: 'uptime',
      width: 100,
      render: (_, record) => (
        <div>
          <Progress
            percent={record.uptime}
            strokeColor={record.uptime > 99 ? '#52c41a' : record.uptime > 95 ? '#faad14' : '#ff4d4f'}
            format={(percent) => `${percent}%`}
            size="small"
          />
        </div>
      )
    },
    {
      title: 'Yanıt Süresi',
      key: 'responseTime',
      width: 120,
      render: (_, record) => (
        <Text>{record.responseTime}ms</Text>
      )
    },
    {
      title: 'Hata Oranı',
      key: 'errorRate',
      width: 100,
      render: (_, record) => (
        <Tag color={record.errorRate > 5 ? 'red' : record.errorRate > 1 ? 'orange' : 'green'}>
          {record.errorRate}%
        </Tag>
      )
    },
    {
      title: 'Dakikada İstek',
      dataIndex: 'requestsPerMinute',
      key: 'requestsPerMinute',
      width: 120
    },
    {
      title: 'Son Kontrol',
      key: 'lastCheck',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{new Date(record.lastCheck).toLocaleDateString('tr-TR')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {new Date(record.lastCheck).toLocaleTimeString('tr-TR')}
          </div>
        </div>
      )
    }
  ];

  const alertColumns: ColumnsType<any> = [
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
      title: 'Tür',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag color={alertTypes.find(t => t.value === type)?.color}>
          {alertTypes.find(t => t.value === type)?.label}
        </Tag>
      )
    },
    {
      title: 'Başlık',
      dataIndex: 'title',
      key: 'title',
      width: 250
    },
    {
      title: 'Sunucu',
      dataIndex: 'server',
      key: 'server',
      width: 150
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Badge
          status={status === 'active' ? 'error' : 'success'}
          text={status === 'active' ? 'Aktif' : 'Çözüldü'}
        />
      )
    },
    {
      title: 'Gönderim',
      key: 'sentVia',
      width: 120,
      render: (_, record) => (
        <Space>
          {record.sentVia.includes('email') && <MailOutlined style={{ color: '#1890ff' }} />}
          {record.sentVia.includes('sms') && <MessageOutlined style={{ color: '#52c41a' }} />}
        </Space>
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
              onClick={() => handleViewAlertDetails(record)}
            />
          </Tooltip>
          {record.status === 'active' && (
            <Tooltip title="Çözüldü Olarak İşaretle">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => handleResolveAlert(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const handleViewServerDetails = (server: any) => {
    message.info(`${server.name} detayları yakında eklenecek`);
  };

  const handleRefreshServer = (serverId: number) => {
    message.success('Sunucu bilgileri yenilendi');
  };

  const handleViewAlertDetails = (alert: any) => {
    message.info(`${alert.title} detayları yakında eklenecek`);
  };

  const handleResolveAlert = (alertId: number) => {
    setAlerts(alerts => alerts.map(a => 
      a.id === alertId ? { ...a, status: 'resolved' } : a
    ));
    message.success('Alarm çözüldü olarak işaretlendi');
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      serverType: undefined,
      status: undefined,
      alertType: undefined
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <MonitorOutlined /> Sistem İzleme
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

      {/* Main Monitoring Tabs */}
      <Tabs defaultActiveKey="servers" size="large">
        <TabPane
          tab={
            <span>
              <CloudServerOutlined />
              Sunucular
            </span>
          }
          key="servers"
        >
          <Card
            title="Sunucu Durumları"
            extra={
              <Space>
                <Select
                  placeholder="Sunucu Türü"
                  style={{ width: 120 }}
                  value={filters.serverType}
                  onChange={(value) => handleFilterChange('serverType', value)}
                  allowClear
                >
                  {serverTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
                <Select
                  placeholder="Durum"
                  style={{ width: 100 }}
                  value={filters.status}
                  onChange={(value) => handleFilterChange('status', value)}
                  allowClear
                >
                  <Option value="online">Çevrimiçi</Option>
                  <Option value="warning">Uyarı</Option>
                  <Option value="offline">Çevrimdışı</Option>
                </Select>
                <Button
                  icon={<FilterOutlined />}
                  onClick={clearFilters}
                >
                  Temizle
                </Button>
              </Space>
            }
          >
            <Table
              columns={serverColumns}
              dataSource={servers}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} / ${total} sunucu`
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <DatabaseOutlined />
              Veritabanı
            </span>
          }
          key="database"
        >
          <Card title="Veritabanı Metrikleri">
            <Table
              columns={databaseColumns}
              dataSource={databaseMetrics}
              rowKey="id"
              pagination={false}
              scroll={{ x: 1000 }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <ThunderboltOutlined />
              Cache
            </span>
          }
          key="cache"
        >
          <Card title="Cache Metrikleri">
            <Table
              columns={cacheColumns}
              dataSource={cacheMetrics}
              rowKey="id"
              pagination={false}
              scroll={{ x: 1000 }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <SyncOutlined />
              Background Jobs
            </span>
          }
          key="jobs"
        >
          <Card title="Background Job Durumları">
            <Table
              columns={jobColumns}
              dataSource={backgroundJobs}
              rowKey="id"
              pagination={false}
              scroll={{ x: 1200 }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <GlobalOutlined />
              Mikroservisler
            </span>
          }
          key="microservices"
        >
          <Card title="Mikroservis Durumları">
            <Table
              columns={microserviceColumns}
              dataSource={microservices}
              rowKey="id"
              pagination={false}
              scroll={{ x: 1200 }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <BellOutlined />
              Alarmlar
            </span>
          }
          key="alerts"
        >
          <Card
            title="Sistem Alarmları"
            extra={
              <Space>
                <Select
                  placeholder="Alarm Türü"
                  style={{ width: 120 }}
                  value={filters.alertType}
                  onChange={(value) => handleFilterChange('alertType', value)}
                  allowClear
                >
                  {alertTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
                <Button
                  icon={<FilterOutlined />}
                  onClick={clearFilters}
                >
                  Temizle
                </Button>
              </Space>
            }
          >
            <Table
              columns={alertColumns}
              dataSource={alerts}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} / ${total} alarm`
              }}
              scroll={{ x: 1000 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Real-time Monitoring Info */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SyncOutlined style={{ color: '#1890ff' }} />
            Canlı İzleme Bilgileri
          </div>
        }
        style={{ marginTop: '24px' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Alert
              message="Otomatik Yenileme"
              description="Sunucu metrikleri her 30 saniyede bir otomatik olarak güncellenir"
              type="info"
              showIcon
            />
          </Col>
          <Col xs={24} md={8}>
            <Alert
              message="Alarm Sistemi"
              description="Kritik durumlarda e-posta ve SMS ile otomatik bildirim gönderilir"
              type="warning"
              showIcon
            />
          </Col>
          <Col xs={24} md={8}>
            <Alert
              message="Performans İzleme"
              description="CPU, RAM, Disk ve Network kullanımı sürekli takip edilir"
              type="success"
              showIcon
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
} 