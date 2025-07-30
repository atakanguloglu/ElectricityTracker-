'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Switch, 
  Button, 
  Space,
  Alert,
  Progress,
  Timeline,
  Tag,
  Statistic,
  message,
  Divider
} from 'antd'
import { 
  SecurityScanOutlined,
  SafetyOutlined,
  LockOutlined,
  EyeOutlined,
  KeyOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { getUser, isAdmin, getFullName } from '@/utils/auth'
import { logger } from '@/utils/logger'

const { Title, Text, Paragraph } = Typography

export default function AdminSecurityPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordPolicy: true,
    sessionTimeout: true,
    ipWhitelist: false,
    auditLogging: true,
    sslEnforcement: true,
    rateLimiting: true,
    backupEncryption: true
  })
  const router = useRouter()

  // Mock security events
  const securityEvents = [
    {
      id: 1,
      type: 'login_attempt',
      severity: 'medium',
      message: 'Başarısız giriş denemesi tespit edildi',
      timestamp: '2024-01-15 10:30:25',
      ipAddress: '192.168.1.101',
      userAgent: 'Chrome/120.0.0.0',
      status: 'resolved'
    },
    {
      id: 2,
      type: 'suspicious_activity',
      severity: 'high',
      message: 'Şüpheli IP adresinden erişim denemesi',
      timestamp: '2024-01-15 09:15:10',
      ipAddress: '203.0.113.45',
      userAgent: 'Unknown',
      status: 'investigating'
    },
    {
      id: 3,
      type: 'password_change',
      severity: 'low',
      message: 'Kullanıcı şifresi başarıyla değiştirildi',
      timestamp: '2024-01-15 08:45:30',
      ipAddress: '192.168.1.100',
      userAgent: 'Firefox/121.0',
      status: 'resolved'
    },
    {
      id: 4,
      type: 'admin_action',
      severity: 'low',
      message: 'Yeni tenant oluşturuldu',
      timestamp: '2024-01-15 08:20:15',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome/120.0.0.0',
      status: 'resolved'
    },
    {
      id: 5,
      type: 'system_alert',
      severity: 'medium',
      message: 'Sistem yedekleme tamamlandı',
      timestamp: '2024-01-15 07:30:00',
      ipAddress: 'System',
      userAgent: 'System',
      status: 'resolved'
    }
  ]

  useEffect(() => {
    const currentUser = getUser()
    
    if (!currentUser) {
      message.error('Oturum bulunamadı. Lütfen giriş yapın.')
      router.push('/login')
      return
    }

    if (!isAdmin()) {
      message.error('Bu sayfaya erişim yetkiniz yok.')
      router.push('/dashboard')
      return
    }

    setUser(currentUser)
    setLoading(false)
    
    // Log admin security page access
    logger.info('Admin security page accessed', 'AdminSecurityPage', {
      userId: currentUser.id,
      userEmail: currentUser.email
    })
  }, [router])

  const handleSettingChange = (setting: string, value: boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }))
    message.success(`${setting === 'twoFactorAuth' ? 'İki faktörlü kimlik doğrulama' : 
                    setting === 'passwordPolicy' ? 'Şifre politikası' :
                    setting === 'sessionTimeout' ? 'Oturum zaman aşımı' :
                    setting === 'ipWhitelist' ? 'IP beyaz listesi' :
                    setting === 'auditLogging' ? 'Denetim günlüğü' :
                    setting === 'sslEnforcement' ? 'SSL zorunluluğu' :
                    setting === 'rateLimiting' ? 'Hız sınırlama' :
                    'Yedekleme şifreleme'} ${value ? 'etkinleştirildi' : 'devre dışı bırakıldı'}`)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'red'
      case 'medium':
        return 'orange'
      case 'low':
        return 'green'
      default:
        return 'default'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <WarningOutlined />
      case 'medium':
        return <ClockCircleOutlined />
      case 'low':
        return <CheckCircleOutlined />
      default:
        return <ClockCircleOutlined />
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'login_attempt':
        return <KeyOutlined />
      case 'suspicious_activity':
        return <WarningOutlined />
      case 'password_change':
        return <LockOutlined />
      case 'admin_action':
        return <SafetyCertificateOutlined />
      case 'system_alert':
        return <SafetyOutlined />
      default:
        return <EyeOutlined />
    }
  }

  const securityStats = {
    totalEvents: securityEvents.length,
    highSeverity: securityEvents.filter(e => e.severity === 'high').length,
    resolved: securityEvents.filter(e => e.status === 'resolved').length,
    investigating: securityEvents.filter(e => e.status === 'investigating').length
  }

  const securityScore = 85 // Mock security score

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <Title level={2} className="mb-2 flex items-center">
          <SecurityScanOutlined className="mr-3 text-blue-600" />
          Güvenlik Merkezi
        </Title>
        <Text className="text-gray-600">
          Sistem güvenliği ve tehdit izleme merkezi
        </Text>
      </div>

      {/* Security Score */}
      <Card className="mb-6 shadow-lg border-0">
        <div className="text-center">
          <Title level={3} className="mb-4">Güvenlik Skoru</Title>
          <Progress
            type="circle"
            percent={securityScore}
            size={120}
            strokeColor={{
              '0%': '#ff4d4f',
              '50%': '#faad14',
              '100%': '#52c41a',
            }}
            format={(percent) => `${percent}/100`}
          />
          <div className="mt-4">
            <Text className="text-lg">
              {securityScore >= 80 ? 'Mükemmel' : 
               securityScore >= 60 ? 'İyi' : 
               securityScore >= 40 ? 'Orta' : 'Kritik'}
            </Text>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <Card className="text-center shadow-sm border-l-4 border-l-blue-500">
            <Statistic
              title="Toplam Olay"
              value={securityStats.totalEvents}
              valueStyle={{ color: '#3b82f6' }}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center shadow-sm border-l-4 border-l-red-500">
            <Statistic
              title="Yüksek Öncelik"
              value={securityStats.highSeverity}
              valueStyle={{ color: '#ef4444' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center shadow-sm border-l-4 border-l-green-500">
            <Statistic
              title="Çözüldü"
              value={securityStats.resolved}
              valueStyle={{ color: '#22c55e' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center shadow-sm border-l-4 border-l-orange-500">
            <Statistic
              title="İnceleniyor"
              value={securityStats.investigating}
              valueStyle={{ color: '#f97316' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Security Settings */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div className="flex items-center">
                <SafetyOutlined className="mr-2 text-blue-600" />
                Güvenlik Ayarları
              </div>
            }
            className="shadow-lg border-0"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Text className="font-semibold">İki Faktörlü Kimlik Doğrulama</Text>
                  <div className="text-sm text-gray-500">Kullanıcılar için 2FA zorunluluğu</div>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Text className="font-semibold">Şifre Politikası</Text>
                  <div className="text-sm text-gray-500">Güçlü şifre zorunluluğu</div>
                </div>
                <Switch
                  checked={securitySettings.passwordPolicy}
                  onChange={(checked) => handleSettingChange('passwordPolicy', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Text className="font-semibold">Oturum Zaman Aşımı</Text>
                  <div className="text-sm text-gray-500">30 dakika inaktiflik sonrası çıkış</div>
                </div>
                <Switch
                  checked={securitySettings.sessionTimeout}
                  onChange={(checked) => handleSettingChange('sessionTimeout', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Text className="font-semibold">IP Beyaz Listesi</Text>
                  <div className="text-sm text-gray-500">Sadece izinli IP'lerden erişim</div>
                </div>
                <Switch
                  checked={securitySettings.ipWhitelist}
                  onChange={(checked) => handleSettingChange('ipWhitelist', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Text className="font-semibold">Denetim Günlüğü</Text>
                  <div className="text-sm text-gray-500">Tüm işlemlerin kaydedilmesi</div>
                </div>
                <Switch
                  checked={securitySettings.auditLogging}
                  onChange={(checked) => handleSettingChange('auditLogging', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Text className="font-semibold">SSL Zorunluluğu</Text>
                  <div className="text-sm text-gray-500">HTTPS bağlantı zorunluluğu</div>
                </div>
                <Switch
                  checked={securitySettings.sslEnforcement}
                  onChange={(checked) => handleSettingChange('sslEnforcement', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Text className="font-semibold">Hız Sınırlama</Text>
                  <div className="text-sm text-gray-500">API istek hızı sınırlaması</div>
                </div>
                <Switch
                  checked={securitySettings.rateLimiting}
                  onChange={(checked) => handleSettingChange('rateLimiting', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Text className="font-semibold">Yedekleme Şifreleme</Text>
                  <div className="text-sm text-gray-500">Veritabanı yedeklerinin şifrelenmesi</div>
                </div>
                <Switch
                  checked={securitySettings.backupEncryption}
                  onChange={(checked) => handleSettingChange('backupEncryption', checked)}
                />
              </div>
            </div>
          </Card>
        </Col>

        {/* Security Events */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div className="flex items-center">
                <SafetyCertificateOutlined className="mr-2 text-green-600" />
                Güvenlik Olayları
              </div>
            }
            className="shadow-lg border-0"
          >
            <Timeline
              items={securityEvents.map(event => ({
                color: getSeverityColor(event.severity),
                children: (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getEventTypeIcon(event.type)}
                        <Text className="font-semibold">{event.message}</Text>
                      </div>
                      <Tag color={getSeverityColor(event.severity)} icon={getSeverityIcon(event.severity)}>
                        {event.severity === 'high' ? 'Yüksek' : 
                         event.severity === 'medium' ? 'Orta' : 'Düşük'}
                      </Tag>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>IP: {event.ipAddress}</div>
                      <div>Zaman: {event.timestamp}</div>
                      <div>Durum: {event.status === 'resolved' ? 'Çözüldü' : 'İnceleniyor'}</div>
                    </div>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* Security Alerts */}
      <Card className="mt-6 shadow-lg border-0">
        <Title level={4} className="mb-4">Güvenlik Uyarıları</Title>
        <div className="space-y-4">
          <Alert
            message="Yüksek Öncelikli Güvenlik Uyarısı"
            description="Şüpheli IP adresinden (203.0.113.45) erişim denemesi tespit edildi. Bu IP adresi kara listede bulunuyor."
            type="error"
            showIcon
            action={
              <Button size="small" danger>
                İncele
              </Button>
            }
          />
          <Alert
            message="Orta Öncelikli Güvenlik Uyarısı"
            description="Son 24 saatte 15 başarısız giriş denemesi tespit edildi. Şifre politikasını gözden geçirmenizi öneririz."
            type="warning"
            showIcon
            action={
              <Button size="small">
                Ayarları Kontrol Et
              </Button>
            }
          />
          <Alert
            message="Bilgilendirme"
            description="Sistem güvenlik taraması başarıyla tamamlandı. Tüm güvenlik önlemleri aktif durumda."
            type="success"
            showIcon
          />
        </div>
      </Card>
    </div>
  )
} 