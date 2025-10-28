'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  App,
  Spin
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
import { settingsService, SystemInfo, BackupLog, EmailProvider, SmsProvider, SystemSettings } from '../../../services/settingsService';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Static data for select options
const languages = [
  { value: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'es', label: 'Español', flag: '🇪🇸' }
];

const currencies = [
  { value: 'TRY', label: 'Türk Lirası (₺)', symbol: '₺' },
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' }
];

interface SettingsFormValues {
  systemName: string;
  adminEmail: string;
  maxUsers: number;
  backupFrequency: string;
  maintenanceMode: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export default function SettingsPage() {
  const { message: messageApi } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  
  // State for data from API
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [backups, setBackups] = useState<BackupLog[]>([]);
  const [emailProviders, setEmailProviders] = useState<EmailProvider[]>([]);
  const [smsProviders, setSmsProviders] = useState<SmsProvider[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setDataLoading(true);
    try {
      const [
        info,
        backupLogs,
        emailProvs,
        smsProvs,
        settings
      ] = await Promise.all([
        settingsService.getSystemInfo(),
        settingsService.getBackupLogs(),
        settingsService.getEmailProviders(),
        settingsService.getSmsProviders(),
        settingsService.getSystemSettings()
      ]);

      setSystemInfo(info);
      setBackups(backupLogs);
      setEmailProviders(emailProvs);
      setSmsProviders(smsProvs);
      setSystemSettings(settings);
      setMaintenanceMode(settings.maintenanceMode);
    } catch (error) {
      messageApi.error('Veriler yüklenirken hata oluştu!');
      console.error('Error loading data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // Statistics
  const stats = useMemo(() => [
    {
      title: 'Sistem Sağlığı',
      value: systemInfo ? `${systemInfo.systemHealth}%` : '--',
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
      title: 'Aktif Kullanıcı',
      value: systemInfo?.totalUsers || 0,
      icon: <UserOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Aktif Tenant',
      value: systemInfo?.activeTenants || 0,
      icon: <TeamOutlined />,
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Veritabanı Boyutu',
      value: systemInfo?.databaseSize || '--',
      icon: <DatabaseOutlined />,
      color: '#faad14',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    }
  ], [systemInfo]);

  const handleSaveSettings = async (values: SettingsFormValues) => {
    setLoading(true);
    try {
      await settingsService.updateSystemSettings(values);
      messageApi.success('Ayarlar başarıyla kaydedildi!');
      await loadAllData(); // Reload data
    } catch (error) {
      messageApi.error('Ayarlar kaydedilirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleStartBackup = async () => {
    setIsBackupRunning(true);
    setBackupProgress(0);
    
    try {
      const result = await settingsService.startBackup();
      if (result.success) {
        // Simulate progress for better UX
        const interval = setInterval(() => {
          setBackupProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              setIsBackupRunning(false);
              messageApi.success('Yedekleme başarıyla tamamlandı!');
              loadAllData(); // Reload backup logs
              return 100;
            }
            return prev + 10;
          });
        }, 500);
      } else {
        messageApi.error(result.message || 'Yedekleme başlatılamadı!');
        setIsBackupRunning(false);
      }
    } catch (error) {
      messageApi.error('Yedekleme başlatılırken hata oluştu!');
      setIsBackupRunning(false);
    }
  };

  const handleToggleMaintenanceMode = async (checked: boolean) => {
    try {
      const result = await settingsService.toggleMaintenanceMode(checked);
      if (result.success) {
        setMaintenanceMode(checked);
        messageApi.info(`Bakım modu ${checked ? 'açıldı' : 'kapatıldı'}`);
      } else {
        messageApi.error(result.message || 'Bakım modu değiştirilemedi!');
      }
    } catch (error) {
      messageApi.error('Bakım modu değiştirilirken hata oluştu!');
    }
  };

  const handleTestEmail = async () => {
    try {
      const result = await settingsService.testEmail();
      if (result.success) {
        messageApi.success('Test e-postası başarıyla gönderildi!');
      } else {
        messageApi.error(result.message || 'Test e-postası gönderilemedi!');
      }
    } catch (error) {
      messageApi.error('Test e-postası gönderilirken hata oluştu!');
    }
  };

  const handleTestSms = async () => {
    try {
      const result = await settingsService.testSms();
      if (result.success) {
        messageApi.success('Test SMS başarıyla gönderildi!');
      } else {
        messageApi.error(result.message || 'Test SMS gönderilemedi!');
      }
    } catch (error) {
      messageApi.error('Test SMS gönderilirken hata oluştu!');
    }
  };

  if (dataLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Ayarlar yükleniyor...</div>
      </div>
    );
  }

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
            <Tag color="blue">{systemInfo?.version || '--'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Build Tarihi" span={1}>
            {systemInfo?.buildDate || '--'}
          </Descriptions.Item>
          <Descriptions.Item label="Çalışma Süresi" span={1}>
            {systemInfo?.uptime || '--'}
          </Descriptions.Item>
          <Descriptions.Item label="Son Yedekleme" span={1}>
            {systemInfo?.lastBackup || '--'}
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
                    language: systemSettings?.defaultLanguage || 'tr',
                    currency: systemSettings?.defaultCurrency || 'TRY',
                    timezone: systemSettings?.timezone || 'Europe/Istanbul',
                    dateFormat: systemSettings?.dateFormat || 'DD/MM/YYYY',
                    timeFormat: systemSettings?.timeFormat || '24',
                    maintenanceMode: systemSettings?.maintenanceMode || false
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
                          {languages.map(lang => (
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
                          {currencies.map(currency => (
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
                                  {emailProviders.map(provider => (
                                    <Option key={provider.id} value={provider.id}>
                                      <MailOutlined /> {provider.name}
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
                                  {smsProviders.map(provider => (
                                    <Option key={provider.id} value={provider.id}>
                                      <MessageOutlined /> {provider.name}
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
                        {backups.map(backup => (
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
            onClick={loadAllData}
          >
            Yenile
          </Button>
        </Space>
      </Card>
    </div>
  );
} 