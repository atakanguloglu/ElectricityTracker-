'use client';

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  message, 
  Typography,
  Popconfirm,
  Tag,
  Tooltip,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  BankOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Department {
  id: number;
  name: string;
  description?: string;
  managerName?: string;
  managerEmail?: string;
  userCount: number;
  facilityCount: number;
  createdAt: string;
}

interface DepartmentForm {
  name: string;
  description?: string;
  managerName?: string;
  managerEmail?: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5143/api/department', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      } else {
        message.error('Departman listesi alınamadı');
      }
    } catch (error) {
      message.error('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values: DepartmentForm) => {
    try {
      const response = await fetch('http://localhost:5143/api/department', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Departman başarıyla oluşturuldu');
        setModalVisible(false);
        form.resetFields();
        fetchDepartments();
      } else {
        const error = await response.json();
        message.error(error.message || 'Departman oluşturulamadı');
      }
    } catch (error) {
      message.error('Bağlantı hatası');
    }
  };

  const handleUpdate = async (values: DepartmentForm) => {
    if (!editingDepartment) return;

    try {
      const response = await fetch(`http://localhost:5143/api/department/${editingDepartment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Departman başarıyla güncellendi');
        setModalVisible(false);
        setEditingDepartment(null);
        form.resetFields();
        fetchDepartments();
      } else {
        const error = await response.json();
        message.error(error.message || 'Departman güncellenemedi');
      }
    } catch (error) {
      message.error('Bağlantı hatası');
    }
  };

  const handleDelete = async (departmentId: number) => {
    try {
      const response = await fetch(`http://localhost:5143/api/department/${departmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        message.success('Departman başarıyla silindi');
        fetchDepartments();
      } else {
        const error = await response.json();
        message.error(error.message || 'Departman silinemedi');
      }
    } catch (error) {
      message.error('Bağlantı hatası');
    }
  };

  const showCreateModal = () => {
    setEditingDepartment(null);
    setModalVisible(true);
    form.resetFields();
  };

  const showEditModal = (department: Department) => {
    setEditingDepartment(department);
    setModalVisible(true);
    form.setFieldsValue({
      name: department.name,
      description: department.description,
      managerName: department.managerName,
      managerEmail: department.managerEmail,
    });
  };

  const columns = [
    {
      title: 'Departman Adı',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Açıklama',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: 'Yönetici',
      key: 'manager',
      render: (record: Department) => (
        <div>
          {record.managerName && (
            <div>
              <UserOutlined /> {record.managerName}
            </div>
          )}
          {record.managerEmail && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.managerEmail}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Kullanıcı Sayısı',
      key: 'userCount',
      render: (record: Department) => (
        <Badge count={record.userCount} showZero style={{ backgroundColor: '#52c41a' }} />
      ),
    },
    {
      title: 'Tesis Sayısı',
      key: 'facilityCount',
      render: (record: Department) => (
        <Badge count={record.facilityCount} showZero style={{ backgroundColor: '#1890ff' }} />
      ),
    },
    {
      title: 'Oluşturulma Tarihi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('tr-TR'),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (record: Department) => (
        <Space>
          <Tooltip title="Düzenle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Departmanı Sil"
            description="Bu departmanı silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Evet"
            cancelText="Hayır"
            disabled={record.userCount > 0 || record.facilityCount > 0}
          >
            <Tooltip title={record.userCount > 0 || record.facilityCount > 0 ? 
              "Kullanıcı veya tesisi olan departman silinemez" : "Sil"}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={record.userCount > 0 || record.facilityCount > 0}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={3}>
            <BankOutlined /> Departman Yönetimi
          </Title>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal}>
              Yeni Departman
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={departments}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} / ${total} departman`,
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingDepartment ? 'Departman Düzenle' : 'Yeni Departman'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingDepartment(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingDepartment ? handleUpdate : handleCreate}
        >
          <Form.Item
            name="name"
            label="Departman Adı"
            rules={[{ required: true, message: 'Departman adı gerekli!' }]}
          >
            <Input placeholder="Departman adını girin" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Açıklama"
          >
            <TextArea rows={3} placeholder="Departman açıklamasını girin" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="managerName"
              label="Yönetici Adı"
            >
              <Input placeholder="Yönetici adını girin" />
            </Form.Item>

            <Form.Item
              name="managerEmail"
              label="Yönetici E-posta"
              rules={[
                { type: 'email', message: 'Geçerli bir e-posta girin!' }
              ]}
            >
              <Input placeholder="yonetici@sirket.com" />
            </Form.Item>
          </div>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingDepartment(null);
                form.resetFields();
              }}>
                İptal
              </Button>
              <Button type="primary" htmlType="submit">
                {editingDepartment ? 'Güncelle' : 'Oluştur'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 