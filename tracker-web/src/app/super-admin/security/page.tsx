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
  Dropdown,
  Spin,
  App
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
import { apiRequest } from '@/utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5143/api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Step } = Steps;

// Alert types and severity levels for UI

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
  const { modal, message: messageApi } = App.useApp();
  const [securityAlerts, setSecurityAlerts] = useState<any[]>([]);
  const [tenantSecurityScores, setTenantSecurityScores] = useState<any[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<any[]>([]);
  const [lockedAccounts, setLockedAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableTenants, setAvailableTenants] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    tenantId: undefined,
    alertType: undefined,
    severity: undefined,
    status: undefined
  });
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState<any>(null);
  const [deleteIPModalVisible, setDeleteIPModalVisible] = useState(false);
  const [ipToDelete, setIpToDelete] = useState<any>(null);

  // Data fetching functions
  const fetchSecurityAlerts = async () => {
    try {
      console.log('Fetching security alerts...');
      const response = await apiRequest(`${API_BASE_URL}/admin/security/alerts`);
      console.log('Security alerts response:', response);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Security alerts API error:', errorText);
        throw new Error(`Güvenlik alarmları alınamadı: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Security Alerts API Response:', data);
      setSecurityAlerts(data.items || data.Items || []);
    } catch (err) {
      console.error('Security alerts fetch error:', err);
      setError(`Güvenlik alarmları yüklenirken hata oluştu: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
    }
  };

  const fetchTenantSecurityScores = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/security/tenant-scores`);
      if (!response.ok) throw new Error('Tenant güvenlik skorları alınamadı');
      
      const data = await response.json();
      console.log('Tenant Security Scores API Response:', data);
      setTenantSecurityScores(data || []);
    } catch (err) {
      console.error('Tenant security scores fetch error:', err);
      setError('Tenant güvenlik skorları yüklenirken hata oluştu');
    }
  };

  const fetchBlockedIPs = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/security/blocked-ips`);
      if (!response.ok) throw new Error('Engellenen IP\'ler alınamadı');
      
      const data = await response.json();
      console.log('Blocked IPs API Response:', data);
      console.log('Blocked IPs items:', data.items || data.Items || []);
      setBlockedIPs(data.items || data.Items || []);
    } catch (err) {
      console.error('Blocked IPs fetch error:', err);
      setError('Engellenen IP\'ler yüklenirken hata oluştu');
    }
  };

  const fetchLockedAccounts = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/users`);
      if (!response.ok) throw new Error('Kullanıcı listesi alınamadı');
      
      const data = await response.json();
      console.log('Users API Response:', data);
      // Filter locked accounts from all users
      const lockedUsers = (data.items || data.Items || [])?.filter((user: any) => 
        (user.isLocked || user.IsLocked) === true
      ) || [];
      console.log('Locked users:', lockedUsers);
      setLockedAccounts(lockedUsers);
    } catch (err) {
      console.error('Locked accounts fetch error:', err);
      setError('Kilitli hesaplar yüklenirken hata oluştu');
    }
  };

  const fetchAvailableTenants = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/tenants?page=1&pageSize=100`);
      if (!response.ok) throw new Error('Tenant listesi alınamadı');
      
      const data = await response.json();
      console.log('Tenants API Response:', data);
      setAvailableTenants(data.items || data.Items || []);
    } catch (err) {
      console.error('Available tenants fetch error:', err);
      setError('Tenant listesi yüklenirken hata oluştu');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchSecurityAlerts(),
        fetchTenantSecurityScores(),
        fetchBlockedIPs(),
        fetchLockedAccounts(),
        fetchAvailableTenants()
      ]);
    } catch (err) {
      console.error('Data fetch error:', err);
      setError('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  React.useEffect(() => {
    fetchAllData();
  }, []);

  // Statistics
  const stats = useMemo(() => [
    {
      title: 'Aktif Tehditler',
      value: securityAlerts.filter(a => !(a.resolved || a.Resolved)).length,
      icon: <ExclamationCircleOutlined />,
      color: '#ff4d4f',
      gradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
    },
    {
      title: 'Ortalama Güvenlik Skoru',
      value: tenantSecurityScores.length > 0 
        ? `${Math.round(tenantSecurityScores.reduce((sum, t) => sum + (t.securityScore || t.SecurityScore || 0), 0) / tenantSecurityScores.length)}%`
        : '0%',
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
      if (filters.tenantId && (alert.tenantId || alert.TenantId) !== filters.tenantId) return false;
      if (filters.alertType && (alert.type || alert.Type) !== filters.alertType) return false;
      if (filters.severity && (alert.severity || alert.Severity) !== filters.severity) return false;
      if (filters.status && (alert.status || alert.Status) !== filters.status) return false;
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
      render: (_, record) => {
        const timeValue = record.timestamp || record.Timestamp || '';
        if (!timeValue) return <Text type="secondary">-</Text>;
        
        try {
          const date = new Date(timeValue);
          if (isNaN(date.getTime())) return <Text type="secondary">Geçersiz Tarih</Text>;
          
          return (
            <div>
              <div>{date.toLocaleDateString('tr-TR')}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {date.toLocaleTimeString('tr-TR')}
              </div>
            </div>
          );
        } catch (error) {
          return <Text type="secondary">Geçersiz Tarih</Text>;
        }
      }
    },
    {
      title: 'Tür',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type, record) => {
        const typeValue = type || record.Type || '';
        if (!typeValue) return <Text type="secondary">-</Text>;
        
        return (
          <Tag color={getAlertTypeColor(typeValue)} icon={getAlertTypeIcon(typeValue)}>
            {alertTypes.find(t => t.value === typeValue)?.label || typeValue}
          </Tag>
        );
      }
    },
    {
      title: 'Önem',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity, record) => {
        const severityValue = severity || record.Severity || '';
        if (!severityValue) return <Text type="secondary">-</Text>;
        
        return (
          <Tag color={getSeverityColor(severityValue)} icon={getSeverityIcon(severityValue)}>
            {severityLevels.find(s => s.value === severityValue)?.label || severityValue}
          </Tag>
        );
      }
    },
    {
      title: 'Açıklama',
      key: 'description',
      width: 250,
      render: (_, record) => {
        const description = record.description || record.Description || '';
        const details = record.details || record.Details || {};
        const ipAddress = details.ipAddress || details.IpAddress || '';
        
        return (
          <div>
            <div style={{ fontWeight: 500, marginBottom: '4px' }}>
              {description || '-'}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {ipAddress && `IP: ${ipAddress}`}
            </div>
          </div>
        );
      }
    },
    {
      title: 'Tenant',
      dataIndex: 'tenantName',
      key: 'tenantName',
      width: 150,
      render: (tenantName, record) => {
        const tenantValue = tenantName || record.TenantName || record.CompanyName || '';
        return tenantValue ? (
          <Tag color="blue" icon={<GlobalOutlined />}>
            {tenantValue}
          </Tag>
        ) : (
          <Text type="secondary">-</Text>
        );
      }
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status, record) => {
        const statusValue = status || record.Status || '';
        if (!statusValue) return <Text type="secondary">-</Text>;
        
        return (
          <Badge
            status={statusValue === 'active' ? 'error' : statusValue === 'investigating' ? 'processing' : 'success'}
            text={statusValue === 'active' ? 'Aktif' : statusValue === 'investigating' ? 'İnceleniyor' : 'Çözüldü'}
          />
        );
      }
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 150,
      render: (_, record) => {
        const alertId = record.id || record.Id || 0;
        const isResolved = record.resolved || record.Resolved || false;
        
        return (
          <Space>
            <Tooltip title="Detayları Görüntüle">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => handleViewAlertDetails(record)}
              />
            </Tooltip>
            {!isResolved && (
              <Tooltip title="Çözüldü Olarak İşaretle">
                <Button
                  type="text"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleResolveAlert(alertId)}
                />
              </Tooltip>
            )}
            <Tooltip title="Sil">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => showDeleteAlertModal(record)}
              />
            </Tooltip>
          </Space>
        );
      }
    }
  ];

  const securityScoreColumns: ColumnsType<any> = [
    {
      title: 'Tenant',
      dataIndex: 'tenantName',
      key: 'tenantName',
      width: 200,
      render: (tenantName, record) => {
        const tenantValue = tenantName || record.TenantName || record.CompanyName || '';
        return (
          <div>
            <div style={{ fontWeight: 500 }}>{tenantValue || '-'}</div>
          </div>
        );
      }
    },
    {
      title: 'Güvenlik Skoru',
      key: 'securityScore',
      width: 150,
      render: (_, record) => {
        const score = record.securityScore || record.SecurityScore || 0;
        return (
          <div>
            <Progress
              percent={score}
              strokeColor={getSecurityScoreColor(score)}
              format={(percent) => `${percent}%`}
            />
          </div>
        );
      }
    },
    {
      title: '2FA',
      dataIndex: 'twoFactorEnabled',
      key: 'twoFactorEnabled',
      width: 100,
      render: (enabled, record) => {
        const isEnabled = enabled || record.TwoFactorEnabled || false;
        return (
          <Badge
            status={isEnabled ? 'success' : 'error'}
            text={isEnabled ? 'Aktif' : 'Pasif'}
          />
        );
      }
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
          <div>{record.lastSecurityAudit ? new Date(record.lastSecurityAudit).toLocaleDateString('tr-TR') : 'Henüz denetim yapılmadı'}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.lastSecurityAudit ? new Date(record.lastSecurityAudit).toLocaleTimeString('tr-TR') : ''}
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
      render: (_, record) => (
        <Text code>{record.ipAddress || record.IpAddress || 'N/A'}</Text>
      )
    },
    {
      title: 'Sebep',
      dataIndex: 'reason',
      key: 'reason',
      width: 200,
      render: (_, record) => (record.reason || record.Reason || 'Bilinmiyor')
    },
    {
      title: 'Tenant',
      dataIndex: 'tenantName',
      key: 'tenantName',
      width: 150,
      render: (_, record) => (
        <Tag color="blue">{record.tenantName || record.TenantName || 'N/A'}</Tag>
      )
    },
    {
      title: 'Engellenme Tarihi',
      key: 'blockedAt',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.blockedAt || record.BlockedAt ? new Date(record.blockedAt || record.BlockedAt).toLocaleDateString('tr-TR') : 'N/A'}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.blockedAt || record.BlockedAt ? new Date(record.blockedAt || record.BlockedAt).toLocaleTimeString('tr-TR') : ''}
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
      render: (_, record) => (
        <Tag color="red">{record.attemptCount || record.AttemptCount || 0}</Tag>
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
              onClick={() => handleUnblockIP(record.id || record.Id || 0)}
            />
          </Tooltip>
                     <Tooltip title="Sil">
             <Button
               type="text"
               danger
               icon={<DeleteOutlined />}
               onClick={() => showDeleteIPModal(record)}
             />
           </Tooltip>
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
          <div style={{ fontWeight: 500 }}>{record.fullName || 'Bilinmeyen Kullanıcı'}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.email || 'N/A'}</div>
        </div>
      )
    },
    {
      title: 'Tenant',
      dataIndex: 'tenantName',
      key: 'tenantName',
      width: 150,
      render: (tenantName) => (
        <Tag color="blue">{tenantName || 'N/A'}</Tag>
      )
    },
    {
      title: 'Rol',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 120,
      render: (roleName) => (
        <Tag color="purple">{roleName || 'N/A'}</Tag>
      )
    },
    {
      title: 'Durum',
      dataIndex: 'isLocked',
      key: 'isLocked',
      width: 100,
      render: (isLocked) => (
        <Badge
          status={isLocked ? 'error' : 'success'}
          text={isLocked ? 'Kilitli' : 'Aktif'}
        />
      )
    },
    {
      title: 'Son Giriş',
      key: 'lastLogin',
      width: 150,
      render: (_, record) => (
        record.lastLogin ? (
          <div>
            <div>{new Date(record.lastLogin).toLocaleDateString('tr-TR')}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {new Date(record.lastLogin).toLocaleTimeString('tr-TR')}
            </div>
          </div>
        ) : (
          <Text type="secondary">Hiç giriş yapmamış</Text>
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
              onClick={() => handleUnlockAccount(record.id || record.Id || 0)}
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

  const handleViewAlertDetails = async (alert: any) => {
    try {
      console.log('Fetching security alert details for alert:', alert);
      
      const response = await apiRequest(`${API_BASE_URL}/admin/security/alerts/${alert.id || alert.Id}`);
      console.log('Security alert details response:', response);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Security alert details API error:', errorText);
        throw new Error(`Güvenlik alarmı detayları alınamadı: ${response.status} ${response.statusText}`);
      }
      
      const details = await response.json();
      console.log('Security alert details data:', details);
      console.log('Details structure:', {
        title: details.title || details.Title,
        description: details.description || details.Description,
        severity: details.severity || details.Severity,
        category: details.category || details.Category,
        impact: details.impact || details.Impact,
        resolution: details.resolution || details.Resolution,
        details: details.details || details.Details,
        actions: details.actions || details.Actions,
        timeline: details.timeline || details.Timeline
      });
      
      modal.info({
        title: 'Güvenlik Alarmı Detayları',
        width: 600,
        centered: true,
        getContainer: () => document.body,
        style: {
          top: '50%',
          transform: 'translateY(-50%)',
          margin: 0
        },
        styles: {
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(2px)'
          }
        },
        content: (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Tag color={getSeverityColor(details.severity || details.Severity || 'medium')}>{details.severity || details.Severity || 'Bilinmiyor'}</Tag>
              <Tag color="default">{details.category || details.Category || 'Genel'}</Tag>
            </div>
            <Title level={4}>{details.title || details.Title || 'Başlık Yok'}</Title>
            <Text>{details.description || details.Description || 'Açıklama mevcut değil'}</Text>
            
            <Divider />
            
            <Title level={5}>Etki</Title>
            <Text>{details.impact || details.Impact || 'Etki bilgisi mevcut değil'}</Text>
            
            <Divider />
            
            <Title level={5}>Çözüm</Title>
            <Text>{details.resolution || details.Resolution || 'Çözüm bilgisi mevcut değil'}</Text>
            
            <Divider />
            
            <Title level={5}>Detaylar</Title>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Deneme Sayısı">{(details.details || details.Details)?.attemptCount || (details.details || details.Details)?.AttemptCount || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="IP Adresi">{(details.details || details.Details)?.ipAddress || (details.details || details.Details)?.IpAddress || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Konum">{(details.details || details.Details)?.location || (details.details || details.Details)?.Location || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Cihaz">{(details.details || details.Details)?.deviceType || (details.details || details.Details)?.DeviceType || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Tarayıcı">{(details.details || details.Details)?.browser || (details.details || details.Details)?.Browser || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="İşletim Sistemi">{(details.details || details.Details)?.os || (details.details || details.Details)?.Os || 'N/A'}</Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Title level={5}>Önerilen Aksiyonlar</Title>
            <List
              size="small"
              dataSource={details.actions || details.Actions || []}
              renderItem={(action: string, index: number) => (
                <List.Item key={index}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Badge count={index + 1} style={{ backgroundColor: '#1890ff' }} />
                    <Text>{action}</Text>
                  </div>
                </List.Item>
              )}
            />
            
            {(details.timeline || details.Timeline) && (details.timeline || details.Timeline).length > 0 && (
              <>
                <Divider />
                <Title level={5}>Zaman Çizelgesi</Title>
                <Timeline
                  items={(details.timeline || details.Timeline).map((item: any, index: number) => ({
                    key: index,
                    children: (
                      <div>
                        <div style={{ fontWeight: 500 }}>{item.event || item.eventName || item.Event || item.EventName || 'Bilinmeyen Olay'}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {item.time || item.Time ? new Date(item.time || item.Time).toLocaleString('tr-TR') : 'Tarih bilgisi yok'}
                        </div>
                      </div>
                    )
                  }))}
                />
              </>
            )}
          </div>
        )
      });
    } catch (err) {
      console.error('Security alert details fetch error:', err);
      messageApi.error(`Güvenlik alarmı detayları yüklenirken hata oluştu: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
    }
  };

  const handleResolveAlert = async (alertId: number) => {
    try {
              const response = await apiRequest(`${API_BASE_URL}/admin/security/alerts/${alertId}/resolve`, {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Uyarı çözülemedi');
      
      messageApi.success('Uyarı çözüldü olarak işaretlendi');
      fetchSecurityAlerts(); // Refresh the list
    } catch (err) {
      messageApi.error('Uyarı çözülürken hata oluştu');
      console.error('Resolve alert error:', err);
    }
  };

  const handleDeleteAlert = async (alertId: number) => {
    try {
              const response = await apiRequest(`${API_BASE_URL}/admin/security/alerts/${alertId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Uyarı silinemedi');
      
      messageApi.success('Uyarı silindi');
      fetchSecurityAlerts(); // Refresh the list
    } catch (err) {
      messageApi.error('Uyarı silinirken hata oluştu');
      console.error('Delete alert error:', err);
    }
  };

  const showDeleteAlertModal = (alert: any) => {
    setAlertToDelete(alert);
    setDeleteModalVisible(true);
  };

  const confirmDeleteAlert = async () => {
    if (alertToDelete) {
      const alertId = alertToDelete.id || alertToDelete.Id || 0;
      await handleDeleteAlert(alertId);
      setDeleteModalVisible(false);
      setAlertToDelete(null);
    }
  };

  const handleViewSecurityReport = async (tenant: any) => {
    try {
      // Use tenantId from the security score record
      const tenantId = tenant.tenantId || tenant.TenantId || tenant.id || tenant.Id || 0;
      console.log('Viewing security report for tenant:', tenant, 'tenantId:', tenantId);
      
      if (!tenantId || tenantId === 0) {
        messageApi.error('Geçersiz tenant ID');
        return;
      }
      
      const response = await apiRequest(`${API_BASE_URL}/admin/security/tenants/${tenantId}/report`);
      if (!response.ok) {
        if (response.status === 404) {
          const tenantName = tenant.tenantName || tenant.TenantName || tenant.CompanyName || tenantId;
          messageApi.error(`Tenant bulunamadı: ${tenantName}`);
          return;
        }
        throw new Error('Güvenlik raporu alınamadı');
      }
      
      const report = await response.json();
      console.log('Security report data:', report);
      
              modal.info({
          title: `${report.tenantName || report.TenantName || report.CompanyName || 'Bilinmeyen Tenant'} Güvenlik Raporu`,
          width: 700,
          centered: true,
          getContainer: () => document.body,
          style: {
            top: '50%',
            transform: 'translateY(-50%)',
            margin: 0
          },
          styles: {
            mask: {
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(2px)'
            }
          },
        content: (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Tag color={report.riskLevel || report.RiskLevel === 'High' ? 'red' : report.riskLevel || report.RiskLevel === 'Medium' ? 'orange' : 'green'}>
                {report.riskLevel || report.RiskLevel || 'Low'}
              </Tag>
              <Text strong>Güvenlik Skoru: {report.securityScore || report.SecurityScore || 0}/100</Text>
            </div>
            
            <Divider />
            
            <Title level={5}>Özet</Title>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Statistic title="Toplam Kullanıcı" value={report.summary?.totalUsers || report.Summary?.totalUsers || 0} />
              </Col>
              <Col span={6}>
                <Statistic title="Aktif Kullanıcı" value={report.summary?.activeUsers || report.Summary?.activeUsers || 0} />
              </Col>
              <Col span={6}>
                <Statistic title="Kilitli Kullanıcı" value={report.summary?.lockedUsers || report.Summary?.lockedUsers || 0} />
              </Col>
              <Col span={6}>
                <Statistic title="API Anahtarları" value={report.summary?.apiKeys || report.Summary?.apiKeys || 0} />
              </Col>
            </Row>
            
            <Divider />
            
            <Title level={5}>Güvenlik Sorunları</Title>
            <List
              size="small"
              dataSource={report.securityIssues || report.SecurityIssues || []}
              renderItem={(issue: any) => (
                <List.Item>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                      <Text strong>{issue.type || issue.Type || 'Bilinmeyen'}</Text>
                      <br />
                      <Text type="secondary">{issue.count || issue.Count || 0} adet</Text>
                    </div>
                    <Tag color={issue.severity || issue.Severity === 'High' ? 'red' : issue.severity || issue.Severity === 'Medium' ? 'orange' : 'green'}>
                      {issue.severity || issue.Severity || 'Low'}
                    </Tag>
                  </div>
                </List.Item>
              )}
            />
            
            <Divider />
            
            <Title level={5}>Öneriler</Title>
            <List
              size="small"
              dataSource={report.recommendations || report.Recommendations || []}
              renderItem={(rec: string, index: number) => (
                <List.Item>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Badge count={index + 1} style={{ backgroundColor: '#1890ff' }} />
                    <Text>{rec || 'Öneri mevcut değil'}</Text>
                  </div>
                </List.Item>
              )}
            />
          </div>
        )
      });
    } catch (err) {
      console.error('Security report fetch error:', err);
      messageApi.error('Güvenlik raporu yüklenirken hata oluştu');
    }
  };

  const handleDownloadSecurityReport = async () => {
    try {
      // Use the first available tenant from the actual tenant list
      const validTenantId = availableTenants.length > 0 ? availableTenants[0].id : 1;
      
      // Generate a new security report for the last 7 days
              const generateResponse = await apiRequest(`${API_BASE_URL}/admin/security/reports/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId: validTenantId,
          reportType: 'weekly',
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString(),
          title: 'Admin Güvenlik Raporu (Son 7 Gün)',
          description: 'Son 7 günlük güvenlik durumu raporu'
        })
      });

      if (!generateResponse.ok) throw new Error('Güvenlik raporu oluşturulamadı');
      
      const report = await generateResponse.json();
      
      // Download the report
              const downloadResponse = await apiRequest(`${API_BASE_URL}/admin/security/reports/${report.id}/download?format=pdf`);
      
      if (!downloadResponse.ok) throw new Error('Rapor indirilemedi');
      
      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security_report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      messageApi.success('Güvenlik raporu başarıyla indirildi');
    } catch (err) {
      console.error('Security report download error:', err);
      messageApi.error('Güvenlik raporu indirilirken hata oluştu');
    }
  };

  const handleSecuritySettings = async (tenant: any) => {
    try {
      // Use tenantId from the security score record
      const tenantId = tenant.tenantId || tenant.TenantId || tenant.id || tenant.Id || 0;
      console.log('Viewing security settings for tenant:', tenant, 'tenantId:', tenantId);
      
      if (!tenantId || tenantId === 0) {
        messageApi.error('Geçersiz tenant ID');
        return;
      }
      
      const response = await apiRequest(`${API_BASE_URL}/admin/security/tenants/${tenantId}/settings`);
      if (!response.ok) {
        if (response.status === 404) {
          const tenantName = tenant.tenantName || tenant.TenantName || tenant.CompanyName || tenantId;
          messageApi.error(`Tenant bulunamadı: ${tenantName}`);
          return;
        }
        throw new Error('Güvenlik ayarları alınamadı');
      }
      
      const settings = await response.json();
      
      modal.info({
        title: `${tenant.tenantName || tenant.TenantName || tenant.CompanyName || 'Bilinmeyen Tenant'} Güvenlik Ayarları`,
        width: 800,
        centered: true,
        getContainer: () => document.body,
        style: { top: '50%', transform: 'translateY(-50%)', margin: 0 },
        styles: { mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(2px)' } },
        content: (
          <div>
            <Tabs defaultActiveKey="2fa">
              <Tabs.TabPane tab="İki Faktörlü Kimlik Doğrulama" key="2fa">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="2FA Zorunlu">
                    <Tag color={settings.requireTwoFactor ? 'green' : 'red'}>
                      {settings.requireTwoFactor ? 'Evet' : 'Hayır'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="SMS 2FA">
                    <Tag color={settings.allowSmsTwoFactor ? 'green' : 'red'}>
                      {settings.allowSmsTwoFactor ? 'Aktif' : 'Pasif'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email 2FA">
                    <Tag color={settings.allowEmailTwoFactor ? 'green' : 'red'}>
                      {settings.allowEmailTwoFactor ? 'Aktif' : 'Pasif'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Authenticator App">
                    <Tag color={settings.allowAuthenticatorApp ? 'green' : 'red'}>
                      {settings.allowAuthenticatorApp ? 'Aktif' : 'Pasif'}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Tabs.TabPane>
              
              <Tabs.TabPane tab="Şifre Politikası" key="password">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Minimum Şifre Uzunluğu">
                    {settings.minimumPasswordLength} karakter
                  </Descriptions.Item>
                  <Descriptions.Item label="Büyük Harf Zorunlu">
                    <Tag color={settings.requireUppercase ? 'green' : 'red'}>
                      {settings.requireUppercase ? 'Evet' : 'Hayır'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Küçük Harf Zorunlu">
                    <Tag color={settings.requireLowercase ? 'green' : 'red'}>
                      {settings.requireLowercase ? 'Evet' : 'Hayır'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Rakam Zorunlu">
                    <Tag color={settings.requireNumbers ? 'green' : 'red'}>
                      {settings.requireNumbers ? 'Evet' : 'Hayır'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Özel Karakter Zorunlu">
                    <Tag color={settings.requireSpecialCharacters ? 'green' : 'red'}>
                      {settings.requireSpecialCharacters ? 'Evet' : 'Hayır'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Şifre Geçerlilik Süresi">
                    {settings.passwordExpiryDays} gün
                  </Descriptions.Item>
                </Descriptions>
              </Tabs.TabPane>
              
              <Tabs.TabPane tab="Oturum Yönetimi" key="session">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Oturum Zaman Aşımı">
                    {settings.sessionTimeoutMinutes} dakika
                  </Descriptions.Item>
                  <Descriptions.Item label="Şifre Değişikliğinde Çıkış">
                    <Tag color={settings.forceLogoutOnPasswordChange ? 'green' : 'red'}>
                      {settings.forceLogoutOnPasswordChange ? 'Evet' : 'Hayır'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Eşzamanlı Oturum">
                    <Tag color={settings.allowConcurrentSessions ? 'green' : 'red'}>
                      {settings.allowConcurrentSessions ? 'Evet' : 'Hayır'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Maksimum Eşzamanlı Oturum">
                    {settings.maxConcurrentSessions} adet
                  </Descriptions.Item>
                </Descriptions>
              </Tabs.TabPane>
              
              <Tabs.TabPane tab="Giriş Güvenliği" key="login">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Maksimum Başarısız Giriş">
                    {settings.maxFailedLoginAttempts} deneme
                  </Descriptions.Item>
                  <Descriptions.Item label="Hesap Kilitleme Süresi">
                    {settings.accountLockoutDurationMinutes} dakika
                  </Descriptions.Item>
                  <Descriptions.Item label="Captcha Zorunlu">
                    <Tag color={settings.requireCaptchaAfterFailedAttempts ? 'green' : 'red'}>
                      {settings.requireCaptchaAfterFailedAttempts ? 'Evet' : 'Hayır'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Captcha Eşiği">
                    {settings.captchaThreshold} deneme
                  </Descriptions.Item>
                </Descriptions>
              </Tabs.TabPane>
            </Tabs>
          </div>
        ),
      });
    } catch (err) {
      console.error('Security settings fetch error:', err);
      messageApi.error('Güvenlik ayarları yüklenirken hata oluştu');
    }
  };

  const handleUnblockIP = async (ipId: number) => {
    try {
              const response = await apiRequest(`${API_BASE_URL}/admin/security/blocked-ips/${ipId}/unblock`, {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('IP engeli kaldırılamadı');
      
      messageApi.success('IP adresi engeli kaldırıldı');
      fetchBlockedIPs(); // Refresh the list
    } catch (err) {
      messageApi.error('IP engeli kaldırılırken hata oluştu');
      console.error('Unblock IP error:', err);
    }
  };

  const handleDeleteBlockedIP = async (ipId: number) => {
    try {
      // Backend'de silme endpoint'i yoksa frontend'den kaldır
      setBlockedIPs(ips => ips.filter(ip => (ip.id || ip.Id) !== ipId));
      messageApi.success('IP engeli silindi');
    } catch (err) {
      messageApi.error('IP engeli silinirken hata oluştu');
      console.error('Delete IP error:', err);
    }
  };

  const showDeleteIPModal = (ip: any) => {
    setIpToDelete(ip);
    setDeleteIPModalVisible(true);
  };

  const confirmDeleteIP = async () => {
    if (ipToDelete) {
      const ipId = ipToDelete.id || ipToDelete.Id || 0;
      await handleDeleteBlockedIP(ipId);
      setDeleteIPModalVisible(false);
      setIpToDelete(null);
    }
  };

  const handleUnlockAccount = async (accountId: number) => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/users/${accountId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isLocked: false
        })
      });
      
      if (!response.ok) throw new Error('Hesap kilidi açılamadı');
      
      messageApi.success('Hesap kilidi açıldı');
      fetchLockedAccounts(); // Refresh the list
    } catch (err) {
      messageApi.error('Hesap kilidi açılırken hata oluştu');
      console.error('Unlock account error:', err);
    }
  };

  const handleViewSecurityHistory = async (account: any) => {
    try {
      const accountId = account.id || account.Id || 0;
      console.log('Viewing security history for account:', account, 'accountId:', accountId);
      
      if (!accountId || accountId === 0) {
        messageApi.error('Geçersiz account ID');
        return;
      }
      
      const response = await apiRequest(`${API_BASE_URL}/admin/security/users/${accountId}/history`);
      if (!response.ok) throw new Error('Güvenlik geçmişi alınamadı');
      
      const history = await response.json();
      
              modal.info({
          title: `${history.userName || history.UserName || 'Bilinmeyen Kullanıcı'} Güvenlik Geçmişi`,
          width: 600,
          centered: true,
          getContainer: () => document.body,
          style: {
            top: '50%',
            transform: 'translateY(-50%)',
            margin: 0
          },
          styles: {
            mask: {
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(2px)'
            }
          },
        content: (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>Hesap Durumu:</Text>
              <Tag color={history.securityStats.accountLocked ? 'red' : 'green'} style={{ marginLeft: '8px' }}>
                {history.securityStats.accountLocked ? 'Kilitli' : 'Aktif'}
              </Tag>
            </div>
            
            <Divider />
            
            <Title level={5}>İstatistikler</Title>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Statistic title="Toplam Giriş" value={history.securityStats.totalLogins} />
              </Col>
              <Col span={6}>
                <Statistic title="Başarısız Giriş" value={history.securityStats.failedLogins} />
              </Col>
              <Col span={6}>
                <Statistic title="Şifre Değişimi" value={history.securityStats.passwordChanges} />
              </Col>
              <Col span={6}>
                <Statistic title="Son Giriş" value={new Date(history.securityStats.lastLogin).toLocaleDateString('tr-TR')} />
              </Col>
            </Row>
            
            <Divider />
            
            <Title level={5}>Güvenlik Olayları</Title>
            <Timeline
              items={history.securityEvents.map((event: any) => ({
                color: event.success ? 'green' : 'red',
                children: (
                  <div>
                    <div style={{ fontWeight: 500 }}>{event.type}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {new Date(event.timestamp).toLocaleString('tr-TR')} - {event.ipAddress}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      {event.userAgent}
                    </div>
                  </div>
                )
              }))}
            />
          </div>
        )
      });
    } catch (err) {
      console.error('Security history fetch error:', err);
      messageApi.error('Güvenlik geçmişi yüklenirken hata oluştu');
    }
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

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Güvenlik verileri yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Hata"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={fetchAllData}>
              Tekrar Dene
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={2}>
        <SafetyOutlined /> Güvenlik Merkezi
        <Button 
          size="small" 
          style={{ marginLeft: '16px' }}
          onClick={async () => {
            try {
              const response = await apiRequest(`${API_BASE_URL}/admin/security/test`);
              if (response.ok) {
                const data = await response.json();
                messageApi.success(`Security API çalışıyor: ${data.message}`);
              } else {
                messageApi.error('Security API çalışmıyor');
              }
            } catch (err) {
              messageApi.error(`Security API test hatası: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
            }
          }}
        >
          API Test
        </Button>
        <Button 
          size="small" 
          style={{ marginLeft: '8px' }}
          onClick={async () => {
            try {
              const response = await apiRequest(`${API_BASE_URL}/admin/security/debug-alerts`);
              if (response.ok) {
                const data = await response.json();
                console.log('Debug data:', data);
                messageApi.info(`Toplam: ${data.totalAlerts}, Tenant'lı: ${data.alertsWithTenant}, Tenant'sız: ${data.alertsWithoutTenant}`);
              } else {
                messageApi.error('Debug başarısız');
              }
            } catch (err) {
              messageApi.error(`Debug hatası: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
            }
          }}
        >
          Debug Alarmlar
        </Button>
        <Button 
          size="small" 
          style={{ marginLeft: '8px' }}
          onClick={async () => {
            try {
              const response = await apiRequest(`${API_BASE_URL}/admin/security/create-test-alerts`);
              if (response.ok) {
                const data = await response.json();
                messageApi.success(`${data.count} adet test alarmı oluşturuldu`);
                fetchAllData(); // Verileri yenile
              } else {
                const errorData = await response.json();
                messageApi.error(`Test alarmları oluşturulamadı: ${errorData.error}`);
              }
            } catch (err) {
              messageApi.error(`Test alarmları oluşturma hatası: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
            }
          }}
        >
          Test Alarmları Oluştur
        </Button>
      </Title>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={fetchAllData}
          loading={loading}
        >
          Yenile
        </Button>
      </div>

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
              value={filters.tenantId || undefined}
              onChange={(value) => handleFilterChange('tenantId', value)}
              allowClear
              getPopupContainer={(triggerNode) => document.body}
              onMouseDown={(e) => e.stopPropagation()}
              styles={{ popup: { root: { zIndex: 1050 } } }}
            >
              {tenantSecurityScores.map(tenant => (
                <Option key={tenant.tenantId || tenant.TenantId || Math.random()} value={tenant.tenantId || tenant.TenantId || 0}>
                  {tenant.tenantName || tenant.TenantName || 'Bilinmeyen Tenant'}
                </Option>
              ))}
            </Select>
                                     <Select
              placeholder="Tür"
              style={{ width: 120 }}
              value={filters.alertType || undefined}
              onChange={(value) => handleFilterChange('alertType', value)}
              allowClear
              getPopupContainer={(triggerNode) => document.body}
              onMouseDown={(e) => e.stopPropagation()}
              styles={{ popup: { root: { zIndex: 1050 } } }}
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
              value={filters.severity || undefined}
              onChange={(value) => handleFilterChange('severity', value)}
              allowClear
              getPopupContainer={(triggerNode) => document.body}
              onMouseDown={(e) => e.stopPropagation()}
              styles={{ popup: { root: { zIndex: 1050 } } }}
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
          rowKey={(record) => String(record.id || record.Id || Math.random())}
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
          rowKey={(record) => String(record.id || record.Id || record.tenantId || Math.random())}
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
              rowKey={(record) => String(record.id || record.Id || Math.random())}
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
              rowKey={(record) => String(record.id || record.Id || Math.random())}
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
            onClick={handleDownloadSecurityReport}
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

       {/* Delete Alert Modal */}
       <Modal
         title="Güvenlik Alarmını Sil"
         open={deleteModalVisible}
         onOk={confirmDeleteAlert}
         onCancel={() => {
           setDeleteModalVisible(false);
           setAlertToDelete(null);
         }}
         okText="Sil"
         cancelText="İptal"
         okButtonProps={{ danger: true }}
         centered={true}
         destroyOnHidden={true}
         getContainer={() => document.body}
         style={{ top: '50%', transform: 'translateY(-50%)', margin: 0 }}
         styles={{ mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(2px)' } }}
       >
         <p>
           <strong>{alertToDelete?.title}</strong> başlıklı güvenlik alarmını silmek istediğinizden emin misiniz?
         </p>
         <p>Bu işlem geri alınamaz.</p>
       </Modal>

       {/* Delete IP Modal */}
       <Modal
         title="IP Engelini Sil"
         open={deleteIPModalVisible}
         onOk={confirmDeleteIP}
         onCancel={() => {
           setDeleteIPModalVisible(false);
           setIpToDelete(null);
         }}
         okText="Sil"
         cancelText="İptal"
         okButtonProps={{ danger: true }}
         centered={true}
         destroyOnHidden={true}
         getContainer={() => document.body}
         style={{ top: '50%', transform: 'translateY(-50%)', margin: 0 }}
         styles={{ mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(2px)' } }}
       >
         <p>
           <strong>{ipToDelete?.ipAddress}</strong> IP adresinin engelini silmek istediğinizden emin misiniz?
         </p>
         <p>Bu işlem geri alınamaz.</p>
       </Modal>
     </div>
   );
 } 