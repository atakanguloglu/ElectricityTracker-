import { apiRequest } from './apiService';

export interface HelpCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  articleCount: number;
  parentCategoryId?: number;
  parentCategory?: HelpCategory;
  subCategories?: HelpCategory[];
  sortOrder: number;
  isActive: boolean;
}

export interface HelpArticle {
  id: number;
  title: string;
  content: string;
  slug: string;
  categoryId: number;
  category: HelpCategory;
  status: 'draft' | 'published' | 'archived';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  authorId: number;
  authorName: string;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ContactRequest {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  helpfulCount: number;
  notHelpfulCount: number;
  isActive: boolean;
  sortOrder: number;
}

export const helpService = {
  // Kategorileri getir
  getCategories: async (): Promise<HelpCategory[]> => {
    return apiRequest<HelpCategory[]>('GET', '/api/admin/help/categories');
  },

  // Kategori oluştur
  createCategory: async (category: Partial<HelpCategory>): Promise<HelpCategory> => {
    return apiRequest<HelpCategory>('POST', '/api/admin/help/categories', category);
  },

  // Kategori güncelle
  updateCategory: async (id: number, category: Partial<HelpCategory>): Promise<HelpCategory> => {
    return apiRequest<HelpCategory>('PUT', `/api/admin/help/categories/${id}`, category);
  },

  // Kategori sil
  deleteCategory: async (id: number): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>('DELETE', `/api/admin/help/categories/${id}`);
  },

  // Makaleleri getir
  getArticles: async (categoryId?: number): Promise<HelpArticle[]> => {
    const url = categoryId 
      ? `/api/admin/help/articles?categoryId=${categoryId}`
      : '/api/admin/help/articles';
    return apiRequest<HelpArticle[]>('GET', url);
  },

  // Makale oluştur
  createArticle: async (article: Partial<HelpArticle>): Promise<HelpArticle> => {
    return apiRequest<HelpArticle>('POST', '/api/admin/help/articles', article);
  },

  // Makale güncelle
  updateArticle: async (id: number, article: Partial<HelpArticle>): Promise<HelpArticle> => {
    return apiRequest<HelpArticle>('PUT', `/api/admin/help/articles/${id}`, article);
  },

  // Makale sil
  deleteArticle: async (id: number): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>('DELETE', `/api/admin/help/articles/${id}`);
  },

  // Makale arama
  searchArticles: async (query: string): Promise<HelpArticle[]> => {
    return apiRequest<HelpArticle[]>('GET', `/api/admin/help/articles/search?q=${encodeURIComponent(query)}`);
  },

  // FAQ'ları getir
  getFAQs: async (): Promise<FAQ[]> => {
    return apiRequest<FAQ[]>('GET', '/api/admin/help/faqs');
  },

  // FAQ oluştur
  createFAQ: async (faq: Partial<FAQ>): Promise<FAQ> => {
    return apiRequest<FAQ>('POST', '/api/admin/help/faqs', faq);
  },

  // FAQ güncelle
  updateFAQ: async (id: number, faq: Partial<FAQ>): Promise<FAQ> => {
    return apiRequest<FAQ>('PUT', `/api/admin/help/faqs/${id}`, faq);
  },

  // FAQ sil
  deleteFAQ: async (id: number): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>('DELETE', `/api/admin/help/faqs/${id}`);
  },

  // Makale etkileşimlerini kaydet
  recordArticleInteraction: async (articleId: number, type: 'view' | 'helpful' | 'not_helpful'): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>('POST', `/api/admin/help/articles/${articleId}/interactions`, { type });
  },

  // İletişim taleplerini getir
  getContactRequests: async (): Promise<ContactRequest[]> => {
    return apiRequest<ContactRequest[]>('GET', '/api/admin/help/contact-requests');
  },

  // İletişim talebini güncelle
  updateContactRequest: async (id: number, request: Partial<ContactRequest>): Promise<ContactRequest> => {
    return apiRequest<ContactRequest>('PUT', `/api/admin/help/contact-requests/${id}`, request);
  },

  // İletişim talebini sil
  deleteContactRequest: async (id: number): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>('DELETE', `/api/admin/help/contact-requests/${id}`);
  },

  // İletişim talebi oluştur (public endpoint)
  createContactRequest: async (request: Partial<ContactRequest>): Promise<ContactRequest> => {
    return apiRequest<ContactRequest>('POST', '/api/help/contact', request);
  }
};
