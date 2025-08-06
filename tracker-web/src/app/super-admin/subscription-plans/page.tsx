'use client'

import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Switch,
  Typography,
  Divider,
  Row,
  Col,
  Statistic,
  Progress,
  Tooltip,
  Popconfirm,
  message,
  App,
  Badge,
  List,
  Avatar,
  Descriptions
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  GiftOutlined,
  DollarOutlined,
  UserOutlined,
  ApiOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  ReloadOutlined,
  CrownOutlined
} from '@ant-design/icons'
import { apiRequest } from '@/utils/auth'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5143/api'

// Types
interface SubscriptionPlan {
  id?: number
  Id?: number
  type?: string
  Type?: string
  name?: string
  Name?: string
  description?: string
  Description?: string
  monthlyFee?: number
  MonthlyFee?: number
  features?: string | string[]
  Features?: string | string[]
  limits?: string | Record<string, number>
  Limits?: string | Record<string, number>
  currency?: string
  Currency?: string
}

interface UpdateSubscriptionPlanDto {
  name: string
  type: string
  description: string
  monthlyFee: number
  features: string
  limits: string
  currency: string
}

interface Currency {
  code?: string
  Code?: string  // Backend'den PascalCase gelebilir
  name?: string
  Name?: string  // Backend'den PascalCase gelebilir
  symbol?: string
  Symbol?: string  // Backend'den PascalCase gelebilir
  isDefault?: boolean
  IsDefault?: boolean  // Backend'den PascalCase gelebilir
}

