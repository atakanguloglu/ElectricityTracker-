'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Table, 
  Button, 
  DatePicker, 
  Select, 
  Space,
  Typography,
  Divider,
  Alert,
  Badge,
  Tooltip
} from 'antd'
import { 
  PageContainer,
  ProCard,
  StatisticCard
} from '@ant-design/pro-components'
import {
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  UserOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import { analyticsService, AnalyticsOverview, AnalyticsTrend, TopTenant, DeviceUsage } from '../../../services/analyticsService'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

export default function AnalyticsPage() {
  // State management
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [trends, setTrends] = useState<AnalyticsTrend[]>([]);
  const [topTenants, setTopTenants] = useState<TopTenant[]>([]);
  const [deviceUsage, setDeviceUsage] = useState<DeviceUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<any>(null)
  const [selectedMetric, setSelectedMetric] = useState('users')

  // Load analytics data
  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [overviewData, trendsData, topTenantsData, deviceUsageData] = await Promise.all([
          analyticsService.getOverview(),
          analyticsService.getTrends(),
          analyticsService.getTopTenants(),
          analyticsService.getDeviceUsage()
        ]);
        
        setOverview(overviewData);
        setTrends(trendsData);
        setTopTenants(topTenantsData);
        setDeviceUsage(deviceUsageData);
      } catch (error) {
        console.error('Error loading analytics data:', error);
        setError('Analytics verileri yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, []);

  const overviewColumns = [
    {
      title: 'Metrik',
      dataIndex: 'metric',
      key: 'metric',
      render: (text: string, record: any) => (
        <Space>
          {record.icon}
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Değer',
      dataIndex: 'value',
      key: 'value',
      render: (value: any, record: any) => (
        <Text style={{ fontSize: '18px', fontWeight: 'bold', color: record.color }}>
          {record.formattedValue}
        </Text>
      )
    },
    {
      title: 'Değişim',
      dataIndex: 'change',
      key: 'change',
      render: (change: number) => (
        <Space>
          {change > 0 ? (
            <ArrowUpOutlined style={{ color: '#10b981' }} />
          ) : (
            <ArrowDownOutlined style={{ color: '#ef4444' }} />
          )}
          <Text style={{ color: change > 0 ? '#10b981' : '#ef4444' }}>
            {change > 0 ? '+' : ''}{change}%
          </Text>
        </Space>
      )
    }
  ]

  const tenantColumns = [
    {
      title: 'Tenant',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Tüketim (kWh)',
      dataIndex: 'consumption',
      key: 'consumption',
      render: (value?: number) => (
        <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
          {value?.toLocaleString() ?? '0'}
        </Text>
      )
    },
    {
      title: 'Büyüme',
      dataIndex: 'growth',
      key: 'growth',
      render: (growth: number) => (
        <Space>
          {growth > 0 ? (
            <ArrowUpOutlined style={{ color: '#10b981' }} />
          ) : (
            <ArrowDownOutlined style={{ color: '#ef4444' }} />
          )}
          <Text style={{ color: growth > 0 ? '#10b981' : '#ef4444' }}>
            {growth > 0 ? '+' : ''}{growth}%
          </Text>
        </Space>
      )
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'active' ? 'success' : 'warning'} 
          text={status === 'active' ? 'Aktif' : 'Uyarı'} 
        />
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>
            Detay
          </Button>
          <Button type="link" size="small" icon={<DownloadOutlined />}>
            Rapor
          </Button>
        </Space>
      )
    }
  ]

  const overviewData = useMemo(() => {
    if (!overview) {
      return [];
    }
    
    return [
      {
        key: '1',
        metric: 'Toplam Kullanıcı',
        value: overview.TotalUsers ?? 0,
        formattedValue: overview.TotalUsers != null ? overview.TotalUsers.toLocaleString() : '0',
        change: 12.5,
        icon: <UserOutlined style={{ color: '#6366f1' }} />,
        color: '#6366f1'
      },
      {
        key: '2',
        metric: 'Aktif Kullanıcı',
        value: overview.ActiveUsers ?? 0,
        formattedValue: overview.ActiveUsers != null ? overview.ActiveUsers.toLocaleString() : '0',
        change: 8.3,
        icon: <ThunderboltOutlined style={{ color: '#10b981' }} />,
        color: '#10b981'
      },
      {
        key: '3',
        metric: 'Toplam Gelir',
        value: overview.TotalRevenue ?? 0,
        formattedValue: `₺${overview.TotalRevenue != null ? overview.TotalRevenue.toLocaleString() : '0'}`,
        change: 15.7,
        icon: <DollarOutlined style={{ color: '#f59e0b' }} />,
        color: '#f59e0b'
      },
      {
        key: '4',
        metric: 'Ortalama Oturum',
        value: overview.AvgSessionTime ?? 0,
        formattedValue: `${overview.AvgSessionTime != null ? overview.AvgSessionTime.toFixed(1) : '0.0'} dk`,
        change: -2.1,
        icon: <ClockCircleOutlined style={{ color: '#8b5cf6' }} />,
        color: '#8b5cf6'
      }
    ];
  }, [overview])

  // Loading state
  if (loading) {
    return (
      <PageContainer
        title="Analitik Dashboard"
        subTitle="Sistem performansı ve kullanıcı davranışları hakkında detaylı analizler"
      >
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <div style={{ marginBottom: '16px' }}>
            <LoadingOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          </div>
          <div style={{ fontSize: '16px' }}>Analytics verileri yükleniyor...</div>
        </div>
      </PageContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <PageContainer
        title="Analitik Dashboard"
        subTitle="Sistem performansı ve kullanıcı davranışları hakkında detaylı analizler"
      >
        <Alert
          message="Hata"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => window.location.reload()}>
              Yeniden Dene
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Analitik Dashboard"
      subTitle="Sistem performansı ve kullanıcı davranışları hakkında detaylı analizler"
      extra={[
        <Button key="refresh" icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
          Yenile
        </Button>,
        <Button key="export" type="primary" icon={<DownloadOutlined />}>
          Dışa Aktar
        </Button>
      ]}
    >
      {/* Filters */}
      <ProCard style={{ marginBottom: 24 }}>
        <Space size="large">
          <Space>
            <Text strong>Zaman Aralığı:</Text>
            <RangePicker 
              value={dateRange}
              onChange={setDateRange}
              style={{ width: 250 }}
            />
          </Space>
          <Space>
            <Text strong>Metrik:</Text>
            <Select 
              value={selectedMetric} 
              onChange={setSelectedMetric}
              style={{ width: 150 }}
            >
              <Option value="users">Kullanıcılar</Option>
              <Option value="revenue">Gelir</Option>
              <Option value="sessions">Oturumlar</Option>
            </Select>
          </Space>
        </Space>
      </ProCard>

             {/* Overview Statistics */}
       {overview && overviewData && overviewData.length > 0 && (
         <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
           <Col span={24}>
             <ProCard title="Genel Bakış" extra={<FilterOutlined />}>
               <Table 
                 columns={overviewColumns} 
                 dataSource={overviewData} 
                 pagination={false}
                 size="middle"
               />
             </ProCard>
           </Col>
         </Row>
       )}

      {/* Charts and Analytics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <ProCard 
            title="Trend Analizi" 
            extra={<LineChartOutlined />}
            style={{ height: 400 }}
          >
            <div style={{ 
              height: 300, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
              borderRadius: 12
            }}>
              <div style={{ textAlign: 'center' }}>
                <LineChartOutlined style={{ fontSize: 48, color: '#6366f1', marginBottom: 16 }} />
                <Text style={{ fontSize: 16, color: '#6b7280' }}>
                  Trend grafiği burada görüntülenecek
                </Text>
              </div>
            </div>
          </ProCard>
        </Col>
        <Col xs={24} lg={12}>
          <ProCard 
            title="Cihaz Kullanımı" 
            extra={<PieChartOutlined />}
            style={{ height: 400 }}
          >
            <div style={{ 
              height: 300, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
              borderRadius: 12
            }}>
              <div style={{ textAlign: 'center' }}>
                <PieChartOutlined style={{ fontSize: 48, color: '#8b5cf6', marginBottom: 16 }} />
                <Text style={{ fontSize: 16, color: '#6b7280' }}>
                  Pasta grafiği burada görüntülenecek
                </Text>
              </div>
            </div>
          </ProCard>
        </Col>
      </Row>

      {/* Top Tenants */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <ProCard 
            title="En Aktif Tenantlar" 
            extra={<BarChartOutlined />}
          >
            <Table 
              columns={tenantColumns} 
              dataSource={topTenants} 
              pagination={false}
              size="middle"
            />
          </ProCard>
        </Col>
      </Row>

      {/* Device Usage */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ProCard title="Cihaz Kullanım Dağılımı">
            <Row gutter={[16, 16]}>
              {deviceUsage.map((device, index) => (
                <Col xs={24} sm={8} key={index}>
                  <Card style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 16 }}>
                                             <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                         {device.Device}
                       </Text>
                    </div>
                                         <Progress 
                       type="circle" 
                       percent={device.Usage} 
                       strokeColor={device.Color}
                       format={(percent) => `${percent}%`}
                       size={80}
                     />
                  </Card>
                </Col>
              ))}
            </Row>
          </ProCard>
        </Col>
      </Row>

      <style jsx>{`
        .ant-card {
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }

        .ant-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }

        .ant-pro-card {
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }

        .ant-pro-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }

        .ant-table {
          border-radius: 8px;
          overflow: hidden;
        }

        .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-bottom: 1px solid #e2e8f0;
          font-weight: 600;
        }

        .ant-progress-circle .ant-progress-text {
          font-weight: bold;
          color: #374151;
        }

        .ant-btn {
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .ant-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .ant-select {
          border-radius: 8px;
        }

        .ant-picker {
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .ant-space {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .ant-space-item {
            margin-bottom: 8px;
          }
        }
      `}</style>
    </PageContainer>
  )
} 