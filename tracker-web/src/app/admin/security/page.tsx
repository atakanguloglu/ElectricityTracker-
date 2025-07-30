'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  Card,
  Row,
  Col,
  Button,
  Tag,
  Badge,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Popconfirm,
  Space,
  Typography,
  Divider,
  Tooltip,
  Progress,
  Statistic,
  Tabs,
  List,
  Descriptions,
  DatePicker,
  InputNumber,
  Alert,
  Collapse,
  Timeline,
  Avatar,
  Steps,
  Upload,
  Dropdown
} from 'antd';
import {
  SafetyOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SettingOutlined,
  GlobalOutlined,
  UserOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  BugOutlined,
  LockOutlined,
  UnlockOutlined,
  KeyOutlined,
  TeamOutlined,
  DollarOutlined,
  BarChartOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileZipOutlined,
  CalendarOutlined,
  ClearOutlined,
  ExportOutlined,
  SecurityScanOutlined,
  StopOutlined,
  PlayCircleOutlined,
  AlertOutlined,
  FireOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Step } = Steps;

// Mock data
const mockTenants = [
  { id: 1, name: 'ABC Şirketi', domain: 'abc.com' },
  { id: 2, name: 'XYZ Ltd.', domain: 'xyz.com' },
  { id: 3, name: 'Tech Solutions', domain: 'techsolutions.com' },
  { id: 4, name: 'Global Corp', domain: 'globalcorp.com' },
  { id: 5, name: 'Startup Inc', domain: 'startupinc.com' }
];

const mockSecurityAlerts = [
  {
    id: 1,
    timestamp: '2024-01-15T10:30:00Z',
    type: 'brute_force',
    severity: 'high',
    tenantId: 2,
    tenantName: 'XYZ Ltd.',
    description: 'Brute force saldırısı tespit edildi',
    details: {
      ipAddress: '192.168.2.100',
      attemptCount: 150,
      timeWindow: '5 minutes',
      targetUsername: 'admin@xyz.com',
      blocked: true
    },
    status: 'active',
    resolved: false
  },
  {
    id: 2,
    timestamp: '2024-01-15T10:25:00Z',
    type: 'suspicious_login',
    severity: 'medium',
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    description: 'Şüpheli giriş tespit edildi',
    details: {
      ipAddress: '203.45.67.89',
      location: 'Unknown Location',
      userAgent: 'Suspicious Browser',
      previousLogin: '2024-01-10T15:30:00Z',
      locationChanged: true
    },
    status: 'investigating',
    resolved: false
  },
  {
    id: 3,
    timestamp: '2024-01-15T10:20:00Z',
    type: 'failed_2fa',
    severity: 'low',
    tenantId: 3,
    tenantName: 'Tech Solutions',
    description: '2FA doğrulama başarısız',
    details: {
      username: 'analist.tech',
      attemptCount: 3,
      lastSuccessful: '2024-01-14T09:15:00Z',
      deviceInfo: 'Mobile App'
    },
    status: 'resolved',
    resolved: true
  },
  {
    id: 4,
    timestamp: '2024-01-15T10:15:00Z',
    type: 'data_breach_attempt',
    severity: 'critical',
    tenantId: 4,
    tenantName: 'Global Corp',
    description: 'Veri sızıntısı girişimi tespit edildi',
    details: {
      ipAddress: '185.67.43.21',
      endpoint: '/api/users/data',
      requestCount: 500,
      timeWindow: '10 minutes',
      blocked: true,
      reported: true
    },
    status: 'active',
    resolved: false
  },
  {
    id: 5,
    timestamp: '2024-01-15T10:10:00Z',
    type: 'unusual_activity',
    severity: 'medium',
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    description: 'Olağandışı aktivite tespit edildi',
    details: {
      username: 'muhasebe.abc',
      activityType: 'mass_data_export',
      recordCount: 10000,
      timeWindow: '2 hours',
      flagged: true
    },
    status: 'investigating',
    resolved: false
  }
];

