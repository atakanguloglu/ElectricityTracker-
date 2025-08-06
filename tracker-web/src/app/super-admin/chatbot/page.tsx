'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { aiService, AIResponse } from '../../../services/aiService';
import { chatbotService, ChatbotStatistics, ChatbotConversation, QuickAction, KnowledgeBaseArticle, ChatbotMessage } from '../../../services/chatbotService';
import { isAuthenticated, isSuperAdmin } from '../../../utils/auth';
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
    App,
    message
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
  const router = useRouter();
  const { message } = App.useApp();
  
  // Authentication check
  useEffect(() => {
    console.log('DEBUG - Checking authentication...');
    console.log('DEBUG - localStorage authToken:', localStorage.getItem('authToken'));
    console.log('DEBUG - localStorage user:', localStorage.getItem('user'));
    
    if (!isAuthenticated()) {
      console.log('DEBUG - Not authenticated, redirecting to login');
      router.push('/login');
      return;
    }
    
    if (!isSuperAdmin()) {
      console.log('DEBUG - Not SuperAdmin, redirecting to tenant dashboard');
      message.error('Bu sayfaya erişim yetkiniz yok!');
      router.push('/tenant-dashboard');
      return;
    }
    
    console.log('DEBUG - Authentication successful, SuperAdmin access granted');
  }, [router, message]);
  const [conversations, setConversations] = useState<ChatbotConversation[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatbotMessage[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseArticle[]>([]);
  const [statistics, setStatistics] = useState<ChatbotStatistics | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<ChatbotConversation | null>(null);
  const [isChatDrawerVisible, setIsChatDrawerVisible] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [filters, setFilters] = useState({
    status: undefined,
    priority: undefined,
    category: undefined,
    tenantId: undefined
  });
  const [isTyping, setIsTyping] = useState(false);
  const [aiConnectionStatus, setAiConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Statistics
  const stats = useMemo(() => [
    {
      title: 'Aktif Konuşmalar',
      value: statistics?.ActiveConversations || 0,
      icon: <MessageOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
      title: 'Ortalama Memnuniyet',
      value: `${Math.round((statistics?.AverageSatisfaction || 0) * 20)}%`,
      icon: <StarOutlined />,
      color: '#faad14',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Çözüm Oranı',
      value: `${Math.round(statistics?.ResolutionRate || 0)}%`,
      icon: <CheckCircleOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Günlük Mesaj',
      value: statistics?.DailyMessages || 0,
      icon: <SendOutlined />,
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  ], [statistics]);

  const conversationColumns: ColumnsType<any> = [
    {
      title: 'Kullanıcı',
      key: 'user',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
              {record.userName ? record.userName.split(' ').map((n: string) => n[0]).join('') : 'U'}
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

  const handleQuickAction = async (action: any) => {
    try {
      message.loading(`${action.title} aksiyonu başlatılıyor...`);
      
      const aiResponse: AIResponse = await aiService.getQuickResponse(
        action.category,
        `${action.title} hakkında bilgi ver: ${action.description}`
      );

      if (aiResponse.Success && aiResponse.Content) {
        message.success(`${action.title} aksiyonu başarıyla çalıştırıldı`);
        
        // Show AI response in a modal or notification
        Modal.info({
          title: `${action.title} - AI Yanıtı`,
          content: (
            <div>
              <p>{aiResponse.Content}</p>
            </div>
          ),
          width: 600,
        });
      } else {
        message.error('Aksiyon çalıştırılırken hata oluştu');
      }
    } catch (error) {
      console.error('Quick action error:', error);
      message.error('Aksiyon çalıştırılırken hata oluştu');
    }
  };

  const handleViewArticle = (article: any) => {
    message.info(`${article.title} makalesi görüntüleniyor...`);
  };

  const handleEditArticle = (article: any) => {
    message.info(`${article.title} makalesi düzenleniyor...`);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const userMessage: ChatbotMessage = {
      Id: chatHistory.length + 1,
      ConversationId: selectedConversation.Id,
      Sender: 'user',
      Content: newMessage,
      Timestamp: new Date().toISOString(),
      MessageType: 'text',
      IsRead: false
    };

    setChatHistory(prev => [...prev, userMessage]);
    const currentMessage = newMessage;
    setNewMessage('');
    setIsTyping(true);

    try {
      // Send message to backend
      await chatbotService.sendMessage(selectedConversation.Id, {
        Sender: 'user',
        Content: currentMessage,
        MessageType: 'text'
      });

      // Send message to AI backend
      const aiResponse: AIResponse = await aiService.sendChatMessage(
        currentMessage, 
        selectedConversation.Id.toString()
      );

      if (aiResponse.Success && aiResponse.Content) {
        const botMessage: ChatbotMessage = {
          Id: chatHistory.length + 2,
          ConversationId: selectedConversation.Id,
          Sender: 'bot',
          Content: aiResponse.Content,
          Timestamp: new Date().toISOString(),
          MessageType: 'text',
          IsRead: false
        };

        setChatHistory(prev => [...prev, botMessage]);
      } else {
        // Fallback response if AI fails
        const botMessage: ChatbotMessage = {
          Id: chatHistory.length + 2,
          ConversationId: selectedConversation.Id,
          Sender: 'bot',
          Content: 'Üzgünüm, şu anda size yardımcı olamıyorum. Lütfen daha sonra tekrar deneyin.',
          Timestamp: new Date().toISOString(),
          MessageType: 'text',
          IsRead: false
        };

        setChatHistory(prev => [...prev, botMessage]);
        message.error('AI servisi ile iletişim kurulamadı');
      }
    } catch (error) {
      console.error('AI chat error:', error);
      const botMessage: ChatbotMessage = {
        Id: chatHistory.length + 2,
        ConversationId: selectedConversation.Id,
        Sender: 'bot',
        Content: 'Teknik bir sorun oluştu. Lütfen daha sonra tekrar deneyin.',
        Timestamp: new Date().toISOString(),
        MessageType: 'text',
        IsRead: false
      };

      setChatHistory(prev => [...prev, botMessage]);
      message.error('AI servisi ile iletişim kurulamadı');
    } finally {
      setIsTyping(false);
    }
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

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load statistics
        const statsData = await chatbotService.getStatistics();
        console.log('DEBUG - Statistics data:', statsData);
        setStatistics(statsData);
        
        // Load conversations
        const conversationsData = await chatbotService.getConversations();
        console.log('DEBUG - Conversations data:', conversationsData);
        setConversations(conversationsData.conversations);
        
        // Load quick actions
        const quickActionsData = await chatbotService.getQuickActions();
        console.log('DEBUG - Quick actions data:', quickActionsData);
        setQuickActions(quickActionsData);
        
        // Load knowledge base articles
        const knowledgeBaseData = await chatbotService.getKnowledgeBaseArticles();
        console.log('DEBUG - Knowledge base data:', knowledgeBaseData);
        setKnowledgeBase(knowledgeBaseData);
        
      } catch (error) {
        console.error('Error loading chatbot data:', error);
        message.error('Veriler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Test AI connection on component mount
  useEffect(() => {
    const testAIConnection = async () => {
      try {
        const response = await aiService.testConnection();
        if (response.Success) {
          setAiConnectionStatus('connected');
        } else {
          setAiConnectionStatus('disconnected');
        }
      } catch (error) {
        console.error('AI connection test failed:', error);
        setAiConnectionStatus('disconnected');
      }
    };

    testAIConnection();
  }, []);

  // Simple chat state
  const [chatMessages, setChatMessages] = useState<Array<{
    id: number;
    sender: 'user' | 'bot';
    content: string;
    timestamp: Date;
  }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleChatSend = async () => {
    console.log('DEBUG - handleChatSend called');
    console.log('DEBUG - chatInput:', chatInput);
    
    if (!chatInput.trim()) {
      console.log('DEBUG - chatInput is empty, returning');
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: 'user' as const,
      content: chatInput,
      timestamp: new Date()
    };

    console.log('DEBUG - Adding user message:', userMessage);
    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    console.log('DEBUG - About to call aiService.sendSuperAdminChatMessage with:', currentInput);
    
    try {
      const response = await aiService.sendSuperAdminChatMessage(currentInput);
      console.log('DEBUG - AI service response:', response);
      
      if (response.Success && response.Content) {
        const botMessage = {
          id: Date.now() + 1,
          sender: 'bot' as const,
          content: response.Content,
          timestamp: new Date()
        };
        console.log('DEBUG - Adding bot message:', botMessage);
        setChatMessages(prev => [...prev, botMessage]);
      } else {
        console.log('DEBUG - AI service returned error or no content');
        const errorMessage = {
          id: Date.now() + 1,
          sender: 'bot' as const,
          content: 'Üzgünüm, şu anda size yardımcı olamıyorum. Lütfen daha sonra tekrar deneyin.',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('DEBUG - Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'bot' as const,
        content: 'Teknik bir sorun oluştu. Lütfen daha sonra tekrar deneyin.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      console.log('DEBUG - Setting isChatLoading to false');
      setIsChatLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (filters.status && conv.Status !== filters.status) return false;
    if (filters.category && conv.Category !== filters.category) return false;
    if (filters.tenantId && conv.TenantId !== filters.tenantId) return false;
    return true;
  });

  const currentConversationMessages = chatHistory.filter(
    msg => msg.ConversationId === selectedConversation?.Id
  );

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ marginTop: '100px' }}>
          <LoadingOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          <div style={{ marginTop: '16px', fontSize: '16px' }}>Veriler yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>
          <CustomerServiceOutlined /> Chat Bot Yönetimi
        </Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text>AI Durumu:</Text>
          <Badge 
            status={aiConnectionStatus === 'connected' ? 'success' : aiConnectionStatus === 'disconnected' ? 'error' : 'default'} 
            text={
              aiConnectionStatus === 'connected' ? 'Bağlı' : 
              aiConnectionStatus === 'disconnected' ? 'Bağlantı Yok' : 
              'Kontrol Ediliyor...'
            } 
          />
          <Button
            size="small"
            icon={<SyncOutlined spin={aiConnectionStatus === 'unknown'} />}
            onClick={async () => {
              setAiConnectionStatus('unknown');
              try {
                const response = await aiService.testConnection();
                setAiConnectionStatus(response.Success ? 'connected' : 'disconnected');
                message.success('AI bağlantısı test edildi');
              } catch (error) {
                setAiConnectionStatus('disconnected');
                message.error('AI bağlantısı başarısız');
              }
            }}
          >
            Test Et
          </Button>
        </div>
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
              {selectedConversation?.UserName ? selectedConversation.UserName.split(' ').map((n: string) => n[0]).join('') : 'U'}
            </Avatar>
            <div>
              <div style={{ fontWeight: 500 }}>{selectedConversation?.UserName}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{selectedConversation?.UserEmail}</div>
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
                key={message.Id}
                style={{
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: message.Sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: message.Sender === 'user' ? '#1890ff' : '#f5f5f5',
                    color: message.Sender === 'user' ? 'white' : 'black'
                  }}
                >
                  <div style={{ marginBottom: '4px' }}>{message.Content}</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>
                    {new Date(message.Timestamp).toLocaleTimeString('tr-TR')}
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

      {/* Simple Chat Interface */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RobotOutlined style={{ color: '#1890ff' }} />
            AI Chat Bot - Proje Hakkında Sorular
          </div>
        }
        style={{ marginTop: '24px' }}
      >
        <div style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          {/* Chat Messages */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '16px', 
            border: '1px solid #f0f0f0', 
            borderRadius: '8px',
            marginBottom: '16px',
            backgroundColor: '#fafafa'
          }}>
            {chatMessages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
                <RobotOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>Merhaba! Elektrik takip sistemi hakkında sorularınızı sorabilirsiniz.</div>
                <div style={{ fontSize: '12px', marginTop: '8px' }}>
                  Örnek: &quot;Sistem nasıl çalışır?&quot;, &quot;Raporlar nasıl oluşturulur?&quot;, &quot;AI özellikleri nelerdir?&quot;
                </div>
              </div>
            ) : (
              chatMessages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: message.sender === 'user' ? '#1890ff' : '#fff',
                      color: message.sender === 'user' ? 'white' : 'black',
                      border: message.sender === 'bot' ? '1px solid #e8e8e8' : 'none',
                      boxShadow: message.sender === 'bot' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    <div style={{ marginBottom: '4px' }}>{message.content}</div>
                    <div style={{ fontSize: '10px', opacity: 0.7 }}>
                      {message.timestamp.toLocaleTimeString('tr-TR')}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isChatLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    border: '1px solid #e8e8e8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <LoadingOutlined />
                  <Text>AI yanıt yazıyor...</Text>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <TextArea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Proje hakkında sorularınızı yazın..."
                autoSize={{ minRows: 1, maxRows: 3 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleChatSend();
                  }
                }}
              />
            </div>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleChatSend}
              disabled={!chatInput.trim() || isChatLoading}
              loading={isChatLoading}
            >
              Gönder
            </Button>
          </div>
        </div>
      </Card>

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