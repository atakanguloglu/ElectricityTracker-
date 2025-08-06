import { apiClient } from './apiClient';

export interface ChatRequest {
  question: string;
  context?: string;
}

export interface ConsumptionAnalysisRequest {
  consumptionData: string;
  facilityName: string;
  dataPoints: number;
}

export interface EnergyOptimizationRequest {
  facilityData: string;
  facilityName: string;
  currentConsumption: number;
}

export interface ReportGenerationRequest {
  reportType: string;
  data: string;
}

export interface AIResponse {
  Success: boolean;
  Content?: string;
  Error?: string;
  GeneratedAt: string;
}

export interface AIUsageStats {
  totalRequests: number;
  recentRequests: number;
  successRate: number;
  lastUsed?: string;
  popularFeatures: Array<{
    feature: string;
    usageCount: number;
  }>;
}

class AIService {
  // Tenant-level AI endpoints
  async chat(request: ChatRequest): Promise<AIResponse> {
    const response = await apiClient.post('/api/ai/chat', request);
    return response.data;
  }

  async analyzeConsumption(request: ConsumptionAnalysisRequest): Promise<AIResponse> {
    const response = await apiClient.post('/api/ai/analyze-consumption', request);
    return response.data;
  }

  async getEnergyOptimization(request: EnergyOptimizationRequest): Promise<AIResponse> {
    const response = await apiClient.post('/api/ai/energy-optimization', request);
    return response.data;
  }

  async generateReport(request: ReportGenerationRequest): Promise<AIResponse> {
    const response = await apiClient.post('/api/ai/generate-report', request);
    return response.data;
  }

  // SuperAdmin AI endpoints
  async generateContent(prompt: string, context?: string): Promise<AIResponse> {
    console.log('DEBUG - generateContent called with:', { prompt, context });
    try {
      const response = await apiClient.post('/api/admin/ai/generate-content', {
        prompt,
        context
      });
      console.log('DEBUG - generateContent response:', response);
      return response.data;
    } catch (error) {
      console.error('DEBUG - Error in generateContent:', error);
      throw error;
    }
  }

  async testConnection(): Promise<AIResponse> {
    const response = await apiClient.post('/api/admin/ai/test-connection');
    return response.data;
  }

  async getUsageStats(): Promise<AIUsageStats> {
    const response = await apiClient.get('/api/admin/ai/usage-stats');
    return response.data;
  }

  // Chatbot specific methods
  async sendChatMessage(message: string, conversationId?: string): Promise<AIResponse> {
    return this.chat({
      question: message,
      context: conversationId ? `Conversation ID: ${conversationId}` : undefined
    });
  }

  // SuperAdmin chatbot specific methods
  async sendSuperAdminChatMessage(message: string, conversationId?: string): Promise<AIResponse> {
    console.log('DEBUG - sendSuperAdminChatMessage called with:', { message, conversationId });
    try {
      const result = await this.generateContent(message, conversationId ? `Conversation ID: ${conversationId}` : undefined);
      console.log('DEBUG - generateContent result:', result);
      return result;
    } catch (error) {
      console.error('DEBUG - Error in sendSuperAdminChatMessage:', error);
      throw error;
    }
  }

  async getQuickResponse(category: string, question: string): Promise<AIResponse> {
    const context = `Category: ${category}. This is a quick response request.`;
    return this.chat({
      question,
      context
    });
  }

  async analyzeConversation(conversationData: string): Promise<AIResponse> {
    return this.generateReport({
      reportType: 'Konuşma Analizi',
      data: conversationData
    });
  }
}

export const aiService = new AIService(); 