const mockTenantSecurityScores = [
  {
    id: 1,
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    securityScore: 85,
    twoFactorEnabled: true,
    passwordPolicy: 'strong',
    lastSecurityAudit: '2024-01-10T14:30:00Z',
    activeThreats: 2,
    blockedIPs: 5,
    securityRecommendations: [
      'IP whitelist güncellemesi önerilir',
      'Kullanıcı eğitimi gerekli'
    ]
  },
  {
    id: 2,
    tenantId: 2,
    tenantName: 'XYZ Ltd.',
    securityScore: 45,
    twoFactorEnabled: false,
    passwordPolicy: 'weak',
    lastSecurityAudit: '2024-01-08T11:20:00Z',
    activeThreats: 5,
    blockedIPs: 12,
    securityRecommendations: [
      '2FA zorunlu hale getirilmeli',
      'Şifre politikası güçlendirilmeli',
      'Güvenlik eğitimi acil'
    ]
  },
  {
    id: 3,
    tenantId: 3,
    tenantName: 'Tech Solutions',
    securityScore: 92,
    twoFactorEnabled: true,
    passwordPolicy: 'strong',
    lastSecurityAudit: '2024-01-12T16:45:00Z',
    activeThreats: 0,
    blockedIPs: 2,
    securityRecommendations: [
      'Mevcut güvenlik seviyesi yeterli'
    ]
  },
  {
    id: 4,
    tenantId: 4,
    tenantName: 'Global Corp',
    securityScore: 78,
    twoFactorEnabled: true,
    passwordPolicy: 'medium',
    lastSecurityAudit: '2024-01-09T13:15:00Z',
    activeThreats: 1,
    blockedIPs: 8,
    securityRecommendations: [
      'Şifre politikası güçlendirilmeli',
      'Düzenli güvenlik taraması önerilir'
    ]
  },
  {
    id: 5,
    tenantId: 5,
    tenantName: 'Startup Inc',
    securityScore: 65,
    twoFactorEnabled: false,
    passwordPolicy: 'medium',
    lastSecurityAudit: '2024-01-11T10:30:00Z',
    activeThreats: 3,
    blockedIPs: 6,
    securityRecommendations: [
      '2FA aktifleştirilmeli',
      'Güvenlik protokolleri gözden geçirilmeli'
    ]
  }
];

const mockBlockedIPs = [
  {
    id: 1,
    ipAddress: '192.168.2.100',
    reason: 'Brute force saldırısı',
    blockedAt: '2024-01-15T10:30:00Z',
    blockedBy: 'System',
    tenantId: 2,
    tenantName: 'XYZ Ltd.',
    attemptCount: 150,
    status: 'blocked',
    expiryDate: '2024-01-22T10:30:00Z'
  },
  {
    id: 2,
    ipAddress: '185.67.43.21',
    reason: 'Veri sızıntısı girişimi',
    blockedAt: '2024-01-15T10:15:00Z',
    blockedBy: 'Admin',
    tenantId: 4,
    tenantName: 'Global Corp',
    attemptCount: 500,
    status: 'blocked',
    expiryDate: '2024-01-30T10:15:00Z'
  },
  {
    id: 3,
    ipAddress: '203.45.67.89',
    reason: 'Şüpheli aktivite',
    blockedAt: '2024-01-15T10:25:00Z',
    blockedBy: 'System',
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    attemptCount: 25,
    status: 'blocked',
    expiryDate: '2024-01-18T10:25:00Z'
  }
];

const mockLockedAccounts = [
  {
    id: 1,
    userId: 4,
    username: 'rapor.tech',
    fullName: 'Ayşe Özkan',
    tenantId: 3,
    tenantName: 'Tech Solutions',
    lockedAt: '2024-01-15T09:30:00Z',
    lockedBy: 'System',
    reason: 'Başarısız giriş denemeleri',
    failedAttempts: 5,
    status: 'locked',
    unlockDate: '2024-01-16T09:30:00Z'
  },
  {
    id: 2,
    userId: 6,
    username: 'test.user',
    fullName: 'Test User',
    tenantId: 2,
    tenantName: 'XYZ Ltd.',
    lockedAt: '2024-01-15T08:45:00Z',
    lockedBy: 'Admin',
    reason: 'Güvenlik ihlali',
    failedAttempts: 0,
    status: 'locked',
    unlockDate: null
  }
];

