import React from 'react';
import { LanguageCode } from '../types/finance';
import { TRANSLATIONS } from '../data/translations';
import { ShieldCheck, Globe, Send, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  onOpenCeoDispatch: () => void;
  onOpenAiConsultant: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onOpenCeoDispatch,
  onOpenAiConsultant,
}) => {
  const t = TRANSLATIONS[language];

  const navItems = [
    { id: 'overview', label: t.navOverview },
    { id: 'portfolio', label: t.navPortfolio },
    { id: 'simulator', label: t.navSimulator },
    { id: 'scoring', label: t.navScoring },
    { id: 'monetization', label: t.navMonetization },
    { id: 'ceoreport', label: t.navCeoReport },
  ];

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'pt', label: 'Português (CEO)', flag: '🇵🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'ar', label: 'العربية', flag: '🇦🇪' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100">
      {/* Top Bar Zone: Contract with exactly 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
              05
            </div>
            <a
              href="#overview"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('overview');
              }}
              className="text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-emerald-400 transition-colors"
            >
              FINANCE AGENT <span className="text-slate-500 font-mono text-xs ml-1 font-normal">CHIEF ANALYST</span>
            </a>
          </div>

          {/* Zone 2: 4-5 single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 text-xs tracking-wide uppercase ${
                  activeTab === item.id
                    ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAiConsultant}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded hover:bg-emerald-900/60 transition-colors whitespace-nowrap shrink-0"
              title="Inteligência Financeira Autônoma"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.navAiAdvisor}</span>
            </button>
            <button
              onClick={onOpenCeoDispatch}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.btnDispatchCeo}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-header Context Bar: Directive, CEO Channel, & Multilingual Switcher */}
      <div className="bg-slate-950/90 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-slate-400 flex-1 min-w-[280px]">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-semibold whitespace-nowrap shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {t.ceoBadge}
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <p className="text-[11px] text-slate-400 truncate max-w-2xl font-mono">
              {t.coreDirective}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded px-2 py-0.5">
              <Globe className="w-3 h-3 text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer pr-1"
                aria-label="Selecionar Idioma de Trabalho"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100">
                    {l.flag} {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav links for small screens */}
      <div className="lg:hidden border-t border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto bg-slate-900">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-2.5 py-1 text-xs rounded whitespace-nowrap shrink-0 ${
              activeTab === item.id
                ? 'bg-emerald-400 text-slate-950 font-semibold'
                : 'text-slate-300 bg-slate-800/60'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
