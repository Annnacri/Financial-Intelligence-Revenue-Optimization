import React, { useState } from 'react';
import { PortfolioProject, ScenarioType, LanguageCode } from '../types/finance';
import { TRANSLATIONS } from '../data/translations';
import { formatEuro } from '../utils/financialCalculations';
import {
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Sliders,
  DollarSign,
  Layers,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface PortfolioTabProps {
  projects: PortfolioProject[];
  scenario: ScenarioType;
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  language: LanguageCode;
}

export const PortfolioTab: React.FC<PortfolioTabProps> = ({
  projects,
  scenario,
  selectedProjectId,
  onSelectProject,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [activeScenario, setActiveScenario] = useState<ScenarioType>(scenario);
  const [aiAuditing, setAiAuditing] = useState(false);
  const [aiAuditResult, setAiAuditResult] = useState<string | null>(null);

  const currentProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  const s = currentProject.scenarios[activeScenario];

  const handleRunAiAudit = async () => {
    try {
      setAiAuditing(true);
      setAiAuditResult(null);

      const response = await fetch('/api/financial-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'audit_opportunity',
          language,
          payload: {
            projectName: currentProject.name,
            category: currentProject.category,
            coreModel: currentProject.coreModel,
            scenario: activeScenario,
            financialMetrics: s,
            scoring: currentProject.scoring,
            verifiedFacts: currentProject.verifiedFacts,
            assumptions: currentProject.assumptions,
            missingInformation: currentProject.missingInformation,
            risks: currentProject.risks,
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAiAuditResult(data.analysis);
      } else {
        setAiAuditResult('Não foi possível obter a auditoria em tempo real.');
      }
    } catch (err: any) {
      setAiAuditResult(`Erro ao contactar a inteligência financeira: ${err.message}`);
    } finally {
      setAiAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {projects.map((proj) => {
          const isSelected = proj.id === currentProject.id;
          return (
            <button
              key={proj.id}
              onClick={() => {
                onSelectProject(proj.id);
                setAiAuditResult(null);
              }}
              className={`px-3.5 py-2 text-xs rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 border ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-white font-semibold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{proj.name}</span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 bg-slate-800 rounded text-emerald-400">
                {proj.scoring.totalScore} pts
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Project Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {currentProject.name}
              </h2>
              <span className="text-xs font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded">
                Score: {currentProject.scoring.totalScore} / 100
              </span>
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded ${
                  currentProject.priorityLevel === 'Crítica'
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {currentProject.priorityLevel}
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-1">{currentProject.tagline}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono mt-2">
              <span>Categoria: <strong className="text-slate-200 font-normal">{currentProject.category}</strong></span>
              <span>·</span>
              <span>Velocidade: <strong className="text-emerald-400 font-normal">{currentProject.speedCategory === '7_days' ? 'Até 7 Dias' : currentProject.speedCategory === '30_days' ? 'Até 30 Dias' : 'Até 90 Dias'}</strong></span>
              <span>·</span>
              <span>Estado: <strong className="text-slate-200 font-normal">{currentProject.status}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Scenario toggle for this project */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded">
              {(['conservative', 'realistic', 'optimistic'] as ScenarioType[]).map((sc) => (
                <button
                  key={sc}
                  onClick={() => setActiveScenario(sc)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded capitalize ${
                    activeScenario === sc
                      ? 'bg-emerald-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sc === 'conservative' ? 'Cons.' : sc === 'realistic' ? 'Real.' : 'Otim.'}
                </button>
              ))}
            </div>

            <button
              onClick={handleRunAiAudit}
              disabled={aiAuditing}
              className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {aiAuditing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>A Auditar...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auditar com IA</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Audit Live Drawer / Banner if present */}
        {aiAuditResult && (
          <div className="mt-5 p-4 bg-slate-950 border border-emerald-500/40 rounded-lg text-slate-200 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Auditoria Financeira Autônoma (Gemini Flash)
              </span>
              <button
                onClick={() => setAiAuditResult(null)}
                className="text-slate-400 hover:text-slate-200 font-mono text-[11px]"
              >
                Fechar
              </button>
            </div>
            <div className="prose prose-invert prose-xs max-w-none whitespace-pre-line leading-relaxed font-sans text-slate-300">
              {aiAuditResult}
            </div>
          </div>
        )}

        {/* Financial Metrics Strip for Active Scenario */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">
              Receita Mensal ({activeScenario})
            </span>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
              {formatEuro(s.monthlyRevenue)}
            </div>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              ARR: {formatEuro(s.annualRevenue)}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">
              Preço Médio / Ticket
            </span>
            <div className="text-lg font-bold font-mono text-white mt-0.5 tabular-nums">
              €{s.pricePerUnit}
            </div>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              {s.activeUnitsOrSubs} clientes / pedidos
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">
              Margem Bruta / COGS
            </span>
            <div className="text-lg font-bold font-mono text-emerald-300 mt-0.5 tabular-nums">
              {s.grossMarginPercent}%
            </div>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              COGS: {formatEuro(s.cogsMonthly)}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">
              Margem Líquida / OpEx
            </span>
            <div className="text-lg font-bold font-mono text-slate-200 mt-0.5 tabular-nums">
              {s.netMarginPercent}%
            </div>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              OpEx: {formatEuro(s.opexMonthly)}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">
              Unit Economics (CAC / LTV)
            </span>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
              {s.ltvCacRatio}x
            </div>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              CAC €{s.cac} · LTV €{s.ltv}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">
              Break-Even & Payback
            </span>
            <div className="text-lg font-bold font-mono text-white mt-0.5 tabular-nums">
              {s.breakEvenUnits} <span className="text-xs font-normal text-slate-400">unid.</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              Payback: {s.paybackMonths} meses
            </span>
          </div>
        </div>

        {/* 0-100 Financial Scoring Rubric Breakdown */}
        <div className="mt-6 bg-slate-950 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">
              Composição da Pontuação Financeira (0 a 100 Pontos)
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              Total: {currentProject.scoring.totalScore} / 100
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">
                Receita (máx 25)
              </span>
              <div className="text-base font-bold font-mono text-white mt-0.5 tabular-nums">
                {currentProject.scoring.revenuePotential} / 25
              </div>
            </div>

            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">
                Margem (máx 20)
              </span>
              <div className="text-base font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
                {currentProject.scoring.profitMargin} / 20
              </div>
            </div>

            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">
                Velocidade (máx 20)
              </span>
              <div className="text-base font-bold font-mono text-cyan-400 mt-0.5 tabular-nums">
                {currentProject.scoring.speedToRevenue} / 20
              </div>
            </div>

            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">
                Procura (máx 15)
              </span>
              <div className="text-base font-bold font-mono text-slate-200 mt-0.5 tabular-nums">
                {currentProject.scoring.marketDemand} / 15
              </div>
            </div>

            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">
                Custo Impl. (máx 10)
              </span>
              <div className="text-base font-bold font-mono text-emerald-300 mt-0.5 tabular-nums">
                {currentProject.scoring.implementationCost} / 10
              </div>
            </div>

            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">
                Recorrente (máx 10)
              </span>
              <div className="text-base font-bold font-mono text-amber-300 mt-0.5 tabular-nums">
                {currentProject.scoring.recurringRevenue} / 10
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-3 font-sans border-t border-slate-800 pt-2.5">
            <strong className="text-emerald-400 font-mono text-[11px]">Fundamentação do Analista:</strong>{' '}
            {currentProject.scoring.rationale}
          </p>
        </div>

        {/* 4 Analytical Quadrants (Facts, Assumptions, Missing Info, Risks) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* 1. Factos Verificados */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
            <h4 className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              {t.factsHeader}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {currentProject.verifiedFacts.map((fact, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Premissas e Estimativas */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
            <h4 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              {t.assumptionsHeader}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {currentProject.assumptions.map((assump, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">~</span>
                  <span>{assump}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Informações em Falta a Verificar */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
            <h4 className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              {t.missingInfoHeader}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {currentProject.missingInformation.map((info, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">?</span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Riscos Financeiros Críticos */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
            <h4 className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              {t.risksHeader}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {currentProject.risks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">!</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Monetization Models Evaluated for this Project */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <h3 className="text-sm font-semibold text-white tracking-tight mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Modelos de Monetização Avaliados & Recomendação do Analista
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {currentProject.monetizationStrategies.map((strat, i) => (
              <div
                key={i}
                className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                        strat.recommendationGrade === 'Highly Recommended'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : strat.recommendationGrade === 'Recommended'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {strat.recommendationGrade === 'Highly Recommended'
                        ? 'Altamente Recomendado'
                        : strat.recommendationGrade === 'Recommended'
                        ? 'Recomendado'
                        : 'Secundário'}
                    </span>
                    <span className="text-emerald-400 font-mono text-[11px]">
                      {strat.marginProfile}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-100">{strat.model}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {strat.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-300">
                  Preço Alvo: <strong className="text-white font-normal">{strat.targetPrice}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
