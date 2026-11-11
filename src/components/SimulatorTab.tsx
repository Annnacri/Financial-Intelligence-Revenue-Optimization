import React, { useState } from 'react';
import { PortfolioProject, ScenarioType, LanguageCode, SimulationParams } from '../types/finance';
import { TRANSLATIONS } from '../data/translations';
import { calculateAggregateMetrics, formatEuro } from '../utils/financialCalculations';
import { Sliders, RefreshCw, AlertTriangle, Sparkles, TrendingUp, DollarSign, Activity, Loader2 } from 'lucide-react';

interface SimulatorTabProps {
  projects: PortfolioProject[];
  scenario: ScenarioType;
  language: LanguageCode;
  simParams: SimulationParams;
  setSimParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
}

export const SimulatorTab: React.FC<SimulatorTabProps> = ({
  projects,
  scenario,
  language,
  simParams,
  setSimParams,
}) => {
  const t = TRANSLATIONS[language];
  const [stressTesting, setStressTesting] = useState(false);
  const [stressResult, setStressResult] = useState<string | null>(null);

  const baselineMetrics = calculateAggregateMetrics(projects, scenario, {
    pricingMultiplier: 1.0,
    cacMultiplier: 1.0,
    churnDeltaPercent: 0,
    conversionRateMultiplier: 1.0,
    opexAdjustmentPercent: 0,
  });

  const simulatedMetrics = calculateAggregateMetrics(projects, scenario, simParams);

  const resetParams = () => {
    setSimParams({
      pricingMultiplier: 1.0,
      cacMultiplier: 1.0,
      churnDeltaPercent: 0,
      conversionRateMultiplier: 1.0,
      opexAdjustmentPercent: 0,
    });
    setStressResult(null);
  };

  const handleRunStressTest = async () => {
    try {
      setStressTesting(true);
      setStressResult(null);

      const response = await fetch('/api/financial-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'stress_test',
          language,
          payload: {
            scenario,
            simParams,
            baselineMetrics,
            simulatedMetrics,
            projectsSummary: projects.map((p) => ({
              name: p.name,
              category: p.category,
              mrr: p.scenarios[scenario].monthlyRevenue,
              margin: p.scenarios[scenario].grossMarginPercent,
            })),
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setStressResult(data.analysis);
      } else {
        setStressResult('Teste de stress concluído com parâmetros padrão.');
      }
    } catch (err: any) {
      setStressResult(`Erro ao executar teste de stress: ${err.message}`);
    } finally {
      setStressTesting(false);
    }
  };

  const revenueDelta = simulatedMetrics.totalMonthlyRevenue - baselineMetrics.totalMonthlyRevenue;
  const netProfitDelta = simulatedMetrics.totalNetProfitMonthly - baselineMetrics.totalNetProfitMonthly;

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Simulador de Sensibilidade Financeira & Testes de Stress
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Avalie como variações na elasticidade de preço, custos de aquisição (CAC), churn e custos fixos afetam a rentabilidade e a liquidez imediata.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetParams}
              className="px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.btnReset}</span>
            </button>
            <button
              onClick={handleRunStressTest}
              disabled={stressTesting}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {stressTesting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>A Processar...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.btnStressTest}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stress Test Live Output Drawer */}
      {stressResult && (
        <div className="p-4 bg-slate-950 border border-emerald-500/40 rounded-lg text-slate-200 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Parecer do Teste de Stress Financeiro (Gemini Flash)
            </span>
            <button
              onClick={() => setStressResult(null)}
              className="text-slate-400 hover:text-slate-200 font-mono text-[11px]"
            >
              Fechar
            </button>
          </div>
          <div className="prose prose-invert prose-xs max-w-none whitespace-pre-line leading-relaxed font-sans text-slate-300">
            {stressResult}
          </div>
        </div>
      )}

      {/* Impact Comparison Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">
            MRR Simulado vs Base
          </span>
          <div className="mt-1 text-2xl font-bold font-mono text-white tabular-nums">
            {formatEuro(simulatedMetrics.totalMonthlyRevenue)}
          </div>
          <span
            className={`text-xs font-mono mt-1 block font-semibold ${
              revenueDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {revenueDelta >= 0 ? '+' : ''}
            {formatEuro(revenueDelta)} / mês
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">
            Lucro Líquido Simulado
          </span>
          <div className="mt-1 text-2xl font-bold font-mono text-emerald-300 tabular-nums">
            {formatEuro(simulatedMetrics.totalNetProfitMonthly)}
          </div>
          <span
            className={`text-xs font-mono mt-1 block font-semibold ${
              netProfitDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {netProfitDelta >= 0 ? '+' : ''}
            {formatEuro(netProfitDelta)} delta
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">
            Margem Líquida Ponderada
          </span>
          <div className="mt-1 text-2xl font-bold font-mono text-white tabular-nums">
            {simulatedMetrics.blendedNetMarginPercent}%
          </div>
          <span className="text-xs text-slate-400 font-mono mt-1 block">
            Base: {baselineMetrics.blendedNetMarginPercent}%
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">
            LTV / CAC Agregado
          </span>
          <div className="mt-1 text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {simulatedMetrics.portfolioLtvCacRatio}x
          </div>
          <span className="text-xs text-slate-400 font-mono mt-1 block">
            Runway: {simulatedMetrics.estimatedRunwayMonths} meses
          </span>
        </div>
      </div>

      {/* Interactive Sliders Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-5">
          <h3 className="text-xs font-semibold text-white font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
            Parâmetros de Receita & Mercado
          </h3>

          {/* Pricing Multiplier */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300">Elasticidade de Preço / Ticket Médio</span>
              <span className="text-emerald-400 font-bold tabular-nums">
                {Math.round(simParams.pricingMultiplier * 100)}% ({simParams.pricingMultiplier >= 1 ? '+' : ''}
                {Math.round((simParams.pricingMultiplier - 1) * 100)}%)
              </span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.05"
              value={simParams.pricingMultiplier}
              onChange={(e) =>
                setSimParams((prev) => ({
                  ...prev,
                  pricingMultiplier: parseFloat(e.target.value),
                }))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-30% (Desconto agressivo)</span>
              <span>100% (Preço base)</span>
              <span>+50% (Precificação premium)</span>
            </div>
          </div>

          {/* Customer Conversion / Volume */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300">Volume de Clientes / Conversão de Vendas</span>
              <span className="text-cyan-400 font-bold tabular-nums">
                {Math.round(simParams.conversionRateMultiplier * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={simParams.conversionRateMultiplier}
              onChange={(e) =>
                setSimParams((prev) => ({
                  ...prev,
                  conversionRateMultiplier: parseFloat(e.target.value),
                }))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0.5x (Queda de 50%)</span>
              <span>1.0x (Volume normal)</span>
              <span>2.0x (Crescimento de 100%)</span>
            </div>
          </div>

          {/* Churn Delta */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300">Variação no Churn Mensal de Clientes</span>
              <span className="text-amber-400 font-bold tabular-nums">
                {simParams.churnDeltaPercent >= 0 ? '+' : ''}
                {simParams.churnDeltaPercent}%
              </span>
            </div>
            <input
              type="range"
              min="-5"
              max="10"
              step="1"
              value={simParams.churnDeltaPercent}
              onChange={(e) =>
                setSimParams((prev) => ({
                  ...prev,
                  churnDeltaPercent: parseInt(e.target.value, 10),
                }))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-5% (Alta fidelização)</span>
              <span>0% (Churn esperado)</span>
              <span>+10% (Perda acelerada)</span>
            </div>
          </div>
        </div>

        {/* Cost & Operational Sensitivity */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-5">
          <h3 className="text-xs font-semibold text-white font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
            Parâmetros de Custo de Aquisição & OpEx
          </h3>

          {/* CAC Multiplier */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300">Custo de Aquisição de Clientes (CAC)</span>
              <span className="text-rose-400 font-bold tabular-nums">
                {Math.round(simParams.cacMultiplier * 100)}% ({simParams.cacMultiplier >= 1 ? '+' : ''}
                {Math.round((simParams.cacMultiplier - 1) * 100)}%)
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={simParams.cacMultiplier}
              onChange={(e) =>
                setSimParams((prev) => ({
                  ...prev,
                  cacMultiplier: parseFloat(e.target.value),
                }))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0.5x (CAC barato / orgânico)</span>
              <span>1.0x (CAC projetado)</span>
              <span>2.5x (Campanhas caras)</span>
            </div>
          </div>

          {/* OpEx Adjustment */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300">Ajuste de Custos Fixos & Infraestrutura (OpEx)</span>
              <span className="text-slate-200 font-bold tabular-nums">
                {simParams.opexAdjustmentPercent >= 0 ? '+' : ''}
                {simParams.opexAdjustmentPercent}%
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              step="5"
              value={simParams.opexAdjustmentPercent}
              onChange={(e) =>
                setSimParams((prev) => ({
                  ...prev,
                  opexAdjustmentPercent: parseInt(e.target.value, 10),
                }))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-300"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-20% (Lean absoluto)</span>
              <span>0% (Orçamento base)</span>
              <span>+30% (Escala de servidores e suporte)</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-mono block mb-2">
              Cenários Pré-Configurados:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  setSimParams({
                    pricingMultiplier: 1.2,
                    cacMultiplier: 0.8,
                    churnDeltaPercent: -2,
                    conversionRateMultiplier: 1.3,
                    opexAdjustmentPercent: 0,
                  })
                }
                className="px-2.5 py-1 text-[11px] bg-slate-800 text-emerald-400 hover:bg-slate-700 rounded font-mono"
              >
                Otimização de Margem (+20% Preço)
              </button>
              <button
                onClick={() =>
                  setSimParams({
                    pricingMultiplier: 0.9,
                    cacMultiplier: 1.8,
                    churnDeltaPercent: 5,
                    conversionRateMultiplier: 0.7,
                    opexAdjustmentPercent: 15,
                  })
                }
                className="px-2.5 py-1 text-[11px] bg-slate-800 text-rose-400 hover:bg-slate-700 rounded font-mono"
              >
                Choque de Mercado (CAC Dobra + Queda 30%)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
