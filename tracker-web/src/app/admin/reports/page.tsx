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
  CalculatorOutlined
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

const mockMonthlyConsumption = [
  {
    id: 1,
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    month: '2024-01',
    electricity: 1250,
    water: 450,
    gas: 320,
    fuel: 180,
    other: 95,
    totalCost: 2850,
    totalConsumption: 2295
  },
  {
    id: 2,
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    month: '2024-02',
    electricity: 1180,
    water: 420,
    gas: 310,
    fuel: 175,
    other: 90,
    totalCost: 2720,
    totalConsumption: 2175
  },
  {
    id: 3,
    tenantId: 2,
    tenantName: 'XYZ Ltd.',
    month: '2024-01',
    electricity: 2100,
    water: 680,
    gas: 450,
    fuel: 320,
    other: 150,
    totalCost: 4850,
    totalConsumption: 3700
  },
  {
    id: 4,
    tenantId: 2,
    tenantName: 'XYZ Ltd.',
    month: '2024-02',
    electricity: 1950,
    water: 650,
    gas: 420,
    fuel: 300,
    other: 140,
    totalCost: 4560,
    totalConsumption: 3460
  },
  {
    id: 5,
    tenantId: 3,
    tenantName: 'Tech Solutions',
    month: '2024-01',
    electricity: 890,
    water: 280,
    gas: 180,
    fuel: 120,
    other: 75,
    totalCost: 1890,
    totalConsumption: 1545
  }
];

const mockExpenseByType = [
  {
    id: 1,
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    expenseType: 'electricity',
    expenseTypeName: 'Elektrik',
    january: 1250,
    february: 1180,
    march: 1320,
    april: 1280,
    may: 1400,
    june: 1350,
    total: 7780,
    average: 1297,
    percentage: 45.2
  },
  {
    id: 2,
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    expenseType: 'water',
    expenseTypeName: 'Su',
    january: 450,
    february: 420,
    march: 480,
    april: 460,
    may: 520,
    june: 490,
    total: 2820,
    average: 470,
    percentage: 16.4
  },
  {
    id: 3,
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    expenseType: 'gas',
    expenseTypeName: 'Doğalgaz',
    january: 320,
    february: 310,
    march: 350,
    april: 330,
    may: 380,
    june: 360,
    total: 2050,
    average: 342,
    percentage: 11.9
  },
  {
    id: 4,
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    expenseType: 'fuel',
    expenseTypeName: 'Yakıt',
    january: 180,
    february: 175,
    march: 200,
    april: 190,
    may: 220,
    june: 210,
    total: 1175,
    average: 196,
    percentage: 6.8
  },
  {
    id: 5,
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    expenseType: 'other',
    expenseTypeName: 'Diğer',
    january: 95,
    february: 90,
    march: 110,
    april: 105,
    may: 125,
    june: 120,
    total: 645,
    average: 108,
    percentage: 3.7
  }
];

const mockYearlyComparison = [
  {
    year: 2022,
    totalConsumption: 18500,
    totalCost: 42500,
    electricity: 8500,
    water: 3200,
    gas: 2800,
    fuel: 1800,
    other: 2200
  },
  {
    year: 2023,
    totalConsumption: 19800,
    totalCost: 45600,
    electricity: 9200,
    water: 3400,
    gas: 3000,
    fuel: 1900,
    other: 2300
  },
  {
    year: 2024,
    totalConsumption: 17200,
    totalCost: 39500,
    electricity: 8000,
    water: 2900,
    gas: 2600,
    fuel: 1700,
    other: 2000
  }
];

const mockDepartmentReports = [
  {
    id: 1,
    departmentId: 1,
    departmentName: 'IT Departmanı',
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    month: '2024-01',
    electricity: 450,
    water: 120,
    gas: 80,
    fuel: 50,
    other: 30,
    totalCost: 730,
    employeeCount: 25,
    costPerEmployee: 29.2
  },
  {
    id: 2,
    departmentId: 2,
    departmentName: 'Muhasebe',
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    month: '2024-01',
    electricity: 280,
    water: 90,
    gas: 60,
    fuel: 35,
    other: 25,
    totalCost: 490,
    employeeCount: 15,
    costPerEmployee: 32.7
  },
  {
    id: 3,
    departmentId: 4,
    departmentName: 'Üretim',
    tenantId: 2,
    tenantName: 'XYZ Ltd.',
    month: '2024-01',
    electricity: 1200,
    water: 350,
    gas: 220,
    fuel: 180,
    other: 80,
    totalCost: 2030,
    employeeCount: 80,
    costPerEmployee: 25.4
  }
];

