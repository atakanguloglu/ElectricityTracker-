'use client'

import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Tag, 
  Typography, 
  Divider, 
  List, 
  Button, 
  Space, 
  Alert,
  Descriptions,
  Badge,
  Tooltip,
  Modal,
  Form,
  Select,
  message,
  App
} from 'antd'
import { 
  CrownOutlined, 
  UserOutlined, 
  BankOutlined, 
  ApiOutlined, 
  DatabaseOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons'
import { subscriptionService, SubscriptionPlan, TenantSubscriptionInfo } from '../../../services/subscriptionService'
import { getUser } from '@/utils/auth'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

export default function TenantSubscriptionPage() {
  const { message: messageApi } = App.useApp()
  const [subscriptionInfo, setSubscriptionInfo] = useState<TenantSubscriptionInfo | null>(null)
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [changePlanModalVisible, setChangePlanModalVisible] = useState(false)
  const [changePlanForm] = Form.useForm()
  const [changingPlan, setChangingPlan] = useState(false)

  const currentUser = getUser()

  useEffect(() => {
    if (currentUser?.tenantId) {
      loadSubscriptionData()
      loadAvailablePlans()
    }
  }, [currentUser])

  const loadSubscriptionData = async () => {
    try {
      setLoading(true)
      const info = await subscriptionService.getTenantSubscriptionInfo(currentUser!.tenantId)
      setSubscriptionInfo(info)
    } catch (error) {
      console.error('Subscription data load error:', error)
      messageApi.error('Abonelik bilgileri yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const loadAvailablePlans = async () => {
    try {
      const plans = await subscriptionService.getAvailablePlans()
      setAvailablePlans(plans)
    } catch (error) {
      console.error('Available plans load error:', error)
    }
  }

  const handleChangePlan = async (values: { newPlanType: string }) => {
    try {
      setChangingPlan(true)
      const result = await subscriptionService.changePlan(currentUser!.tenantId, values.newPlanType)
      
      if (result.success) {
        messageApi.success('Plan başarıyla değiştirildi')
        setChangePlanModalVisible(false)
        loadSubscriptionData() // Verileri yenile
      } else {
        messageApi.error(result.message || 'Plan değiştirilemedi')
      }
    } catch (error) {
      console.error('Plan change error:', error)
      messageApi.error('Plan değiştirilirken hata oluştu')
    } finally {
      setChangingPlan(false)
    }
  }

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0 // Sınırsız
    if (limit === 0) return 100
    return Math.min((current / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return '#ff4d4f' // Kırmızı
    if (percentage >= 75) return '#faad14' // Sarı
    return '#52c41a' // Yeşil
  }

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>Abonelik Bilgileri Yükleniyor...</Title>
      </div>
    )
  }

  if (!subscriptionInfo) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Abonelik Bilgisi Bulunamadı"
          description="Abonelik bilgileriniz yüklenemedi. Lütfen daha sonra tekrar deneyin."
          type="error"
          showIcon
        />
      </div>
    )
  }

  const { subscriptionPlan, currentUsage, maxUsers, maxFacilities, monthlyFee, currency, paymentStatus } = subscriptionInfo

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <CrownOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          Abonelik Detayları
        </Title>
        <Text type="secondary">
          Mevcut planınız ve kullanım istatistikleriniz
        </Text>
      </div>

      {/* Current Plan Card */}
      <Card 
        title={
          <Space>
            <CrownOutlined style={{ color: '#faad14' }} />
            Mevcut Plan: {subscriptionPlan.name}
          </Space>
        }
        extra={
          <Space>
            <Tag color="blue">{subscriptionPlan.type}</Tag>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={loadSubscriptionData}
              loading={loading}
            >
              Yenile
            </Button>
          </Space>
        }
        style={{ marginBottom: '24px' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Statistic
              title="Aylık Ücret"
              value={monthlyFee}
              prefix={currency === 'TRY' ? '₺' : currency === 'USD' ? '$' : '€'}
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
            />
          </Col>
          <Col xs={24} md={8}>
            <Statistic
              title="Plan Tipi"
              value={subscriptionPlan.type}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col xs={24} md={8}>
            <Statistic
              title="Durum"
              value={paymentStatus === 'Paid' ? 'Ödendi' : 'Beklemede'}
              valueStyle={{ 
                color: paymentStatus === 'Paid' ? '#52c41a' : '#faad14' 
              }}
            />
          </Col>
        </Row>

        <Divider />

        <Title level={4}>Plan Özellikleri</Title>
        <List
          dataSource={subscriptionPlan.features}
          renderItem={(feature) => (
            <List.Item>
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <Text>{feature}</Text>
              </Space>
            </List.Item>
          )}
        />
      </Card>

      {/* Usage Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Kullanıcılar"
              value={currentUsage.users}
              prefix={<UserOutlined />}
              suffix={`/ ${maxUsers === -1 ? '∞' : maxUsers}`}
              valueStyle={{ color: getUsageColor(getUsagePercentage(currentUsage.users, maxUsers)) }}
            />
            {maxUsers !== -1 && (
              <Progress
                percent={getUsagePercentage(currentUsage.users, maxUsers)}
                strokeColor={getUsageColor(getUsagePercentage(currentUsage.users, maxUsers))}
                showInfo={false}
                style={{ marginTop: '8px' }}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Tesisler"
              value={currentUsage.facilities}
              prefix={<BankOutlined />}
              suffix={`/ ${maxFacilities === -1 ? '∞' : maxFacilities}`}
              valueStyle={{ color: getUsageColor(getUsagePercentage(currentUsage.facilities, maxFacilities)) }}
            />
            {maxFacilities !== -1 && (
              <Progress
                percent={getUsagePercentage(currentUsage.facilities, maxFacilities)}
                strokeColor={getUsageColor(getUsagePercentage(currentUsage.facilities, maxFacilities))}
                showInfo={false}
                style={{ marginTop: '8px' }}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="API Çağrıları"
              value={currentUsage.apiCalls}
              prefix={<ApiOutlined />}
              suffix={`/ ${subscriptionPlan.limits.api_calls === -1 ? '∞' : subscriptionPlan.limits.api_calls}`}
              valueStyle={{ color: getUsageColor(getUsagePercentage(currentUsage.apiCalls, subscriptionPlan.limits.api_calls)) }}
            />
            {subscriptionPlan.limits.api_calls !== -1 && (
              <Progress
                percent={getUsagePercentage(currentUsage.apiCalls, subscriptionPlan.limits.api_calls)}
                strokeColor={getUsageColor(getUsagePercentage(currentUsage.apiCalls, subscriptionPlan.limits.api_calls))}
                showInfo={false}
                style={{ marginTop: '8px' }}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Depolama"
              value={currentUsage.storageUsed}
              prefix={<DatabaseOutlined />}
              suffix={`/ ${subscriptionPlan.limits.storage_gb === -1 ? '∞' : subscriptionPlan.limits.storage_gb} GB`}
              valueStyle={{ color: getUsageColor(getUsagePercentage(currentUsage.storageUsed, subscriptionPlan.limits.storage_gb)) }}
            />
            {subscriptionPlan.limits.storage_gb !== -1 && (
              <Progress
                percent={getUsagePercentage(currentUsage.storageUsed, subscriptionPlan.limits.storage_gb)}
                strokeColor={getUsageColor(getUsagePercentage(currentUsage.storageUsed, subscriptionPlan.limits.storage_gb))}
                showInfo={false}
                style={{ marginTop: '8px' }}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Plan Comparison & Change */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card 
            title="Mevcut Plan Detayları"
            extra={
              <Button 
                type="primary" 
                icon={<ArrowUpOutlined />}
                onClick={() => setChangePlanModalVisible(true)}
              >
                Plan Değiştir
              </Button>
            }
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Plan Adı">
                <Text strong>{subscriptionPlan.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Açıklama">
                {subscriptionPlan.description}
              </Descriptions.Item>
              <Descriptions.Item label="Aylık Ücret">
                <Text strong style={{ color: '#52c41a' }}>
                  {currency === 'TRY' ? '₺' : currency === 'USD' ? '$' : '€'}{monthlyFee}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Plan Tipi">
                <Tag color="blue">{subscriptionPlan.type}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Kullanım Özeti">
            <List
              dataSource={[
                {
                  title: 'Kullanıcı Kullanımı',
                  current: currentUsage.users,
                  limit: maxUsers,
                  icon: <UserOutlined />
                },
                {
                  title: 'Tesis Kullanımı',
                  current: currentUsage.facilities,
                  limit: maxFacilities,
                  icon: <BankOutlined />
                },
                {
                  title: 'API Kullanımı',
                  current: currentUsage.apiCalls,
                  limit: subscriptionPlan.limits.api_calls,
                  icon: <ApiOutlined />
                },
                {
                  title: 'Depolama Kullanımı',
                  current: currentUsage.storageUsed,
                  limit: subscriptionPlan.limits.storage_gb,
                  icon: <DatabaseOutlined />
                }
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Space>
                    {item.icon}
                    <Text>{item.title}</Text>
                    <Text type="secondary">
                      {item.current} / {item.limit === -1 ? '∞' : item.limit}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Change Plan Modal */}
      <Modal
        title="Plan Değiştir"
        open={changePlanModalVisible}
        onCancel={() => setChangePlanModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={changePlanForm}
          layout="vertical"
          onFinish={handleChangePlan}
        >
          <Form.Item
            name="newPlanType"
            label="Yeni Plan Seçin"
            rules={[{ required: true, message: 'Lütfen yeni plan seçin' }]}
          >
            <Select placeholder="Plan seçin">
              {availablePlans
                .filter(plan => plan.type !== subscriptionPlan.type)
                .map(plan => (
                  <Option key={plan.type} value={plan.type}>
                    <Space>
                      <Text>{plan.name}</Text>
                      <Tag color="blue">{plan.type}</Tag>
                      <Text type="secondary">
                        {plan.currency === 'TRY' ? '₺' : plan.currency === 'USD' ? '$' : '€'}{plan.monthlyFee}/ay
                      </Text>
                    </Space>
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Alert
            message="Plan Değişikliği"
            description="Plan değişikliği bir sonraki fatura döneminde geçerli olacaktır."
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={changingPlan}
                icon={<ArrowUpOutlined />}
              >
                Planı Değiştir
              </Button>
              <Button onClick={() => setChangePlanModalVisible(false)}>
                İptal
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
