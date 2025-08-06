'use client'

import React, { useState } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Form, 
  Input, 
  Button, 
  Avatar, 
  Upload, 
  Space,
  Typography,
  Divider,
  Alert,
  message,
  Switch,
  Select
} from 'antd'
import { 
  PageContainer,
  ProCard
} from '@ant-design/pro-components'
import { 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CameraOutlined,
  SaveOutlined,
  LockOutlined,
  BellOutlined,
  SecurityScanOutlined,
  UploadOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select

interface ProfileFormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  language: string
  timezone: string
}

export default function ProfilePage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=admin')

  const handleSave = async (values: ProfileFormValues) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('Profil başarıyla güncellendi')
    } catch (error) {
      message.error('Profil güncellenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      setAvatarUrl(URL.createObjectURL(info.file.originFileObj))
      message.success('Profil fotoğrafı güncellendi')
    }
  }

  return (
    <PageContainer
      title="Profil Ayarları"
      subTitle="Kişisel bilgilerinizi ve hesap ayarlarınızı yönetin"
    >
      <Row gutter={[24, 24]}>
        {/* Profile Information */}
        <Col xs={24} lg={16}>
          <ProCard title="Kişisel Bilgiler" extra={<UserOutlined />}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              initialValues={{
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@electricitytracker.com',
                phone: '+90 555 123 4567',
                language: 'tr',
                timezone: 'Europe/Istanbul'
              }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="firstName"
                    label="Ad"
                    rules={[{ required: true, message: 'Ad alanı zorunludur' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Adınız" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="lastName"
                    label="Soyad"
                    rules={[{ required: true, message: 'Soyad alanı zorunludur' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Soyadınız" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label="E-posta"
                    rules={[
                      { required: true, message: 'E-posta alanı zorunludur' },
                      { type: 'email', message: 'Geçerli bir e-posta adresi girin' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="E-posta adresiniz" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phone"
                    label="Telefon"
                  >
                    <Input prefix={<PhoneOutlined />} placeholder="Telefon numaranız" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="language"
                    label="Dil"
                  >
                    <Select placeholder="Dil seçin">
                      <Option value="tr">Türkçe</Option>
                      <Option value="en">English</Option>
                      <Option value="de">Deutsch</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="timezone"
                    label="Saat Dilimi"
                  >
                    <Select placeholder="Saat dilimi seçin">
                      <Option value="Europe/Istanbul">İstanbul (UTC+3)</Option>
                      <Option value="Europe/London">Londra (UTC+0)</Option>
                      <Option value="America/New_York">New York (UTC-5)</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      icon={<SaveOutlined />}
                      size="large"
                    >
                      Değişiklikleri Kaydet
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </ProCard>
        </Col>

        {/* Profile Picture */}
        <Col xs={24} lg={8}>
          <ProCard title="Profil Fotoğrafı" extra={<CameraOutlined />}>
            <div style={{ textAlign: 'center' }}>
              <Avatar 
                size={120} 
                src={avatarUrl}
                style={{ marginBottom: 16 }}
              />
              <div style={{ marginBottom: 16 }}>
                <Upload
                  name="avatar"
                  showUploadList={false}
                  onChange={handleAvatarChange}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>
                    Fotoğraf Değiştir
                  </Button>
                </Upload>
              </div>
              <Text type="secondary">
                JPG, PNG veya GIF dosyaları kabul edilir. Maksimum 2MB.
              </Text>
            </div>
          </ProCard>
        </Col>
      </Row>

      <Divider />

      {/* Security Settings */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <ProCard title="Güvenlik Ayarları" extra={<SecurityScanOutlined />}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>İki Faktörlü Doğrulama</Text>
                  <br />
                  <Text type="secondary">Hesabınızı daha güvenli hale getirin</Text>
                </div>
                <Switch defaultChecked />
              </div>
              <Divider />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Oturum Bildirimleri</Text>
                  <br />
                  <Text type="secondary">Yeni oturum açıldığında bildirim alın</Text>
                </div>
                <Switch defaultChecked />
              </div>
              <Divider />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Şifre Değiştir</Text>
                  <br />
                  <Text type="secondary">Hesap şifrenizi güncelleyin</Text>
                </div>
                <Button type="link" icon={<LockOutlined />}>
                  Değiştir
                </Button>
              </div>
            </Space>
          </ProCard>
        </Col>

        <Col xs={24} lg={12}>
          <ProCard title="Bildirim Ayarları" extra={<BellOutlined />}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>E-posta Bildirimleri</Text>
                  <br />
                  <Text type="secondary">Önemli güncellemeler için e-posta alın</Text>
                </div>
                <Switch defaultChecked />
              </div>
              <Divider />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Sistem Uyarıları</Text>
                  <br />
                  <Text type="secondary">Sistem durumu hakkında bildirimler</Text>
                </div>
                <Switch defaultChecked />
              </div>
              <Divider />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Haftalık Raporlar</Text>
                  <br />
                  <Text type="secondary">Haftalık performans raporları</Text>
                </div>
                <Switch />
              </div>
            </Space>
          </ProCard>
        </Col>
      </Row>

      <style jsx>{`
        .ant-card {
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }

        .ant-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }

        .ant-pro-card {
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }

        .ant-pro-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }

        .ant-input {
          border-radius: 8px;
        }

        .ant-select {
          border-radius: 8px;
        }

        .ant-btn {
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .ant-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .ant-avatar {
          border: 4px solid #f0f0f0;
          transition: all 0.3s ease;
        }

        .ant-avatar:hover {
          border-color: #6366f1;
          transform: scale(1.05);
        }

        .ant-switch {
          border-radius: 12px;
        }

        @media (max-width: 768px) {
          .ant-space {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .ant-space-item {
            margin-bottom: 8px;
          }
        }
      `}</style>
    </PageContainer>
  )
} 