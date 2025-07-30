'use client'

import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Table, 
  Button, 
  Alert, 
  Badge, 
  Space,
  Typography,
  Divider,
  Timeline,
  Tag,
  Tooltip,
  Switch
} from 'antd'
import { 
  PageContainer,
  ProCard,
  StatisticCard
} from '@ant-design/pro-components'
import { 
  MonitorOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  CloudServerOutlined,
  WifiOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ReloadOutlined,
  SettingOutlined,
  EyeOutlined,
  BellOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ApiOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

// Mock data for system monitoring
const mockMonitoringData = {
  systemStatus: {
    overall: 'healthy',
    uptime: 99.8,
    responseTime: 245,
    activeConnections: 1247,
    cpuUsage: 23.5,
    memoryUsage: 67.8,
    diskUsage: 45.2,
    networkUsage: 12.3
  },
  services: [
    { id: 1, name: 'Web Sunucusu', status: 'online', responseTime: 120, uptime: 99.9 },
    { id: 2, name: 'Veritabanı', status: 'online', responseTime: 45, uptime: 99.8 },
    { id: 3, name: 'API Gateway', status: 'online', responseTime: 89, uptime: 99.7 },
    { id: 4, name: 'Cache Servisi', status: 'warning', responseTime: 156, uptime: 98.5 },
    { id: 5, name: 'Email Servisi', status: 'online', responseTime: 234, uptime: 99.6 },
    { id: 6, name: 'Backup Servisi', status: 'offline', responseTime: 0, uptime: 0 }
  ],
  alerts: [
    { id: 1, level: 'warning', message: 'Cache servisi yavaş yanıt veriyor', time: '2 dakika önce', service: 'Cache Servisi' },
    { id: 2, level: 'error', message: 'Backup servisi çalışmıyor', time: '15 dakika önce', service: 'Backup Servisi' },
    { id: 3, level: 'info', message: 'Sistem güncellemesi tamamlandı', time: '1 saat önce', service: 'Sistem' },
    { id: 4, level: 'warning', message: 'Disk kullanımı %80\'e ulaştı', time: '3 saat önce', service: 'Sistem' }
  ],
  performance: [
    { time: '00:00', cpu: 15, memory: 45, disk: 42, network: 8 },
    { time: '04:00', cpu: 12, memory: 43, disk: 43, network: 6 },
    { time: '08:00', cpu: 28, memory: 58, disk: 44, network: 15 },
    { time: '12:00', cpu: 35, memory: 67, disk: 45, network: 22 },
    { time: '16:00', cpu: 42, memory: 72, disk: 46, network: 28 },
    { time: '20:00', cpu: 38, memory: 68, disk: 47, network: 25 },
    { time: '24:00', cpu: 23, memory: 52, disk: 45, network: 12 }
  ]
}

export default function MonitoringPage() {
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 30000) // 30 saniyede bir güncelle

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10b981'
      case 'warning': return '#f59e0b'
      case 'offline': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircleOutlined style={{ color: '#10b981' }} />
      case 'warning': return <ExclamationCircleOutlined style={{ color: '#f59e0b' }} />
      case 'offline': return <CloseCircleOutlined style={{ color: '#ef4444' }} />
      default: return <SyncOutlined style={{ color: '#6b7280' }} />
    }
  }

  const serviceColumns = [
    {
      title: 'Servis',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Space>
          {getStatusIcon(status)}
          <Badge 
            status={status === 'online' ? 'success' : status === 'warning' ? 'warning' : 'error'} 
            text={status === 'online' ? 'Çevrimiçi' : status === 'warning' ? 'Uyarı' : 'Çevrimdışı'} 
          />
        </Space>
      )
    },
    {
      title: 'Yanıt Süresi',
      dataIndex: 'responseTime',
      key: 'responseTime',
      render: (time: number) => (
        <Text style={{ color: time < 100 ? '#10b981' : time < 200 ? '#f59e0b' : '#ef4444' }}>
          {time}ms
        </Text>
      )
    },
    {
      title: 'Uptime',
      dataIndex: 'uptime',
      key: 'uptime',
      render: (uptime: number) => (
        <Text style={{ color: uptime > 99 ? '#10b981' : uptime > 95 ? '#f59e0b' : '#ef4444' }}>
          %{uptime}
        </Text>
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>
            Detay
          </Button>
          <Button type="link" size="small" icon={<SettingOutlined />}>
            Ayarlar
          </Button>
        </Space>
      )
    }
  ]

  const alertColumns = [
    {
      title: 'Seviye',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => (
        <Tag color={
          level === 'error' ? 'red' : 
          level === 'warning' ? 'orange' : 
          level === 'info' ? 'blue' : 'default'
        }>
          {level === 'error' ? 'Hata' : 
           level === 'warning' ? 'Uyarı' : 
           level === 'info' ? 'Bilgi' : level}
        </Tag>
      )
    },
    {
      title: 'Mesaj',
      dataIndex: 'message',
      key: 'message',
      render: (text: string) => <Text>{text}</Text>
    },
    {
      title: 'Servis',
      dataIndex: 'service',
      key: 'service',
      render: (text: string) => <Text type="secondary">{text}</Text>
    },
    {
      title: 'Zaman',
      dataIndex: 'time',
      key: 'time',
      render: (text: string) => <Text type="secondary">{text}</Text>
    }
  ]

  return (
    <PageContainer
      title="Sistem İzleme"
      subTitle="Sistem performansı ve servis durumlarını gerçek zamanlı takip edin"
      extra={[
        <Space key="controls">
          <Text type="secondary">Otomatik Yenile:</Text>
          <Switch 
            checked={autoRefresh} 
            onChange={setAutoRefresh}
            size="small"
          />
          <Button icon={<ReloadOutlined />} onClick={() => setLastUpdate(new Date())}>
            Yenile
          </Button>
        </Space>
      ]}
    >
      {/* System Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="Genel Durum"
            value={mockMonitoringData.systemStatus.overall === 'healthy' ? 'Sağlıklı' : 'Sorunlu'}
            valueStyle={{ color: mockMonitoringData.systemStatus.overall === 'healthy' ? '#10b981' : '#ef4444' }}
            prefix={<MonitorOutlined />}
            suffix="%"
            value={mockMonitoringData.systemStatus.uptime}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="Yanıt Süresi"
            value={mockMonitoringData.systemStatus.responseTime}
            suffix="ms"
            prefix={<ThunderboltOutlined />}
            valueStyle={{ color: mockMonitoringData.systemStatus.responseTime < 300 ? '#10b981' : '#f59e0b' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="Aktif Bağlantı"
            value={mockMonitoringData.systemStatus.activeConnections}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#6366f1' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="Son Güncelleme"
            value={lastUpdate.toLocaleTimeString()}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ fontSize: '14px', color: '#6b7280' }}
          />
        </Col>
      </Row>

      {/* System Resources */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <ProCard title="Sistem Kaynakları" extra={<CloudServerOutlined />}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>CPU Kullanımı</Text>
                  <Progress 
                    percent={mockMonitoringData.systemStatus.cpuUsage} 
                    strokeColor="#6366f1"
                    format={(percent) => `${percent}%`}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Bellek Kullanımı</Text>
                  <Progress 
                    percent={mockMonitoringData.systemStatus.memoryUsage} 
                    strokeColor="#8b5cf6"
                    format={(percent) => `${percent}%`}
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Disk Kullanımı</Text>
                  <Progress 
                    percent={mockMonitoringData.systemStatus.diskUsage} 
                    strokeColor="#ec4899"
                    format={(percent) => `${percent}%`}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Ağ Kullanımı</Text>
                  <Progress 
                    percent={mockMonitoringData.systemStatus.networkUsage} 
                    strokeColor="#10b981"
                    format={(percent) => `${percent}%`}
                  />
                </div>
              </Col>
            </Row>
          </ProCard>
        </Col>
        <Col xs={24} lg={12}>
          <ProCard title="Son Uyarılar" extra={<BellOutlined />}>
            <Timeline>
              {mockMonitoringData.alerts.slice(0, 4).map((alert, index) => (
                <Timeline.Item 
                  key={alert.id}
                  color={
                    alert.level === 'error' ? 'red' : 
                    alert.level === 'warning' ? 'orange' : 'blue'
                  }
                >
                  <Text strong>{alert.message}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {alert.service} • {alert.time}
                  </Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </ProCard>
        </Col>
      </Row>

      {/* Services Status */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <ProCard title="Servis Durumları" extra={<ApiOutlined />}>
            <Table 
              columns={serviceColumns} 
              dataSource={mockMonitoringData.services} 
              pagination={false}
              size="middle"
              rowKey="id"
            />
          </ProCard>
        </Col>
      </Row>

      {/* Performance Chart Placeholder */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <ProCard title="Performans Grafiği" extra={<DatabaseOutlined />}>
            <div style={{ 
              height: 300, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
              borderRadius: 12
            }}>
              <div style={{ textAlign: 'center' }}>
                <DatabaseOutlined style={{ fontSize: 48, color: '#6366f1', marginBottom: 16 }} />
                <Text style={{ fontSize: 16, color: '#6b7280' }}>
                  Performans grafiği burada görüntülenecek
                </Text>
              </div>
            </div>
          </ProCard>
        </Col>
      </Row>

      {/* System Alerts */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ProCard title="Sistem Uyarıları" extra={<SafetyOutlined />}>
            <Table 
              columns={alertColumns} 
              dataSource={mockMonitoringData.alerts} 
              pagination={false}
              size="middle"
              rowKey="id"
            />
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

        .ant-progress {
          margin-bottom: 8px;
        }

        .ant-progress-text {
          font-weight: bold;
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

        .ant-timeline-item-content {
          margin-bottom: 8px;
        }

        .ant-badge-status-text {
          font-weight: 500;
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