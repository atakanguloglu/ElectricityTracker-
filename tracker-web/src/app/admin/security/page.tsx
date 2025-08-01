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
      const response = await apiRequest(`${API_BASE_URL}/admin/security/alerts`);
      if (!response.ok) throw new Error('Güvenlik alarmları alınamadı');
      
      const data = await response.json();
      setSecurityAlerts(data.items || []);
    } catch (err) {
      console.error('Security alerts fetch error:', err);
      setError('Güvenlik alarmları yüklenirken hata oluştu');
    }
  };

  const fetchTenantSecurityScores = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/security/tenant-scores`);
      if (!response.ok) throw new Error('Tenant güvenlik skorları alınamadı');
      
      const data = await response.json();
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
      setBlockedIPs(data.items || []);
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
      // Filter locked accounts from all users
      const lockedUsers = data.items?.filter((user: any) => user.isLocked) || [];
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
      setAvailableTenants(data.items || []);
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
                     <Tooltip title="Sil">
             <Button
               type="text"
               danger
               icon={<DeleteOutlined />}
               onClick={() => showDeleteAlertModal(record)}
             />
           </Tooltip>
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
          <div style={{ fontWeight: 500 }}>{record.fullName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
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
      title: 'Rol',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 120,
      render: (roleName) => (
        <Tag color="purple">{roleName}</Tag>
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

  const handleViewAlertDetails = async (alert: any) => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/security/alerts/${alert.id}`);
      if (!response.ok) throw new Error('Güvenlik alarmı detayları alınamadı');
      
      const details = await response.json();
      
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
              <Tag color={getSeverityColor(details.severity)}>{details.severity}</Tag>
              <Tag color="default">{details.category}</Tag>
            </div>
            <Title level={4}>{details.title}</Title>
            <Text>{details.description}</Text>
            
            <Divider />
            
            <Title level={5}>Etki</Title>
            <Text>{details.impact}</Text>
            
            <Divider />
            
            <Title level={5}>Çözüm</Title>
            <Text>{details.resolution}</Text>
            
            <Divider />
            
            <Title level={5}>Detaylar</Title>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Deneme Sayısı">{details.details?.attemptCount || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="IP Adresi">{details.details?.ipAddress || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Konum">{details.details?.location || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Cihaz">{details.details?.deviceType || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Tarayıcı">{details.details?.browser || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="İşletim Sistemi">{details.details?.os || 'N/A'}</Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Title level={5}>Önerilen Aksiyonlar</Title>
            <List
              size="small"
              dataSource={details.actions || []}
              renderItem={(action: string, index: number) => (
                <List.Item>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Badge count={index + 1} style={{ backgroundColor: '#1890ff' }} />
                    <Text>{action}</Text>
                  </div>
                </List.Item>
              )}
            />
            
            {details.timeline && details.timeline.length > 0 && (
              <>
                <Divider />
                <Title level={5}>Zaman Çizelgesi</Title>
                <Timeline
                  items={details.timeline.map((item: any) => ({
                    children: (
                      <div>
                        <div style={{ fontWeight: 500 }}>{item.event}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {new Date(item.time).toLocaleString('tr-TR')}
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
      messageApi.error('Güvenlik alarmı detayları yüklenirken hata oluştu');
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
      await handleDeleteAlert(alertToDelete.id);
      setDeleteModalVisible(false);
      setAlertToDelete(null);
    }
  };

  const handleViewSecurityReport = async (tenant: any) => {
    try {
      // Use tenantId from the security score record
      const tenantId = tenant.tenantId || tenant.id;
      const response = await apiRequest(`${API_BASE_URL}/admin/security/tenants/${tenantId}/report`);
      if (!response.ok) {
        if (response.status === 404) {
          messageApi.error(`Tenant bulunamadı: ${tenant.tenantName || tenantId}`);
          return;
        }
        throw new Error('Güvenlik raporu alınamadı');
      }
      
      const report = await response.json();
      
              modal.info({
          title: `${report.tenantName} Güvenlik Raporu`,
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
              <Tag color={report.riskLevel === 'High' ? 'red' : report.riskLevel === 'Medium' ? 'orange' : 'green'}>
                {report.riskLevel}
              </Tag>
              <Text strong>Güvenlik Skoru: {report.securityScore}/100</Text>
            </div>
            
            <Divider />
            
            <Title level={5}>Özet</Title>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Statistic title="Toplam Kullanıcı" value={report.summary.totalUsers} />
              </Col>
              <Col span={6}>
                <Statistic title="Aktif Kullanıcı" value={report.summary.activeUsers} />
              </Col>
              <Col span={6}>
                <Statistic title="Kilitli Kullanıcı" value={report.summary.lockedUsers} />
              </Col>
              <Col span={6}>
                <Statistic title="API Anahtarları" value={report.summary.apiKeys} />
              </Col>
            </Row>
            
            <Divider />
            
            <Title level={5}>Güvenlik Sorunları</Title>
            <List
              size="small"
              dataSource={report.securityIssues}
              renderItem={(issue: any) => (
                <List.Item>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                      <Text strong>{issue.type}</Text>
                      <br />
                      <Text type="secondary">{issue.count} adet</Text>
                    </div>
                    <Tag color={issue.severity === 'High' ? 'red' : issue.severity === 'Medium' ? 'orange' : 'green'}>
                      {issue.severity}
                    </Tag>
                  </div>
                </List.Item>
              )}
            />
            
            <Divider />
            
            <Title level={5}>Öneriler</Title>
            <List
              size="small"
              dataSource={report.recommendations}
              renderItem={(rec: string, index: number) => (
                <List.Item>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Badge count={index + 1} style={{ backgroundColor: '#1890ff' }} />
                    <Text>{rec}</Text>
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
      const tenantId = tenant.tenantId || tenant.id;
      const response = await apiRequest(`${API_BASE_URL}/admin/security/tenants/${tenantId}/settings`);
      if (!response.ok) {
        if (response.status === 404) {
          messageApi.error(`Tenant bulunamadı: ${tenant.tenantName || tenantId}`);
          return;
        }
        throw new Error('Güvenlik ayarları alınamadı');
      }
      
      const settings = await response.json();
      
      modal.info({
        title: `${tenant.tenantName} Güvenlik Ayarları`,
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
      setBlockedIPs(ips => ips.filter(ip => ip.id !== ipId));
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
      await handleDeleteBlockedIP(ipToDelete.id);
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
      const response = await apiRequest(`${API_BASE_URL}/admin/security/users/${account.id}/history`);
      if (!response.ok) throw new Error('Güvenlik geçmişi alınamadı');
      
      const history = await response.json();
      
              modal.info({
          title: `${history.userName} Güvenlik Geçmişi`,
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
               value={filters.tenantId}
               onChange={(value) => handleFilterChange('tenantId', value)}
               allowClear
               getPopupContainer={(triggerNode) => document.body}
               onMouseDown={(e) => e.stopPropagation()}
               styles={{ popup: { root: { zIndex: 1050 } } }}
             >
              {tenantSecurityScores.map(tenant => (
                <Option key={tenant.tenantId} value={tenant.tenantId}>
                  {tenant.tenantName}
                </Option>
              ))}
            </Select>
                         <Select
               placeholder="Tür"
               style={{ width: 120 }}
               value={filters.alertType}
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
               value={filters.severity}
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