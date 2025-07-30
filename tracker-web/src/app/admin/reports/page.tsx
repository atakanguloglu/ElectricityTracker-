'use client'

import React, { useState } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Button, 
  Tag, 
  Progress, 
  Statistic, 
  Typography, 
  Divider,
  Space,
  Tooltip,
  Badge,
  Select,
  DatePicker,
  Tabs,
  List,
  Avatar
} from 'antd'
import { 
  ProCard,
  PageContainer 
} from '@ant-design/pro-components'
import { 
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  CloudOutlined,
  HddOutlined,
  CalendarOutlined,
  UserOutlined,
  RiseOutlined,
  FallOutlined,
  ReloadOutlined,
  SettingOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker
const { TabPane } = Tabs

export default function ReportsMonitoringPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedTenant, setSelectedTenant] = useState('all')

  // Mock reporting data
  const reportingStats = [
    {
      title: 'Toplam Tüketim',
      value: '2,450 kWh',
      icon: <ThunderboltOutlined style={{ fontSize: '24px', color: '#10b981' }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      change: '+15.2%',
      changeType: 'increase'
    },
    {
      title: 'Maliyet',
      value: '₺12,450',
      icon: <BarChartOutlined style={{ fontSize: '24px', color: '#f59e0b' }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      change: '+8.7%',
      changeType: 'increase'
    },
    {
      title: 'API Çağrıları',
      value: '45,230',
      icon: <CloudOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      change: '+12.3%',
      changeType: 'increase'
    },
    {
      title: 'Veritabanı Boyutu',
      value: '2.8 GB',
      icon: <DatabaseOutlined style={{ fontSize: '24px', color: '#8b5cf6' }} />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      change: '+5.1%',
      changeType: 'increase'
    }
  ]

  const tenantComparison = [
    {
      tenant: 'ABC Şirketi',
      consumption: 850,
      cost: 4250,
      users: 25,
      apiCalls: 12500,
      status: 'active',
      trend: 'up'
    },
    {
      tenant: 'XYZ Ltd.',
      consumption: 720,
      cost: 3600,
      users: 18,
      apiCalls: 8900,
      status: 'active',
      trend: 'up'
    },
    {
      tenant: 'DEF Corp.',
      consumption: 650,
      cost: 3250,
      users: 15,
      apiCalls: 7200,
      status: 'active',
      trend: 'down'
    },
    {
      tenant: 'GHI Inc.',
      consumption: 580,
      cost: 2900,
      users: 12,
      apiCalls: 6500,
      status: 'inactive',
      trend: 'stable'
    },
    {
      tenant: 'JKL Co.',
      consumption: 420,
      cost: 2100,
      users: 8,
      apiCalls: 4800,
      status: 'active',
      trend: 'up'
    }
  ]

  const apiUsageData = [
    {
      endpoint: '/api/auth/login',
      calls: 1250,
      avgResponse: 120,
      successRate: 98.5,
      status: 'healthy'
    },
    {
      endpoint: '/api/tenants',
      calls: 890,
      avgResponse: 85,
      successRate: 99.2,
      status: 'healthy'
    },
    {
      endpoint: '/api/consumption',
      calls: 2100,
      avgResponse: 150,
      successRate: 97.8,
      status: 'warning'
    },
    {
      endpoint: '/api/billing',
      calls: 650,
      avgResponse: 200,
      successRate: 96.5,
      status: 'error'
    },
    {
      endpoint: '/api/reports',
      calls: 320,
      avgResponse: 300,
      successRate: 99.0,
      status: 'healthy'
    }
  ]

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Yüksek CPU Kullanımı',
      message: 'Sunucu CPU kullanımı %85\'in üzerine çıktı',
      time: '2 saat önce',
      tenant: 'ABC Şirketi'
    },
    {
      id: 2,
      type: 'error',
      title: 'API Hata Oranı',
      message: '/api/billing endpoint\'inde %3.5 hata oranı tespit edildi',
      time: '4 saat önce',
      tenant: 'Sistem'
    },
    {
      id: 3,
      type: 'info',
      title: 'Yeni Tenant Eklendi',
      message: 'MNO Ltd. sisteme kayıt oldu',
      time: '6 saat önce',
      tenant: 'Sistem'
    },
    {
      id: 4,
      type: 'success',
      title: 'Backup Tamamlandı',
      message: 'Günlük veritabanı yedeklemesi başarıyla tamamlandı',
      time: '8 saat önce',
      tenant: 'Sistem'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'success'
      case 'warning': return 'processing'
      case 'error': return 'error'
      case 'active': return 'success'
      case 'inactive': return 'default'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return 'Sağlıklı'
      case 'warning': return 'Uyarı'
      case 'error': return 'Hata'
      case 'active': return 'Aktif'
      case 'inactive': return 'Pasif'
      default: return 'Bilinmiyor'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <RiseOutlined style={{ color: '#10b981' }} />
      case 'down': return <FallOutlined style={{ color: '#ef4444' }} />
      case 'stable': return <BarChartOutlined style={{ color: '#64748b' }} />
      default: return <BarChartOutlined />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <ExclamationCircleOutlined style={{ color: '#f59e0b' }} />
      case 'error': return <ExclamationCircleOutlined style={{ color: '#ef4444' }} />
      case 'info': return <ClockCircleOutlined style={{ color: '#3b82f6' }} />
      case 'success': return <CheckCircleOutlined style={{ color: '#10b981' }} />
      default: return <ClockCircleOutlined />
    }
  }

  const tenantColumns = [
    {
      title: 'Tenant',
      dataIndex: 'tenant',
      key: 'tenant',
      render: (tenant: string) => (
        <div className="tenant-info">
          <UserOutlined style={{ marginRight: '8px', color: '#64748b' }} />
          {tenant}
        </div>
      ),
    },
    {
      title: 'Tüketim (kWh)',
      dataIndex: 'consumption',
      key: 'consumption',
      render: (consumption: number) => (
        <Text strong style={{ fontSize: '16px' }}>{consumption.toLocaleString()}</Text>
      ),
    },
    {
      title: 'Maliyet (₺)',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => (
        <Text strong style={{ fontSize: '16px', color: '#f59e0b' }}>₺{cost.toLocaleString()}</Text>
      ),
    },
    {
      title: 'Kullanıcılar',
      dataIndex: 'users',
      key: 'users',
      render: (users: number) => (
        <Tag color="blue" className="user-tag">
          {users}
        </Tag>
      ),
    },
    {
      title: 'API Çağrıları',
      dataIndex: 'apiCalls',
      key: 'apiCalls',
      render: (calls: number) => (
        <Text type="secondary">{calls.toLocaleString()}</Text>
      ),
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={getStatusColor(status) as any} 
          text={getStatusText(status)}
        />
      ),
    },
    {
      title: 'Trend',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend: string) => (
        <div className="trend-indicator">
          {getTrendIcon(trend)}
        </div>
      ),
    },
  ]

  const apiColumns = [
    {
      title: 'Endpoint',
      dataIndex: 'endpoint',
      key: 'endpoint',
      render: (endpoint: string) => (
        <Text code style={{ fontSize: '12px' }}>{endpoint}</Text>
      ),
    },
    {
      title: 'Çağrı Sayısı',
      dataIndex: 'calls',
      key: 'calls',
      render: (calls: number) => (
        <Text strong>{calls.toLocaleString()}</Text>
      ),
    },
    {
      title: 'Ort. Yanıt (ms)',
      dataIndex: 'avgResponse',
      key: 'avgResponse',
      render: (response: number) => (
        <Text type="secondary">{response}ms</Text>
      ),
    },
    {
      title: 'Başarı Oranı',
      dataIndex: 'successRate',
      key: 'successRate',
      render: (rate: number) => (
        <div className="success-rate">
          <Progress 
            percent={rate} 
            size="small" 
            strokeColor={rate >= 98 ? '#10b981' : rate >= 95 ? '#f59e0b' : '#ef4444'}
            showInfo={false}
          />
          <Text style={{ marginLeft: '8px', fontSize: '12px' }}>{rate}%</Text>
        </div>
      ),
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={getStatusColor(status) as any} 
          text={getStatusText(status)}
        />
      ),
    },
  ]

  return (
    <PageContainer
      header={{
        title: (
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg shadow-lg">
              <BarChartOutlined style={{ fontSize: '20px', color: 'white' }} />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, color: '#1e293b' }}>
                Raporlama & İzleme
              </Title>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                Sistem performansını izleyin, raporlar oluşturun ve analizler yapın.
              </Text>
            </div>
          </div>
        ),
        breadcrumb: {},
      }}
    >
      <div className="reports-monitoring-container">
        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          {reportingStats.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card 
                className="stat-card"
                style={{
                  background: stat.gradient,
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <div className="stat-card-content">
                  <div className="stat-icon">
                    {stat.icon}
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-title">{stat.title}</div>
                    <div className={`stat-change ${stat.changeType}`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
                <div className="stat-card-overlay"></div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Filters */}
        <ProCard
          className="filters-card"
          style={{
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0',
            marginBottom: '24px'
          }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8}>
              <div className="filter-item">
                <Text strong style={{ marginBottom: '8px', display: 'block' }}>Dönem:</Text>
                <Select
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                  style={{ width: '100%' }}
                >
                  <Option value="day">Günlük</Option>
                  <Option value="week">Haftalık</Option>
                  <Option value="month">Aylık</Option>
                  <Option value="quarter">Çeyreklik</Option>
                  <Option value="year">Yıllık</Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="filter-item">
                <Text strong style={{ marginBottom: '8px', display: 'block' }}>Tenant:</Text>
                <Select
                  value={selectedTenant}
                  onChange={setSelectedTenant}
                  style={{ width: '100%' }}
                >
                  <Option value="all">Tümü</Option>
                  <Option value="ABC Şirketi">ABC Şirketi</Option>
                  <Option value="XYZ Ltd.">XYZ Ltd.</Option>
                  <Option value="DEF Corp.">DEF Corp.</Option>
                  <Option value="GHI Inc.">GHI Inc.</Option>
                  <Option value="JKL Co.">JKL Co.</Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="filter-item">
                <Text strong style={{ marginBottom: '8px', display: 'block' }}>Tarih Aralığı:</Text>
                <RangePicker style={{ width: '100%' }} />
              </div>
            </Col>
          </Row>
        </ProCard>

        {/* Main Content Tabs */}
        <Tabs 
          defaultActiveKey="1" 
          className="reports-tabs"
          items={[
            {
              key: '1',
              label: (
                <span>
                  <BarChartOutlined />
                  Tenant Karşılaştırması
                </span>
              ),
              children: (
                <ProCard
                  className="table-card"
                  style={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <Table
                    columns={tenantColumns}
                    dataSource={tenantComparison}
                    rowKey="tenant"
                    pagination={{
                      total: tenantComparison.length,
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} tenant`,
                    }}
                    className="tenant-table"
                  />
                </ProCard>
              )
            },
            {
              key: '2',
              label: (
                <span>
                  <LineChartOutlined />
                  API Kullanımı
                </span>
              ),
              children: (
                <ProCard
                  className="table-card"
                  style={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <Table
                    columns={apiColumns}
                    dataSource={apiUsageData}
                    rowKey="endpoint"
                    pagination={{
                      total: apiUsageData.length,
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} endpoint`,
                    }}
                    className="api-table"
                  />
                </ProCard>
              )
            },
            {
              key: '3',
              label: (
                <span>
                  <PieChartOutlined />
                  Sistem Uyarıları
                </span>
              ),
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={16}>
                    <ProCard
                      title={
                        <div className="flex items-center space-x-2">
                          <ExclamationCircleOutlined style={{ color: '#f59e0b', fontSize: '18px' }} />
                          <span style={{ color: '#1e293b', fontWeight: 600 }}>Son Uyarılar</span>
                        </div>
                      }
                      className="alerts-card"
                      style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <List
                        dataSource={systemAlerts}
                        renderItem={(alert) => (
                          <List.Item className="alert-item">
                            <List.Item.Meta
                              avatar={
                                <Avatar 
                                  icon={getAlertIcon(alert.type)}
                                  style={{ 
                                    backgroundColor: alert.type === 'warning' ? '#fef3c7' : 
                                                   alert.type === 'error' ? '#fee2e2' : 
                                                   alert.type === 'info' ? '#dbeafe' : '#d1fae5'
                                  }}
                                />
                              }
                              title={
                                <div className="alert-title">
                                  <Text strong>{alert.title}</Text>
                                  <Tag color={alert.type === 'warning' ? 'orange' : 
                                             alert.type === 'error' ? 'red' : 
                                             alert.type === 'info' ? 'blue' : 'green'}>
                                    {alert.tenant}
                                  </Tag>
                                </div>
                              }
                              description={
                                <div className="alert-description">
                                  <Text type="secondary">{alert.message}</Text>
                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {alert.time}
                                  </Text>
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                        className="alerts-list"
                      />
                    </ProCard>
                  </Col>
                  <Col xs={24} lg={8}>
                    <ProCard
                      title={
                        <div className="flex items-center space-x-2">
                          <SettingOutlined style={{ color: '#8b5cf6', fontSize: '18px' }} />
                          <span style={{ color: '#1e293b', fontWeight: 600 }}>Hızlı İşlemler</span>
                        </div>
                      }
                      className="actions-card"
                      style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <div className="quick-actions">
                        <Button
                          type="primary"
                          icon={<DownloadOutlined />}
                          size="large"
                          block
                          style={{
                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            border: 'none',
                            borderRadius: '8px',
                            marginBottom: '12px'
                          }}
                        >
                          Rapor İndir
                        </Button>
                        <Button
                          icon={<ReloadOutlined />}
                          size="large"
                          block
                          style={{
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            marginBottom: '12px'
                          }}
                        >
                          Verileri Yenile
                        </Button>
                        <Button
                          icon={<BarChartOutlined />}
                          size="large"
                          block
                          style={{
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px'
                          }}
                        >
                          Detaylı Analiz
                        </Button>
                      </div>
                    </ProCard>
                  </Col>
                </Row>
              )
            }
          ]}
        />

        <style jsx>{`
          .reports-monitoring-container {
            padding: 0;
          }
          
          .stat-card {
            transition: all 0.3s ease;
            cursor: pointer;
          }
          
          .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15) !important;
          }
          
          .stat-card-content {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            color: white;
          }
          
          .stat-icon {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 12px;
            backdrop-filter: blur(10px);
          }
          
          .stat-info {
            text-align: right;
          }
          
          .stat-value {
            font-size: 28px;
            font-weight: bold;
            line-height: 1;
            margin-bottom: 4px;
          }
          
          .stat-title {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 500;
            margin-bottom: 4px;
          }
          
          .stat-change {
            font-size: 12px;
            font-weight: 600;
          }
          
          .stat-change.increase {
            color: #10b981;
          }
          
          .stat-change.decrease {
            color: #ef4444;
          }
          
          .stat-card-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
            z-index: 1;
          }
          
          .filters-card, .table-card, .alerts-card, .actions-card {
            transition: all 0.3s ease;
          }
          
          .filters-card:hover, .table-card:hover, .alerts-card:hover, .actions-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
          }
          
          .filter-item {
            margin-bottom: 16px;
          }
          
          .tenant-info {
            display: flex;
            align-items: center;
            font-weight: 500;
          }
          
          .user-tag {
            font-weight: 600;
            border-radius: 6px;
          }
          
          .trend-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          }
          
          .success-rate {
            display: flex;
            align-items: center;
            width: 100%;
          }
          
          .tenant-table :global(.ant-table-thead > tr > th),
          .api-table :global(.ant-table-thead > tr > th) {
            background: #f8fafc;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e2e8f0;
          }
          
          .tenant-table :global(.ant-table-tbody > tr:hover > td),
          .api-table :global(.ant-table-tbody > tr:hover > td) {
            background: rgba(59, 130, 246, 0.05);
          }
          
          .reports-tabs :global(.ant-tabs-tab) {
            font-weight: 600;
            color: #64748b;
          }
          
          .reports-tabs :global(.ant-tabs-tab-active) {
            color: #3b82f6;
          }
          
          .reports-tabs :global(.ant-tabs-ink-bar) {
            background: #3b82f6;
          }
          
          .alert-item {
            padding: 16px 0;
            border-bottom: 1px solid #f1f5f9;
          }
          
          .alert-item:last-child {
            border-bottom: none;
          }
          
          .alert-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          
          .alert-description {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          
          .quick-actions {
            padding: 8px 0;
          }
          
          @media (max-width: 768px) {
            .stat-value {
              font-size: 24px;
            }
            
            .stat-title {
              font-size: 12px;
            }
            
            .alert-title {
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
            }
            
            .tenant-info {
              flex-direction: column;
              align-items: flex-start;
            }
            
            .tenant-info .anticon {
              margin-bottom: 4px;
              margin-right: 0;
            }
          }
        `}</style>
      </div>
    </PageContainer>
  )
} 