'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
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
    Drawer,
    Rate,
    App
} from 'antd';
import {
  RobotOutlined,
  MessageOutlined,
  SendOutlined,
  SmileOutlined,
  PaperClipOutlined,
  AudioOutlined,
  VideoCameraOutlined,
  PhoneOutlined,
  MailOutlined,
  FileTextOutlined,
  DownloadOutlined,
  FilterOutlined,
  SearchOutlined,
  EyeOutlined,
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
  CalendarOutlined,
  ClearOutlined,
  ExportOutlined,
  SecurityScanOutlined,
  StopOutlined,
  PlayCircleOutlined,
  FireOutlined,
  ThunderboltOutlined,
  DesktopOutlined,
  HddOutlined,
  WifiOutlined,
  SyncOutlined,
  BellOutlined,
  MailOutlined as MailIcon,
  MessageOutlined as MessageIcon,
  DashboardOutlined,
  MonitorOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  ThunderboltOutlined as LightningOutlined,
  DropboxOutlined,
  CarOutlined,
  ToolOutlined,
  CalculatorOutlined,
  BulbOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  HeatMapOutlined,
  CrownOutlined,
  StarOutlined,
  EnvironmentOutlined,
  CloudOutlined,
  SunOutlined,
  RiseOutlined,
  FallOutlined,
  CustomerServiceOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  FileOutlined,
  FolderOutlined,
  HistoryOutlined,
  LikeOutlined,
  DislikeOutlined,
  ShareAltOutlined,
  CopyOutlined,
  EditOutlined,
  PlusOutlined,
  MinusOutlined,
  CloseOutlined,
  CheckOutlined,
  LoadingOutlined,
  BarChartOutlined,
  ApiOutlined,
  FileExcelOutlined
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

const mockUsers = [
  { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@abc.com', tenantId: 1, avatar: 'AY' },
  { id: 2, name: 'Fatma Demir', email: 'fatma@xyz.com', tenantId: 2, avatar: 'FD' },
  { id: 3, name: 'Mehmet Kaya', email: 'mehmet@techsolutions.com', tenantId: 3, avatar: 'MK' },
  { id: 4, name: 'Ayşe Özkan', email: 'ayse@globalcorp.com', tenantId: 4, avatar: 'AÖ' },
  { id: 5, name: 'Ali Çelik', email: 'ali@startupinc.com', tenantId: 5, avatar: 'AÇ' }
];

const mockConversations = [
  {
    id: 1,
    userId: 1,
    userName: 'Ahmet Yılmaz',
    userEmail: 'ahmet@abc.com',
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    status: 'active',
    priority: 'medium',
    category: 'technical',
    lastMessage: 'Fatura sistemi ile ilgili sorun yaşıyorum',
    lastMessageTime: '2024-01-15T10:30:00',
    messageCount: 8,
    satisfaction: 4,
    agent: 'AI Bot',
    tags: ['fatura', 'teknik', 'sorun']
  },
  {
    id: 2,
    userId: 2,
    userName: 'Fatma Demir',
    userEmail: 'fatma@xyz.com',
    tenantId: 2,
    tenantName: 'XYZ Ltd.',
    status: 'resolved',
    priority: 'high',
    category: 'billing',
    lastMessage: 'Ödeme işlemi tamamlandı, teşekkürler',
    lastMessageTime: '2024-01-15T09:15:00',
    messageCount: 12,
    satisfaction: 5,
    agent: 'AI Bot',
    tags: ['ödeme', 'fatura', 'çözüldü']
  },
  {
    id: 3,
    userId: 3,
    userName: 'Mehmet Kaya',
    userEmail: 'mehmet@techsolutions.com',
    tenantId: 3,
    tenantName: 'Tech Solutions',
    status: 'pending',
    priority: 'low',
    category: 'general',
    lastMessage: 'Yeni özellik hakkında bilgi almak istiyorum',
    lastMessageTime: '2024-01-15T11:45:00',
    messageCount: 3,
    satisfaction: null,
    agent: 'AI Bot',
    tags: ['özellik', 'bilgi', 'yeni']
  }
];

const mockChatHistory = [
  {
    id: 1,
    conversationId: 1,
    sender: 'user',
    message: 'Merhaba, fatura sistemi ile ilgili sorun yaşıyorum',
    timestamp: '2024-01-15T10:25:00',
    attachments: []
  },
  {
    id: 2,
    conversationId: 1,
    sender: 'bot',
    message: 'Merhaba! Fatura sistemi ile ilgili sorununuzu dinliyorum. Hangi konuda yardıma ihtiyacınız var?',
    timestamp: '2024-01-15T10:25:30',
    attachments: []
  },
  {
    id: 3,
    conversationId: 1,
    sender: 'user',
    message: 'Fatura oluştururken hata alıyorum. "Sistem hatası" mesajı çıkıyor',
    timestamp: '2024-01-15T10:26:00',
    attachments: []
  },
  {
    id: 4,
    conversationId: 1,
    sender: 'bot',
    message: 'Anlıyorum. Bu sorunu çözmek için birkaç adım atalım:\n\n1. Tarayıcınızı yenileyin\n2. Farklı bir tarayıcı deneyin\n3. Hala sorun devam ederse, lütfen ekran görüntüsü paylaşın',
    timestamp: '2024-01-15T10:26:30',
    attachments: []
  },
  {
    id: 5,
    conversationId: 1,
    sender: 'user',
    message: 'Tarayıcıyı yeniledim ama sorun devam ediyor',
    timestamp: '2024-01-15T10:28:00',
    attachments: []
  },
  {
    id: 6,
    conversationId: 1,
    sender: 'bot',
    message: 'Bu durumda teknik ekibimize yönlendirmem gerekiyor. Sorununuz kaydedildi ve en kısa sürede size dönüş yapılacak. Ticket numaranız: #TKT-2024-001',
    timestamp: '2024-01-15T10:28:30',
    attachments: []
  }
];

const mockQuickActions = [
  {
    id: 1,
    title: 'Fatura Oluşturma',
    description: 'Yeni fatura oluşturma rehberi',
    icon: <FileTextOutlined />,
    category: 'billing',
    usage: 45
  },
  {
    id: 2,
    title: 'Ödeme İşlemleri',
    description: 'Ödeme yöntemleri ve süreçleri',
    icon: <DollarOutlined />,
    category: 'payment',
    usage: 32
  },
  {
    id: 3,
    title: 'Rapor Oluşturma',
    description: 'Enerji tüketim raporları',
    icon: <BarChartOutlined />,
    category: 'reports',
    usage: 28
  },
  {
    id: 4,
    title: 'Kullanıcı Yönetimi',
    description: 'Kullanıcı ekleme ve yetkilendirme',
    icon: <TeamOutlined />,
    category: 'users',
    usage: 19
  },
  {
    id: 5,
    title: 'API Entegrasyonu',
    description: 'API kullanımı ve entegrasyon',
    icon: <ApiOutlined />,
    category: 'technical',
    usage: 15
  },
  {
    id: 6,
    title: 'Sistem Ayarları',
    description: 'Genel sistem konfigürasyonu',
    icon: <SettingOutlined />,
    category: 'settings',
    usage: 12
  }
];

const mockKnowledgeBase = [
  {
    id: 1,
    title: 'Fatura Sistemi Kullanım Kılavuzu',
    category: 'billing',
    content: 'Detaylı fatura oluşturma ve yönetim rehberi...',
    views: 1250,
    helpful: 89,
    lastUpdated: '2024-01-10'
  },
  {
    id: 2,
    title: 'API Entegrasyon Dokümantasyonu',
    category: 'technical',
    content: 'API endpoint\'leri ve kullanım örnekleri...',
    views: 890,
    helpful: 67,
    lastUpdated: '2024-01-08'
  },
  {
    id: 3,
    title: 'Raporlama Özellikleri',
    category: 'reports',
    content: 'Mevcut rapor türleri ve özelleştirme seçenekleri...',
    views: 756,
    helpful: 54,
    lastUpdated: '2024-01-05'
  }
];

const conversationStatuses = [
  { value: 'active', label: 'Aktif', color: '#52c41a' },
  { value: 'pending', label: 'Beklemede', color: '#faad14' },
  { value: 'resolved', label: 'Çözüldü', color: '#1890ff' },
  { value: 'closed', label: 'Kapatıldı', color: '#666' }
];

const priorityLevels = [
  { value: 'high', label: 'Yüksek', color: '#ff4d4f' },
  { value: 'medium', label: 'Orta', color: '#faad14' },
  { value: 'low', label: 'Düşük', color: '#52c41a' }
];

const categories = [
  { value: 'technical', label: 'Teknik', icon: <ToolOutlined /> },
  { value: 'billing', label: 'Fatura', icon: <FileTextOutlined /> },
  { value: 'payment', label: 'Ödeme', icon: <DollarOutlined /> },
  { value: 'general', label: 'Genel', icon: <QuestionCircleOutlined /> },
  { value: 'reports', label: 'Raporlar', icon: <BarChartOutlined /> },
  { value: 'users', label: 'Kullanıcılar', icon: <TeamOutlined /> }
];

export default function ChatbotPage() {
  const { message } = App.useApp();
  const [conversations, setConversations] = useState(mockConversations);
  const [chatHistory, setChatHistory] = useState(mockChatHistory);
  const [quickActions, setQuickActions] = useState(mockQuickActions);
  const [knowledgeBase, setKnowledgeBase] = useState(mockKnowledgeBase);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [isChatDrawerVisible, setIsChatDrawerVisible] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [filters, setFilters] = useState({
    status: undefined,
    priority: undefined,
    category: undefined,
    tenantId: undefined
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Statistics
  const stats = useMemo(() => [
    {
      title: 'Aktif Konuşmalar',
      value: conversations.filter(c => c.status === 'active').length,
      icon: <MessageOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
             title: 'Ortalama Memnuniyet',
       value: `${Math.round(conversations.filter(c => c.satisfaction !== null).reduce((sum, c) => sum + (c.satisfaction || 0), 0) / conversations.filter(c => c.satisfaction !== null).length * 20)}%`,
      icon: <StarOutlined />,
      color: '#faad14',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Çözüm Oranı',
      value: `${Math.round(conversations.filter(c => c.status === 'resolved').length / conversations.length * 100)}%`,
      icon: <CheckCircleOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Günlük Mesaj',
      value: chatHistory.filter(m => new Date(m.timestamp).toDateString() === new Date().toDateString()).length,
      icon: <SendOutlined />,
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  ], [conversations, chatHistory]);

  const conversationColumns: ColumnsType<any> = [
    {
      title: 'Kullanıcı',
      key: 'user',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
              {record.userName.split(' ').map((n: string) => n[0]).join('')}
            </Avatar>
            <div>
              <div style={{ fontWeight: 500 }}>{record.userName}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{record.userEmail}</div>
            </div>
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
        <Tag color="blue">{tenantName}</Tag>
      )
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const statusInfo = conversationStatuses.find(s => s.value === status);
        return (
          <Tag color={statusInfo?.color}>
            {statusInfo?.label}
          </Tag>
        );
      }
    },
    {
      title: 'Öncelik',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) => {
        const priorityInfo = priorityLevels.find(p => p.value === priority);
        return (
          <Tag color={priorityInfo?.color}>
            {priorityInfo?.label}
          </Tag>
        );
      }
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category) => {
        const categoryInfo = categories.find(c => c.value === category);
        return (
          <Tag icon={categoryInfo?.icon}>
            {categoryInfo?.label}
          </Tag>
        );
      }
    },
    {
      title: 'Son Mesaj',
      key: 'lastMessage',
      width: 250,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: '4px' }}>
            {record.lastMessage}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {new Date(record.lastMessageTime).toLocaleString('tr-TR')}
          </div>
        </div>
      )
    },
    {
      title: 'Mesaj Sayısı',
      dataIndex: 'messageCount',
      key: 'messageCount',
      width: 100,
      render: (count) => (
        <Badge count={count} style={{ backgroundColor: '#1890ff' }} />
      )
    },
    {
      title: 'Memnuniyet',
      key: 'satisfaction',
      width: 120,
      render: (_, record) => (
        <div>
                     {record.satisfaction ? (
             <Rate disabled defaultValue={record.satisfaction} />
           ) : (
            <Text type="secondary">Değerlendirilmedi</Text>
          )}
        </div>
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<MessageOutlined />}
            onClick={() => handleOpenChat(record)}
          >
            Görüş
          </Button>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            Detay
          </Button>
        </Space>
      )
    }
  ];

  const quickActionColumns: ColumnsType<any> = [
    {
      title: 'Aksiyon',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '18px', color: '#1890ff' }}>
            {record.icon}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{record.title}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.description}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category) => {
        const categoryInfo = categories.find(c => c.value === category);
        return (
          <Tag icon={categoryInfo?.icon}>
            {categoryInfo?.label}
          </Tag>
        );
      }
    },
    {
      title: 'Kullanım',
      key: 'usage',
      width: 150,
      render: (_, record) => (
        <div>
          <Progress
            percent={record.usage}
            strokeColor={record.usage > 30 ? '#52c41a' : record.usage > 15 ? '#faad14' : '#ff4d4f'}
            size="small"
            format={(percent) => `${percent} kez`}
          />
        </div>
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<MessageOutlined />}
            onClick={() => handleQuickAction(record)}
          >
            Kullan
          </Button>
        </Space>
      )
    }
  ];

  const knowledgeBaseColumns: ColumnsType<any> = [
    {
      title: 'Başlık',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (title) => (
        <div style={{ fontWeight: 500 }}>{title}</div>
      )
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category) => {
        const categoryInfo = categories.find(c => c.value === category);
        return (
          <Tag icon={categoryInfo?.icon}>
            {categoryInfo?.label}
          </Tag>
        );
      }
    },
    {
      title: 'Görüntülenme',
      dataIndex: 'views',
      key: 'views',
      width: 120,
      render: (views) => (
        <div style={{ fontWeight: 500, color: '#1890ff' }}>
          {views.toLocaleString()}
        </div>
      )
    },
    {
      title: 'Faydalı',
      dataIndex: 'helpful',
      key: 'helpful',
      width: 100,
      render: (helpful) => (
        <div style={{ color: '#52c41a' }}>
          {helpful}%
        </div>
      )
    },
    {
      title: 'Son Güncelleme',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      width: 150,
      render: (date) => (
        <div>{new Date(date).toLocaleDateString('tr-TR')}</div>
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewArticle(record)}
          >
            Görüntüle
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditArticle(record)}
          >
            Düzenle
          </Button>
        </Space>
      )
    }
  ];

  const handleOpenChat = (conversation: any) => {
    setSelectedConversation(conversation);
    setIsChatDrawerVisible(true);
  };

  const handleViewDetails = (conversation: any) => {
    message.info(`${conversation.userName} konuşma detayları yakında eklenecek`);
  };

  const handleQuickAction = (action: any) => {
    message.info(`${action.title} aksiyonu başlatılıyor...`);
  };

  const handleViewArticle = (article: any) => {
    message.info(`${article.title} makalesi görüntüleniyor...`);
  };

  const handleEditArticle = (article: any) => {
    message.info(`${article.title} makalesi düzenleniyor...`);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: chatHistory.length + 1,
      conversationId: selectedConversation.id,
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toISOString(),
      attachments: []
    };

    setChatHistory(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: chatHistory.length + 2,
        conversationId: selectedConversation.id,
        sender: 'bot',
        message: 'Mesajınız alındı. En kısa sürede size yardımcı olacağım.',
        timestamp: new Date().toISOString(),
        attachments: []
      };

      setChatHistory(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: undefined,
      priority: undefined,
      category: undefined,
      tenantId: undefined
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const filteredConversations = conversations.filter(conv => {
    if (filters.status && conv.status !== filters.status) return false;
    if (filters.priority && conv.priority !== filters.priority) return false;
    if (filters.category && conv.category !== filters.category) return false;
    if (filters.tenantId && conv.tenantId !== filters.tenantId) return false;
    return true;
  });

  const currentConversationMessages = chatHistory.filter(
    msg => msg.conversationId === selectedConversation?.id
  );

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <CustomerServiceOutlined /> Chat Bot Yönetimi
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

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6}>
            <Select
              placeholder="Durum Seçin"
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              allowClear
            >
              {conversationStatuses.map(status => (
                <Option key={status.value} value={status.value}>
                  {status.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Öncelik Seçin"
              style={{ width: '100%' }}
              value={filters.priority}
              onChange={(value) => handleFilterChange('priority', value)}
              allowClear
            >
              {priorityLevels.map(priority => (
                <Option key={priority.value} value={priority.value}>
                  {priority.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Kategori Seçin"
              style={{ width: '100%' }}
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
              allowClear
            >
              {categories.map(category => (
                <Option key={category.value} value={category.value}>
                  {category.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={clearFilters}
              >
                Temizle
              </Button>
              <Button
                type="primary"
                icon={<SearchOutlined />}
              >
                Filtrele
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

             {/* Main Tabs */}
       <Tabs 
         defaultActiveKey="conversations" 
         size="large"
         items={[
           {
             key: 'conversations',
             label: (
               <span>
                 <MessageOutlined />
                 Konuşmalar
               </span>
             ),
             children: (
               <Card
                 title="Aktif Konuşmalar"
                 extra={
                   <Space>
                     <Button
                       icon={<ReloadOutlined />}
                       onClick={() => message.info('Konuşmalar yenileniyor...')}
                     >
                       Yenile
                     </Button>
                     <Button
                       icon={<FileExcelOutlined />}
                       onClick={() => message.info('Konuşma raporu indiriliyor...')}
                     >
                       Rapor İndir
                     </Button>
                   </Space>
                 }
               >
                 <Table
                   columns={conversationColumns}
                   dataSource={filteredConversations}
                   rowKey="id"
                   pagination={{
                     pageSize: 10,
                     showSizeChanger: true,
                     showQuickJumper: true,
                     showTotal: (total, range) =>
                       `${range[0]}-${range[1]} / ${total} konuşma`
                   }}
                   scroll={{ x: 1400 }}
                 />
               </Card>
             )
           },
           {
             key: 'quick-actions',
             label: (
               <span>
                 <BulbOutlined />
                 Hızlı Aksiyonlar
               </span>
             ),
             children: (
               <Card
                 title="Sık Kullanılan Aksiyonlar"
                 extra={
                   <Space>
                     <Button
                       icon={<PlusOutlined />}
                       onClick={() => message.info('Yeni aksiyon ekleniyor...')}
                     >
                       Yeni Aksiyon
                     </Button>
                     <Button
                       icon={<FileExcelOutlined />}
                       onClick={() => message.info('Aksiyon raporu indiriliyor...')}
                     >
                       Rapor İndir
                     </Button>
                   </Space>
                 }
               >
                 <Table
                   columns={quickActionColumns}
                   dataSource={quickActions}
                   rowKey="id"
                   pagination={{
                     pageSize: 10,
                     showSizeChanger: true,
                     showQuickJumper: true,
                     showTotal: (total, range) =>
                       `${range[0]}-${range[1]} / ${total} aksiyon`
                   }}
                   scroll={{ x: 800 }}
                 />
               </Card>
             )
           },
           {
             key: 'knowledge-base',
             label: (
               <span>
                 <BookOutlined />
                 Bilgi Bankası
               </span>
             ),
             children: (
               <Card
                 title="Bilgi Bankası Makaleleri"
                 extra={
                   <Space>
                     <Button
                       icon={<PlusOutlined />}
                       onClick={() => message.info('Yeni makale ekleniyor...')}
                     >
                       Yeni Makale
                     </Button>
                     <Button
                       icon={<FileExcelOutlined />}
                       onClick={() => message.info('Makale raporu indiriliyor...')}
                     >
                       Rapor İndir
                     </Button>
                   </Space>
                 }
               >
                 <Table
                   columns={knowledgeBaseColumns}
                   dataSource={knowledgeBase}
                   rowKey="id"
                   pagination={{
                     pageSize: 10,
                     showSizeChanger: true,
                     showQuickJumper: true,
                     showTotal: (total, range) =>
                       `${range[0]}-${range[1]} / ${total} makale`
                   }}
                   scroll={{ x: 1000 }}
                 />
               </Card>
             )
           }
         ]}
       />

      {/* Chat Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
              {selectedConversation?.userName?.split(' ').map((n: string) => n[0]).join('')}
            </Avatar>
            <div>
              <div style={{ fontWeight: 500 }}>{selectedConversation?.userName}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{selectedConversation?.userEmail}</div>
            </div>
          </div>
        }
        placement="right"
        width={600}
        onClose={() => setIsChatDrawerVisible(false)}
        open={isChatDrawerVisible}
        extra={
          <Space>
            <Button
              icon={<PhoneOutlined />}
              onClick={() => message.info('Sesli arama başlatılıyor...')}
            >
              Ara
            </Button>
            <Button
              icon={<VideoCameraOutlined />}
              onClick={() => message.info('Görüntülü arama başlatılıyor...')}
            >
              Görüntülü
            </Button>
          </Space>
        }
      >
        <div style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
          {/* Chat Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
            {currentConversationMessages.map((message) => (
              <div
                key={message.id}
                style={{
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: message.sender === 'user' ? '#1890ff' : '#f5f5f5',
                    color: message.sender === 'user' ? 'white' : 'black'
                  }}
                >
                  <div style={{ marginBottom: '4px' }}>{message.message}</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>
                    {new Date(message.timestamp).toLocaleTimeString('tr-TR')}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <LoadingOutlined />
                  <Text>Yazıyor...</Text>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <TextArea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <Space>
                <Button
                  icon={<PaperClipOutlined />}
                  onClick={() => message.info('Dosya ekleme özelliği yakında eklenecek')}
                />
                <Button
                  icon={<SmileOutlined />}
                  onClick={() => message.info('Emoji seçici yakında eklenecek')}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  Gönder
                </Button>
              </Space>
            </div>
          </div>
        </div>
      </Drawer>

      {/* AI Insights */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RobotOutlined style={{ color: '#1890ff' }} />
            AI Destekli Chat Bot Özellikleri
          </div>
        }
        style={{ marginTop: '24px' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Alert
              message="Akıllı Yanıtlar"
              description="AI, kullanıcı sorularını analiz ederek doğru ve hızlı yanıtlar veriyor."
              type="info"
              showIcon
            />
          </Col>
          <Col xs={24} md={8}>
            <Alert
              message="Otomatik Yönlendirme"
              description="Karmaşık sorunları otomatik olarak uygun departmana yönlendiriyor."
              type="warning"
              showIcon
            />
          </Col>
          <Col xs={24} md={8}>
            <Alert
              message="7/24 Destek"
              description="Chat bot kesintisiz hizmet veriyor ve anında yanıt sağlıyor."
              type="success"
              showIcon
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
} 