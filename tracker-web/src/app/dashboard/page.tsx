'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Row, Col, Card, Statistic, Progress, Table, Tag, Button, Space, Typography, Alert, Avatar } from 'antd'
import { 
  ThunderboltOutlined, 
  RiseOutlined, 
  AlertOutlined, 
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  DownloadOutlined,
  CrownOutlined,
  UserOutlined,
  BuildOutlined
} from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import MainLayout from '@/components/MainLayout'
import { getUser, isAdmin, isManager, getTenantId, getFullName } from '@/utils/auth'

const { Title, Text } = Typography

// Mock data for charts
const consumptionData = [
  { name: 'Ocak', tüketim: 1200, hedef: 1000 },
  { name: 'Şubat', tüketim: 1100, hedef: 1000 },
  { name: 'Mart', tüketim: 1300, hedef: 1000 },
  { name: 'Nisan', tüketim: 900, hedef: 1000 },
  { name: 'Mayıs', tüketim: 1050, hedef: 1000 },
  { name: 'Haziran', tüketim: 1150, hedef: 1000 },
]

const facilityData = [
  { name: 'Ana Bina', value: 45, color: '#3b82f6' },
  { name: 'Depo', value: 25, color: '#10b981' },
  { name: 'Üretim', value: 20, color: '#f59e0b' },
  { name: 'Ofis', value: 10, color: '#ef4444' },
]

const alertsData = [
  {
    key: '1',
    facility: 'Ana Bina',
    type: 'Yüksek Tüketim',
    severity: 'Kritik',
    time: '2 saat önce',
    status: 'Aktif'
  },
  {
    key: '2',
    facility: 'Depo',
    type: 'Anormal Kullanım',
    severity: 'Uyarı',
    time: '5 saat önce',
    status: 'Çözüldü'
  },
  {
    key: '3',
    facility: 'Üretim',
    type: 'Ekipman Arızası',
    severity: 'Kritik',
    time: '1 gün önce',
    status: 'Aktif'
  },
]

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5143/api'

// Types
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

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [consumptionData, setConsumptionData] = useState<ConsumptionChartData[]>([])
  const [facilityData, setFacilityData] = useState<FacilityDistributionData[]>([])
  const [alertsData, setAlertsData] = useState<AlertData[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = getUser()
    setUser(currentUser)
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('token')
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
    {
      title: 'İşlemler',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>
            Görüntüle
          </Button>
        </Space>
      ),
    },
  ]

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <Alert
          message="Hata"
          description={error}
          type="error"
          showIcon
          className="mb-6"
        />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      {/* Welcome Message */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <Title level={2} className="mb-2">
              Hoş Geldiniz, {getFullName()}!
            </Title>
            <Text className="text-gray-600">
              Elektrik tüketim durumunuzu takip edin ve optimize edin.
            </Text>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-800">
                {user?.tenantName}
              </div>
              <div className="text-xs text-gray-500">
                Tenant ID: {getTenantId()}
              </div>
            </div>
            <Avatar 
              size="large" 
              icon={isAdmin() ? <CrownOutlined /> : <UserOutlined />}
              className="bg-gradient-to-r from-blue-500 to-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Role-based Quick Actions */}
      {(isAdmin() || isManager()) && (
        <Alert
          message="Yönetici Yetkileri"
          description={
            <div className="flex items-center justify-between">
              <span>Yönetici yetkilerinizle ek işlemler yapabilirsiniz.</span>
              <Space>
                <Button size="small" icon={<BuildOutlined />}>
                  Tesis Yönetimi
                </Button>
                <Button size="small" icon={<UserOutlined />}>
                  Kullanıcı Yönetimi
                </Button>
              </Space>
            </div>
          }
          type="info"
          showIcon
          className="mb-6"
        />
      )}

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Toplam Tüketim"
              value={dashboardStats?.totalConsumption || 0}
              suffix="kWh"
              prefix={<ThunderboltOutlined className="text-blue-500" />}
              valueStyle={{ color: '#3b82f6' }}
            />
            <div className="mt-2">
              <Text type="secondary" className="text-sm">
                Bu ay
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Kullanıcı Sayısı"
              value={dashboardStats?.userCount || 0}
              prefix={<UserOutlined className="text-green-500" />}
              valueStyle={{ color: '#10b981' }}
            />
            <div className="mt-2">
              <Text type="secondary" className="text-sm">
                Aktif kullanıcılar
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Tesis Sayısı"
              value={dashboardStats?.facilityCount || 0}
              prefix={<BuildOutlined className="text-orange-500" />}
              valueStyle={{ color: '#f59e0b' }}
            />
            <div className="mt-2">
              <Text type="secondary" className="text-sm">
                Toplam tesis
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Aktif Uyarılar"
              value={dashboardStats?.activeAlerts || 0}
              prefix={<AlertOutlined className="text-red-500" />}
              valueStyle={{ color: '#ef4444' }}
            />
            <div className="mt-2">
              <Text type="secondary" className="text-sm">
                Kritik seviyede
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={16}>
          <Card 
            title="Aylık Tüketim Grafiği" 
            extra={
              <Space>
                <Button size="small" icon={<DownloadOutlined />}>
                  İndir
                </Button>
              </Space>
            }
            className="shadow-sm"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={consumptionData.length > 0 ? consumptionData : []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Tüketim"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Hedef"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Tesis Bazlı Dağılım" className="shadow-sm">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={facilityData.length > 0 ? facilityData : []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="consumption"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {facilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Alerts and Quick Actions */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            title="Son Uyarılar" 
            extra={
              <Button type="link" size="small">
                Tümünü Görüntüle
              </Button>
            }
            className="shadow-sm"
          >
            <Table 
              columns={alertColumns} 
              dataSource={alertsData.length > 0 ? alertsData : []} 
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Hızlı İşlemler" className="shadow-sm">
            <Space direction="vertical" className="w-full">
              <Button type="primary" block icon={<ThunderboltOutlined />}>
                Tüketim Raporu Oluştur
              </Button>
              <Button block icon={<AlertOutlined />}>
                Uyarı Ayarları
              </Button>
              <Button block icon={<RiseOutlined />}>
                Verimlilik Analizi
              </Button>
              <Button block icon={<DownloadOutlined />}>
                Veri Dışa Aktar
              </Button>
              
              {/* Role-based actions */}
              {(isAdmin() || isManager()) && (
                <>
                  <Button block icon={<BuildOutlined />}>
                    Tesis Yönetimi
                  </Button>
                  <Button block icon={<UserOutlined />}>
                    Kullanıcı Yönetimi
                  </Button>
                </>
              )}
              
              {isAdmin() && (
                <Button 
                  block 
                  icon={<CrownOutlined />} 
                  type="dashed"
                  onClick={() => router.push('/admin')}
                >
                  Admin Paneli
                </Button>
              )}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* System Status */}
      <Row className="mt-6">
        <Col span={24}>
          <Alert
            message="Sistem Durumu"
            description="Tüm sistemler normal çalışıyor. Son güncelleme: 2 dakika önce"
            type="success"
            showIcon
            className="shadow-sm"
          />
        </Col>
      </Row>
    </MainLayout>
  )
} 