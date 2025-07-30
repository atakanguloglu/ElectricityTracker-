'use client'

import React from 'react'
import { Card, Row, Col, Progress, Button, Tag, List, Avatar, Typography, Divider } from 'antd'
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
  BellOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

export default function AdminOverviewPage() {
  // Mock data
  const stats = [
    {
      title: 'Toplam Tenant',
      value: 12,
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
    },
    {
      title: 'Aktif Kullanıcı',
      value: 156,
      icon: <UserOutlined style={{ fontSize: '24px', color: '#10b981' }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)'
    },
    {
      title: 'Toplam Log',
      value: '2,847',
      icon: <FileTextOutlined style={{ fontSize: '24px', color: '#8b5cf6' }} />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    },
    {
      title: 'Güvenlik Skoru',
      value: '85/100',
      icon: <SafetyOutlined style={{ fontSize: '24px', color: '#f59e0b' }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    }
  ]

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

  const recentActivities = [
    {
      title: 'Yeni tenant oluşturuldu: ABC Şirketi',
      time: '2 saat önce',
      status: 'Tamamlandı',
      statusColor: 'success',
      icon: <CheckCircleOutlined style={{ color: '#10b981' }} />
    },
    {
      title: 'Sistem güncellemesi tamamlandı',
      time: '4 saat önce',
      status: 'Tamamlandı',
      statusColor: 'success',
      icon: <CheckCircleOutlined style={{ color: '#10b981' }} />
    },
    {
      title: 'Güvenlik taraması başlatıldı',
      time: '6 saat önce',
      status: 'Devam Ediyor',
      statusColor: 'processing',
      icon: <ClockCircleOutlined style={{ color: '#3b82f6' }} />
    },
    {
      title: 'Yüksek öncelikli log uyarısı',
      time: '8 saat önce',
      status: 'Uyarı',
      statusColor: 'warning',
      icon: <ExclamationCircleOutlined style={{ color: '#f59e0b' }} />
    }
  ]

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
                    strokeWidth={8}
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
                    strokeWidth={8}
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
                dataSource={recentActivities}
                renderItem={(item, index) => (
                  <List.Item 
                    className="activity-item"
                    style={{
                      padding: '16px 0',
                      borderBottom: index < recentActivities.length - 1 ? '1px solid #f1f5f9' : 'none'
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