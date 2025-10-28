'use client'

import React, { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Row,
  Col,
  Statistic,
  DatePicker,
  InputNumber,
  Switch,
  App,
  Tooltip,
} from 'antd'
import {
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  PlayCircleOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { useTenants, useCreateTenant, useUpdateTenant, useDeleteTenant, useSuspendTenant, useActivateTenant } from '@/hooks/useTenants'
import { exportService } from '@/services/export.service'
import type { Tenant, CreateTenantDto, UpdateTenantDto, TenantFilters } from '@/types/api.types'
import dayjs from 'dayjs'

export default function TenantsPage() {
  const { message } = App.useApp()
  
  // Filters
  const [filters, setFilters] = useState<TenantFilters>({
    page: 1,
    pageSize: 10,
    search: '',
    status: undefined,
    subscription: undefined,
  })

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)

  // Forms
  const [createForm] = Form.useForm()
  const [editForm] = Form.useForm()

  // React Query hooks
  const { data: tenantsData, isLoading, refetch } = useTenants(filters)
  const createMutation = useCreateTenant()
  const updateMutation = useUpdateTenant()
  const deleteMutation = useDeleteTenant()
  const suspendMutation = useSuspendTenant()
  const activateMutation = useActivateTenant()

  // Handlers
  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value, page: 1 })
  }

  const handleFilterChange = (key: keyof TenantFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 })
  }

  const handleTableChange = (pagination: any) => {
    setFilters({ ...filters, page: pagination.current, pageSize: pagination.pageSize })
  }

  const handleCreate = async (values: any) => {
    try {
      const dto: CreateTenantDto = {
        companyName: values.companyName,
        facilityCode: values.facilityCode,
        domain: values.domain,
        adminEmail: values.adminEmail,
        subscription: values.subscription,
        subscriptionEndDate: values.subscriptionEndDate.format('YYYY-MM-DD'),
        monthlyFee: values.monthlyFee,
        currency: values.currency,
        language: values.language,
        logo: values.logo,
        createAdminUser: values.createAdminUser,
        adminPassword: values.createAdminUser ? values.adminPassword : undefined,
      }

      await createMutation.mutateAsync(dto)
      setIsCreateModalOpen(false)
      createForm.resetFields()
    } catch (error) {
      console.error('Create tenant error:', error)
    }
  }

  const handleEdit = (tenant: Tenant) => {
    setSelectedTenant(tenant)
    editForm.setFieldsValue({
      companyName: tenant.companyName,
      domain: tenant.domain,
      adminEmail: tenant.adminEmail,
      subscription: tenant.subscription,
      status: tenant.status,
      monthlyFee: tenant.monthlyFee,
      currency: tenant.currency,
      language: tenant.language,
      logo: tenant.logo,
    })
    setIsEditModalOpen(true)
  }

  const handleUpdate = async (values: any) => {
    if (!selectedTenant) return

    try {
      const dto: UpdateTenantDto = {
        companyName: values.companyName,
        domain: values.domain,
        adminEmail: values.adminEmail,
        subscription: values.subscription,
        status: values.status,
        monthlyFee: values.monthlyFee,
        currency: values.currency,
        language: values.language,
        logo: values.logo,
      }

      await updateMutation.mutateAsync({ id: selectedTenant.id, data: dto })
      setIsEditModalOpen(false)
      editForm.resetFields()
      setSelectedTenant(null)
    } catch (error) {
      console.error('Update tenant error:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
    } catch (error) {
      console.error('Delete tenant error:', error)
    }
  }

  const handleSuspend = async (id: number) => {
    try {
      await suspendMutation.mutateAsync({ id, reason: 'Suspended by admin' })
    } catch (error) {
      console.error('Suspend tenant error:', error)
    }
  }

  const handleActivate = async (id: number) => {
    try {
      await activateMutation.mutateAsync(id)
    } catch (error) {
      console.error('Activate tenant error:', error)
    }
  }

  const handleExport = (format: 'excel' | 'pdf' | 'csv') => {
    if (!tenantsData?.items) return

    const exportData = tenantsData.items.map((t) => ({
      'Şirket Adı': t.companyName,
      'Tesis Kodu': t.facilityCode,
      'Domain': t.domain,
      'Durum': t.status,
      'Abonelik': t.subscription,
      'Kullanıcı': t.userCount,
      'Oluşturma': dayjs(t.createdAt).format('DD/MM/YYYY'),
    }))

    exportService.export(exportData, {
      format,
      fileName: `tenants-${dayjs().format('YYYY-MM-DD')}`,
      includeHeaders: true,
    })

    message.success(`${format.toUpperCase()} olarak dışa aktarıldı`)
  }

  // Table columns
  const columns = [
    {
      title: 'Şirket',
      dataIndex: 'companyName',
      key: 'companyName',
      sorter: true,
      render: (text: string, record: Tenant) => (
        <Space>
          <TeamOutlined style={{ fontSize: 24, color: '#6366f1' }} />
          <div>
            <div style={{ fontWeight: 600 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{record.facilityCode}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain',
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = {
          Active: { color: 'green', icon: <CheckCircleOutlined /> },
          Suspended: { color: 'red', icon: <StopOutlined /> },
          Trial: { color: 'blue', icon: <ClockCircleOutlined /> },
          Expired: { color: 'orange', icon: <ClockCircleOutlined /> },
        }[status] || { color: 'default', icon: null }

        return (
          <Tag color={config.color} icon={config.icon}>
            {status}
          </Tag>
        )
      },
    },
    {
      title: 'Abonelik',
      dataIndex: 'subscription',
      key: 'subscription',
      render: (sub: string) => <Tag color="purple">{sub}</Tag>,
    },
    {
      title: 'Kullanıcılar',
      dataIndex: 'userCount',
      key: 'userCount',
      align: 'center' as const,
    },
    {
      title: 'Tesisler',
      dataIndex: 'facilityCount',
      key: 'facilityCount',
      align: 'center' as const,
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: any, record: Tenant) => (
        <Space>
          <Tooltip title="Görüntüle">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => message.info(`Viewing tenant ${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Düzenle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          {record.status === 'Active' ? (
            <Popconfirm
              title="Tenant'ı askıya al?"
              onConfirm={() => handleSuspend(record.id)}
            >
              <Tooltip title="Askıya Al">
                <Button type="text" danger icon={<StopOutlined />} />
              </Tooltip>
            </Popconfirm>
          ) : (
            <Tooltip title="Aktifleştir">
              <Button
                type="text"
                icon={<PlayCircleOutlined />}
                onClick={() => handleActivate(record.id)}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="Tenant'ı sil?"
            description="Bu işlem geri alınamaz!"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title="Sil">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Tenant"
              value={tenantsData?.totalCount || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#6366f1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Aktif"
              value={tenantsData?.items.filter((t) => t.status === 'Active').length || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Askıda"
              value={tenantsData?.items.filter((t) => t.status === 'Suspended').length || 0}
              prefix={<StopOutlined />}
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Trial"
              value={tenantsData?.items.filter((t) => t.status === 'Trial').length || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters & Actions */}
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Row gutter={16}>
            <Col flex="auto">
              <Input.Search
                placeholder="Şirket adı veya domain ara..."
                onSearch={handleSearch}
                allowClear
                style={{ width: '100%' }}
              />
            </Col>
            <Col>
              <Select
                placeholder="Durum"
                style={{ width: 150 }}
                allowClear
                onChange={(value) => handleFilterChange('status', value)}
              >
                <Select.Option value="Active">Aktif</Select.Option>
                <Select.Option value="Suspended">Askıda</Select.Option>
                <Select.Option value="Trial">Trial</Select.Option>
                <Select.Option value="Expired">Süresi Dolmuş</Select.Option>
              </Select>
            </Col>
            <Col>
              <Select
                placeholder="Abonelik"
                style={{ width: 150 }}
                allowClear
                onChange={(value) => handleFilterChange('subscription', value)}
              >
                <Select.Option value="Free">Free</Select.Option>
                <Select.Option value="Basic">Basic</Select.Option>
                <Select.Option value="Professional">Professional</Select.Option>
                <Select.Option value="Enterprise">Enterprise</Select.Option>
              </Select>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Yeni Tenant
              </Button>
            </Col>
            <Col>
              <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
                Yenile
              </Button>
            </Col>
            <Col>
              <Button.Group>
                <Button icon={<DownloadOutlined />} onClick={() => handleExport('excel')}>
                  Excel
                </Button>
                <Button onClick={() => handleExport('pdf')}>PDF</Button>
                <Button onClick={() => handleExport('csv')}>CSV</Button>
              </Button.Group>
            </Col>
          </Row>
        </Space>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={tenantsData?.items || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: filters.page,
            pageSize: filters.pageSize,
            total: tenantsData?.totalCount || 0,
            showSizeChanger: true,
            showTotal: (total) => `Toplam ${total} tenant`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        title="Yeni Tenant Oluştur"
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false)
          createForm.resetFields()
        }}
        onOk={() => createForm.submit()}
        confirmLoading={createMutation.isPending}
        width={800}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="companyName"
                label="Şirket Adı"
                rules={[{ required: true, message: 'Şirket adı gerekli' }]}
              >
                <Input placeholder="ABC Şirketi" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="facilityCode"
                label="Tesis Kodu"
                rules={[{ required: true, message: 'Tesis kodu gerekli' }]}
              >
                <Input placeholder="ABC123" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="domain"
                label="Domain"
                rules={[{ required: true, message: 'Domain gerekli' }]}
              >
                <Input placeholder="abc.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="adminEmail"
                label="Admin Email"
                rules={[{ required: true, type: 'email', message: 'Geçerli email gerekli' }]}
              >
                <Input placeholder="admin@abc.com" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="subscription"
                label="Abonelik Planı"
                rules={[{ required: true }]}
              >
                <Select placeholder="Plan seçin">
                  <Select.Option value="Free">Free</Select.Option>
                  <Select.Option value="Basic">Basic</Select.Option>
                  <Select.Option value="Professional">Professional</Select.Option>
                  <Select.Option value="Enterprise">Enterprise</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="subscriptionEndDate"
                label="Abonelik Bitiş"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="monthlyFee"
                label="Aylık Ücret"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="currency" label="Para Birimi" initialValue="TRY">
                <Select>
                  <Select.Option value="TRY">TRY</Select.Option>
                  <Select.Option value="USD">USD</Select.Option>
                  <Select.Option value="EUR">EUR</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="language" label="Dil" initialValue="tr">
                <Select>
                  <Select.Option value="tr">Türkçe</Select.Option>
                  <Select.Option value="en">English</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="logo" label="Logo URL">
            <Input placeholder="https://example.com/logo.png" />
          </Form.Item>

          <Form.Item name="createAdminUser" label="Admin Kullanıcısı Oluştur" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.createAdminUser !== currentValues.createAdminUser
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('createAdminUser') ? (
                <Form.Item
                  name="adminPassword"
                  label="Admin Şifresi"
                  rules={[{ required: true, min: 6, message: 'En az 6 karakter' }]}
                >
                  <Input.Password placeholder="Güçlü şifre girin" />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Tenant Düzenle"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false)
          editForm.resetFields()
          setSelectedTenant(null)
        }}
        onOk={() => editForm.submit()}
        confirmLoading={updateMutation.isPending}
        width={800}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="companyName" label="Şirket Adı">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="domain" label="Domain">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="adminEmail" label="Admin Email">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Durum">
                <Select>
                  <Select.Option value="Active">Aktif</Select.Option>
                  <Select.Option value="Suspended">Askıda</Select.Option>
                  <Select.Option value="Trial">Trial</Select.Option>
                  <Select.Option value="Expired">Süresi Dolmuş</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="subscription" label="Abonelik">
                <Select>
                  <Select.Option value="Free">Free</Select.Option>
                  <Select.Option value="Basic">Basic</Select.Option>
                  <Select.Option value="Professional">Professional</Select.Option>
                  <Select.Option value="Enterprise">Enterprise</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="monthlyFee" label="Aylık Ücret">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="currency" label="Para Birimi">
                <Select>
                  <Select.Option value="TRY">TRY</Select.Option>
                  <Select.Option value="USD">USD</Select.Option>
                  <Select.Option value="EUR">EUR</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="language" label="Dil">
                <Select>
                  <Select.Option value="tr">Türkçe</Select.Option>
                  <Select.Option value="en">English</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="logo" label="Logo URL">
            <Input placeholder="https://example.com/logo.png" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

