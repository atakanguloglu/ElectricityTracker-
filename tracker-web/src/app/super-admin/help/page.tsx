'use client'

import React, { useState } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Input, 
  Button, 
  Space,
  Typography,
  Divider,
  Alert,
  Collapse,
  List,
  Tag,
  Avatar,
  Rate,
  Modal,
  Form,
  message,
  Select
} from 'antd'
import { 
  PageContainer,
  ProCard
} from '@ant-design/pro-components'
import { 
  QuestionCircleOutlined,
  SearchOutlined,
  BookOutlined,
  MessageOutlined,
  PhoneOutlined,
  MailOutlined,
  StarOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  DownloadOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography
const { Search } = Input
const { Panel } = Collapse
const { TextArea } = Input
const { Option } = Select

interface ContactFormValues {
  name: string
  email: string
  subject: string
  category: string
  priority: string
  message: string
}

// Mock data for help content
const mockHelpData = {
  faqs: [
    {
      question: 'Admin panelinde nasıl yeni kullanıcı ekleyebilirim?',
      answer: 'Kullanıcı Yönetimi sayfasına gidin ve "Yeni Kullanıcı Ekle" butonuna tıklayın. Gerekli bilgileri doldurduktan sonra kaydedin.',
      category: 'Kullanıcı Yönetimi',
      helpful: 15
    },
    {
      question: 'Sistem loglarını nasıl görüntüleyebilirim?',
      answer: 'Sistem Logları sayfasından tüm log kayıtlarını görüntüleyebilir, filtreleyebilir ve dışa aktarabilirsiniz.',
      category: 'Sistem',
      helpful: 23
    },
    {
      question: 'API anahtarlarını nasıl yönetebilirim?',
      answer: 'API Yönetimi sayfasından mevcut API anahtarlarını görüntüleyebilir, yeni anahtar oluşturabilir veya mevcut anahtarları silebilirsiniz.',
      category: 'API',
      helpful: 18
    },
    {
      question: 'Raporları nasıl dışa aktarabilirim?',
      answer: 'Raporlama sayfasında istediğiniz raporu seçin ve "Dışa Aktar" butonuna tıklayın. PDF, Excel veya CSV formatında indirebilirsiniz.',
      category: 'Raporlama',
      helpful: 31
    },
    {
      question: 'Sistem performansını nasıl izleyebilirim?',
      answer: 'Sistem İzleme sayfasından CPU, bellek, disk kullanımı ve ağ trafiğini gerçek zamanlı olarak takip edebilirsiniz.',
      category: 'Sistem',
      helpful: 27
    }
  ],
  categories: [
    { name: 'Kullanıcı Yönetimi', icon: <UserOutlined />, count: 8 },
    { name: 'Sistem', icon: <QuestionCircleOutlined />, count: 12 },
    { name: 'API', icon: <FileTextOutlined />, count: 6 },
    { name: 'Raporlama', icon: <BookOutlined />, count: 10 },
    { name: 'Güvenlik', icon: <CheckCircleOutlined />, count: 5 }
  ],
  contactMethods: [
    {
      title: 'E-posta Desteği',
      description: '24 saat içinde yanıt alın',
      icon: <MailOutlined />,
      contact: 'support@electricitytracker.com',
      responseTime: '24 saat'
    },
    {
      title: 'Telefon Desteği',
      description: 'Acil durumlar için',
      icon: <PhoneOutlined />,
      contact: '+90 212 555 0123',
      responseTime: 'Hemen'
    },
    {
      title: 'Canlı Sohbet',
      description: 'Anında yardım alın',
      icon: <MessageOutlined />,
      contact: 'Çevrimiçi',
      responseTime: 'Anında'
    }
  ]
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [contactModalVisible, setContactModalVisible] = useState(false)
  const [form] = Form.useForm<ContactFormValues>()

  const filteredFaqs = mockHelpData.faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleContactSubmit = async (values: ContactFormValues) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.')
      setContactModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error('Mesaj gönderilirken hata oluştu')
    }
  }

  return (
    <PageContainer
      title="Yardım & Destek"
      subTitle="Sorularınızın cevaplarını bulun ve destek ekibimizle iletişime geçin"
    >
      {/* Search Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <ProCard>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Title level={3}>Nasıl yardımcı olabiliriz?</Title>
              <Search
                placeholder="Sorunuzu yazın veya anahtar kelime arayın..."
                size="large"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ maxWidth: 600, margin: '0 auto' }}
                prefix={<SearchOutlined />}
              />
            </div>
          </ProCard>
        </Col>
      </Row>

      {/* Categories */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <ProCard title="Kategoriler" extra={<BookOutlined />}>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6} md={4}>
                <Card 
                  hoverable 
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => setSelectedCategory('all')}
                  className={selectedCategory === 'all' ? 'selected-category' : ''}
                >
                  <div style={{ fontSize: 24, marginBottom: 8 }}>
                    <QuestionCircleOutlined />
                  </div>
                  <Text strong>Tümü</Text>
                  <br />
                  <Text type="secondary">{mockHelpData.faqs.length} soru</Text>
                </Card>
              </Col>
              {mockHelpData.categories.map((category, index) => (
                <Col xs={12} sm={6} md={4} key={index}>
                  <Card 
                    hoverable 
                    style={{ textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => setSelectedCategory(category.name)}
                    className={selectedCategory === category.name ? 'selected-category' : ''}
                  >
                    <div style={{ fontSize: 24, marginBottom: 8 }}>
                      {category.icon}
                    </div>
                    <Text strong>{category.name}</Text>
                    <br />
                    <Text type="secondary">{category.count} soru</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </ProCard>
        </Col>
      </Row>

      {/* FAQs */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <ProCard title="Sık Sorulan Sorular" extra={<FileTextOutlined />}>
            <Collapse defaultActiveKey={['0']} ghost>
              {filteredFaqs.map((faq, index) => (
                <Panel 
                  header={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{faq.question}</span>
                      <Tag color="blue">{faq.category}</Tag>
                    </div>
                  } 
                  key={index}
                >
                  <Paragraph>{faq.answer}</Paragraph>
                  <div style={{ marginTop: 16 }}>
                    <Space>
                      <Text type="secondary">Bu cevap yardımcı oldu mu?</Text>
                      <Button size="small" icon={<StarOutlined />}>
                        Evet ({faq.helpful})
                      </Button>
                      <Button size="small">
                        Hayır
                      </Button>
                    </Space>
                  </div>
                </Panel>
              ))}
            </Collapse>
            {filteredFaqs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <QuestionCircleOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                <Text type="secondary">Aradığınız soru bulunamadı. Lütfen farklı anahtar kelimeler deneyin.</Text>
              </div>
            )}
          </ProCard>
        </Col>
      </Row>

      {/* Contact Methods */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <ProCard title="Destek Ekibiyle İletişim" extra={<MessageOutlined />}>
            <Row gutter={[16, 16]}>
              {mockHelpData.contactMethods.map((method, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card style={{ textAlign: 'center', height: '100%' }}>
                    <div style={{ fontSize: 32, marginBottom: 16, color: '#6366f1' }}>
                      {method.icon}
                    </div>
                    <Title level={5}>{method.title}</Title>
                    <Text type="secondary">{method.description}</Text>
                    <br />
                    <Text strong style={{ fontSize: 16 }}>{method.contact}</Text>
                    <br />
                    <Text type="secondary">Yanıt süresi: {method.responseTime}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Button 
                type="primary" 
                size="large" 
                icon={<SendOutlined />}
                onClick={() => setContactModalVisible(true)}
              >
                Mesaj Gönder
              </Button>
            </div>
          </ProCard>
        </Col>
      </Row>

      {/* Resources */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <ProCard title="Dokümantasyon" extra={<FileTextOutlined />}>
            <List
              dataSource={[
                { title: 'Admin Panel Kullanım Kılavuzu', icon: <FileTextOutlined /> },
                { title: 'API Dokümantasyonu', icon: <FileTextOutlined /> },
                { title: 'Güvenlik Rehberi', icon: <FileTextOutlined /> },
                { title: 'Sistem Gereksinimleri', icon: <FileTextOutlined /> }
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={item.icon} />}
                    title={<a href="#">{item.title}</a>}
                    description="PDF formatında indirin"
                  />
                  <Button type="link" icon={<DownloadOutlined />}>
                    İndir
                  </Button>
                </List.Item>
              )}
            />
          </ProCard>
        </Col>
        <Col xs={24} lg={12}>
          <ProCard title="Video Eğitimler" extra={<VideoCameraOutlined />}>
            <List
              dataSource={[
                { title: 'Admin Paneli Tanıtımı', duration: '5:32', icon: <VideoCameraOutlined /> },
                { title: 'Kullanıcı Yönetimi', duration: '8:15', icon: <VideoCameraOutlined /> },
                { title: 'Raporlama Sistemi', duration: '12:45', icon: <VideoCameraOutlined /> },
                { title: 'API Entegrasyonu', duration: '15:20', icon: <VideoCameraOutlined /> }
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={item.icon} />}
                    title={<a href="#">{item.title}</a>}
                    description={`Süre: ${item.duration}`}
                  />
                  <Button type="link" icon={<VideoCameraOutlined />}>
                    İzle
                  </Button>
                </List.Item>
              )}
            />
          </ProCard>
        </Col>
      </Row>

      {/* Contact Modal */}
      <Modal
        title="Destek Ekibine Mesaj Gönder"
        open={contactModalVisible}
        onCancel={() => setContactModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleContactSubmit}
        >
          <Form.Item
            name="subject"
            label="Konu"
            rules={[{ required: true, message: 'Konu alanı zorunludur' }]}
          >
            <Input placeholder="Mesajınızın konusunu yazın" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Kategori"
            rules={[{ required: true, message: 'Kategori seçin' }]}
          >
            <Select placeholder="Kategori seçin">
              <Select.Option value="technical">Teknik Sorun</Select.Option>
              <Select.Option value="billing">Faturalama</Select.Option>
              <Select.Option value="feature">Özellik Talebi</Select.Option>
              <Select.Option value="other">Diğer</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="priority"
            label="Öncelik"
            rules={[{ required: true, message: 'Öncelik seçin' }]}
          >
            <Select placeholder="Öncelik seçin">
              <Select.Option value="low">Düşük</Select.Option>
              <Select.Option value="medium">Orta</Select.Option>
              <Select.Option value="high">Yüksek</Select.Option>
              <Select.Option value="urgent">Acil</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="message"
            label="Mesaj"
            rules={[{ required: true, message: 'Mesaj alanı zorunludur' }]}
          >
            <TextArea 
              rows={6} 
              placeholder="Sorununuzu detaylı bir şekilde açıklayın..."
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />} block>
              Mesajı Gönder
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .ant-card {
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }

        .ant-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }

        .ant-pro-card {
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }

        .ant-pro-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }

        .selected-category {
          border-color: #6366f1;
          background-color: rgba(99, 102, 241, 0.1);
        }

        .ant-input {
          border-radius: 8px;
        }

        .ant-btn {
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .ant-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .ant-collapse {
          background: transparent;
        }

        .ant-collapse-item {
          border-radius: 8px;
          margin-bottom: 8px;
          border: 1px solid #f0f0f0;
        }

        .ant-list-item {
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .ant-list-item:hover {
          background-color: rgba(99, 102, 241, 0.05);
        }

        @media (max-width: 768px) {
          .ant-space {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .ant-space-item {
            margin-bottom: 8px;
          }
        }
      `}</style>
    </PageContainer>
  )
} 