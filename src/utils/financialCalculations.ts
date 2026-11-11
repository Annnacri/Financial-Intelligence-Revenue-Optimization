import { PortfolioProject, ScenarioType, SimulationParams, OpportunityScoreDetail } from '../types/finance';

export interface AggregatePortfolioMetrics {
  totalMonthlyRevenue: number;
  totalAnnualRevenue: number;
  totalMonthlyCogs: number;
  totalMonthlyOpex: number;
  blendedGrossMarginPercent: number;
  blendedNetMarginPercent: number;
  totalNetProfitMonthly: number;
  totalBreakEvenUnits: number;
  portfolioLtvCacRatio: number;
  estimatedRunwayMonths: number;
  sevenDayCashFlow: number;
  thirtyDayCashFlow: number;
  ninetyDayCashFlow: number;
}

export function calculateAggregateMetrics(
  projects: PortfolioProject[],
  scenario: ScenarioType,
  simParams: SimulationParams
): AggregatePortfolioMetrics {
  let totalRev = 0;
  let totalCogs = 0;
  let totalOpex = 0;
  let totalBreakEven = 0;
  let weightedLtvSum = 0;
  let totalCacSum = 0;

  projects.forEach((proj) => {
    const s = proj.scenarios[scenario];

    // Apply simulation multipliers
    const adjustedPrice = s.pricePerUnit * simParams.pricingMultiplier;
    const adjustedUnits = Math.max(
      1,
      Math.round(
        s.activeUnitsOrSubs *
          simParams.conversionRateMultiplier *
          (1 - simParams.churnDeltaPercent / 100)
      )
    );

    const adjustedRev = adjustedPrice * adjustedUnits;
    const adjustedCogs = s.cogsMonthly * (adjustedUnits / s.activeUnitsOrSubs);
    const adjustedOpex = s.opexMonthly * (1 + simParams.opexAdjustmentPercent / 100);

    totalRev += adjustedRev;
    totalCogs += adjustedCogs;
    totalOpex += adjustedOpex;
    totalBreakEven += s.breakEvenUnits;

    const adjustedCac = s.cac * simParams.cacMultiplier;
    weightedLtvSum += s.ltv * adjustedUnits;
    totalCacSum += adjustedCac * adjustedUnits;
  });

  const grossProfit = totalRev - totalCogs;
  const netProfit = grossProfit - totalOpex;
  const blendedGrossMargin = totalRev > 0 ? (grossProfit / totalRev) * 100 : 0;
  const blendedNetMargin = totalRev > 0 ? (netProfit / totalRev) * 100 : 0;
  const portfolioLtvCacRatio = totalCacSum > 0 ? weightedLtvSum / totalCacSum : 10;

  // Assuming current base liquid cash reserves of €35,000
  const baseCashReserve = 35000;
  const monthlyBurnOrSurplus = netProfit;
  let estimatedRunwayMonths = 24;
  if (monthlyBurnOrSurplus < 0) {
    estimatedRunwayMonths = Math.max(1, Math.round(baseCashReserve / Math.abs(monthlyBurnOrSurplus)));
  } else {
    estimatedRunwayMonths = 36; // Profitable / self-sustaining
  }

  // 7d, 30d, 90d cash generation
  // Breakfast in Bed LX delivers immediate 7d cash flow
  const breakfast = projects.find((p) => p.id === 'breakfast-in-bed-lx');
  const bRev7d = breakfast ? (breakfast.scenarios[scenario].monthlyRevenue * simParams.pricingMultiplier * 0.25) : 1000;
  const sevenDayCashFlow = Math.round(bRev7d - (totalOpex / 4) * 0.3);

  const thirtyDayCashFlow = Math.round(netProfit);
  const ninetyDayCashFlow = Math.round(netProfit * 3.4); // factoring pipeline growth

  return {
    totalMonthlyRevenue: Math.round(totalRev),
    totalAnnualRevenue: Math.round(totalRev * 12),
    totalMonthlyCogs: Math.round(totalCogs),
    totalMonthlyOpex: Math.round(totalOpex),
    blendedGrossMarginPercent: Number(blendedGrossMargin.toFixed(1)),
    blendedNetMarginPercent: Number(blendedNetMargin.toFixed(1)),
    totalNetProfitMonthly: Math.round(netProfit),
    totalBreakEvenUnits: totalBreakEven,
    portfolioLtvCacRatio: Number(portfolioLtvCacRatio.toFixed(1)),
    estimatedRunwayMonths,
    sevenDayCashFlow,
    thirtyDayCashFlow,
    ninetyDayCashFlow,
  };
}

export function computeOpportunityScore(
  revenuePotential: number, // 0 - 25
  profitMargin: number, // 0 - 20
  speedToRevenue: number, // 0 - 20
  marketDemand: number, // 0 - 15
  implementationCost: number, // 0 - 10
  recurringRevenue: number // 0 - 10
): OpportunityScoreDetail {
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  const rev = clamp(revenuePotential, 0, 25);
  const margin = clamp(profitMargin, 0, 20);
  const speed = clamp(speedToRevenue, 0, 20);
  const demand = clamp(marketDemand, 0, 15);
  const cost = clamp(implementationCost, 0, 10);
  const recurring = clamp(recurringRevenue, 0, 10);

  const total = rev + margin + speed + demand + cost + recurring;

  let rationale = '';
  if (total >= 85) {
    rationale = 'Oportunidade de Nível A (Prioridade Crítica / Alta). Alinhamento excelente entre velocidade para primeiro euro, margens elevadas e baixo custo de implementação.';
  } else if (total >= 70) {
    rationale = 'Oportunidade de Nível B (Viável com Condições). Potencial comercial sólido, mas requer validação prévia de canais de aquisição (CAC) ou mitigação de tempo de maturação.';
  } else {
    rationale = 'Oportunidade de Nível C (Risco Elevado ou Baixo Retorno). Não recomendada para alocação prioritária de capital até que premissas essenciais sejam comprovadas.';
  }

  return {
    revenuePotential: rev,
    profitMargin: margin,
    speedToRevenue: speed,
    marketDemand: demand,
    implementationCost: cost,
    recurringRevenue: recurring,
    totalScore: total,
    rationale,
  };
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}
