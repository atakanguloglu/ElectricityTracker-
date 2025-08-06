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
  Dropdown,
  Spin
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
interface EnergyConsumptionReport {
  consumptions: EnergyConsumption[];
  summary: EnergySummary;
}

interface EnergyConsumption {
  id: number;
  readingDate: string;
  consumptionValue: number;
  unit: string;
  cost: number;
  currency: string;
  tenantId: number;
  tenantName: string;
  meterId: number;
  meterName: string;
}

interface EnergySummary {
  totalConsumption: number;
  totalCost: number;
  averageDailyConsumption: number;
  peakConsumption: number;
  consumptionByMeter: ConsumptionByMeter[];
}

interface ConsumptionByMeter {
  meterName: string;
  totalConsumption: number;
  totalCost: number;
  averageConsumption: number;
}

interface BillingSummaryReport {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  overdueAmount: number;
  averageInvoiceAmount: number;
  invoicesByStatus: InvoiceByStatus[];
  invoicesByType: InvoiceByType[];
  monthlyBreakdown: MonthlyBreakdown[];
}

interface InvoiceByStatus {
  status: string;
  count: number;
  totalAmount: number;
}

interface InvoiceByType {
  type: string;
  count: number;
  totalAmount: number;
}

interface MonthlyBreakdown {
  year: number;
  month: number;
  count: number;
  totalAmount: number;
  paidAmount: number;
}

interface TenantPerformanceReport {
  tenantId: number;
  tenantName: string;
  totalConsumption: number;
  totalCost: number;
  totalInvoices: number;
  totalInvoiceAmount: number;
  paidInvoices: number;
  overdueInvoices: number;
}

interface SystemUsageReport {
  systemHealth: SystemHealth;
}

interface SystemHealth {
  totalLogs: number;
  errorLogs: number;
  warningLogs: number;
  infoLogs: number;
  logsByLevel: LogByLevel[];
}

interface LogByLevel {
  level: string;
  count: number;
}

