'use client'

import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Spin, Alert, Typography } from 'antd'
import { 
  UserOutlined, 
  BankOutlined, 
  ThunderboltOutlined, 
  AlertOutlined,
  TeamOutlined,
  DashboardOutlined
} from '@ant-design/icons'
import { App } from 'antd'

const { Title } = Typography

interface DashboardStats {
  tenantName: string
  userCount: number
  departmentCount: number
  facilityCount: number
  meterCount: number
  totalConsumption: number
  activeAlerts: number
  subscriptionStatus: string
  subscriptionEndDate: string
}

interface ConsumptionChartData {
  month: string
  consumption: number
  target: number
}

interface FacilityDistributionData {
  name: string
  consumption: number
  color: string
}

interface AlertData {
  id: number
  facility: string
  type: string
  severity: string
  time: string
  status: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5143/api'

export default function TenantDashboardPage() {
  const { message } = App.useApp()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [consumptionData, setConsumptionData] = useState<ConsumptionChartData[]>([])
  const [facilityData, setFacilityData] = useState<FacilityDistributionData[]>([])
  const [alertsData, setAlertsData] = useState<AlertData[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('Token bulunamadı')
        return
      }

      // Fetch dashboard stats
      const statsResponse = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!statsResponse.ok) {
        throw new Error('Dashboard istatistikleri alınamadı')
      }

      const stats = await statsResponse.json()
      setDashboardStats(stats)

      // Fetch consumption chart data
      const chartResponse = await fetch(`${API_BASE_URL}/dashboard/consumption-chart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (chartResponse.ok) {
        const chartData = await chartResponse.json()
        setConsumptionData(chartData)
      }

      // Fetch facility distribution data
      const facilityResponse = await fetch(`${API_BASE_URL}/dashboard/facility-distribution`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (facilityResponse.ok) {
        const facilityChartData = await facilityResponse.json()
        setFacilityData(facilityChartData)
      }

      // Fetch recent alerts
      const alertsResponse = await fetch(`${API_BASE_URL}/dashboard/recent-alerts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (alertsResponse.ok) {
        const alerts = await alertsResponse.json()
        setAlertsData(alerts)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata oluştu')
      console.error('Dashboard data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const alertColumns = [
    {
      title: 'Tesis',
      dataIndex: 'facility',
      key: 'facility',
    },
    {
      title: 'Tip',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Önem',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => (
        <Tag color={severity === 'Kritik' ? 'red' : 'orange'}>
          {severity}
        </Tag>
      ),
    },
    {
      title: 'Zaman',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Aktif' ? 'red' : 'green'}>
          {status}
        </Tag>
      ),
    },
  ]

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Dashboard yükleniyor...</div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert
        message="Hata"
        description={error}
        type="error"
        showIcon
        style={{ margin: '16px' }}
      />
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Tenant Dashboard</Title>
      
      {dashboardStats && (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Kullanıcı Sayısı"
                  value={dashboardStats.userCount}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Departman Sayısı"
                  value={dashboardStats.departmentCount}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tesis Sayısı"
                  value={dashboardStats.facilityCount}
                  prefix={<BankOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Sayaç Sayısı"
                  value={dashboardStats.meterCount}
                  prefix={<ThunderboltOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Aylık Tüketim (kWh)"
                  value={dashboardStats.totalConsumption}
                  prefix={<ThunderboltOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Aktif Uyarılar"
                  value={dashboardStats.activeAlerts}
                  prefix={<AlertOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Abonelik Durumu"
                  value={dashboardStats.subscriptionStatus}
                  prefix={<DashboardOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Son Uyarılar" style={{ height: '400px' }}>
            <Table
              dataSource={alertsData}
              columns={alertColumns}
              pagination={false}
              size="small"
              scroll={{ y: 300 }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Tesis Dağılımı" style={{ height: '400px' }}>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p>Tesis dağılım grafiği burada gösterilecek</p>
              {facilityData.map((facility, index) => (
                <div key={index} style={{ marginBottom: '8px' }}>
                  <span style={{ color: facility.color }}>●</span> {facility.name}: {facility.consumption} kWh
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
} 