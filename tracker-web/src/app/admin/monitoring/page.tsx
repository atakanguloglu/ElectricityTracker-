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
  App,
  Spin
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
  title: string;
  description: string;
  server: string;
  timestamp: string;
  status: string;
  sentVia: string[];
  details?: any;
}

interface AlertDetails {
  id: string;
  type: string;
  title: string;
  description: string;
  server: string;
  timestamp: string;
  status: string;
  severity: string;
  category: string;
  impact: string;
  resolution: string;
  actions: string[];
  metrics: {
    errorCount: number;
    totalLogs: number;
    databaseConnections: number;
    memoryUsage: string;
    cpuUsage: string;
  };
  timeline: Array<{
    time: string;
    event: string;
  }>;
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

interface Server {
  id: number;
  name: string;
  ip: string;
  type: string;
  status: string;
  cpu: number;
  ram: number;
  disk: number;
  network: number;
  uptime: string;
  lastUpdate: string;
}

interface ServerDetails {
  id: number;
  name: string;
  ip: string;
  type: string;
  status: string;
  cpu: number;
  ram: number;
  disk: number;
  network: number;
  uptime: string;
  lastUpdate: string;
  details: {
    processInfo: {
      processName: string;
      processId: number;
      workingSet: string;
      totalMemory: string;
      threadCount: number;
      handleCount: number;
      startTime: string;
      totalProcessorTime: number;
    };
    systemInfo: {
      osVersion: string;
      machineName: string;
      processorCount: number;
      workingSet: string;
      is64BitProcess: boolean;
      is64BitOperatingSystem: boolean;
    };
    networkInfo: {
      localIpAddress: string;
      hostName: string;
      networkInterfaces: Array<{
        name: string;
        description: string;
        networkInterfaceType: string;
        speed: string;
      }>;
    };
    databaseInfo?: {
      canConnect: boolean;
      connectionString: string;
      pendingMigrations: string[];
      totalLogs: number;
      recentLogs: number;
      errorLogs: number;
    };
    performanceMetrics: {
      cpuUsage: number;
      memoryUsage: number;
      diskUsage: number;
      networkUsage: number;
      threadCount: number;
      handleCount: number;
    };
  };
}

interface DatabaseMetric {
  id: number;
  name: string;
  type: string;
  status: string;
  connections: number;
  maxConnections: number;
  activeQueries: number;
  slowQueries: number;
  responseTime: number;
  lastBackup: string;
  size: string;
}

interface CacheMetric {
  id: number;
  name: string;
  type: string;
  status: string;
  memoryUsage: number;
  maxMemory: string;
  hitRate: number;
  missRate: number;
  keys: number;
  connections: number;
  lastUpdate: string;
}

interface BackgroundJob {
  id: number;
  name: string;
  type: string;
  status: string;
  progress: number;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  avgProcessingTime: number;
  lastRun: string;
  nextRun: string;
}

interface Microservice {
  id: number;
  name: string;
  endpoint: string;
  status: string;
  uptime: number;
  responseTime: number;
  errorRate: number;
  requestsPerMinute: number;
  lastCheck: string;
}

const serverTypes = [
  { value: 'api', label: 'API Server', icon: <DesktopOutlined />, color: '#1890ff' },
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
  
  // Backend API states
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [monitoringDashboard, setMonitoringDashboard] = useState<MonitoringDashboard | null>(null);
  const [backendAlerts, setBackendAlerts] = useState<Alert[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [databaseMetrics, setDatabaseMetrics] = useState<DatabaseMetric[]>([]);
  const [cacheMetrics, setCacheMetrics] = useState<CacheMetric[]>([]);
  const [backgroundJobs, setBackgroundJobs] = useState<BackgroundJob[]>([]);
  const [microservices, setMicroservices] = useState<Microservice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    serverType: undefined,
    status: undefined,
    alertType: undefined
  });

