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
  Timeline,
  Avatar,
  Steps,
  Upload,
  Dropdown
} from 'antd';
import {
  RobotOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  AreaChartOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  DownloadOutlined,
  FilterOutlined,
  SearchOutlined,
  EyeOutlined,
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
  CalendarOutlined,
  ClearOutlined,
  ExportOutlined,
  SecurityScanOutlined,
  StopOutlined,
  PlayCircleOutlined,
  FireOutlined,
  ThunderboltOutlined,
  DesktopOutlined,
  HddOutlined,
  WifiOutlined,
  SyncOutlined,
  BellOutlined,
  MailOutlined,
  MessageOutlined,
  DashboardOutlined,
  MonitorOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  ThunderboltOutlined as LightningOutlined,
  DropboxOutlined,
  CarOutlined,
  ToolOutlined,
  CalculatorOutlined,
  BulbOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  HeatMapOutlined,
  CrownOutlined,
  StarOutlined,
  EnvironmentOutlined,
  CloudOutlined,
  SunOutlined,
  RiseOutlined,
  FallOutlined
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

const mockDepartments = [
  { id: 1, name: 'IT Departmanı', tenantId: 1 },
  { id: 2, name: 'Muhasebe', tenantId: 1 },
  { id: 3, name: 'Satış', tenantId: 1 },
  { id: 4, name: 'Üretim', tenantId: 2 },
  { id: 5, name: 'Ar-Ge', tenantId: 2 },
  { id: 6, name: 'İnsan Kaynakları', tenantId: 3 },
  { id: 7, name: 'Pazarlama', tenantId: 3 },
  { id: 8, name: 'Operasyon', tenantId: 4 },
  { id: 9, name: 'Finans', tenantId: 4 },
  { id: 10, name: 'Müşteri Hizmetleri', tenantId: 5 }
];

const mockConsumptionPredictions = [
  {
    id: 1,
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    resourceType: 'electricity',
    resourceName: 'Elektrik',
    currentMonth: 1250,
    predictedNextMonth: 1320,
    predictedYearly: 15800,
    confidence: 85,
    trend: 'increasing',
    factors: ['Hava sıcaklığı artışı', 'Yeni ekipman kurulumu'],
    recommendations: ['LED aydınlatma geçişi', 'Enerji tasarruflu cihazlar']
  },
  {
    id: 2,
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    resourceType: 'water',
    resourceName: 'Su',
    currentMonth: 450,
    predictedNextMonth: 420,
    predictedYearly: 5100,
    confidence: 92,
    trend: 'decreasing',
    factors: ['Su tasarruf önlemleri', 'Yağış artışı'],
    recommendations: ['Su tasarruf cihazları', 'Yağmur suyu toplama']
  },
  {
    id: 3,
    tenantId: 2,
    tenantName: 'XYZ Ltd.',
    resourceType: 'gas',
    resourceName: 'Doğalgaz',
    currentMonth: 450,
    predictedNextMonth: 520,
    predictedYearly: 6200,
    confidence: 78,
    trend: 'increasing',
    factors: ['Kış sezonu yaklaşması', 'Üretim artışı'],
    recommendations: ['Isı yalıtımı', 'Verimli ısıtma sistemleri']
  }
];

const mockCostSavings = [
  {
    id: 1,
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    departmentId: 1,
    departmentName: 'IT Departmanı',
    currentCost: 4500,
    potentialSavings: 1200,
    savingsPercentage: 26.7,
    recommendations: [
      'Sunucu sanallaştırma: ₺800 tasarruf',
      'Enerji tasarruflu monitörler: ₺400 tasarruf'
    ],
    implementationTime: '2-3 ay',
    roi: 180,
    priority: 'high'
  },
  {
    id: 2,
    tenantId: 2,
    tenantName: 'XYZ Ltd.',
    departmentId: 4,
    departmentName: 'Üretim',
    currentCost: 8500,
    potentialSavings: 2100,
    savingsPercentage: 24.7,
    recommendations: [
      'Verimli motorlar: ₺1200 tasarruf',
      'Akıllı aydınlatma: ₺900 tasarruf'
    ],
    implementationTime: '4-6 ay',
    roi: 220,
    priority: 'medium'
  },
  {
    id: 3,
    tenantId: 3,
    tenantName: 'Tech Solutions',
    departmentId: 6,
    departmentName: 'İnsan Kaynakları',
    currentCost: 2800,
    potentialSavings: 650,
    savingsPercentage: 23.2,
    recommendations: [
      'Uzaktan çalışma: ₺400 tasarruf',
      'Enerji yönetim sistemi: ₺250 tasarruf'
    ],
    implementationTime: '1-2 ay',
    roi: 150,
    priority: 'low'
  }
];

const mockDepartmentKPIs = [
  {
    id: 1,
    departmentId: 1,
    departmentName: 'IT Departmanı',
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    energyEfficiency: 85,
    costPerEmployee: 180,
    carbonFootprint: 2.5,
    sustainabilityScore: 78,
    trend: 'improving',
    lastMonth: 82,
    target: 90,
    recommendations: ['Sunucu optimizasyonu', 'Enerji izleme sistemi']
  },
  {
    id: 2,
    departmentId: 4,
    departmentName: 'Üretim',
    tenantId: 2,
    tenantName: 'XYZ Ltd.',
    energyEfficiency: 72,
    costPerEmployee: 320,
    carbonFootprint: 4.8,
    sustainabilityScore: 65,
    trend: 'stable',
    lastMonth: 70,
    target: 80,
    recommendations: ['Verimli ekipman', 'Atık azaltma']
  },
  {
    id: 3,
    departmentId: 6,
    departmentName: 'İnsan Kaynakları',
    tenantId: 3,
    tenantName: 'Tech Solutions',
    energyEfficiency: 91,
    costPerEmployee: 95,
    carbonFootprint: 1.2,
    sustainabilityScore: 88,
    trend: 'improving',
    lastMonth: 89,
    target: 95,
    recommendations: ['Yeşil ofis sertifikası', 'Sürdürülebilirlik eğitimi']
  }
];

const mockCarbonFootprint = [
  {
    id: 1,
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    month: '2024-01',
    electricityEmissions: 2.8,
    gasEmissions: 1.2,
    waterEmissions: 0.3,
    fuelEmissions: 0.8,
    totalEmissions: 5.1,
    targetEmissions: 4.5,
    reduction: 12.5,
    sustainabilityLevel: 'good'
  },
  {
    id: 2,
    tenantId: 2,
    tenantName: 'XYZ Ltd.',
    month: '2024-01',
    electricityEmissions: 4.2,
    gasEmissions: 2.1,
    waterEmissions: 0.5,
    fuelEmissions: 1.5,
    totalEmissions: 8.3,
    targetEmissions: 7.0,
    reduction: 8.2,
    sustainabilityLevel: 'moderate'
  },
  {
    id: 3,
    tenantId: 3,
    tenantName: 'Tech Solutions',
    month: '2024-01',
    electricityEmissions: 1.8,
    gasEmissions: 0.8,
    waterEmissions: 0.2,
    fuelEmissions: 0.4,
    totalEmissions: 3.2,
    targetEmissions: 3.0,
    reduction: 18.7,
    sustainabilityLevel: 'excellent'
  }
];

const mockExecutiveKPIs = [
  {
    id: 1,
    metric: 'Toplam Enerji Tasarrufu',
    currentValue: '₺45,200',
    previousValue: '₺38,500',
    change: '+17.4%',
    trend: 'up',
    target: '₺50,000',
    progress: 90.4,
    status: 'on-track'
  },
  {
    id: 2,
    metric: 'Karbon Ayak İzi Azalması',
    currentValue: '15.2 ton',
    previousValue: '18.7 ton',
    change: '-18.7%',
    trend: 'down',
    target: '12.0 ton',
    progress: 73.3,
    status: 'on-track'
  },
  {
    id: 3,
    metric: 'Enerji Verimliliği',
    currentValue: '78.5%',
    previousValue: '75.2%',
    change: '+4.4%',
    trend: 'up',
    target: '85.0%',
    progress: 92.4,
    status: 'on-track'
  },
  {
    id: 4,
    metric: 'Sürdürülebilirlik Skoru',
    currentValue: '82.3',
    previousValue: '79.1',
    change: '+4.1%',
    trend: 'up',
    target: '90.0',
    progress: 91.4,
    status: 'on-track'
  }
];

const resourceTypes = [
  { value: 'electricity', label: 'Elektrik', icon: <LightningOutlined />, color: '#faad14' },
  { value: 'water', label: 'Su', icon: <DropboxOutlined />, color: '#1890ff' },
  { value: 'gas', label: 'Doğalgaz', icon: <FireOutlined />, color: '#ff4d4f' },
  { value: 'fuel', label: 'Yakıt', icon: <CarOutlined />, color: '#722ed1' },
  { value: 'other', label: 'Diğer', icon: <ToolOutlined />, color: '#52c41a' }
];

const priorityLevels = [
  { value: 'high', label: 'Yüksek', color: '#ff4d4f' },
  { value: 'medium', label: 'Orta', color: '#faad14' },
  { value: 'low', label: 'Düşük', color: '#52c41a' }
];

const sustainabilityLevels = [
  { value: 'excellent', label: 'Mükemmel', color: '#52c41a' },
  { value: 'good', label: 'İyi', color: '#1890ff' },
  { value: 'moderate', label: 'Orta', color: '#faad14' },
  { value: 'poor', label: 'Zayıf', color: '#ff4d4f' }
];

export default function AIAnalyticsPage() {
  const [consumptionPredictions, setConsumptionPredictions] = useState(mockConsumptionPredictions);
  const [costSavings, setCostSavings] = useState(mockCostSavings);
  const [departmentKPIs, setDepartmentKPIs] = useState(mockDepartmentKPIs);
  const [carbonFootprint, setCarbonFootprint] = useState(mockCarbonFootprint);
  const [executiveKPIs, setExecutiveKPIs] = useState(mockExecutiveKPIs);
  const [filters, setFilters] = useState({
    tenantId: undefined,
    resourceType: undefined,
    departmentId: undefined,
    priority: undefined
  });

  // Statistics
  const stats = useMemo(() => [
    {
      title: 'Toplam Tasarruf Potansiyeli',
      value: `₺${costSavings.reduce((sum, item) => sum + item.potentialSavings, 0).toLocaleString()}`,
      icon: <DollarOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
      title: 'Ortalama Tahmin Güvenilirliği',
      value: `${Math.round(consumptionPredictions.reduce((sum, item) => sum + item.confidence, 0) / consumptionPredictions.length)}%`,
      icon: <RobotOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Karbon Azalması',
      value: `${carbonFootprint.reduce((sum, item) => sum + item.reduction, 0) / carbonFootprint.length}%`,
      icon: <EnvironmentOutlined />,
      color: '#faad14',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Sürdürülebilirlik Skoru',
      value: `${Math.round(departmentKPIs.reduce((sum, item) => sum + item.sustainabilityScore, 0) / departmentKPIs.length)}`,
      icon: <TrophyOutlined />,
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  ], [costSavings, consumptionPredictions, carbonFootprint, departmentKPIs]);

  const predictionColumns: ColumnsType<any> = [
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
      title: 'Kaynak',
      dataIndex: 'resourceName',
      key: 'resourceName',
      width: 120,
      render: (name, record) => {
        const resourceType = resourceTypes.find(t => t.value === record.resourceType);
        return (
          <Tag color={resourceType?.color} icon={resourceType?.icon}>
            {name}
          </Tag>
        );
      }
    },
    {
      title: 'Bu Ay',
      key: 'currentMonth',
      width: 100,
      render: (_, record) => (
        <div style={{ fontWeight: 'bold' }}>
          {record.currentMonth.toLocaleString()}
        </div>
      )
    },
    {
      title: 'Gelecek Ay Tahmini',
      key: 'predictedNextMonth',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
            {record.predictedNextMonth.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.trend === 'increasing' ? (
              <RiseOutlined style={{ color: '#ff4d4f' }} />
            ) : (
              <FallOutlined style={{ color: '#52c41a' }} />
            )}
            {record.trend === 'increasing' ? 'Artış' : 'Azalış'}
          </div>
        </div>
      )
    },
    {
      title: 'Yıllık Tahmin',
      key: 'predictedYearly',
      width: 120,
      render: (_, record) => (
        <div style={{ fontWeight: 'bold', color: '#722ed1' }}>
          {record.predictedYearly.toLocaleString()}
        </div>
      )
    },
    {
      title: 'Güvenilirlik',
      key: 'confidence',
      width: 120,
      render: (_, record) => (
        <div>
          <Progress
            percent={record.confidence}
            strokeColor={record.confidence > 80 ? '#52c41a' : record.confidence > 60 ? '#faad14' : '#ff4d4f'}
            format={(percent) => `${percent}%`}
            size="small"
          />
        </div>
      )
    },
    {
      title: 'Faktörler',
      key: 'factors',
      width: 200,
      render: (_, record) => (
        <div>
          {record.factors.map((factor: string, index: number) => (
            <Tag key={index} style={{ marginBottom: '2px' }}>
              {factor}
            </Tag>
          ))}
        </div>
      )
    },
    {
      title: 'Öneriler',
      key: 'recommendations',
      width: 200,
      render: (_, record) => (
        <div>
          {record.recommendations.map((rec: string, index: number) => (
            <Tag key={index} color="blue" style={{ marginBottom: '2px' }}>
              {rec}
            </Tag>
          ))}
        </div>
      )
    }
  ];

  const costSavingsColumns: ColumnsType<any> = [
    {
      title: 'Tenant',
      dataIndex: 'tenantName',
      key: 'tenantName',
      width: 150,
      render: (tenantName) => (
        <Tag color="blue">{tenantName}</Tag>
      )
    },
    {
      title: 'Departman',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 150,
      render: (departmentName) => (
        <Tag color="green">{departmentName}</Tag>
      )
    },
    {
      title: 'Mevcut Maliyet',
      key: 'currentCost',
      width: 150,
      render: (_, record) => (
        <div style={{ fontWeight: 'bold', color: '#ff4d4f' }}>
          ₺{record.currentCost.toLocaleString()}
        </div>
      )
    },
    {
      title: 'Tasarruf Potansiyeli',
      key: 'potentialSavings',
      width: 150,
      render: (_, record) => (
        <div style={{ fontWeight: 'bold', color: '#52c41a' }}>
          ₺{record.potentialSavings.toLocaleString()}
        </div>
      )
    },
    {
      title: 'Tasarruf Oranı',
      key: 'savingsPercentage',
      width: 120,
      render: (_, record) => (
        <Tag color="green">{record.savingsPercentage}%</Tag>
      )
    },
    {
      title: 'ROI',
      key: 'roi',
      width: 100,
      render: (_, record) => (
        <Tag color="blue">{record.roi}%</Tag>
      )
    },
    {
      title: 'Öncelik',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) => {
        const priorityLevel = priorityLevels.find(p => p.value === priority);
        return (
          <Tag color={priorityLevel?.color}>
            {priorityLevel?.label}
          </Tag>
        );
      }
    },
    {
      title: 'Uygulama Süresi',
      dataIndex: 'implementationTime',
      key: 'implementationTime',
      width: 120
    },
    {
      title: 'Öneriler',
      key: 'recommendations',
      width: 250,
      render: (_, record) => (
        <div>
          {record.recommendations.map((rec: string, index: number) => (
            <div key={index} style={{ fontSize: '12px', marginBottom: '2px' }}>
              • {rec}
            </div>
          ))}
        </div>
      )
    }
  ];

  const departmentKPIColumns: ColumnsType<any> = [
    {
      title: 'Departman',
      key: 'department',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.departmentName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.tenantName}</div>
        </div>
      )
    },
    {
      title: 'Enerji Verimliliği',
      key: 'energyEfficiency',
      width: 150,
      render: (_, record) => (
        <div>
          <Progress
            percent={record.energyEfficiency}
            strokeColor={record.energyEfficiency > 80 ? '#52c41a' : record.energyEfficiency > 60 ? '#faad14' : '#ff4d4f'}
            format={(percent) => `${percent}%`}
            size="small"
          />
        </div>
      )
    },
    {
      title: 'Kişi Başı Maliyet',
      key: 'costPerEmployee',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>₺{record.costPerEmployee}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
                         {record.trend === 'improving' ? (
               <FallOutlined style={{ color: '#52c41a' }} />
             ) : record.trend === 'stable' ? (
               <RiseOutlined style={{ color: '#faad14' }} />
             ) : (
               <RiseOutlined style={{ color: '#ff4d4f' }} />
             )}
            {record.trend === 'improving' ? 'İyileşiyor' : record.trend === 'stable' ? 'Stabil' : 'Kötüleşiyor'}
          </div>
        </div>
      )
    },
    {
      title: 'Karbon Ayak İzi',
      key: 'carbonFootprint',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.carbonFootprint} ton CO₂</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Hedef: {record.target} ton
          </div>
        </div>
      )
    },
    {
      title: 'Sürdürülebilirlik Skoru',
      key: 'sustainabilityScore',
      width: 150,
      render: (_, record) => (
        <div>
          <Progress
            percent={record.sustainabilityScore}
            strokeColor={record.sustainabilityScore > 80 ? '#52c41a' : record.sustainabilityScore > 60 ? '#faad14' : '#ff4d4f'}
            format={(percent) => `${percent}/100`}
            size="small"
          />
        </div>
      )
    },
    {
      title: 'Öneriler',
      key: 'recommendations',
      width: 200,
      render: (_, record) => (
        <div>
          {record.recommendations.map((rec: string, index: number) => (
            <Tag key={index} color="blue" style={{ marginBottom: '2px' }}>
              {rec}
            </Tag>
          ))}
        </div>
      )
    }
  ];

  const carbonFootprintColumns: ColumnsType<any> = [
    {
      title: 'Tenant',
      dataIndex: 'tenantName',
      key: 'tenantName',
      width: 150,
      render: (tenantName) => (
        <Tag color="blue">{tenantName}</Tag>
      )
    },
    {
      title: 'Ay',
      dataIndex: 'month',
      key: 'month',
      width: 120,
      render: (month) => {
        const [year, monthNum] = month.split('-');
        const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                       'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        return `${months[parseInt(monthNum) - 1]} ${year}`;
      }
    },
    {
      title: 'Elektrik Emisyonu',
      key: 'electricityEmissions',
      width: 150,
      render: (_, record) => (
        <div>{record.electricityEmissions} ton CO₂</div>
      )
    },
    {
      title: 'Doğalgaz Emisyonu',
      key: 'gasEmissions',
      width: 150,
      render: (_, record) => (
        <div>{record.gasEmissions} ton CO₂</div>
      )
    },
    {
      title: 'Su Emisyonu',
      key: 'waterEmissions',
      width: 120,
      render: (_, record) => (
        <div>{record.waterEmissions} ton CO₂</div>
      )
    },
    {
      title: 'Yakıt Emisyonu',
      key: 'fuelEmissions',
      width: 120,
      render: (_, record) => (
        <div>{record.fuelEmissions} ton CO₂</div>
      )
    },
    {
      title: 'Toplam Emisyon',
      key: 'totalEmissions',
      width: 150,
      render: (_, record) => (
        <div style={{ fontWeight: 'bold', color: '#ff4d4f' }}>
          {record.totalEmissions} ton CO₂
        </div>
      )
    },
    {
      title: 'Hedef Emisyon',
      key: 'targetEmissions',
      width: 150,
      render: (_, record) => (
        <div style={{ color: '#666' }}>
          {record.targetEmissions} ton CO₂
        </div>
      )
    },
    {
      title: 'Azalma Oranı',
      key: 'reduction',
      width: 120,
      render: (_, record) => (
        <Tag color="green">{record.reduction}%</Tag>
      )
    },
    {
      title: 'Sürdürülebilirlik',
      key: 'sustainabilityLevel',
      width: 120,
      render: (_, record) => {
        const level = sustainabilityLevels.find(l => l.value === record.sustainabilityLevel);
        return (
          <Tag color={level?.color}>
            {level?.label}
          </Tag>
        );
      }
    }
  ];

  const handleViewDetails = (record: any) => {
    message.info(`${record.tenantName || record.departmentName} detayları yakında eklenecek`);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      tenantId: undefined,
      resourceType: undefined,
      departmentId: undefined,
      priority: undefined
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <RobotOutlined /> AI Analiz
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

      {/* Executive KPI Dashboard */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CrownOutlined style={{ color: '#faad14' }} />
            Yönetici KPI Görünümü
          </div>
        }
        style={{ marginBottom: '24px' }}
      >
        <Row gutter={[16, 16]}>
          {executiveKPIs.map((kpi, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card size="small">
                <Statistic
                  title={kpi.metric}
                  value={kpi.currentValue}
                  prefix={kpi.trend === 'up' ? <RiseOutlined style={{ color: '#52c41a' }} /> : <FallOutlined style={{ color: '#ff4d4f' }} />}
                  suffix={
                    <div style={{ fontSize: '12px', color: kpi.trend === 'up' ? '#52c41a' : '#ff4d4f' }}>
                      {kpi.change}
                    </div>
                  }
                />
                <div style={{ marginTop: '8px' }}>
                  <Progress
                    percent={kpi.progress}
                    strokeColor={kpi.progress > 90 ? '#52c41a' : kpi.progress > 70 ? '#faad14' : '#ff4d4f'}
                    size="small"
                    format={(percent) => `Hedef: ${kpi.target}`}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

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
              placeholder="Kaynak Türü"
              style={{ width: '100%' }}
              value={filters.resourceType}
              onChange={(value) => handleFilterChange('resourceType', value)}
              allowClear
            >
              {resourceTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Öncelik"
              style={{ width: '100%' }}
              value={filters.priority}
              onChange={(value) => handleFilterChange('priority', value)}
              allowClear
            >
              {priorityLevels.map(priority => (
                <Option key={priority.value} value={priority.value}>
                  {priority.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={clearFilters}
              >
                Temizle
              </Button>
              <Button
                type="primary"
                icon={<SearchOutlined />}
              >
                Filtrele
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Main AI Analytics Tabs */}
      <Tabs defaultActiveKey="predictions" size="large">
        <TabPane
          tab={
                       <span>
             <RiseOutlined />
             Tüketim Tahminleri
           </span>
          }
          key="predictions"
        >
          <Card
            title="AI ile Tüketim Trendi Tahminleri"
            extra={
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => message.info('AI modelleri yenileniyor...')}
                >
                  Modelleri Yenile
                </Button>
                <Button
                  icon={<FileExcelOutlined />}
                  onClick={() => message.info('Tahmin raporu indiriliyor...')}
                >
                  Rapor İndir
                </Button>
              </Space>
            }
          >
            <Table
              columns={predictionColumns}
              dataSource={consumptionPredictions}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} / ${total} tahmin`
              }}
              scroll={{ x: 1400 }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <BulbOutlined />
              Tasarruf Fırsatları
            </span>
          }
          key="savings"
        >
          <Card
            title="AI Destekli Tasarruf Fırsatları"
            extra={
              <Space>
                <Button
                  icon={<HeatMapOutlined />}
                  onClick={() => message.info('Heatmap görünümü yakında eklenecek')}
                >
                  Heatmap
                </Button>
                <Button
                  icon={<FileExcelOutlined />}
                  onClick={() => message.info('Tasarruf raporu indiriliyor...')}
                >
                  Rapor İndir
                </Button>
              </Space>
            }
          >
            <Table
              columns={costSavingsColumns}
              dataSource={costSavings}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} / ${total} fırsat`
              }}
              scroll={{ x: 1400 }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <TrophyOutlined />
              Departman KPI'ları
            </span>
          }
          key="kpis"
        >
          <Card
            title="Departman Karşılaştırma ve KPI'lar"
            extra={
              <Space>
                <Button
                  icon={<BarChartOutlined />}
                  onClick={() => message.info('Karşılaştırma grafikleri yakında eklenecek')}
                >
                  Grafik Görünümü
                </Button>
                <Button
                  icon={<FileExcelOutlined />}
                  onClick={() => message.info('KPI raporu indiriliyor...')}
                >
                  Rapor İndir
                </Button>
              </Space>
            }
          >
            <Table
              columns={departmentKPIColumns}
              dataSource={departmentKPIs}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} / ${total} departman`
              }}
              scroll={{ x: 1400 }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <EnvironmentOutlined />
              Karbon Ayak İzi
            </span>
          }
          key="carbon"
        >
          <Card
            title="Karbon Ayak İzi ve Sürdürülebilirlik Analizi"
            extra={
              <Space>
                <Button
                  icon={<AreaChartOutlined />}
                  onClick={() => message.info('Sürdürülebilirlik grafikleri yakında eklenecek')}
                >
                  Grafik Görünümü
                </Button>
                <Button
                  icon={<FileExcelOutlined />}
                  onClick={() => message.info('Karbon raporu indiriliyor...')}
                >
                  Rapor İndir
                </Button>
              </Space>
            }
          >
            <Table
              columns={carbonFootprintColumns}
              dataSource={carbonFootprint}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} / ${total} kayıt`
              }}
              scroll={{ x: 1400 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* AI Insights */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RobotOutlined style={{ color: '#1890ff' }} />
            AI Öngörüleri ve Öneriler
          </div>
        }
        style={{ marginTop: '24px' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Alert
              message="Tüketim Tahminleri"
              description="AI modelleri gelecek ay ve yıl için tüketim tahminleri yapıyor. Güvenilirlik oranları %78-92 arasında."
              type="info"
              showIcon
            />
          </Col>
          <Col xs={24} md={8}>
            <Alert
              message="Tasarruf Fırsatları"
              description="AI, mevcut verileri analiz ederek potansiyel tasarruf fırsatlarını belirliyor. ROI hesaplamaları dahil."
              type="warning"
              showIcon
            />
          </Col>
          <Col xs={24} md={8}>
            <Alert
              message="Sürdürülebilirlik"
              description="Karbon ayak izi analizi ve sürdürülebilirlik skorları otomatik olarak hesaplanıyor."
              type="success"
              showIcon
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
} 