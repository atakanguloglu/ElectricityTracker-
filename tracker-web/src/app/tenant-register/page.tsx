'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Divider, Typography } from 'antd';
import { UserOutlined, BankOutlined, GlobalOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface TenantRegistrationForm {
  // Şirket bilgileri
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  taxNumber?: string;
  taxOffice?: string;
  
  // Domain bilgileri
  subdomain?: string;
  customDomain?: string;
  
  // Admin kullanıcı bilgileri
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPassword: string;
  
  // Limitler
  maxUsers?: number;
  maxFacilities?: number;
}

export default function TenantRegisterPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: TenantRegistrationForm) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5143/api/tenant/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: values.companyName,
          contactPerson: values.contactPerson,
          email: values.email,
          phone: values.phone,
          address: values.address,
          taxNumber: values.taxNumber,
          taxOffice: values.taxOffice,
          subdomain: values.subdomain,
          customDomain: values.customDomain,
          adminFirstName: values.adminFirstName,
          adminLastName: values.adminLastName,
          adminEmail: values.adminEmail,
          adminPassword: values.adminPassword,
          maxUsers: values.maxUsers || 10,
          maxFacilities: values.maxFacilities || 5,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        message.success('Şirket kaydı başarıyla oluşturuldu! Onay bekleniyor.');
        form.resetFields();
      } else {
        message.error(result.message || 'Kayıt sırasında bir hata oluştu');
      }
    } catch (error) {
      message.error('Bağlantı hatası oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 800,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: '16px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            <BankOutlined /> Şirket Kaydı
          </Title>
          <Text type="secondary">
            Elektrik tüketim takip sistemine şirketinizi kaydedin
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Şirket Bilgileri */}
          <div style={{ marginBottom: '24px' }}>
            <Title level={4} style={{ marginBottom: '16px' }}>
              <BankOutlined /> Şirket Bilgileri
            </Title>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item
                name="companyName"
                label="Şirket Adı"
                rules={[{ required: true, message: 'Şirket adı gerekli!' }]}
              >
                <Input placeholder="Şirket adınızı girin" />
              </Form.Item>

              <Form.Item
                name="contactPerson"
                label="İletişim Kişisi"
                rules={[{ required: true, message: 'İletişim kişisi gerekli!' }]}
              >
                <Input placeholder="İletişim kişisini girin" />
              </Form.Item>

              <Form.Item
                name="email"
                label="E-posta"
                rules={[
                  { required: true, message: 'E-posta gerekli!' },
                  { type: 'email', message: 'Geçerli bir e-posta girin!' }
                ]}
              >
                <Input placeholder="info@sirketiniz.com" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Telefon"
                rules={[{ required: true, message: 'Telefon gerekli!' }]}
              >
                <Input placeholder="+90 212 555 0123" />
              </Form.Item>

              <Form.Item
                name="taxNumber"
                label="Vergi Numarası"
              >
                <Input placeholder="Vergi numaranızı girin" />
              </Form.Item>

              <Form.Item
                name="taxOffice"
                label="Vergi Dairesi"
              >
                <Input placeholder="Vergi dairesini girin" />
              </Form.Item>
            </div>

            <Form.Item
              name="address"
              label="Adres"
            >
              <Input.TextArea rows={3} placeholder="Şirket adresini girin" />
            </Form.Item>
          </div>

          <Divider />

          {/* Domain Bilgileri */}
          <div style={{ marginBottom: '24px' }}>
            <Title level={4} style={{ marginBottom: '16px' }}>
              <GlobalOutlined /> Domain Bilgileri
            </Title>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item
                name="subdomain"
                label="Alt Domain"
                extra="örn: sirketiniz.electricitytracker.com"
              >
                <Input placeholder="sirketiniz" />
              </Form.Item>

              <Form.Item
                name="customDomain"
                label="Özel Domain"
                extra="örn: elektrik.sirketiniz.com"
              >
                <Input placeholder="elektrik.sirketiniz.com" />
              </Form.Item>
            </div>
          </div>

          <Divider />

          {/* Admin Kullanıcı Bilgileri */}
          <div style={{ marginBottom: '24px' }}>
            <Title level={4} style={{ marginBottom: '16px' }}>
              <UserOutlined /> Yönetici Hesabı
            </Title>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item
                name="adminFirstName"
                label="Ad"
                rules={[{ required: true, message: 'Ad gerekli!' }]}
              >
                <Input placeholder="Yönetici adını girin" />
              </Form.Item>

              <Form.Item
                name="adminLastName"
                label="Soyad"
                rules={[{ required: true, message: 'Soyad gerekli!' }]}
              >
                <Input placeholder="Yönetici soyadını girin" />
              </Form.Item>

              <Form.Item
                name="adminEmail"
                label="E-posta"
                rules={[
                  { required: true, message: 'E-posta gerekli!' },
                  { type: 'email', message: 'Geçerli bir e-posta girin!' }
                ]}
              >
                <Input placeholder="admin@sirketiniz.com" />
              </Form.Item>

              <Form.Item
                name="adminPassword"
                label="Şifre"
                rules={[
                  { required: true, message: 'Şifre gerekli!' },
                  { min: 6, message: 'Şifre en az 6 karakter olmalı!' }
                ]}
              >
                <Input.Password placeholder="Güçlü bir şifre girin" />
              </Form.Item>
            </div>
          </div>

          <Divider />

          {/* Limitler */}
          <div style={{ marginBottom: '32px' }}>
            <Title level={4} style={{ marginBottom: '16px' }}>
              Sistem Limitleri
            </Title>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item
                name="maxUsers"
                label="Maksimum Kullanıcı Sayısı"
                initialValue={10}
              >
                <Input type="number" min={1} max={100} />
              </Form.Item>

              <Form.Item
                name="maxFacilities"
                label="Maksimum Tesis Sayısı"
                initialValue={5}
              >
                <Input type="number" min={1} max={50} />
              </Form.Item>
            </div>
          </div>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              style={{ 
                width: '100%', 
                height: '48px',
                fontSize: '16px',
                borderRadius: '8px'
              }}
            >
              Şirket Kaydını Tamamla
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text type="secondary">
            Kayıt tamamlandıktan sonra sistem yöneticisi tarafından onaylanacaktır.
          </Text>
        </div>
      </Card>
    </div>
  );
} 