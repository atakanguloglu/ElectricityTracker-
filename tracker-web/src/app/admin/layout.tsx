'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button, message, Avatar, Dropdown, Badge, Tooltip, Space, Typography } from 'antd'
import { 
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  MessageOutlined,
  SearchOutlined,
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
  SafetyOutlined,
  CrownOutlined,
  BarChartOutlined,
  ApiOutlined,
  DatabaseOutlined,
  MonitorOutlined,
  AppstoreOutlined,
  FullscreenOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  ControlOutlined,
  ClusterOutlined,
  ExperimentOutlined,
  RobotOutlined,
  GiftOutlined
} from '@ant-design/icons'
import { 
  ProLayout, 
  PageContainer,
  ProConfigProvider
} from '@ant-design/pro-components'
import { getUser, isAdmin, clearAuth } from '@/utils/auth'
import { logger } from '@/utils/logger'

const { Text } = Typography

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  avatar?: string
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const currentUser = getUser()
    
    if (!currentUser) {
      message.error('Oturum bulunamadı. Lütfen giriş yapın.')
      router.push('/login')
      return
    }

    if (!isAdmin()) {
      message.error('Bu sayfaya erişim yetkiniz yok.')
      router.push('/dashboard')
      return
    }

    setUser(currentUser)
    setLoading(false)
    
    logger.info('Admin layout accessed', 'AdminLayout', {
      userId: currentUser.id,
      userEmail: currentUser.email
    })
  }, [router])

  const handleLogout = () => {
    clearAuth()
    message.success('Başarıyla çıkış yapıldı')
    router.push('/login')
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profil Ayarları',
      onClick: () => router.push('/admin/profile')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Hesap Ayarları',
      onClick: () => router.push('/admin/account-settings')
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: 'Yardım & Destek',
      onClick: () => router.push('/admin/help')
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Güvenli Çıkış',
      onClick: handleLogout,
      danger: true
    }
  ]

  const menuItems = useMemo(() => [
    {
      key: 'dashboard',
      path: '/admin',
      name: 'Genel Bakış',
      icon: <DashboardOutlined className="menu-icon" />,
      exact: true
    },
    {
      key: 'management',
      name: 'Yönetim Merkezi',
      icon: <ControlOutlined className="menu-icon" />,
      children: [
        {
          key: 'tenants',
          path: '/admin/tenants',
          name: 'Tenant Yönetimi',
          icon: <TeamOutlined className="menu-icon" />,
        },
        {
          key: 'users',
          path: '/admin/users',
          name: 'Kullanıcı Yönetimi',
          icon: <UserOutlined className="menu-icon" />,
        },
        {
          key: 'billing',
          path: '/admin/billing',
          name: 'Fatura & Kaynak',
          icon: <FileTextOutlined className="menu-icon" />,
        },
        {
          key: 'subscription-plans',
          path: '/admin/subscription-plans',
          name: 'Paket Yönetimi',
          icon: <GiftOutlined className="menu-icon" />,
        }
      ]
    },
    {
      key: 'system',
      name: 'Sistem Kontrolü',
      icon: <ClusterOutlined className="menu-icon" />,
      children: [
        {
          key: 'api',
          path: '/admin/api',
          name: 'API Yönetimi',
          icon: <ApiOutlined className="menu-icon" />,
        },
        {
          key: 'logs',
          path: '/admin/logs',
          name: 'Sistem Logları',
          icon: <DatabaseOutlined className="menu-icon" />,
        },
        {
          key: 'security',
          path: '/admin/security',
          name: 'Güvenlik Merkezi',
          icon: <SafetyOutlined className="menu-icon" />,
        },
        {
          key: 'monitoring',
          path: '/admin/monitoring',
          name: 'Sistem İzleme',
          icon: <MonitorOutlined className="menu-icon" />,
        }
      ]
    },
    {
      key: 'analytics',
      name: 'Analiz & Raporlama',
      icon: <ExperimentOutlined className="menu-icon" />,
      children: [
        {
          key: 'ai-analytics',
          path: '/admin/ai-analytics',
          name: 'AI Analiz',
          icon: <RobotOutlined className="menu-icon" />,
        },
        {
          key: 'reports',
          path: '/admin/reports',
          name: 'Raporlama',
          icon: <BarChartOutlined className="menu-icon" />,
        },
        {
          key: 'analytics-dashboard',
          path: '/admin/analytics',
          name: 'Analitik Dashboard',
          icon: <AppstoreOutlined className="menu-icon" />,
        }
      ]
    },
            {
          key: 'chatbot',
          path: '/admin/chatbot',
          name: 'Chat Bot',
          icon: <MessageOutlined className="menu-icon" />,
        },
        {
          key: 'settings',
          path: '/admin/settings',
          name: 'Sistem Ayarları',
          icon: <SettingOutlined className="menu-icon" />,
        },
        {
          key: 'settings-old',
      path: '/admin/settings',
      name: 'Sistem Ayarları',
      icon: <SettingOutlined className="menu-icon" />,
    }
  ], [])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-backdrop"></div>
        <div className="loading-content">
          <div className="loading-logo">
            <ThunderboltOutlined className="loading-icon" />
          </div>
          <div className="loading-spinner"></div>
          <div className="loading-text">
            <h2>Sistem Hazırlanıyor</h2>
            <p>Elektrik Takip Admin Paneli yükleniyor...</p>
          </div>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-layout-container">
      <ProConfigProvider
        dark={false}
        token={{
          colorPrimary: '#6366f1',
          colorSuccess: '#10b981',
          colorWarning: '#f59e0b',
          colorError: '#ef4444',
          colorInfo: '#8b5cf6',
          borderRadius: 12,
          wireframe: false,
        }}
      >
        <ProLayout
          title="Elektrik Takip Sistemi"
          headerTitleRender={(logo, title) => (
            <div className="header-title">
              <div className="logo-container">
                <div className="logo-inner">
                  <ThunderboltOutlined className="logo-icon" />
                </div>
                <div className="logo-glow"></div>
              </div>
              <div className="title-content">
                <h1 className="main-title">Elektrik Takip Sistemi</h1>
                <Text className="subtitle">
                  <span className="subtitle-dot"></span>
                  Admin Panel
                </Text>
              </div>
            </div>
          )}
          logo={false}
          collapsed={collapsed}
          onCollapse={setCollapsed}
          location={{ pathname }}
          menu={{
            type: 'sub',
            defaultOpenAll: false,
            collapsedShowGroupTitle: true,
          }}
          menuItemRender={(item, dom) => (
            <Tooltip 
              title={collapsed ? item.name : ''} 
              placement="right"
              mouseEnterDelay={0.8}
            >
              <div 
                onClick={() => router.push(item.path || '/admin')}
                className="menu-item-wrapper"
              >
                {dom}
              </div>
            </Tooltip>
          )}
          menuDataRender={() => menuItems}
          avatarProps={{
            src: user?.avatar ? (
              <Avatar src={user.avatar} size={36} />
            ) : (
              <Avatar 
                size={36}
                icon={<UserOutlined />}
                className="user-avatar"
              />
            ),
            size: 'default',
            title: `${user?.firstName} ${user?.lastName}`,
            render: (_, avatarChildren) => (
              <Dropdown
                menu={{
                  selectedKeys: [],
                  items: userMenuItems,
                }}
                placement="bottomRight"
                trigger={['click']}
              >
                <div className="avatar-wrapper">
                  {avatarChildren}
                  <div className="avatar-status"></div>
                </div>
              </Dropdown>
            ),
          }}
          actionsRender={(props) => {
            if (props?.isMobile) return []
            return [
              <div key="actions" className="header-actions">
                <Tooltip title="Yeni Oluştur" placement="bottom">
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    className="action-button primary-action"
                    size="middle"
                  />
                </Tooltip>
                <Tooltip title="Gelişmiş Arama" placement="bottom">
                  <Button
                    icon={<SearchOutlined />}
                    className="action-button glass-button"
                  />
                </Tooltip>
                <Tooltip title={isFullscreen ? "Tam Ekrandan Çık" : "Tam Ekran"} placement="bottom">
                  <Button
                    icon={<FullscreenOutlined />}
                    className="action-button glass-button"
                    onClick={toggleFullscreen}
                  />
                </Tooltip>
                <Tooltip title="Bildirimler" placement="bottom">
                  <Badge count={3} size="small" className="notification-badge">
                    <Button
                      icon={<BellOutlined />}
                      className="action-button glass-button notification-btn"
                    />
                  </Badge>
                </Tooltip>
                <Tooltip title="Mesajlar" placement="bottom">
                  <Badge count={6} size="small" className="message-badge">
                    <Button
                      icon={<MessageOutlined />}
                      className="action-button glass-button message-btn"
                    />
                  </Badge>
                </Tooltip>
              </div>
            ]
          }}
          layout="mix"
          splitMenus={false}
          fixedHeader={true}
          fixSiderbar={true}
          colorWeak={false}
          siderMenuType="sub"
          contentWidth="Fluid"
          breakpoint="lg"
          rightContentRender={() => (
            <Space className="header-user-info" size={16}>
              <div className="user-info-content">
                <Text strong className="user-name">
                  {user?.firstName} {user?.lastName}
                </Text>
                <div className="user-role-wrapper">
                  <div className="role-indicator"></div>
                  <Text className="user-role">Sistem Yöneticisi</Text>
                </div>
              </div>
            </Space>
          )}
          siderWidth={320}
          className="pro-layout"
        >
          <PageContainer
            header={{
              title: false,
              breadcrumb: {
                style: {
                  marginBottom: 20,
                }
              },
            }}
            className="page-container"
          >
            <div className="content-wrapper">
              <div className="content-glow"></div>
              {children}
            </div>
          </PageContainer>
        </ProLayout>
      </ProConfigProvider>

      <style jsx>{`
        /* Advanced Loading Screen */
        .loading-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          position: relative;
          overflow: hidden;
        }

        .loading-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
          animation: float 6s ease-in-out infinite;
        }

        .loading-content {
          text-align: center;
          color: white;
          z-index: 2;
          position: relative;
        }

        .loading-logo {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #ffffff20, #ffffff40);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          animation: pulse 2s ease-in-out infinite;
        }

        .loading-icon {
          font-size: 36px;
          color: white;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 30px;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }

        .loading-text h2 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 10px 0;
          color: white;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .loading-text p {
          font-size: 16px;
          margin: 0 0 30px 0;
          opacity: 0.9;
          font-weight: 300;
        }

        .loading-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .loading-dots span {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: bounce 1.4s ease-in-out infinite both;
        }

        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        /* Main Layout Container */
        .admin-layout-container {
          height: 100vh;
          overflow: auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        /* Beautiful Header */
        .header-title {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 8px 0;
        }

        .logo-container {
          position: relative;
          width: 48px;
          height: 48px;
        }

        .logo-inner {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 10px 25px rgba(99, 102, 241, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .logo-inner::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transform: rotate(45deg);
          animation: shimmer 3s linear infinite;
        }

        .logo-icon {
          font-size: 24px;
          color: white;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
          z-index: 2;
          position: relative;
        }

        .logo-glow {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 20px;
          opacity: 0.3;
          filter: blur(15px);
          animation: glow 2s ease-in-out infinite alternate;
        }

        .title-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .main-title {
          font-size: 22px;
          font-weight: 800;
          margin: 0;
          color: white;
          line-height: 1.2;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          background: linear-gradient(135deg, #ffffff, #f8fafc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }

        .subtitle-dot {
          width: 6px;
          height: 6px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        /* Glassmorphism Action Buttons */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .action-button {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .glass-button {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .glass-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .glass-button:hover::before {
          left: 100%;
        }

        .glass-button:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .primary-action {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        }

        .primary-action:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(16, 185, 129, 0.5);
        }

        .notification-btn:hover {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2));
        }

        .message-btn:hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2));
        }

        /* Enhanced Badges */
        .notification-badge :global(.ant-badge-count) {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5);
          font-size: 10px;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          line-height: 18px;
          animation: pulse 2s ease-in-out infinite;
        }

        .message-badge :global(.ant-badge-count) {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
          font-size: 10px;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          line-height: 18px;
          animation: pulse 2s ease-in-out infinite;
        }

        /* Beautiful User Info */
        .header-user-info {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .header-user-info:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-1px);
        }

        .user-info-content {
          display: flex;
          flex-direction: column;
          text-align: right;
          gap: 2px;
        }

        .user-name {
          color: white;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.2;
        }

        .user-role-wrapper {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
        }

        .role-indicator {
          width: 6px;
          height: 6px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .user-role {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.2;
          font-weight: 500;
        }

        /* Enhanced Avatar */
        .avatar-wrapper {
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 12px;
          padding: 4px;
          position: relative;
        }

        .avatar-wrapper:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
        }

        .avatar-status {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #10b981, #059669);
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
        }

        /* Beautiful Content */
        .content-wrapper {
          background: white;
          border-radius: 20px;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.1),
            0 1px 0 rgba(255, 255, 255, 0.5) inset;
          border: 1px solid rgba(255, 255, 255, 0.2);
          min-height: calc(100vh - 180px);
          transition: all 0.3s ease;
          overflow: hidden;
          position: relative;
        }

        .content-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
          border-radius: 22px;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .content-wrapper:hover .content-glow {
          opacity: 0.1;
        }

        .content-wrapper:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.15),
            0 1px 0 rgba(255, 255, 255, 0.5) inset;
        }

        /* Menu Icons */
        :global(.menu-icon) {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
          margin-right: 12px;
        }

        /* Improved menu icon visibility */
        :global(.ant-menu-item .menu-icon),
        :global(.ant-menu-submenu-title .menu-icon) {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        :global(.ant-menu-item:hover .menu-icon),
        :global(.ant-menu-submenu-title:hover .menu-icon) {
          color: white;
          transform: scale(1.1);
          filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.5));
        }

        /* Animation Keyframes */
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }

        @keyframes glow {
          0% { opacity: 0.3; transform: scale(0.95); }
          100% { opacity: 0.5; transform: scale(1.05); }
        }

        /* Global Layout Overrides */
        :global(.pro-layout) {
          background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
        }

        :global(.ant-pro-sider) {
          background: linear-gradient(180deg, #1e293b 0%, #334155 50%, #475569 100%) !important;
          box-shadow: 
            4px 0 30px rgba(0, 0, 0, 0.2),
            inset -1px 0 0 rgba(255, 255, 255, 0.1);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
        }

        /* Collapsed sidebar improvements */
        :global(.ant-pro-sider-collapsed) {
          width: 80px !important;
          min-width: 80px !important;
        }

        :global(.ant-pro-sider-collapsed .ant-menu-item) {
          margin: 6px 8px !important;
          padding: 0 12px !important;
          border-radius: 10px !important;
          height: 44px !important;
          line-height: 44px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        :global(.ant-pro-sider-collapsed .menu-icon) {
          font-size: 20px !important;
          margin: 0 !important;
        }

        :global(.ant-pro-sider-collapsed .ant-menu-submenu-title) {
          margin: 6px 8px !important;
          padding: 0 12px !important;
          border-radius: 10px !important;
          height: 44px !important;
          line-height: 44px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        :global(.ant-pro-sider-collapsed .ant-menu-submenu-arrow) {
          display: none !important;
        }

        /* Dropdown menu improvements - reduce transparency */
        :global(.ant-dropdown-menu) {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.15),
            0 8px 16px rgba(0, 0, 0, 0.1) !important;
          border-radius: 12px !important;
          padding: 8px 0 !important;
        }

        :global(.ant-dropdown-menu-item) {
          color: #1e293b !important;
          font-weight: 500 !important;
          padding: 12px 20px !important;
          margin: 2px 8px !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
          background: transparent !important;
        }

        :global(.ant-dropdown-menu-item:hover) {
          background: rgba(99, 102, 241, 0.1) !important;
          color: #6366f1 !important;
          transform: translateX(4px) !important;
        }

        :global(.ant-dropdown-menu-item-danger) {
          color: #ef4444 !important;
        }

        :global(.ant-dropdown-menu-item-danger:hover) {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #dc2626 !important;
        }

        :global(.ant-dropdown-menu-item-divider) {
          background: rgba(0, 0, 0, 0.1) !important;
          margin: 4px 8px !important;
        }

        /* Submenu dropdown improvements */
        :global(.ant-menu-submenu-popup) {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.15),
            0 8px 16px rgba(0, 0, 0, 0.1) !important;
          border-radius: 12px !important;
          padding: 8px 0 !important;
        }

        :global(.ant-menu-submenu-popup .ant-menu-item) {
          color: #1e293b !important;
          font-weight: 500 !important;
          padding: 12px 20px !important;
          margin: 2px 8px !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
          background: transparent !important;
          height: auto !important;
          line-height: 1.5 !important;
        }

        :global(.ant-menu-submenu-popup .ant-menu-item:hover) {
          background: rgba(99, 102, 241, 0.1) !important;
          color: #6366f1 !important;
          transform: translateX(4px) !important;
        }

        :global(.ant-menu-submenu-popup .ant-menu-item-selected) {
          background: rgba(99, 102, 241, 0.15) !important;
          color: #6366f1 !important;
        }

        :global(.ant-pro-layout-header) {
          background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
        }

        :global(.page-container) {
          background: transparent;
          padding: 24px;
        }

        /* Enhanced Menu Styling */
        :global(.ant-menu) {
          background: transparent !important;
          border: none !important;
          padding: 16px 0;
        }

        :global(.ant-menu-item) {
          margin: 6px 16px !important;
          border-radius: 12px !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          color: rgba(255, 255, 255, 0.9) !important;
          font-weight: 500 !important;
          height: 48px !important;
          line-height: 48px !important;
          padding: 0 20px !important;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        :global(.ant-menu-item::before) {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.6s ease;
          z-index: 1;
        }

        :global(.ant-menu-item:hover::before) {
          left: 100%;
        }

        :global(.ant-menu-item::after) {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 0;
        }

        :global(.ant-menu-item:hover::after) {
          opacity: 1;
        }

        :global(.ant-menu-item:hover) {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2)) !important;
          color: white !important;
          transform: translateX(8px) scale(1.02);
          box-shadow: 
            0 8px 25px rgba(99, 102, 241, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(99, 102, 241, 0.3);
        }

        :global(.ant-menu-item:hover .menu-icon) {
          color: white;
          transform: scale(1.1);
          filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.5));
        }

        :global(.ant-menu-item-selected) {
          background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
          color: white !important;
          font-weight: 600 !important;
          box-shadow: 
            0 8px 25px rgba(99, 102, 241, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(99, 102, 241, 0.5);
          transform: translateX(4px);
        }

        :global(.ant-menu-item-selected::after) {
          display: none;
        }

        :global(.ant-menu-item-selected .menu-icon) {
          color: white;
          transform: scale(1.05);
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
        }

        :global(.ant-menu-submenu-title) {
          color: rgba(255, 255, 255, 0.6) !important;
          font-weight: 700 !important;
          font-size: 11px !important;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 24px 16px 12px !important;
          padding: 0 20px !important;
          position: relative;
        }

        :global(.ant-menu-submenu-title::before) {
          content: '';
          position: absolute;
          left: 20px;
          bottom: -6px;
          width: 24px;
          height: 2px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        :global(.ant-menu-submenu-title:hover) {
          color: rgba(255, 255, 255, 0.9) !important;
        }

        :global(.ant-menu-submenu-title:hover::before) {
          width: 40px;
        }

                 /* Enhanced Scrollbar Styling */
         :global(.ant-pro-sider::-webkit-scrollbar) {
           width: 4px;
         }

         :global(.ant-pro-sider::-webkit-scrollbar-track) {
           background: transparent;
           border-radius: 2px;
         }

         :global(.ant-pro-sider::-webkit-scrollbar-thumb) {
           background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3));
           border-radius: 2px;
           border: 1px solid rgba(255, 255, 255, 0.1);
           backdrop-filter: blur(10px);
           transition: all 0.3s ease;
         }

         :global(.ant-pro-sider::-webkit-scrollbar-thumb:hover) {
           background: linear-gradient(135deg, rgba(99, 102, 241, 0.6), rgba(139, 92, 246, 0.6));
           box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
         }

         /* Firefox Scrollbar */
         :global(.ant-pro-sider) {
           scrollbar-width: thin;
           scrollbar-color: rgba(99, 102, 241, 0.3) transparent;
         }

         /* Hide scrollbar when not needed */
         :global(.ant-pro-sider:hover::-webkit-scrollbar-thumb) {
           background: linear-gradient(135deg, rgba(99, 102, 241, 0.5), rgba(139, 92, 246, 0.5));
         }

         /* Content area scrollbar */
         :global(.ant-pro-layout-content::-webkit-scrollbar) {
           width: 8px;
         }

         :global(.ant-pro-layout-content::-webkit-scrollbar-track) {
           background: rgba(0, 0, 0, 0.05);
           border-radius: 4px;
         }

         :global(.ant-pro-layout-content::-webkit-scrollbar-thumb) {
           background: linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(139, 92, 246, 0.4));
           border-radius: 4px;
           border: 1px solid rgba(255, 255, 255, 0.2);
         }

         :global(.ant-pro-layout-content::-webkit-scrollbar-thumb:hover) {
           background: linear-gradient(135deg, rgba(99, 102, 241, 0.7), rgba(139, 92, 246, 0.7));
         }

         /* Content wrapper scrollbar */
         .content-wrapper::-webkit-scrollbar {
           width: 8px;
         }

         .content-wrapper::-webkit-scrollbar-track {
           background: rgba(0, 0, 0, 0.05);
           border-radius: 4px;
         }

         .content-wrapper::-webkit-scrollbar-thumb {
           background: linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(139, 92, 246, 0.4));
           border-radius: 4px;
           border: 1px solid rgba(255, 255, 255, 0.2);
         }

         .content-wrapper::-webkit-scrollbar-thumb:hover {
           background: linear-gradient(135deg, rgba(99, 102, 241, 0.7), rgba(139, 92, 246, 0.7));
         }

         /* Main container scrollbar */
         .admin-layout-container::-webkit-scrollbar {
           width: 8px;
         }

         .admin-layout-container::-webkit-scrollbar-track {
           background: rgba(0, 0, 0, 0.05);
           border-radius: 4px;
         }

         .admin-layout-container::-webkit-scrollbar-thumb {
           background: linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(139, 92, 246, 0.4));
           border-radius: 4px;
           border: 1px solid rgba(255, 255, 255, 0.2);
         }

         .admin-layout-container::-webkit-scrollbar-thumb:hover {
           background: linear-gradient(135deg, rgba(99, 102, 241, 0.7), rgba(139, 92, 246, 0.7));
         }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .header-actions {
            gap: 6px;
            padding: 6px;
          }

          .action-button {
            width: 36px;
            height: 36px;
          }

          .main-title {
            font-size: 20px;
          }

          :global(.page-container) {
            padding: 20px;
          }

          .content-wrapper {
            border-radius: 16px;
            min-height: calc(100vh - 160px);
          }
        }

        @media (max-width: 768px) {
          .header-user-info {
            display: none;
          }

          /* Mobile collapsed sidebar improvements */
          :global(.ant-pro-sider-collapsed) {
            width: 70px !important;
            min-width: 70px !important;
          }

          :global(.ant-pro-sider-collapsed .ant-menu-item) {
            margin: 4px 6px !important;
            padding: 0 8px !important;
            border-radius: 8px !important;
            height: 40px !important;
            line-height: 40px !important;
          }

          :global(.ant-pro-sider-collapsed .menu-icon) {
            font-size: 18px !important;
          }

          .header-actions {
            gap: 4px;
            padding: 4px;
          }

          .action-button {
            width: 32px;
            height: 32px;
          }

          .main-title {
            font-size: 18px;
          }

          .subtitle {
            font-size: 11px;
          }

          .logo-container {
            width: 40px;
            height: 40px;
          }

          .logo-inner {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .logo-icon {
            font-size: 20px;
          }

          :global(.page-container) {
            padding: 16px;
          }

          .content-wrapper {
            border-radius: 12px;
            min-height: calc(100vh - 140px);
          }

          :global(.ant-menu-item) {
            margin: 4px 12px !important;
            height: 44px !important;
            line-height: 44px !important;
            padding: 0 16px !important;
          }

          :global(.ant-menu-submenu-title) {
            margin: 20px 12px 8px !important;
            padding: 0 16px !important;
          }
        }

        @media (max-width: 480px) {
          .header-title {
            gap: 12px;
          }

          .logo-container {
            width: 36px;
            height: 36px;
          }

          .logo-inner {
            width: 36px;
            height: 36px;
            border-radius: 8px;
          }

          .logo-icon {
            font-size: 18px;
          }

          .main-title {
            font-size: 16px;
          }

          .subtitle {
            display: none;
          }

          .header-actions {
            gap: 2px;
            padding: 2px;
          }

          .action-button {
            width: 28px;
            height: 28px;
            border-radius: 8px;
          }

          :global(.page-container) {
            padding: 12px;
          }

          .content-wrapper {
            border-radius: 8px;
            min-height: calc(100vh - 120px);
          }

          :global(.ant-menu-item) {
            margin: 3px 8px !important;
            height: 40px !important;
            line-height: 40px !important;
            padding: 0 12px !important;
            border-radius: 8px !important;
          }

          :global(.ant-menu-submenu-title) {
            margin: 16px 8px 6px !important;
            padding: 0 12px !important;
            font-size: 10px !important;
          }
        }

        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
          .content-wrapper {
            background: #ffffff;
            box-shadow: 
              0 20px 40px rgba(0, 0, 0, 0.2),
              0 1px 0 rgba(255, 255, 255, 0.1) inset;
          }
        }

        /* High Contrast Mode Support */
        @media (prefers-contrast: high) {
          .logo-inner {
            border: 2px solid white;
          }

          .action-button {
            border: 1px solid rgba(255, 255, 255, 0.5);
          }

          :global(.ant-menu-item) {
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          .loading-spinner {
            animation: none;
            border: 3px solid white;
          }

          .logo-glow {
            animation: none;
            opacity: 0.3;
          }
        }

        /* Print Styles */
        @media print {
          .admin-layout-container {
            background: white !important;
          }

          .header-actions,
          :global(.ant-pro-sider),
          :global(.ant-pro-layout-header) {
            display: none !important;
          }

          .content-wrapper {
            box-shadow: none !important;
            border: 1px solid #ccc !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}