  // Alert details modal states
  const [alertDetailsVisible, setAlertDetailsVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertDetails | null>(null);
  const [alertDetailsLoading, setAlertDetailsLoading] = useState(false);

  // Server details modal states
  const [serverDetailsVisible, setServerDetailsVisible] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerDetails | null>(null);
  const [serverDetailsLoading, setServerDetailsLoading] = useState(false);

  // Fetch backend data
  const fetchSystemHealth = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/monitoring/system-health`);
      if (!response.ok) throw new Error('Sistem sağlığı alınamadı');
      const data = await response.json();
      setSystemHealth(data);
    } catch (err) {
      console.error('System health fetch error:', err);
    }
  };

  const fetchPerformanceMetrics = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/monitoring/performance-metrics`);
      if (!response.ok) throw new Error('Performans metrikleri alınamadı');
      const data = await response.json();
      setPerformanceMetrics(data);
    } catch (err) {
      console.error('Performance metrics fetch error:', err);
    }
  };

  const fetchMonitoringDashboard = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/monitoring/dashboard`);
      if (!response.ok) throw new Error('Monitoring dashboard alınamadı');
      const data = await response.json();
      setMonitoringDashboard(data);
    } catch (err) {
      console.error('Monitoring dashboard fetch error:', err);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/monitoring/alerts`);
      if (!response.ok) throw new Error('Uyarılar alınamadı');
      const data = await response.json();
      setBackendAlerts(data.items || []);
    } catch (err) {
      console.error('Alerts fetch error:', err);
    }
  };

  const fetchServers = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/monitoring/servers`);
      if (!response.ok) throw new Error('Sunucu bilgileri alınamadı');
      const data = await response.json();
      setServers(data);
    } catch (err) {
      console.error('Servers fetch error:', err);
    }
  };

  const fetchDatabaseMetrics = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/monitoring/database-metrics`);
      if (!response.ok) throw new Error('Veritabanı metrikleri alınamadı');
      const data = await response.json();
      setDatabaseMetrics(data);
    } catch (err) {
      console.error('Database metrics fetch error:', err);
    }
  };

  const fetchCacheMetrics = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/monitoring/cache-metrics`);
      if (!response.ok) throw new Error('Cache metrikleri alınamadı');
      const data = await response.json();
      setCacheMetrics(data);
    } catch (err) {
      console.error('Cache metrics fetch error:', err);
    }
  };

  const fetchBackgroundJobs = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/monitoring/background-jobs`);
      if (!response.ok) throw new Error('Background job bilgileri alınamadı');
      const data = await response.json();
      setBackgroundJobs(data);
    } catch (err) {
      console.error('Background jobs fetch error:', err);
    }
  };

  const fetchMicroservices = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/monitoring/microservices`);
      if (!response.ok) throw new Error('Mikroservis bilgileri alınamadı');
      const data = await response.json();
      setMicroservices(data);
    } catch (err) {
      console.error('Microservices fetch error:', err);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchSystemHealth(),
        fetchPerformanceMetrics(),
        fetchMonitoringDashboard(),
        fetchAlerts(),
        fetchServers(),
        fetchDatabaseMetrics(),
        fetchCacheMetrics(),
        fetchBackgroundJobs(),
        fetchMicroservices()
      ]);
    } catch (err) {
      setError('Veriler yüklenirken hata oluştu');
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData();
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
      value: servers.length > 0 ? `${Math.round(servers.reduce((sum, s) => sum + s.cpu, 0) / servers.length)}%` : '0%',
      icon: <DesktopOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
      title: 'Ortalama RAM',
      value: servers.length > 0 ? `${Math.round(servers.reduce((sum, s) => sum + s.ram, 0) / servers.length)}%` : '0%',
      icon: <HddOutlined />,
      color: '#faad14',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Aktif Alarm',
      value: backendAlerts.filter(a => a.status === 'active').length,
      icon: <AlertOutlined />,
      color: '#ff4d4f',
      gradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
    }
  ], [servers, backendAlerts]);

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

  const serverColumns: ColumnsType<Server> = [
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

  const databaseColumns: ColumnsType<DatabaseMetric> = [
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

  const cacheColumns: ColumnsType<CacheMetric> = [
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

  const jobColumns: ColumnsType<BackgroundJob> = [
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
          type === 'sync' ? 'orange' :
          type === 'maintenance' ? 'purple' :
          type === 'backup' ? 'cyan' : 'default'
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

  const microserviceColumns: ColumnsType<Microservice> = [
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

  const alertColumns: ColumnsType<Alert> = [
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

  const handleViewServerDetails = async (server: Server) => {
    try {
      setServerDetailsLoading(true);
      setServerDetailsVisible(true);
      
      const response = await apiRequest(`${API_BASE_URL}/admin/monitoring/servers/${server.id}`);
      if (!response.ok) throw new Error('Sunucu detayları alınamadı');
      
      const details: ServerDetails = await response.json();
      setSelectedServer(details);
    } catch (err) {
      console.error('Server details fetch error:', err);
      message.error('Sunucu detayları yüklenirken hata oluştu');
    } finally {
      setServerDetailsLoading(false);
    }
  };

  const handleRefreshServer = (serverId: number) => {
    message.success('Sunucu bilgileri yenilendi');
    fetchServers();
  };

  const handleViewAlertDetails = async (alert: Alert) => {
    try {
      setAlertDetailsLoading(true);
      setAlertDetailsVisible(true);
      
      const response = await apiRequest(`${API_BASE_URL}/admin/monitoring/alerts/${alert.id}`);
      if (!response.ok) throw new Error('Alarm detayları alınamadı');
      
      const details: AlertDetails = await response.json();
      setSelectedAlert(details);
    } catch (err) {
      console.error('Alert details fetch error:', err);
      message.error('Alarm detayları yüklenirken hata oluştu');
    } finally {
      setAlertDetailsLoading(false);
    }
  };

  const handleResolveAlert = (alertId: string) => {
    message.success('Alarm çözüldü olarak işaretlendi');
    fetchAlerts();
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

  // Tabs items configuration
  const tabItems = [
    {
      key: 'servers',
      label: (
        <span>
          <CloudServerOutlined />
          Sunucular
        </span>
      ),
      children: (
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
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchServers}
                loading={loading}
              >
                Yenile
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
            loading={loading}
          />
        </Card>
      )
    },
    {
      key: 'database',
      label: (
        <span>
          <DatabaseOutlined />
          Veritabanı
        </span>
      ),
      children: (
        <Card 
          title="Veritabanı Metrikleri"
          extra={
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchDatabaseMetrics}
              loading={loading}
            >
              Yenile
            </Button>
          }
        >
          <Table
            columns={databaseColumns}
            dataSource={databaseMetrics}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1000 }}
            loading={loading}
          />
        </Card>
      )
    },
    {
      key: 'cache',
      label: (
        <span>
          <ThunderboltOutlined />
          Cache
        </span>
      ),
      children: (
        <Card 
          title="Cache Metrikleri"
          extra={
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchCacheMetrics}
              loading={loading}
            >
              Yenile
            </Button>
          }
        >
          <Table
            columns={cacheColumns}
            dataSource={cacheMetrics}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1000 }}
            loading={loading}
          />
        </Card>
      )
    },
    {
      key: 'jobs',
      label: (
        <span>
          <SyncOutlined />
          Background Jobs
        </span>
      ),
      children: (
        <Card 
          title="Background Job Durumları"
          extra={
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchBackgroundJobs}
              loading={loading}
            >
              Yenile
            </Button>
          }
        >
          <Table
            columns={jobColumns}
            dataSource={backgroundJobs}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1200 }}
            loading={loading}
          />
        </Card>
      )
    },
    {
      key: 'microservices',
      label: (
        <span>
          <GlobalOutlined />
          Mikroservisler
        </span>
      ),
      children: (
        <Card 
          title="Mikroservis Durumları"
          extra={
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchMicroservices}
              loading={loading}
            >
              Yenile
            </Button>
          }
        >
          <Table
            columns={microserviceColumns}
            dataSource={microservices}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1200 }}
            loading={loading}
          />
        </Card>
      )
    },
    {
      key: 'alerts',
      label: (
        <span>
          <BellOutlined />
          Alarmlar
        </span>
      ),
      children: (
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
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchAlerts}
                loading={loading}
              >
                Yenile
              </Button>
            </Space>
          }
        >
          <Table
            columns={alertColumns}
            dataSource={backendAlerts}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} / ${total} alarm`
            }}
            scroll={{ x: 1000 }}
            loading={loading}
          />
        </Card>
      )
    }
  ];

  if (loading && servers.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Sistem verileri yükleniyor...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <MonitorOutlined /> Sistem İzleme
      </Title>

      {error && (
        <Alert
          message="Hata"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '16px' }}
          action={
            <Button size="small" onClick={fetchAllData}>
              Tekrar Dene
            </Button>
          }
        />
      )}

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
      <Tabs defaultActiveKey="servers" size="large" items={tabItems} />

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

      {/* Alert Details Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertOutlined style={{ 
              color: selectedAlert?.type === 'critical' ? '#ff4d4f' : 
                     selectedAlert?.type === 'warning' ? '#faad14' : '#1890ff' 
            }} />
            Alarm Detayları
          </div>
        }
        open={alertDetailsVisible}
        onCancel={() => {
          setAlertDetailsVisible(false);
          setSelectedAlert(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setAlertDetailsVisible(false);
            setSelectedAlert(null);
          }}>
            Kapat
          </Button>,
          <Button 
            key="resolve" 
            type="primary" 
            danger={selectedAlert?.status === 'active'}
            onClick={() => {
              message.success('Alarm çözüldü olarak işaretlendi');
              setAlertDetailsVisible(false);
              setSelectedAlert(null);
              fetchAlerts();
            }}
          >
            {selectedAlert?.status === 'active' ? 'Çözüldü Olarak İşaretle' : 'Çözüldü'}
          </Button>
        ]}
        width={800}
        centered
        destroyOnHidden
        getContainer={() => document.body}
        style={{ top: '50%', transform: 'translateY(-50%)', margin: 0 }}
        styles={{ mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(2px)' } }}
      >
        {alertDetailsLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>Alarm detayları yükleniyor...</div>
          </div>
        ) : selectedAlert ? (
          <div>
            {/* Alert Header */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Tag color={
                  selectedAlert.type === 'critical' ? 'red' :
                  selectedAlert.type === 'warning' ? 'orange' : 'blue'
                }>
                  {selectedAlert.severity}
                </Tag>
                <Tag color="default">{selectedAlert.category}</Tag>
                <Tag color="default">{selectedAlert.impact}</Tag>
              </div>
              <Title level={4} style={{ margin: '8px 0' }}>{selectedAlert.title}</Title>
              <Text type="secondary">{selectedAlert.description}</Text>
            </div>

            <Row gutter={[16, 16]}>
              {/* Metrics */}
              <Col span={12}>
                <Card title="Metrikler" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Hata Sayısı">
                      <Text strong>{selectedAlert.metrics.errorCount}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Toplam Log">
                      <Text>{selectedAlert.metrics.totalLogs}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="DB Bağlantıları">
                      <Text>{selectedAlert.metrics.databaseConnections}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Bellek Kullanımı">
                      <Text>{selectedAlert.metrics.memoryUsage}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="CPU Kullanımı">
                      <Text>{selectedAlert.metrics.cpuUsage}</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              {/* Resolution */}
              <Col span={12}>
                <Card title="Çözüm" size="small">
                  <Text>{selectedAlert.resolution}</Text>
                </Card>
              </Col>
            </Row>

            {/* Actions */}
            <Card title="Önerilen Aksiyonlar" size="small" style={{ marginTop: '16px' }}>
              <List
                size="small"
                dataSource={selectedAlert.actions}
                renderItem={(action, index) => (
                  <List.Item>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Badge count={index + 1} style={{ backgroundColor: '#1890ff' }} />
                      <Text>{action}</Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            {/* Timeline */}
            <Card title="Zaman Çizelgesi" size="small" style={{ marginTop: '16px' }}>
              <Timeline
                items={selectedAlert.timeline.map((item, index) => ({
                  color: index === selectedAlert.timeline.length - 1 ? 'red' : 'blue',
                  children: (
                    <div>
                      <div style={{ fontWeight: 500 }}>{item.event}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {new Date(item.time).toLocaleString('tr-TR')}
                      </div>
                    </div>
                  )
                }))}
              />
            </Card>
          </div>
        ) : null}
      </Modal>

      {/* Server Details Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CloudServerOutlined style={{ 
              color: selectedServer?.status === 'online' ? '#52c41a' : 
                     selectedServer?.status === 'warning' ? '#faad14' : '#ff4d4f' 
            }} />
            Sunucu Detayları
          </div>
        }
        open={serverDetailsVisible}
        onCancel={() => {
          setServerDetailsVisible(false);
          setSelectedServer(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setServerDetailsVisible(false);
            setSelectedServer(null);
          }}>
            Kapat
          </Button>,
          <Button 
            key="refresh" 
            type="primary"
            onClick={() => {
              if (selectedServer) {
                handleViewServerDetails(selectedServer);
              }
            }}
          >
            Yenile
          </Button>
        ]}
        width={900}
        centered
        destroyOnHidden
        getContainer={() => document.body}
        style={{ top: '50%', transform: 'translateY(-50%)', margin: 0 }}
        styles={{ mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(2px)' } }}
      >
        {serverDetailsLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>Sunucu detayları yükleniyor...</div>
          </div>
        ) : selectedServer ? (
          <div>
            {/* Server Header */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Tag color={
                  selectedServer.status === 'online' ? 'green' :
                  selectedServer.status === 'warning' ? 'orange' : 'red'
                }>
                  {selectedServer.status === 'online' ? 'Çevrimiçi' : 
                   selectedServer.status === 'warning' ? 'Uyarı' : 'Çevrimdışı'}
                </Tag>
                <Tag color="default">{selectedServer.type.toUpperCase()}</Tag>
                <Tag color="default">{selectedServer.ip}</Tag>
              </div>
              <Title level={4} style={{ margin: '8px 0' }}>{selectedServer.name}</Title>
              <Text type="secondary">Son güncelleme: {new Date(selectedServer.lastUpdate).toLocaleString('tr-TR')}</Text>
            </div>

            <Row gutter={[16, 16]}>
              {/* Process Info */}
              <Col span={12}>
                <Card title="İşlem Bilgileri" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="İşlem Adı">
                      <Text strong>{selectedServer.details.processInfo.processName}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="İşlem ID">
                      <Text>{selectedServer.details.processInfo.processId}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Çalışma Seti">
                      <Text>{selectedServer.details.processInfo.workingSet}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Toplam Bellek">
                      <Text>{selectedServer.details.processInfo.totalMemory}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Thread Sayısı">
                      <Text>{selectedServer.details.processInfo.threadCount}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Handle Sayısı">
                      <Text>{selectedServer.details.processInfo.handleCount}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Başlangıç Zamanı">
                      <Text>{new Date(selectedServer.details.processInfo.startTime).toLocaleString('tr-TR')}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Toplam İşlemci Zamanı">
                      <Text>{selectedServer.details.processInfo.totalProcessorTime.toFixed(2)} saniye</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              {/* System Info */}
              <Col span={12}>
                <Card title="Sistem Bilgileri" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="İşletim Sistemi">
                      <Text>{selectedServer.details.systemInfo.osVersion}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Makine Adı">
                      <Text>{selectedServer.details.systemInfo.machineName}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="İşlemci Sayısı">
                      <Text>{selectedServer.details.systemInfo.processorCount}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Sistem Belleği">
                      <Text>{selectedServer.details.systemInfo.workingSet}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="64-bit İşlem">
                      <Text>{selectedServer.details.systemInfo.is64BitProcess ? 'Evet' : 'Hayır'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="64-bit OS">
                      <Text>{selectedServer.details.systemInfo.is64BitOperatingSystem ? 'Evet' : 'Hayır'}</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            {/* Network Info */}
            <Card title="Ağ Bilgileri" size="small" style={{ marginTop: '16px' }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <div>
                    <Text strong>Yerel IP:</Text> {selectedServer.details.networkInfo.localIpAddress}
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <Text strong>Host Adı:</Text> {selectedServer.details.networkInfo.hostName}
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <Text strong>Uptime:</Text> {selectedServer.uptime}
                  </div>
                </Col>
              </Row>
              
              <div style={{ marginTop: '16px' }}>
                <Text strong>Ağ Arayüzleri:</Text>
                <List
                  size="small"
                  dataSource={selectedServer.details.networkInfo.networkInterfaces}
                  renderItem={(iface) => (
                    <List.Item>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                          <Text strong>{iface.name}</Text>
                          <br />
                          <Text type="secondary">{iface.description}</Text>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <Text>{iface.networkInterfaceType}</Text>
                          <br />
                          <Text type="secondary">{iface.speed}</Text>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </Card>

            {/* Database Info (if applicable) */}
            {selectedServer.details.databaseInfo && (
              <Card title="Veritabanı Bilgileri" size="small" style={{ marginTop: '16px' }}>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <div>
                      <Text strong>Bağlantı Durumu:</Text>
                      <Tag color={selectedServer.details.databaseInfo.canConnect ? 'green' : 'red'}>
                        {selectedServer.details.databaseInfo.canConnect ? 'Bağlı' : 'Bağlantı Yok'}
                      </Tag>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <Text strong>Toplam Log:</Text> {selectedServer.details.databaseInfo.totalLogs}
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <Text strong>Son Saat Log:</Text> {selectedServer.details.databaseInfo.recentLogs}
                    </div>
                  </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: '8px' }}>
                  <Col span={8}>
                    <div>
                      <Text strong>Hata Logları:</Text> {selectedServer.details.databaseInfo.errorLogs}
                    </div>
                  </Col>
                  <Col span={16}>
                    <div>
                      <Text strong>Bekleyen Migrasyonlar:</Text>
                      {selectedServer.details.databaseInfo.pendingMigrations.length > 0 ? (
                        <div style={{ marginTop: '4px' }}>
                          {selectedServer.details.databaseInfo.pendingMigrations.map((migration, index) => (
                            <Tag key={index} color="orange" style={{ marginBottom: '4px' }}>
                              {migration}
                            </Tag>
                          ))}
                        </div>
                      ) : (
                        <Tag color="green">Yok</Tag>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card>
            )}

            {/* Performance Metrics */}
            <Card title="Performans Metrikleri" size="small" style={{ marginTop: '16px' }}>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Statistic
                    title="CPU Kullanımı"
                    value={selectedServer.details.performanceMetrics.cpuUsage}
                    suffix="%"
                    valueStyle={{ color: selectedServer.details.performanceMetrics.cpuUsage > 80 ? '#cf1322' : '#3f8600' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Bellek Kullanımı"
                    value={selectedServer.details.performanceMetrics.memoryUsage}
                    suffix="%"
                    valueStyle={{ color: selectedServer.details.performanceMetrics.memoryUsage > 80 ? '#cf1322' : '#3f8600' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Disk Kullanımı"
                    value={selectedServer.details.performanceMetrics.diskUsage}
                    suffix="%"
                    valueStyle={{ color: selectedServer.details.performanceMetrics.diskUsage > 80 ? '#cf1322' : '#3f8600' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Ağ Kullanımı"
                    value={selectedServer.details.performanceMetrics.networkUsage}
                    suffix="MB"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
              </Row>
            </Card>
          </div>
        ) : null}
      </Modal>
    </div>
  );
} 