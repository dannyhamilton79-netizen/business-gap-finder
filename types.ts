export interface User {
  isAuthenticated: boolean;
  isFoundingMember: boolean;
  plan: 'free' | 'pro';
  locale: string;
  name: string;
}

export interface BusinessIdea {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  industry: string;
  targetMarket: string;
  startupCostEstimated: string;
  roiPotential: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  revenueModel: string;
}

export interface SavedIdea extends BusinessIdea {
  type?: 'idea' | 'forSale';
  notes?: string;
  listingUrl?: string;
}

export interface QuizData {
  area: string;
  budget: string;
  timeCommitment: string;
  expertise?: string; // Changed from experience, made optional
  sector: string;
}

export interface Competitor {
  id: string;
  name: string;
  offer: string;
  pricing: string;
  strengths: string;
  weaknesses: string;
  link: string;
}

export interface MarketAnalysis {
  location: string;
  radius: string;
  keywords: string;
  demand: string;
  pricingBands: { entry: string; median: string; premium: string; };
  customerSegments: string[];
  competitors: Competitor[];
  swot: { strengths: string; weaknesses: string; opportunities: string; threats: string; };
  gapScore: number;
  updatedAt?: string;
  nicheSuggestions?: string[];
}

export interface LegalChecklistItem {
  id: number;
  title: string;
  done: boolean;
  note: string;
  link: string;
}

export interface LegalChecklist {
  jurisdiction: { country: string; state: string; city: string; };
  entityType: string;
  premises: string;
  items: LegalChecklistItem[];
  updatedAt?: string;
}

export interface PricingScenario {
  revenueModel: string;
  variableCost: number;
  targetPrice: number;
  volumePerWeek: number;
  fixedMonthlyCosts: number;
  startupCosts: number;
  taxRate: number;
  suggestedBands: { entry: number; median: number; premium: number };
  results: {
    grossMargin: number;
    monthlyRevenue: number;
    monthlyGrossProfit: number;
    monthlyNetProfit: number;
    breakevenUnits: number;
    monthsToBreakeven: number | string;
  };
  updatedAt?: string;
}

export interface Plan {
  businessPlan: Record<string, any> & { updatedAt?: string };
  market: Partial<MarketAnalysis>;
  legal: Partial<LegalChecklist>;
  pricing: Partial<PricingScenario>;
}

export interface BrandNameIdea {
  name: string;
  tagline: string;
  description: string;
}

export interface BrandNaming {
  selectedName?: BrandNameIdea;
  tone?: string;
  style?: string;
  updatedAt?: string;
}

export interface BrandLogo {
  selectedLogo?: any; // Could be SVG string or image URL
  palette?: { primary: string; secondary: string; accent: string };
  fonts?: { headline: string; body: string };
  mood?: string;
  style?: string;
  updatedAt?: string;
}

export interface BrandVoice {
  traits?: string[];
  personality?: string;
  tone?: { do: string[]; dont: string[] };
  pitch?: string;
  bio?: string;
  taglineAlt?: string[];
  updatedAt?: string;
}

export interface SocialPost {
  id: number;
  caption: string;
  visualConcept: string;
  hashtags: string[];
}

export interface BrandSocial {
  posts?: SocialPost[];
  hashtags?: string[];
  schedule?: any[];
  updatedAt?: string;
}

export interface Brand {
  naming: Partial<BrandNaming>;
  logo: Partial<BrandLogo>;
  voice: Partial<BrandVoice>;
  social: Partial<BrandSocial>;
}

export interface CashflowRow {
  month: number;
  revenue: number;
  fixedCosts: number;
  variableCosts: number;
  otherIncome: number;
  otherExpenses: number;
}

export interface CashflowData {
  startingBalance: number;
  currency: string;
  rows: CashflowRow[];
  updatedAt?: string;
}

export interface ProjectionsData {
  inputs: {
    period: number;
    revenueGrowth: number;
    expenseGrowth: number;
    taxRate: number;
    startupCosts: number;
    startingRevenue: number;
    startingExpenses: number;
    investment: number;
  };
  results: {
    summaryTable?: any[];
    kpis?: Record<string, any>;
  };
  updatedAt?: string;
}

export interface FundingTrackerRow {
  id: string;
  source: string;
  type: string;
  amount: number;
  status: 'Applied' | 'Pending' | 'Approved' | 'Declined';
  notes: string;
}

export interface FundingData {
  filters: Record<string, any>;
  savedOptions: any[];
  trackerRows: FundingTrackerRow[];
  updatedAt?: string;
}

