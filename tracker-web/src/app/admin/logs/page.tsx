'use client'

import React, { useState } from 'react'
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Table,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Tag,
  Statistic,
  Badge
} from 'antd'
import { 
  ProCard,
  PageContainer 
} from '@ant-design/pro-components'
import { 
  FileTextOutlined,
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Search } = Input
const { RangePicker } = DatePicker

export default function AdminLogsPage() {
  const [filteredLogs, setFilteredLogs] = useState<any[]>([])
  const [filters, setFilters] = useState({
    level: 'all',
    source: 'all',
    search: '',
    dateRange: null as any
  })

  // Mock log data
  const mockLogs = [
    {
      id: 1,
      timestamp: '2024-01-15 10:30:25',
      level: 'error',
      source: 'AuthController',
      message: 'Login failed for user: test@example.com',
      userId: 'user123',
      ipAddress: '192.168.1.101',
      userAgent: 'Chrome/120.0.0.0'
    },
    {
      id: 2,
      timestamp: '2024-01-15 10:25:15',
      level: 'info',
      source: 'TenantController',
      message: 'New tenant created: ABC Company',
      userId: 'admin456',
      ipAddress: '192.168.1.100',
      userAgent: 'Firefox/121.0'
    },
    {
      id: 3,
      timestamp: '2024-01-15 10:20:30',
      level: 'warning',
      source: 'SystemMonitor',
      message: 'High CPU usage detected: 85%',
      userId: 'system',
      ipAddress: 'System',
      userAgent: 'System'
    },
    {
      id: 4,
      timestamp: '2024-01-15 10:15:45',
      level: 'info',
      source: 'UserController',
      message: 'User profile updated: john.doe@example.com',
      userId: 'user789',
      ipAddress: '192.168.1.102',
      userAgent: 'Safari/17.0'
    },
    {
      id: 5,
      timestamp: '2024-01-15 10:10:20',
      level: 'error',
      source: 'DatabaseService',
      message: 'Database connection timeout',
      userId: 'system',
      ipAddress: 'System',
      userAgent: 'System'
    },
    {
      id: 6,
      timestamp: '2024-01-15 10:05:10',
      level: 'info',
      source: 'LogController',
      message: 'Log export completed',
      userId: 'admin456',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome/120.0.0.0'
    }
  ]

  React.useEffect(() => {
    setFilteredLogs(mockLogs)
  }, [])

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    let filtered = mockLogs

    // Apply level filter
    if (newFilters.level !== 'all') {
      filtered = filtered.filter(log => log.level === newFilters.level)
    }

    // Apply source filter
    if (newFilters.source !== 'all') {
      filtered = filtered.filter(log => log.source === newFilters.source)
    }

    // Apply search filter
    if (newFilters.search) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        log.source.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        log.ipAddress.includes(newFilters.search)
      )
    }

    // Apply date range filter
    if (newFilters.dateRange && newFilters.dateRange.length === 2) {
      const startDate = newFilters.dateRange[0].startOf('day')
      const endDate = newFilters.dateRange[1].endOf('day')
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp)
        return logDate >= startDate.toDate() && logDate <= endDate.toDate()
      })
    }

    setFilteredLogs(filtered)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'red'
      case 'warning':
        return 'orange'
      case 'info':
        return 'blue'
      case 'success':
        return 'green'
      default:
        return 'default'
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <ExclamationCircleOutlined style={{ color: '#ef4444' }} />
      case 'warning':
        return <WarningOutlined style={{ color: '#f59e0b' }} />
      case 'info':
        return <InfoCircleOutlined style={{ color: '#3b82f6' }} />
      case 'success':
        return <CheckCircleOutlined style={{ color: '#10b981' }} />
      default:
        return <InfoCircleOutlined />
    }
  }

  const columns = [
    {
      title: 'Zaman',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      render: (text: string) => (
        <div className="timestamp-info">
          <ClockCircleOutlined style={{ marginRight: '4px', color: '#64748b' }} />
          <Text style={{ fontSize: '12px' }}>{text}</Text>
        </div>
      )
    },
    {
      title: 'Seviye',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: string) => (
        <div className="level-badge">
          {getLevelIcon(level)}
          <span className="level-text">{level.toUpperCase()}</span>
        </div>
      )
    },
    {
      title: 'Kaynak',
      dataIndex: 'source',
      key: 'source',
      width: 120,
      render: (text: string) => (
        <Tag color="blue" className="source-tag">
          {text}
        </Tag>
      )
    },
    {
      title: 'Mesaj',
      dataIndex: 'message',
      key: 'message',
      render: (text: string) => (
        <Text style={{ fontSize: '14px' }}>{text}</Text>
      )
    },
    {
      title: 'IP Adresi',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 120,
      render: (text: string) => (
        <Text code style={{ fontSize: '12px' }}>{text}</Text>
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 100,
      render: (record: any) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            className="action-button"
            onClick={() => console.log(`Log detayı: ${record.message}`)}
          />
        </Space>
      )
    }
  ]

  const logStats = [
    {
      title: 'Toplam Log',
      value: mockLogs.length,
      icon: <FileTextOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
    },
    {
      title: 'Hata',
      value: mockLogs.filter(log => log.level === 'error').length,
      icon: <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#ef4444' }} />,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)'
    },
    {
      title: 'Uyarı',
      value: mockLogs.filter(log => log.level === 'warning').length,
      icon: <WarningOutlined style={{ fontSize: '24px', color: '#f59e0b' }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    },
    {
      title: 'Bilgi',
      value: mockLogs.filter(log => log.level === 'info').length,
      icon: <InfoCircleOutlined style={{ fontSize: '24px', color: '#10b981' }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)'
    }
  ]

  return (
    <PageContainer
      header={{
        title: (
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg">
              <FileTextOutlined style={{ fontSize: '20px', color: 'white' }} />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, color: '#1e293b' }}>
                Sistem Logları
              </Title>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                Sistem loglarını görüntüleyin, filtreleyin ve analiz edin.
              </Text>
            </div>
          </div>
        ),
        breadcrumb: {},
      }}
    >
      <div className="logs-container">
        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          {logStats.map((stat, index) => (
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

        {/* Filters */}
        <ProCard
          title={
            <div className="flex items-center space-x-2">
              <FilterOutlined style={{ color: '#8b5cf6', fontSize: '18px' }} />
              <span style={{ color: '#1e293b', fontWeight: 600 }}>Filtreler</span>
            </div>
          }
          className="filters-card"
          style={{
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0',
            marginBottom: '24px'
          }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={6}>
              <div className="filter-item">
                <Text strong style={{ marginBottom: '8px', display: 'block' }}>Log Seviyesi:</Text>
                <Select
                  placeholder="Log Seviyesi"
                  value={filters.level}
                  onChange={(value) => handleFilterChange('level', value)}
                  style={{ width: '100%' }}
                >
                  <Select.Option value="all">Tümü</Select.Option>
                  <Select.Option value="error">Hata</Select.Option>
                  <Select.Option value="warning">Uyarı</Select.Option>
                  <Select.Option value="info">Bilgi</Select.Option>
                  <Select.Option value="success">Başarı</Select.Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={6}>
              <div className="filter-item">
                <Text strong style={{ marginBottom: '8px', display: 'block' }}>Kaynak:</Text>
                <Select
                  placeholder="Kaynak"
                  value={filters.source}
                  onChange={(value) => handleFilterChange('source', value)}
                  style={{ width: '100%' }}
                >
                  <Select.Option value="all">Tümü</Select.Option>
                  <Select.Option value="AuthController">Kimlik Doğrulama</Select.Option>
                  <Select.Option value="TenantController">Tenant</Select.Option>
                  <Select.Option value="UserController">Kullanıcı</Select.Option>
                  <Select.Option value="SystemMonitor">Sistem</Select.Option>
                  <Select.Option value="DatabaseService">Veritabanı</Select.Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={6}>
              <div className="filter-item">
                <Text strong style={{ marginBottom: '8px', display: 'block' }}>Tarih Aralığı:</Text>
                <RangePicker
                  placeholder={['Başlangıç', 'Bitiş']}
                  value={filters.dateRange}
                  onChange={(dates) => handleFilterChange('dateRange', dates)}
                  style={{ width: '100%' }}
                />
              </div>
            </Col>
            <Col xs={24} sm={6}>
              <div className="filter-item">
                <Text strong style={{ marginBottom: '8px', display: 'block' }}>Arama:</Text>
                <Search
                  placeholder="Ara..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  onSearch={(value) => handleFilterChange('search', value)}
                  style={{ width: '100%' }}
                />
              </div>
            </Col>
          </Row>
        </ProCard>

        {/* Log Table */}
        <ProCard
          title={
            <div className="flex items-center space-x-2">
              <FileTextOutlined style={{ color: '#f59e0b', fontSize: '18px' }} />
              <span style={{ color: '#1e293b', fontWeight: 600 }}>
                Log Kayıtları ({filteredLogs.length})
              </span>
            </div>
          }
          extra={
            <Space>
              <Button 
                icon={<ReloadOutlined />}
                style={{
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              >
                Yenile
              </Button>
              <Button 
                icon={<DownloadOutlined />}
                type="primary"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  border: 'none',
                  borderRadius: '8px'
                }}
              >
                Dışa Aktar
              </Button>
            </Space>
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
            dataSource={filteredLogs}
            rowKey="id"
            pagination={{
              total: filteredLogs.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kayıt`,
            }}
            className="logs-table"
            scroll={{ x: 800 }}
          />
        </ProCard>

        <style jsx>{`
          .logs-container {
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
          
          .filters-card, .table-card {
            transition: all 0.3s ease;
          }
          
          .filters-card:hover, .table-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
          }
          
          .filter-item {
            margin-bottom: 16px;
          }
          
          .timestamp-info {
            display: flex;
            align-items: center;
            color: #64748b;
          }
          
          .level-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
          }
          
          .level-text {
            font-size: 12px;
            text-transform: uppercase;
            font-weight: 600;
          }
          
          .source-tag {
            font-weight: 600;
            border-radius: 6px;
          }
          
          .action-button {
            transition: all 0.3s ease;
            border-radius: 6px;
          }
          
          .action-button:hover {
            transform: scale(1.1);
            background: rgba(59, 130, 246, 0.1);
          }
          
          .logs-table :global(.ant-table-thead > tr > th) {
            background: #f8fafc;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e2e8f0;
          }
          
          .logs-table :global(.ant-table-tbody > tr:hover > td) {
            background: rgba(59, 130, 246, 0.05);
          }
          
          @media (max-width: 768px) {
            .stat-value {
              font-size: 24px;
            }
            
            .stat-title {
              font-size: 12px;
            }
            
            .level-badge {
              flex-direction: column;
              align-items: flex-start;
              gap: 4px;
            }
            
            .timestamp-info {
              flex-direction: column;
              align-items: flex-start;
            }
            
            .timestamp-info .anticon {
              margin-bottom: 4px;
              margin-right: 0;
            }
          }
        `}</style>
      </div>
    </PageContainer>
  )
} 