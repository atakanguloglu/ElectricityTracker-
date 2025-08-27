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
  FallOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { aiAnalyticsService, ConsumptionPrediction, CostSavings, DepartmentKPI, CarbonFootprint, ExecutiveKPI } from '../../../services/aiAnalyticsService';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Step } = Steps;











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

interface PredictionRecord {
  id: number;
  tenantId: number;
  tenantName: string;
  resourceType: string;
  resourceName: string;
  currentMonth: number;
  predictedNextMonth: number;
  predictedYearly: number;
  confidence: number;
  trend: 'increasing' | 'decreasing';
  factors: string[];
  recommendations: string[];
}

interface CostSavingsRecord {
  id: number;
  tenantId: number;
  tenantName: string;
  departmentId: number;
  departmentName: string;
  currentCost: number;
  potentialSavings: number;
  savingsPercentage: number;
  recommendations: string[];
  implementationTime: string;
  roi: number;
  priority: 'high' | 'medium' | 'low';
}

interface DepartmentKPIRecord {
  id: number;
  departmentId: number;
  departmentName: string;
  tenantId: number;
  tenantName: string;
  energyEfficiency: number;
  costPerEmployee: number;
  carbonFootprint: number;
  sustainabilityScore: number;
  trend: 'improving' | 'stable' | 'decreasing';
  lastMonth: number;
  target: number;
  recommendations: string[];
}

interface ExecutiveKPIRecord {
  id: number;
  metric: string;
  currentValue: string;
  previousValue: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  target: string;
  progress: number;
  status: 'on-track' | 'behind' | 'ahead';
}

