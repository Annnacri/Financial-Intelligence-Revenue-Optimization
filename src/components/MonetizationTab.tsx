import React, { useState } from 'react';
import { PortfolioProject, LanguageCode } from '../types/finance';
import { TRANSLATIONS } from '../data/translations';
import { formatEuro } from '../utils/financialCalculations';
import {
  DollarSign,
  Layers,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface MonetizationTabProps {
  projects: PortfolioProject[];
  language: LanguageCode;
}

interface MonetizationModelItem {
  id: string;
  name: string;
  category: string;
  grossMarginRange: string;
  speedToCash: '7 Dias' | '30 Dias' | '60-90 Dias';
  financialMechanic: string;
  cashPredictability: 'Alta (Recorrente)' | 'Média' | 'Variável / Transacional';
  recommendedAsset: string;
  strategicRationale: string;
  keyMetric: string;
}

export const MonetizationTab: React.FC<MonetizationTabProps> = ({ projects, language }) => {
  const t = TRANSLATIONS[language];

  const models: MonetizationModelItem[] = [
    {
      id: 'saas-sub',
      name: 'Subscrições SaaS (Mensal & Anual)',
      category: 'Recorrente',
      grossMarginRange: '85% – 92%',
      speedToCash: '30 Dias',
      financialMechanic: 'Cobrança periódica automática por cartão de crédito ou débito direto SEPA.',
      cashPredictability: 'Alta (Recorrente)',
      recommendedAsset: 'AI Hotel Concierge & AI Tourguide (Agências)',
      strategicRationale: 'Maximiza o LTV e constrói valor patrimonial de longo prazo (múltiplos de saída de 6x-10x ARR).',
      keyMetric: 'CAC Payback < 2,5 meses, Net Revenue Retention > 110%',
    },
    {
      id: 'white-label',
      name: 'Licenciamento White-Label & B2B Enterprise',
      category: 'B2B de Alto Valor',
      grossMarginRange: '88% – 94%',
      speedToCash: '30 Dias',
      financialMechanic: 'Taxa de setup inicial de onboarding (€1.200–€3.000) + mensalidade de manutenção por propriedade.',
      cashPredictability: 'Alta (Recorrente)',
      recommendedAsset: 'AI Hotel Concierge (Grupos Hoteleiros e Redes Boutique)',
      strategicRationale: 'A taxa de setup cobre 100% do CAC de imediato, garantindo fluxo de caixa no dia zero do contrato.',
      keyMetric: 'Setup fee de €1.200 a €2.500 + €490/mês por hotel',
    },
    {
      id: 'direct-delivery',
      name: 'Venda Direta com Margem Comercial Elevada (AOV)',
      category: 'Operações Diretas / F&B',
      grossMarginRange: '60% – 68%',
      speedToCash: '7 Dias',
      financialMechanic: 'Pagamento antecipado instantâneo no ato do pedido (MBWay, Stripe, Cartão de Crédito).',
      cashPredictability: 'Variável / Transacional',
      recommendedAsset: 'Breakfast in Bed LX (Lisboa & Cascais)',
      strategicRationale: 'Gera liquidez real e tesouraria diária sem dependência de financiamento ou ciclos longos de aprovação.',
      keyMetric: 'Ticket Médio de €38 a €55 com 65% de margem bruta',
    },
    {
      id: 'marketplace-take-rate',
      name: 'Take-Rate de Marketplace & Listagens Patrocinadas',
      category: 'Plataforma Digital',
      grossMarginRange: '90% – 96%',
      speedToCash: '30 Dias',
      financialMechanic: 'Retenção de comissão de 15% a 25% sobre cada venda digital + €49 por listagem destacada.',
      cashPredictability: 'Média',
      recommendedAsset: 'NexusAIStore',
      strategicRationale: 'Custo de inventário e risco de devolução zero. Cresce exponencialmente à medida que a comunidade publica.',
      keyMetric: '20% de comissão média retida na fonte em cada transação',
    },
    {
      id: 'micro-passes',
      name: 'Micro-Passes de Acesso Pontual (B2C)',
      category: 'Self-Serve Digital',
      grossMarginRange: '88% – 93%',
      speedToCash: '7 Dias',
      financialMechanic: 'Venda direta de acessos de 3, 5 ou 7 dias a roteiros inteligentes de viagem (€9,99 a €19,99).',
      cashPredictability: 'Variável / Transacional',
      recommendedAsset: 'AI Tourguide Creator (Turistas em Trânsito)',
      strategicRationale: 'Volume de vendas rápido sem atrito de cancelamento. Excelente para captar turistas via Google Search e TikTok.',
      keyMetric: 'AOV de €12 com margem de contribuição de 89%',
    },
    {
      id: 'rwa-structuring',
      name: 'Taxas de Estruturação RWA & Gestão de Custódia (AUM)',
      category: 'Web3 & Finanças Institucionais',
      grossMarginRange: '75% – 88%',
      speedToCash: '60-90 Dias',
      financialMechanic: 'Taxa de emissão (1,5% a 3,0% do volume nominal) + 45 a 65 bps anuais de custódia e auditoria.',
      cashPredictability: 'Média',
      recommendedAsset: 'Web3 & RWA Tokenization (Ouro e Prata Física)',
      strategicRationale: 'Maior potencial de faturamento unitário do portfólio (€15k–€50k por contrato), porém com prazo regulatório MiCA.',
      keyMetric: 'Comissão de 2% sobre volume emitido + taxa anual de custódia',
    },
    {
      id: 'bundling-cross-sell',
      name: 'Pacotes Integrados & Venda Cruzada (Bundling)',
      category: 'Multiplicador de Receita',
      grossMarginRange: '72% – 82%',
      speedToCash: '7 Dias',
      financialMechanic: 'Desconto de conveniência em pacotes combinados que elevam o ticket médio e reduzem o CAC para zero.',
      cashPredictability: 'Alta (Recorrente)',
      recommendedAsset: 'AI Hotel Concierge + Breakfast in Bed LX + AI Tourguide',
      strategicRationale: 'O hóspede do hotel parceiro compra o café-da-manhã gourmet e os roteiros diretamente no concierge.',
      keyMetric: 'Aumento de 42% no LTV por cliente adquirido',
    },
    {
      id: 'consulting-implementation',
      name: 'Serviços de Consultoria & Implementação Especializada',
      category: 'Serviços de Alto Valor',
      grossMarginRange: '70% – 80%',
      speedToCash: '30 Dias',
      financialMechanic: 'Cobrança de honorários por projeto para integração personalizada de pipelines de IA em hotéis e agências.',
      cashPredictability: 'Média',
      recommendedAsset: 'AI Hotel Concierge & RWA Compliance',
      strategicRationale: 'Excelente para monetizar clientes que exigem integrações com PMS legados (Opera, Protel) com margem imediata.',
      keyMetric: 'Projetos de €2.500 a €7.500 por implementação',
    },
    {
      id: 'affiliate-commission',
      name: 'Comissões de Parceria & Afiliados (RevShare)',
      category: 'Parcerias B2B2C',
      grossMarginRange: '95% – 99%',
      speedToCash: '30 Dias',
      financialMechanic: 'Recebimento de 8% a 15% em reservas de restaurantes, transfers, museus e experiências locais recomendadas.',
      cashPredictability: 'Média',
      recommendedAsset: 'AI Hotel Concierge & AI Tourguide Creator',
      strategicRationale: 'Receita puramente passiva sem qualquer trabalho operacional adicional além da recomendação pelo agente de IA.',
      keyMetric: '€4 a €18 de comissão líquida por reserva confirmada',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Intro Box */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
        <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          Avaliação Estratégica dos 9 Modelos de Monetização
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-4xl">
          Análise comparativa das vias de monetização para o portfólio. A diretriz central do Chief Financial Intelligence Analyst é emparelhar cada produto com o modelo que maximiza a velocidade de caixa e a margem líquida.
        </p>
      </div>

      {/* Grid of the 9 Models */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((m) => (
          <div
            key={m.id}
            className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-slate-400 text-[10px] uppercase">
                  {m.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    m.speedToCash === '7 Dias'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : m.speedToCash === '30 Dias'
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  ⏱️ {m.speedToCash}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white tracking-tight mb-1">
                {m.name}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mt-2 mb-3">
                {m.financialMechanic}
              </p>

              <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Margem Bruta Estimada
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {m.grossMarginRange}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Aplicação Prioritária no Portfólio
                  </span>
                  <span className="text-slate-200 font-medium">
                    {m.recommendedAsset}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Justificação Financeira
                  </span>
                  <span className="text-slate-400 text-[11px] leading-relaxed block">
                    {m.strategicRationale}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-emerald-300/90 bg-slate-950 p-2.5 rounded">
              🎯 {m.keyMetric}
            </div>
          </div>
        ))}
      </div>

      {/* Bundling & Synergies Masterclass */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          Arquitetura de Vendas Cruzadas & Pacotes Integrados (Cross-Selling Engine)
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Como os ativos do portfólio atuam em rede simbiótica para reduzir o CAC a zero e acelerar o fluxo de caixa.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="text-emerald-400 font-mono font-bold text-sm mb-1">
              Pacote Hoteleiro Completo
            </div>
            <div className="text-[11px] text-slate-400 mb-2">
              AI Hotel Concierge + AI Tourguide Creator
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              O hotel subscreve o AI Concierge por €390/mês e ganha o gerador de itinerários com o branding do hotel incluído. Em troca, o hotel assume o compromisso de permanência de 12 meses, eliminando o churn para menos de 1,5%.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800 font-mono text-[11px] text-emerald-400">
              Impacto: +€4.680 ARR garantido por hotel
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="text-emerald-400 font-mono font-bold text-sm mb-1">
              Canal Turístico de Lisboa
            </div>
            <div className="text-[11px] text-slate-400 mb-2">
              Breakfast in Bed LX + AI Concierge Hoteleiro
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Hotéis boutique e alojamentos locais sem serviço de pequeno-almoço oferecem as caixas do Breakfast in Bed LX aos seus hóspedes via concierge digital. O hotel recebe 10% de comissão e nós garantimos pedidos diários com CAC zero.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800 font-mono text-[11px] text-emerald-400">
              Impacto: +€3.200/mês de liquidez imediata
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="text-emerald-400 font-mono font-bold text-sm mb-1">
              Hub de Distribuição Digital
            </div>
            <div className="text-[11px] text-slate-400 mb-2">
              NexusAIStore + Todos os Produtos IA
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              A NexusAIStore comercializa os templates de roteiros turísticos, os prompts de atendimento hoteleiro e os dashboards de RWA para outros criadores globais, captando receita digital passiva com margem bruta de 95%.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800 font-mono text-[11px] text-emerald-400">
              Impacto: Receita passiva contínua
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
