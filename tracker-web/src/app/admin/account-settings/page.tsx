'use client'

import React, { useState } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Form, 
  Input, 
  Button, 
  Space,
  Typography,
  Divider,
  Alert,
  message,
  Switch,
  Select,
  Modal,
  Tabs
} from 'antd'
import { 
  PageContainer,
  ProCard
} from '@ant-design/pro-components'
import { 
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  BellOutlined,
  KeyOutlined,
  ShieldOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select
const { TabPane } = Tabs

export default function AccountSettingsPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const handleSave = async (values: any) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('Hesap ayarları başarıyla güncellendi')
    } catch (error) {
      message.error('Hesap ayarları güncellenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = () => {
    setDeleteModalVisible(true)
  }

  const confirmDeleteAccount = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      message.success('Hesap başarıyla silindi')
      setDeleteModalVisible(false)
    } catch (error) {
      message.error('Hesap silinirken hata oluştu')
    }
  }

  return (
    <PageContainer
      title="Hesap Ayarları"
      subTitle="Hesap güvenliği ve gizlilik ayarlarınızı yönetin"
    >
      <Tabs defaultActiveKey="security" size="large">
        <TabPane 
          tab={
            <span>
              <SafetyOutlined />
              Güvenlik
            </span>
          } 
          key="security"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <ProCard title="Şifre Değiştirme" extra={<LockOutlined />}>
                <Form layout="vertical">
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Form.Item
                        name="currentPassword"
                        label="Mevcut Şifre"
                        rules={[{ required: true, message: 'Mevcut şifrenizi girin' }]}
                      >
                        <Input.Password prefix={<LockOutlined />} placeholder="Mevcut şifreniz" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="newPassword"
                        label="Yeni Şifre"
                        rules={[
                          { required: true, message: 'Yeni şifre girin' },
                          { min: 8, message: 'Şifre en az 8 karakter olmalıdır' }
                        ]}
                      >
                        <Input.Password prefix={<KeyOutlined />} placeholder="Yeni şifreniz" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="confirmPassword"
                        label="Şifre Tekrar"
                        rules={[
                          { required: true, message: 'Şifreyi tekrar girin' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('newPassword') === value) {
                                return Promise.resolve()
                              }
                              return Promise.reject(new Error('Şifreler eşleşmiyor'))
                            },
                          }),
                        ]}
                      >
                        <Input.Password prefix={<KeyOutlined />} placeholder="Şifreyi tekrar girin" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Button type="primary" icon={<LockOutlined />} size="large">
                        Şifreyi Değiştir
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </ProCard>
            </Col>

            <Col xs={24} lg={8}>
              <ProCard title="Güvenlik Ayarları" extra={<ShieldOutlined />}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>İki Faktörlü Doğrulama</Text>
                      <br />
                      <Text type="secondary">SMS veya uygulama ile doğrulama</Text>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Divider />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>Oturum Bildirimleri</Text>
                      <br />
                      <Text type="secondary">Yeni oturum açıldığında uyarı</Text>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Divider />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>Güvenli Oturum</Text>
                      <br />
                      <Text type="secondary">HTTPS bağlantısı zorunlu</Text>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </Space>
              </ProCard>
            </Col>
          </Row>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <BellOutlined />
              Bildirimler
            </span>
          } 
          key="notifications"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <ProCard title="E-posta Bildirimleri" extra={<MailOutlined />}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>Sistem Güncellemeleri</Text>
                      <br />
                      <Text type="secondary">Önemli sistem güncellemeleri</Text>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Divider />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>Güvenlik Uyarıları</Text>
                      <br />
                      <Text type="secondary">Güvenlik ile ilgili bildirimler</Text>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Divider />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>Haftalık Raporlar</Text>
                      <br />
                      <Text type="secondary">Performans raporları</Text>
                    </div>
                    <Switch />
                  </div>
                  <Divider />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>Pazarlama E-postaları</Text>
                      <br />
                      <Text type="secondary">Yeni özellikler ve güncellemeler</Text>
                    </div>
                    <Switch />
                  </div>
                </Space>
              </ProCard>
            </Col>

            <Col xs={24} lg={12}>
              <ProCard title="Sistem Bildirimleri" extra={<BellOutlined />}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>Tarayıcı Bildirimleri</Text>
                      <br />
                      <Text type="secondary">Web tarayıcısında bildirimler</Text>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Divider />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>Mobil Push Bildirimleri</Text>
                      <br />
                      <Text type="secondary">Mobil uygulama bildirimleri</Text>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Divider />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>Ses Bildirimleri</Text>
                      <br />
                      <Text type="secondary">Ses ile uyarılar</Text>
                    </div>
                    <Switch />
                  </div>
                </Space>
              </ProCard>
            </Col>
          </Row>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <UserOutlined />
              Gizlilik
            </span>
          } 
          key="privacy"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <ProCard title="Veri Gizliliği" extra={<ShieldOutlined />}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>Analitik Verileri</Text>
                      <br />
                      <Text type="secondary">Kullanım istatistiklerini paylaş</Text>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Divider />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>Hata Raporları</Text>
                      <br />
                      <Text type="secondary">Sistem hatalarını raporla</Text>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Divider />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>Kişiselleştirilmiş İçerik</Text>
                      <br />
                      <Text type="secondary">Kişiselleştirilmiş öneriler</Text>
                    </div>
                    <Switch />
                  </div>
                </Space>
              </ProCard>
            </Col>

            <Col xs={24} lg={8}>
              <ProCard title="Hesap İşlemleri" extra={<DeleteOutlined />}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Alert
                    message="Dikkat"
                    description="Hesap silme işlemi geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={handleDeleteAccount}
                    block
                  >
                    Hesabı Sil
                  </Button>
                </Space>
              </ProCard>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      <Modal
        title="Hesap Silme Onayı"
        open={deleteModalVisible}
        onOk={confirmDeleteAccount}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Hesabı Sil"
        cancelText="İptal"
        okButtonProps={{ danger: true }}
        confirmLoading={loading}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <ExclamationCircleOutlined style={{ fontSize: 48, color: '#ff4d4f', marginBottom: 16 }} />
          <Title level={4}>Hesabınızı silmek istediğinizden emin misiniz?</Title>
          <Text type="secondary">
            Bu işlem geri alınamaz. Tüm verileriniz, ayarlarınız ve geçmişiniz kalıcı olarak silinecektir.
          </Text>
        </div>
      </Modal>

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

        .ant-btn {
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .ant-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .ant-switch {
          border-radius: 12px;
        }

        .ant-tabs-tab {
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .ant-tabs-tab:hover {
          background-color: rgba(99, 102, 241, 0.1);
        }

        .ant-tabs-tab-active {
          background-color: rgba(99, 102, 241, 0.1);
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