import { apiClient } from './apiClient';

export interface ChatbotStatistics {
  ActiveConversations: number;
  AverageSatisfaction: number;
  ResolutionRate: number;
  DailyMessages: number;
  TotalConversations: number;
  TotalMessages: number;
  TotalQuickActions: number;
  TotalKnowledgeArticles: number;
}

export interface ChatbotConversation {
  Id: number;
  UserId: number;
  UserName: string;
  UserEmail: string;
  TenantId: number;
  TenantName: string;
  Status: string;
  Category: string;
  MessageCount: number;
  Satisfaction: number | null;
  LastMessage: string;
  LastMessageTime: string;
  Agent: string;
  Tags: string[];
}

export interface ChatbotMessage {
  Id: number;
  ConversationId: number;
  Sender: string;
  Content: string;
  Timestamp: string;
  MessageType?: string;
  IsRead: boolean;
  Metadata?: string;
}

export interface QuickAction {
  Id: number;
  Title: string;
  Description: string;
  Category: string;
  Icon?: string;
  UsageCount: number;
  IsActive: boolean;
  CreatedAt: string;
  LastUsedAt?: string;
  Priority?: string;
  Metadata?: string;
}

export interface KnowledgeBaseArticle {
  Id: number;
  Title: string;
  Category: string;
  Content: string;
  Views: number;
  HelpfulCount: number;
  NotHelpfulCount: number;
  IsPublished: boolean;
  CreatedAt: string;
  LastUpdatedAt?: string;
  Author?: string;
  Summary?: string;
  Tags?: string;
  Metadata?: string;
}

export interface CreateQuickActionDto {
  Title: string;
  Description: string;
  Category: string;
  Icon?: string;
  Priority?: string;
  Metadata?: string;
}

export interface CreateKnowledgeBaseArticleDto {
  Title: string;
  Category: string;
  Content: string;
  Author?: string;
  Summary?: string;
  Tags?: string;
  Metadata?: string;
}

export interface CreateChatbotMessageDto {
  Sender: string;
  Content: string;
  MessageType?: string;
  Metadata?: string;
}

export interface UpdateConversationStatusDto {
  Status: string;
  Satisfaction?: number;
}

class ChatbotService {
  // Statistics
  async getStatistics(): Promise<ChatbotStatistics> {
    const response = await apiClient.get('/api/admin/chatbot/statistics');
    return response.data;
  }

  // Conversations
  async getConversations(params?: {
    status?: string;
    priority?: string;
    category?: string;
    tenantId?: number;
    page?: number;
    pageSize?: number;
  }): Promise<{
    conversations: ChatbotConversation[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/api/admin/chatbot/conversations', { params });
    return response.data;
  }

  async getConversationMessages(conversationId: number): Promise<ChatbotMessage[]> {
    const response = await apiClient.get(`/api/admin/chatbot/conversations/${conversationId}/messages`);
    return response.data;
  }

  async sendMessage(conversationId: number, message: CreateChatbotMessageDto): Promise<ChatbotMessage> {
    const response = await apiClient.post(`/api/admin/chatbot/conversations/${conversationId}/messages`, message);
    return response.data;
  }

  async updateConversationStatus(conversationId: number, status: UpdateConversationStatusDto): Promise<void> {
    await apiClient.put(`/api/admin/chatbot/conversations/${conversationId}/status`, status);
  }

  // Quick Actions
  async getQuickActions(): Promise<QuickAction[]> {
    const response = await apiClient.get('/api/admin/chatbot/quick-actions');
    return response.data;
  }

  async createQuickAction(quickAction: CreateQuickActionDto): Promise<QuickAction> {
    const response = await apiClient.post('/api/admin/chatbot/quick-actions', quickAction);
    return response.data;
  }

  async useQuickAction(quickActionId: number): Promise<void> {
    await apiClient.put(`/api/admin/chatbot/quick-actions/${quickActionId}/use`);
  }

  // Knowledge Base
  async getKnowledgeBaseArticles(): Promise<KnowledgeBaseArticle[]> {
    const response = await apiClient.get('/api/admin/chatbot/knowledge-base');
    return response.data;
  }

  async createKnowledgeBaseArticle(article: CreateKnowledgeBaseArticleDto): Promise<KnowledgeBaseArticle> {
    const response = await apiClient.post('/api/admin/chatbot/knowledge-base', article);
    return response.data;
  }

  async viewKnowledgeBaseArticle(articleId: number): Promise<void> {
    await apiClient.put(`/api/admin/chatbot/knowledge-base/${articleId}/view`);
  }
}

export const chatbotService = new ChatbotService();
export default chatbotService; 