import React, { useState } from 'react';
import { PortfolioProject, ScenarioType, LanguageCode } from '../types/finance';
import { TRANSLATIONS } from '../data/translations';
import { formatEuro } from '../utils/financialCalculations';
import {
  ShieldAlert,
  TrendingUp,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  Info,
  Sliders,
  Filter,
} from 'lucide-react';

interface FinancialRiskMatrixProps {
  projects: PortfolioProject[];
  scenario: ScenarioType;
  language: LanguageCode;
  onSelectProject: (projectId: string) => void;
  onNavigateToPortfolio: () => void;
}

export const FinancialRiskMatrix: React.FC<FinancialRiskMatrixProps> = ({
  projects,
  scenario,
  language,
  onSelectProject,
  onNavigateToPortfolio,
}) => {
  const t = TRANSLATIONS[language];
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ai-hotel-concierge');
  const [filterMode, setFilterMode] = useState<'all' | 'q1' | 'immediate'>('all');

  // Active inspected project (hovered or selected)
  const activeProjectId = hoveredProjectId || selectedNodeId;
  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0];

  // SVG coordinate canvas constants
  const svgWidth = 760;
  const svgHeight = 440;
  const padding = { top: 45, right: 55, bottom: 55, left: 65 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Revenue potential normalization:
  // We map scoring.revenuePotential (0 to 25) + monthly revenue magnitude to 0-100%
  const getProjectCoordinates = (proj: PortfolioProject) => {
    // X axis: Operational Risk (0 to 100)
    // Low risk (left) to High risk (right)
    const risk = proj.operationalRisk ?? 35;
    const x = padding.left + (risk / 100) * plotWidth;

    // Y axis: Revenue Potential (0 to 100)
    // Map revenue potential score (15 to 25) with MRR scaling
    const revScore = proj.scoring.revenuePotential; // max 25
    const normalizedYPercent = Math.min(
      96,
      Math.max(12, ((revScore - 12) / (25 - 12)) * 80 + (proj.scenarios[scenario].grossMarginPercent > 80 ? 15 : 5))
    );
    // In SVG, Y=0 is at top, so higher revenue means lower Y coordinate
    const y = padding.top + plotHeight - (normalizedYPercent / 100) * plotHeight;

    return { x, y, risk, normalizedYPercent };
  };

  const getQuadrant = (risk: number, yPercent: number) => {
    const isHighReward = yPercent >= 50;
    const isLowRisk = risk <= 50;
    if (isHighReward && isLowRisk) return 'Q1';
    if (isHighReward && !isLowRisk) return 'Q2';
    if (!isHighReward && isLowRisk) return 'Q3';
    return 'Q4';
  };

  const isHighlighted = (proj: PortfolioProject) => {
    if (filterMode === 'all') return true;
    if (filterMode === 'immediate') return proj.speedCategory === '7_days';
    if (filterMode === 'q1') {
      const coords = getProjectCoordinates(proj);
      return getQuadrant(coords.risk, coords.normalizedYPercent) === 'Q1';
    }
    return true;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 sm:p-6 space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              {t.riskMatrixTitle}
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
              Ferramenta Decisória do CEO
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            {t.riskMatrixSubtitle}
          </p>
        </div>

        {/* Segmented Filter for Risk Matrix */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-md shrink-0 text-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap ${
              filterMode === 'all'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos os Ativos ({projects.length})
          </button>
          <button
            onClick={() => setFilterMode('q1')}
            className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
              filterMode === 'q1'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Alto Retorno & Baixo Risco (Q1)</span>
          </button>
          <button
            onClick={() => setFilterMode('immediate')}
            className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
              filterMode === 'immediate'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Liquidez a 7 Dias</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Scatter Matrix + Active Inspector Card */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        {/* SVG Scatter Chart Area (8 cols on XL) */}
        <div className="xl:col-span-8 bg-slate-950 border border-slate-800/90 rounded-lg p-3 sm:p-4 relative flex flex-col justify-between overflow-hidden">
          {/* Top Axis Badge Indicator */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1 px-2">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              &uarr; {t.axisRevenuePotential}
            </span>
            <span className="text-slate-500">
              Cenário: <strong className="text-slate-300 uppercase">{scenario}</strong>
            </span>
          </div>

          <div className="w-full aspect-[19/11] relative">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-full select-none"
            >
              {/* Definitions for gradients and shadows */}
              <defs>
                <radialGradient id="q1Glow" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.09" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
                </radialGradient>
                <radialGradient id="q2Glow" cx="70%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.07" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.01" />
                </radialGradient>
                <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#10b981" floodOpacity="0.35" />
                </filter>
              </defs>

              {/* Quadrant 1: Top-Left (High Reward, Low Risk) */}
              <rect
                x={padding.left}
                y={padding.top}
                width={plotWidth / 2}
                height={plotHeight / 2}
                fill="url(#q1Glow)"
                className="transition-opacity"
              />
              {/* Quadrant 2: Top-Right (High Reward, High Risk) */}
              <rect
                x={padding.left + plotWidth / 2}
                y={padding.top}
                width={plotWidth / 2}
                height={plotHeight / 2}
                fill="url(#q2Glow)"
              />
              {/* Quadrant 3: Bottom-Left (Moderate Reward, Low Risk) */}
              <rect
                x={padding.left}
                y={padding.top + plotHeight / 2}
                width={plotWidth / 2}
                height={plotHeight / 2}
                fill="rgba(56, 189, 248, 0.015)"
              />
              {/* Quadrant 4: Bottom-Right (Low Reward, High Risk) */}
              <rect
                x={padding.left + plotWidth / 2}
                y={padding.top + plotHeight / 2}
                width={plotWidth / 2}
                height={plotHeight / 2}
                fill="rgba(244, 63, 94, 0.02)"
              />

              {/* Grid Lines */}
              {/* Vertical Midpoint Divider (50% Operational Risk) */}
              <line
                x1={padding.left + plotWidth / 2}
                y1={padding.top}
                x2={padding.left + plotWidth / 2}
                y2={padding.top + plotHeight}
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {/* Horizontal Midpoint Divider (50% Revenue Potential) */}
              <line
                x1={padding.left}
                y1={padding.top + plotHeight / 2}
                x2={padding.left + plotWidth}
                y2={padding.top + plotHeight / 2}
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Outer plot border */}
              <rect
                x={padding.left}
                y={padding.top}
                width={plotWidth}
                height={plotHeight}
                fill="none"
                stroke="#1e293b"
                strokeWidth="1"
              />

              {/* Quadrant Text Labels in Background */}
              {/* Q1 Label */}
              <g className="pointer-events-none">
                <text
                  x={padding.left + 14}
                  y={padding.top + 22}
                  fill="#10b981"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  fontWeight="bold"
                  letterSpacing="0.05em"
                >
                  Q1: ALTO RETORNO · BAIXO RISCO
                </text>
                <text
                  x={padding.left + 14}
                  y={padding.top + 36}
                  fill="#64748b"
                  fontSize="8.5"
                  fontFamily="sans-serif"
                >
                  Quick Wins · Liquidez Imediata (Prioridade CEO)
                </text>
              </g>

              {/* Q2 Label */}
              <g className="pointer-events-none">
                <text
                  x={padding.left + plotWidth / 2 + 14}
                  y={padding.top + 22}
                  fill="#f59e0b"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  fontWeight="bold"
                  letterSpacing="0.05em"
                >
                  Q2: ALTO RETORNO · ALTO RISCO
                </text>
                <text
                  x={padding.left + plotWidth / 2 + 14}
                  y={padding.top + 36}
                  fill="#64748b"
                  fontSize="8.5"
                  fontFamily="sans-serif"
                >
                  Apostas Estratégicas · Apenas Success-Fee
                </text>
              </g>

              {/* Q3 Label */}
              <g className="pointer-events-none">
                <text
                  x={padding.left + 14}
                  y={padding.top + plotHeight / 2 + 22}
                  fill="#38bdf8"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  fontWeight="bold"
                >
                  Q3: RETORNO BASE · BAIXO RISCO
                </text>
                <text
                  x={padding.left + 14}
                  y={padding.top + plotHeight / 2 + 36}
                  fill="#64748b"
                  fontSize="8.5"
                  fontFamily="sans-serif"
                >
                  Fluxo Contínuo Estável
                </text>
              </g>

              {/* Q4 Label */}
              <g className="pointer-events-none">
                <text
                  x={padding.left + plotWidth / 2 + 14}
                  y={padding.top + plotHeight / 2 + 22}
                  fill="#f43f5e"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  fontWeight="bold"
                >
                  Q4: BAIXO RETORNO · ALTO RISCO
                </text>
                <text
                  x={padding.left + plotWidth / 2 + 14}
                  y={padding.top + plotHeight / 2 + 36}
                  fill="#64748b"
                  fontSize="8.5"
                  fontFamily="sans-serif"
                >
                  Armadilhas de Capital · Despriorizar
                </text>
              </g>

              {/* Project Scatter Nodes */}
              {projects.map((proj) => {
                const { x, y, risk, normalizedYPercent } = getProjectCoordinates(proj);
                const isSelected = proj.id === activeProjectId;
                const matchesFilter = isHighlighted(proj);
                const isQ1 = getQuadrant(risk, normalizedYPercent) === 'Q1';
                const isQ2 = getQuadrant(risk, normalizedYPercent) === 'Q2';

                // Node size proportional to revenue
                const nodeRadius = proj.speedCategory === '7_days' ? 18 : isQ1 ? 20 : 17;

                // Color theme
                const nodeColor = isQ1
                  ? '#10b981'
                  : isQ2
                  ? '#f59e0b'
                  : '#38bdf8';

                return (
                  <g
                    key={proj.id}
                    className="cursor-pointer transition-all duration-200"
                    opacity={matchesFilter ? 1 : 0.22}
                    onClick={() => {
                      setSelectedNodeId(proj.id);
                      onSelectProject(proj.id);
                    }}
                    onMouseEnter={() => setHoveredProjectId(proj.id)}
                    onMouseLeave={() => setHoveredProjectId(null)}
                  >
                    {/* Pulsing ring for top priority projects (AI Concierge or Breakfast LX) */}
                    {(proj.id === 'ai-hotel-concierge' || proj.id === 'breakfast-in-bed-lx') && (
                      <circle
                        cx={x}
                        cy={y}
                        r={nodeRadius + 7}
                        fill="none"
                        stroke={nodeColor}
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        opacity={0.6}
                      />
                    )}

                    {/* Outer selection halo */}
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r={nodeRadius + 5}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2"
                        filter="url(#nodeGlow)"
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={nodeRadius}
                      fill={isSelected ? nodeColor : '#0f172a'}
                      stroke={nodeColor}
                      strokeWidth={isSelected ? 2.5 : 2}
                    />

                    {/* Inside Node Icon / Acronym */}
                    <text
                      x={x}
                      y={y + 3.5}
                      textAnchor="middle"
                      fill={isSelected ? '#020617' : '#ffffff'}
                      fontSize={proj.id === 'ai-hotel-concierge' ? '9' : '9.5'}
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      {proj.id === 'breakfast-in-bed-lx'
                        ? 'LX'
                        : proj.id === 'ai-hotel-concierge'
                        ? 'HOTEL'
                        : proj.id === 'ai-tourguide-creator'
                        ? 'GUIDE'
                        : proj.id === 'nexus-ai-store'
                        ? 'NEXUS'
                        : 'RWA'}
                    </text>

                    {/* Node Label Below */}
                    <text
                      x={x}
                      y={y + nodeRadius + 14}
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : '#94a3b8'}
                      fontSize="9.5"
                      fontFamily="sans-serif"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                    >
                      {proj.name}
                    </text>

                    {/* Score pill or revenue tag */}
                    <text
                      x={x}
                      y={y + nodeRadius + 24}
                      textAnchor="middle"
                      fill={nodeColor}
                      fontSize="8.5"
                      fontFamily="JetBrains Mono"
                    >
                      {formatEuro(proj.scenarios[scenario].monthlyRevenue)}/mês
                    </text>
                  </g>
                );
              })}

              {/* Bottom Horizontal Axis Label */}
              <text
                x={padding.left + plotWidth / 2}
                y={svgHeight - 12}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="10"
                fontFamily="JetBrains Mono"
                letterSpacing="0.05em"
              >
                &larr; BAIXO RISCO OPERACIONAL (0%) ······ ALTO RISCO OPERACIONAL (100%) &rarr;
              </text>
            </svg>
          </div>
        </div>

        {/* Executive Inspector Card for the Active Project (4 cols on XL) */}
        <div className="xl:col-span-4 bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            {/* Quadrant Badge Header */}
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-[10px] text-slate-400 uppercase">
                Posicionamento do Ativo
              </span>
              {(() => {
                const coords = getProjectCoordinates(activeProject);
                const q = getQuadrant(coords.risk, coords.normalizedYPercent);
                return (
                  <span
                    className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                      q === 'Q1'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : q === 'Q2'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {q === 'Q1'
                      ? '⭐ Q1: Alto Retorno, Baixo Risco'
                      : q === 'Q2'
                      ? '⚠️ Q2: Alto Retorno, Alto Risco'
                      : 'ℹ️ Q3/Q4: Fluxo Secundário'}
                  </span>
                );
              })()}
            </div>

            <h4 className="text-base font-bold text-white tracking-tight">
              {activeProject.name}
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {activeProject.tagline}
            </p>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block uppercase">
                  Receita Mensal ({scenario})
                </span>
                <span className="text-emerald-400 font-bold text-sm tabular-nums">
                  {formatEuro(activeProject.scenarios[scenario].monthlyRevenue)}
                </span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block uppercase">
                  Margem Bruta
                </span>
                <span className="text-white font-bold text-sm tabular-nums">
                  {activeProject.scenarios[scenario].grossMarginPercent}%
                </span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block uppercase">
                  Risco Operacional
                </span>
                <span className={`font-bold text-sm tabular-nums ${
                  (activeProject.operationalRisk ?? 35) <= 35
                    ? 'text-emerald-400'
                    : (activeProject.operationalRisk ?? 35) <= 60
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}>
                  {activeProject.operationalRisk ?? 35} / 100
                </span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block uppercase">
                  Velocidade p/ Caixa
                </span>
                <span className="text-cyan-400 font-bold text-sm">
                  {activeProject.speedCategory === '7_days'
                    ? '≤ 7 Dias'
                    : activeProject.speedCategory === '30_days'
                    ? '≤ 30 Dias'
                    : '≤ 90 Dias'}
                </span>
              </div>
            </div>

            {/* Operational Friction & Risk Factors */}
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                Fatores de Risco Operacional Auditados:
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {(activeProject.operationalRiskFactors || activeProject.risks.slice(0, 3)).map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] leading-tight">
                    <span className="text-emerald-400 font-bold shrink-0">·</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strategic Recommendation */}
            <div className="mt-4 p-2.5 bg-slate-900/80 rounded border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
              <strong className="text-emerald-400 font-mono block mb-0.5">
                Recomendação para o CEO:
              </strong>
              {activeProject.id === 'ai-hotel-concierge'
                ? 'Ativo prioritário com maior valorização de longo prazo (ARR de €163k+ e retenção B2B de 18x LTV/CAC). Ativar prospeção imediatamente.'
                : activeProject.id === 'breakfast-in-bed-lx'
                ? 'Campeão de fluxo de caixa em 7 dias. Operação comprovada em Lisboa com recebimento no ato e margem de 65%. Iniciar vendas no próximo fim-de-semana.'
                : activeProject.id === 'ai-tourguide-creator'
                ? 'Produto de software puro com margem bruta de 90%. Empacotar no AI Hotel Concierge para anular o CAC de turistas.'
                : activeProject.id === 'nexus-ai-store'
                ? 'Marketplace digital com 20% de take-rate. Escalar à medida que novos criadores e agências se associam.'
                : 'Não alocar liquidez da tesouraria central em licenças MiCA ou custódia física de ouro/prata. Estruturar exclusivamente em regime de success-fee.'}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => {
                onSelectProject(activeProject.id);
                onNavigateToPortfolio();
              }}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Abrir Ficha Completa deste Ativo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* CEO Strategic Takeaway Bottom Banner */}
      <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
            05
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            <strong className="text-white">Parecer Financeiro Executivo:</strong> O quadrante de{' '}
            <span className="text-emerald-400 font-bold">Alto Retorno e Baixo Risco (Q1)</span> reúne{' '}
            <strong className="text-emerald-300">AI Hotel Concierge</strong> e{' '}
            <strong className="text-emerald-300">Breakfast in Bed LX</strong>. A recomendação do Finance Agent é concentrar 90% da execução imediata nestes dois motores para atingir fluxo de caixa positivo a 7 e 30 dias.
          </p>
        </div>
        <button
          onClick={() => {
            onSelectProject('ai-hotel-concierge');
            onNavigateToPortfolio();
          }}
          className="text-xs text-emerald-400 hover:text-emerald-300 font-mono whitespace-nowrap shrink-0 underline"
        >
          Examinar Q1 &rarr;
        </button>
      </div>
    </div>
  );
};