export interface Finance {
  cashflow: Partial<CashflowData>;
  projections: Partial<ProjectionsData>;
  funding: Partial<FundingData>;
}

export interface Lead {
  id: string;
  name: string;
  contact: string;
  source: 'Website' | 'Social' | 'Referral' | 'Event' | 'Other';
  stage: 'New' | 'Contacted' | 'Negotiating' | 'Won' | 'Lost';
  value: number;
  nextActionDate: string;
  notes: string;
}

export interface CrmData {
  leads: Lead[];
  updatedAt?: string;
}

export interface Persona {
  id: string;
  name: string;
  age: string;
  location: string;
  occupation: string;
  income: string;
  goals: string;
  challenges: string;
  interests: string;
  motivation: string;
  triggers: string;
  summary?: string;
  insights?: Record<string, string>;
}

export interface PersonaData {
  personas: Persona[];
  updatedAt?: string;
}

export interface MarketingTimelineItem {
  id: string;
  month: number;
  focus: string;
  activities: string;
  outcome: string;
  notes: string;
}

export interface MarketingPlanData {
  goal: string;
  focus: string;
  channels: string[];
  coreMessage: string;
  offers: string;
  cta: string;
  timeline: MarketingTimelineItem[];
  updatedAt?: string;
}

export interface AdChannelResult {
  channel: string;
  spend: number;
  cpc: number;
  conversionRate: number;
  clicks: number;
  conversions: number;
  revenue: number;
  roi: number;
}

export interface AdsPlannerData {
  inputs: {
    monthlyBudget: number;
    duration: number;
    avgOrderValue: number;
    channels: Record<string, { cpc: number; conversionRate: number }>;
  };
  results?: {
    table: AdChannelResult[];
    totalSpend: number;
    totalRevenue: number;
    overallRoi: number;
  };
  updatedAt?: string;
}

export interface Sell {
  crm: Partial<CrmData>;
  persona: Partial<PersonaData>;
  marketing: Partial<MarketingPlanData>;
  ads: Partial<AdsPlannerData>;
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  category: 'Setup' | 'Marketing' | 'Sales' | 'Operations' | 'Finance' | 'Growth' | 'Other';
  status: 'Not Started' | 'In Progress' | 'Complete';
  description: string;
  dependencies: string[];
}

export interface MilestonesData {
  list: Milestone[];
  updatedAt?: string;
}

export interface PerformanceData {
  kpis: {
    monthlyRevenue: number;
    monthlyExpenses: number;
    netProfit: number;
    roi: number;
    conversionRate: number;
    milestonesComplete: number;
  };
  range: '3m' | '6m' | '12m';
  updatedAt?: string;
}

export interface Contact {
  id: string;
  name: string;
  type: 'Supplier' | 'Partner' | 'Mentor' | 'Contractor' | 'Investor';
  company: string;
  location: string;
  contactInfo: string;
  status: 'Active' | 'Pending' | 'Archived';
  notes: string;
}

export interface NetworkingData {
  contacts: Contact[];
  updatedAt?: string;
}

export interface Grant {
    id: string;
    name: string;
    type: string;
    amount: string;
    deadline: string;
    status: 'Research' | 'Applied' | 'Approved' | 'Declined';
    notes: string;
}

export interface GrantsData {
  saved: any[];
  tracker: Grant[];
  updatedAt?: string;
}

export interface Grow {
  milestones: Partial<MilestonesData>;
  performance: Partial<PerformanceData>;
  networking: Partial<NetworkingData>;
  grants: Partial<GrantsData>;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image?: string;
  excerpt: string;
  body: string;
  tags: string[];
  related?: string[];
  views?: number;
  featured?: boolean;
}

export interface Blog {
  posts: BlogPost[];
}

export interface AppState {
  user: User;
  quizData: QuizData;
  chosenIdea: BusinessIdea | null;
  savedIdeas: SavedIdea[];
  plan: Plan;
  brand: Brand;
  finance: Finance;
  sell: Sell;
  grow: Grow;
  blog: Blog;
}

export interface AppContextType extends AppState {
  setUser: (user: User) => void;
  setQuizData: (data: Partial<QuizData>) => void;
  setChosenIdea: (idea: BusinessIdea | null) => void;
  saveIdea: (idea: SavedIdea) => void;
  removeIdea: (id: string) => void;
  updatePlan: (plan: Partial<Plan>) => void;
  updateBrand: (brand: Partial<Brand>) => void;
  updateFinance: (finance: Partial<Finance>) => void;
  updateSell: (sell: Partial<Sell>) => void;
  updateGrow: (grow: Partial<Grow>) => void;
  updateBlog: (blog: Partial<Blog>) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}