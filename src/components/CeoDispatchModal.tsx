import React, { useState } from 'react';
import { PortfolioProject, ScenarioType, LanguageCode } from '../types/finance';
import { TRANSLATIONS } from '../data/translations';
import { formatEuro } from '../utils/financialCalculations';
import { Send, X, Check, ShieldCheck, Clock, FileText, AlertTriangle } from 'lucide-react';

interface CeoDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: PortfolioProject[];
  scenario: ScenarioType;
  language: LanguageCode;
}

export const CeoDispatchModal: React.FC<CeoDispatchModalProps> = ({
  isOpen,
  onClose,
  projects,
  scenario,
  language,
}) => {
  const [briefingSubject, setBriefingSubject] = useState('Despacho Prioritário: Ativação de Caixa a 7 Dias (Breakfast LX + Concierge)');
  const [briefingText, setBriefingText] = useState(
`Ao cuidado do CEO Agent,

O Agent 05 (Chief Financial Intelligence Analyst) concluiu a auditoria de fluxo de caixa para a próxima quinzena.

RECOMENDAÇÕES PARA DECISÃO IMEDIATA:
1. Autorizar ativação comercial do Breakfast in Bed LX em Lisboa para garantir receita líquida de curto prazo (+€1.600 a 7 dias com 65% de margem bruta).
2. Instruir o Global Opportunity Hunter a focar 100% dos seus esforços nos 40 hotéis boutique pré-selecionados para o AI Hotel Concierge (potencial de €7.750 em entradas de taxa de setup a 30 dias).
3. Não alocar capital de risco próprio na estruturação de RWA até que tenhamos contratos com success-fee confirmados.

Nível de Prioridade: ALTA / AÇÃO IMEDIATA
O portfólio mantém solidez com ponto de equilíbrio em 48 unidades combinadas.`
  );
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  if (!isOpen) return null;

  const handleSendDispatch = () => {
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 2500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-xl w-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Despacho Direto para o CEO Agent
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-slate-950 p-3 rounded border border-slate-800">
            <div>
              <span className="text-slate-500 block">DESTINATÁRIO:</span>
              <span className="text-white font-semibold">CEO Agent (Canal Executivo)</span>
            </div>
            <div>
              <span className="text-slate-500 block">EMISSOR:</span>
              <span className="text-emerald-400 font-semibold">Agent 05 (Finance Analyst)</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-mono block mb-1">
              Assunto do Despacho
            </label>
            <input
              type="text"
              value={briefingSubject}
              onChange={(e) => setBriefingSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-mono block mb-1">
              Conteúdo da Recomendação Estratégica (Português)
            </label>
            <textarea
              rows={8}
              value={briefingText}
              onChange={(e) => setBriefingText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-400 leading-relaxed"
            />
          </div>

          {status === 'sent' && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded text-xs text-emerald-300 font-mono flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Despacho transmitido com sucesso ao CEO Agent com carimbo de alta prioridade.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Comunicação estritamente em Português conforme Diretriz 9.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSendDispatch}
              disabled={status !== 'idle'}
              className="px-4 py-1.5 rounded bg-emerald-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 hover:bg-emerald-300 transition-colors disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{status === 'sending' ? 'A Transmitir...' : status === 'sent' ? 'Transmitido' : 'Enviar Despacho'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
