import { PortfolioProject, CashFlowMilestone } from '../types/finance';

export const INITIAL_PORTFOLIO: PortfolioProject[] = [
  {
    id: 'breakfast-in-bed-lx',
    name: 'Breakfast in Bed LX',
    tagline: 'Entrega premium de pequenos-almoços e brunch de luxo em Lisboa',
    category: 'Direct Operations (Lisbon)',
    coreModel: 'AOV Premium (€38–€55) + Subscrições Corporativas e Fim-de-Semana',
    status: 'Ready to Monetize',
    priorityLevel: 'Crítica',
    speedCategory: '7_days',
    scenarios: {
      conservative: {
        pricePerUnit: 38,
        activeUnitsOrSubs: 120, // orders / month
        monthlyRevenue: 4560,
        annualRevenue: 54720,
        cogsMonthly: 1732, // fresh ingredients, artisan bakery, gourmet packaging (38%)
        opexMonthly: 1400, // kitchen slot lease, courier logistics, payment fees
        grossMarginPercent: 62.0,
        netMarginPercent: 31.3,
        cac: 18,
        ltv: 152, // 4 orders repeat over 6 months
        ltvCacRatio: 8.44,
        paybackMonths: 0.5,
        breakEvenUnits: 59,
        speedToFirstRevenueDays: 3,
      },
      realistic: {
        pricePerUnit: 44,
        activeUnitsOrSubs: 240, // orders / month (8/day average across Lisbon & Cascais)
        monthlyRevenue: 10560,
        annualRevenue: 126720,
        cogsMonthly: 3696, // 35% COGS with bulk bakery agreements
        opexMonthly: 2400, // dedicated courier batching + kitchen lease
        grossMarginPercent: 65.0,
        netMarginPercent: 42.3,
        cac: 15,
        ltv: 220, // 5 orders repeat over 12 months
        ltvCacRatio: 14.66,
        paybackMonths: 0.3,
        breakEvenUnits: 84,
        speedToFirstRevenueDays: 2,
      },
      optimistic: {
        pricePerUnit: 48,
        activeUnitsOrSubs: 450, // orders / month (including corporate team brunches)
        monthlyRevenue: 21600,
        annualRevenue: 259200,
        cogsMonthly: 6912, // 32% COGS
        opexMonthly: 3800,
        grossMarginPercent: 68.0,
        netMarginPercent: 50.4,
        cac: 12,
        ltv: 336, // 7 orders repeat
        ltvCacRatio: 28.0,
        paybackMonths: 0.2,
        breakEvenUnits: 117,
        speedToFirstRevenueDays: 1,
      },
    },
    scoring: {
      revenuePotential: 21, // 21/25 (Good recurring localized turnover)
      profitMargin: 16, // 16/20 (65% gross margin, healthy for hospitality/F&B)
      speedToRevenue: 20, // 20/20 (Immediate cash in 24-72 hours via Stripe/MBWay)
      marketDemand: 14, // 14/15 (Booming Lisbon luxury tourism & remote worker density)
      implementationCost: 9, // 9/10 (Low initial asset footprint, partnered kitchen)
      recurringRevenue: 8, // 8/10 (Weekly corporate brunch & weekend romance habits)
      totalScore: 88,
      rationale: 'O campeão indiscutível de fluxo de caixa imediato. Gera liquidez operacional em menos de 7 dias com margem líquida robusta de 42%, financiando outros desenvolvimentos do portfólio.',
    },
    verifiedFacts: [
      'Lisboa mantém uma das taxas de ocupação hoteleira e Airbnb mais altas da Europa meridional.',
      'Margens de pastelaria gourmet e charcutaria artesanal em compras B2B locais situam-se entre 60% e 70%.',
      'Processamento de pagamentos instantâneo via MB Way, Apple Pay e Cartão de Crédito sem prazo de maturação.',
    ],
    assumptions: [
      'Ticket médio projetado em €44 (menu para duas pessoas com sumo natural e espumante opcional).',
      'Taxa de repetição estimada em 30% para residentes e 10% para turistas em estadias prolongadas.',
      'Parceria com dark kitchens ou cafetaria licenciada já aprovada para produção em lote matinal.',
    ],
    missingInformation: [
      'Acordo contratual finalizado com plataforma de entregas dedicada ou estafetas privados.',
      'Custo exato das licenças sanitárias locais da Câmara Municipal de Lisboa para embalamento prévio.',
    ],
    risks: [
      'Sensibilidade meteorológica e concentração de picos de pedidos exclusivamente aos sábados e domingos.',
      'Risco operacional de atrasos de tráfego na baixa de Lisboa e no eixo Chiado/Príncipe Real.',
    ],
    monetizationStrategies: [
      {
        model: 'Direct-to-Consumer (B2C) Gourmet Brunch',
        description: 'Venda direta via web/app com entrega agendada em janelas de 30 minutos.',
        targetPrice: '€38 - €58 por caixa',
        marginProfile: '65% Margem Bruta',
        recommendationGrade: 'Highly Recommended',
      },
      {
        model: 'Corporate Office Breakfast Subscription',
        description: 'Entregas regulares de quintas e sextas-feiras para empresas de tecnologia e agências.',
        targetPrice: '€180 - €450 por mês / empresa',
        marginProfile: '58% Margem Bruta (volume garantido)',
        recommendationGrade: 'Recommended',
      },
      {
        model: 'Airbnb & Boutique Hotel Host Concierge Commission',
        description: 'Parceria com anfitriões de luxo onde recebem 10% de comissão por recomendação a hóspedes.',
        targetPrice: '€44 AOV / 10% comissão parceiro',
        marginProfile: '55% Margem Bruta líquida',
        recommendationGrade: 'Highly Recommended',
      },
    ],
    operationalRisk: 32,
    operationalRiskFactors: [
      'Gestão de produção em lote matinal (janela das 06:30 às 09:30)',
      'Pontualidade logística no trânsito da Baixa de Lisboa e Chiado',
      'Pico operacional concentrado aos sábados e domingos',
    ],
    crossSellingSynergies: [
      'Integrar no AI Hotel Concierge como opção prioritária de pequeno-almoço para hotéis sem cozinha própria.',
      'Incluir voucher digital com 15% de desconto para o AI Tourguide Creator em cada caixa física entregue.',
    ],
  },
  {
    id: 'ai-hotel-concierge',
    name: 'AI Hotel Concierge',
    tagline: 'Concierge autónomo e multilíngue com IA para hotéis e alojamentos boutique',
    category: 'Hospitality Tech',
    coreModel: 'B2B SaaS por Quarto/Propriedade (€250–€850/mês) + Taxa de Configuração (€1.200)',
    status: 'Ready to Monetize',
    priorityLevel: 'Crítica',
    speedCategory: '30_days',
    scenarios: {
      conservative: {
        pricePerUnit: 290, // €290/mo average contract
        activeUnitsOrSubs: 10, // 10 boutique hotels
        monthlyRevenue: 2900,
        annualRevenue: 34800,
        cogsMonthly: 380, // Gemini API tokens + WhatsApp Business API per message
        opexMonthly: 850, // customer success & infrastructure
        grossMarginPercent: 86.9,
        netMarginPercent: 57.6,
        cac: 650,
        ltv: 5220, // 18-month average contract life
        ltvCacRatio: 8.03,
        paybackMonths: 2.2,
        breakEvenUnits: 3,
        speedToFirstRevenueDays: 21,
      },
      realistic: {
        pricePerUnit: 390, // €390/mo
        activeUnitsOrSubs: 35, // 35 hotels across Portugal & Spain
        monthlyRevenue: 13650,
        annualRevenue: 163800,
        cogsMonthly: 1650,
        opexMonthly: 2100,
        grossMarginPercent: 87.9,
        netMarginPercent: 72.5,
        cac: 520,
        ltv: 9360, // 24-month contract life
        ltvCacRatio: 18.0,
        paybackMonths: 1.3,
        breakEvenUnits: 6,
        speedToFirstRevenueDays: 14,
      },
      optimistic: {
        pricePerUnit: 490,
        activeUnitsOrSubs: 80,
        monthlyRevenue: 39200,
        annualRevenue: 470400,
        cogsMonthly: 4300,
        opexMonthly: 4200,
        grossMarginPercent: 89.0,
        netMarginPercent: 78.3,
        cac: 450,
        ltv: 14700, // 30-month contract life
        ltvCacRatio: 32.6,
        paybackMonths: 0.9,
        breakEvenUnits: 10,
        speedToFirstRevenueDays: 10,
      },
    },
    scoring: {
      revenuePotential: 24, // 24/25 (High MRR + ARR potential in scalable B2B)
      profitMargin: 19, // 19/20 (87%+ gross margins, pure software economics)
      speedToRevenue: 17, // 17/20 (B2B sales cycle 14–30 days with direct outreach)
      marketDemand: 14, // 14/15 (Severe hotel staffing shortages in southern Europe)
      implementationCost: 9, // 9/10 (Pre-built LLM agent architecture, WhatsApp/Web integration)
      recurringRevenue: 10, // 10/10 (Stickiest B2B SaaS retention model)
      totalScore: 93,
      rationale: 'A jóia de rentabilidade e retenção do portfólio. Margens brutas superiores a 87%, receitas anuais previsíveis (ARR de €160k+ no cenário realista) e elevadíssimo LTV/CAC de 18x.',
    },
    verifiedFacts: [
      'Hotéis boutique pagam atualmente mais de €1.800/mês por rececionistas noturnos poliglota.',
      'O custo por mil tokens do Gemini 2.5/3.8 Flash permite manter o custo variável por hóspede abaixo de €0,03/dia.',
      'O WhatsApp Business Cloud API cobra aproximadamente €0,04 por conversa de serviço na Europa.',
    ],
    assumptions: [
      'Ciclo de decisão do diretor hoteleiro inferior a 20 dias após demonstração funcional com QR code no telemóvel.',
      'Churn mensal projetado inferior a 2,5% após integração do software na rotina do hotel.',
      'Cobrança adicional de taxa de onboarding/setup de €750 a €1.200 na ativação.',
    ],
    missingInformation: [
      'Taxa de conversão exata da cadência de prospeção outbound conduzida pelo Global Opportunity Hunter.',
      'Compatibilidade com PMS tradicionais (Opera, Cloudbeds, Mews) para check-in automatizado.',
    ],
    risks: [
      'Bloqueio ou atrasos nas aprovações de modelos de mensagens na Meta/WhatsApp Business API.',
      'Resistência à adoção tecnológica por parte de gestores hoteleiros tradicionais mais conservadores.',
    ],
    monetizationStrategies: [
      {
        model: 'Tiered B2B SaaS (por tamanho da propriedade)',
        description: 'Até 25 quartos: €250/mês; 26-75 quartos: €450/mês; >75 quartos: €850/mês.',
        targetPrice: '€250 - €850 / mês',
        marginProfile: '88% Margem Bruta',
        recommendationGrade: 'Highly Recommended',
      },
      {
        model: 'White-Label Hotel Brand License',
        description: 'Personalização completa com domínio e logótipo próprio do grupo hoteleiro.',
        targetPrice: '€1.500 setup + €590/mês por propriedade',
        marginProfile: '91% Margem Bruta',
        recommendationGrade: 'Highly Recommended',
      },
      {
        model: 'Tour & Restaurant Booking Commission (RevShare)',
        description: 'Comissão de 8% a 15% sobre reservas de restaurantes, transfers e passeios turísticos.',
        targetPrice: 'Comissão variável (€4 - €18 por reserva)',
        marginProfile: '95% Margem Líquida sobre a comissão',
        recommendationGrade: 'Recommended',
      },
    ],
    operationalRisk: 24,
    operationalRiskFactors: [
      'Aprovação de modelos de mensagens na WhatsApp Cloud API',
      'Conexão e sincronização leve com PMS hoteleiro (Cloudbeds/Mews)',
      'Treino inicial de 30 minutos com os rececionistas do hotel',
    ],
    crossSellingSynergies: [
      'Empacotar o AI Tourguide Creator como o módulo oficial de "Experiências e Guias da Cidade" do Concierge.',
      'Canal de vendas direto para o Breakfast in Bed LX nos hotéis parceiros da Grande Lisboa.',
    ],
  },
  {
    id: 'ai-tourguide-creator',
    name: 'AI Tourguide Creator',
    tagline: 'Plataforma para criação de itinerários inteligentes e áudio-guias turísticos digitais',
    category: 'SaaS & AI',
    coreModel: 'B2C Micro-Passes (€9,99/viagem) + B2B Agências de Viagens (€199–€499/mês)',
    status: 'Ready to Monetize',
    priorityLevel: 'Alta',
    speedCategory: '30_days',
    scenarios: {
      conservative: {
        pricePerUnit: 14.9, // blended between traveler pass and agency sub
        activeUnitsOrSubs: 180,
        monthlyRevenue: 2682,
        annualRevenue: 32184,
        cogsMonthly: 310, // Maps API, TTS audio synthesis, serverless hosting
        opexMonthly: 800, // content QA and marketing
        grossMarginPercent: 88.4,
        netMarginPercent: 58.6,
        cac: 12,
        ltv: 42,
        ltvCacRatio: 3.5,
        paybackMonths: 1.5,
        breakEvenUnits: 58,
        speedToFirstRevenueDays: 14,
      },
      realistic: {
        pricePerUnit: 24.5,
        activeUnitsOrSubs: 420,
        monthlyRevenue: 10290,
        annualRevenue: 123480,
        cogsMonthly: 980,
        opexMonthly: 1800,
        grossMarginPercent: 90.5,
        netMarginPercent: 73.0,
        cac: 14,
        ltv: 78,
        ltvCacRatio: 5.57,
        paybackMonths: 1.0,
        breakEvenUnits: 82,
        speedToFirstRevenueDays: 10,
      },
      optimistic: {
        pricePerUnit: 32.0,
        activeUnitsOrSubs: 950,
        monthlyRevenue: 30400,
        annualRevenue: 364800,
        cogsMonthly: 2400,
        opexMonthly: 3200,
        grossMarginPercent: 92.1,
        netMarginPercent: 81.6,
        cac: 11,
        ltv: 118,
        ltvCacRatio: 10.7,
        paybackMonths: 0.6,
        breakEvenUnits: 109,
        speedToFirstRevenueDays: 7,
      },
    },
    scoring: {
      revenuePotential: 20, // 20/25
      profitMargin: 19, // 19/20 (Super high margin ~90%)
      speedToRevenue: 16, // 16/20 (Ready product, needs targeted distribution)
      marketDemand: 13, // 13/15 (Massive global tourism rebound, self-guided preference)
      implementationCost: 9, // 9/10 (Already prototyped)
      recurringRevenue: 7, // 7/10 (Traveler churn is high, agency B2B provides recurring base)
      totalScore: 84,
      rationale: 'Margem bruta espetacular de 90%. Para garantir sustentabilidade, a estratégia prioritária deve ser o licenciamento B2B para operadores turísticos e hotéis, evitando depender unicamente de tráfego pago B2C.',
    },
    verifiedFacts: [
      'Turistas jovens e independentes evitam guias físicos em grupo, preferindo áudio-guias e roteiros interativos no smartphone.',
      'O custo de síntese de áudio (TTS) com IA caiu mais de 80% nos últimos 12 meses.',
      'Agências de viagens independentes precisam de ferramentas digitais para criar itinerários com a sua marca.',
    ],
    assumptions: [
      'Parceria com agências de viagens e influenciadores de viagens em modelo de afiliação (20% comissão).',
      'Taxa de conversão de visitantes da página de destino para o passe de viagem estimada em 3,2%.',
    ],
    missingInformation: [
      'Custo por clique (CPC) real em campanhas de pesquisa do Google para palavras-chave turísticas em Lisboa, Madrid e Roma.',
    ],
    risks: [
      'Competição com aplicações consolidadas de rotas turísticas (GetYourGuide, Civitatis, mapas gratuitos).',
    ],
    monetizationStrategies: [
      {
        model: 'B2B Travel Agency & Tour Operator License',
        description: 'Software que permite às agências gerar guias personalizados com o logótipo da agência.',
        targetPrice: '€199 - €499 / mês',
        marginProfile: '92% Margem Bruta',
        recommendationGrade: 'Highly Recommended',
      },
      {
        model: 'Direct Traveler City Passes (B2C)',
        description: 'Acesso completo a itinerários dinâmicos de 3, 5 ou 7 dias com áudio e mapas interativos.',
        targetPrice: '€9,99 - €19,99 por cidade',
        marginProfile: '89% Margem Bruta',
        recommendationGrade: 'Recommended',
      },
      {
        model: 'Digital Bundle no NexusAIStore',
        description: 'Venda de templates de guias e prompts avançados para criadores de conteúdo turístico.',
        targetPrice: '€29 - €79 por pack',
        marginProfile: '95% Margem Bruta',
        recommendationGrade: 'Recommended',
      },
    ],
    operationalRisk: 18,
    operationalRiskFactors: [
      'Consumo e latência de síntese de voz (TTS) e Google Maps API',
      'Curadoria de pontos turísticos e horários de visita locais',
    ],
    crossSellingSynergies: [
      'Fornecer o motor de roteiros para o AI Hotel Concierge como um módulo de valor acrescentado.',
      'Oferta de guias de brunch e cafeterias em Lisboa que promovem os menus do Breakfast in Bed LX.',
    ],
  },
  {
    id: 'nexus-ai-store',
    name: 'NexusAIStore',
    tagline: 'Marketplace de produtos digitais, agentes autónomos e pacotes de serviços de IA',
    category: 'Marketplace',
    coreModel: 'Marketplace Take-Rate (15%–25%) + Listagens Patrocinadas (€49) + Venda Direta de Bundles de Agentes',
    status: 'Active Testing',
    priorityLevel: 'Alta',
    speedCategory: '30_days',
    scenarios: {
      conservative: {
        pricePerUnit: 49,
        activeUnitsOrSubs: 60, // transactions / month
        monthlyRevenue: 1470, // net take rate + bundles
        annualRevenue: 17640,
        cogsMonthly: 120, // payment gateway fees + verification checks
        opexMonthly: 600, // platform hosting and curator review
        grossMarginPercent: 91.8,
        netMarginPercent: 51.0,
        cac: 22,
        ltv: 110,
        ltvCacRatio: 5.0,
        paybackMonths: 1.2,
        breakEvenUnits: 28,
        speedToFirstRevenueDays: 25,
      },
      realistic: {
        pricePerUnit: 65,
        activeUnitsOrSubs: 190,
        monthlyRevenue: 6175,
        annualRevenue: 74100,
        cogsMonthly: 410,
        opexMonthly: 1300,
        grossMarginPercent: 93.3,
        netMarginPercent: 72.3,
        cac: 18,
        ltv: 185,
        ltvCacRatio: 10.27,
        paybackMonths: 0.8,
        breakEvenUnits: 43,
        speedToFirstRevenueDays: 18,
      },
      optimistic: {
        pricePerUnit: 89,
        activeUnitsOrSubs: 520,
        monthlyRevenue: 23140,
        annualRevenue: 277680,
        cogsMonthly: 1250,
        opexMonthly: 2800,
        grossMarginPercent: 94.6,
        netMarginPercent: 82.5,
        cac: 15,
        ltv: 280,
        ltvCacRatio: 18.66,
        paybackMonths: 0.5,
        breakEvenUnits: 62,
        speedToFirstRevenueDays: 12,
      },
    },
    scoring: {
      revenuePotential: 22, // 22/25
      profitMargin: 20, // 20/20 (Pure platform digital distribution, 92%+ gross margin)
      speedToRevenue: 15, // 15/20 (Requires initial catalog and creator supply)
      marketDemand: 13, // 13/15 (Massive appetite for turnkey AI workflows)
      implementationCost: 8, // 8/10 (Marketplace logic & seller dashboard)
      recurringRevenue: 8, // 8/10 (Developer subscriptions and recurrent workflow packs)
      totalScore: 86,
      rationale: 'Excelente modelo de comissões sem risco de stock ou custos operacionais físicos. Serve como vitrina e hub de distribuição para todos os produtos de IA criados pela equipa.',
    },
    verifiedFacts: [
      'Empresas e agências procuram soluções prontas de IA em vez de construir pipelines de raiz.',
      'Plataformas digitais operam com margens brutas superiores a 90% assim que o tráfego atinge escala orgânica.',
    ],
    assumptions: [
      'Lançamento inicial com 25 produtos proprietários da equipa autónoma para garantir tração sem depender de terceiros.',
      'Take-rate de 20% aceite pelos criadores externos em virtude da ausência de custos fixos de listagem.',
    ],
    missingInformation: [
      'Requisitos fiscais europeus sobre IVA digital (One Stop Shop / MOSS) para vendas comunitárias de produtos virtuais.',
    ],
    risks: [
      'Problema clássico do ovo e da galinha em marketplaces (atrair compradores vs atrair criadores).',
      'Desvalorização de prompts genéricos no mercado aberto.',
    ],
    monetizationStrategies: [
      {
        model: 'Digital Products Take-Rate (Comissão)',
        description: 'Retenção de 20% do valor de cada transação de scripts, fluxos e modelos de IA.',
        targetPrice: '20% comissão por venda',
        marginProfile: '95% Margem Bruta',
        recommendationGrade: 'Highly Recommended',
      },
      {
        model: 'Turnkey Proprietary AI Bundles',
        description: 'Venda de sistemas de agentes autónomos completos com licença comercial perpétua.',
        targetPrice: '€149 - €499 por bundle',
        marginProfile: '98% Margem Bruta',
        recommendationGrade: 'Highly Recommended',
      },
      {
        model: 'Featured Listing & Verification Badge',
        description: 'Destaque editorial semanal na homepage do marketplace para criadores de topo.',
        targetPrice: '€49 por semana / produto',
        marginProfile: '99% Margem Bruta',
        recommendationGrade: 'Recommended',
      },
    ],
    operationalRisk: 42,
    operationalRiskFactors: [
      'Moderação e garantia de qualidade de prompts enviados por criadores',
      'Gestão de disputas e reembolsos de bens digitais',
      'Conformidade com IVA Comunitário (MOSS) para vendas transfronteiriças',
    ],
    crossSellingSynergies: [
      'Canal de venda para as licenças do AI Tourguide Creator e conectores do AI Hotel Concierge.',
      'Atrair programadores e designers que compram bundles para futuros desenvolvimentos do portfólio.',
    ],
  },
  {
    id: 'web3-rwa-tokenization',
    name: 'Web3 & RWA Tokenization (Gold & Silver)',
    tagline: 'Tokenização e liquidez digital de ativos reais (RWA) focada em ouro e prata física',
    category: 'Web3 & RWA',
    coreModel: 'Structuring & Issuance Fee (1,5%–3,0%) + Taxa Anual de Custódia e Gestão (45–65 bps)',
    status: 'Structuring',
    priorityLevel: 'Média',
    speedCategory: '90_days',
    scenarios: {
      conservative: {
        pricePerUnit: 1500, // average fee per structuring engagement
        activeUnitsOrSubs: 2, // 2 pilot contracts / quarter
        monthlyRevenue: 1000,
        annualRevenue: 12000,
        cogsMonthly: 250, // smart contract deployment & auditor review
        opexMonthly: 500, // regulatory research
        grossMarginPercent: 75.0,
        netMarginPercent: 25.0,
        cac: 1200,
        ltv: 4500,
        ltvCacRatio: 3.75,
        paybackMonths: 3.2,
        breakEvenUnits: 1,
        speedToFirstRevenueDays: 75,
      },
      realistic: {
        pricePerUnit: 5000,
        activeUnitsOrSubs: 4,
        monthlyRevenue: 6666,
        annualRevenue: 80000,
        cogsMonthly: 900,
        opexMonthly: 1500,
        grossMarginPercent: 86.5,
        netMarginPercent: 64.0,
        cac: 1800,
        ltv: 24000,
        ltvCacRatio: 13.33,
        paybackMonths: 2.1,
        breakEvenUnits: 2,
        speedToFirstRevenueDays: 60,
      },
      optimistic: {
        pricePerUnit: 15000,
        activeUnitsOrSubs: 8,
        monthlyRevenue: 25000,
        annualRevenue: 300000,
        cogsMonthly: 2200,
        opexMonthly: 3500,
        grossMarginPercent: 91.2,
        netMarginPercent: 77.2,
        cac: 2800,
        ltv: 95000,
        ltvCacRatio: 33.9,
        paybackMonths: 1.4,
        breakEvenUnits: 3,
        speedToFirstRevenueDays: 45,
      },
    },
    scoring: {
      revenuePotential: 25, // 25/25 (Colossal upside if AUM / issuing volume scales)
      profitMargin: 18, // 18/20 (High ticket structuring margins)
      speedToRevenue: 9, // 9/20 (Long regulatory and compliance timeline: 60-90+ days)
      marketDemand: 13, // 13/15 (Surge in gold/silver investment & on-chain real-world assets)
      implementationCost: 6, // 6/10 (Legal opinions, smart contract security audits, vault custody)
      recurringRevenue: 8, // 8/10 (Annual basis point AUM fee)
      totalScore: 79,
      rationale: 'Potencial de receita e dimensão financeira muito elevado, mas com velocidade para primeiro euro lenta devido ao cumprimento regulamentar MiCA e necessidade de custódia física de metais. Não deve consumir o caixa inicial.',
    },
    verifiedFacts: [
      'A procura por ouro físico e ativos de refúgio atingiu máximos históricos em 2024-2026.',
      'O regulamento europeu MiCA (Markets in Crypto-Assets) impõe regras estritas para Asset-Referenced Tokens (ART).',
    ],
    assumptions: [
      'Operação estruturada em parceria com custodiante certificado de metais na Suíça ou Liechtenstein.',
      'Cobrança de comissão de estruturação (success-fee) para clientes institucionais ou family offices.',
    ],
    missingInformation: [
      'Custo exato do parecer jurídico de não-subordinação a valor mobiliário (legal opinion).',
      'Taxa mínima de comissão exigida pelo cofre/custodiante parceiro.',
    ],
    risks: [
      'Risco regulatório e custos de conformidade elevados que podem drenar liquidez sem garantias de emissão.',
      'Complexidade na auditoria de reservas de metal físico em tempo real (Proof of Reserve).',
    ],
    monetizationStrategies: [
      {
        model: 'RWA Structuring & Smart Contract Engineering',
        description: 'Prestação de serviço de consultoria técnica e estruturação de emissão para detentores de reservas.',
        targetPrice: '€5.000 - €25.000 taxa de estruturação',
        marginProfile: '85% Margem Bruta',
        recommendationGrade: 'Recommended',
      },
      {
        model: 'On-chain Mint & Redeem Spread',
        description: 'Margem de 0,5% sobre operações de compra e resgate de tokens lastreados em metal.',
        targetPrice: '50 bps sobre o volume transacionado',
        marginProfile: '90% Margem Líquida',
        recommendationGrade: 'Secondary',
      },
      {
        model: 'Annual Custody & Management Fee',
        description: 'Comissão anual de gestão sobre o valor total sob custódia (AUM).',
        targetPrice: '45 bps a 65 bps ao ano',
        marginProfile: '80% Margem Recorrente',
        recommendationGrade: 'Highly Recommended',
      },
    ],
    operationalRisk: 78,
    operationalRiskFactors: [
      'Cumprimento rigoroso do regime europeu MiCA para Asset-Referenced Tokens',
      'Auditorias regulares de reservas de ouro/prata em cofre físico (Proof of Reserve)',
      'Acordos contratuais com custodiantes certificados na Suíça ou Liechtenstein',
    ],
    crossSellingSynergies: [
      'Utilizar a NexusAIStore para listar ferramentas analíticas e dashboards de acompanhamento de preços de ouro/prata.',
      'Possibilidade de disponibilizar pagamentos com tokens de estabilidade de ouro no ecossistema de viagens e hotéis.',
    ],
  },
];

