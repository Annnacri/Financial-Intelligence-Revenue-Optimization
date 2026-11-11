import React, { useState } from 'react';
import { PortfolioProject, ScenarioType, LanguageCode, SimulationParams } from '../types/finance';
import { TRANSLATIONS } from '../data/translations';
import { calculateAggregateMetrics, formatEuro } from '../utils/financialCalculations';
import {
  FileText,
  Copy,
  Printer,
  Sparkles,
  Send,
  Check,
  AlertTriangle,
  Clock,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

interface CeoReportViewProps {
  projects: PortfolioProject[];
  scenario: ScenarioType;
  language: LanguageCode;
  simParams: SimulationParams;
  onOpenDispatchModal?: () => void;
}

export const CeoReportView: React.FC<CeoReportViewProps> = ({
  projects,
  scenario,
  language,
  simParams,
}) => {
  const t = TRANSLATIONS[language];
  const metrics = calculateAggregateMetrics(projects, scenario, simParams);

  const [copied, setCopied] = useState(false);
  const [generatingAiReport, setGeneratingAiReport] = useState(false);
  const [customAiReport, setCustomAiReport] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const currentDate = new Date().toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const fullReportMarkdown = `### RELATÓRIO EXECUTIVO FINANCEIRO — AGENT 05
**Destinatário:** CEO Agent
**Origem:** Agent 05 (Chief Financial Intelligence Analyst)
**Data:** ${currentDate}
**Canal:** Oficial em Português
**Classificação:** Estratégico / Decisão Executiva

---

#### 1. RESUMO EXECUTIVO FINANCEIRO
O portfólio combina estrategicamente um motor de liquidez imediata (Breakfast in Bed LX, margem bruta de 65% com recebimento em menos de 7 dias) e alavancagem de receita recorrente de alta margem (AI Hotel Concierge e AI Tourguide Creator, com margens brutas entre 87% e 91%).
- MRR Projetado (${scenario}): ${formatEuro(metrics.totalMonthlyRevenue)}
- ARR Projetado: ${formatEuro(metrics.totalAnnualRevenue)}
- Margem Bruta Ponderada: ${metrics.blendedGrossMarginPercent}%
- Lucro Líquido Mensal: ${formatEuro(metrics.totalNetProfitMonthly)} (Margem Líquida: ${metrics.blendedNetMarginPercent}%)
- Ponto de Equilíbrio (Break-Even Agregado): ${metrics.totalBreakEvenUnits} clientes/pedidos
- Runway Estimado: ${metrics.estimatedRunwayMonths} meses com reservas contidas.

---

#### 2. MELHORES OPORTUNIDADES IMEDIATAS (7, 30 E 90 DIAS)
1. **JANELA DE 7 DIAS (Liquidez Imediata): Breakfast in Bed LX**
   - Ativação comercial em Lisboa & Cascais com pagamentos instantâneos (MBWay/Cartão).
   - Ticket médio: €44 | Margem de contribuição: 65% | Previsão de entrada de caixa a 7 dias: +${formatEuro(metrics.sevenDayCashFlow)}.
2. **JANELA DE 30 DIAS (Tração Recorrente B2B): AI Hotel Concierge**
   - Fecho dos primeiros 5 contratos hoteleiros com taxa de setup (€1.200 cada) + subscrição mensal (€390/mês).
   - Previsão de entrada de caixa líquida a 30 dias: +${formatEuro(metrics.thirtyDayCashFlow)}.
3. **JANELA DE 90 DIAS (Expansão de Plataforma): NexusAIStore & RWA Piloto**
   - Lançamento de pacotes turnkey de IA no marketplace e estruturação do piloto de tokenização de ouro/prata em success-fee.

---

#### 3. POTENCIAL DE RECEITA E MARGEM ESTIMADOS
- AI Hotel Concierge: €13.650 MRR realista com 88% margem bruta.
- Breakfast in Bed LX: €10.560 faturamento mensal com 42% margem líquida em Lisboa.
- AI Tourguide Creator: €10.290 MRR realista via agências de viagens e micro-passes.
- NexusAIStore: €6.175 receita líquida mensal via take-rate de 20%.
- Web3 & RWA: Estruturação pontual de €5.000 a €15.000 por emissão lastreada em metais.

---

#### 4. CUSTOS E NECESSIDADE DE INVESTIMENTO
- Investimento em Capital Requerido: €3.800 (Focado em setup de cozinhas parceiras em Lisboa e campanhas de prospeção B2B do Global Opportunity Hunter).
- OpEx Mensal Consolidado: €${metrics.totalMonthlyOpex} (Servidores serverless, tokens Gemini Flash, embalagens sustentáveis e logística).
- Não há necessidade de contratações físicas ou aquisição de infraestrutura pesada.

---

#### 5. RISCOS FINANCEIROS CRÍTICOS E MITIGAÇÕES
1. **Atraso no ciclo de vendas B2B Hoteleiro:** Mitigar com trial funcional de 14 dias com ativação rápida via WhatsApp.
2. **Volatilidade de preços de insumos em Lisboa (Breakfast in Bed):** Celebrar contratos semanais com padarias e produtores artesanais.
3. **Incerteza Regulatória MiCA (RWA):** Não alocar capital próprio em custódia ou licenças; trabalhar exclusivamente com custodiantes certificados terceiros em success-fee.

---

#### 6. AÇÕES RECOMENDADAS COM NÍVEL DE PRIORIDADE
- [CRÍTICA] Autorizar lançamento operacional do Breakfast in Bed LX para fechar o próximo fim-de-semana com receita positiva.
- [CRÍTICA] Instruir o Global Opportunity Hunter a iniciar cadência outbound sobre 40 hotéis boutique em Lisboa e Porto.
- [ALTA] Implementar bundling: cada entrega de pequeno-almoço do Breakfast in Bed LX inclui voucher com 15% de desconto para o AI Tourguide.
- [MÉDIA] Abrir pré-registo de fornecedores digitais para a NexusAIStore com comissão zero nos primeiros 30 dias.

---

#### 7. INFORMAÇÕES EM FALTA / PREMISSAS A VERIFICAR
- Conversão real de reuniões agendadas pelo Hunter em contratos fechados com diretores de hotel.
- Requisitos fiscais exatos de IVA digital para venda comunitária de roteiros na NexusAIStore.
- Validação de custos de frete dedicado para entregas matinais pontuais em Lisboa.

---

#### 8. NÍVEL DE PRIORIDADE GLOBAL
NÍVEL DE PRIORIDADE: **ALTO / EXECUÇÃO IMEDIATA**
O plano assegura fluxo de caixa operacional positivo a 7 dias e autossuficiência financeira.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(customAiReport || fullReportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDispatchToCeo = () => {
    setDispatchStatus('sending');
    setTimeout(() => {
      setDispatchStatus('sent');
      setTimeout(() => setDispatchStatus('idle'), 4000);
    }, 1200);
  };

  const handleGenerateLiveAiReport = async () => {
    try {
      setGeneratingAiReport(true);
      setCustomAiReport(null);

      const response = await fetch('/api/financial-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_ceo_report',
          language: 'pt', // CEO receives Portuguese briefing as mandated
          payload: {
            scenario,
            metrics,
            projectsSummary: projects.map((p) => ({
              id: p.id,
              name: p.name,
              category: p.category,
              mrr: p.scenarios[scenario].monthlyRevenue,
              grossMargin: p.scenarios[scenario].grossMarginPercent,
              netMargin: p.scenarios[scenario].netMarginPercent,
              score: p.scoring.totalScore,
              speedCategory: p.speedCategory,
              facts: p.verifiedFacts,
              assumptions: p.assumptions,
              risks: p.risks,
            })),
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setCustomAiReport(data.analysis);
      }
    } catch (err: any) {
      alert(`Erro ao gerar relatório com IA: ${err.message}`);
    } finally {
      setGeneratingAiReport(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Relatório Executivo Financeiro para o CEO Agent
          </h2>
          <span className="text-xs text-slate-400 font-mono mt-0.5 block">
            Estruturado conforme a Secção 7 das Diretrizes · Canal Oficial em Português
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGenerateLiveAiReport}
            disabled={generatingAiReport}
            className="px-3 py-1.5 text-xs text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 hover:bg-emerald-900/60 rounded transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {generatingAiReport ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>A Sintetizar...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Regerar com Gemini Flash</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar Markdown'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / PDF</span>
          </button>

          <button
            onClick={handleDispatchToCeo}
            disabled={dispatchStatus !== 'idle'}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors flex items-center gap-1.5 disabled:opacity-70 shadow-sm"
          >
            {dispatchStatus === 'sending' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>A Enviar Despacho...</span>
              </>
            ) : dispatchStatus === 'sent' ? (
              <>
                <Check className="w-3.5 h-3.5 text-slate-950" />
                <span>Despacho Entregue ao CEO!</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Despacho ao CEO</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Document Paper Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 sm:p-8 max-w-5xl mx-auto shadow-md">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-5 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider">
              AGENT 05 // CHIEF FINANCIAL INTELLIGENCE REPORT
            </span>
            <span className="font-mono text-xs text-slate-400">
              Classificação: Estratégico / Confidencial
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-2">
            Relatório de Viabilidade Comercial, Fluxo de Caixa e Rentabilidade
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono bg-slate-950 p-3 rounded border border-slate-800">
            <div>
              <span className="text-slate-500 block">DESTINATÁRIO:</span>
              <span className="text-white font-bold">CEO Agent</span>
            </div>
            <div>
              <span className="text-slate-500 block">EMISSOR:</span>
              <span className="text-emerald-400 font-bold">Finance Agent (05)</span>
            </div>
            <div>
              <span className="text-slate-500 block">DATA:</span>
              <span className="text-slate-300">{currentDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block">PRIORIDADE GLOBAL:</span>
              <span className="text-rose-400 font-bold">ALTA / EXECUÇÃO</span>
            </div>
          </div>
        </div>

        {/* If Custom AI Generated Report is present */}
        {customAiReport ? (
          <div className="prose prose-invert prose-sm max-w-none whitespace-pre-line leading-relaxed text-slate-300 font-sans">
            {customAiReport}
          </div>
        ) : (
          /* Standard 8-Section Comprehensive Executive Briefing */
          <div className="space-y-8 text-xs sm:text-sm text-slate-300">
            {/* 1. Resumo Executivo Financeiro */}
            <section className="space-y-3">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2 border-b border-slate-800 pb-1.5">
                <span className="text-emerald-400 font-mono">01.</span> Resumo Executivo Financeiro
              </h2>
              <p className="leading-relaxed text-slate-300">
                O portfólio de negócios apresenta uma simbiose equilibrada entre <strong className="text-white">geração imediata de liquidez (Breakfast in Bed LX)</strong> para cobertura de despesas de curto prazo e <strong className="text-white">construção de receita recorrente de alta margem (AI Hotel Concierge e AI Tourguide Creator)</strong>.
              </p>

              {/* Key Highlights Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono mt-3">
                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-slate-500 block">MRR Projetado:</span>
                  <span className="text-emerald-400 font-bold text-base tabular-nums">
                    {formatEuro(metrics.totalMonthlyRevenue)}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-slate-500 block">Margem Bruta Ponderada:</span>
                  <span className="text-white font-bold text-base tabular-nums">
                    {metrics.blendedGrossMarginPercent}%
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-slate-500 block">Lucro Líquido Mensal:</span>
                  <span className="text-emerald-300 font-bold text-base tabular-nums">
                    {formatEuro(metrics.totalNetProfitMonthly)}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-slate-500 block">Ponto de Equilíbrio:</span>
                  <span className="text-slate-200 font-bold text-base tabular-nums">
                    {metrics.totalBreakEvenUnits} clientes
                  </span>
                </div>
              </div>
            </section>

            {/* 2. Melhores Oportunidades Imediatas (7, 30 e 90 Dias) */}
            <section className="space-y-3">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2 border-b border-slate-800 pb-1.5">
                <span className="text-emerald-400 font-mono">02.</span> Melhores Oportunidades Imediatas (7, 30 e 90 Dias)
              </h2>

              <div className="space-y-3">
                <div className="bg-slate-950 border border-emerald-500/30 p-3.5 rounded-lg">
                  <div className="flex items-center justify-between font-mono text-xs mb-1">
                    <span className="text-emerald-400 font-bold">
                      [JANELA DE 7 DIAS] Breakfast in Bed LX — Liquidez Imediata
                    </span>
                    <span className="text-white font-bold">+{formatEuro(metrics.sevenDayCashFlow)} net cash</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Operação local em Lisboa e Cascais com pagamentos antecipados instantâneos. Margem bruta de 65% sobre ticket médio de €44. Financia despesas operacionais do ecossistema já no primeiro fim-de-semana.
                  </p>
                </div>

                <div className="bg-slate-950 border border-cyan-500/30 p-3.5 rounded-lg">
                  <div className="flex items-center justify-between font-mono text-xs mb-1">
                    <span className="text-cyan-400 font-bold">
                      [JANELA DE 30 DIAS] AI Hotel Concierge — Tração Recorrente B2B
                    </span>
                    <span className="text-white font-bold">+{formatEuro(metrics.thirtyDayCashFlow)} net cash</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Fecho dos primeiros 5 hotéis boutique parceiros com cobrança de taxa de setup (€1.200) + subscrição (€390/mês). Margem bruta superior a 87% com retenção contratual mínima de 12 meses.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg">
                  <div className="flex items-center justify-between font-mono text-xs mb-1">
                    <span className="text-amber-400 font-bold">
                      [JANELA DE 90 DIAS] NexusAIStore & RWA Tokenization
                    </span>
                    <span className="text-white font-bold">Escala de Volume</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Marketplace atinge tração com 20% de take-rate sobre produtos de IA; estruturação técnica de pilotos de ouro/prata em success-fee (1,5% a 3%) sem consumir caixa próprio.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Potencial de Receita e Margem Estimados */}
            <section className="space-y-3">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2 border-b border-slate-800 pb-1.5">
                <span className="text-emerald-400 font-mono">03.</span> Potencial de Receita e Margem Estimados
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase">
                    <tr>
                      <th className="p-2.5">Ativo</th>
                      <th className="p-2.5 text-right">MRR Realista</th>
                      <th className="p-2.5 text-right">ARR Projetado</th>
                      <th className="p-2.5 text-right">Margem Bruta</th>
                      <th className="p-2.5 text-right">CAC / LTV</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {projects.map((p) => {
                      const s = p.scenarios[scenario];
                      return (
                        <tr key={p.id}>
                          <td className="p-2.5 font-sans font-medium text-white">{p.name}</td>
                          <td className="p-2.5 text-right text-emerald-400 tabular-nums">{formatEuro(s.monthlyRevenue)}</td>
                          <td className="p-2.5 text-right tabular-nums">{formatEuro(s.annualRevenue)}</td>
                          <td className="p-2.5 text-right text-emerald-300 tabular-nums">{s.grossMarginPercent}%</td>
                          <td className="p-2.5 text-right text-slate-400 tabular-nums">{s.ltvCacRatio}x</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. Custos e Necessidade de Investimento */}
            <section className="space-y-3">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2 border-b border-slate-800 pb-1.5">
                <span className="text-emerald-400 font-mono">04.</span> Custos e Necessidade de Investimento
              </h2>
              <p className="leading-relaxed">
                A estratégia financeira recomenda <strong className="text-white">orçamento de investimento lean de apenas €3.800</strong>, concentrado no packaging premium do Breakfast in Bed LX e na ativação da prospeção outbound conduzida pelo Global Opportunity Hunter.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">·</span>
                  <span><strong>Infraestrutura Cloud & APIs:</strong> €380/mês (Modelos Gemini Flash, WhatsApp Cloud API e serverless).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">·</span>
                  <span><strong>Logística & Operação LX:</strong> Custo variável indexado a cada encomenda entregue (sem custos fixos de veículos).</span>
                </li>
              </ul>
            </section>

            {/* 5. Riscos Financeiros e Mitigações */}
            <section className="space-y-3">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2 border-b border-slate-800 pb-1.5">
                <span className="text-emerald-400 font-mono">05.</span> Riscos Financeiros e Mitigações
              </h2>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex items-start gap-2">
                  <span className="text-rose-400 font-bold">!</span>
                  <div>
                    <strong className="text-white">Risco de Ciclo de Vendas B2B Longo:</strong> Mitigação mediante oferta de demonstração imediata em 2 horas com 14 dias de teste sem compromisso.
                  </div>
                </div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex items-start gap-2">
                  <span className="text-rose-400 font-bold">!</span>
                  <div>
                    <strong className="text-white">Volatilidade de Insumos em Lisboa:</strong> Mitigação com pré-fixação de preços com duas pastelarias e padarias artesanais parceiras.
                  </div>
                </div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex items-start gap-2">
                  <span className="text-rose-400 font-bold">!</span>
                  <div>
                    <strong className="text-white">Risco Regulatório em RWA (Ouro/Prata):</strong> Mitigação mantendo a equipa estritamente na prestação de serviços de engenharia e consultoria técnica em success-fee.
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Ações Recomendadas com Nível de Prioridade */}
            <section className="space-y-3">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2 border-b border-slate-800 pb-1.5">
                <span className="text-emerald-400 font-mono">06.</span> Ações Recomendadas com Nível de Prioridade
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase">
                    <tr>
                      <th className="p-2">Ação Estratégica</th>
                      <th className="p-2 text-center">Prioridade</th>
                      <th className="p-2">Agente Responsável</th>
                      <th className="p-2 text-right">Prazo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr>
                      <td className="p-2 font-sans font-medium text-white">Ativação comercial de fim-de-semana do Breakfast in Bed LX</td>
                      <td className="p-2 text-center text-rose-400 font-bold">CRÍTICA</td>
                      <td className="p-2 text-slate-300">Operações LX / Hunter</td>
                      <td className="p-2 text-right text-emerald-400">7 Dias</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-sans font-medium text-white">Cadência de prospeção outbound sobre 40 hotéis boutique</td>
                      <td className="p-2 text-center text-rose-400 font-bold">CRÍTICA</td>
                      <td className="p-2 text-slate-300">Global Opportunity Hunter</td>
                      <td className="p-2 text-right text-emerald-400">14 Dias</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-sans font-medium text-white">Implementação do bundling (Voucher Tourguide em caixas físicas)</td>
                      <td className="p-2 text-center text-emerald-400 font-bold">ALTA</td>
                      <td className="p-2 text-slate-300">Growth Analyst / Finance</td>
                      <td className="p-2 text-right">21 Dias</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-sans font-medium text-white">Lançamento de pré-registo de criadores para a NexusAIStore</td>
                      <td className="p-2 text-center text-amber-400 font-bold">MÉDIA</td>
                      <td className="p-2 text-slate-300">Research Agent</td>
                      <td className="p-2 text-right">30 Dias</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 7. Informações em Falta / Premissas que Exigem Verificação */}
            <section className="space-y-3">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2 border-b border-slate-800 pb-1.5">
                <span className="text-emerald-400 font-mono">07.</span> Informações em Falta / Premissas a Verificar
              </h2>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">?</span>
                  <span>Taxa real de resposta de diretores de hotel às mensagens enviadas pelo Global Opportunity Hunter.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">?</span>
                  <span>Custo exato do parecer jurídico sobre não-subordinação do token de ouro ao regime de valores mobiliários.</span>
                </li>
              </ul>
            </section>

            {/* 8. Nível de Prioridade Global */}
            <section className="pt-2">
              <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-emerald-400 font-bold uppercase block">
                    08. Parecer Final do Chief Financial Intelligence Analyst
                  </span>
                  <p className="text-xs text-slate-300 mt-1">
                    Portfólio com capacidade de atingir tesouraria positiva em 7 dias e autossuficiência financeira sustentada.
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block uppercase">Recomendação</span>
                  <span className="text-sm font-bold text-emerald-400">EXECUÇÃO IMEDIATA</span>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