const alertTypes = [
  { value: 'brute_force', label: 'Brute Force', icon: <FireOutlined />, color: '#ff4d4f' },
  { value: 'suspicious_login', label: 'Şüpheli Giriş', icon: <WarningOutlined />, color: '#faad14' },
  { value: 'failed_2fa', label: '2FA Başarısız', icon: <KeyOutlined />, color: '#1890ff' },
  { value: 'data_breach_attempt', label: 'Veri Sızıntısı', icon: <ExclamationCircleOutlined />, color: '#ff4d4f' },
  { value: 'unusual_activity', label: 'Olağandışı Aktivite', icon: <AlertOutlined />, color: '#722ed1' }
];

const severityLevels = [
  { value: 'low', label: 'Düşük', color: '#52c41a' },
  { value: 'medium', label: 'Orta', color: '#faad14' },
  { value: 'high', label: 'Yüksek', color: '#ff4d4f' },
  { value: 'critical', label: 'Kritik', color: '#ff0000' }
];

export default function SecurityCenterPage() {
  const [securityAlerts, setSecurityAlerts] = useState(mockSecurityAlerts);
  const [tenantSecurityScores, setTenantSecurityScores] = useState(mockTenantSecurityScores);
  const [blockedIPs, setBlockedIPs] = useState(mockBlockedIPs);
  const [lockedAccounts, setLockedAccounts] = useState(mockLockedAccounts);
  const [filters, setFilters] = useState({
    tenantId: undefined,
    alertType: undefined,
    severity: undefined,
    status: undefined
  });

  // Statistics
  const stats = useMemo(() => [
    {
      title: 'Aktif Tehditler',
      value: securityAlerts.filter(a => !a.resolved).length,
      icon: <ExclamationCircleOutlined />,
      color: '#ff4d4f',
      gradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
    },
    {
      title: 'Ortalama Güvenlik Skoru',
      value: `${Math.round(tenantSecurityScores.reduce((sum, t) => sum + t.securityScore, 0) / tenantSecurityScores.length)}%`,
      icon: <SafetyOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
      title: 'Engellenen IP',
      value: blockedIPs.length,
      icon: <StopOutlined />,
      color: '#faad14',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Kilitli Hesaplar',
      value: lockedAccounts.length,
      icon: <LockOutlined />,
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  ], [securityAlerts, tenantSecurityScores, blockedIPs, lockedAccounts]);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return securityAlerts.filter(alert => {
      if (filters.tenantId && alert.tenantId !== filters.tenantId) return false;
      if (filters.alertType && alert.type !== filters.alertType) return false;
      if (filters.severity && alert.severity !== filters.severity) return false;
      if (filters.status && alert.status !== filters.status) return false;
      return true;
    });
  }, [securityAlerts, filters]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'green';
      case 'medium': return 'orange';
      case 'high': return 'red';
      case 'critical': return 'red';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <InfoCircleOutlined />;
      case 'medium': return <WarningOutlined />;
      case 'high': return <ExclamationCircleOutlined />;
      case 'critical': return <ExclamationCircleOutlined />;
      default: return <InfoCircleOutlined />;
    }
  };

  const getAlertTypeIcon = (type: string) => {
    const alertType = alertTypes.find(t => t.value === type);
    return alertType?.icon || <AlertOutlined />;
  };

  const getAlertTypeColor = (type: string) => {
    const alertType = alertTypes.find(t => t.value === type);
    return alertType?.color || '#666';
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return '#52c41a';
    if (score >= 70) return '#faad14';
    if (score >= 50) return '#ff4d4f';
    return '#ff0000';
  };

  const alertColumns: ColumnsType<any> = [
    {
      title: 'Zaman',
      key: 'timestamp',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{new Date(record.timestamp).toLocaleDateString('tr-TR')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {new Date(record.timestamp).toLocaleTimeString('tr-TR')}
          </div>
        </div>
      )
    },
    {
      title: 'Tür',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type) => (
        <Tag color={getAlertTypeColor(type)} icon={getAlertTypeIcon(type)}>
          {alertTypes.find(t => t.value === type)?.label}
        </Tag>
      )
    },
    {
      title: 'Önem',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity) => (
        <Tag color={getSeverityColor(severity)} icon={getSeverityIcon(severity)}>
          {severityLevels.find(s => s.value === severity)?.label}
        </Tag>
      )
    },
    {
      title: 'Açıklama',
      key: 'description',
      width: 250,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: '4px' }}>
            {record.description}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.details.ipAddress && `IP: ${record.details.ipAddress}`}
          </div>
        </div>
      )
    },
    {
      title: 'Tenant',
      dataIndex: 'tenantName',
      key: 'tenantName',
      width: 150,
      render: (tenantName) => (
        <Tag color="blue" icon={<GlobalOutlined />}>
          {tenantName}
        </Tag>
      )
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Badge
          status={status === 'active' ? 'error' : status === 'investigating' ? 'processing' : 'success'}
          text={status === 'active' ? 'Aktif' : status === 'investigating' ? 'İnceleniyor' : 'Çözüldü'}
        />
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Detayları Görüntüle">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewAlertDetails(record)}
            />
          </Tooltip>
          {!record.resolved && (
            <Tooltip title="Çözüldü Olarak İşaretle">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => handleResolveAlert(record.id)}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="Bu uyarıyı silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDeleteAlert(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Tooltip title="Sil">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const securityScoreColumns: ColumnsType<any> = [
    {
      title: 'Tenant',
      dataIndex: 'tenantName',
      key: 'tenantName',
      width: 200,
      render: (tenantName) => (
        <div>
          <div style={{ fontWeight: 500 }}>{tenantName}</div>
        </div>
      )
    },
    {
      title: 'Güvenlik Skoru',
      key: 'securityScore',
      width: 150,
      render: (_, record) => (
        <div>
          <Progress
            percent={record.securityScore}
            strokeColor={getSecurityScoreColor(record.securityScore)}
            format={(percent) => `${percent}%`}
          />
        </div>
      )
    },
    {
      title: '2FA',
      dataIndex: 'twoFactorEnabled',
      key: 'twoFactorEnabled',
      width: 100,
      render: (enabled) => (
        <Badge
          status={enabled ? 'success' : 'error'}
          text={enabled ? 'Aktif' : 'Pasif'}
        />
      )
    },
    {
      title: 'Şifre Politikası',
      dataIndex: 'passwordPolicy',
      key: 'passwordPolicy',
      width: 120,
      render: (policy) => (
        <Tag color={policy === 'strong' ? 'green' : policy === 'medium' ? 'orange' : 'red'}>
          {policy === 'strong' ? 'Güçlü' : policy === 'medium' ? 'Orta' : 'Zayıf'}
        </Tag>
      )
    },
    {
      title: 'Aktif Tehditler',
      dataIndex: 'activeThreats',
      key: 'activeThreats',
      width: 120,
      render: (threats) => (
        <Tag color={threats === 0 ? 'green' : threats > 3 ? 'red' : 'orange'}>
          {threats} tehdit
        </Tag>
      )
    },
    {
      title: 'Engellenen IP',
      dataIndex: 'blockedIPs',
      key: 'blockedIPs',
      width: 120,
      render: (ips) => (
        <Tag color="blue">{ips} IP</Tag>
      )
    },
    {
      title: 'Son Denetim',
      key: 'lastSecurityAudit',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{new Date(record.lastSecurityAudit).toLocaleDateString('tr-TR')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {new Date(record.lastSecurityAudit).toLocaleTimeString('tr-TR')}
          </div>
        </div>
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Güvenlik Raporu">
            <Button
              type="text"
              icon={<BarChartOutlined />}
              onClick={() => handleViewSecurityReport(record)}
            />
          </Tooltip>
          <Tooltip title="Güvenlik Ayarları">
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={() => handleSecuritySettings(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const blockedIPColumns: ColumnsType<any> = [
    {
      title: 'IP Adresi',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 150,
      render: (ip) => (
        <Text code>{ip}</Text>
      )
    },
    {
      title: 'Sebep',
      dataIndex: 'reason',
      key: 'reason',
      width: 200
    },
    {
      title: 'Tenant',
      dataIndex: 'tenantName',
      key: 'tenantName',
      width: 150,
      render: (tenantName) => (
        <Tag color="blue">{tenantName}</Tag>
      )
    },
    {
      title: 'Engellenme Tarihi',
      key: 'blockedAt',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{new Date(record.blockedAt).toLocaleDateString('tr-TR')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {new Date(record.blockedAt).toLocaleTimeString('tr-TR')}
          </div>
        </div>
      )
    },
    {
      title: 'Bitiş Tarihi',
      key: 'expiryDate',
      width: 150,
      render: (_, record) => (
        record.expiryDate ? (
          <div>
            <div>{new Date(record.expiryDate).toLocaleDateString('tr-TR')}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {new Date(record.expiryDate).toLocaleTimeString('tr-TR')}
            </div>
          </div>
        ) : (
          <Text type="secondary">Süresiz</Text>
        )
      )
    },
    {
      title: 'Deneme Sayısı',
      dataIndex: 'attemptCount',
      key: 'attemptCount',
      width: 120,
      render: (count) => (
        <Tag color="red">{count}</Tag>
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Engeli Kaldır">
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              onClick={() => handleUnblockIP(record.id)}
            />
          </Tooltip>
          <Popconfirm
            title="Bu IP engelini silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDeleteBlockedIP(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Tooltip title="Sil">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const lockedAccountColumns: ColumnsType<any> = [
    {
      title: 'Kullanıcı',
      key: 'user',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.fullName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.username}</div>
        </div>
      )
    },
    {
      title: 'Tenant',
      dataIndex: 'tenantName',
      key: 'tenantName',
      width: 150,
      render: (tenantName) => (
        <Tag color="blue">{tenantName}</Tag>
      )
    },
    {
      title: 'Kilitlenme Tarihi',
      key: 'lockedAt',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{new Date(record.lockedAt).toLocaleDateString('tr-TR')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {new Date(record.lockedAt).toLocaleTimeString('tr-TR')}
          </div>
        </div>
      )
    },
    {
      title: 'Sebep',
      dataIndex: 'reason',
      key: 'reason',
      width: 200
    },
    {
      title: 'Başarısız Deneme',
      dataIndex: 'failedAttempts',
      key: 'failedAttempts',
      width: 120,
      render: (attempts) => (
        <Tag color="red">{attempts}</Tag>
      )
    },
    {
      title: 'Açılma Tarihi',
      key: 'unlockDate',
      width: 150,
      render: (_, record) => (
        record.unlockDate ? (
          <div>
            <div>{new Date(record.unlockDate).toLocaleDateString('tr-TR')}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {new Date(record.unlockDate).toLocaleTimeString('tr-TR')}
            </div>
          </div>
        ) : (
          <Text type="secondary">Manuel açılma gerekli</Text>
        )
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Kilidi Aç">
            <Button
              type="text"
              icon={<UnlockOutlined />}
              onClick={() => handleUnlockAccount(record.id)}
            />
          </Tooltip>
          <Tooltip title="Güvenlik Geçmişi">
            <Button
              type="text"
              icon={<ClockCircleOutlined />}
              onClick={() => handleViewSecurityHistory(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const handleViewAlertDetails = (alert: any) => {
    message.info(`${alert.description} detayları yakında eklenecek`);
  };

  const handleResolveAlert = (alertId: number) => {
    setSecurityAlerts(alerts => alerts.map(a => 
      a.id === alertId ? { ...a, resolved: true, status: 'resolved' } : a
    ));
    message.success('Uyarı çözüldü olarak işaretlendi');
  };

  const handleDeleteAlert = (alertId: number) => {
    setSecurityAlerts(alerts => alerts.filter(a => a.id !== alertId));
    message.success('Uyarı silindi');
  };

  const handleViewSecurityReport = (tenant: any) => {
    message.info(`${tenant.tenantName} güvenlik raporu yakında eklenecek`);
  };

  const handleSecuritySettings = (tenant: any) => {
    message.info(`${tenant.tenantName} güvenlik ayarları yakında eklenecek`);
  };

  const handleUnblockIP = (ipId: number) => {
    setBlockedIPs(ips => ips.filter(ip => ip.id !== ipId));
    message.success('IP engeli kaldırıldı');
  };

  const handleDeleteBlockedIP = (ipId: number) => {
    setBlockedIPs(ips => ips.filter(ip => ip.id !== ipId));
    message.success('IP engeli silindi');
  };

  const handleUnlockAccount = (accountId: number) => {
    setLockedAccounts(accounts => accounts.filter(acc => acc.id !== accountId));
    message.success('Hesap kilidi açıldı');
  };

  const handleViewSecurityHistory = (account: any) => {
    message.info(`${account.username} güvenlik geçmişi yakında eklenecek`);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      tenantId: undefined,
      alertType: undefined,
      severity: undefined,
      status: undefined
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <SafetyOutlined /> Güvenlik Merkezi
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

      {/* Security Alerts */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
            Son Güvenlik Uyarıları
          </div>
        }
        style={{ marginBottom: '24px' }}
        extra={
          <Space>
            <Select
              placeholder="Tenant"
              style={{ width: 120 }}
              value={filters.tenantId}
              onChange={(value) => handleFilterChange('tenantId', value)}
              allowClear
            >
              {mockTenants.map(tenant => (
                <Option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Tür"
              style={{ width: 120 }}
              value={filters.alertType}
              onChange={(value) => handleFilterChange('alertType', value)}
              allowClear
            >
              {alertTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Önem"
              style={{ width: 100 }}
              value={filters.severity}
              onChange={(value) => handleFilterChange('severity', value)}
              allowClear
            >
              {severityLevels.map(level => (
                <Option key={level.value} value={level.value}>
                  {level.label}
                </Option>
              ))}
            </Select>
            <Button
              icon={<FilterOutlined />}
              onClick={clearFilters}
            >
              Temizle
            </Button>
          </Space>
        }
      >
        <Table
          columns={alertColumns}
          dataSource={filteredAlerts}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} / ${total} uyarı`
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Tenant Security Scores */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SafetyOutlined style={{ color: '#52c41a' }} />
            Tenant Güvenlik Skorları
          </div>
        }
        style={{ marginBottom: '24px' }}
      >
        <Table
          columns={securityScoreColumns}
          dataSource={tenantSecurityScores}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* IP Restrictions and Locked Accounts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <StopOutlined style={{ color: '#faad14' }} />
                IP Bazlı Erişim Kısıtlamaları
              </div>
            }
          >
            <Table
              columns={blockedIPColumns}
              dataSource={blockedIPs}
              rowKey="id"
              pagination={{
                pageSize: 5,
                showSizeChanger: false
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LockOutlined style={{ color: '#722ed1' }} />
                Kilitli Hesaplar
              </div>
            }
          >
            <Table
              columns={lockedAccountColumns}
              dataSource={lockedAccounts}
              rowKey="id"
              pagination={{
                pageSize: 5,
                showSizeChanger: false
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Security Report */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChartOutlined style={{ color: '#1890ff' }} />
            Admin Güvenlik Raporu (Son 7 Gün)
          </div>
        }
        style={{ marginTop: '24px' }}
        extra={
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => message.info('Güvenlik raporu indirme özelliği yakında eklenecek')}
          >
            Raporu İndir
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card size="small">
              <Statistic
                title="Toplam Güvenlik Olayı"
                value={securityAlerts.length}
                prefix={<AlertOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small">
              <Statistic
                title="Çözülen Olaylar"
                value={securityAlerts.filter(a => a.resolved).length}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small">
              <Statistic
                title="Kritik Tehditler"
                value={securityAlerts.filter(a => a.severity === 'critical').length}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>
        
        <Divider />
        
        <Alert
          message="Güvenlik Önerileri"
          description="Sistem güvenliğini artırmak için aşağıdaki önerileri değerlendirin:"
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />
        
        <List
          size="small"
          dataSource={[
            'Tüm tenant\'larda 2FA zorunlu hale getirin',
            'Güçlü şifre politikası uygulayın',
            'IP whitelist\'leri düzenli olarak güncelleyin',
            'Güvenlik loglarını günlük olarak inceleyin',
            'Kullanıcı güvenlik eğitimleri düzenleyin'
          ]}
          renderItem={(item) => (
            <List.Item>
              <Text>{item}</Text>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
} 