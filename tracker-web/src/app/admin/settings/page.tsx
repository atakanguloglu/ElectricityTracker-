'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Tabs,
  Space,
  Typography,
  Divider,
  Alert,
  Upload,
  Progress,
  Tag,
  Badge,
  Descriptions,
  Modal,
  message,
  App
} from 'antd';
import {
  SettingOutlined,
  MailOutlined,
  MessageOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  GlobalOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  ToolOutlined,
  SecurityScanOutlined,
  DatabaseOutlined,
  ApiOutlined,
  BellOutlined,
  FileTextOutlined,
  SaveOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  LockOutlined,
  UnlockOutlined,
  UploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  MinusOutlined,
  KeyOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  MonitorOutlined,
  ThunderboltOutlined,
  WifiOutlined,
  HddOutlined,
  DesktopOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Mock data
const mockSystemInfo = {
  version: '2.1.0',
  buildDate: '2024-01-15',
  uptime: '15 gün 8 saat 32 dakika',
  lastBackup: '2024-01-14 23:00:00',
  databaseSize: '2.4 GB',
  totalUsers: 1250,
  activeTenants: 45,
  systemHealth: 98
};

const mockBackups = [
  {
    id: 1,
    name: 'backup_2024_01_14_230000.zip',
    size: '2.4 GB',
    type: 'full',
    status: 'completed',
    createdAt: '2024-01-14 23:00:00',
    duration: '15 dakika'
  },
  {
    id: 2,
    name: 'backup_2024_01_13_230000.zip',
    size: '2.3 GB',
    type: 'full',
    status: 'completed',
    createdAt: '2024-01-13 23:00:00',
    duration: '14 dakika'
  },
  {
    id: 3,
    name: 'backup_2024_01_12_230000.zip',
    size: '2.2 GB',
    type: 'incremental',
    status: 'completed',
    createdAt: '2024-01-12 23:00:00',
    duration: '8 dakika'
  }
];

const mockEmailProviders = [
  { value: 'smtp', label: 'SMTP', icon: <MailOutlined /> },
  { value: 'sendgrid', label: 'SendGrid', icon: <MailOutlined /> },
  { value: 'mailgun', label: 'Mailgun', icon: <MailOutlined /> },
  { value: 'aws-ses', label: 'AWS SES', icon: <MailOutlined /> }
];

const mockSmsProviders = [
  { value: 'twilio', label: 'Twilio', icon: <MessageOutlined /> },
  { value: 'nexmo', label: 'Nexmo', icon: <MessageOutlined /> },
  { value: 'aws-sns', label: 'AWS SNS', icon: <MessageOutlined /> }
];

const mockLanguages = [
  { value: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'es', label: 'Español', flag: '🇪🇸' }
];

const mockCurrencies = [
  { value: 'TRY', label: 'Türk Lirası (₺)', symbol: '₺' },
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' }
];

export default function SettingsPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackupRunning, setIsBackupRunning] = useState(false);

  // Statistics
  const stats = useMemo(() => [
    {
      title: 'Sistem Sağlığı',
      value: `${mockSystemInfo.systemHealth}%`,
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
      title: 'Aktif Kullanıcı',
      value: mockSystemInfo.totalUsers,
      icon: <UserOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Aktif Tenant',
      value: mockSystemInfo.activeTenants,
      icon: <TeamOutlined />,
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Veritabanı Boyutu',
      value: mockSystemInfo.databaseSize,
      icon: <DatabaseOutlined />,
      color: '#faad14',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    }
  ], []);

  const handleSaveSettings = async (values: any) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('Ayarlar başarıyla kaydedildi!');
    } catch (error) {
      message.error('Ayarlar kaydedilirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleStartBackup = () => {
    setIsBackupRunning(true);
    setBackupProgress(0);
    
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackupRunning(false);
          message.success('Yedekleme başarıyla tamamlandı!');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleToggleMaintenanceMode = (checked: boolean) => {
    setMaintenanceMode(checked);
    message.info(`Bakım modu ${checked ? 'açıldı' : 'kapatıldı'}`);
  };

  const handleTestEmail = () => {
    message.info('Test e-postası gönderiliyor...');
  };

  const handleTestSms = () => {
    message.info('Test SMS gönderiliyor...');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <SettingOutlined /> Sistem Ayarları
      </Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              style={{
                background: stat.gradient,
                color: 'white',
                border: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stat.value}</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>{stat.title}</div>
                </div>
                <div style={{ fontSize: '32px', opacity: 0.8 }}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* System Info */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <InfoCircleOutlined />
            Sistem Bilgileri
          </div>
        }
        style={{ marginBottom: '24px' }}
      >
        <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Versiyon" span={1}>
            <Tag color="blue">{mockSystemInfo.version}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Build Tarihi" span={1}>
            {mockSystemInfo.buildDate}
          </Descriptions.Item>
          <Descriptions.Item label="Çalışma Süresi" span={1}>
            {mockSystemInfo.uptime}
          </Descriptions.Item>
          <Descriptions.Item label="Son Yedekleme" span={1}>
            {mockSystemInfo.lastBackup}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Main Settings Tabs */}
      <Tabs
        defaultActiveKey="general"
        size="large"
        items={[
          {
            key: 'general',
            label: (
              <span>
                <SettingOutlined />
                Genel Ayarlar
              </span>
            ),
            children: (
              <Card>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSaveSettings}
                  initialValues={{
                    language: 'tr',
                    currency: 'TRY',
                    timezone: 'Europe/Istanbul',
                    dateFormat: 'DD/MM/YYYY',
                    timeFormat: '24',
                    maintenanceMode: false
                  }}
                >
                  <Row gutter={[24, 16]}>
                    <Col xs={24} lg={12}>
                      <Form.Item
                        label="Varsayılan Dil"
                        name="language"
                        rules={[{ required: true, message: 'Lütfen dil seçin!' }]}
                      >
                        <Select placeholder="Dil seçin">
                          {mockLanguages.map(lang => (
                            <Option key={lang.value} value={lang.value}>
                              <span style={{ marginRight: '8px' }}>{lang.flag}</span>
                              {lang.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                      <Form.Item
                        label="Varsayılan Para Birimi"
                        name="currency"
                        rules={[{ required: true, message: 'Lütfen para birimi seçin!' }]}
                      >
                        <Select placeholder="Para birimi seçin">
                          {mockCurrencies.map(currency => (
                            <Option key={currency.value} value={currency.value}>
                              {currency.symbol} {currency.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                      <Form.Item
                        label="Saat Dilimi"
                        name="timezone"
                        rules={[{ required: true, message: 'Lütfen saat dilimi seçin!' }]}
                      >
                        <Select placeholder="Saat dilimi seçin">
                          <Option value="Europe/Istanbul">İstanbul (UTC+3)</Option>
                          <Option value="Europe/London">Londra (UTC+0)</Option>
                          <Option value="America/New_York">New York (UTC-5)</Option>
                          <Option value="Asia/Tokyo">Tokyo (UTC+9)</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                      <Form.Item
                        label="Tarih Formatı"
                        name="dateFormat"
                        rules={[{ required: true, message: 'Lütfen tarih formatı seçin!' }]}
                      >
                        <Select placeholder="Tarih formatı seçin">
                          <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                          <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                          <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item
                        label="Bakım Modu"
                        name="maintenanceMode"
                        valuePropName="checked"
                      >
                        <Switch
                          checkedChildren="Açık"
                          unCheckedChildren="Kapalı"
                          onChange={handleToggleMaintenanceMode}
                        />
                      </Form.Item>
                      {maintenanceMode && (
                        <Alert
                          message="Bakım Modu Aktif"
                          description="Sistem şu anda bakım modunda. Kullanıcılar sisteme erişemeyecek."
                          type="warning"
                          showIcon
                          style={{ marginTop: '16px' }}
                        />
                      )}
                    </Col>
                  </Row>
                </Form>
              </Card>
            )
          },
          {
            key: 'email-sms',
            label: (
              <span>
                <MailOutlined />
                E-posta & SMS
              </span>
            ),
            children: (
              <Card>
                <Tabs
                  defaultActiveKey="email"
                  items={[
                    {
                      key: 'email',
                      label: 'E-posta Ayarları',
                      children: (
                        <Form layout="vertical">
                          <Row gutter={[24, 16]}>
                            <Col xs={24} lg={12}>
                              <Form.Item
                                label="E-posta Sağlayıcısı"
                                name="emailProvider"
                                rules={[{ required: true, message: 'Lütfen sağlayıcı seçin!' }]}
                              >
                                <Select placeholder="Sağlayıcı seçin">
                                  {mockEmailProviders.map(provider => (
                                    <Option key={provider.value} value={provider.value}>
                                      {provider.icon} {provider.label}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                              <Form.Item
                                label="SMTP Sunucu"
                                name="smtpServer"
                                rules={[{ required: true, message: 'Lütfen SMTP sunucu girin!' }]}
                              >
                                <Input placeholder="smtp.example.com" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                              <Form.Item
                                label="Port"
                                name="smtpPort"
                                rules={[{ required: true, message: 'Lütfen port girin!' }]}
                              >
                                <Input placeholder="587" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                              <Form.Item
                                label="Kullanıcı Adı"
                                name="smtpUsername"
                                rules={[{ required: true, message: 'Lütfen kullanıcı adı girin!' }]}
                              >
                                <Input placeholder="user@example.com" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                              <Form.Item
                                label="Şifre"
                                name="smtpPassword"
                                rules={[{ required: true, message: 'Lütfen şifre girin!' }]}
                              >
                                <Input.Password placeholder="Şifre" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                              <Form.Item
                                label="Gönderen E-posta"
                                name="fromEmail"
                                rules={[{ required: true, message: 'Lütfen gönderen e-posta girin!' }]}
                              >
                                <Input placeholder="noreply@example.com" />
                              </Form.Item>
                            </Col>
                            <Col xs={24}>
                              <Space>
                                <Button
                                  type="primary"
                                  icon={<MailOutlined />}
                                  onClick={handleTestEmail}
                                >
                                  Test E-postası Gönder
                                </Button>
                                <Button
                                  icon={<SaveOutlined />}
                                  loading={loading}
                                  onClick={() => form.submit()}
                                >
                                  Kaydet
                                </Button>
                              </Space>
                            </Col>
                          </Row>
                        </Form>
                      )
                    },
                    {
                      key: 'sms',
                      label: 'SMS Ayarları',
                      children: (
                        <Form layout="vertical">
                          <Row gutter={[24, 16]}>
                            <Col xs={24} lg={12}>
                              <Form.Item
                                label="SMS Sağlayıcısı"
                                name="smsProvider"
                                rules={[{ required: true, message: 'Lütfen sağlayıcı seçin!' }]}
                              >
                                <Select placeholder="Sağlayıcı seçin">
                                  {mockSmsProviders.map(provider => (
                                    <Option key={provider.value} value={provider.value}>
                                      {provider.icon} {provider.label}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                              <Form.Item
                                label="API Anahtarı"
                                name="smsApiKey"
                                rules={[{ required: true, message: 'Lütfen API anahtarı girin!' }]}
                              >
                                <Input.Password placeholder="API anahtarı" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                              <Form.Item
                                label="API Gizli Anahtarı"
                                name="smsApiSecret"
                                rules={[{ required: true, message: 'Lütfen API gizli anahtarı girin!' }]}
                              >
                                <Input.Password placeholder="API gizli anahtarı" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                              <Form.Item
                                label="Gönderen Numarası"
                                name="fromNumber"
                                rules={[{ required: true, message: 'Lütfen gönderen numara girin!' }]}
                              >
                                <Input placeholder="+905551234567" />
                              </Form.Item>
                            </Col>
                            <Col xs={24}>
                              <Space>
                                <Button
                                  type="primary"
                                  icon={<MessageOutlined />}
                                  onClick={handleTestSms}
                                >
                                  Test SMS Gönder
                                </Button>
                                <Button
                                  icon={<SaveOutlined />}
                                  loading={loading}
                                  onClick={() => form.submit()}
                                >
                                  Kaydet
                                </Button>
                              </Space>
                            </Col>
                          </Row>
                        </Form>
                      )
                    }
                  ]}
                />
              </Card>
            )
          },
          {
            key: 'backup',
            label: (
              <span>
                <CloudUploadOutlined />
                Yedekleme & Geri Yükleme
              </span>
            ),
            children: (
              <Card>
                <Row gutter={[24, 16]}>
                  <Col xs={24} lg={12}>
                    <Card
                      title="Yedekleme Ayarları"
                      size="small"
                    >
                      <Form layout="vertical">
                        <Form.Item
                          label="Otomatik Yedekleme"
                          name="autoBackup"
                          valuePropName="checked"
                        >
                          <Switch defaultChecked />
                        </Form.Item>
                        <Form.Item
                          label="Yedekleme Sıklığı"
                          name="backupFrequency"
                        >
                          <Select placeholder="Yedekleme sıklığı seçin">
                            <Option value="hourly">Saatlik</Option>
                            <Option value="daily">Günlük</Option>
                            <Option value="weekly">Haftalık</Option>
                            <Option value="monthly">Aylık</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label="Yedekleme Saati"
                          name="backupTime"
                        >
                          <Select placeholder="Yedekleme saati seçin">
                            <Option value="00:00">00:00</Option>
                            <Option value="06:00">06:00</Option>
                            <Option value="12:00">12:00</Option>
                            <Option value="18:00">18:00</Option>
                            <Option value="23:00">23:00</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label="Yedekleme Türü"
                          name="backupType"
                        >
                          <Select placeholder="Yedekleme türü seçin">
                            <Option value="full">Tam Yedekleme</Option>
                            <Option value="incremental">Artırımlı Yedekleme</Option>
                            <Option value="differential">Fark Yedekleme</Option>
                          </Select>
                        </Form.Item>
                        <Space>
                          <Button
                            type="primary"
                            icon={<CloudUploadOutlined />}
                            onClick={handleStartBackup}
                            loading={isBackupRunning}
                            disabled={isBackupRunning}
                          >
                            Manuel Yedekleme Başlat
                          </Button>
                          <Button
                            icon={<CloudDownloadOutlined />}
                          >
                            Yedek İndir
                          </Button>
                        </Space>
                        {isBackupRunning && (
                          <div style={{ marginTop: '16px' }}>
                            <Progress
                              percent={backupProgress}
                              status="active"
                              strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                              }}
                            />
                          </div>
                        )}
                      </Form>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card
                      title="Yedekleme Geçmişi"
                      size="small"
                    >
                      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {mockBackups.map(backup => (
                          <Card
                            key={backup.id}
                            size="small"
                            style={{ marginBottom: '8px' }}
                            bodyStyle={{ padding: '12px' }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{ fontWeight: 500 }}>{backup.name}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                  {backup.createdAt} • {backup.size} • {backup.duration}
                                </div>
                              </div>
                              <div>
                                <Tag color={backup.status === 'completed' ? 'green' : 'orange'}>
                                  {backup.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
                                </Tag>
                                <Tag color="blue">{backup.type === 'full' ? 'Tam' : 'Artırımlı'}</Tag>
                              </div>
                            </div>
                            <div style={{ marginTop: '8px' }}>
                              <Space size="small">
                                <Button size="small" icon={<DownloadOutlined />}>
                                  İndir
                                </Button>
                                <Button size="small" icon={<EyeOutlined />}>
                                  Görüntüle
                                </Button>
                                <Button size="small" icon={<DeleteOutlined />} danger>
                                  Sil
                                </Button>
                              </Space>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Card>
            )
          },
          {
            key: 'security',
            label: (
              <span>
                <SafetyOutlined />
                Güvenlik
              </span>
            ),
            children: (
              <Card>
                <Row gutter={[24, 16]}>
                  <Col xs={24} lg={12}>
                    <Card
                      title="Şifre Politikası"
                      size="small"
                    >
                      <Form layout="vertical">
                        <Form.Item
                          label="Minimum Şifre Uzunluğu"
                          name="minPasswordLength"
                        >
                          <Input type="number" placeholder="Minimum şifre uzunluğu" />
                        </Form.Item>
                        <Form.Item
                          label="Büyük Harf Zorunlu"
                          name="requireUppercase"
                          valuePropName="checked"
                        >
                          <Switch defaultChecked />
                        </Form.Item>
                        <Form.Item
                          label="Küçük Harf Zorunlu"
                          name="requireLowercase"
                          valuePropName="checked"
                        >
                          <Switch defaultChecked />
                        </Form.Item>
                        <Form.Item
                          label="Rakam Zorunlu"
                          name="requireNumber"
                          valuePropName="checked"
                        >
                          <Switch defaultChecked />
                        </Form.Item>
                        <Form.Item
                          label="Özel Karakter Zorunlu"
                          name="requireSpecialChar"
                          valuePropName="checked"
                        >
                          <Switch defaultChecked />
                        </Form.Item>
                        <Form.Item
                          label="Şifre Geçerlilik Süresi (Gün)"
                          name="passwordExpiryDays"
                        >
                          <Input type="number" placeholder="Şifre geçerlilik süresi (gün)" />
                        </Form.Item>
                      </Form>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card
                      title="Oturum Güvenliği"
                      size="small"
                    >
                      <Form layout="vertical">
                        <Form.Item
                          label="Maksimum Oturum Süresi (Saat)"
                          name="maxSessionHours"
                        >
                          <Input type="number" placeholder="Maksimum oturum süresi (saat)" />
                        </Form.Item>
                        <Form.Item
                          label="İki Faktörlü Doğrulama (2FA)"
                          name="require2FA"
                          valuePropName="checked"
                        >
                          <Switch defaultChecked />
                        </Form.Item>
                        <Form.Item
                          label="Başarısız Giriş Limiti"
                          name="maxLoginAttempts"
                        >
                          <Input type="number" placeholder="Başarısız giriş limiti" />
                        </Form.Item>
                        <Form.Item
                          label="Hesap Kilitleme Süresi (Dakika)"
                          name="lockoutDuration"
                        >
                          <Input type="number" placeholder="Hesap kilitleme süresi (dakika)" />
                        </Form.Item>
                        <Form.Item
                          label="IP Kısıtlaması"
                          name="ipRestriction"
                          valuePropName="checked"
                        >
                          <Switch />
                        </Form.Item>
                      </Form>
                    </Card>
                  </Col>
                </Row>
              </Card>
            )
          }
        ]}
      />

      {/* Save Button */}
      <Card style={{ marginTop: '24px' }}>
        <Space>
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={() => form.submit()}
          >
            Tüm Ayarları Kaydet
          </Button>
          <Button
            size="large"
            icon={<ReloadOutlined />}
            onClick={() => form.resetFields()}
          >
            Sıfırla
          </Button>
        </Space>
      </Card>
    </div>
  );
} 