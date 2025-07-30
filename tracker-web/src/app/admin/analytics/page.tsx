'use client'

import React, { useState } from 'react'
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
  ClockCircleOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

// Mock data for analytics
const mockAnalyticsData = {
  overview: {
    totalUsers: 1247,
    activeUsers: 892,
    totalRevenue: 45678,
    avgSessionTime: 23.5
  },
  trends: [
    { date: '2024-01', users: 1200, revenue: 42000, sessions: 850 },
    { date: '2024-02', users: 1250, revenue: 43500, sessions: 880 },
    { date: '2024-03', users: 1300, revenue: 45000, sessions: 920 },
    { date: '2024-04', users: 1350, revenue: 46500, sessions: 950 },
    { date: '2024-05', users: 1400, revenue: 48000, sessions: 980 },
    { date: '2024-06', users: 1450, revenue: 49500, sessions: 1010 }
  ],
  topTenants: [
    { id: 1, name: 'ABC Şirketi', consumption: 12500, growth: 12.5, status: 'active' },
    { id: 2, name: 'XYZ Ltd.', consumption: 11800, growth: 8.3, status: 'active' },
    { id: 3, name: 'DEF Holding', consumption: 11200, growth: -2.1, status: 'warning' },
    { id: 4, name: 'GHI Group', consumption: 10800, growth: 15.7, status: 'active' },
    { id: 5, name: 'JKL Corp', consumption: 10200, growth: 5.2, status: 'active' }
  ],
  deviceUsage: [
    { device: 'Mobil Uygulama', usage: 45, color: '#6366f1' },
    { device: 'Web Arayüzü', usage: 35, color: '#8b5cf6' },
    { device: 'API Entegrasyonu', usage: 20, color: '#ec4899' }
  ]
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<any>(null)
  const [selectedMetric, setSelectedMetric] = useState('users')

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
      render: (value: number) => (
        <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
          {value.toLocaleString()}
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

  const overviewData = [
    {
      key: '1',
      metric: 'Toplam Kullanıcı',
      value: mockAnalyticsData.overview.totalUsers,
      formattedValue: mockAnalyticsData.overview.totalUsers.toLocaleString(),
      change: 12.5,
      icon: <UserOutlined style={{ color: '#6366f1' }} />,
      color: '#6366f1'
    },
    {
      key: '2',
      metric: 'Aktif Kullanıcı',
      value: mockAnalyticsData.overview.activeUsers,
      formattedValue: mockAnalyticsData.overview.activeUsers.toLocaleString(),
      change: 8.3,
      icon: <ThunderboltOutlined style={{ color: '#10b981' }} />,
      color: '#10b981'
    },
    {
      key: '3',
      metric: 'Toplam Gelir',
      value: mockAnalyticsData.overview.totalRevenue,
      formattedValue: `₺${mockAnalyticsData.overview.totalRevenue.toLocaleString()}`,
      change: 15.7,
      icon: <DollarOutlined style={{ color: '#f59e0b' }} />,
      color: '#f59e0b'
    },
    {
      key: '4',
      metric: 'Ortalama Oturum',
      value: mockAnalyticsData.overview.avgSessionTime,
      formattedValue: `${mockAnalyticsData.overview.avgSessionTime} dk`,
      change: -2.1,
      icon: <ClockCircleOutlined style={{ color: '#8b5cf6' }} />,
      color: '#8b5cf6'
    }
  ]

  return (
    <PageContainer
      title="Analitik Dashboard"
      subTitle="Sistem performansı ve kullanıcı davranışları hakkında detaylı analizler"
      extra={[
        <Button key="refresh" icon={<ReloadOutlined />}>
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
              dataSource={mockAnalyticsData.topTenants} 
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
              {mockAnalyticsData.deviceUsage.map((device, index) => (
                <Col xs={24} sm={8} key={index}>
                  <Card style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 16 }}>
                      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                        {device.device}
                      </Text>
                    </div>
                    <Progress 
                      type="circle" 
                      percent={device.usage} 
                      strokeColor={device.color}
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