'use client'

import { useState, useMemo, useEffect } from 'react'
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Table,
  Button,
  Space,
  Tag,
  Statistic,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Popconfirm,
  Divider,
  Upload,
  Progress,
  Tabs,
  Badge,
  Tooltip,
  Switch,
  DatePicker
} from 'antd'
import { 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  DropboxOutlined,
  FireOutlined,
  CarOutlined,
  ToolOutlined,
  DollarOutlined,
  CalculatorOutlined,
  BarChartOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'

const { Title, Text } = Typography
const { Option } = Select
const { TabPane } = Tabs

// Mock data for resource types
const mockResourceTypes = [
  {
    id: 1,
    name: 'Elektrik',
    icon: '⚡',
    unit: 'kWh',
    defaultVAT: 20,
    defaultCurrency: 'TRY',
    description: 'Elektrik enerjisi tüketimi',
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Su',
    icon: '💧',
    unit: 'm³',
    defaultVAT: 8,
    defaultCurrency: 'TRY',
    description: 'Su tüketimi',
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: 3,
    name: 'Doğalgaz',
    icon: '🔥',
    unit: 'm³',
    defaultVAT: 18,
    defaultCurrency: 'TRY',
    description: 'Doğalgaz tüketimi',
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: 4,
    name: 'Yakıt',
    icon: '⛽',
    unit: 'L',
    defaultVAT: 20,
    defaultCurrency: 'TRY',
    description: 'Yakıt tüketimi',
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: 5,
    name: 'Isıtma',
    icon: '🌡️',
    unit: 'GJ',
    defaultVAT: 18,
    defaultCurrency: 'TRY',
    description: 'Merkezi ısıtma',
    isActive: false,
    createdAt: '2024-01-20'
  }
]

// Mock data for tenant expenses
const mockTenantExpenses = [
  {
    id: 1,
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    resourceTypeId: 1,
    resourceType: 'Elektrik',
    expenseName: 'Ana Bina Elektrik',
    unit: 'kWh',
    unitPrice: 1.25,
    VAT: 20,
    currency: 'TRY',
    isActive: true,
    description: 'Ana bina elektrik gideri',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    resourceTypeId: 2,
    resourceType: 'Su',
    expenseName: 'Su Tüketimi',
    unit: 'm³',
    unitPrice: 8.50,
    VAT: 8,
    currency: 'TRY',
    isActive: true,
    description: 'Su tüketim gideri',
    createdAt: '2024-01-15'
  },
  {
    id: 3,
    tenantId: 2,
    tenantName: 'XYZ Ltd.',
    resourceTypeId: 1,
    resourceType: 'Elektrik',
    expenseName: 'Ofis Elektrik',
    unit: 'kWh',
    unitPrice: 1.30,
    VAT: 20,
    currency: 'TRY',
    isActive: true,
    description: 'Ofis elektrik gideri',
    createdAt: '2024-01-16'
  },
  {
    id: 4,
    tenantId: 3,
    tenantName: 'TechCorp',
    resourceTypeId: 3,
    resourceType: 'Doğalgaz',
    expenseName: 'Doğalgaz Isıtma',
    unit: 'm³',
    unitPrice: 2.15,
    VAT: 18,
    currency: 'TRY',
    isActive: true,
    description: 'Doğalgaz ısıtma gideri',
    createdAt: '2024-01-17'
  }
]

// Mock data for company invoices (Şirket → Tenant faturaları)
const mockCompanyInvoices = [
  {
    id: 1,
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    invoiceType: 'subscription', // subscription, usage, service
    invoiceNumber: 'COMP-INV-2024-001',
    period: '2024-01',
    description: 'Premium Paket - Ocak 2024',
    quantity: 1,
    unit: 'ay',
    unitPrice: 299.99,
    subtotal: 299.99,
    VAT: 59.99,
    total: 359.98,
    currency: 'TRY',
    status: 'paid',
    dueDate: '2024-02-15',
    paidDate: '2024-02-10',
    createdAt: '2024-01-31',
    notes: 'Premium paket kullanım ücreti'
  },
  {
    id: 2,
    tenantId: 2,
    tenantName: 'XYZ Ltd.',
    invoiceType: 'subscription',
    invoiceNumber: 'COMP-INV-2024-002',
    period: '2024-01',
    description: 'Standart Paket - Ocak 2024',
    quantity: 1,
    unit: 'ay',
    unitPrice: 199.99,
    subtotal: 199.99,
    VAT: 39.99,
    total: 239.98,
    currency: 'TRY',
    status: 'pending',
    dueDate: '2024-02-15',
    paidDate: null,
    createdAt: '2024-01-31',
    notes: 'Standart paket kullanım ücreti'
  },
  {
    id: 3,
    tenantId: 3,
    tenantName: 'TechCorp',
    invoiceType: 'usage',
    invoiceNumber: 'COMP-INV-2024-003',
    period: '2024-01',
    description: 'Aşım Kullanım - Ek Kullanıcı',
    quantity: 5,
    unit: 'kullanıcı',
    unitPrice: 25.00,
    subtotal: 125.00,
    VAT: 25.00,
    total: 150.00,
    currency: 'TRY',
    status: 'overdue',
    dueDate: '2024-02-15',
    paidDate: null,
    createdAt: '2024-01-31',
    notes: 'Paket limitini aşan kullanıcı ücreti'
  },
  {
    id: 4,
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    invoiceType: 'service',
    invoiceNumber: 'COMP-INV-2024-004',
    period: '2024-01',
    description: 'Özel Entegrasyon Hizmeti',
    quantity: 1,
    unit: 'hizmet',
    unitPrice: 500.00,
    subtotal: 500.00,
    VAT: 100.00,
    total: 600.00,
    currency: 'TRY',
    status: 'paid',
    dueDate: '2024-02-15',
    paidDate: '2024-02-08',
    createdAt: '2024-01-31',
    notes: 'API entegrasyonu ve özelleştirme'
  }
]

// Mock data for tenant resource invoices (Tenant → Utility faturaları)
const mockTenantInvoices = [
  {
    id: 1,
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    resourceType: 'Elektrik',
    invoiceNumber: 'TENANT-INV-2024-001',
    period: '2024-01',
    consumption: 1250,
    unit: 'kWh',
    unitPrice: 1.25,
    subtotal: 1562.50,
    VAT: 312.50,
    total: 1875.00,
    currency: 'TRY',
    status: 'paid',
    dueDate: '2024-02-15',
    paidDate: '2024-02-10',
    createdAt: '2024-01-31',
    utilityProvider: 'EnerjiSA'
  },
  {
    id: 2,
    tenantId: 1,
    tenantName: 'ABC Şirketi',
    resourceType: 'Su',
    invoiceNumber: 'TENANT-INV-2024-002',
    period: '2024-01',
    consumption: 45,
    unit: 'm³',
    unitPrice: 8.50,
    subtotal: 382.50,
    VAT: 30.60,
    total: 413.10,
    currency: 'TRY',
    status: 'pending',
    dueDate: '2024-02-15',
    paidDate: null,
    createdAt: '2024-01-31',
    utilityProvider: 'İSKİ'
  }
]

export default function AdminBillingPage() {
  const [resourceTypes, setResourceTypes] = useState(mockResourceTypes)
  const [tenantExpenses, setTenantExpenses] = useState(mockTenantExpenses)
  const [companyInvoices, setCompanyInvoices] = useState(mockCompanyInvoices)
  const [tenantInvoices, setTenantInvoices] = useState(mockTenantInvoices)
  
  // Modal states
  const [resourceModalVisible, setResourceModalVisible] = useState(false)
  const [expenseModalVisible, setExpenseModalVisible] = useState(false)
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false)
  const [importModalVisible, setImportModalVisible] = useState(false)
  
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  
  const [resourceForm] = Form.useForm()
  const [expenseForm] = Form.useForm()
  const [invoiceForm] = Form.useForm()

  // Statistics
  const stats = useMemo(() => [
    {
      title: 'Toplam Kaynak Tipi',
      value: resourceTypes.length,
      icon: <ThunderboltOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Aktif Gider Tanımı',
      value: tenantExpenses.filter(e => e.isActive).length,
      icon: <CalculatorOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Şirket Faturaları',
      value: companyInvoices.length,
      icon: <FileTextOutlined />,
      color: '#faad14',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      title: 'Toplam Gelir',
      value: `₺${companyInvoices.filter((i: any) => i.status === 'paid').reduce((sum: number, i: any) => sum + i.total, 0).toLocaleString()}`,
      icon: <DollarOutlined />,
      color: '#eb2f96',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ], [resourceTypes, tenantExpenses, companyInvoices])

  // Resource Type handlers
  const handleAddResourceType = () => {
    setModalType('add')
    setSelectedItem(null)
    resourceForm.resetFields()
    setResourceModalVisible(true)
  }

  const handleEditResourceType = (resource: any) => {
    setModalType('edit')
    setSelectedItem(resource)
    resourceForm.setFieldsValue(resource)
    setResourceModalVisible(true)
  }

  const handleViewResourceType = (resource: any) => {
    setModalType('view')
    setSelectedItem(resource)
    resourceForm.setFieldsValue(resource)
    setResourceModalVisible(true)
  }

  const handleDeleteResourceType = (resource: any) => {
    setResourceTypes(prev => prev.filter(r => r.id !== resource.id))
    message.success(`${resource.name} kaynak tipi silindi`)
  }

  const handleResourceModalOk = async () => {
    try {
      const values = await resourceForm.validateFields()
      
      if (modalType === 'add') {
        const newResource = {
          id: Math.max(...resourceTypes.map(r => r.id)) + 1,
          ...values,
          isActive: true,
          createdAt: new Date().toISOString().split('T')[0]
        }
        setResourceTypes(prev => [...prev, newResource])
        message.success('Kaynak tipi başarıyla eklendi')
      } else if (modalType === 'edit') {
        setResourceTypes(prev => prev.map(r => 
          r.id === selectedItem.id ? { ...r, ...values } : r
        ))
        message.success('Kaynak tipi başarıyla güncellendi')
      }
      
      setResourceModalVisible(false)
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }

  // Tenant Expense handlers
  const handleAddExpense = () => {
    setModalType('add')
    setSelectedItem(null)
    expenseForm.resetFields()
    setExpenseModalVisible(true)
  }

  const handleEditExpense = (expense: any) => {
    setModalType('edit')
    setSelectedItem(expense)
    expenseForm.setFieldsValue(expense)
    setExpenseModalVisible(true)
  }

  const handleDeleteExpense = (expense: any) => {
    setTenantExpenses(prev => prev.filter(e => e.id !== expense.id))
    message.success(`${expense.expenseName} gider tanımı silindi`)
  }

  const handleExpenseModalOk = async () => {
    try {
      const values = await expenseForm.validateFields()
      
      if (modalType === 'add') {
        const newExpense = {
          id: Math.max(...tenantExpenses.map(e => e.id)) + 1,
          ...values,
          isActive: true,
          createdAt: new Date().toISOString().split('T')[0]
        }
        setTenantExpenses(prev => [...prev, newExpense])
        message.success('Gider tanımı başarıyla eklendi')
      } else if (modalType === 'edit') {
        setTenantExpenses(prev => prev.map(e => 
          e.id === selectedItem.id ? { ...e, ...values } : e
        ))
        message.success('Gider tanımı başarıyla güncellendi')
      }
      
      setExpenseModalVisible(false)
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }

  // Invoice handlers
  const handleViewInvoice = (invoice: any) => {
    setModalType('view')
    setSelectedItem(invoice)
    invoiceForm.setFieldsValue(invoice)
    setInvoiceModalVisible(true)
  }

  const handleDeleteCompanyInvoice = (invoice: any) => {
    setCompanyInvoices((prev: any) => prev.filter((i: any) => i.id !== invoice.id))
    message.success(`${invoice.invoiceNumber} şirket faturası silindi`)
  }

  const handleDeleteTenantInvoice = (invoice: any) => {
    setTenantInvoices((prev: any) => prev.filter((i: any) => i.id !== invoice.id))
    message.success(`${invoice.invoiceNumber} tenant faturası silindi`)
  }

  // Import handlers
  const handleImportInvoices = () => {
    setImportModalVisible(true)
  }

  const handleImportModalOk = () => {
    message.success('Fatura import işlemi başlatıldı')
    setImportModalVisible(false)
  }

  // Status helpers
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
      case 'pending': return 'Beklemede'
      case 'overdue': return 'Gecikmiş'
      default: return 'Bilinmiyor'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircleOutlined />
      case 'pending': return <ClockCircleOutlined />
      case 'overdue': return <ExclamationCircleOutlined />
      default: return <ClockCircleOutlined />
    }
  }

  // Resource type columns
  const resourceColumns = [
    {
      title: 'Kaynak Tipi',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <span style={{ fontSize: '20px' }}>{record.icon}</span>
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: 'Birim',
      dataIndex: 'unit',
      key: 'unit',
      render: (text: string) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Varsayılan KDV',
      dataIndex: 'defaultVAT',
      key: 'defaultVAT',
      render: (text: number) => <Tag color="green">%{text}</Tag>
    },
    {
      title: 'Para Birimi',
      dataIndex: 'defaultCurrency',
      key: 'defaultCurrency',
      render: (text: string) => <Tag color="purple">{text}</Tag>
    },
    {
      title: 'Durum',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? 'Aktif' : 'Pasif'}
        </Tag>
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewResourceType(record)}
            title="Detayları Görüntüle"
          />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditResourceType(record)}
            title="Düzenle"
          />
          <Popconfirm
            title="Bu kaynak tipini silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDeleteResourceType(record)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
              title="Sil"
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  // Tenant expense columns
  const expenseColumns = [
    {
      title: 'Tenant',
      dataIndex: 'tenantName',
      key: 'tenantName'
    },
    {
      title: 'Kaynak Tipi',
      dataIndex: 'resourceType',
      key: 'resourceType',
      render: (text: string) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Gider Adı',
      dataIndex: 'expenseName',
      key: 'expenseName'
    },
    {
      title: 'Birim Fiyat',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (text: number, record: any) => (
        <span>{text} ₺/{record.unit}</span>
      )
    },
    {
      title: 'KDV',
      dataIndex: 'VAT',
      key: 'VAT',
      render: (text: number) => <Tag color="green">%{text}</Tag>
    },
    {
      title: 'Durum',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? 'Aktif' : 'Pasif'}
        </Tag>
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditExpense(record)}
            title="Düzenle"
          />
          <Popconfirm
            title="Bu gider tanımını silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDeleteExpense(record)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
              title="Sil"
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  // Company Invoice columns (Şirket → Tenant)
  const companyInvoiceColumns = [
    {
      title: 'Fatura No',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Tenant',
      dataIndex: 'tenantName',
      key: 'tenantName'
    },
    {
      title: 'Fatura Tipi',
      dataIndex: 'invoiceType',
      key: 'invoiceType',
      render: (type: string) => {
        const typeConfig = {
          subscription: { color: 'blue', text: 'Abonelik' },
          usage: { color: 'orange', text: 'Kullanım' },
          service: { color: 'purple', text: 'Hizmet' }
        }
        const config = typeConfig[type as keyof typeof typeConfig] || { color: 'default', text: type }
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    {
      title: 'Açıklama',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Miktar',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text: number, record: any) => (
        <span>{text} {record.unit}</span>
      )
    },
    {
      title: 'Toplam',
      dataIndex: 'total',
      key: 'total',
      render: (text: number, record: any) => (
        <Text strong>{text} {record.currency}</Text>
      )
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={getStatusColor(status) as any} 
          text={getStatusText(status)}
        />
      )
    },
    {
      title: 'Vade Tarihi',
      dataIndex: 'dueDate',
      key: 'dueDate'
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewInvoice(record)}
            title="Detayları Görüntüle"
          />
          <Popconfirm
            title="Bu faturayı silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDeleteCompanyInvoice(record)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
              title="Sil"
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  // Tenant Invoice columns (Tenant → Utility)
  const tenantInvoiceColumns = [
    {
      title: 'Fatura No',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Tenant',
      dataIndex: 'tenantName',
      key: 'tenantName'
    },
    {
      title: 'Kaynak',
      dataIndex: 'resourceType',
      key: 'resourceType',
      render: (text: string) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Sağlayıcı',
      dataIndex: 'utilityProvider',
      key: 'utilityProvider'
    },
    {
      title: 'Dönem',
      dataIndex: 'period',
      key: 'period'
    },
    {
      title: 'Tüketim',
      dataIndex: 'consumption',
      key: 'consumption',
      render: (text: number, record: any) => (
        <span>{text} {record.unit}</span>
      )
    },
    {
      title: 'Toplam',
      dataIndex: 'total',
      key: 'total',
      render: (text: number, record: any) => (
        <Text strong>{text} {record.currency}</Text>
      )
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={getStatusColor(status) as any} 
          text={getStatusText(status)}
        />
      )
    },
    {
      title: 'Vade Tarihi',
      dataIndex: 'dueDate',
      key: 'dueDate'
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewInvoice(record)}
            title="Detayları Görüntüle"
          />
          <Popconfirm
            title="Bu faturayı silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDeleteTenantInvoice(record)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
              title="Sil"
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Title level={2} className="mb-2">
          <DollarOutlined className="mr-3 text-blue-600" />
          Fatura & Kaynak Yönetimi
        </Title>
        <Text className="text-gray-600">
          Kaynak tiplerini, tenant giderlerini ve faturaları yönetin.
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        {stats.map((stat, index) => (
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
                </div>
              </div>
              <div className="stat-card-overlay"></div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content Tabs */}
      <Tabs defaultActiveKey="resources" size="large">
        <TabPane 
          tab={
            <span>
              <ThunderboltOutlined />
              Kaynak Tipleri
            </span>
          } 
          key="resources"
        >
          <Card 
            title="Kaynak Tipleri"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddResourceType}
              >
                Yeni Kaynak Tipi Ekle
              </Button>
            }
            className="shadow-sm"
          >
            <Table
              columns={resourceColumns}
              dataSource={resourceTypes}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} / ${total} kaynak tipi`
              }}
            />
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <CalculatorOutlined />
              Tenant Giderleri
            </span>
          } 
          key="expenses"
        >
          <Card 
            title="Tenant Bazlı Gider Tanımları"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddExpense}
              >
                Yeni Gider Tanımı Ekle
              </Button>
            }
            className="shadow-sm"
          >
            <Table
              columns={expenseColumns}
              dataSource={tenantExpenses}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} / ${total} gider tanımı`
              }}
            />
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <DollarOutlined />
              Şirket Faturaları
            </span>
          } 
          key="company-invoices"
        >
          <Card 
            title="Şirket → Tenant Faturaları (Uygulama Kullanım)"
            extra={
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                >
                  Yeni Fatura Oluştur
                </Button>
                <Button 
                  icon={<DownloadOutlined />}
                >
                  Excel Export
                </Button>
              </Space>
            }
            className="shadow-sm"
          >
            <Table
              columns={companyInvoiceColumns}
              dataSource={companyInvoices}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} / ${total} şirket faturası`
              }}
            />
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <FileTextOutlined />
              Tenant Faturaları
            </span>
          } 
          key="tenant-invoices"
        >
          <Card 
            title="Tenant → Utility Faturaları (Elektrik, Su, vb.)"
            extra={
              <Space>
                <Button 
                  icon={<UploadOutlined />}
                  onClick={handleImportInvoices}
                >
                  Toplu Import
                </Button>
                <Button 
                  icon={<DownloadOutlined />}
                >
                  Excel Export
                </Button>
              </Space>
            }
            className="shadow-sm"
          >
            <Table
              columns={tenantInvoiceColumns}
              dataSource={tenantInvoices}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} / ${total} tenant faturası`
              }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Resource Type Modal */}
      <Modal
        title={
          modalType === 'add' ? 'Yeni Kaynak Tipi Ekle' :
          modalType === 'edit' ? 'Kaynak Tipi Düzenle' : 'Kaynak Tipi Detayları'
        }
        open={resourceModalVisible}
        onOk={modalType !== 'view' ? handleResourceModalOk : undefined}
        onCancel={() => setResourceModalVisible(false)}
        width={600}
        okText={modalType === 'add' ? 'Ekle' : 'Güncelle'}
        cancelText="İptal"
      >
        <Form
          form={resourceForm}
          layout="vertical"
          disabled={modalType === 'view'}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Kaynak Adı"
                rules={[{ required: true, message: 'Kaynak adı gerekli' }]}
              >
                <Input placeholder="Elektrik, Su, Doğalgaz..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="icon"
                label="İkon"
                rules={[{ required: true, message: 'İkon gerekli' }]}
              >
                <Input placeholder="⚡, 💧, 🔥..." />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="unit"
                label="Birim"
                rules={[{ required: true, message: 'Birim gerekli' }]}
              >
                <Input placeholder="kWh, m³, L..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="defaultVAT"
                label="Varsayılan KDV (%)"
                rules={[{ required: true, message: 'KDV oranı gerekli' }]}
              >
                <InputNumber 
                  min={0} 
                  max={100} 
                  placeholder="20" 
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="defaultCurrency"
                label="Varsayılan Para Birimi"
                rules={[{ required: true, message: 'Para birimi gerekli' }]}
              >
                <Select placeholder="Para birimi seçin">
                  <Option value="TRY">Türk Lirası (₺)</Option>
                  <Option value="USD">Amerikan Doları ($)</Option>
                  <Option value="EUR">Euro (€)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="Durum"
                valuePropName="checked"
              >
                <Switch checkedChildren="Aktif" unCheckedChildren="Pasif" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Açıklama"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Kaynak tipi hakkında açıklama..."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Tenant Expense Modal */}
      <Modal
        title={
          modalType === 'add' ? 'Yeni Gider Tanımı Ekle' :
          modalType === 'edit' ? 'Gider Tanımı Düzenle' : 'Gider Tanımı Detayları'
        }
        open={expenseModalVisible}
        onOk={modalType !== 'view' ? handleExpenseModalOk : undefined}
        onCancel={() => setExpenseModalVisible(false)}
        width={700}
        okText={modalType === 'add' ? 'Ekle' : 'Güncelle'}
        cancelText="İptal"
      >
        <Form
          form={expenseForm}
          layout="vertical"
          disabled={modalType === 'view'}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tenantId"
                label="Tenant"
                rules={[{ required: true, message: 'Tenant seçin' }]}
              >
                <Select placeholder="Tenant seçin">
                  <Option value={1}>ABC Şirketi</Option>
                  <Option value={2}>XYZ Ltd.</Option>
                  <Option value={3}>TechCorp</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="resourceTypeId"
                label="Kaynak Tipi"
                rules={[{ required: true, message: 'Kaynak tipi seçin' }]}
              >
                <Select placeholder="Kaynak tipi seçin">
                  {resourceTypes.map(rt => (
                    <Option key={rt.id} value={rt.id}>
                      {rt.icon} {rt.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="expenseName"
                label="Gider Adı"
                rules={[{ required: true, message: 'Gider adı gerekli' }]}
              >
                <Input placeholder="Ana Bina Elektrik, Su Tüketimi..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="unitPrice"
                label="Birim Fiyat"
                rules={[{ required: true, message: 'Birim fiyat gerekli' }]}
              >
                <InputNumber 
                  min={0} 
                  placeholder="1.25" 
                  style={{ width: '100%' }}
                  addonAfter="₺"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="VAT"
                label="KDV (%)"
                rules={[{ required: true, message: 'KDV oranı gerekli' }]}
              >
                <InputNumber 
                  min={0} 
                  max={100} 
                  placeholder="20" 
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="currency"
                label="Para Birimi"
                rules={[{ required: true, message: 'Para birimi gerekli' }]}
              >
                <Select placeholder="Para birimi seçin">
                  <Option value="TRY">Türk Lirası (₺)</Option>
                  <Option value="USD">Amerikan Doları ($)</Option>
                  <Option value="EUR">Euro (€)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="Durum"
                valuePropName="checked"
              >
                <Switch checkedChildren="Aktif" unCheckedChildren="Pasif" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Açıklama"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Gider tanımı hakkında açıklama..."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Invoice Modal */}
      <Modal
        title="Fatura Detayları"
        open={invoiceModalVisible}
        onCancel={() => setInvoiceModalVisible(false)}
        width={600}
        footer={[
          <Button key="close" onClick={() => setInvoiceModalVisible(false)}>
            Kapat
          </Button>
        ]}
      >
        {selectedItem && (
          <div>
            <Row gutter={16} className="mb-4">
              <Col span={12}>
                <Text strong>Fatura No:</Text>
                <br />
                <Text>{selectedItem.invoiceNumber}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Durum:</Text>
                <br />
                <Badge 
                  status={getStatusColor(selectedItem.status) as any} 
                  text={getStatusText(selectedItem.status)}
                />
              </Col>
            </Row>
            
            <Row gutter={16} className="mb-4">
              <Col span={12}>
                <Text strong>Tenant:</Text>
                <br />
                <Text>{selectedItem.tenantName}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Kaynak:</Text>
                <br />
                <Tag color="blue">{selectedItem.resourceType}</Tag>
              </Col>
            </Row>
            
            <Row gutter={16} className="mb-4">
              <Col span={12}>
                <Text strong>Dönem:</Text>
                <br />
                <Text>{selectedItem.period}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Tüketim:</Text>
                <br />
                <Text>{selectedItem.consumption} {selectedItem.unit}</Text>
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={16} className="mb-4">
              <Col span={12}>
                <Text strong>Birim Fiyat:</Text>
                <br />
                <Text>{selectedItem.unitPrice} {selectedItem.currency}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Ara Toplam:</Text>
                <br />
                <Text>{selectedItem.subtotal} {selectedItem.currency}</Text>
              </Col>
            </Row>
            
            <Row gutter={16} className="mb-4">
              <Col span={12}>
                <Text strong>KDV:</Text>
                <br />
                <Text>{selectedItem.VAT} {selectedItem.currency}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Toplam:</Text>
                <br />
                <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                  {selectedItem.total} {selectedItem.currency}
                </Text>
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Vade Tarihi:</Text>
                <br />
                <Text>{selectedItem.dueDate}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Ödeme Tarihi:</Text>
                <br />
                <Text>{selectedItem.paidDate || 'Henüz ödenmedi'}</Text>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Import Modal */}
      <Modal
        title="Toplu Fatura Import"
        open={importModalVisible}
        onOk={handleImportModalOk}
        onCancel={() => setImportModalVisible(false)}
        width={500}
        okText="Import Et"
        cancelText="İptal"
      >
        <div className="text-center">
          <Upload.Dragger
            name="file"
            multiple={false}
            accept=".xlsx,.xls,.csv"
            beforeUpload={() => false}
          >
            <p className="ant-upload-drag-icon">
              <FileExcelOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">Excel veya CSV dosyasını buraya sürükleyin</p>
            <p className="ant-upload-hint">
              Desteklenen formatlar: .xlsx, .xls, .csv
            </p>
          </Upload.Dragger>
          
          <Divider />
          
          <div className="text-left">
            <Text strong>Import Şablonu:</Text>
            <br />
            <Text type="secondary">
              Dosyanızda şu sütunlar bulunmalıdır:
            </Text>
            <ul className="mt-2">
              <li>tenant_id (Tenant ID)</li>
              <li>resource_type (Kaynak Tipi)</li>
              <li>period (Dönem - YYYY-MM)</li>
              <li>consumption (Tüketim)</li>
              <li>unit_price (Birim Fiyat)</li>
              <li>vat_rate (KDV Oranı)</li>
            </ul>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        .stat-card {
          transition: transform 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
        }
        
        .stat-card-content {
          display: flex;
          align-items: center;
          color: white;
          position: relative;
          z-index: 2;
        }
        
        .stat-icon {
          font-size: 32px;
          margin-right: 16px;
          opacity: 0.9;
        }
        
        .stat-info {
          flex: 1;
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
        }
        
        .stat-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.1);
          z-index: 1;
        }
      `}</style>
    </div>
  )
} 