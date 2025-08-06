'use client'

import { useState, useMemo, useEffect } from 'react'
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Table,
  Button,
  Space,
  Tag,
  Statistic,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Popconfirm,
  Divider,
  Upload,
  Progress,
  Tabs,
  Badge,
  Tooltip,
  Switch,
  DatePicker,
  Spin,
  Alert,
  Descriptions,
  Divider as AntDivider,
  Image,
  Rate
} from 'antd'
import { 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  DropboxOutlined,
  FireOutlined,
  CarOutlined,
  ToolOutlined,
  DollarOutlined,
  CalculatorOutlined,
  BarChartOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  CloseCircleOutlined,
  MailOutlined,
  PrinterOutlined,
  SendOutlined,
  CalendarOutlined,
  UserOutlined,
  BankOutlined,
  CreditCardOutlined,
  QrcodeOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import { apiRequest } from '@/utils/auth'
import dayjs from 'dayjs'
import { App } from 'antd'

const { Title, Text } = Typography
const { Option } = Select

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5143/api';

// Types
interface Invoice {
  id?: number;
  Id?: number;
  invoiceNumber?: string;
  InvoiceNumber?: string;
  invoiceDate?: string;
  InvoiceDate?: string;
  dueDate?: string;
  DueDate?: string;
  totalAmount?: number;
  TotalAmount?: number;
  taxAmount?: number;
  TaxAmount?: number;
  netAmount?: number;
  NetAmount?: number;
  currency?: string;
  Currency?: string;
  taxRate?: number;
  TaxRate?: number;
  status?: number;
  Status?: number;
  type?: number;
  Type?: number;
  description?: string;
  Description?: string;
  customerName?: string;
  CustomerName?: string;
  customerEmail?: string;
  CustomerEmail?: string;
  tenantId?: number;
  TenantId?: number;
  tenantName?: string;
  TenantName?: string;
  createdById?: number;
  CreatedById?: number;
  createdByName?: string;
  CreatedByName?: string;
  createdAt?: string;
  CreatedAt?: string;
  items?: InvoiceItem[];
  Items?: InvoiceItem[];
  payments?: InvoicePayment[];
  Payments?: InvoicePayment[];
  subscriptionPlanId?: number;
  SubscriptionPlanId?: number;
  subscriptionPlanName?: string;
  SubscriptionPlanName?: string;
  billingPeriod?: string;
  BillingPeriod?: string;
}

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  resourceTypeId: number;
  resourceTypeName: string;
}

interface InvoicePayment {
  id: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  status: string;
}

interface SubscriptionPlan {
  id?: number;
  Id?: number;
  name?: string;
  Name?: string;
  type?: string;
  Type?: string;
  description?: string;
  Description?: string;
  monthlyFee?: number;
  MonthlyFee?: number;
  currency?: string;
  Currency?: string;
  features?: string;
  Features?: string;
  limits?: string;
  Limits?: string;
  isActive?: boolean;
  IsActive?: boolean;
  isDefault?: boolean;
  IsDefault?: boolean;
  isPopular?: boolean;
  IsPopular?: boolean;
  badgeText?: string;
  BadgeText?: string;
  badgeColor?: string;
  BadgeColor?: string;
}

interface Tenant {
  id?: number;
  Id?: number;
  companyName?: string;
  CompanyName?: string;
  adminEmail?: string;
  AdminEmail?: string;
  contactPerson?: string;
  ContactPerson?: string;
  phone?: string;
  Phone?: string;
  address?: string;
  Address?: string;
  taxNumber?: string;
  TaxNumber?: string;
  taxOffice?: string;
  TaxOffice?: string;
  subscription?: string;
  Subscription?: string;
  monthlyFee?: number;
  MonthlyFee?: number;
  currency?: string;
  Currency?: string;
  subscriptionStartDate?: string;
  SubscriptionStartDate?: string;
  subscriptionEndDate?: string;
  SubscriptionEndDate?: string;
  maxUsers?: number;
  MaxUsers?: number;
  maxFacilities?: number;
  MaxFacilities?: number;
  isActive?: boolean;
  IsActive?: boolean;
  paymentStatus?: string;
  PaymentStatus?: string;
  lastPayment?: string;
  LastPayment?: string;
}

