'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, Typography, Space } from 'antd'
import { LoginOutlined, UserAddOutlined, BankOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: '16px'
        }}
      >
        <div className="text-center mb-8">
          <BankOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
          <Title level={2} style={{ marginBottom: '8px' }}>
            Elektrik Tüketim Takip Sistemi
          </Title>
          <Text type="secondary">
            Şirketlerin elektrik tüketimlerini verimli bir şekilde takip edin
          </Text>
        </div>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Button 
            type="primary" 
            size="large" 
            icon={<LoginOutlined />}
            onClick={() => router.push('/login')}
            style={{ width: '100%', height: '48px', fontSize: '16px' }}
          >
            Giriş Yap
          </Button>
          
          <Button 
            size="large" 
            icon={<UserAddOutlined />}
            onClick={() => router.push('/tenant-register')}
            style={{ width: '100%', height: '48px', fontSize: '16px' }}
          >
            Şirket Kaydı Oluştur
          </Button>
        </Space>

        <div className="text-center mt-8">
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Henüz hesabınız yok mu? Şirket kaydı oluşturarak sisteme katılın.
          </Text>
        </div>
      </Card>
    </div>
  )
}
