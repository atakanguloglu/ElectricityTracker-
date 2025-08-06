'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProLayout } from '@ant-design/pro-components'
import { 
  DashboardOutlined, 
  TeamOutlined, 
  BankOutlined, 
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
  ThunderboltOutlined,
  RobotOutlined
} from '@ant-design/icons'
import { App, Avatar, Badge, Dropdown, Space, Typography } from 'antd'
import { getUser, isSuperAdmin, clearAuth } from '@/utils/auth'

const { Text } = Typography

export default function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { message } = App.useApp()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<{ id: number; firstName: string; lastName: string; email: string; role: string; tenantId: number; tenantName: string } | null>(null)

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
  }, [router, message])

  const handleLogout = () => {
    clearAuth()
    message.success('Başarıyla çıkış yapıldı')
    router.push('/login')
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profil',
      onClick: () => router.push('/tenant-dashboard/profile')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Ayarlar',
      onClick: () => router.push('/tenant-dashboard/settings')
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Çıkış Yap',
      onClick: handleLogout
    }
  ]

  const menuItems = [
    {
      path: '/tenant-dashboard',
      name: 'Dashboard',
      icon: <DashboardOutlined />
    },
    {
      path: '/tenant-dashboard/departments',
      name: 'Departmanlar',
      icon: <TeamOutlined />
    },
    {
      path: '/tenant-dashboard/facilities',
      name: 'Tesisler',
      icon: <BankOutlined />
    },
    {
      path: '/tenant-dashboard/consumption',
      name: 'Tüketim',
      icon: <ThunderboltOutlined />
    },
    {
      path: '/tenant-dashboard/reports',
      name: 'Raporlar',
      icon: <DashboardOutlined />
    },
    {
      path: '/tenant-dashboard/chatbot',
      name: 'AI Chat Bot',
      icon: <RobotOutlined />
    }
  ]

  if (!currentUser) {
    return null
  }

  return (
    <ProLayout
      title="Elektrik Takip Sistemi"
      logo="/vercel.svg"
      menuItemRender={(item, dom) => (
        <div onClick={() => router.push(item.path || '/tenant-dashboard')}>
          {dom}
        </div>
      )}
      menuDataRender={() => menuItems}
      avatarProps={{
        src: <Avatar icon={<UserOutlined />} />,
        size: 'small',
        title: currentUser?.firstName || 'Kullanıcı'
      }}
      actionsRender={() => [
        <Badge key="notifications" count={3}>
          <BellOutlined style={{ fontSize: '16px' }} />
        </Badge>,
        <Dropdown key="user" menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <Text>{currentUser?.firstName} {currentUser?.lastName}</Text>
          </Space>
        </Dropdown>
      ]}
      headerTitleRender={() => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ThunderboltOutlined style={{ fontSize: '24px', marginRight: '8px', color: '#1890ff' }} />
          <span>Elektrik Takip Sistemi</span>
        </div>
      )}
      rightContentRender={() => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Text type="secondary">Tenant Dashboard</Text>
        </div>
      )}
    >
      {children}
    </ProLayout>
  )
} 