export default function ReportsPage() {
  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [energyReport, setEnergyReport] = useState<EnergyConsumptionReport | null>(null);
  const [billingReport, setBillingReport] = useState<BillingSummaryReport | null>(null);
  const [tenantReport, setTenantReport] = useState<TenantPerformanceReport[]>([]);
  const [systemReport, setSystemReport] = useState<SystemUsageReport | null>(null);
  const [tenants, setTenants] = useState<any[]>([]);
  
  // Filters state
  const [filters, setFilters] = useState({
    tenantId: undefined as number | undefined,
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
    resourceType: undefined as string | undefined
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchReports();
    fetchTenants();
  }, [filters]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.tenantId) params.append('tenantId', filters.tenantId.toString());
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.resourceType) params.append('resourceType', filters.resourceType);

      // Fetch energy consumption report
              const energyResponse = await apiRequest(`${API_BASE_URL}/admin/reports/energy/consumption?${params}`);
      if (energyResponse.ok) {
        const energyData: EnergyConsumptionReport = await energyResponse.json();
        setEnergyReport(energyData);
      }

      // Fetch billing summary report
              const billingResponse = await apiRequest(`${API_BASE_URL}/admin/reports/billing/summary?${params}`);
      if (billingResponse.ok) {
        const billingData: BillingSummaryReport = await billingResponse.json();
        setBillingReport(billingData);
      }

      // Fetch tenant performance report
              const tenantResponse = await apiRequest(`${API_BASE_URL}/admin/reports/tenants/performance?${params}`);
      if (tenantResponse.ok) {
        const tenantData: TenantPerformanceReport[] = await tenantResponse.json();
        setTenantReport(tenantData);
      }

      // Fetch system usage report
              const systemResponse = await apiRequest(`${API_BASE_URL}/admin/reports/system/usage?${params}`);
      if (systemResponse.ok) {
        const systemData: SystemUsageReport = await systemResponse.json();
        setSystemReport(systemData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata oluştu');
      console.error('Reports fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/tenants?pageSize=100`);
      if (!response.ok) throw new Error('Tenant listesi alınamadı');
      
      const data = await response.json();
      setTenants(data.items || []);
    } catch (err) {
      console.error('Tenants fetch error:', err);
    }
  };

  // Statistics
  const stats = useMemo(() => [
    {
      title: 'Toplam Tüketim',
      value: energyReport?.summary.totalConsumption ? `${energyReport.summary.totalConsumption.toLocaleString()} kWh` : '0 kWh',
      icon: <LightningOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Toplam Maliyet',
      value: energyReport?.summary.totalCost ? `₺${energyReport.summary.totalCost.toLocaleString()}` : '₺0',
      icon: <DollarOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
      title: 'Toplam Fatura',
      value: billingReport?.totalInvoices || 0,
      icon: <FileExcelOutlined />,
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Sistem Logları',
      value: systemReport?.systemHealth.totalLogs || 0,
      icon: <DatabaseOutlined />,
      color: '#faad14',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    }
  ], [energyReport, billingReport, systemReport]);

  // Handlers
  const handleViewDetails = (record: any) => {
    message.info(`${record.tenantName || record.meterName} detayları yakında eklenecek`);
  };

  const handleViewChart = (record: any) => {
    message.info(`${record.tenantName || record.meterName} grafik görünümü yakında eklenecek`);
  };

  const handleExport = async (record: any, format: string) => {
    try {
      const params = new URLSearchParams();
      if (filters.tenantId) params.append('tenantId', filters.tenantId.toString());
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('format', format);

              const response = await apiRequest(`${API_BASE_URL}/admin/reports/export/energy-consumption?${params}`);
      if (!response.ok) throw new Error('Rapor indirilemedi');

      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `energy-consumption-report.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `energy-consumption-report.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      message.success('Rapor başarıyla indirildi');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Rapor indirilirken hata oluştu');
      console.error('Export error:', err);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      tenantId: undefined,
      startDate: undefined,
      endDate: undefined,
      resourceType: undefined
    });
  };

  // Loading state
  if (loading && !energyReport && !billingReport && !tenantReport && !systemReport) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '20px' }}>Raporlar yükleniyor...</div>
      </div>
    );
  }

  // Error state
  if (error && !energyReport && !billingReport && !tenantReport && !systemReport) {
    return (
      <Alert
        message="Hata"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={fetchReports}>
            Tekrar Dene
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <BarChartOutlined /> Raporlar
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
              {tenants.map(tenant => (
                <Option key={tenant.id} value={tenant.id}>
                  {tenant.companyName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={(dates) => {
                if (dates) {
                  handleFilterChange('startDate', dates[0]?.toISOString());
                  handleFilterChange('endDate', dates[1]?.toISOString());
                } else {
                  handleFilterChange('startDate', undefined);
                  handleFilterChange('endDate', undefined);
                }
              }}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Kaynak Türü"
              style={{ width: '100%' }}
              value={filters.resourceType}
              onChange={(value) => handleFilterChange('resourceType', value)}
              allowClear
            >
              <Option value="electricity">Elektrik</Option>
              <Option value="water">Su</Option>
              <Option value="gas">Doğalgaz</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Space>
              <Button onClick={clearFilters}>
                Temizle
              </Button>
              <Button type="primary" icon={<ReloadOutlined />} onClick={fetchReports}>
                Yenile
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultActiveKey="energy" size="large">
        <TabPane
          tab={
            <span>
              <LightningOutlined />
              Enerji Tüketimi
            </span>
          }
          key="energy"
        >
          <Card
            title="Enerji Tüketim Raporu"
            extra={
              <Space>
                <Button
                  icon={<FileExcelOutlined />}
                  onClick={() => handleExport(null, 'csv')}
                >
                  CSV İndir
                </Button>
                <Button
                  icon={<FileExcelOutlined />}
                  onClick={() => handleExport(null, 'json')}
                >
                  JSON İndir
                </Button>
              </Space>
            }
          >
            {energyReport && (
              <>
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                  <Col xs={24} sm={6}>
                    <Statistic
                      title="Toplam Tüketim"
                      value={energyReport.summary.totalConsumption}
                      suffix="kWh"
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Col>
                  <Col xs={24} sm={6}>
                    <Statistic
                      title="Toplam Maliyet"
                      value={energyReport.summary.totalCost}
                      prefix="₺"
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                  <Col xs={24} sm={6}>
                    <Statistic
                      title="Günlük Ortalama"
                      value={energyReport.summary.averageDailyConsumption}
                      suffix="kWh"
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Col>
                  <Col xs={24} sm={6}>
                    <Statistic
                      title="Pik Tüketim"
                      value={energyReport.summary.peakConsumption}
                      suffix="kWh"
                      valueStyle={{ color: '#faad14' }}
                    />
                  </Col>
                </Row>

                <Table
                  dataSource={energyReport.consumptions}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} / ${total} kayıt`
                  }}
                  columns={[
                    {
                      title: 'Tarih',
                      dataIndex: 'readingDate',
                      key: 'readingDate',
                      render: (date) => new Date(date).toLocaleDateString('tr-TR')
                    },
                    {
                      title: 'Tenant',
                      dataIndex: 'tenantName',
                      key: 'tenantName',
                      render: (name) => <Tag color="blue">{name}</Tag>
                    },
                    {
                      title: 'Sayaç',
                      dataIndex: 'meterName',
                      key: 'meterName',
                      render: (name) => <Tag color="green">{name}</Tag>
                    },
                    {
                      title: 'Tüketim',
                      dataIndex: 'consumptionValue',
                      key: 'consumptionValue',
                      render: (value) => `${value.toLocaleString()} kWh`
                    },
                    {
                      title: 'Maliyet',
                      dataIndex: 'cost',
                      key: 'cost',
                      render: (cost) => `₺${cost.toLocaleString()}`
                    },
                    {
                      title: 'İşlemler',
                      key: 'actions',
                      render: (_, record) => (
                        <Space size="small">
                          <Button
                            type="text"
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => handleViewDetails(record)}
                          />
                          <Button
                            type="text"
                            icon={<BarChartOutlined />}
                            size="small"
                            onClick={() => handleViewChart(record)}
                          />
                        </Space>
                      )
                    }
                  ]}
                />
              </>
            )}
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <DollarOutlined />
              Faturalama
            </span>
          }
          key="billing"
        >
          <Card title="Faturalama Özet Raporu">
            {billingReport && (
              <>
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                  <Col xs={24} sm={6}>
                    <Statistic
                      title="Toplam Fatura"
                      value={billingReport.totalInvoices}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Col>
                  <Col xs={24} sm={6}>
                    <Statistic
                      title="Toplam Tutar"
                      value={billingReport.totalAmount}
                      prefix="₺"
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                  <Col xs={24} sm={6}>
                    <Statistic
                      title="Ödenen Tutar"
                      value={billingReport.paidAmount}
                      prefix="₺"
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                  <Col xs={24} sm={6}>
                    <Statistic
                      title="Vadesi Geçen"
                      value={billingReport.overdueAmount}
                      prefix="₺"
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card title="Duruma Göre Faturalar" size="small">
                      <Table
                        dataSource={billingReport.invoicesByStatus}
                        rowKey="status"
                        pagination={false}
                        columns={[
                          {
                            title: 'Durum',
                            dataIndex: 'status',
                            key: 'status',
                            render: (status) => <Tag color="blue">{status}</Tag>
                          },
                          {
                            title: 'Adet',
                            dataIndex: 'count',
                            key: 'count'
                          },
                          {
                            title: 'Tutar',
                            dataIndex: 'totalAmount',
                            key: 'totalAmount',
                            render: (amount) => `₺${amount.toLocaleString()}`
                          }
                        ]}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Türe Göre Faturalar" size="small">
                      <Table
                        dataSource={billingReport.invoicesByType}
                        rowKey="type"
                        pagination={false}
                        columns={[
                          {
                            title: 'Tür',
                            dataIndex: 'type',
                            key: 'type',
                            render: (type) => <Tag color="green">{type}</Tag>
                          },
                          {
                            title: 'Adet',
                            dataIndex: 'count',
                            key: 'count'
                          },
                          {
                            title: 'Tutar',
                            dataIndex: 'totalAmount',
                            key: 'totalAmount',
                            render: (amount) => `₺${amount.toLocaleString()}`
                          }
                        ]}
                      />
                    </Card>
                  </Col>
                </Row>
              </>
            )}
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <TeamOutlined />
              Tenant Performansı
            </span>
          }
          key="tenants"
        >
          <Card title="Tenant Performans Raporu">
            <Table
              dataSource={tenantReport}
              rowKey="tenantId"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} / ${total} tenant`
              }}
              columns={[
                {
                  title: 'Tenant',
                  dataIndex: 'tenantName',
                  key: 'tenantName',
                  render: (name) => <Tag color="blue">{name}</Tag>
                },
                {
                  title: 'Toplam Tüketim',
                  dataIndex: 'totalConsumption',
                  key: 'totalConsumption',
                  render: (value) => `${value.toLocaleString()} kWh`
                },
                {
                  title: 'Toplam Maliyet',
                  dataIndex: 'totalCost',
                  key: 'totalCost',
                  render: (cost) => `₺${cost.toLocaleString()}`
                },
                {
                  title: 'Toplam Fatura',
                  dataIndex: 'totalInvoices',
                  key: 'totalInvoices'
                },
                {
                  title: 'Fatura Tutarı',
                  dataIndex: 'totalInvoiceAmount',
                  key: 'totalInvoiceAmount',
                  render: (amount) => `₺${amount.toLocaleString()}`
                },
                {
                  title: 'Ödenen Fatura',
                  dataIndex: 'paidInvoices',
                  key: 'paidInvoices',
                  render: (count) => <Tag color="green">{count}</Tag>
                },
                {
                  title: 'Vadesi Geçen',
                  dataIndex: 'overdueInvoices',
                  key: 'overdueInvoices',
                  render: (count) => <Tag color="red">{count}</Tag>
                }
              ]}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <DatabaseOutlined />
              Sistem Kullanımı
            </span>
          }
          key="system"
        >
          <Card title="Sistem Kullanım Raporu">
            {systemReport && (
              <>
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                  <Col xs={24} sm={6}>
                    <Statistic
                      title="Toplam Log"
                      value={systemReport.systemHealth.totalLogs}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Col>
                  <Col xs={24} sm={6}>
                    <Statistic
                      title="Hata Logları"
                      value={systemReport.systemHealth.errorLogs}
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Col>
                  <Col xs={24} sm={6}>
                    <Statistic
                      title="Uyarı Logları"
                      value={systemReport.systemHealth.warningLogs}
                      valueStyle={{ color: '#faad14' }}
                    />
                  </Col>
                  <Col xs={24} sm={6}>
                    <Statistic
                      title="Bilgi Logları"
                      value={systemReport.systemHealth.infoLogs}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                </Row>

                <Card title="Log Seviyelerine Göre Dağılım" size="small">
                  <Table
                    dataSource={systemReport.systemHealth.logsByLevel}
                    rowKey="level"
                    pagination={false}
                    columns={[
                      {
                        title: 'Seviye',
                        dataIndex: 'level',
                        key: 'level',
                        render: (level) => {
                          const colors = {
                            'Error': 'red',
                            'Warning': 'orange',
                            'Information': 'blue',
                            'Debug': 'green'
                          };
                          return <Tag color={colors[level as keyof typeof colors] || 'default'}>{level}</Tag>;
                        }
                      },
                      {
                        title: 'Adet',
                        dataIndex: 'count',
                        key: 'count'
                      },
                      {
                        title: 'Yüzde',
                        key: 'percentage',
                        render: (_, record) => {
                          const percentage = (record.count / systemReport.systemHealth.totalLogs * 100).toFixed(1);
                          return `${percentage}%`;
                        }
                      }
                    ]}
                  />
                </Card>
              </>
            )}
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
} 