export const INITIAL_CASH_FLOW_MILESTONES: CashFlowMilestone[] = [
  {
    horizon: '7_days',
    title: 'Geração Instantânea de Liquidez (Breakfast in Bed LX)',
    expectedInflow: 2450,
    expectedOutflow: 850,
    netCash: 1600,
    keyDrivers: [
      'Ativação comercial imediata em Lisboa com pagamentos instantâneos',
      'Captação de encomendas de brunch de fim-de-semana via parcerias com anfitriões de alojamento local',
      'Despesas limitadas a ingredientes frescos e estafetas locais por encomenda',
    ],
    priorityLevel: 'Crítica',
    status: 'Immediate Action',
  },
  {
    horizon: '30_days',
    title: 'Tração Recorrente B2B (AI Hotel Concierge & Tourguide B2B)',
    expectedInflow: 11800,
    expectedOutflow: 3400,
    netCash: 8400,
    keyDrivers: [
      'Conversão dos primeiros 5 hotéis boutique com taxa de setup (€1.200 cada) + primeiro mês de SaaS',
      'Venda dos primeiros 10 pacotes B2B do AI Tourguide Creator para operadores turísticos',
      'Margem bruta agregada superior a 80%, consolidando ponto de equilíbrio operacional',
    ],
    priorityLevel: 'Crítica',
    status: 'In Pipeline',
  },
  {
    horizon: '90_days',
    title: 'Expansão de Portfólio & Marketplace (NexusAIStore & RWA Piloto)',
    expectedInflow: 38500,
    expectedOutflow: 11200,
    netCash: 27300,
    keyDrivers: [
      'NexusAIStore atinge velocidade de cruzeiro com 150+ compras mensais e bundles de IA de alto valor',
      'Escala do AI Hotel Concierge para 30+ propriedades hoteleiras em Portugal e Espanha',
      'Fecho do primeiro contrato de estruturação técnica de RWA (ouro/prata) sem consumo de capital próprio',
    ],
    priorityLevel: 'Alta',
    status: 'Structuring',
  },
];
