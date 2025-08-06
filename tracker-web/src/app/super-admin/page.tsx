'use client'

import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Progress, Button, Tag, List, Avatar, Typography, Divider, Spin, Alert } from 'antd'
import { 
  ProCard, 
  StatisticCard,
  PageContainer 
} from '@ant-design/pro-components'
import { 
  TeamOutlined, 
  UserOutlined,
  FileTextOutlined, 
  SafetyOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  RiseOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  DesktopOutlined,
  HddOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import { apiRequest } from '@/utils/auth'

const { Title, Text } = Typography

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5143/api'

// Types
interface DashboardStats {
  totalTenants?: number
  activeTenants?: number
  totalUsers?: number
  activeUsers?: number
  totalLogs?: number
  todayLogs?: number
  systemHealth?: number
  securityScore?: number
  // PascalCase properties from backend
  TotalTenants?: number
  ActiveTenants?: number
  TotalUsers?: number
  ActiveUsers?: number
  TotalLogs?: number
  TodayLogs?: number
  SystemHealth?: number
  SecurityScore?: number
}

interface RecentActivity {
  id?: number
  message?: string
  level?: string
  category?: string
  timestamp?: string
  tenantName?: string
  userName?: string
  // PascalCase properties from backend
  Id?: number
  Message?: string
  Level?: string
  Category?: string
  Timestamp?: string
  TenantName?: string
  UserName?: string
}

interface SystemResources {
  cpuUsage?: number
  memoryUsage?: number
  diskUsage?: number
  networkUsage?: number
  databaseConnections?: number
  activeSessions?: number
  // PascalCase properties from backend
  CpuUsage?: number
  MemoryUsage?: number
  DiskUsage?: number
  NetworkUsage?: number
  DatabaseConnections?: number
  ActiveSessions?: number
}

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [systemResources, setSystemResources] = useState<SystemResources | null>(null)

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch dashboard stats
      const statsResponse = await apiRequest(`${API_BASE_URL}/admin/dashboard/stats`)
      if (!statsResponse.ok) throw new Error('Dashboard istatistikleri alınamadı')
      const stats = await statsResponse.json()
      console.log('Dashboard stats response:', stats)

      // Fetch recent activities
      const activitiesResponse = await apiRequest(`${API_BASE_URL}/admin/dashboard/recent-activities`)
      if (!activitiesResponse.ok) throw new Error('Son aktiviteler alınamadı')
      const activities = await activitiesResponse.json()
      console.log('Recent activities response:', activities)

      // Fetch system resources
      const resourcesResponse = await apiRequest(`${API_BASE_URL}/admin/dashboard/system-resources`)
      if (!resourcesResponse.ok) throw new Error('Sistem kaynakları alınamadı')
      const resources = await resourcesResponse.json()
      console.log('System resources response:', resources)
      
      // Debug: Sistem kaynakları detayları
      if (resources) {
        console.log('CPU Usage:', resources.CpuUsage || resources.cpuUsage, '%')
        console.log('Memory Usage:', resources.MemoryUsage || resources.memoryUsage, '%')
        console.log('Disk Usage:', resources.DiskUsage || resources.diskUsage, '%')
        console.log('Network Usage:', resources.NetworkUsage || resources.networkUsage, '%')
      }

      setDashboardStats(stats)
      setRecentActivities(activities)
      setSystemResources(resources)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata oluştu')
      console.error('Dashboard data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <PageContainer
        header={{
          title: 'Admin Paneli - Genel Bakış',
          breadcrumb: {},
        }}
      >
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '20px' }}>Veriler yükleniyor...</div>
        </div>
      </PageContainer>
    )
  }

  // Error state
  if (error) {
    return (
      <PageContainer
        header={{
          title: 'Admin Paneli - Genel Bakış',
          breadcrumb: {},
        }}
      >
        <Alert
          message="Hata"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={fetchDashboardData}>
              Tekrar Dene
            </Button>
          }
        />
      </PageContainer>
    )
  }

  // Transform API data to UI format - handle both camelCase and PascalCase
  const stats = dashboardStats ? [
    {
      title: 'Toplam Tenant',
      value: dashboardStats.totalTenants || dashboardStats.TotalTenants || 0,
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      change: `+${(dashboardStats.totalTenants || dashboardStats.TotalTenants || 0) - (dashboardStats.activeTenants || dashboardStats.ActiveTenants || 0)}`,
      changeType: 'increase'
    },
    {
      title: 'Aktif Kullanıcı',
      value: dashboardStats.activeUsers || dashboardStats.ActiveUsers || 0,
      icon: <UserOutlined style={{ fontSize: '24px', color: '#10b981' }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      change: `+${Math.floor(((dashboardStats.activeUsers || dashboardStats.ActiveUsers || 0) * 0.1))}`,
      changeType: 'increase'
    },
    {
      title: 'Toplam Log',
      value: (dashboardStats.totalLogs || dashboardStats.TotalLogs || 0).toLocaleString(),
      icon: <FileTextOutlined style={{ fontSize: '24px', color: '#8b5cf6' }} />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      change: `+${dashboardStats.todayLogs || dashboardStats.TodayLogs || 0}`,
      changeType: 'increase'
    },
    {
      title: 'Güvenlik Skoru',
      value: `${dashboardStats.securityScore || dashboardStats.SecurityScore || 0}/100`,
      icon: <SafetyOutlined style={{ fontSize: '24px', color: '#f59e0b' }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      change: `+${Math.floor(((dashboardStats.securityScore || dashboardStats.SecurityScore || 0) * 0.05))}`,
      changeType: 'increase'
    }
  ] : []

  const quickActions = [
    {
      title: 'Tenant Yönetimi',
      description: 'Tenant ekle, düzenle ve yönet',
      icon: <TeamOutlined style={{ fontSize: '20px', color: '#3b82f6' }} />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
    },
    {
      title: 'Sistem Logları',
      description: 'Sistem loglarını görüntüle ve analiz et',
      icon: <FileTextOutlined style={{ fontSize: '20px', color: '#10b981' }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)'
    },
    {
      title: 'Güvenlik',
      description: 'Güvenlik ayarları ve olayları',
      icon: <SafetyOutlined style={{ fontSize: '20px', color: '#ef4444' }} />,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)'
    },
    {
      title: 'Sistem Ayarları',
      description: 'Genel sistem konfigürasyonu',
      icon: <SettingOutlined style={{ fontSize: '20px', color: '#8b5cf6' }} />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    }
  ]

  const transformedActivities = recentActivities.map(activity => ({
    title: activity.message || activity.Message || 'Bilinmeyen aktivite',
    time: new Date(activity.timestamp || activity.Timestamp || new Date()).toLocaleString('tr-TR'),
    status: (activity.level || activity.Level) === 'Error' ? 'Hata' : (activity.level || activity.Level) === 'Warning' ? 'Uyarı' : 'Bilgi',
    statusColor: (activity.level || activity.Level) === 'Error' ? 'error' : (activity.level || activity.Level) === 'Warning' ? 'warning' : 'success',
    icon: (activity.level || activity.Level) === 'Error' ? 
      <ExclamationCircleOutlined style={{ color: '#ef4444' }} /> :
      (activity.level || activity.Level) === 'Warning' ? 
        <ExclamationCircleOutlined style={{ color: '#f59e0b' }} /> :
        <CheckCircleOutlined style={{ color: '#10b981' }} />
  }))

  const transformedSystemResources = systemResources ? [
    {
      name: 'CPU Kullanımı',
      value: systemResources.cpuUsage || systemResources.CpuUsage || 0,
      icon: <DesktopOutlined style={{ fontSize: '16px', color: '#3b82f6' }} />,
      color: '#3b82f6',
      status: (systemResources.cpuUsage || systemResources.CpuUsage || 0) > 80 ? 'Uyarı' : 'Normal'
    },
    {
      name: 'RAM Kullanımı',
      value: systemResources.memoryUsage || systemResources.MemoryUsage || 0,
      icon: <ThunderboltOutlined style={{ fontSize: '16px', color: '#10b981' }} />,
      color: '#10b981',
      status: (systemResources.memoryUsage || systemResources.MemoryUsage || 0) > 85 ? 'Uyarı' : 'Normal'
    },
    {
      name: 'Disk Kullanımı',
      value: systemResources.diskUsage || systemResources.DiskUsage || 0,
      icon: <HddOutlined style={{ fontSize: '16px', color: '#f59e0b' }} />,
      color: '#f59e0b',
      status: (systemResources.diskUsage || systemResources.DiskUsage || 0) > 80 ? 'Uyarı' : 'Normal'
    },
    {
      name: 'Network',
      value: systemResources.networkUsage || systemResources.NetworkUsage || 0,
      icon: <BarChartOutlined style={{ fontSize: '16px', color: '#8b5cf6' }} />,
      color: '#8b5cf6',
      status: (systemResources.networkUsage || systemResources.NetworkUsage || 0) > 70 ? 'Uyarı' : 'Normal'
    }
  ] : []

  return (
    <PageContainer
      header={{
        title: (
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
              <BarChartOutlined style={{ fontSize: '20px', color: 'white' }} />
            </div>
          <div>
              <Title level={3} style={{ margin: 0, color: '#1e293b' }}>
                Admin Paneli - Genel Bakış
            </Title>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                Hoş geldiniz, Test Admin. Sistem durumunu ve istatistikleri görüntüleyin.
            </Text>
            </div>
          </div>
        ),
        breadcrumb: {},
      }}
    >
      <div className="admin-overview-container">
        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          {stats.map((stat, index) => (
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
                    <div className="stat-change" style={{ 
                      color: stat.changeType === 'increase' ? '#10b981' : '#ef4444',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {stat.change}
                    </div>
                  </div>
      </div>
                <div className="stat-card-overlay"></div>
            </Card>
          </Col>
        ))}
      </Row>

        <Row gutter={[16, 16]} className="mb-6">
      {/* System Health */}
        <Col xs={24} lg={12}>
            <ProCard
              title={
                <div className="flex items-center space-x-2">
                  <RiseOutlined style={{ color: '#10b981', fontSize: '18px' }} />
                  <span style={{ color: '#1e293b', fontWeight: 600 }}>Sistem Sağlığı</span>
                </div>
              }
              className="health-card"
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0'
              }}
            >
              <div className="health-metrics">
                <div className="health-item">
                  <div className="health-label">
                    <span>Genel Sağlık</span>
                    <span className="health-percentage">92%</span>
              </div>
                  <Progress 
                    percent={92} 
                    strokeColor={{
                      '0%': '#10b981',
                      '100%': '#059669',
                    }}
                    size={[8, 8]}
                    showInfo={false}
                    className="health-progress"
                  />
                </div>
                <Divider style={{ margin: '16px 0' }} />
                <div className="health-item">
                  <div className="health-label">
                    <span>Uptime</span>
                    <span className="health-percentage">99.8%</span>
              </div>
                  <Progress 
                    percent={99.8} 
                    strokeColor={{
                      '0%': '#3b82f6',
                      '100%': '#1d4ed8',
                    }}
                    size={[8, 8]}
                    showInfo={false}
                    className="health-progress"
                  />
                </div>
              </div>
            </ProCard>
        </Col>

          {/* Quick Actions */}
        <Col xs={24} lg={12}>
            <ProCard
              title={
                <div className="flex items-center space-x-2">
                  <BellOutlined style={{ color: '#8b5cf6', fontSize: '18px' }} />
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
              <List
                dataSource={quickActions}
                renderItem={(item, index) => (
                  <List.Item 
                    className="action-item"
                    style={{
                      padding: '12px 0',
                      borderBottom: index < quickActions.length - 1 ? '1px solid #f1f5f9' : 'none'
                    }}
                  >
                    <div className="action-content">
                      <div className="action-icon" style={{ background: item.gradient }}>
                        {item.icon}
              </div>
                      <div className="action-info">
                        <div className="action-title">{item.title}</div>
                        <div className="action-description">{item.description}</div>
                </div>
                      <Button 
                        type="text" 
                        icon={<ArrowRightOutlined />}
                        className="action-button"
                        style={{ color: item.color }}
                      />
              </div>
                  </List.Item>
                )}
              />
            </ProCard>
        </Col>
      </Row>

        {/* Recent Activities */}
        <Row>
          <Col span={24}>
            <ProCard
              title={
                <div className="flex items-center space-x-2">
                  <ClockCircleOutlined style={{ color: '#f59e0b', fontSize: '18px' }} />
                  <span style={{ color: '#1e293b', fontWeight: 600 }}>Son Aktiviteler</span>
                </div>
              }
              className="activities-card"
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0'
              }}
            >
              <List
                dataSource={transformedActivities}
                renderItem={(item, index) => (
                  <List.Item 
                    className="activity-item"
                    style={{
                      padding: '16px 0',
                      borderBottom: index < transformedActivities.length - 1 ? '1px solid #f1f5f9' : 'none'
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={item.icon}
                          style={{ 
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            border: '2px solid #e2e8f0'
                          }}
                        />
                      }
                      title={
                        <div className="activity-title">
                          <span>{item.title}</span>
                          <Tag color={item.statusColor} className="activity-status">
                            {item.status}
                          </Tag>
                        </div>
                      }
                      description={
                        <div className="activity-time">
                          <ClockCircleOutlined style={{ marginRight: '4px' }} />
                          {item.time}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </ProCard>
        </Col>
      </Row>

        {/* System Resources */}
        <Row gutter={[16, 16]} className="mb-6" style={{ marginTop: '32px' }}>
          <Col span={24}>
            <ProCard
              title={
                <div className="flex items-center space-x-2">
                  <DesktopOutlined style={{ color: '#6366f1', fontSize: '18px' }} />
                  <span style={{ color: '#1e293b', fontWeight: 600 }}>Sistem Kaynak Kullanımı</span>
                </div>
              }
              className="resources-card"
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0',
                padding: '24px'
              }}
            >
              <Row gutter={[16, 16]}>
                {transformedSystemResources.map((resource, index) => (
                  <Col xs={24} sm={12} lg={6} key={index}>
                    <div className="resource-item">
                      <div className="resource-header">
                        <div className="resource-info">
                          <div className="resource-icon" style={{ color: resource.color }}>
                            {resource.icon}
                          </div>
                          <div>
                            <div className="resource-name">{resource.name}</div>
                            <div className="resource-status" style={{ color: resource.color }}>
                              {resource.status}
                            </div>
                          </div>
                        </div>
                        <div className="resource-value" style={{ color: resource.color }}>
                          {resource.value}%
                        </div>
                      </div>
                      <Progress 
                        percent={resource.value} 
                        strokeColor={resource.color}
                        size={[6, 6]}
                        showInfo={false}
                        className="resource-progress"
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </ProCard>
          </Col>
        </Row>

        <style jsx>{`
          .admin-overview-container {
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
          
          .health-card, .actions-card, .activities-card {
            transition: all 0.3s ease;
          }
          
          .health-card:hover, .actions-card:hover, .activities-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
          }
          
          .health-metrics {
            padding: 8px 0;
          }
          
          .health-item {
            margin-bottom: 16px;
          }
          
          .health-label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-weight: 500;
            color: #374151;
          }
          
          .health-percentage {
            font-weight: bold;
            color: #10b981;
          }
          
          .health-progress {
            border-radius: 4px;
          }
          
          .action-item {
            transition: all 0.3s ease;
          }
          
          .action-item:hover {
            background: rgba(59, 130, 246, 0.05);
            border-radius: 8px;
            margin: 0 -8px;
            padding: 12px 8px !important;
          }
          
          .action-content {
            display: flex;
            align-items: center;
            width: 100%;
          }
          
          .action-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            color: white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }
          
          .action-info {
            flex: 1;
          }
          
          .action-title {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 2px;
          }
          
          .action-description {
            font-size: 12px;
            color: #64748b;
          }
          
          .action-button {
            transition: all 0.3s ease;
          }
          
          .action-button:hover {
            transform: translateX(4px);
          }
          
          .activity-item {
            transition: all 0.3s ease;
          }
          
          .activity-item:hover {
            background: rgba(59, 130, 246, 0.05);
            border-radius: 8px;
            margin: 0 -8px;
            padding: 16px 8px !important;
          }
          
          .activity-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 500;
            color: #1e293b;
          }
          
          .activity-status {
            font-size: 11px;
            font-weight: 600;
            border-radius: 6px;
          }
          
          .activity-time {
            color: #64748b;
            font-size: 12px;
            display: flex;
            align-items: center;
          }

          /* System Resources Styles */
          .resources-card {
            transition: all 0.3s ease;
          }
          
          .resources-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
          }
          
          .resource-item {
            padding: 20px;
            border-radius: 12px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
            margin-bottom: 8px;
          }
          
          .resource-item:hover {
            background: white;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            transform: translateY(-2px);
          }
          
          .resource-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }
          
          .resource-info {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          
          .resource-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(59, 130, 246, 0.1);
          }
          
          .resource-name {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 2px;
          }
          
          .resource-status {
            font-size: 12px;
            font-weight: 500;
          }
          
          .resource-value {
            font-weight: bold;
            font-size: 18px;
          }
          
          .resource-progress {
            border-radius: 4px;
          }
          
          @media (max-width: 768px) {
            .stat-value {
              font-size: 24px;
            }
            
            .stat-title {
              font-size: 12px;
            }
            
            .action-content {
              flex-direction: column;
              align-items: flex-start;
            }
            
            .action-icon {
              margin-bottom: 8px;
              margin-right: 0;
            }
          }
        `}</style>
      </div>
    </PageContainer>
  )
} 