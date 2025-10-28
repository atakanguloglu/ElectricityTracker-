'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

import { 
  DashboardOutlined, 
  TeamOutlined, 
  BankOutlined, 
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
  ThunderboltOutlined,
  RobotOutlined,
  BarChartOutlined,
  ApiOutlined,
  DatabaseOutlined,
  CreditCardOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons'
import { App, Avatar, Badge, Dropdown, Space, Typography, Tooltip, Tag, Button, Input, Layout } from 'antd'
import { getUser, isSuperAdmin, clearAuth } from '@/utils/auth'
import { subscriptionService, SubscriptionPlan, SubscriptionLimits, TenantSubscriptionInfo } from '../../services/subscriptionService'

const { Text } = Typography

  // Local interfaces - will be replaced by imported ones

  // Menu item interface
  interface MenuItem {
    path: string;
    name: string;
    icon: React.ReactElement;
    alwaysShow: boolean;
    badge?: string;
  }

  // Tenant user interface
  interface TenantUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    tenantId: number;
    tenantName: string;
    subscriptionPlan?: SubscriptionPlan;
    subscriptionLimits?: SubscriptionLimits;
  }

export default function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { message } = App.useApp()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<TenantUser | null>(null)
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null)
  const [subscriptionLimits, setSubscriptionLimits] = useState<SubscriptionLimits | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    const user = getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // SuperAdmin kullanıcıları tenant dashboard'a erişemez
    if (isSuperAdmin()) {
      message.error('SuperAdmin kullanıcıları tenant dashboard\'ını kullanamaz')
      router.push('/admin')
      return
    }

    setCurrentUser(user)
    loadSubscriptionData(user.tenantId)
  }, [router, message])

  // Subscription plan verilerini yükle
  const loadSubscriptionData = async (tenantId: number) => {
    try {
      // Gerçek API çağrısı
      const subscriptionInfo = await subscriptionService.getTenantSubscriptionInfo(tenantId)
      
      setSubscriptionPlan(subscriptionInfo.subscriptionPlan)
      setSubscriptionLimits(subscriptionInfo.subscriptionPlan.limits)
    } catch (error) {
      console.error('Subscription data load error:', error)
      
      // Fallback: Mock data
      const mockPlan: SubscriptionPlan = {
        id: 1,
        type: 'Standard',
        name: 'Standard Plan',
        description: 'Orta ölçekli işletmeler için',
        monthlyFee: 199.99,
        features: ['Temel Raporlar', 'Email Bildirimleri', 'API Erişimi'],
        limits: {
          users: 25,
          facilities: 10,
          api_calls: 10000,
          storage_gb: 100
        },
        currency: 'TRY',
        isActive: true
      }

      setSubscriptionPlan(mockPlan)
      setSubscriptionLimits(mockPlan.limits)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearAuth()
    message.success('Başarıyla çıkış yapıldı')
    router.push('/login')
  }

  // Subscription plan'a göre menü öğelerini oluştur
  const getMenuItems = (): MenuItem[] => {
    const baseMenuItems: MenuItem[] = [
      {
        path: '/tenant-dashboard',
        name: 'Dashboard',
        icon: <DashboardOutlined />,
        alwaysShow: true
      }
    ]

    const conditionalMenuItems: MenuItem[] = []

    // Users menüsü - subscription limit'ine göre
    if (subscriptionLimits && (subscriptionLimits.users > 0 || subscriptionLimits.users === -1)) {
      conditionalMenuItems.push({
        path: '/tenant-dashboard/users',
        name: 'Kullanıcılar',
        icon: <TeamOutlined />,
        badge: subscriptionLimits.users === -1 ? '∞' : `0/${subscriptionLimits.users}`,
        alwaysShow: false
      })
    }

    // Facilities menüsü - subscription limit'ine göre
    if (subscriptionLimits && (subscriptionLimits.facilities > 0 || subscriptionLimits.facilities === -1)) {
      conditionalMenuItems.push({
        path: '/tenant-dashboard/facilities',
        name: 'Tesisler',
        icon: <BankOutlined />,
        badge: subscriptionLimits.facilities === -1 ? '∞' : `0/${subscriptionLimits.facilities}`,
        alwaysShow: false
      })
    }

    // Consumption menüsü - her zaman mevcut
    conditionalMenuItems.push({
      path: '/tenant-dashboard/consumption',
      name: 'Tüketim',
      icon: <ThunderboltOutlined />,
      alwaysShow: true
    })

    // Reports menüsü - her zaman mevcut
    conditionalMenuItems.push({
      path: '/tenant-dashboard/reports',
      name: 'Raporlar',
      icon: <BarChartOutlined />,
      alwaysShow: true
    })

    // API menüsü - subscription limit'ine göre
    if (subscriptionLimits && (subscriptionLimits.api_calls > 0 || subscriptionLimits.api_calls === -1)) {
      conditionalMenuItems.push({
        path: '/tenant-dashboard/api',
        name: 'API Yönetimi',
        icon: <ApiOutlined />,
        badge: subscriptionLimits.api_calls === -1 ? '∞' : 'API',
        alwaysShow: false
      })
    }

    // Storage menüsü - subscription limit'ine göre
    if (subscriptionLimits && (subscriptionLimits.storage_gb > 0 || subscriptionLimits.storage_gb === -1)) {
      conditionalMenuItems.push({
        path: '/tenant-dashboard/storage',
        name: 'Depolama',
        icon: <DatabaseOutlined />,
        badge: subscriptionLimits.storage_gb === -1 ? '∞' : `${subscriptionLimits.storage_gb}GB`,
        alwaysShow: false
      })
    }

    // Billing menüsü - her zaman mevcut
    conditionalMenuItems.push({
      path: '/tenant-dashboard/billing',
      name: 'Faturalama',
      icon: <CreditCardOutlined />,
      alwaysShow: true
    })

    // Help menüsü - her zaman mevcut
    conditionalMenuItems.push({
      path: '/tenant-dashboard/help',
      name: 'Yardım',
      icon: <QuestionCircleOutlined />,
      alwaysShow: true
    })

    // AI Chat Bot - her zaman mevcut
    conditionalMenuItems.push({
      path: '/tenant-dashboard/chatbot',
      name: 'AI Chat Bot',
      icon: <RobotOutlined />,
      alwaysShow: true
    })

    return [...baseMenuItems, ...conditionalMenuItems]
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profil',
      onClick: () => router.push('/tenant-dashboard/profile'),
      style: { padding: '8px 16px', fontSize: '14px' }
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Ayarlar',
      onClick: () => router.push('/tenant-dashboard/settings'),
      style: { padding: '8px 16px', fontSize: '14px' }
    },
    {
      type: 'divider' as const
    },
    {
      key: 'subscription',
      icon: <CreditCardOutlined />,
      label: 'Abonelik Detayları',
      onClick: () => router.push('/tenant-dashboard/subscription'),
      style: { padding: '8px 16px', fontSize: '14px' }
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Çıkış Yap',
      onClick: handleLogout,
      style: { padding: '8px 16px', fontSize: '14px' }
    }
  ]



  if (!currentUser || loading) {
    return null
  }



  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Modern Header */}
      <Layout.Header 
        style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 1000
        }}
      >
        {/* Left Side - Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{ fontSize: '18px', color: '#1890ff' }}
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #1890ff, #722ed1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
            }}>
              <ThunderboltOutlined style={{ fontSize: '20px', color: 'white' }} />
            </div>
            <div>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1f1f1f',
                lineHeight: '1.2'
              }}>
                Elektrik Takip Sistemi
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#666',
                lineHeight: '1.2'
              }}>
                {currentUser?.tenantName} - Tenant Dashboard
              </div>
            </div>
          </div>
        </div>

        {/* Center - Search Bar */}
        <div style={{ flex: 1, maxWidth: '400px', margin: '0 48px' }}>
          <Input
            placeholder="Ara... (kullanıcı, tesis, rapor)"
            prefix={<SearchOutlined style={{ color: '#999' }} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              borderRadius: '20px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)'
            }}
          />
        </div>

        {/* Right Side - Actions & User */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          position: 'relative'
        }}>
          {/* Subscription Plan Badge */}
          {subscriptionPlan && (
            <Tooltip title={`${subscriptionPlan.name} - ₺${subscriptionPlan.monthlyFee}/ay`}>
              <Tag 
                color="green" 
                style={{ 
                  cursor: 'pointer',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #52c41a, #73d13d)',
                  color: 'white',
                  fontWeight: '500',
                  boxShadow: '0 2px 8px rgba(82, 196, 26, 0.3)'
                }}
              >
                {subscriptionPlan.type}
              </Tag>
            </Tooltip>
          )}

          {/* Notifications */}
          <Badge count={3} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ 
                fontSize: '18px', 
                color: '#666',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          </Badge>

          {/* User Menu */}
          <Dropdown 
            menu={{ items: userMenuItems }} 
            placement="bottomRight"
            overlayStyle={{
              maxHeight: '300px',
              overflow: 'auto',
              zIndex: 1001,
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              marginTop: '8px'
            }}
            getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
            trigger={['click']}
            arrow={{ pointAtCenter: true }}
          >
            <Space style={{ cursor: 'pointer' }}>
              <Avatar 
                size="large"
                icon={<UserOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
                }}
              />
              <div>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#1f1f1f',
                  lineHeight: '1.2'
                }}>
                  {currentUser?.firstName} {currentUser?.lastName}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  lineHeight: '1.2'
                }}>
                  {currentUser?.role}
                </div>
              </div>
            </Space>
          </Dropdown>
        </div>
      </Layout.Header>

      <Layout>
        {/* Modern Sidebar */}
        <Layout.Sider
          width={280}
          collapsed={sidebarCollapsed}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Sidebar Header */}
          <div style={{
            padding: '24px 16px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)'
          }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f1f1f',
              textAlign: sidebarCollapsed ? 'center' : 'left'
            }}>
              {sidebarCollapsed ? 'ET' : 'Hızlı Erişim'}
            </div>
          </div>

          {/* Navigation Menu */}
          <div style={{ padding: '16px 8px' }}>
            {getMenuItems().map((item: MenuItem, index: number) => (
              <div key={item.path} style={{ marginBottom: '4px' }}>
                <div
                  onClick={() => router.push(item.path || '/tenant-dashboard')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                                         background: pathname === item.path ? 'linear-gradient(135deg, #1890ff, #722ed1)' : 'transparent',
                     color: pathname === item.path ? 'white' : '#666',
                     margin: '0 8px',
                     boxShadow: pathname === item.path ? '0 4px 12px rgba(24, 144, 255, 0.3)' : 'none'
                   }}
                   onMouseEnter={(e) => {
                     if (pathname !== item.path) {
                       e.currentTarget.style.background = 'rgba(24, 144, 255, 0.1)'
                       e.currentTarget.style.transform = 'translateX(4px)'
                     }
                   }}
                   onMouseLeave={(e) => {
                     if (pathname !== item.path) {
                       e.currentTarget.style.background = 'transparent'
                       e.currentTarget.style.transform = 'translateX(0)'
                     }
                   }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '18px' }}>
                      {item.icon}
                    </div>
                    {!sidebarCollapsed && (
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>
                        {item.name}
                      </span>
                    )}
                  </div>
                  
                  {!sidebarCollapsed && item.badge && (
                    <Tag 
                      color={item.badge === '∞' ? 'green' : 'blue'}
                      style={{ 
                        margin: 0,
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}
                    >
                      {item.badge}
                    </Tag>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          {!sidebarCollapsed && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)'
            }}>
              <div style={{
                fontSize: '12px',
                color: '#666',
                textAlign: 'center',
                marginBottom: '8px'
              }}>
                {subscriptionPlan?.type} Plan
              </div>
              <div style={{
                fontSize: '10px',
                color: '#999',
                textAlign: 'center'
              }}>
                Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
              </div>
            </div>
          )}
        </Layout.Sider>

        {/* Main Content */}
        <Layout.Content style={{ 
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          margin: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  )
} 