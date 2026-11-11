import React, { useState } from 'react';
import { PortfolioProject, LanguageCode, OpportunityScoreDetail } from '../types/finance';
import { TRANSLATIONS } from '../data/translations';
import { computeOpportunityScore, formatEuro } from '../utils/financialCalculations';
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  PlusCircle,
  HelpCircle,
  Sliders,
  DollarSign,
  Layers,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface ScoringTabProps {
  projects: PortfolioProject[];
  onAddCustomProject: (project: PortfolioProject) => void;
  language: LanguageCode;
}

export const ScoringTab: React.FC<ScoringTabProps> = ({
  projects,
  onAddCustomProject,
  language,
}) => {
  const t = TRANSLATIONS[language];

  // New Opportunity State
  const [pitchName, setPitchName] = useState('');
  const [pitchCategory, setPitchCategory] = useState<'SaaS & AI' | 'Hospitality Tech' | 'Marketplace' | 'Direct Operations (Lisbon)' | 'Web3 & RWA'>('SaaS & AI');
  const [pitchTagline, setPitchTagline] = useState('');
  const [targetPrice, setTargetPrice] = useState(250);
  const [estimatedCogs, setEstimatedCogs] = useState(35);
  const [speedDays, setSpeedDays] = useState(15);

  // 6 Scoring Sliders
  const [revScore, setRevScore] = useState(20); // 0-25
  const [marginScore, setMarginScore] = useState(18); // 0-20
  const [speedScore, setSpeedScore] = useState(17); // 0-20
  const [demandScore, setDemandScore] = useState(12); // 0-15
  const [costScore, setCostScore] = useState(8); // 0-10
  const [recurringScore, setRecurringScore] = useState(8); // 0-10

  const [aiAuditing, setAiAuditing] = useState(false);
  const [aiAuditResult, setAiAuditResult] = useState<string | null>(null);
  const [verifiedFactsInput, setVerifiedFactsInput] = useState('Validação preliminar de procura em fóruns B2B');
  const [assumptionsInput, setAssumptionsInput] = useState('CAC estimado em 30% do primeiro mês de faturação');

  const liveScore = computeOpportunityScore(
    revScore,
    marginScore,
    speedScore,
    demandScore,
    costScore,
    recurringScore
  );

  const handleAuditPitchWithAi = async () => {
    if (!pitchName) {
      alert('Por favor introduza o nome da oportunidade antes de auditar.');
      return;
    }
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
            name: pitchName,
            category: pitchCategory,
            tagline: pitchTagline,
            pricing: targetPrice,
            unitCost: estimatedCogs,
            speedToRevenueDays: speedDays,
            scores: liveScore,
            verifiedFacts: [verifiedFactsInput],
            assumptions: [assumptionsInput],
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAiAuditResult(data.analysis);
      } else {
        setAiAuditResult('Auditoria concluída com base nos parâmetros padrão.');
      }
    } catch (err: any) {
      setAiAuditResult(`Erro ao comunicar com a inteligência financeira: ${err.message}`);
    } finally {
      setAiAuditing(false);
    }
  };

  const handleSaveToPortfolio = () => {
    if (!pitchName.trim()) {
      alert('Por favor introduza o nome da oportunidade.');
      return;
    }

    const calculatedGrossMargin = Math.round(((targetPrice - estimatedCogs) / targetPrice) * 100);
    const speedCat = speedDays <= 7 ? '7_days' : speedDays <= 30 ? '30_days' : '90_days';

    const newProject: PortfolioProject = {
      id: `custom-${Date.now()}`,
      name: pitchName,
      tagline: pitchTagline || 'Oportunidade adicionada via pontuação financeira autónoma',
      category: pitchCategory,
      coreModel: `Preço Base €${targetPrice} / unidade`,
      status: 'Active Testing',
      priorityLevel: liveScore.totalScore >= 85 ? 'Crítica' : liveScore.totalScore >= 70 ? 'Alta' : 'Média',
      speedCategory: speedCat,
      scenarios: {
        conservative: {
          pricePerUnit: targetPrice * 0.9,
          activeUnitsOrSubs: 15,
          monthlyRevenue: Math.round(targetPrice * 0.9 * 15),
          annualRevenue: Math.round(targetPrice * 0.9 * 15 * 12),
          cogsMonthly: Math.round(estimatedCogs * 15),
          opexMonthly: 500,
          grossMarginPercent: calculatedGrossMargin,
          netMarginPercent: Math.max(10, calculatedGrossMargin - 25),
          cac: Math.round(targetPrice * 0.8),
          ltv: Math.round(targetPrice * 3),
          ltvCacRatio: 3.75,
          paybackMonths: 2.5,
          breakEvenUnits: 6,
          speedToFirstRevenueDays: speedDays + 7,
        },
        realistic: {
          pricePerUnit: targetPrice,
          activeUnitsOrSubs: 40,
          monthlyRevenue: Math.round(targetPrice * 40),
          annualRevenue: Math.round(targetPrice * 40 * 12),
          cogsMonthly: Math.round(estimatedCogs * 40),
          opexMonthly: 900,
          grossMarginPercent: calculatedGrossMargin,
          netMarginPercent: Math.max(15, calculatedGrossMargin - 18),
          cac: Math.round(targetPrice * 0.6),
          ltv: Math.round(targetPrice * 4.5),
          ltvCacRatio: 7.5,
          paybackMonths: 1.2,
          breakEvenUnits: 10,
          speedToFirstRevenueDays: speedDays,
        },
        optimistic: {
          pricePerUnit: targetPrice * 1.15,
          activeUnitsOrSubs: 90,
          monthlyRevenue: Math.round(targetPrice * 1.15 * 90),
          annualRevenue: Math.round(targetPrice * 1.15 * 90 * 12),
          cogsMonthly: Math.round(estimatedCogs * 0.9 * 90),
          opexMonthly: 1500,
          grossMarginPercent: calculatedGrossMargin + 5,
          netMarginPercent: Math.max(25, calculatedGrossMargin - 12),
          cac: Math.round(targetPrice * 0.45),
          ltv: Math.round(targetPrice * 6),
          ltvCacRatio: 13.3,
          paybackMonths: 0.8,
          breakEvenUnits: 15,
          speedToFirstRevenueDays: Math.max(1, speedDays - 5),
        },
      },
      scoring: liveScore,
      verifiedFacts: [verifiedFactsInput],
      assumptions: [assumptionsInput],
      missingInformation: ['Validação contratual inicial de clientes piloto'],
      risks: ['Risco de ciclo de vendas mais longo do que o estimado'],
      monetizationStrategies: [
        {
          model: 'Modelo Principal Adotado',
          description: `Venda direta ou subscrição a €${targetPrice}.`,
          targetPrice: `€${targetPrice}`,
          marginProfile: `${calculatedGrossMargin}% Margem Estimada`,
          recommendationGrade: 'Highly Recommended',
        },
      ],
      operationalRisk: Math.min(90, Math.max(15, Math.round((10 - costScore) * 6 + (speedDays > 30 ? 25 : 10)))),
      operationalRiskFactors: [
        'Curva de adoção inicial de clientes',
        'Tempo de validação do canal de aquisição (CAC)',
      ],
      crossSellingSynergies: [
        'Explorar sinergias de distribuição com os ativos existentes do portfólio.',
      ],
    };

    onAddCustomProject(newProject);
    alert(`Oportunidade "${pitchName}" adicionada com sucesso ao portfólio ativo!`);
    setPitchName('');
    setPitchTagline('');
  };

  return (
    <div className="space-y-8">
      {/* Introduction & Rubric Definition */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
        <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          Sistema de Pontuação de Oportunidades Financeiras (0 a 100 Pontos)
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-4xl">
          Conforme a metodologia do Agent 05, nenhuma ideia é avaliada por entusiasmo ou complexidade técnica, mas sim pela capacidade real de gerar receita rápida, margens robustas e sustentabilidade financeira.
        </p>

        {/* The 6 Exact Criteria Rubric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 text-xs font-mono">
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">1. Potencial de Receita</span>
            <div className="text-emerald-400 font-bold mt-0.5">25 Pontos máx.</div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">2. Margem de Lucro</span>
            <div className="text-emerald-400 font-bold mt-0.5">20 Pontos máx.</div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">3. Velocidade p/ 1º Euro</span>
            <div className="text-emerald-400 font-bold mt-0.5">20 Pontos máx.</div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">4. Procura de Mercado</span>
            <div className="text-emerald-400 font-bold mt-0.5">15 Pontos máx.</div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">5. Custo de Impl.</span>
            <div className="text-emerald-400 font-bold mt-0.5">10 Pontos máx.</div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">6. Recorrência (MRR)</span>
            <div className="text-emerald-400 font-bold mt-0.5">10 Pontos máx.</div>
          </div>
        </div>
      </div>

      {/* Interactive Scoring Station for New Pitch */}
      <div className="bg-slate-900 border border-emerald-500/30 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              Avaliar & Pontuar Nova Oportunidade ou Pitch
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Submeta qualquer nova oportunidade descoberta pela equipa para cálculo imediato de pontuação e parecer de viabilidade.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">
                Pontuação Calculada
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {liveScore.totalScore}{' '}
                <span className="text-xs font-normal text-slate-400">/ 100</span>
              </div>
            </div>

            <button
              onClick={handleSaveToPortfolio}
              className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors whitespace-nowrap"
            >
              Adicionar ao Portfólio
            </button>
          </div>
        </div>

        {/* Form Inputs for the Opportunity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-xs text-slate-300 font-mono block mb-1">
              Nome da Oportunidade / Produto
            </label>
            <input
              type="text"
              placeholder="Ex: AI Voice Agent para Clínicas Dentárias"
              value={pitchName}
              onChange={(e) => setPitchName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-mono block mb-1">
              Categoria Estratégica
            </label>
            <select
              value={pitchCategory}
              onChange={(e) => setPitchCategory(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="SaaS & AI">SaaS & AI</option>
              <option value="Hospitality Tech">Hospitality Tech</option>
              <option value="Marketplace">Marketplace</option>
              <option value="Direct Operations (Lisbon)">Direct Operations (Lisbon)</option>
              <option value="Web3 & RWA">Web3 & RWA</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-mono block mb-1">
              Resumo Comercial (Tagline)
            </label>
            <input
              type="text"
              placeholder="Ex: Atendimento telefónico autónomo para marcação de consultas 24/7"
              value={pitchTagline}
              onChange={(e) => setPitchTagline(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-mono block mb-1">
              Preço Alvo / Ticket (€)
            </label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-mono block mb-1">
              Custo Variável Unitário Estimado (€)
            </label>
            <input
              type="number"
              value={estimatedCogs}
              onChange={(e) => setEstimatedCogs(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-mono block mb-1">
              Velocidade Estimada p/ 1º Euro (Dias)
            </label>
            <input
              type="number"
              value={speedDays}
              onChange={(e) => setSpeedDays(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* 6 Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 bg-slate-950 p-4 rounded-lg border border-slate-800">
          {/* 1. Revenue Potential (0-25) */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300">1. Potencial de Receita</span>
              <span className="text-emerald-400 font-bold">{revScore} / 25 pts</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              value={revScore}
              onChange={(e) => setRevScore(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          {/* 2. Profit Margin (0-20) */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300">2. Margem de Lucro</span>
              <span className="text-emerald-400 font-bold">{marginScore} / 20 pts</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={marginScore}
              onChange={(e) => setMarginScore(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          {/* 3. Speed to Revenue (0-20) */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300">3. Velocidade de Entrada</span>
              <span className="text-cyan-400 font-bold">{speedScore} / 20 pts</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={speedScore}
              onChange={(e) => setSpeedScore(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* 4. Market Demand (0-15) */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300">4. Procura Comprovada</span>
              <span className="text-slate-200 font-bold">{demandScore} / 15 pts</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              value={demandScore}
              onChange={(e) => setDemandScore(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-slate-300"
            />
          </div>

          {/* 5. Implementation Cost (0-10) */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300">5. Baixo Custo Inicial</span>
              <span className="text-emerald-300 font-bold">{costScore} / 10 pts</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={costScore}
              onChange={(e) => setCostScore(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-300"
            />
          </div>

          {/* 6. Recurring Revenue (0-10) */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300">6. Recorrência (MRR/ARR)</span>
              <span className="text-amber-400 font-bold">{recurringScore} / 10 pts</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={recurringScore}
              onChange={(e) => setRecurringScore(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>

        {/* Verified Facts vs Assumptions Verification Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-xs text-slate-300 font-mono block mb-1">
              Factos Verificados (O que sabemos com certeza)
            </label>
            <input
              type="text"
              value={verifiedFactsInput}
              onChange={(e) => setVerifiedFactsInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 font-mono block mb-1">
              Premissas e Estimativas (O que requer validação)
            </label>
            <input
              type="text"
              value={assumptionsInput}
              onChange={(e) => setAssumptionsInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* AI Audit Action */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            {liveScore.rationale}
          </p>
          <button
            onClick={handleAuditPitchWithAi}
            disabled={aiAuditing}
            className="px-3.5 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 rounded hover:bg-emerald-900/60 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {aiAuditing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>A Auditar Viabilidade...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auditar com Gemini Flash</span>
              </>
            )}
          </button>
        </div>

        {/* AI Audit Output */}
        {aiAuditResult && (
          <div className="mt-4 p-4 bg-slate-950 border border-emerald-500/40 rounded-lg text-slate-200 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Parecer de Viabilidade Financeira para a Oportunidade
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
      </div>

      {/* Existing Portfolio Ranking Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Classificação Oficial das Oportunidades do Portfólio (Ranking 0 a 100)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Projeto</th>
                <th className="py-3 px-4 text-center">Score Total</th>
                <th className="py-3 px-4 text-center">Receita (25)</th>
                <th className="py-3 px-4 text-center">Margem (20)</th>
                <th className="py-3 px-4 text-center">Velocidade (20)</th>
                <th className="py-3 px-4 text-center">Procura (15)</th>
                <th className="py-3 px-4 text-center">Custo (10)</th>
                <th className="py-3 px-4 text-center">MRR (10)</th>
                <th className="py-3 px-4">Classificação Estratégica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {[...projects]
                .sort((a, b) => b.scoring.totalScore - a.scoring.totalScore)
                .map((proj, idx) => (
                  <tr key={proj.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                      <span className="font-mono text-slate-500 w-4">{idx + 1}.</span>
                      <div>
                        <div>{proj.name}</div>
                        <span className="text-[10px] text-slate-400">{proj.category}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono font-bold text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                        {proj.scoring.totalScore}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{proj.scoring.revenuePotential}</td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-400">{proj.scoring.profitMargin}</td>
                    <td className="py-3 px-4 text-center font-mono text-cyan-400">{proj.scoring.speedToRevenue}</td>
                    <td className="py-3 px-4 text-center font-mono">{proj.scoring.marketDemand}</td>
                    <td className="py-3 px-4 text-center font-mono">{proj.scoring.implementationCost}</td>
                    <td className="py-3 px-4 text-center font-mono text-amber-400">{proj.scoring.recurringRevenue}</td>
                    <td className="py-3 px-4 text-slate-300 text-[11px] max-w-sm">
                      {proj.scoring.rationale}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
