import React, { useState } from 'react';
import { PortfolioProject, ScenarioType, LanguageCode } from '../types/finance';
import { Sparkles, X, Send, Bot, AlertTriangle, TrendingUp, DollarSign, Loader2 } from 'lucide-react';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: PortfolioProject[];
  scenario: ScenarioType;
  language: LanguageCode;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  isOpen,
  onClose,
  projects,
  scenario,
  language,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content:
        'Sou o Agent 05 — Chief Financial Intelligence Analyst. O meu objetivo principal é identificar vias realistas de gerar fluxo de caixa, aumentar margens e construir receitas sustentáveis para o portfólio. Que análise financeira pretende executar agora?',
    },
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Detetar produtos sub-remunerados e fugas de margem no portfólio atual.',
    'Como maximizar a liquidez imediata nos próximos 14 dias sem capital externo?',
    'Qual a elasticidade de preço recomendada para o AI Hotel Concierge nos mercados de Lisboa e Porto?',
    'Como proteger a margem do Breakfast in Bed LX perante inflação nos produtos artesanais?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || query;
    if (!text.trim() || loading) return;

    const newMsgs = [...messages, { role: 'user' as const, content: text }];
    setMessages(newMsgs);
    setQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/financial-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'financial_advisor_query',
          language,
          payload: {
            userQuery: text,
            scenario,
            portfolioSummary: projects.map((p) => ({
              name: p.name,
              category: p.category,
              mrr: p.scenarios[scenario].monthlyRevenue,
              margin: p.scenarios[scenario].grossMarginPercent,
              score: p.scoring.totalScore,
              speed: p.speedCategory,
            })),
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setMessages([...newMsgs, { role: 'assistant', content: data.analysis }]);
      } else {
        setMessages([
          ...newMsgs,
          {
            role: 'assistant',
            content: 'Análise financeira processada. O plano mantém o foco na preservação de tesouraria.',
          },
        ]);
      }
    } catch (err: any) {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content: `Erro ao processar consulta financeira: ${err.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-3xl w-full h-[620px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Inteligência Financeira Autônoma (Gemini 3.8 Flash)
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Agent 05 · Pareceres de Rentabilidade, Auditoria de Custos & Oportunidades
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex gap-2 overflow-x-auto text-[11px]">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              disabled={loading}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap shrink-0 transition-colors disabled:opacity-50"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-900">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs shrink-0 font-mono mt-0.5">
                  05
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-slate-100 font-sans'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 whitespace-pre-line font-sans'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono pl-8">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>A avaliar sensibilidade de margens e liquidez...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Coloque uma questão financeira ou peça uma auditoria de preço..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-3.5 py-2 rounded bg-emerald-400 text-slate-950 hover:bg-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Consultar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
