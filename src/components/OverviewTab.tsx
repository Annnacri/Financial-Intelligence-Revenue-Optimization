import React from 'react';
import { PortfolioProject, ScenarioType, LanguageCode, SimulationParams } from '../types/finance';
import { TRANSLATIONS } from '../data/translations';
import { calculateAggregateMetrics, formatEuro } from '../utils/financialCalculations';
import { INITIAL_CASH_FLOW_MILESTONES } from '../data/portfolioData';
import { TrendingUp, Clock, AlertTriangle, ArrowUpRight, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

interface OverviewTabProps {
  projects: PortfolioProject[];
  scenario: ScenarioType;
  setScenario: (s: ScenarioType) => void;
  language: LanguageCode;
  simParams: SimulationParams;
  onNavigateToTab: (tab: string) => void;
  onOpenCeoDispatch: () => void;
  onSelectProject: (projectId: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  projects,
  scenario,
  setScenario,
  language,
  simParams,
  onNavigateToTab,
  onOpenCeoDispatch,
  onSelectProject,
}) => {
  const t = TRANSLATIONS[language];
  const metrics = calculateAggregateMetrics(projects, scenario, simParams);

  const scenarioDescriptions: Record<ScenarioType, string> = {
    conservative: 'Premissas prudentes: conversão 35% abaixo, CAC +20%, sem contratos enterprise.',
    realistic: 'Plano base: conversão validada, CAC normalizado, ramp-up gradual de vendas B2B.',
    optimistic: 'Escala acelerada: tração em múltiplos canais B2B e expansão ibérica rápida.',
  };

  return (
    <div className="space-y-8">
      {/* Top Controls: Scenario Switcher & High-Level Directive */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white tracking-tight">
              Análise Financeira Consolidada do Portfólio
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              · 5 Ativos Analisados
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {scenarioDescriptions[scenario]}
          </p>
        </div>

        {/* Segmented Control for Scenario */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-md shrink-0">
          {(['conservative', 'realistic', 'optimistic'] as ScenarioType[]).map((sc) => (
            <button
              key={sc}
              onClick={() => setScenario(sc)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap capitalize ${
                scenario === sc
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sc === 'conservative'
                ? t.scenarioConservative
                : sc === 'realistic'
                ? t.scenarioRealistic
                : t.scenarioOptimistic}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Grid (Tabular Numerals, High-Density) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* MRR */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">
            {t.metricMrr}
          </span>
          <div className="mt-1 text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {formatEuro(metrics.totalMonthlyRevenue)}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            ARR: {formatEuro(metrics.totalAnnualRevenue)}
          </span>
        </div>

        {/* Gross Margin */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">
            {t.metricGrossMargin}
          </span>
          <div className="mt-1 text-2xl font-bold font-mono text-white tabular-nums">
            {metrics.blendedGrossMarginPercent}%
          </div>
          <span className="text-[11px] text-emerald-400/90 font-mono mt-1 block">
            Software & Margem Operacional Alta
          </span>
        </div>

        {/* Monthly Net Profit */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">
            Lucro Líquido Mensal
          </span>
          <div className="mt-1 text-2xl font-bold font-mono text-emerald-300 tabular-nums">
            {formatEuro(metrics.totalNetProfitMonthly)}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Margem Líquida: {metrics.blendedNetMarginPercent}%
          </span>
        </div>

        {/* 7-Day Immediate Cash */}
        <div className="bg-slate-900 border border-emerald-500/30 p-4 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 text-[9px] font-mono px-2 py-0.5 rounded-bl">
            IMEDIATO
          </div>
          <span className="text-[11px] uppercase tracking-wider text-slate-300 font-mono block">
            {t.metricCashFlow7d}
          </span>
          <div className="mt-1 text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            +{formatEuro(metrics.sevenDayCashFlow)}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Via Breakfast in Bed LX
          </span>
        </div>

        {/* 30-Day Cash Flow */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">
            {t.metricCashFlow30d}
          </span>
          <div className="mt-1 text-2xl font-bold font-mono text-white tabular-nums">
            +{formatEuro(metrics.thirtyDayCashFlow)}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Contratos B2B Hoteleiros
          </span>
        </div>

        {/* Break-Even Units */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">
            {t.metricBreakEven}
          </span>
          <div className="mt-1 text-2xl font-bold font-mono text-slate-200 tabular-nums">
            {metrics.totalBreakEvenUnits} <span className="text-xs font-normal text-slate-400">unid.</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Runway: {metrics.estimatedRunwayMonths} meses
          </span>
        </div>
      </div>

      {/* Cash Generation Speed Roadmap (7, 30, 90 Days) */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Catalisadores de Fluxo de Caixa: Janelas de 7, 30 e 90 Dias
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Priorização rigorosa de negócios capazes de gerar liquidez rápida para autofinanciar o ecossistema.
            </p>
          </div>
          <button
            onClick={onOpenCeoDispatch}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 transition-colors"
          >
            <span>Ver Síntese para CEO</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INITIAL_CASH_FLOW_MILESTONES.map((m) => (
            <div
              key={m.horizon}
              className="bg-slate-950 border border-slate-800/90 rounded-md p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider">
                    {m.horizon === '7_days'
                      ? '⏱️ 7 Dias (Geração Imediata)'
                      : m.horizon === '30_days'
                      ? '📅 30 Dias (Tração B2B)'
                      : '📈 90 Dias (Expansão)'}
                  </span>
                  <span className="text-slate-400 text-[11px]">{m.status}</span>
                </div>

                <h4 className="text-xs font-semibold text-slate-100 mb-2">{m.title}</h4>

                <ul className="space-y-1.5 text-xs text-slate-400">
                  {m.keyDrivers.map((driver, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold shrink-0">·</span>
                      <span>{driver}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Caixa Líquido Previsto:</span>
                <span className="text-emerald-400 font-bold tabular-nums">
                  +{formatEuro(m.netCash)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Table Snapshot */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Tabela Comparativa de Desempenho e Viabilidade Comercial
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Valores baseados no {scenarioDescriptions[scenario].toLowerCase()}
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('portfolio')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
          >
            <span>Ver Ficha Completa dos 5 Ativos</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Projeto & Categoria</th>
                <th className="py-3 px-4">Modelo Principal</th>
                <th className="py-3 px-4 text-center">Velocidade</th>
                <th className="py-3 px-4 text-right">MRR ({scenario})</th>
                <th className="py-3 px-4 text-right">Margem Bruta</th>
                <th className="py-3 px-4 text-right">CAC / LTV</th>
                <th className="py-3 px-4 text-center">Score (0-100)</th>
                <th className="py-3 px-4 text-center">Prioridade</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {projects.map((proj) => {
                const s = proj.scenarios[scenario];
                return (
                  <tr
                    key={proj.id}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => {
                      onSelectProject(proj.id);
                      onNavigateToTab('portfolio');
                    }}
                  >
                    <td className="py-3 px-4 font-medium text-white">
                      <div>{proj.name}</div>
                      <span className="text-[11px] text-slate-400 font-normal">
                        {proj.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                      {proj.coreModel}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      <span
                        className={`text-[11px] ${
                          proj.speedCategory === '7_days'
                            ? 'text-emerald-400 font-bold'
                            : proj.speedCategory === '30_days'
                            ? 'text-cyan-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {proj.speedCategory === '7_days'
                          ? '≤ 7 Dias'
                          : proj.speedCategory === '30_days'
                          ? '≤ 30 Dias'
                          : '≤ 90 Dias'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-400 font-bold tabular-nums">
                      {formatEuro(s.monthlyRevenue)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-200">
                      {s.grossMarginPercent}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-400">
                      €{s.cac} / €{s.ltv}{' '}
                      <span className="text-[10px] text-emerald-400">({s.ltvCacRatio}x)</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                        {proj.scoring.totalScore}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[11px] font-mono ${
                          proj.priorityLevel === 'Crítica'
                            ? 'text-rose-400 font-semibold'
                            : proj.priorityLevel === 'Alta'
                            ? 'text-emerald-400 font-semibold'
                            : 'text-amber-400'
                        }`}
                      >
                        {proj.priorityLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProject(proj.id);
                          onNavigateToTab('portfolio');
                        }}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-mono"
                      >
                        Auditar &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cross-Selling & Portfolio Synergies Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between gap-4 mb-3">
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Matriz de Sinergias & Vendas Cruzadas (Cross-Selling Multiplier)
          </h3>
          <button
            onClick={() => onNavigateToTab('monetization')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
          >
            <span>Ver Modelos de Monetização</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded">
            <span className="text-emerald-400 font-mono font-semibold block mb-1">
              AI Hotel Concierge + Breakfast in Bed LX
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              O Concierge nos hotéis boutique de Lisboa oferece os pequenos-almoços e brunches do Breakfast in Bed LX diretamente aos hóspedes, gerando comissão de 12% para o hotel e margem de 55% para nós.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded">
            <span className="text-emerald-400 font-mono font-semibold block mb-1">
              AI Hotel Concierge + AI Tourguide Creator
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              O AI Tourguide Creator opera como o módulo de experiências locais embutido no Concierge do hotel, eliminando o custo de aquisição B2C de turistas e captando €4,99 a €9,99 por roteiro gerado.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded">
            <span className="text-emerald-400 font-mono font-semibold block mb-1">
              NexusAIStore + Ecossistema Completo
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Distribuição e venda dos templates de guias turísticos, prompts para hospitalidade e scripts de agentes de suporte no marketplace com 95% de margem e cobrança de taxa de destaque de €49/semana.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
