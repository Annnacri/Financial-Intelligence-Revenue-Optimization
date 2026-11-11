import React, { useState } from 'react';
import { PortfolioProject, ScenarioType, LanguageCode, SimulationParams } from './types/finance';
import { INITIAL_PORTFOLIO } from './data/portfolioData';
import { TRANSLATIONS } from './data/translations';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { PortfolioTab } from './components/PortfolioTab';
import { SimulatorTab } from './components/SimulatorTab';
import { ScoringTab } from './components/ScoringTab';
import { MonetizationTab } from './components/MonetizationTab';
import { CeoReportView } from './components/CeoReportView';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { CeoDispatchModal } from './components/CeoDispatchModal';
import { Sparkles, ShieldAlert, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [scenario, setScenario] = useState<ScenarioType>('realistic');
  const [language, setLanguage] = useState<LanguageCode>('pt');
  const [projects, setProjects] = useState<PortfolioProject[]>(INITIAL_PORTFOLIO);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('breakfast-in-bed-lx');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

  // Financial simulation parameters
  const [simParams, setSimParams] = useState<SimulationParams>({
    pricingMultiplier: 1.0,
    cacMultiplier: 1.0,
    churnDeltaPercent: 0,
    conversionRateMultiplier: 1.0,
    opexAdjustmentPercent: 0,
  });

  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';

  const handleAddCustomProject = (newProject: PortfolioProject) => {
    setProjects((prev) => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300"
    >
      {/* Primary Top Bar & Contextual Subheader */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        onOpenCeoDispatch={() => setIsDispatchModalOpen(true)}
        onOpenAiConsultant={() => setIsAiModalOpen(true)}
      />

      {/* Autonomous Intelligence Alert Banner */}
      <div className="bg-emerald-950/40 border-b border-emerald-500/20 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-mono font-bold text-[11px] uppercase tracking-wider text-emerald-400">
              AVISO PROATIVO AGENT 05:
            </span>
            <span className="text-slate-300">
              Geração de caixa a 7 dias disponível via ativação em Lisboa (Breakfast in Bed LX) com margem de 65%.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedProjectId('breakfast-in-bed-lx');
                setActiveTab('portfolio');
              }}
              className="text-emerald-400 hover:text-emerald-300 font-mono text-[11px] underline flex items-center gap-1"
            >
              <span>Ver Plano LX</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="text-slate-400 hover:text-white font-mono text-[11px] flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Pedir Auditoria IA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewTab
            projects={projects}
            scenario={scenario}
            setScenario={setScenario}
            language={language}
            simParams={simParams}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onOpenCeoDispatch={() => setIsDispatchModalOpen(true)}
            onSelectProject={(id) => setSelectedProjectId(id)}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioTab
            projects={projects}
            scenario={scenario}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            language={language}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorTab
            projects={projects}
            scenario={scenario}
            language={language}
            simParams={simParams}
            setSimParams={setSimParams}
          />
        )}

        {activeTab === 'scoring' && (
          <ScoringTab
            projects={projects}
            onAddCustomProject={handleAddCustomProject}
            language={language}
          />
        )}

        {activeTab === 'monetization' && (
          <MonetizationTab projects={projects} language={language} />
        )}

        {activeTab === 'ceoreport' && (
          <CeoReportView
            projects={projects}
            scenario={scenario}
            language={language}
            simParams={simParams}
            onOpenDispatchModal={() => setIsDispatchModalOpen(true)}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>AGENT 05 · Chief Financial Intelligence Analyst</span>
            <span className="mx-2 text-slate-700">·</span>
            <span>Reporta ao CEO Agent</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Foco: Tesouraria · Rentabilidade · Sustentabilidade</span>
            <span className="text-slate-700">·</span>
            <span>Português (Canal Oficial)</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <AiAdvisorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        projects={projects}
        scenario={scenario}
        language={language}
      />

      <CeoDispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        projects={projects}
        scenario={scenario}
        language={language}
      />
    </div>
  );
}