const resourceTypes = [
  { value: 'electricity', label: 'Elektrik', icon: <LightningOutlined />, color: '#faad14' },
  { value: 'water', label: 'Su', icon: <DropboxOutlined />, color: '#1890ff' },
  { value: 'gas', label: 'Doğalgaz', icon: <FireOutlined />, color: '#ff4d4f' },
  { value: 'fuel', label: 'Yakıt', icon: <CarOutlined />, color: '#722ed1' },
  { value: 'other', label: 'Diğer', icon: <ToolOutlined />, color: '#52c41a' }
];

const months = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export default function ReportsPage() {
  const [monthlyConsumption, setMonthlyConsumption] = useState(mockMonthlyConsumption);
  const [expenseByType, setExpenseByType] = useState(mockExpenseByType);
  const [yearlyComparison, setYearlyComparison] = useState(mockYearlyComparison);
  const [departmentReports, setDepartmentReports] = useState(mockDepartmentReports);
  const [filters, setFilters] = useState({
    tenantId: undefined,
    resourceType: undefined,
    dateRange: undefined,
    departmentId: undefined
  });

  // Statistics
  const stats = useMemo(() => [
    {
      title: 'Toplam Tüketim (Bu Ay)',
      value: monthlyConsumption.reduce((sum, item) => sum + item.totalConsumption, 0).toLocaleString(),
      icon: <CalculatorOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Toplam Maliyet (Bu Ay)',
      value: `₺${monthlyConsumption.reduce((sum, item) => sum + item.totalCost, 0).toLocaleString()}`,
      icon: <DollarOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
      title: 'Ortalama Tüketim',
      value: `${Math.round(monthlyConsumption.reduce((sum, item) => sum + item.totalConsumption, 0) / monthlyConsumption.length).toLocaleString()}`,
      icon: <BarChartOutlined />,
      color: '#faad14',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Aktif Tenant',
      value: new Set(monthlyConsumption.map(item => item.tenantId)).size,
      icon: <GlobalOutlined />,
      color: '#ff4d4f',
      gradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
    }
  ], [monthlyConsumption]);

  const monthlyConsumptionColumns: ColumnsType<any> = [
    {
      title: 'Tenant',
      dataIndex: 'tenantName',
      key: 'tenantName',
      width: 200,
      render: (tenantName) => (
        <Tag color="blue" icon={<GlobalOutlined />}>
          {tenantName}
        </Tag>
      )
    },
    {
      title: 'Ay',
      dataIndex: 'month',
      key: 'month',
      width: 120,
      render: (month) => {
        const [year, monthNum] = month.split('-');
        return `${months[parseInt(monthNum) - 1]} ${year}`;
      }
    },
    {
      title: 'Elektrik',
      key: 'electricity',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.electricity.toLocaleString()} kWh</div>
          <div style={{ fontSize: '12px', color: '#666' }}>₺{record.electricity}</div>
        </div>
      )
    },
    {
      title: 'Su',
      key: 'water',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.water.toLocaleString()} m³</div>
          <div style={{ fontSize: '12px', color: '#666' }}>₺{record.water}</div>
        </div>
      )
    },
    {
      title: 'Doğalgaz',
      key: 'gas',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.gas.toLocaleString()} m³</div>
          <div style={{ fontSize: '12px', color: '#666' }}>₺{record.gas}</div>
        </div>
      )
    },
    {
      title: 'Yakıt',
      key: 'fuel',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.fuel.toLocaleString()} L</div>
          <div style={{ fontSize: '12px', color: '#666' }}>₺{record.fuel}</div>
        </div>
      )
    },
    {
      title: 'Diğer',
      key: 'other',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.other.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>₺{record.other}</div>
        </div>
      )
    },
    {
      title: 'Toplam Tüketim',
      key: 'totalConsumption',
      width: 150,
      render: (_, record) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
          {record.totalConsumption.toLocaleString()}
        </div>
      )
    },
    {
      title: 'Toplam Maliyet',
      key: 'totalCost',
      width: 150,
      render: (_, record) => (
        <div style={{ fontWeight: 'bold', color: '#52c41a' }}>
          ₺{record.totalCost.toLocaleString()}
        </div>
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
          <Dropdown
            menu={{
              items: [
                {
                  key: 'excel',
                  label: 'Excel İndir',
                  icon: <FileExcelOutlined />
                },
                {
                  key: 'pdf',
                  label: 'PDF İndir',
                  icon: <FilePdfOutlined />
                }
              ],
              onClick: ({ key }) => handleExport(record, key)
            }}
          >
            <Button type="text" icon={<DownloadOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ];

  const expenseByTypeColumns: ColumnsType<any> = [
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
      title: 'Gider Türü',
      dataIndex: 'expenseTypeName',
      key: 'expenseTypeName',
      width: 150,
      render: (name, record) => {
        const resourceType = resourceTypes.find(t => t.value === record.expenseType);
        return (
          <Tag color={resourceType?.color} icon={resourceType?.icon}>
            {name}
          </Tag>
        );
      }
    },
    {
      title: 'Ocak',
      dataIndex: 'january',
      key: 'january',
      width: 100,
      render: (value) => `₺${value.toLocaleString()}`
    },
    {
      title: 'Şubat',
      dataIndex: 'february',
      key: 'february',
      width: 100,
      render: (value) => `₺${value.toLocaleString()}`
    },
    {
      title: 'Mart',
      dataIndex: 'march',
      key: 'march',
      width: 100,
      render: (value) => `₺${value.toLocaleString()}`
    },
    {
      title: 'Nisan',
      dataIndex: 'april',
      key: 'april',
      width: 100,
      render: (value) => `₺${value.toLocaleString()}`
    },
    {
      title: 'Mayıs',
      dataIndex: 'may',
      key: 'may',
      width: 100,
      render: (value) => `₺${value.toLocaleString()}`
    },
    {
      title: 'Haziran',
      dataIndex: 'june',
      key: 'june',
      width: 100,
      render: (value) => `₺${value.toLocaleString()}`
    },
    {
      title: 'Toplam',
      key: 'total',
      width: 120,
      render: (_, record) => (
        <div style={{ fontWeight: 'bold', color: '#52c41a' }}>
          ₺{record.total.toLocaleString()}
        </div>
      )
    },
    {
      title: 'Ortalama',
      key: 'average',
      width: 120,
      render: (_, record) => (
        <div style={{ color: '#666' }}>
          ₺{record.average.toLocaleString()}
        </div>
      )
    },
    {
      title: 'Yüzde',
      key: 'percentage',
      width: 100,
      render: (_, record) => (
        <Tag color="blue">{record.percentage}%</Tag>
      )
    }
  ];

  const yearlyComparisonColumns: ColumnsType<any> = [
    {
      title: 'Yıl',
      dataIndex: 'year',
      key: 'year',
      width: 100
    },
    {
      title: 'Toplam Tüketim',
      key: 'totalConsumption',
      width: 150,
      render: (_, record) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
          {record.totalConsumption.toLocaleString()}
        </div>
      )
    },
    {
      title: 'Toplam Maliyet',
      key: 'totalCost',
      width: 150,
      render: (_, record) => (
        <div style={{ fontWeight: 'bold', color: '#52c41a' }}>
          ₺{record.totalCost.toLocaleString()}
        </div>
      )
    },
    {
      title: 'Elektrik',
      dataIndex: 'electricity',
      key: 'electricity',
      width: 120,
      render: (value) => `₺${value.toLocaleString()}`
    },
    {
      title: 'Su',
      dataIndex: 'water',
      key: 'water',
      width: 120,
      render: (value) => `₺${value.toLocaleString()}`
    },
    {
      title: 'Doğalgaz',
      dataIndex: 'gas',
      key: 'gas',
      width: 120,
      render: (value) => `₺${value.toLocaleString()}`
    },
    {
      title: 'Yakıt',
      dataIndex: 'fuel',
      key: 'fuel',
      width: 120,
      render: (value) => `₺${value.toLocaleString()}`
    },
    {
      title: 'Diğer',
      dataIndex: 'other',
      key: 'other',
      width: 120,
      render: (value) => `₺${value.toLocaleString()}`
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Grafik Görüntüle">
            <Button
              type="text"
              icon={<BarChartOutlined />}
              onClick={() => handleViewChart(record)}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'excel',
                  label: 'Excel İndir',
                  icon: <FileExcelOutlined />
                },
                {
                  key: 'pdf',
                  label: 'PDF İndir',
                  icon: <FilePdfOutlined />
                }
              ],
              onClick: ({ key }) => handleExport(record, key)
            }}
          >
            <Button type="text" icon={<DownloadOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ];

  const departmentReportColumns: ColumnsType<any> = [
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
      title: 'Ay',
      dataIndex: 'month',
      key: 'month',
      width: 120,
      render: (month) => {
        const [year, monthNum] = month.split('-');
        return `${months[parseInt(monthNum) - 1]} ${year}`;
      }
    },
    {
      title: 'Elektrik',
      key: 'electricity',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.electricity.toLocaleString()} kWh</div>
          <div style={{ fontSize: '12px', color: '#666' }}>₺{record.electricity}</div>
        </div>
      )
    },
    {
      title: 'Su',
      key: 'water',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.water.toLocaleString()} m³</div>
          <div style={{ fontSize: '12px', color: '#666' }}>₺{record.water}</div>
        </div>
      )
    },
    {
      title: 'Doğalgaz',
      key: 'gas',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.gas.toLocaleString()} m³</div>
          <div style={{ fontSize: '12px', color: '#666' }}>₺{record.gas}</div>
        </div>
      )
    },
    {
      title: 'Yakıt',
      key: 'fuel',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.fuel.toLocaleString()} L</div>
          <div style={{ fontSize: '12px', color: '#666' }}>₺{record.fuel}</div>
        </div>
      )
    },
    {
      title: 'Diğer',
      key: 'other',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.other.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>₺{record.other}</div>
        </div>
      )
    },
    {
      title: 'Toplam Maliyet',
      key: 'totalCost',
      width: 150,
      render: (_, record) => (
        <div style={{ fontWeight: 'bold', color: '#52c41a' }}>
          ₺{record.totalCost.toLocaleString()}
        </div>
      )
    },
    {
      title: 'Çalışan Sayısı',
      dataIndex: 'employeeCount',
      key: 'employeeCount',
      width: 120
    },
    {
      title: 'Kişi Başı Maliyet',
      key: 'costPerEmployee',
      width: 150,
      render: (_, record) => (
        <div style={{ color: '#666' }}>
          ₺{record.costPerEmployee.toFixed(1)}
        </div>
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
          <Dropdown
            menu={{
              items: [
                {
                  key: 'excel',
                  label: 'Excel İndir',
                  icon: <FileExcelOutlined />
                },
                {
                  key: 'pdf',
                  label: 'PDF İndir',
                  icon: <FilePdfOutlined />
                }
              ],
              onClick: ({ key }) => handleExport(record, key)
            }}
          >
            <Button type="text" icon={<DownloadOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ];

  const handleViewDetails = (record: any) => {
    message.info(`${record.tenantName || record.departmentName} detayları yakında eklenecek`);
  };

  const handleViewChart = (record: any) => {
    message.info(`${record.year} yılı grafik görünümü yakında eklenecek`);
  };

  const handleExport = (record: any, format: string) => {
    message.success(`${record.tenantName || record.departmentName || record.year} ${format.toUpperCase()} formatında indiriliyor...`);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      tenantId: undefined,
      resourceType: undefined,
      dateRange: undefined,
      departmentId: undefined
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <BarChartOutlined /> Raporlama
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
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Başlangıç', 'Bitiş']}
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
            />
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

      {/* Main Reports Tabs */}
      <Tabs defaultActiveKey="monthly" size="large">
        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              Aylık Tüketim Raporu
            </span>
          }
          key="monthly"
        >
          <Card
            title="Tenant Bazlı Aylık Tüketim Raporu"
            extra={
              <Space>
                <Button
                  icon={<FileExcelOutlined />}
                  onClick={() => message.info('Excel raporu indiriliyor...')}
                >
                  Excel İndir
                </Button>
                <Button
                  icon={<FilePdfOutlined />}
                  onClick={() => message.info('PDF raporu indiriliyor...')}
                >
                  PDF İndir
                </Button>
              </Space>
            }
          >
            <Table
              columns={monthlyConsumptionColumns}
              dataSource={monthlyConsumption}
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

        <TabPane
          tab={
            <span>
              <PieChartOutlined />
              Gider Türü Raporu
            </span>
          }
          key="expense"
        >
          <Card
            title="Gider Türüne Göre Toplam Maliyet Raporu"
            extra={
              <Space>
                <Button
                  icon={<FileExcelOutlined />}
                  onClick={() => message.info('Excel raporu indiriliyor...')}
                >
                  Excel İndir
                </Button>
                <Button
                  icon={<FilePdfOutlined />}
                  onClick={() => message.info('PDF raporu indiriliyor...')}
                >
                  PDF İndir
                </Button>
              </Space>
            }
          >
            <Table
              columns={expenseByTypeColumns}
              dataSource={expenseByType}
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

        <TabPane
          tab={
            <span>
              <LineChartOutlined />
              Yıl Bazlı Karşılaştırma
            </span>
          }
          key="yearly"
        >
          <Card
            title="Yıl Bazlı Karşılaştırma Grafikleri"
            extra={
              <Space>
                <Button
                  icon={<BarChartOutlined />}
                  onClick={() => message.info('Grafik görünümü yakında eklenecek')}
                >
                  Grafik Görüntüle
                </Button>
                <Button
                  icon={<FileExcelOutlined />}
                  onClick={() => message.info('Excel raporu indiriliyor...')}
                >
                  Excel İndir
                </Button>
                <Button
                  icon={<FilePdfOutlined />}
                  onClick={() => message.info('PDF raporu indiriliyor...')}
                >
                  PDF İndir
                </Button>
              </Space>
            }
          >
            <Table
              columns={yearlyComparisonColumns}
              dataSource={yearlyComparison}
              rowKey="year"
              pagination={false}
              scroll={{ x: 1200 }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <TeamOutlined />
              Departman Raporu
            </span>
          }
          key="department"
        >
          <Card
            title="Departman/Şube Bazlı Raporlama"
            extra={
              <Space>
                <Select
                  placeholder="Departman Seçin"
                  style={{ width: 150 }}
                  value={filters.departmentId}
                  onChange={(value) => handleFilterChange('departmentId', value)}
                  allowClear
                >
                  {mockDepartments.map(dept => (
                    <Option key={dept.id} value={dept.id}>
                      {dept.name}
                    </Option>
                  ))}
                </Select>
                <Button
                  icon={<FileExcelOutlined />}
                  onClick={() => message.info('Excel raporu indiriliyor...')}
                >
                  Excel İndir
                </Button>
                <Button
                  icon={<FilePdfOutlined />}
                  onClick={() => message.info('PDF raporu indiriliyor...')}
                >
                  PDF İndir
                </Button>
              </Space>
            }
          >
            <Table
              columns={departmentReportColumns}
              dataSource={departmentReports}
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

      {/* Export Options Info */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ExportOutlined style={{ color: '#1890ff' }} />
            Dışa Aktarma Seçenekleri
          </div>
        }
        style={{ marginTop: '24px' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Alert
              message="Excel İndirme"
              description="Tüm raporlar Excel formatında indirilebilir. Grafikler ve hesaplamalar dahil edilir."
              type="info"
              showIcon
            />
          </Col>
          <Col xs={24} md={8}>
            <Alert
              message="PDF İndirme"
              description="Raporlar PDF formatında yazdırılabilir. Profesyonel görünüm için optimize edilmiştir."
              type="warning"
              showIcon
            />
          </Col>
          <Col xs={24} md={8}>
            <Alert
              message="Filtreleme"
              description="Tenant, kaynak türü, tarih aralığı ve departman bazında filtreleme yapabilirsiniz."
              type="success"
              showIcon
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
} 