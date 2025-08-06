'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  Input,
  Button,
  Avatar,
  Typography,
  Space,
  Divider,
  Tag,
  Badge,
  Alert,
  Collapse,
  List,
  Tooltip,
  App
} from 'antd';
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  SmileOutlined,
  PaperClipOutlined,
  LoadingOutlined,
  SyncOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  TeamOutlined,
  ApiOutlined
} from '@ant-design/icons';
import { aiService, AIResponse } from '../../../services/aiService';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  message: string;
  timestamp: string;
}

const quickQuestions = [
  {
    title: 'Fatura Oluşturma',
    question: 'Fatura nasıl oluşturulur?',
    icon: <FileTextOutlined />,
    category: 'billing'
  },
  {
    title: 'Ödeme İşlemleri',
    question: 'Ödeme yöntemleri nelerdir?',
    icon: <DollarOutlined />,
    category: 'payment'
  },
  {
    title: 'Rapor Oluşturma',
    question: 'Enerji tüketim raporu nasıl alınır?',
    icon: <BarChartOutlined />,
    category: 'reports'
  },
  {
    title: 'Kullanıcı Yönetimi',
    question: 'Yeni kullanıcı nasıl eklenir?',
    icon: <TeamOutlined />,
    category: 'users'
  },
  {
    title: 'API Entegrasyonu',
    question: 'API nasıl kullanılır?',
    icon: <ApiOutlined />,
    category: 'technical'
  },
  {
    title: 'Sistem Ayarları',
    question: 'Sistem ayarları nasıl değiştirilir?',
    icon: <SettingOutlined />,
    category: 'settings'
  }
];

export default function TenantChatbotPage() {
  const { message } = App.useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'bot',
      message: 'Merhaba! Size nasıl yardımcı olabilirim? Elektrik tüketim takibi, fatura işlemleri, raporlama veya diğer konularda sorularınızı sorabilirsiniz.',
      timestamp: new Date().toISOString()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiConnectionStatus, setAiConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = newMessage;
    setNewMessage('');
    setIsTyping(true);

    try {
      const aiResponse: AIResponse = await aiService.sendChatMessage(currentMessage);

      if (aiResponse.Success && aiResponse.Content) {
        const botMessage: ChatMessage = {
          id: messages.length + 2,
          sender: 'bot',
          message: aiResponse.Content,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        const botMessage: ChatMessage = {
          id: messages.length + 2,
          sender: 'bot',
          message: 'Üzgünüm, şu anda size yardımcı olamıyorum. Lütfen daha sonra tekrar deneyin.',
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, botMessage]);
        message.error('AI servisi ile iletişim kurulamadı');
      }
    } catch (error) {
      console.error('AI chat error:', error);
      const botMessage: ChatMessage = {
        id: messages.length + 2,
        sender: 'bot',
        message: 'Teknik bir sorun oluştu. Lütfen daha sonra tekrar deneyin.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
      message.error('AI servisi ile iletişim kurulamadı');
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = async (question: string) => {
    setNewMessage(question);
    // Auto-send the question
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>
          <RobotOutlined /> AI Destekli Chat Bot
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
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        {/* Chat Area */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageOutlined />
              Sohbet
            </div>
          }
          style={{ height: '70vh' }}
          bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column' }}
        >
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', maxWidth: '70%' }}>
                  {msg.sender === 'bot' && (
                    <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
                      <RobotOutlined />
                    </Avatar>
                  )}
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: msg.sender === 'user' ? '#1890ff' : '#f5f5f5',
                      color: msg.sender === 'user' ? 'white' : 'black',
                      wordBreak: 'break-word'
                    }}
                  >
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</div>
                    <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
                      {new Date(msg.timestamp).toLocaleTimeString('tr-TR')}
                    </div>
                  </div>
                  {msg.sender === 'user' && (
                    <Avatar size="small" style={{ backgroundColor: '#52c41a' }}>
                      <UserOutlined />
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
                    <RobotOutlined />
                  </Avatar>
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
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
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
                <Tooltip title="Dosya Ekle">
                  <Button
                    icon={<PaperClipOutlined />}
                    onClick={() => message.info('Dosya ekleme özelliği yakında eklenecek')}
                  />
                </Tooltip>
                <Tooltip title="Emoji">
                  <Button
                    icon={<SmileOutlined />}
                    onClick={() => message.info('Emoji seçici yakında eklenecek')}
                  />
                </Tooltip>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isTyping}
                >
                  Gönder
                </Button>
              </Space>
            </div>
          </div>
        </Card>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quick Questions */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <QuestionCircleOutlined />
                Hızlı Sorular
              </div>
            }
            size="small"
          >
            <List
              size="small"
              dataSource={quickQuestions}
              renderItem={(item, index) => (
                <List.Item
                  key={index}
                  style={{ padding: '8px 0' }}
                  actions={[
                    <Button
                      type="link"
                      size="small"
                      onClick={() => handleQuickQuestion(item.question)}
                      disabled={isTyping}
                    >
                      Sor
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<div style={{ color: '#1890ff' }}>{item.icon}</div>}
                    title={<Text style={{ fontSize: '12px' }}>{item.title}</Text>}
                    description={<Text type="secondary" style={{ fontSize: '11px' }}>{item.question}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* AI Features */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RobotOutlined />
                AI Özellikleri
              </div>
            }
            size="small"
          >
            <Collapse size="small" ghost>
              <Panel header="Enerji Analizi" key="1">
                <Text style={{ fontSize: '12px' }}>
                  Tüketim verilerinizi AI ile analiz edin ve tasarruf önerileri alın.
                </Text>
              </Panel>
              <Panel header="Rapor Üretimi" key="2">
                <Text style={{ fontSize: '12px' }}>
                  AI destekli otomatik raporlar oluşturun.
                </Text>
              </Panel>
              <Panel header="Optimizasyon" key="3">
                <Text style={{ fontSize: '12px' }}>
                  Enerji kullanımınızı optimize etmek için öneriler alın.
                </Text>
              </Panel>
            </Collapse>
          </Card>

          {/* Status */}
          <Card
            title="Durum"
            size="small"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: '12px' }}>AI Bağlantısı:</Text>
                <Badge 
                  status={aiConnectionStatus === 'connected' ? 'success' : aiConnectionStatus === 'disconnected' ? 'error' : 'default'} 
                  text={
                    aiConnectionStatus === 'connected' ? 'Aktif' : 
                    aiConnectionStatus === 'disconnected' ? 'Pasif' : 
                    'Kontrol'
                  } 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: '12px' }}>Mesaj Sayısı:</Text>
                <Text style={{ fontSize: '12px', fontWeight: 'bold' }}>{messages.length}</Text>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* AI Info */}
      <Card style={{ marginTop: '24px' }}>
        <Alert
          message="AI Destekli Chat Bot"
          description="Bu chat bot, Google Gemini AI teknolojisi kullanarak size en iyi hizmeti sunmaktadır. Elektrik tüketim takibi, fatura işlemleri, raporlama ve diğer konularda sorularınızı sorabilirsiniz."
          type="info"
          showIcon
          icon={<RobotOutlined />}
        />
      </Card>
    </div>
  );
} 