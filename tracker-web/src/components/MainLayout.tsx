'use client'

import React, { useState } from 'react'
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography, Badge, Tag } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  AlertOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  HomeOutlined,
  FileTextOutlined,
  TeamOutlined,
  CrownOutlined,
  UserSwitchOutlined,
  DatabaseOutlined,
  AuditOutlined
} from '@ant-design/icons'
import { useRouter, usePathname } from 'next/navigation'
import { clearAuth, getUser, isAdmin, isManager, isUser, getFullName } from '@/utils/auth'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const user = getUser()

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  // Rol bazlı menü öğeleri
  const getMenuItems = () => {
    const baseItems = [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
      },
      {
        key: '/consumption',
        icon: <ThunderboltOutlined />,
        label: 'Tüketim Takibi',
      },
      {
        key: '/reports',
        icon: <BarChartOutlined />,
        label: 'Raporlar',
      },
      {
        key: '/alerts',
        icon: <AlertOutlined />,
        label: 'Uyarılar',
        children: [
          {
            key: '/alerts/active',
            label: 'Aktif Uyarılar',
          },
          {
            key: '/alerts/history',
            label: 'Uyarı Geçmişi',
          },
        ],
      },
      {
        key: '/facilities',
        icon: <HomeOutlined />,
        label: 'Tesisler',
      },
    ]

    // Admin ve Manager için ek menüler
    if (isAdmin() || isManager()) {
      baseItems.push(
        {
          key: '/documents',
          icon: <FileTextOutlined />,
          label: 'Dokümanlar',
        },
        {
          key: '/users',
          icon: <TeamOutlined />,
          label: 'Kullanıcılar',
        }
      )
    }

    // Sadece Admin için admin paneli linki
    if (isAdmin()) {
      baseItems.push(
        {
          key: '/admin',
          icon: <CrownOutlined />,
          label: 'Admin Paneli',
        }
      )
    }

    baseItems.push({
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Ayarlar',
    })

    return baseItems
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profil',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Ayarlar',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Çıkış Yap',
      onClick: handleLogout,
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'red'
      case 'Manager':
        return 'orange'
      case 'User':
        return 'blue'
      case 'Viewer':
        return 'green'
      default:
        return 'default'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <CrownOutlined />
      case 'Manager':
        return <UserSwitchOutlined />
      case 'User':
        return <UserOutlined />
      case 'Viewer':
        return <AuditOutlined />
      default:
        return <UserOutlined />
    }
  }

  return (
    <Layout className="min-h-screen">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="shadow-lg"
        style={{
          background: 'linear-gradient(180deg, #1e293b 0%, #334155 100%)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <ThunderboltOutlined className="text-white text-lg" />
            </div>
            {!collapsed && (
              <Title level={4} className="text-white mb-0 font-bold">
                Elektrik Takip
              </Title>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={getMenuItems()}
          onClick={handleMenuClick}
          className="border-0"
          style={{
            background: 'transparent',
          }}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header className="bg-white shadow-sm border-b border-gray-200 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-600 hover:text-gray-800"
            />
            <div className="hidden md:block">
              <Title level={4} className="mb-0 text-gray-800">
                {getMenuItems().find(item => item.key === pathname)?.label || 'Dashboard'}
              </Title>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Tenant Info */}
            {!collapsed && (
              <div className="hidden lg:block text-right">
                <div className="text-sm font-medium text-gray-800">
                  {user?.tenantName}
                </div>
                <div className="text-xs text-gray-500">
                  Tenant ID: {user?.tenantId}
                </div>
              </div>
            )}

            {/* Notifications */}
            <Badge count={3} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                className="text-gray-600 hover:text-gray-800"
              />
            </Badge>

            {/* User Menu */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                <Avatar 
                  size="small" 
                  icon={getRoleIcon((user as any)?.Role || user?.role || 'User')}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600"
                />
                {!collapsed && (
                  <div className="hidden md:block">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium text-gray-800">
                        {getFullName()}
                      </div>
                      <Tag 
                        color={getRoleColor((user as any)?.Role || user?.role || 'User')} 
                        icon={getRoleIcon((user as any)?.Role || user?.role || 'User')}
                      >
                        {(user as any)?.Role || user?.role}
                      </Tag>
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.email}
                    </div>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Main Content */}
        <Content className="m-6 p-6 bg-white rounded-lg shadow-sm">
          {children}
        </Content>
      </Layout>
    </Layout>
  )
} 