interface BillingStatistics {
  totalInvoices: number;
  totalAmount: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  averageInvoiceAmount: number;
  monthlyRevenue: number;
  monthlyGrowth: number;
  thisMonthInvoices: number;
  thisMonthRevenue: number;
  pendingInvoices: number;
  pendingAmount: number;
}

interface CreateInvoiceDto {
  tenantId: number;
  subscriptionPlanId: number;
  billingPeriod: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  taxRate: number;
  description: string;
  items: CreateInvoiceItemDto[];
}

interface CreateInvoiceItemDto {
  description: string;
  quantity: number;
  unitPrice: number;
  resourceTypeId?: number;
}

interface PagedResult<T> {
  items?: T[];
  Items?: T[] // C# JSON serialization için
  totalCount?: number;
  TotalCount?: number // C# JSON serialization için
  page?: number;
  Page?: number // C# JSON serialization için
  pageSize?: number;
  PageSize?: number // C# JSON serialization için
  totalPages?: number;
  TotalPages?: number // C# JSON serialization için
}

export default function AdminBillingPage() {
  const { message } = App.useApp();
  
  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [statistics, setStatistics] = useState<BillingStatistics>({
    totalInvoices: 0,
    totalAmount: 0,
    paidInvoices: 0,
    unpaidInvoices: 0,
    overdueInvoices: 0,
    averageInvoiceAmount: 0,
    monthlyRevenue: 0,
    monthlyGrowth: 0,
    thisMonthInvoices: 0,
    thisMonthRevenue: 0,
    pendingInvoices: 0,
    pendingAmount: 0
  });
  
  // Modal states
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [invoiceDetailModalVisible, setInvoiceDetailModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  
  // Form instances
  const [invoiceForm] = Form.useForm();
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  // Filters state
  const [filters, setFilters] = useState({
    tenantId: undefined as number | undefined,
    status: undefined as number | undefined,
    subscriptionPlanId: undefined as number | undefined,
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
    searchText: undefined as string | undefined
  });

  // Automatic billing state
  const [processingAutomaticBilling, setProcessingAutomaticBilling] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchInvoices();
    fetchSubscriptionPlans();
    fetchTenants();
    fetchStatistics();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.current.toString(),
        pageSize: pagination.pageSize.toString()
      });

      if (filters.tenantId) params.append('tenantId', filters.tenantId.toString());
      if (filters.status !== undefined) params.append('status', filters.status.toString());
      if (filters.subscriptionPlanId) params.append('subscriptionPlanId', filters.subscriptionPlanId.toString());
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.searchText) params.append('searchText', filters.searchText);

      const response = await apiRequest(`${API_BASE_URL}/admin/billing/invoices?${params}`);
      if (!response.ok) throw new Error('Faturalar alınamadı');
      
      const data: PagedResult<Invoice> = await response.json();
      
      // data.Items veya data.items'ın undefined olup olmadığını kontrol et (C# JSON serialization)
      const items = data.Items || data.items
      if (!data || !items) {
        console.error('Billing API response is missing items:', data)
        setInvoices([])
        setPagination(prev => ({
          ...prev,
          total: 0
        }))
        return
      }
      
      setInvoices(items)
      setPagination(prev => ({
        ...prev,
        total: data.TotalCount || data.totalCount || 0
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata oluştu');
      console.error('Invoices fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/subscription-plans`);
      if (!response.ok) throw new Error('Abonelik planları alınamadı');
      
      const data: SubscriptionPlan[] = await response.json();
      if (!data || !Array.isArray(data)) {
        console.error('Subscription plans API response is invalid:', data)
        setSubscriptionPlans([])
        return
      }
      setSubscriptionPlans(data);
    } catch (err) {
      console.error('Subscription plans fetch error:', err);
      setSubscriptionPlans([]);
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/tenants?pageSize=100`);
      if (!response.ok) throw new Error('Tenant listesi alınamadı');
      
      const data: PagedResult<Tenant> = await response.json();
      const items = data.Items || data.items
      if (!data || !items) {
        console.error('Tenants API response is missing items:', data)
        setTenants([])
        return
      }
      setTenants(items);
    } catch (err) {
      console.error('Tenants fetch error:', err);
      setTenants([]);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/admin/billing/statistics`);
      if (!response.ok) throw new Error('İstatistikler alınamadı');
      
      const data: BillingStatistics = await response.json();
      
      // Verinin beklenen yapıda olduğundan emin ol
      if (!data || typeof data !== 'object') {
        throw new Error('Geçersiz veri formatı alındı');
      }
      
      setStatistics(data);
    } catch (err) {
      console.error('Statistics fetch error:', err);
      // Hata durumunda varsayılan değerleri kullan
      setStatistics({
        totalInvoices: 0,
        totalAmount: 0,
        paidInvoices: 0,
        unpaidInvoices: 0,
        overdueInvoices: 0,
        averageInvoiceAmount: 0,
        monthlyRevenue: 0,
        monthlyGrowth: 0,
        thisMonthInvoices: 0,
        thisMonthRevenue: 0,
        pendingInvoices: 0,
        pendingAmount: 0
      });
    }
  };

  // Statistics
  const stats = useMemo(() => [
    {
      title: 'Toplam Fatura',
      value: statistics.totalInvoices || 0,
      icon: <FileTextOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Toplam Gelir',
      value: `₺${(statistics.totalAmount || 0).toLocaleString()}`,
      icon: <DollarOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
      title: 'Bu Ay Gelir',
      value: `₺${(statistics.thisMonthRevenue || 0).toLocaleString()}`,
      icon: <CalendarOutlined />,
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Bekleyen Ödemeler',
      value: `₺${(statistics.pendingAmount || 0).toLocaleString()}`,
      icon: <ExclamationCircleOutlined />,
      color: '#ff4d4f',
      gradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
    }
  ], [statistics]);

  // Handlers
  const handleAddInvoice = () => {
    setModalType('add');
    setSelectedInvoice(null);
    invoiceForm.resetFields();
    setInvoiceModalVisible(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setModalType('edit');
    setSelectedInvoice(invoice);
    
    // Tarih değerlerini dayjs objesine çevir
    invoiceForm.setFieldsValue({
      tenantId: invoice.tenantId || invoice.TenantId,
      subscriptionPlanId: invoice.subscriptionPlanId || invoice.SubscriptionPlanId,
      billingPeriod: invoice.billingPeriod || invoice.BillingPeriod,
      invoiceDate: dayjs(invoice.invoiceDate || invoice.InvoiceDate),
      dueDate: dayjs(invoice.dueDate || invoice.DueDate),
      currency: invoice.currency || invoice.Currency,
      taxRate: invoice.taxRate || invoice.TaxRate,
      description: invoice.description || invoice.Description
    });
    setInvoiceModalVisible(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceDetailModalVisible(true);
  };

  const handleDeleteInvoice = async (invoiceId: number) => {
    try {
              const response = await apiRequest(`${API_BASE_URL}/admin/billing/invoices/${invoiceId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Fatura silinemedi');

      message.success('Fatura başarıyla silindi');
      fetchInvoices();
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Fatura silinirken hata oluştu');
      console.error('Delete invoice error:', err);
    }
  };

  const handleSendInvoice = async (invoiceId: number) => {
    try {
              const response = await apiRequest(`${API_BASE_URL}/admin/billing/invoices/${invoiceId}/send`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Fatura gönderilemedi');

      message.success('Fatura başarıyla gönderildi');
      setInvoiceDetailModalVisible(false);
      fetchInvoices(); // Listeyi yenile
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Fatura gönderilirken hata oluştu');
      console.error('Send invoice error:', err);
    }
  };

  const handlePrintInvoice = () => {
    try {
      // selectedInvoice'ın var olup olmadığını kontrol et
      if (!selectedInvoice) {
        message.error('Fatura verisi bulunamadı');
        return;
      }

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        message.error('Yazdırma penceresi açılamadı');
        return;
      }

      // Map yapmadan önce items dizisinin var olduğundan emin ol
      const items = selectedInvoice.items || [];
      const invoiceItems = Array.isArray(items) ? items : [];

      // Varsayılan değerlerle güvenli mapping
      const processedItems = invoiceItems.map((item, index) => ({
        id: item?.id || index,
        description: item?.description || 'Ürün adı belirtilmemiş',
        quantity: item?.quantity || 0,
        unitPrice: item?.unitPrice || 0,
        total: (item?.quantity || 0) * (item?.unitPrice || 0),
      }));

      // Güvenli varsayılanlarla fatura nesnesi oluştur
      const invoice = {
        id: selectedInvoice.id || 'Belirtilmemiş',
        invoiceNumber: selectedInvoice.invoiceNumber || 'Belirtilmemiş',
        invoiceDate: selectedInvoice.invoiceDate || new Date().toISOString(),
        dueDate: selectedInvoice.dueDate || new Date().toISOString(),
        tenantName: selectedInvoice.tenantName || 'Müşteri bilgisi yok',
        customerEmail: selectedInvoice.customerEmail || 'E-posta yok',
        subscriptionPlanName: selectedInvoice.subscriptionPlanName || 'Plan belirtilmemiş',
        billingPeriod: selectedInvoice.billingPeriod || 'Dönem belirtilmemiş',
        status: selectedInvoice.status || 0,
        netAmount: selectedInvoice.netAmount || 0,
        taxAmount: selectedInvoice.taxAmount || 0,
        totalAmount: selectedInvoice.totalAmount || 0,
        taxRate: selectedInvoice.taxRate || 0,
        items: processedItems,
      };

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Fatura - ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .customer-info { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { text-align: right; font-weight: bold; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ELEKTRİK TÜKETİM TAKİP SİSTEMİ</h1>
            <h2>Uygulama Kullanım Faturası</h2>
          </div>
          
          <div class="invoice-info">
            <div>
              <strong>Fatura No:</strong> ${invoice.invoiceNumber}<br>
              <strong>Fatura Tarihi:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString('tr-TR')}<br>
              <strong>Vade Tarihi:</strong> ${new Date(invoice.dueDate).toLocaleDateString('tr-TR')}<br>
              <strong>Fatura Dönemi:</strong> ${invoice.billingPeriod}
            </div>
            <div>
              <strong>Şirket:</strong> ${invoice.tenantName}<br>
              <strong>E-posta:</strong> ${invoice.customerEmail}<br>
              <strong>Abonelik Planı:</strong> ${invoice.subscriptionPlanName}<br>
              <strong>Durum:</strong> ${getStatusText(invoice.status)}
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Açıklama</th>
                <th>Miktar</th>
                <th>Birim Fiyat</th>
                <th>Toplam</th>
              </tr>
            </thead>
            <tbody>
              ${processedItems.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>₺${(item.unitPrice || 0).toLocaleString()}</td>
                  <td>₺${(item.total || 0).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total">
            <p><strong>Net Tutar:</strong> ₺${(invoice.netAmount || 0).toLocaleString()}</p>
            <p><strong>KDV (%${invoice.taxRate || 0}):</strong> ₺${(invoice.taxAmount || 0).toLocaleString()}</p>
            <p><strong>Genel Toplam:</strong> ₺${(invoice.totalAmount || 0).toLocaleString()}</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      
    } catch (error) {
      console.error('Fatura yazdırma hatası:', error);
      message.error('Fatura yazdırılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleInvoiceModalOk = async () => {
    try {
      const values = await invoiceForm.validateFields();
      
      // DatePicker değerlerini string'e çevir
      const invoiceDate = values.invoiceDate?.toISOString().split('T')[0];
      const dueDate = values.dueDate?.toISOString().split('T')[0];
      
      if (modalType === 'add') {
        // Seçilen tenant ve subscription plan'a göre hesaplama yap
        const tenant = tenants.find(t => t.id === values.tenantId);
        const subscriptionPlan = subscriptionPlans.find(sp => sp.id === values.subscriptionPlanId);
        
        if (!tenant || !subscriptionPlan) {
          message.error('Tenant veya abonelik planı bulunamadı');
          return;
        }

        const netAmount = subscriptionPlan.monthlyFee || subscriptionPlan.MonthlyFee || 0;
        const taxAmount = (netAmount * values.taxRate) / 100;
        const totalAmount = netAmount + taxAmount;
        
        const createDto: CreateInvoiceDto = {
          tenantId: values.tenantId,
          subscriptionPlanId: values.subscriptionPlanId,
          billingPeriod: values.billingPeriod,
          invoiceDate: invoiceDate,
          dueDate: dueDate,
          currency: values.currency,
          taxRate: values.taxRate,
          description: values.description,
          items: [{
            description: `${subscriptionPlan.name || subscriptionPlan.Name || 'Plan'} - ${values.billingPeriod}`,
            quantity: 1,
            unitPrice: netAmount,
            resourceTypeId: undefined
          }]
        };

        const response = await apiRequest(`${API_BASE_URL}/admin/billing/invoices`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(createDto)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Fatura oluşturulamadı');
        }

        message.success('Fatura başarıyla oluşturuldu');
        setInvoiceModalVisible(false);
        fetchInvoices();
      } else if (modalType === 'edit' && selectedInvoice) {
        const subscriptionPlan = subscriptionPlans.find(sp => sp.id === values.subscriptionPlanId);
        
        if (!subscriptionPlan) {
          message.error('Abonelik planı bulunamadı');
          return;
        }

        const netAmount = subscriptionPlan.monthlyFee || subscriptionPlan.MonthlyFee || 0;
        const taxAmount = (netAmount * values.taxRate) / 100;
        const totalAmount = netAmount + taxAmount;
        
        const updateDto = {
          subscriptionPlanId: values.subscriptionPlanId,
          billingPeriod: values.billingPeriod,
          invoiceDate: invoiceDate,
          dueDate: dueDate,
          totalAmount: totalAmount,
          taxAmount: taxAmount,
          netAmount: netAmount,
          currency: values.currency,
          taxRate: values.taxRate,
          status: selectedInvoice.status,
          description: values.description
        };

        const response = await apiRequest(`${API_BASE_URL}/admin/billing/invoices/${selectedInvoice.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateDto)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Fatura güncellenemedi');
        }

        message.success('Fatura başarıyla güncellendi');
        setInvoiceModalVisible(false);
        fetchInvoices();
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('validation')) {
        return;
      }
      message.error(err instanceof Error ? err.message : 'İşlem sırasında hata oluştu');
      console.error('Invoice modal operation error:', err);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      tenantId: undefined,
      status: undefined,
      subscriptionPlanId: undefined,
      startDate: undefined,
      endDate: undefined,
      searchText: undefined
    });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleProcessAutomaticBilling = async () => {
    try {
      setProcessingAutomaticBilling(true);
      
      const response = await apiRequest(`${API_BASE_URL}/admin/billing/process-automatic-billing`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Otomatik fatura oluşturma işlemi başarısız oldu');
      }

      const result = await response.json();
      message.success('Otomatik fatura oluşturma işlemi tamamlandı');
      
      // Faturaları yenile
      await fetchInvoices();
      await fetchStatistics();
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Bilinmeyen hata oluştu');
    } finally {
      setProcessingAutomaticBilling(false);
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'default';
      case 1: return 'processing';
      case 2: return 'success';
      case 3: return 'error';
      case 4: return 'default';
      case 5: return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Taslak';
      case 1: return 'Gönderildi';
      case 2: return 'Ödendi';
      case 3: return 'Vadesi Geçti';
      case 4: return 'İptal Edildi';
      case 5: return 'Tartışmalı';
      default: return 'Bilinmiyor';
    }
  };

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 0: return <ClockCircleOutlined />;
      case 1: return <ClockCircleOutlined />;
      case 2: return <CheckCircleOutlined />;
      case 3: return <ExclamationCircleOutlined />;
      case 4: return <CloseCircleOutlined />;
      case 5: return <ExclamationCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  // Loading state
  if (loading && (!invoices || invoices.length === 0)) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '20px' }}>Faturalar yükleniyor...</div>
      </div>
    );
  }

  // Error state
  if (error && (!invoices || invoices.length === 0)) {
    return (
      <Alert
        message="Hata"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={fetchInvoices}>
            Tekrar Dene
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <DollarOutlined /> Uygulama Kullanım Faturaları
      </Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              style={{
                background: stat.gradient,
                color: 'white',
                border: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stat.value}</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>{stat.title}</div>
                </div>
                <div style={{ fontSize: '32px', opacity: 0.8 }}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6}>
            <Select
              placeholder="Şirket Seçin"
              style={{ width: '100%' }}
              value={filters.tenantId}
              onChange={(value) => handleFilterChange('tenantId', value)}
              allowClear
            >
              {tenants.filter(tenant => tenant && (tenant.id || tenant.Id)).map(tenant => (
                <Option key={tenant.id || tenant.Id} value={tenant.id || tenant.Id}>
                  {tenant.companyName || tenant.CompanyName || '-'}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Durum Seçin"
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              allowClear
            >
              <Option value={0}>Taslak</Option>
              <Option value={1}>Gönderildi</Option>
              <Option value={2}>Ödendi</Option>
              <Option value={3}>Vadesi Geçti</Option>
              <Option value={4}>İptal Edildi</Option>
              <Option value={5}>Tartışmalı</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Abonelik Planı"
              style={{ width: '100%' }}
              value={filters.subscriptionPlanId}
              onChange={(value) => handleFilterChange('subscriptionPlanId', value)}
              allowClear
            >
              {subscriptionPlans.filter(plan => plan && (plan.id || plan.Id)).map(plan => (
                <Option key={plan.id || plan.Id} value={plan.id || plan.Id}>
                  {plan.name || plan.Name || '-'}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Space>
              <Button onClick={clearFilters}>
                Temizle
              </Button>
              <Space>
                <Button 
                  type="default" 
                  icon={<SyncOutlined />} 
                  onClick={handleProcessAutomaticBilling}
                  loading={processingAutomaticBilling}
                >
                  Otomatik Fatura Oluştur
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddInvoice}>
                  Yeni Fatura
                </Button>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Main Content */}
          <Card
            title="Fatura Listesi"
            extra={
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchInvoices}
                >
                  Yenile
                </Button>
                <Button
                  icon={<FileExcelOutlined />}
                  onClick={() => message.info('Fatura raporu indiriliyor...')}
                >
                  Rapor İndir
                </Button>
              </Space>
            }
          >
            <Table
              dataSource={invoices}
              rowKey="id"
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} / ${total} fatura`,
                onChange: (page, pageSize) => {
                  setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize || 10
                  }));
                }
              }}
              loading={loading}
              columns={[
                {
                  title: 'Fatura No',
                  key: 'invoiceNumber',
                  render: (_, record) => <Text strong>{record.invoiceNumber || record.InvoiceNumber || '-'}</Text>
                },
                {
                  title: 'Şirket',
                  key: 'tenantName',
                  render: (_, record) => <Tag color="blue">{record.tenantName || record.TenantName || '-'}</Tag>
                },
                {
                  title: 'Abonelik Planı',
                  key: 'subscriptionPlanName',
                  render: (_, record) => <Tag color="green">{record.subscriptionPlanName || record.SubscriptionPlanName || 'Belirtilmemiş'}</Tag>
                },
                {
                  title: 'Fatura Dönemi',
                  key: 'billingPeriod',
                  render: (_, record) => <Text>{record.billingPeriod || record.BillingPeriod || 'Belirtilmemiş'}</Text>
                },
                {
                  title: 'Tutar',
                  key: 'amount',
                  render: (_, record) => {
                    const totalAmount = record.totalAmount || record.TotalAmount || 0
                    const netAmount = record.netAmount || record.NetAmount || 0
                    return (
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
                          ₺{totalAmount.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          Net: ₺{netAmount.toLocaleString()}
                        </div>
                      </div>
                    )
                  }
                },
                {
                  title: 'Durum',
                  key: 'status',
                  render: (_, record) => {
                    const status = record.status || record.Status || 0
                    return (
                      <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
                        {getStatusText(status)}
                      </Tag>
                    )
                  }
                },
                {
                  title: 'Fatura Tarihi',
                  key: 'invoiceDate',
                  render: (_, record) => {
                    const date = record.invoiceDate || record.InvoiceDate
                    return date ? new Date(date).toLocaleDateString('tr-TR') : 'Invalid Date'
                  }
                },
                {
                  title: 'Vade Tarihi',
                  key: 'dueDate',
                  render: (_, record) => {
                    const date = record.dueDate || record.DueDate
                    return date ? new Date(date).toLocaleDateString('tr-TR') : 'Invalid Date'
                  }
                },
                {
                  title: 'İşlemler',
                  key: 'actions',
                  render: (_, record) => (
                    <Space size="small">
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        size="small"
                    onClick={() => handleViewInvoice(record)}
                      />
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditInvoice(record)}
                      />
                        <Button
                          type="text"
                    icon={<SendOutlined />}
                          size="small"
                                            onClick={() => handleSendInvoice(record.id || record.Id || 0)}
                      />
                      <Popconfirm
                    title="Bu faturayı silmek istediğinizden emin misiniz?"
                    onConfirm={() => handleDeleteInvoice(record.id || record.Id || 0)}
                        okText="Evet"
                        cancelText="Hayır"
                      >
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          size="small"
                          danger
                        />
                      </Popconfirm>
                    </Space>
                  )
                }
              ]}
            />
          </Card>

      {/* Invoice Modal */}
      <Modal
        title={modalType === 'add' ? 'Yeni Uygulama Kullanım Faturası' : 'Fatura Düzenle'}
        open={invoiceModalVisible}
        onOk={handleInvoiceModalOk}
        onCancel={() => setInvoiceModalVisible(false)}
        width={800}
        okText={modalType === 'add' ? 'Oluştur' : 'Güncelle'}
        cancelText="İptal"
      >
        <Form
          form={invoiceForm}
          layout="vertical"
          initialValues={{
            currency: 'TRY',
            taxRate: 20
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tenantId"
                label="Şirket"
                rules={[{ required: true, message: 'Şirket seçimi gerekli' }]}
              >
                <Select placeholder="Şirket seçin">
                  {tenants.filter(tenant => tenant && tenant.id).map(tenant => (
                    <Option key={tenant.id} value={tenant.id}>
                      {tenant.companyName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="subscriptionPlanId"
                label="Abonelik Planı"
                rules={[{ required: true, message: 'Abonelik planı seçimi gerekli' }]}
              >
                <Select placeholder="Abonelik planı seçin">
                  {subscriptionPlans.filter(plan => plan && (plan.id || plan.Id)).map(plan => (
                    <Option key={plan.id || plan.Id} value={plan.id || plan.Id}>
                      {plan.name || plan.Name || 'Plan'} - ₺{plan.monthlyFee || plan.MonthlyFee || 0}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="billingPeriod"
                label="Fatura Dönemi"
                rules={[{ required: true, message: 'Fatura dönemi gerekli' }]}
              >
                <Input placeholder="Örn: Ocak 2025" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="currency"
                label="Para Birimi"
                rules={[{ required: true, message: 'Para birimi seçimi gerekli' }]}
              >
                <Select placeholder="Para birimi seçin">
                  <Option value="TRY">TRY</Option>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="invoiceDate"
                label="Fatura Tarihi"
                rules={[{ required: true, message: 'Fatura tarihi gerekli' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="dueDate"
                label="Vade Tarihi"
                rules={[{ required: true, message: 'Vade tarihi gerekli' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
          <Form.Item
            name="taxRate"
            label="KDV Oranı (%)"
            rules={[{ required: true, message: 'KDV oranı gerekli' }]}
          >
            <InputNumber
              min={0}
              max={100}
              style={{ width: '100%' }}
              placeholder="20"
            />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Açıklama"
            rules={[{ required: true, message: 'Açıklama gerekli' }]}
          >
            <Input.TextArea rows={3} placeholder="Fatura açıklaması" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Invoice Detail Modal */}
      <Modal
        title="Fatura Detayı"
        open={invoiceDetailModalVisible}
        onCancel={() => setInvoiceDetailModalVisible(false)}
        width={1200}
        style={{ top: 20 }}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={handlePrintInvoice}>
            Yazdır
          </Button>,
          <Button key="send" type="primary" icon={<SendOutlined />} onClick={() => selectedInvoice && handleSendInvoice(selectedInvoice.id || selectedInvoice.Id || 0)}>
            Mail Gönder
          </Button>
        ]}
      >
        {selectedInvoice && (
          <div>
            {/* Fatura Başlığı */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Title level={3}>ELEKTRİK TÜKETİM TAKİP SİSTEMİ</Title>
              <Text type="secondary">Uygulama Kullanım Faturası</Text>
            </div>

            {/* Fatura Bilgileri */}
            <Row gutter={24}>
            <Col span={12}>
                <Card size="small" title="Fatura Bilgileri">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Fatura No">{selectedInvoice.invoiceNumber || selectedInvoice.InvoiceNumber || 'Belirtilmemiş'}</Descriptions.Item>
                    <Descriptions.Item label="Fatura Tarihi">{(selectedInvoice.invoiceDate || selectedInvoice.InvoiceDate) ? new Date(selectedInvoice.invoiceDate || selectedInvoice.InvoiceDate || '').toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</Descriptions.Item>
                    <Descriptions.Item label="Vade Tarihi">{(selectedInvoice.dueDate || selectedInvoice.DueDate) ? new Date(selectedInvoice.dueDate || selectedInvoice.DueDate || '').toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</Descriptions.Item>
                    <Descriptions.Item label="Fatura Dönemi">{selectedInvoice.billingPeriod || selectedInvoice.BillingPeriod || 'Belirtilmemiş'}</Descriptions.Item>
                  </Descriptions>
                </Card>
            </Col>
            <Col span={12}>
                <Card size="small" title="Müşteri Bilgileri">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Şirket">{selectedInvoice.tenantName || selectedInvoice.TenantName || selectedInvoice.customerName || selectedInvoice.CustomerName || 'Belirtilmemiş'}</Descriptions.Item>
                    <Descriptions.Item label="E-posta">{selectedInvoice.customerEmail || selectedInvoice.CustomerEmail || 'Belirtilmemiş'}</Descriptions.Item>
                    <Descriptions.Item label="Abonelik Planı">{selectedInvoice.subscriptionPlanName || selectedInvoice.SubscriptionPlanName || 'Belirtilmemiş'}</Descriptions.Item>
                    <Descriptions.Item label="Durum">
                      <Tag color={getStatusColor(selectedInvoice.status || selectedInvoice.Status || 0)}>
                        {getStatusText(selectedInvoice.status || selectedInvoice.Status || 0)}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
            </Col>
          </Row>

            <AntDivider />

            {/* Fatura Kalemleri */}
            <Card size="small" title="Fatura Kalemleri">
              <Table
                dataSource={selectedInvoice.items || selectedInvoice.Items || []}
                pagination={false}
                columns={[
                  {
                    title: 'Açıklama',
                    dataIndex: 'description',
                    key: 'description',
                    width: '40%',
                    render: (value) => value || 'Belirtilmemiş'
                  },
                  {
                    title: 'Miktar',
                    dataIndex: 'quantity',
                    key: 'quantity',
                    width: '15%',
                    align: 'center',
                    render: (value) => value || 0
                  },
                  {
                    title: 'Birim Fiyat',
                    dataIndex: 'unitPrice',
                    key: 'unitPrice',
                    width: '20%',
                    align: 'right',
                    render: (value) => `₺${(value || 0).toLocaleString()}`
                  },
                  {
                    title: 'Toplam',
                    key: 'total',
                    width: '25%',
                    align: 'right',
                    render: (_, record) => `₺${((record.quantity || 0) * (record.unitPrice || 0)).toLocaleString()}`
                  }
                ]}
              />
            </Card>

            <AntDivider />

            {/* Toplam Bilgileri */}
            <Row justify="end">
              <Col span={10}>
                <Card size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Net Tutar">₺{(selectedInvoice.netAmount || selectedInvoice.NetAmount || 0).toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label={`KDV (%${selectedInvoice.taxRate || selectedInvoice.TaxRate || 0})`}>₺{(selectedInvoice.taxAmount || selectedInvoice.TaxAmount || 0).toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Genel Toplam">
                      <Text strong style={{ fontSize: '16px' }}>
                        ₺{(selectedInvoice.totalAmount || selectedInvoice.TotalAmount || 0).toLocaleString()}
                      </Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  )
} 