export default function AdminSubscriptionPlansPage() {
  const { message } = App.useApp()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'edit' | 'view'>('view')
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [form] = Form.useForm()

  // Fetch subscription plans
  const fetchPlans = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiRequest(`${API_BASE_URL}/admin/subscription-plans`)
      if (!response.ok) throw new Error('Abonelik planları alınamadı')
      
      const data = await response.json()
      console.log('Plans data:', data) // Debug için
      
      if (!data || !Array.isArray(data)) {
        console.error('Subscription plans API response is invalid:', data)
        setPlans([])
        return
      }
      
      console.log('First plan object keys:', data[0] ? Object.keys(data[0]) : 'No data')
      console.log('First plan raw:', data[0] ? JSON.stringify(data[0], null, 2) : 'No data')
      
      // HER ÇEŞİT ID'Yİ KONTROL ET
      if (data[0]) {
        console.log('ID variations check:')
        console.log('data[0].Id:', data[0].Id)
        console.log('data[0].id:', data[0].id)
        console.log('data[0].ID:', data[0].ID)
        console.log('All properties:', Object.getOwnPropertyNames(data[0]))
      }
      
      setPlans(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata oluştu')
      console.error('Subscription plans fetch error:', err)
      setPlans([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch currencies
  const fetchCurrencies = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/currencies`)
      if (!response.ok) throw new Error('Para birimleri alınamadı')
      
      const data = await response.json()
      console.log('Currencies data:', data) // Debug için
      
      if (!data || !Array.isArray(data)) {
        console.error('Currencies API response is invalid:', data)
        setCurrencies([
          { code: 'TRY', name: 'Türk Lirası', symbol: '₺', isDefault: true },
          { code: 'USD', name: 'US Dollar', symbol: '$', isDefault: false },
          { code: 'EUR', name: 'Euro', symbol: '€', isDefault: false }
        ])
        return
      }
      
      setCurrencies(data)
    } catch (err) {
      console.error('Currencies fetch error:', err)
      // Fallback currencies
      setCurrencies([
        { code: 'TRY', name: 'Türk Lirası', symbol: '₺', isDefault: true },
        { code: 'USD', name: 'US Dollar', symbol: '$', isDefault: false },
        { code: 'EUR', name: 'Euro', symbol: '€', isDefault: false }
      ])
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchPlans()
    fetchCurrencies()
  }, [])

  const handleEditPlan = (plan: SubscriptionPlan) => {
    console.log('Selected plan:', plan) // Debug için
    console.log('Plan ID:', plan.id) // Debug için
    console.log('Plan keys:', Object.keys(plan)) // Debug için
    setSelectedPlan(plan)
    setModalType('edit')
    setModalVisible(true)
  }

  const handleViewPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    setModalType('view')
    setModalVisible(true)
  }

  const handleModalOk = async () => {
    try {
      console.log('Modal OK - selectedPlan:', selectedPlan) // Debug için
      console.log('Modal OK - selectedPlan.id:', selectedPlan?.id) // Debug için
      
             if (modalType === 'edit' && selectedPlan) {
        const values = await form.validateFields()
        
        const updateDto: UpdateSubscriptionPlanDto = {
          name: values.name,
                     type: selectedPlan.type || selectedPlan.Type || '',
          description: values.description,
          monthlyFee: values.monthlyFee,
          currency: values.currency,
          features: JSON.stringify(values.features || []),
          limits: JSON.stringify({
            users: values.limits?.users || 0,
            facilities: values.limits?.facilities || 0,
            api_calls: values.limits?.api_calls || 0,
            storage_gb: values.limits?.storage_gb || 0
          })
        }

                 // Id ile güncelleme yap
         const planId = selectedPlan.id || selectedPlan.Id
         if (!planId) {
           throw new Error('Plan ID bulunamadı')
         }
         
         console.log('Update request - planId:', planId)
         console.log('Update request URL:', `${API_BASE_URL}/admin/subscription-plans-management/${planId}`)
         const response = await apiRequest(`${API_BASE_URL}/admin/subscription-plans/${planId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateDto)
        })

        if (!response.ok) throw new Error('Abonelik planı güncellenemedi')

        message.success('Abonelik planı başarıyla güncellendi')
        setModalVisible(false)
        fetchPlans() // Refresh list
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('validation')) {
        return
      }
      message.error(err instanceof Error ? err.message : 'İşlem sırasında hata oluştu')
      console.error('Modal operation error:', err)
    }
  }

  const getPlanColor = (type: string | undefined) => {
    if (!type || typeof type !== 'string') return 'default'
    switch (type.toLowerCase()) {
      case 'premium': return 'purple'
      case 'standard': return 'blue'
      case 'basic': return 'green'
      default: return 'default'
    }
  }

  const getPlanIcon = (type: string | undefined) => {
    if (!type || typeof type !== 'string') return <GiftOutlined />
    switch (type.toLowerCase()) {
      case 'premium': return <CrownOutlined />
      case 'standard': return <ApiOutlined />
      case 'basic': return <UserOutlined />
      default: return <GiftOutlined />
    }
  }

  const formatLimit = (key: string, value: number) => {
    if (value === -1) return 'Sınırsız'
    
    switch (key) {
      case 'users': return `${value} kullanıcı`
      case 'facilities': return `${value} tesis`
      case 'api_calls': return `${value.toLocaleString()} çağrı/ay`
      case 'storage_gb': return `${value} GB`
      default: return value.toString()
    }
  }

  // Table columns
  const columns = [
    {
      title: 'Plan',
      key: 'plan',
      render: (record: SubscriptionPlan) => (
        <Space>
                     <Avatar 
             icon={getPlanIcon(record.type || record.Type)} 
             style={{ backgroundColor: getPlanColor(record.type || record.Type) === 'purple' ? '#722ed1' : 
                     getPlanColor(record.type || record.Type) === 'blue' ? '#1890ff' : '#52c41a' }}
           />
           <div>
             <Text strong>{record.name || record.Name}</Text>
             <br />
             <Text type="secondary" style={{ fontSize: '12px' }}>
               {((record.type || record.Type) || 'UNKNOWN').toUpperCase()}
             </Text>
           </div>
        </Space>
      )
    },
    {
      title: 'Açıklama',
      dataIndex: 'description',
      key: 'description',
             render: (text: string) => (
         <Text style={{ fontSize: '13px' }}>{text || ''}</Text>
       )
    },
         {
       title: 'Aylık Ücret',
       key: 'monthlyFee',
       render: (record: SubscriptionPlan) => {
         const fee = record.monthlyFee || record.MonthlyFee || 0
         const currency = currencies.find(c => (c.code || c.Code) === (record.currency || record.Currency))
         return (
           <Space>
             <DollarOutlined style={{ color: '#52c41a' }} />
             <Text strong style={{ fontSize: '16px' }}>
               {(currency?.symbol || currency?.Symbol) || '₺'}{fee.toLocaleString()}
             </Text>
             <Text type="secondary">/ay</Text>
           </Space>
         )
       }
     },
    {
      title: 'Özellikler',
      key: 'features',
             render: (record: SubscriptionPlan) => {
         const featuresData = record.features || record.Features
         const features = typeof featuresData === 'string' ? JSON.parse(featuresData || '[]') : featuresData || []
        return (
          <div>
            {features.slice(0, 3).map((feature: string, index: number) => (
              <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>
                {feature}
              </Tag>
            ))}
            {features.length > 3 && (
              <Tag color="default">+{features.length - 3} daha</Tag>
            )}
          </div>
        )
      }
    },
    {
      title: 'Limitler',
      key: 'limits',
             render: (record: SubscriptionPlan) => {
         const limitsData = record.limits || record.Limits
         const limits = typeof limitsData === 'string' ? JSON.parse(limitsData || '{}') : limitsData || {}
        return (
          <div>
            <div style={{ marginBottom: '4px' }}>
              <UserOutlined style={{ marginRight: '4px' }} />
              <Text style={{ fontSize: '12px' }}>
                {formatLimit('users', limits.users || 0)}
              </Text>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <DatabaseOutlined style={{ marginRight: '4px' }} />
              <Text style={{ fontSize: '12px' }}>
                {formatLimit('facilities', limits.facilities || 0)}
              </Text>
            </div>
            <div>
              <ApiOutlined style={{ marginRight: '4px' }} />
              <Text style={{ fontSize: '12px' }}>
                {formatLimit('api_calls', limits.api_calls || 0)}
              </Text>
            </div>
          </div>
        )
      }
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (record: SubscriptionPlan) => (
        <Space>
          <Tooltip title="Planı Görüntüle">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewPlan(record)}
            />
          </Tooltip>
          <Tooltip title="Planı Düzenle">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditPlan(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  // Statistics
  const stats = [
    {
      title: 'Toplam Plan',
      value: plans.length,
      icon: <GiftOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />,
      color: '#3b82f6'
    },
    {
      title: 'Aktif Planlar',
      value: plans.length,
      icon: <CheckCircleOutlined style={{ fontSize: '24px', color: '#10b981' }} />,
      color: '#10b981'
    },
    {
      title: 'Ortalama Ücret',
             value: plans.length > 0 ? 
         `₺${(plans.reduce((sum, plan) => sum + (plan.monthlyFee || plan.MonthlyFee || 0), 0) / plans.length).toFixed(0)}` : 
         '₺0',
      icon: <DollarOutlined style={{ fontSize: '24px', color: '#f59e0b' }} />,
      color: '#f59e0b'
    },
    {
      title: 'En Popüler',
             value: plans.length > 0 ? (plans[0].name || plans[0].Name || 'Yok') : 'Yok',
      icon: <CrownOutlined style={{ fontSize: '24px', color: '#8b5cf6' }} />,
      color: '#8b5cf6'
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <GiftOutlined style={{ marginRight: '8px' }} />
          Paket Yönetimi
        </Title>
        <Text type="secondary">
          Abonelik planlarını yönetin ve müşteri paketlerini düzenleyin
        </Text>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Plans Table */}
      <Card
        title="Abonelik Planları"
        extra={
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchPlans}
              loading={loading}
            >
              Yenile
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={plans}
          rowKey={(record) => record.type || record.Type || record.id || record.Id || 'unknown'}
          loading={loading}
          pagination={false}
          locale={{
            emptyText: 'Henüz abonelik planı bulunmuyor'
          }}
        />
      </Card>

      {/* Plan Details Modal */}
             <Modal
                   title={
            <Space>
              {selectedPlan && getPlanIcon(selectedPlan.type || selectedPlan.Type)}
              {modalType === 'edit' ? 'Plan Düzenle' : 'Plan Detayları'}
            </Space>
          }
         open={modalVisible}
         onOk={handleModalOk}
         onCancel={() => setModalVisible(false)}
         width="90%"
         style={{ maxWidth: 800 }}
         okText={modalType === 'edit' ? 'Güncelle' : 'Tamam'}
         cancelText="İptal"
         okButtonProps={{ 
           icon: modalType === 'edit' ? <SaveOutlined /> : undefined 
         }}
         styles={{
           mask: { zIndex: 999 },
           wrapper: { zIndex: 1000 }
         }}
         centered
         destroyOnHidden
         getContainer={() => document.body}
         afterOpenChange={(open) => {
           if (open && selectedPlan && modalType === 'edit') {
                           // String'leri parse et
              const featuresData = selectedPlan.features || selectedPlan.Features
              const limitsData = selectedPlan.limits || selectedPlan.Limits
              const features = typeof featuresData === 'string' ? JSON.parse(featuresData || '[]') : featuresData || []
              const limits = typeof limitsData === 'string' ? JSON.parse(limitsData || '{}') : limitsData || {}
              
              // Form değerlerini ayarla
              form.setFieldsValue({
                name: selectedPlan.name || selectedPlan.Name,
                description: selectedPlan.description || selectedPlan.Description,
                monthlyFee: selectedPlan.monthlyFee || selectedPlan.MonthlyFee,
                currency: selectedPlan.currency || selectedPlan.Currency,
                features: features,
                limits: {
                  users: limits.users || 0,
                  facilities: limits.facilities || 0,
                  api_calls: limits.api_calls || 0,
                  storage_gb: limits.storage_gb || 0
                }
              })
           }
         }}
       >
        {selectedPlan && (
          <div>
            {modalType === 'edit' ? (
                             <Form
                 form={form}
                 layout="vertical"
               >
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="name"
                      label="Plan Adı"
                      rules={[{ required: true, message: 'Plan adı gerekli' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="monthlyFee"
                      label="Aylık Ücret"
                      rules={[{ required: true, message: 'Aylık ücret gerekli' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        placeholder="0"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="currency"
                      label="Para Birimi"
                      rules={[{ required: true, message: 'Para birimi gerekli' }]}
                    >
                      <Select 
                        placeholder="Para birimi seçin"
                        showSearch
                        filterOption={(input, option) =>
                          (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                        optionFilterProp="children"
                        styles={{
                          popup: {
                            root: { zIndex: 1050 }
                          }
                        }}
                        getPopupContainer={(triggerNode) => document.body}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        {currencies.filter(currency => currency && (currency.code || currency.Code)).map(currency => (
                          <Option key={currency.code || currency.Code} value={currency.code || currency.Code}>
                            {currency.symbol || currency.Symbol} {currency.name || currency.Name} ({currency.code || currency.Code})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                
                <Form.Item
                  name="description"
                  label="Açıklama"
                  rules={[{ required: true, message: 'Açıklama gerekli' }]}
                >
                  <TextArea rows={3} />
                </Form.Item>

                <Divider>Özellikler</Divider>
                
                <Form.Item
                  name="features"
                  label="Plan Özellikleri"
                >
                  <Select
                    mode="tags"
                    placeholder="Özellik ekleyin"
                    style={{ width: '100%' }}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                    optionFilterProp="children"
                    styles={{
                      popup: {
                        root: { zIndex: 1050 }
                      }
                    }}
                    getPopupContainer={(triggerNode) => document.body}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                </Form.Item>

                <Divider>Limitler</Divider>
                
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item
                      name={['limits', 'users']}
                      label="Kullanıcı Sayısı"
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={-1}
                        placeholder="-1 = Sınırsız"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name={['limits', 'facilities']}
                      label="Tesis Sayısı"
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={-1}
                        placeholder="-1 = Sınırsız"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name={['limits', 'api_calls']}
                      label="API Çağrıları"
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        placeholder="Aylık limit"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name={['limits', 'storage_gb']}
                      label="Depolama (GB)"
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        placeholder="GB cinsinden"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            ) : (
              <div>
                                 <Descriptions column={2} bordered>
                   <Descriptions.Item label="Plan Adı" span={2}>
                     <Text strong>{selectedPlan.name || selectedPlan.Name}</Text>
                   </Descriptions.Item>
                   <Descriptions.Item label="Açıklama" span={2}>
                     {selectedPlan.description || selectedPlan.Description}
                   </Descriptions.Item>
                                     <Descriptions.Item label="Aylık Ücret">
                     <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                       ₺{(selectedPlan.monthlyFee || selectedPlan.MonthlyFee || 0).toLocaleString()}
                     </Text>
                   </Descriptions.Item>
                   <Descriptions.Item label="Plan Tipi">
                     <Tag color={getPlanColor(selectedPlan.type || selectedPlan.Type)}>
                       {(selectedPlan.type || selectedPlan.Type || 'UNKNOWN').toUpperCase()}
                     </Tag>
                   </Descriptions.Item>
                </Descriptions>

                <Divider>Özellikler</Divider>
                
                                 <List
                   dataSource={(() => {
                     const featuresData = selectedPlan.features || selectedPlan.Features
                     return typeof featuresData === 'string' ? JSON.parse(featuresData || '[]') : featuresData || []
                   })()} 
                  renderItem={(feature: string, index: number) => (
                    <List.Item key={`feature-${index}`}>
                      <Space>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        <Text>{feature}</Text>
                      </Space>
                    </List.Item>
                  )}
                />

                <Divider>Limitler</Divider>
                
                <Row gutter={16}>
                  <Col span={6}>
                    <Card size="small">
                                             <Statistic
                         title="Kullanıcı"
                         value={formatLimit('users', (() => {
                           const limitsData = selectedPlan.limits || selectedPlan.Limits
                           const limits = typeof limitsData === 'string' ? JSON.parse(limitsData || '{}') : limitsData || {}
                           return limits.users || 0
                         })())}
                         prefix={<UserOutlined />}
                       />
                     </Card>
                   </Col>
                   <Col span={6}>
                     <Card size="small">
                       <Statistic
                         title="Tesis"
                         value={formatLimit('facilities', (() => {
                           const limitsData = selectedPlan.limits || selectedPlan.Limits
                           const limits = typeof limitsData === 'string' ? JSON.parse(limitsData || '{}') : limitsData || {}
                           return limits.facilities || 0
                         })())}
                         prefix={<DatabaseOutlined />}
                       />
                     </Card>
                   </Col>
                   <Col span={6}>
                     <Card size="small">
                       <Statistic
                         title="API Çağrısı"
                         value={formatLimit('api_calls', (() => {
                           const limitsData = selectedPlan.limits || selectedPlan.Limits
                           const limits = typeof limitsData === 'string' ? JSON.parse(limitsData || '{}') : limitsData || {}
                           return limits.api_calls || 0
                         })())}
                         prefix={<ApiOutlined />}
                       />
                     </Card>
                   </Col>
                   <Col span={6}>
                     <Card size="small">
                       <Statistic
                         title="Depolama"
                         value={formatLimit('storage_gb', (() => {
                           const limitsData = selectedPlan.limits || selectedPlan.Limits
                           const limits = typeof limitsData === 'string' ? JSON.parse(limitsData || '{}') : limitsData || {}
                           return limits.storage_gb || 0
                         })())}
                         prefix={<DatabaseOutlined />}
                       />
                     </Card>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
} 