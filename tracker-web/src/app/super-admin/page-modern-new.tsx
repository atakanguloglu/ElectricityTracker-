'use client'

import React from 'react'
import { Card, Row, Col, Statistic, Progress, List, Tag, Typography, Spin, Alert } from 'antd'
import {
  TeamOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  DesktopOutlined,
  HddOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  FileTextOutlined,
  RiseOutlined,
} from '@ant-design/icons'
import { useDashboardStats } from '@/hooks/useAnalytics'
import { useSystemResources, useErrorLogs, useActiveSessions } from '@/hooks/useMonitoring'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/tr'

dayjs.extend(relativeTime)
dayjs.locale('tr')

const { Title, Text } = Typography

export default function SuperAdminDashboard() {
  // React Query hooks
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats()
  const { data: resources, isLoading: resourcesLoading } = useSystemResources()
  const { data: errorLogs, isLoading: logsLoading } = useErrorLogs(10)
  const { data: activeSessions } = useActiveSessions()

  const getProgressColor = (value: number) => {
    if (value < 50) return '#52c41a'
    if (value < 75) return '#faad14'
    return '#f5222d'
  }

  const getLogLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      Error: 'red',
      Warning: 'orange',
      Info: 'blue',
      Debug: 'default',
    }
    return colors[level] || 'default'
  }

  if (statsError) {
    return (
      <Alert
        message="Hata"
        description="Dashboard verileri yüklenirken bir hata oluştu."
        type="error"
        showIcon
      />
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <ThunderboltOutlined style={{ marginRight: 12, color: '#6366f1' }} />
          SuperAdmin Dashboard
        </Title>
        <Text type="secondary">Sistem genel bakış ve özet bilgiler</Text>
      </div>

      {/* Main Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={statsLoading}>
            <Statistic
              title="Toplam Tenant"
              value={stats?.totalTenants || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#6366f1' }}
              suffix={
                <span style={{ fontSize: 14, color: '#888' }}>
                  / {stats?.activeTenants || 0} aktif
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={statsLoading}>
            <Statistic
              title="Toplam Kullanıcı"
              value={stats?.totalUsers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#10b981' }}
              suffix={
                <span style={{ fontSize: 14, color: '#888' }}>
                  / {stats?.activeUsers || 0} aktif
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={statsLoading}>
            <Statistic
              title="Sistem Sağlığı"
              value={stats?.systemHealth || 0}
              prefix={<CheckCircleOutlined />}
              suffix="%"
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={statsLoading}>
            <Statistic
              title="Aktif Oturum"
              value={activeSessions?.length || 0}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#8b5cf6' }}
            />
          </Card>
        </Col>
      </Row>

      {/* System Resources */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <DesktopOutlined style={{ marginRight: 8 }} />
                Sistem Kaynakları
              </span>
            }
            loading={resourcesLoading}
          >
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>CPU Kullanımı</Text>
                <Text strong>{resources?.cpuUsage || 0}%</Text>
              </div>
              <Progress
                percent={resources?.cpuUsage || 0}
                strokeColor={getProgressColor(resources?.cpuUsage || 0)}
                showInfo={false}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>RAM Kullanımı</Text>
                <Text strong>{resources?.memoryUsage || 0}%</Text>
              </div>
              <Progress
                percent={resources?.memoryUsage || 0}
                strokeColor={getProgressColor(resources?.memoryUsage || 0)}
                showInfo={false}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Disk Kullanımı</Text>
                <Text strong>{resources?.diskUsage || 0}%</Text>
              </div>
              <Progress
                percent={resources?.diskUsage || 0}
                strokeColor={getProgressColor(resources?.diskUsage || 0)}
                showInfo={false}
              />
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="DB Bağlantıları"
                    value={resources?.databaseConnections || 0}
                    prefix={<DatabaseOutlined />}
                    valueStyle={{ fontSize: 20 }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="Network"
                    value={resources?.networkUsage || 0}
                    suffix="MB/s"
                    prefix={<RiseOutlined />}
                    valueStyle={{ fontSize: 20 }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <FileTextOutlined style={{ marginRight: 8 }} />
                Son Hatalar
              </span>
            }
            loading={logsLoading}
            extra={<Tag color="red">{errorLogs?.length || 0} hata</Tag>}
          >
            <List
              size="small"
              dataSource={errorLogs || []}
              locale={{ emptyText: 'Hata bulunamadı' }}
              renderItem={(log: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Tag color={getLogLevelColor(log.level)}>
                        {log.level}
                      </Tag>
                    }
                    title={
                      <Text ellipsis style={{ maxWidth: 400 }}>
                        {log.message}
                      </Text>
                    }
                    description={
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {log.source} · {dayjs(log.timestamp).fromNow()}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Bugünkü Loglar"
              value={stats?.todayLogs || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Loglar"
              value={stats?.totalLogs || 0}
              prefix={<HddOutlined />}
              valueStyle={{ color: '#8b5cf6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Güvenlik Skoru"
              value={stats?.securityScore || 0}
              suffix="/100"
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Aylık Gelir"
              value={stats?.monthlyRevenue || 0}
              prefix="₺"
              precision={2}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

