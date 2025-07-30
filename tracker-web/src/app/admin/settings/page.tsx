'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Form,
  Input,
  Select,
  Switch,
  Button,
  Space,
  Divider,
  message,
  Alert
} from 'antd'
import { 
  SettingOutlined,
  SaveOutlined,
  ReloadOutlined,
  DatabaseOutlined,
  BellOutlined,
  SecurityScanOutlined,
  CloudOutlined,
  ToolOutlined
} from '@ant-design/icons'
import { getUser, isAdmin, getFullName } from '@/utils/auth'
import { logger } from '@/utils/logger'

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TextArea } = Input

export default function AdminSettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm()
  const [notificationForm] = Form.useForm()
  const [systemForm] = Form.useForm()
  const router = useRouter()

  // Mock system info
  const systemInfo = {
    version: '1.2.0',
    buildDate: '2024-01-15',
    database: 'PostgreSQL 15.2',
    uptime: '15 gün 8 saat 32 dakika',
    lastBackup: '2024-01-15 02:00:00',
    nextBackup: '2024-01-16 02:00:00'
  }

  // Mock settings data
  const initialSettings = {
    general: {
      siteName: 'Elektrik Takip Sistemi',
      siteDescription: 'Endüstriyel elektrik tüketimi takip ve analiz platformu',
      timezone: 'Europe/Istanbul',
      language: 'tr',
      maintenanceMode: false
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      alertThreshold: 80,
      dailyReports: true,
      weeklyReports: true,
      monthlyReports: false
    },
    system: {
      autoBackup: true,
      backupRetention: 30,
      logRetention: 90,
      maxFileSize: 10,
      sessionTimeout: 30,
      maxLoginAttempts: 5
    }
  }

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
    
    // Set initial form values
    form.setFieldsValue(initialSettings.general)
    notificationForm.setFieldsValue(initialSettings.notifications)
    systemForm.setFieldsValue(initialSettings.system)
    
    // Log admin settings page access
    logger.info('Admin settings page accessed', 'AdminSettingsPage', {
      userId: currentUser.id,
      userEmail: currentUser.email
    })
  }, [router, form, notificationForm, systemForm])

  const handleGeneralSave = async () => {
    try {
      const values = await form.validateFields()
      console.log('General settings:', values)
      message.success('Genel ayarlar başarıyla kaydedildi')
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }

  const handleNotificationSave = async () => {
    try {
      const values = await notificationForm.validateFields()
      console.log('Notification settings:', values)
      message.success('Bildirim ayarları başarıyla kaydedildi')
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }

  const handleSystemSave = async () => {
    try {
      const values = await systemForm.validateFields()
      console.log('System settings:', values)
      message.success('Sistem ayarları başarıyla kaydedildi')
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }

  const handleBackup = () => {
    message.info('Yedekleme işlemi başlatılıyor...')
  }

  const handleRestore = () => {
    message.info('Geri yükleme işlemi başlatılıyor...')
  }

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
          <SettingOutlined className="mr-3 text-blue-600" />
          Sistem Ayarları
        </Title>
        <Text className="text-gray-600">
          Sistem konfigürasyonu ve genel ayarları yönetin.
        </Text>
      </div>

      {/* System Info */}
      <Card title="Sistem Bilgileri" className="shadow-sm">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Text className="text-gray-600">Versiyon:</Text>
                <Text strong>{systemInfo.version}</Text>
              </div>
              <div className="flex justify-between">
                <Text className="text-gray-600">Derleme Tarihi:</Text>
                <Text>{systemInfo.buildDate}</Text>
              </div>
              <div className="flex justify-between">
                <Text className="text-gray-600">Veritabanı:</Text>
                <Text>{systemInfo.database}</Text>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Text className="text-gray-600">Çalışma Süresi:</Text>
                <Text>{systemInfo.uptime}</Text>
              </div>
              <div className="flex justify-between">
                <Text className="text-gray-600">Son Yedekleme:</Text>
                <Text>{systemInfo.lastBackup}</Text>
              </div>
              <div className="flex justify-between">
                <Text className="text-gray-600">Sonraki Yedekleme:</Text>
                <Text>{systemInfo.nextBackup}</Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {/* General Settings */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div className="flex items-center">
                <SettingOutlined className="mr-2 text-blue-600" />
                Genel Ayarlar
              </div>
            }
            className="shadow-sm"
            extra={
              <Button 
                type="primary" 
                icon={<SaveOutlined />}
                onClick={handleGeneralSave}
              >
                Kaydet
              </Button>
            }
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="siteName"
                label="Site Adı"
                rules={[{ required: true, message: 'Site adı gerekli' }]}
              >
                <Input placeholder="Site adını girin" />
              </Form.Item>

              <Form.Item
                name="siteDescription"
                label="Site Açıklaması"
              >
                <TextArea rows={2} placeholder="Site açıklamasını girin" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="timezone"
                    label="Zaman Dilimi"
                    rules={[{ required: true, message: 'Zaman dilimi seçin' }]}
                  >
                    <Select placeholder="Zaman dilimi seçin">
                      <Option value="Europe/Istanbul">İstanbul (UTC+3)</Option>
                      <Option value="Europe/London">Londra (UTC+0)</Option>
                      <Option value="America/New_York">New York (UTC-5)</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="language"
                    label="Dil"
                    rules={[{ required: true, message: 'Dil seçin' }]}
                  >
                    <Select placeholder="Dil seçin">
                      <Option value="tr">Türkçe</Option>
                      <Option value="en">English</Option>
                      <Option value="de">Deutsch</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="maintenanceMode"
                label="Bakım Modu"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Notification Settings */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div className="flex items-center">
                <BellOutlined className="mr-2 text-green-600" />
                Bildirim Ayarları
              </div>
            }
            className="shadow-sm"
            extra={
              <Button 
                type="primary" 
                icon={<SaveOutlined />}
                onClick={handleNotificationSave}
              >
                Kaydet
              </Button>
            }
          >
            <Form form={notificationForm} layout="vertical">
              <Form.Item
                name="emailNotifications"
                label="E-posta Bildirimleri"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="smsNotifications"
                label="SMS Bildirimleri"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="pushNotifications"
                label="Push Bildirimleri"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="alertThreshold"
                label="Uyarı Eşiği (%)"
                rules={[{ required: true, message: 'Uyarı eşiği gerekli' }]}
              >
                <Select placeholder="Eşik değeri seçin">
                  <Option value={70}>70%</Option>
                  <Option value={80}>80%</Option>
                  <Option value={90}>90%</Option>
                  <Option value={95}>95%</Option>
                </Select>
              </Form.Item>

              <Divider>Rapor Ayarları</Divider>

              <Form.Item
                name="dailyReports"
                label="Günlük Raporlar"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="weeklyReports"
                label="Haftalık Raporlar"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="monthlyReports"
                label="Aylık Raporlar"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* System Settings */}
      <Card 
        title={
          <div className="flex items-center">
            <ToolOutlined className="mr-2 text-purple-600" />
            Sistem Ayarları
          </div>
        }
        className="shadow-sm"
        extra={
          <Button 
            type="primary" 
            icon={<SaveOutlined />}
            onClick={handleSystemSave}
          >
            Kaydet
          </Button>
        }
      >
        <Form form={systemForm} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="autoBackup"
                label="Otomatik Yedekleme"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="backupRetention"
                label="Yedekleme Saklama Süresi (Gün)"
                rules={[{ required: true, message: 'Saklama süresi gerekli' }]}
              >
                <Select placeholder="Gün seçin">
                  <Option value={7}>7 gün</Option>
                  <Option value={30}>30 gün</Option>
                  <Option value={90}>90 gün</Option>
                  <Option value={365}>1 yıl</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="logRetention"
                label="Log Saklama Süresi (Gün)"
                rules={[{ required: true, message: 'Log saklama süresi gerekli' }]}
              >
                <Select placeholder="Gün seçin">
                  <Option value={30}>30 gün</Option>
                  <Option value={90}>90 gün</Option>
                  <Option value={180}>180 gün</Option>
                  <Option value={365}>1 yıl</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="maxFileSize"
                label="Maksimum Dosya Boyutu (MB)"
                rules={[{ required: true, message: 'Dosya boyutu gerekli' }]}
              >
                <Select placeholder="MB seçin">
                  <Option value={5}>5 MB</Option>
                  <Option value={10}>10 MB</Option>
                  <Option value={25}>25 MB</Option>
                  <Option value={50}>50 MB</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="sessionTimeout"
                label="Oturum Zaman Aşımı (Dakika)"
                rules={[{ required: true, message: 'Zaman aşımı gerekli' }]}
              >
                <Select placeholder="Dakika seçin">
                  <Option value={15}>15 dakika</Option>
                  <Option value={30}>30 dakika</Option>
                  <Option value={60}>1 saat</Option>
                  <Option value={120}>2 saat</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="maxLoginAttempts"
                label="Maksimum Giriş Denemesi"
                rules={[{ required: true, message: 'Giriş denemesi sayısı gerekli' }]}
              >
                <Select placeholder="Sayı seçin">
                  <Option value={3}>3 deneme</Option>
                  <Option value={5}>5 deneme</Option>
                  <Option value={10}>10 deneme</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Backup & Restore */}
      <Card 
        title={
          <div className="flex items-center">
            <CloudOutlined className="mr-2 text-orange-600" />
            Yedekleme ve Geri Yükleme
          </div>
        }
        className="shadow-sm"
      >
        <Alert
          message="Yedekleme Uyarısı"
          description="Yedekleme işlemi sistem performansını etkileyebilir. İşlem sırasında sistem yavaşlayabilir."
          type="warning"
          showIcon
          className="mb-4"
        />
        
        <Space>
          <Button 
            type="primary" 
            icon={<DatabaseOutlined />}
            onClick={handleBackup}
          >
            Manuel Yedekleme
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={handleRestore}
          >
            Geri Yükleme
          </Button>
        </Space>
      </Card>
    </div>
  )
} 