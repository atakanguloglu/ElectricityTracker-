'use client'

import React, { useState } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Button, 
  Tag, 
  Progress, 
  Statistic, 
  Typography, 
  Divider,
  Space,
  Tooltip,
  Badge,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Switch
} from 'antd'
import { 
  ProCard,
  PageContainer 
} from '@ant-design/pro-components'
import { 
  DollarOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  BarChartOutlined,
  PlusOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  CloudOutlined,
  HddOutlined,
  CalendarOutlined,
  UserOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select

export default function BillingManagementPage() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  // Mock billing data
  const billingStats = [
    {
      title: 'Toplam Gelir',
      value: '₺125,450',
      icon: <DollarOutlined style={{ fontSize: '24px', color: '#10b981' }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      change: '+12.5%',
      changeType: 'increase'
    },
    {
      title: 'Bekleyen Ödemeler',
      value: '₺15,230',
      icon: <CreditCardOutlined style={{ fontSize: '24px', color: '#f59e0b' }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      change: '+8.2%',
      changeType: 'increase'
    },
    {
      title: 'Aktif Abonelikler',
      value: '89',
      icon: <FileTextOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      change: '+5.1%',
      changeType: 'increase'
    },
    {
      title: 'Ortalama Fatura',
      value: '₺1,410',
      icon: <BarChartOutlined style={{ fontSize: '24px', color: '#8b5cf6' }} />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      change: '-2.3%',
      changeType: 'decrease'
    }
  ]

  const resourceUsage = [
    {
      name: 'CPU Kullanımı',
      used: 75,
      total: 100,
      unit: 'Core',
      icon: <ThunderboltOutlined style={{ color: '#3b82f6' }} />,
      color: '#3b82f6'
    },
    {
      name: 'RAM Kullanımı',
      used: 8.5,
      total: 16,
      unit: 'GB',
      icon: <DatabaseOutlined style={{ color: '#10b981' }} />,
      color: '#10b981'
    },
    {
      name: 'Depolama',
      used: 450,
      total: 1000,
      unit: 'GB',
      icon: <HddOutlined style={{ color: '#f59e0b' }} />,
      color: '#f59e0b'
    },
    {
      name: 'Bandwidth',
      used: 2.8,
      total: 10,
      unit: 'TB',
      icon: <CloudOutlined style={{ color: '#8b5cf6' }} />,
      color: '#8b5cf6'
    }
  ]

  const invoices = [
    {
      id: 'INV-2024-001',
      tenant: 'ABC Şirketi',
      amount: '₺2,450',
      status: 'paid',
      dueDate: '2024-01-15',
      issueDate: '2024-01-01',
      description: 'Ocak 2024 Elektrik Tüketimi'
    },
    {
      id: 'INV-2024-002',
      tenant: 'XYZ Ltd.',
      amount: '₺1,890',
      status: 'pending',
      dueDate: '2024-01-20',
      issueDate: '2024-01-05',
      description: 'Ocak 2024 Elektrik Tüketimi'
    },
    {
      id: 'INV-2024-003',
      tenant: 'DEF Corp.',
      amount: '₺3,120',
      status: 'overdue',
      dueDate: '2024-01-10',
      issueDate: '2023-12-20',
      description: 'Aralık 2024 Elektrik Tüketimi'
    },
    {
      id: 'INV-2024-004',
      tenant: 'GHI Inc.',
      amount: '₺1,650',
      status: 'paid',
      dueDate: '2024-01-25',
      issueDate: '2024-01-10',
      description: 'Ocak 2024 Elektrik Tüketimi'
    },
    {
      id: 'INV-2024-005',
      tenant: 'JKL Co.',
      amount: '₺2,890',
      status: 'pending',
      dueDate: '2024-01-30',
      issueDate: '2024-01-15',
      description: 'Ocak 2024 Elektrik Tüketimi'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success'
      case 'pending': return 'processing'
      case 'overdue': return 'error'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Ödendi'
      case 'pending': return 'Bekliyor'
      case 'overdue': return 'Gecikmiş'
      default: return 'Bilinmiyor'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircleOutlined style={{ color: '#10b981' }} />
      case 'pending': return <ClockCircleOutlined style={{ color: '#3b82f6' }} />
      case 'overdue': return <ExclamationCircleOutlined style={{ color: '#ef4444' }} />
      default: return <ClockCircleOutlined />
    }
  }

  const columns = [
    {
      title: 'Fatura No',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Text strong style={{ color: '#3b82f6' }}>{id}</Text>
      ),
    },
    {
      title: 'Tenant',
      dataIndex: 'tenant',
      key: 'tenant',
      render: (tenant: string) => (
        <div className="tenant-info">
          <UserOutlined style={{ marginRight: '8px', color: '#64748b' }} />
          {tenant}
        </div>
      ),
    },
    {
      title: 'Tutar',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => (
        <Text strong style={{ fontSize: '16px' }}>{amount}</Text>
      ),
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <div className="status-badge">
          {getStatusIcon(status)}
          <span className="status-text">{getStatusText(status)}</span>
        </div>
      ),
    },
    {
      title: 'Vade Tarihi',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => (
        <div className="date-info">
          <CalendarOutlined style={{ marginRight: '4px', color: '#64748b' }} />
          {date}
        </div>
      ),
    },
    {
      title: 'Açıklama',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <Text type="secondary">{description}</Text>
      ),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (record: any) => (
        <Space size="small">
          <Tooltip title="Görüntüle">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              className="action-button"
            />
          </Tooltip>
          <Tooltip title="İndir">
            <Button 
              type="text" 
              icon={<DownloadOutlined />} 
              size="small"
              className="action-button"
            />
          </Tooltip>
          <Tooltip title="Düzenle">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              className="action-button"
            />
          </Tooltip>
          <Tooltip title="Sil">
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              size="small"
              className="action-button delete-button"
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <PageContainer
      header={{
        title: (
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg shadow-lg">
              <DollarOutlined style={{ fontSize: '20px', color: 'white' }} />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, color: '#1e293b' }}>
                Fatura & Kaynak Yönetimi
              </Title>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                Faturaları yönetin, kaynak kullanımını izleyin ve ödemeleri takip edin.
              </Text>
            </div>
          </div>
        ),
        breadcrumb: {},
      }}
    >
      <div className="billing-management-container">
        {/* Billing Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          {billingStats.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card 
                className="stat-card"
                style={{
                  background: stat.gradient,
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <div className="stat-card-content">
                  <div className="stat-icon">
                    {stat.icon}
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-title">{stat.title}</div>
                    <div className={`stat-change ${stat.changeType}`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
                <div className="stat-card-overlay"></div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} className="mb-6">
          {/* Resource Usage */}
          <Col xs={24} lg={12}>
            <ProCard
              title={
                <div className="flex items-center space-x-2">
                  <BarChartOutlined style={{ color: '#3b82f6', fontSize: '18px' }} />
                  <span style={{ color: '#1e293b', fontWeight: 600 }}>Kaynak Kullanımı</span>
                </div>
              }
              className="resource-card"
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0'
              }}
            >
              <div className="resource-usage">
                {resourceUsage.map((resource, index) => (
                  <div key={index} className="resource-item">
                    <div className="resource-header">
                      <div className="resource-info">
                        <div className="resource-icon">
                          {resource.icon}
                        </div>
                        <div>
                          <div className="resource-name">{resource.name}</div>
                          <div className="resource-usage-text">
                            {resource.used} / {resource.total} {resource.unit}
                          </div>
                        </div>
                      </div>
                      <div className="resource-percentage">
                        {Math.round((resource.used / resource.total) * 100)}%
                      </div>
                    </div>
                    <Progress 
                      percent={Math.round((resource.used / resource.total) * 100)} 
                      strokeColor={resource.color}
                      strokeWidth={8}
                      showInfo={false}
                      className="resource-progress"
                    />
                  </div>
                ))}
              </div>
            </ProCard>
          </Col>

          {/* Quick Actions */}
          <Col xs={24} lg={12}>
            <ProCard
              title={
                <div className="flex items-center space-x-2">
                  <FileTextOutlined style={{ color: '#8b5cf6', fontSize: '18px' }} />
                  <span style={{ color: '#1e293b', fontWeight: 600 }}>Hızlı İşlemler</span>
                </div>
              }
              className="actions-card"
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0'
              }}
            >
              <div className="quick-actions">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  block
                  onClick={() => setIsModalVisible(true)}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    border: 'none',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}
                >
                  Yeni Fatura Oluştur
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  size="large"
                  block
                  style={{
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}
                >
                  Toplu Fatura İndir
                </Button>
                <Button
                  icon={<BarChartOutlined />}
                  size="large"
                  block
                  style={{
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                >
                  Rapor Oluştur
                </Button>
              </div>
            </ProCard>
          </Col>
        </Row>

        {/* Invoices Table */}
        <ProCard
          title={
            <div className="flex items-center space-x-2">
              <FileTextOutlined style={{ color: '#f59e0b', fontSize: '18px' }} />
              <span style={{ color: '#1e293b', fontWeight: 600 }}>Son Faturalar</span>
            </div>
          }
          className="table-card"
          style={{
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0'
          }}
        >
          <Table
            columns={columns}
            dataSource={invoices}
            rowKey="id"
            pagination={{
              total: invoices.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} fatura`,
            }}
            className="invoices-table"
          />
        </ProCard>

        {/* Create Invoice Modal */}
        <Modal
          title={
            <div className="flex items-center space-x-2">
              <PlusOutlined style={{ color: '#3b82f6' }} />
              <span>Yeni Fatura Oluştur</span>
            </div>
          }
          open={isModalVisible}
          onOk={() => setIsModalVisible(false)}
          onCancel={() => setIsModalVisible(false)}
          width={600}
          okText="Oluştur"
          cancelText="İptal"
        >
          <Form
            form={form}
            layout="vertical"
            className="invoice-form"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="tenant"
                  label="Tenant"
                  rules={[{ required: true, message: 'Tenant seçin!' }]}
                >
                  <Select placeholder="Tenant seçin">
                    <Option value="ABC Şirketi">ABC Şirketi</Option>
                    <Option value="XYZ Ltd.">XYZ Ltd.</Option>
                    <Option value="DEF Corp.">DEF Corp.</Option>
                    <Option value="GHI Inc.">GHI Inc.</Option>
                    <Option value="JKL Co.">JKL Co.</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="amount"
                  label="Tutar"
                  rules={[{ required: true, message: 'Tutar girin!' }]}
                >
                  <Input prefix="₺" placeholder="0.00" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="issueDate"
                  label="Düzenleme Tarihi"
                  rules={[{ required: true, message: 'Tarih seçin!' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dueDate"
                  label="Vade Tarihi"
                  rules={[{ required: true, message: 'Tarih seçin!' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="description"
              label="Açıklama"
              rules={[{ required: true, message: 'Açıklama girin!' }]}
            >
              <Input.TextArea rows={3} placeholder="Fatura açıklaması..." />
            </Form.Item>
          </Form>
        </Modal>

        <style jsx>{`
          .billing-management-container {
            padding: 0;
          }
          
          .stat-card {
            transition: all 0.3s ease;
            cursor: pointer;
          }
          
          .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15) !important;
          }
          
          .stat-card-content {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            color: white;
          }
          
          .stat-icon {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 12px;
            backdrop-filter: blur(10px);
          }
          
          .stat-info {
            text-align: right;
          }
          
          .stat-value {
            font-size: 28px;
            font-weight: bold;
            line-height: 1;
            margin-bottom: 4px;
          }
          
          .stat-title {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 500;
            margin-bottom: 4px;
          }
          
          .stat-change {
            font-size: 12px;
            font-weight: 600;
          }
          
          .stat-change.increase {
            color: #10b981;
          }
          
          .stat-change.decrease {
            color: #ef4444;
          }
          
          .stat-card-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
            z-index: 1;
          }
          
          .resource-card, .actions-card, .table-card {
            transition: all 0.3s ease;
          }
          
          .resource-card:hover, .actions-card:hover, .table-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
          }
          
          .resource-usage {
            padding: 8px 0;
          }
          
          .resource-item {
            margin-bottom: 20px;
          }
          
          .resource-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }
          
          .resource-info {
            display: flex;
            align-items: center;
          }
          
          .resource-icon {
            background: rgba(59, 130, 246, 0.1);
            border-radius: 8px;
            padding: 8px;
            margin-right: 12px;
          }
          
          .resource-name {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 2px;
          }
          
          .resource-usage-text {
            font-size: 12px;
            color: #64748b;
          }
          
          .resource-percentage {
            font-weight: bold;
            color: #3b82f6;
          }
          
          .resource-progress {
            border-radius: 4px;
          }
          
          .quick-actions {
            padding: 8px 0;
          }
          
          .tenant-info {
            display: flex;
            align-items: center;
            font-weight: 500;
          }
          
          .date-info {
            color: #64748b;
            font-size: 12px;
            display: flex;
            align-items: center;
          }
          
          .action-button {
            transition: all 0.3s ease;
            border-radius: 6px;
          }
          
          .action-button:hover {
            transform: scale(1.1);
            background: rgba(59, 130, 246, 0.1);
          }
          
          .delete-button:hover {
            background: rgba(239, 68, 68, 0.1) !important;
          }
          
          .status-badge {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            font-weight: 500;
          }
          
          .status-text {
            color: #374151;
          }
          
          .invoices-table :global(.ant-table-thead > tr > th) {
            background: #f8fafc;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e2e8f0;
          }
          
          .invoices-table :global(.ant-table-tbody > tr:hover > td) {
            background: rgba(59, 130, 246, 0.05);
          }
          
          .invoice-form :global(.ant-form-item-label > label) {
            font-weight: 600;
            color: #374151;
          }
          
          @media (max-width: 768px) {
            .stat-value {
              font-size: 24px;
            }
            
            .stat-title {
              font-size: 12px;
            }
            
            .resource-header {
              flex-direction: column;
              align-items: flex-start;
            }
            
            .resource-percentage {
              margin-top: 8px;
            }
          }
        `}</style>
      </div>
    </PageContainer>
  )
} 