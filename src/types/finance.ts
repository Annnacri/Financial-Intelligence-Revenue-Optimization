export type ScenarioType = 'conservative' | 'realistic' | 'optimistic';

export type LanguageCode = 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'ar';

export interface FinancialMetricScenario {
  pricePerUnit: number; // in EUR
  activeUnitsOrSubs: number;
  monthlyRevenue: number;
  annualRevenue: number;
  cogsMonthly: number; // cost of goods sold / variable cost
  opexMonthly: number; // allocated fixed opex
  grossMarginPercent: number;
  netMarginPercent: number;
  cac: number; // customer acquisition cost
  ltv: number; // lifetime value
  ltvCacRatio: number;
  paybackMonths: number;
  breakEvenUnits: number;
  speedToFirstRevenueDays: number;
}

export interface OpportunityScoreDetail {
  revenuePotential: number; // Max 25
  profitMargin: number; // Max 20
  speedToRevenue: number; // Max 20
  marketDemand: number; // Max 15
  implementationCost: number; // Max 10
  recurringRevenue: number; // Max 10
  totalScore: number; // Sum: Max 100
  rationale: string;
}

export interface PortfolioProject {
  id: string;
  name: string;
  tagline: string;
  category: 'SaaS & AI' | 'Hospitality Tech' | 'Marketplace' | 'Direct Operations (Lisbon)' | 'Web3 & RWA';
  coreModel: string; // e.g., "B2B SaaS + Setup Fee", "AOV + Weekly Subscription"
  status: 'Ready to Monetize' | 'Active Testing' | 'Structuring' | 'Scaling';
  priorityLevel: 'Crítica' | 'Alta' | 'Média';
  speedCategory: '7_days' | '30_days' | '90_days';
  scenarios: {
    conservative: FinancialMetricScenario;
    realistic: FinancialMetricScenario;
    optimistic: FinancialMetricScenario;
  };
  scoring: OpportunityScoreDetail;
  verifiedFacts: string[];
  assumptions: string[];
  missingInformation: string[];
  risks: string[];
  monetizationStrategies: {
    model: string;
    description: string;
    targetPrice: string;
    marginProfile: string;
    recommendationGrade: 'Highly Recommended' | 'Recommended' | 'Secondary';
  }[];
  operationalRisk: number; // 0 to 100 (0 = effortless, 100 = extreme operational friction)
  operationalRiskFactors?: string[];
  crossSellingSynergies: string[];
}

export interface CashFlowMilestone {
  horizon: '7_days' | '30_days' | '90_days';
  title: string;
  expectedInflow: number;
  expectedOutflow: number;
  netCash: number;
  keyDrivers: string[];
  priorityLevel: 'Crítica' | 'Alta' | 'Média';
  status: 'Immediate Action' | 'In Pipeline' | 'Structuring';
}

export interface CEOReportData {
  title: string;
  date: string;
  recipient: string;
  executiveSummary: string;
  immediateOpportunities: {
    window: '7 Dias' | '30 Dias' | '90 Dias';
    project: string;
    expectedCash: number;
    actions: string;
  }[];
  revenueAndMarginPotential: string;
  costsAndInvestment: string;
  risksAndMitigations: string[];
  recommendedActions: {
    action: string;
    priority: 'Crítica' | 'Alta' | 'Média';
    ownerAgent: string;
    timeline: string;
  }[];
  missingInfoRequiringVerification: string[];
  overallPriority: 'Crítica' | 'Alta' | 'Média';
}

export interface SimulationParams {
  pricingMultiplier: number; // 0.7x to 1.5x
  cacMultiplier: number; // 0.6x to 2.0x
  churnDeltaPercent: number; // -5% to +10%
  conversionRateMultiplier: number; // 0.5x to 2.0x
  opexAdjustmentPercent: number; // -20% to +30%
}
