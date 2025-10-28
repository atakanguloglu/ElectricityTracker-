'use client'

import React, { useState, useEffect } from 'react'
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
  Select,
  Spin
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
import { helpService, HelpCategory, HelpArticle, FAQ, ContactRequest } from '../../../services/helpService'

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

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [contactModalVisible, setContactModalVisible] = useState(false)
  const [form] = Form.useForm<ContactFormValues>()
  
  // State for data from API
  const [categories, setCategories] = useState<HelpCategory[]>([])
  const [articles, setArticles] = useState<HelpArticle[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  // Load data on component mount
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setDataLoading(true)
    try {
      const [cats, arts, faqList, contacts] = await Promise.all([
        helpService.getCategories(),
        helpService.getArticles(),
        helpService.getFAQs(),
        helpService.getContactRequests()
      ])

      setCategories(cats)
      setArticles(arts)
      setFaqs(faqList)
      setContactRequests(contacts)
    } catch (error) {
      message.error('Veriler yüklenirken hata oluştu!')
      console.error('Error loading help data:', error)
    } finally {
      setDataLoading(false)
    }
  }

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category?.name === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleContactSubmit = async (values: ContactFormValues) => {
    try {
      await helpService.createContactRequest({
        name: values.name,
        email: values.email,
        subject: values.subject,
        category: values.category,
        priority: values.priority as any,
        message: values.message
      })
      
      message.success('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.')
      setContactModalVisible(false)
      form.resetFields()
      await loadAllData() // Reload data
    } catch (error) {
      message.error('Mesaj gönderilirken hata oluştu')
    }
  }

  const handleArticleInteraction = async (articleId: number, type: 'view' | 'helpful' | 'not_helpful') => {
    try {
      await helpService.recordArticleInteraction(articleId, type)
      if (type === 'helpful') {
        message.success('Teşekkürler! Geri bildiriminiz kaydedildi.')
      }
    } catch (error) {
      console.error('Error recording interaction:', error)
    }
  }

  if (dataLoading) {
    return (
      <PageContainer
        title="Yardım & Destek"
        subTitle="Sorularınızın cevaplarını bulun ve destek ekibimizle iletişime geçin"
      >
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Yardım içeriği yükleniyor...</div>
        </div>
      </PageContainer>
    )
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
                  <Text type="secondary">{faqs.length} makale</Text>
                </Card>
              </Col>
              {categories.map((category) => (
                <Col xs={12} sm={6} md={4} key={category.id}>
                  <Card 
                    hoverable 
                    style={{ textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => setSelectedCategory(category.name)}
                    className={selectedCategory === category.name ? 'selected-category' : ''}
                  >
                    <div style={{ fontSize: 24, marginBottom: 8, color: category.color }}>
                      {category.icon}
                    </div>
                    <Text strong>{category.name}</Text>
                    <br />
                    <Text type="secondary">{category.articleCount || 0} makale</Text>
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
              {filteredFaqs.map((faq) => (
                <Panel 
                  header={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{faq.title}</span>
                      <Tag color="blue">{faq.category?.name}</Tag>
                    </div>
                  } 
                  key={faq.id}
                >
                  <Paragraph>{faq.content}</Paragraph>
                  <div style={{ marginTop: 16 }}>
                    <Space>
                      <Text type="secondary">Bu cevap yardımcı oldu mu?</Text>
                      <Button 
                        size="small" 
                        icon={<StarOutlined />}
                        onClick={() => handleArticleInteraction(faq.id, 'helpful')}
                      >
                        Evet ({faq.helpfulCount})
                      </Button>
                      <Button 
                        size="small"
                        onClick={() => handleArticleInteraction(faq.id, 'not_helpful')}
                      >
                        Hayır ({faq.notHelpfulCount})
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
              <Col xs={24} md={8}>
                <Card style={{ textAlign: 'center', height: '100%' }}>
                  <div style={{ fontSize: 32, marginBottom: 16, color: '#6366f1' }}>
                    <MailOutlined />
                  </div>
                  <Title level={5}>E-posta Desteği</Title>
                  <Text type="secondary">24 saat içinde yanıt alın</Text>
                  <br />
                  <Text strong style={{ fontSize: 16 }}>support@electricitytracker.com</Text>
                  <br />
                  <Text type="secondary">Yanıt süresi: 24 saat</Text>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card style={{ textAlign: 'center', height: '100%' }}>
                  <div style={{ fontSize: 32, marginBottom: 16, color: '#6366f1' }}>
                    <PhoneOutlined />
                  </div>
                  <Title level={5}>Telefon Desteği</Title>
                  <Text type="secondary">Acil durumlar için</Text>
                  <br />
                  <Text strong style={{ fontSize: 16 }}>+90 212 555 0123</Text>
                  <br />
                  <Text type="secondary">Yanıt süresi: Hemen</Text>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card style={{ textAlign: 'center', height: '100%' }}>
                  <div style={{ fontSize: 32, marginBottom: 16, color: '#6366f1' }}>
                    <MessageOutlined />
                  </div>
                  <Title level={5}>Canlı Sohbet</Title>
                  <Text type="secondary">Anında yardım alın</Text>
                  <br />
                  <Text strong style={{ fontSize: 16 }}>Çevrimiçi</Text>
                  <br />
                  <Text type="secondary">Yanıt süresi: Anında</Text>
                </Card>
              </Col>
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
            name="name"
            label="Ad Soyad"
            rules={[{ required: true, message: 'Ad soyad alanı zorunludur' }]}
          >
            <Input placeholder="Adınızı ve soyadınızı yazın" />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-posta"
            rules={[
              { required: true, message: 'E-posta alanı zorunludur' },
              { type: 'email', message: 'Geçerli bir e-posta adresi girin' }
            ]}
          >
            <Input placeholder="E-posta adresinizi yazın" />
          </Form.Item>
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
              <Option value="technical">Teknik Sorun</Option>
              <Option value="billing">Faturalama</Option>
              <Option value="feature">Özellik Talebi</Option>
              <Option value="other">Diğer</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="priority"
            label="Öncelik"
            rules={[{ required: true, message: 'Öncelik seçin' }]}
          >
            <Select placeholder="Öncelik seçin">
              <Option value="low">Düşük</Option>
              <Option value="medium">Orta</Option>
              <Option value="high">Yüksek</Option>
              <Option value="urgent">Acil</Option>
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