export default function AIAnalyticsPage() {
  const [consumptionPredictions, setConsumptionPredictions] = useState<ConsumptionPrediction[]>([]);
  const [costSavings, setCostSavings] = useState<CostSavings[]>([]);
  const [departmentKPIs, setDepartmentKPIs] = useState<DepartmentKPI[]>([]);
  const [carbonFootprint, setCarbonFootprint] = useState<CarbonFootprint[]>([]);
  const [executiveKPIs, setExecutiveKPIs] = useState<ExecutiveKPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    tenantId: undefined,
    resourceType: undefined,
    departmentId: undefined,
    priority: undefined
  });

  // Load AI analytics data
  useEffect(() => {
    const loadAIAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [predictionsData, savingsData, kpisData, carbonData, executiveData] = await Promise.all([
          aiAnalyticsService.getConsumptionPredictions(),
          aiAnalyticsService.getCostSavings(),
          aiAnalyticsService.getDepartmentKPIs(),
          aiAnalyticsService.getCarbonFootprint(),
          aiAnalyticsService.getExecutiveKPIs()
        ]);
        
        setConsumptionPredictions(predictionsData);
        setCostSavings(savingsData);
        setDepartmentKPIs(kpisData);
        setCarbonFootprint(carbonData);
        setExecutiveKPIs(executiveData);
      } catch (error) {
        console.error('Error loading AI analytics data:', error);
        setError('AI Analytics verileri yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadAIAnalyticsData();
  }, []);

  // Statistics
  const stats = useMemo(() => [
    {
      title: 'Toplam Tasarruf Potansiyeli',
      value: `₺${costSavings.reduce((sum, item) => sum + item.PotentialSavings, 0).toLocaleString()}`,
      icon: <DollarOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
      title: 'Ortalama Tahmin Güvenilirliği',
      value: `${Math.round(consumptionPredictions.reduce((sum, item) => sum + item.Confidence, 0) / consumptionPredictions.length)}%`,
      icon: <RobotOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Karbon Azalması',
      value: `${carbonFootprint.reduce((sum, item) => sum + item.Reduction, 0) / carbonFootprint.length}%`,
      icon: <EnvironmentOutlined />,
      color: '#faad14',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Sürdürülebilirlik Skoru',
      value: `${Math.round(departmentKPIs.reduce((sum, item) => sum + item.SustainabilityScore, 0) / departmentKPIs.length)}`,
      icon: <TrophyOutlined />,
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  ], [costSavings, consumptionPredictions, carbonFootprint, departmentKPIs]);

  const predictionColumns: ColumnsType<ConsumptionPrediction> = [
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
        const resourceType = resourceTypes.find(t => t.value === record.ResourceType);
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
          {record.CurrentMonth.toLocaleString()}
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
            {record.PredictedNextMonth.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.Trend === 'increasing' ? (
              <RiseOutlined style={{ color: '#ff4d4f' }} />
            ) : (
              <FallOutlined style={{ color: '#52c41a' }} />
            )}
            {record.Trend === 'increasing' ? 'Artış' : 'Azalış'}
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
                      {record.PredictedYearly.toLocaleString()}
        </div>
      )
    },
    {
      title: 'Güvenilirlik',
      key: 'Confidence',
      width: 120,
      render: (_, record) => (
        <div>
          <Progress
            percent={record.Confidence}
            strokeColor={record.Confidence > 80 ? '#52c41a' : record.Confidence > 60 ? '#faad14' : '#ff4d4f'}
            format={(percent) => `${percent}%`}
            size="small"
          />
        </div>
      )
    },
    {
      title: 'Faktörler',
      key: 'Factors',
      width: 200,
      render: (_, record) => (
        <div>
          {record.Factors.map((factor: string, index: number) => (
            <Tag key={index} style={{ marginBottom: '2px' }}>
              {factor}
            </Tag>
          ))}
        </div>
      )
    },
    {
      title: 'Öneriler',
      key: 'Recommendations',
      width: 200,
      render: (_, record) => (
        <div>
          {record.Recommendations.map((rec: string, index: number) => (
            <Tag key={index} color="blue" style={{ marginBottom: '2px' }}>
              {rec}
            </Tag>
          ))}
        </div>
      )
    }
  ];

  const costSavingsColumns: ColumnsType<CostSavings> = [
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
          ₺{record.CurrentCost.toLocaleString()}
        </div>
      )
    },
    {
      title: 'Tasarruf Potansiyeli',
      key: 'potentialSavings',
      width: 150,
      render: (_, record) => (
        <div style={{ fontWeight: 'bold', color: '#52c41a' }}>
          ₺{record.PotentialSavings.toLocaleString()}
        </div>
      )
    },
    {
      title: 'Tasarruf Oranı',
      key: 'savingsPercentage',
      width: 120,
      render: (_, record) => (
        <Tag color="green">{record.SavingsPercentage}%</Tag>
      )
    },
    {
      title: 'ROI',
      key: 'roi',
      width: 100,
      render: (_, record) => (
        <Tag color="blue">{record.ROI}%</Tag>
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
          {record.Recommendations.map((rec: string, index: number) => (
            <div key={index} style={{ fontSize: '12px', marginBottom: '2px' }}>
              • {rec}
            </div>
          ))}
        </div>
      )
    }
  ];

  const departmentKPIColumns: ColumnsType<DepartmentKPI> = [
    {
      title: 'Departman',
      key: 'department',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.DepartmentName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.TenantName}</div>
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
            percent={record.EnergyEfficiency}
            strokeColor={record.EnergyEfficiency > 80 ? '#52c41a' : record.EnergyEfficiency > 60 ? '#faad14' : '#ff4d4f'}
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
          <div style={{ fontWeight: 'bold' }}>₺{record.CostPerEmployee}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
                         {record.ImprovementAreas.length > 0 ? (
               <FallOutlined style={{ color: '#52c41a' }} />
             ) : (
               <RiseOutlined style={{ color: '#faad14' }} />
             )}
            {record.ImprovementAreas.length > 0 ? 'İyileşme Alanları' : 'Stabil'}
          </div>
        </div>
      )
    },
    {
      title: 'İyileşme Alanları',
      key: 'improvementAreas',
      width: 200,
      render: (_, record) => (
        <div>
          {record.ImprovementAreas.map((area: string, index: number) => (
            <Tag key={index} color="orange" style={{ marginBottom: '2px' }}>
              {area}
            </Tag>
          ))}
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
            percent={record.SustainabilityScore}
            strokeColor={record.SustainabilityScore > 80 ? '#52c41a' : record.SustainabilityScore > 60 ? '#faad14' : '#ff4d4f'}
            format={(percent) => `${percent}/100`}
            size="small"
          />
        </div>
      )
    },
    {
      title: 'Durum',
      key: 'status',
      width: 100,
      render: (_, record) => (
        <Tag color={record.EnergyEfficiency > 80 ? 'green' : record.EnergyEfficiency > 60 ? 'orange' : 'red'}>
          {record.EnergyEfficiency > 80 ? 'İyi' : record.EnergyEfficiency > 60 ? 'Orta' : 'Kritik'}
        </Tag>
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
        if (!month) return 'N/A';
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

  const handleViewDetails = (record: PredictionRecord | CostSavingsRecord | DepartmentKPIRecord) => {
    let name = 'Unknown';
    if ('resourceName' in record) {
      name = record.resourceName;
    } else if ('departmentName' in record) {
      name = record.departmentName;
    } else {
      name = (record as any).tenantName || 'Unknown';
    }
    message.info(`${name} detayları yakında eklenecek`);
  };

  const handleFilterChange = (key: string, value: string | number | undefined) => {
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

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>AI Analytics verileri yükleniyor...</div>
        <div style={{ fontSize: '16px', color: '#666' }}>Lütfen bekleyin...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '24px', marginBottom: '20px', color: '#ff4d4f' }}>Hata!</div>
        <div style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>{error}</div>
        <Button type="primary" onClick={() => window.location.reload()}>
          Sayfayı Yenile
        </Button>
      </div>
    );
  }

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
                  title="KPI"
                  value={kpi.TotalEnergyCost}
                  prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
                  suffix={
                    <div style={{ fontSize: '12px', color: '#52c41a' }}>
                      ₺
                    </div>
                  }
                />
                <div style={{ marginTop: '8px' }}>
                  <Progress
                    percent={kpi.EnergyEfficiency}
                    strokeColor={kpi.EnergyEfficiency > 90 ? '#52c41a' : kpi.EnergyEfficiency > 70 ? '#faad14' : '#ff4d4f'}
                    size="small"
                    format={(percent) => `Verimlilik: ${percent}%`}
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
              {consumptionPredictions
                .filter((item, index, self) => self.findIndex(t => t.TenantId === item.TenantId) === index)
                .map(tenant => (
                  <Option key={tenant.TenantId} value={tenant.TenantId}>
                    {tenant.TenantName}
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
              Departman KPI&apos;ları
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