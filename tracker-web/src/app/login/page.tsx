'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Form, Input, Button, Card, Checkbox, Typography, Space, Alert, Select, message } from 'antd'
import { 
  UserOutlined, 
  LockOutlined, 
  ThunderboltOutlined, 
  EyeInvisibleOutlined,
  EyeTwoTone,
  GlobalOutlined,
  RocketOutlined,
  SafetyOutlined
} from '@ant-design/icons'
import { setToken, setUser, isAuthenticated } from '@/utils/auth'
import { logger } from '@/utils/logger'

const { Title, Text } = Typography
const { Option } = Select

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form] = Form.useForm()
  const router = useRouter()

  // Sayfa yüklendiğinde token kontrolü
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard')
    }
  }, [router])

  const onFinish = async (values: any) => {
    setLoading(true)
    setError('')

    // Log login attempt
    logger.info('Login attempt', 'LoginPage', { email: values.email })

    try {
      const response = await fetch('http://localhost:5143/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          rememberMe: values.remember
        })
      })

      const data = await response.json()

      if (response.ok && data.token) {
        // Log successful login
        logger.info('Login successful', 'LoginPage', { 
          email: values.email, 
          role: data.user.role,
          userId: data.user.id 
        })
        
        // Güvenli şekilde token ve kullanıcı bilgilerini sakla
        setToken(data.token)
        setUser(data.user)
        
        // Başarı mesajı göster
        message.success(`Başarıyla giriş yapıldı! Rol: ${data.user.role}. Yönlendiriliyorsunuz...`)
        
        // Kısa bir gecikme sonrası rol bazlı yönlendirme yap
        setTimeout(() => {
          if (data.user.role === 'Admin') {
            logger.info('Redirecting to admin panel', 'LoginPage')
            router.push('/admin')
          } else {
            logger.info('Redirecting to dashboard', 'LoginPage')
            router.push('/dashboard')
          }
        }, 1000)
      } else {
        logger.warn('Login failed', 'LoginPage', { 
          email: values.email, 
          error: data.message 
        })
        setError(data.message || 'Email veya şifre hatalı. Lütfen tekrar deneyin.')
      }
    } catch (err) {
      logger.error('Login error', 'LoginPage', { 
        email: values.email, 
        error: err 
      })
      setError('Sunucu bağlantısında hata oluştu. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    form.setFieldsValue({
      email: 'admin@example.com',
      password: 'password',
      remember: true
    })
    message.info('Demo hesap bilgileri dolduruldu.')
  }

  const handleForgotPassword = () => {
    message.info('Şifre sıfırlama özelliği yakında eklenecek.')
  }

  const handleRegister = () => {
    message.info('Kayıt olma özelliği yakında eklenecek.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mb-4 shadow-lg">
            <ThunderboltOutlined className="text-white text-2xl" />
          </div>
          <Title level={2} className="text-gray-800 mb-1 font-bold text-2xl">
            Elektrik Takip
          </Title>
          <Text className="text-gray-600 text-sm">
            Güvenli giriş
          </Text>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0 rounded-xl">
          <div className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <Title level={3} className="text-gray-800 mb-1">Hoş Geldiniz</Title>
              <Text className="text-gray-600 text-sm">Hesabınıza giriş yapın</Text>
            </div>

            {/* Language Selector */}
            <div className="flex justify-end mb-4">
              <Select defaultValue="tr" style={{ width: 100 }} size="small">
                <Option value="tr">
                  <Space>
                    <GlobalOutlined />
                    TR
                  </Space>
                </Option>
                <Option value="en">EN</Option>
              </Select>
            </div>

            {/* Login Form */}
            <Form
              form={form}
              name="login"
              initialValues={{ 
                email: '',
                password: '',
                remember: false 
              }}
              onFinish={onFinish}
              layout="vertical"
              size="middle"
            >
              <Form.Item
                name="email"
                label={<span className="text-gray-700 font-medium text-sm">E-posta</span>}
                rules={[
                  { required: true, message: 'E-posta adresinizi girin!' },
                  { type: 'email', message: 'Geçerli bir e-posta adresi girin!' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="ornek@email.com"
                  className="h-10 rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="text-gray-700 font-medium text-sm">Şifre</span>}
                rules={[
                  { required: true, message: 'Şifrenizi girin!' },
                  { min: 6, message: 'Şifre en az 6 karakter olmalı!' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="••••••••"
                  className="h-10 rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item>
                <div className="flex justify-between items-center">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox className="text-gray-600 text-sm" disabled={loading}>
                      Beni hatırla
                    </Checkbox>
                  </Form.Item>
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors"
                    disabled={loading}
                  >
                    Şifremi unuttum
                  </button>
                </div>
              </Form.Item>

              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  className="mb-4 rounded-lg text-sm"
                  closable
                  onClose={() => setError('')}
                />
              )}

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className="w-full h-10 text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                    border: 'none'
                  }}
                  icon={<RocketOutlined />}
                  disabled={loading}
                >
                  {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </Button>
              </Form.Item>
            </Form>

            {/* Demo Account */}
            <div className="text-center mt-4">
              <Button 
                type="dashed" 
                onClick={handleDemoLogin}
                className="w-full h-8 text-xs font-medium rounded-lg border-dashed border-gray-300 hover:border-blue-400 hover:text-blue-600 transition-all duration-300"
                disabled={loading}
              >
                <Space>
                  <ThunderboltOutlined />
                  Demo Hesap
                </Space>
              </Button>
            </div>

            <Alert
              message={
                <div className="text-xs">
                  <div className="font-semibold text-gray-800 mb-1 flex items-center">
                    <SafetyOutlined className="mr-1" />
                    Demo Bilgileri:
                  </div>
                  <div className="text-gray-600 space-y-1">
                    <div>Email: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-xs">admin@example.com</span></div>
                    <div>Şifre: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-xs">password</span></div>
                  </div>
                </div>
              }
              type="info"
              showIcon={false}
              className="mt-4 rounded-lg"
            />

            {/* Register Link */}
            <div className="text-center mt-6 pt-4 border-t border-gray-100">
              <Text className="text-gray-600 text-xs">
                Hesabınız yok mu?{' '}
                <button 
                  type="button"
                  onClick={handleRegister}
                  className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                  disabled={loading}
                >
                  Kayıt olun
                </button>
              </Text>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <Text className="text-gray-500 text-xs">
            © 2024 Elektrik Takip | Güvenli ve Modern
          </Text>
        </div>
      </div>
    </div>
  )
} 