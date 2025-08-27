import { apiClient } from './apiClient';

export interface ConsumptionPrediction {
  Id: number;
  TenantId: number;
  TenantName: string;
  ResourceType: string;
  ResourceName: string;
  CurrentMonth: number;
  PredictedNextMonth: number;
  PredictedYearly: number;
  Confidence: number;
  Trend: string;
  Factors: string[];
  Recommendations: string[];
}

export interface CostSavings {
  Id: number;
  TenantId: number;
  TenantName: string;
  DepartmentId: number;
  DepartmentName: string;
  CurrentCost: number;
  PotentialSavings: number;
  SavingsPercentage: number;
  Recommendations: string[];
  ImplementationTime: string;
  ROI: number;
  Priority: string;
}

export interface DepartmentKPI {
  Id: number;
  TenantId: number;
  TenantName: string;
  DepartmentId: number;
  DepartmentName: string;
  EnergyEfficiency: number;
  CostPerEmployee: number;
  SustainabilityScore: number;
  ImprovementAreas: string[];
}

export interface CarbonFootprint {
  Id: number;
  TenantId: number;
  TenantName: string;
  CurrentMonth: number;
  PreviousMonth: number;
  Reduction: number;
  Target: number;
  Status: string;
}

export interface ExecutiveKPI {
  Id: number;
  TenantId: number;
  TenantName: string;
  TotalEnergyCost: number;
  EnergyEfficiency: number;
  SustainabilityScore: number;
  CostSavings: number;
  ComplianceScore: number;
}

class AIAnalyticsService {
  // Get consumption predictions
  async getConsumptionPredictions(): Promise<ConsumptionPrediction[]> {
    const response = await apiClient.get('/api/admin/ai/analytics/consumption-predictions');
    return response.data;
  }

  // Get cost savings
  async getCostSavings(): Promise<CostSavings[]> {
    const response = await apiClient.get('/api/admin/ai/analytics/cost-savings');
    return response.data;
  }

  // Get department KPIs
  async getDepartmentKPIs(): Promise<DepartmentKPI[]> {
    const response = await apiClient.get('/api/admin/ai/analytics/department-kpis');
    return response.data;
  }

  // Get carbon footprint
  async getCarbonFootprint(): Promise<CarbonFootprint[]> {
    const response = await apiClient.get('/api/admin/ai/analytics/carbon-footprint');
    return response.data;
  }

  // Get executive KPIs
  async getExecutiveKPIs(): Promise<ExecutiveKPI[]> {
    const response = await apiClient.get('/api/admin/ai/analytics/executive-kpis');
    return response.data;
  }
}

export const aiAnalyticsService = new AIAnalyticsService();
export default aiAnalyticsService;

