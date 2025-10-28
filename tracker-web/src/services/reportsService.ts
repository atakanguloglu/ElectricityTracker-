import { apiRequest } from './apiService';

export interface ReportData {
  id: number;
  name: string;
  type: string;
  description: string;
  lastGenerated: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  fileUrl?: string;
  fileSize?: string;
  parameters: Record<string, any>;
}

export interface ReportTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  parameters: ReportParameter[];
  isActive: boolean;
  scheduleEnabled: boolean;
  scheduleCron?: string;
  lastRun?: string;
  nextRun?: string;
}

export interface ReportParameter {
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'select' | 'boolean';
  required: boolean;
  defaultValue?: any;
  options?: { value: any; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ReportSchedule {
  id: number;
  reportId: number;
  reportName: string;
  cronExpression: string;
  isActive: boolean;
  lastRun?: string;
  nextRun?: string;
  createdBy: string;
  createdAt: string;
}

export interface ReportExecution {
  id: number;
  reportId: number;
  reportName: string;
  startedAt: string;
  completedAt?: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  result?: {
    recordCount: number;
    fileSize: string;
    fileUrl?: string;
  };
  error?: string;
  parameters: Record<string, any>;
}

export const reportsService = {
  // Rapor şablonlarını getir
  getReportTemplates: async (): Promise<ReportTemplate[]> => {
    return apiRequest<ReportTemplate[]>('GET', '/api/admin/reports/templates');
  },

  // Rapor şablonu oluştur
  createReportTemplate: async (template: Partial<ReportTemplate>): Promise<ReportTemplate> => {
    return apiRequest<ReportTemplate>('POST', '/api/admin/reports/templates', template);
  },

  // Rapor şablonu güncelle
  updateReportTemplate: async (id: number, template: Partial<ReportTemplate>): Promise<ReportTemplate> => {
    return apiRequest<ReportTemplate>('PUT', `/api/admin/reports/templates/${id}`, template);
  },

  // Rapor şablonu sil
  deleteReportTemplate: async (id: number): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>('DELETE', `/api/admin/reports/templates/${id}`);
  },

  // Rapor çalıştır
  executeReport: async (templateId: number, parameters: Record<string, any>): Promise<{ executionId: number; message: string }> => {
    return apiRequest<{ executionId: number; message: string }>('POST', `/api/admin/reports/execute`, {
      templateId,
      parameters
    });
  },

  // Rapor çalıştırma durumunu kontrol et
  getReportExecution: async (executionId: number): Promise<ReportExecution> => {
    return apiRequest<ReportExecution>('GET', `/api/admin/reports/executions/${executionId}`);
  },

  // Rapor çalıştırmalarını getir
  getReportExecutions: async (): Promise<ReportExecution[]> => {
    return apiRequest<ReportExecution[]>('GET', '/api/admin/reports/executions');
  },

  // Rapor çalıştırmayı iptal et
  cancelReportExecution: async (executionId: number): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>('POST', `/api/admin/reports/executions/${executionId}/cancel`);
  },

  // Rapor dosyasını indir
  downloadReport: async (executionId: number): Promise<Blob> => {
    const response = await fetch(`/api/admin/reports/executions/${executionId}/download`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Rapor indirilemedi');
    }
    
    return response.blob();
  },

  // Rapor zamanlamalarını getir
  getReportSchedules: async (): Promise<ReportSchedule[]> => {
    return apiRequest<ReportSchedule[]>('GET', '/api/admin/reports/schedules');
  },

  // Rapor zamanlaması oluştur
  createReportSchedule: async (schedule: Partial<ReportSchedule>): Promise<ReportSchedule> => {
    return apiRequest<ReportSchedule>('POST', '/api/admin/reports/schedules', schedule);
  },

  // Rapor zamanlaması güncelle
  updateReportSchedule: async (id: number, schedule: Partial<ReportSchedule>): Promise<ReportSchedule> => {
    return apiRequest<ReportSchedule>('PUT', `/api/admin/reports/schedules/${id}`, schedule);
  },

  // Rapor zamanlaması sil
  deleteReportSchedule: async (id: number): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>('DELETE', `/api/admin/reports/schedules/${id}`);
  },

  // Rapor zamanlamasını aktif/pasif yap
  toggleReportSchedule: async (id: number, isActive: boolean): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>('PUT', `/api/admin/reports/schedules/${id}/toggle`, { isActive });
  },

  // Rapor istatistiklerini getir
  getReportStats: async (): Promise<{
    totalReports: number;
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    totalFileSize: string;
    averageExecutionTime: number;
  }> => {
    return apiRequest('GET', '/api/admin/reports/stats');
  },

  // Rapor kategorilerini getir
  getReportCategories: async (): Promise<string[]> => {
    return apiRequest<string[]>('GET', '/api/admin/reports/categories');
  }
};
