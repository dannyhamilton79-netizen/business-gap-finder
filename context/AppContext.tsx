import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AppContextType, AppState, User, QuizData, BusinessIdea, SavedIdea, Plan, Brand, LegalChecklistItem, Finance, Sell, Grow, Blog } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Toast from '../components/ui/Toast';
import { BLOG_POSTS } from '../constants';

const initialLegalChecklist: LegalChecklistItem[] = [
    { id: 1, title: 'Register Business Name', done: false, note: 'Confirm naming rules; file registration where required.', link: '' },
    { id: 2, title: 'Business Number / Tax IDs', done: false, note: 'Apply for BN/Tax ID; required for invoicing and payroll.', link: '' },
    { id: 3, title: 'Local Business License', done: false, note: 'Check municipal licensing for your sector.', link: '' },
    { id: 4, title: 'Industry-Specific Permits', done: false, note: 'Health, safety, environmental, or trade licenses if applicable.', link: '' },
    { id: 5, title: 'Insurance', done: false, note: 'General liability; consider workers’ comp and equipment coverage.', link: '' },
    { id: 6, title: 'Banking & Accounting Setup', done: false, note: 'Open business account; choose bookkeeping software.', link: '' },
    { id: 7, title: 'Contracts & Policies', done: false, note: 'Service agreement, privacy, website terms.', link: '' },
];


const defaultState: AppState = {
  user: { isAuthenticated: false, isFoundingMember: false, plan: 'free', locale: 'en-US', name: 'Guest' },
  quizData: { area: '', budget: '', timeCommitment: '', expertise: '', sector: '' },
  chosenIdea: null,
  savedIdeas: [],
  plan: { 
    businessPlan: {}, 
    market: { competitors: [] }, 
    legal: { items: initialLegalChecklist }, 
    pricing: {
        results: {
            grossMargin: 0,
            monthlyRevenue: 0,
            monthlyGrossProfit: 0,
            monthlyNetProfit: 0,
            breakevenUnits: 0,
            monthsToBreakeven: 0,
        }
    } 
  },
  brand: {
    naming: {},
    logo: {},
    voice: {},
    social: { posts: [] },
  },
  finance: {
    cashflow: { rows: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, revenue: 0, fixedCosts: 0, variableCosts: 0, otherIncome: 0, otherExpenses: 0 })) },
    projections: { 
      inputs: {
        period: 1,
        revenueGrowth: 0,
        expenseGrowth: 0,
        taxRate: 0,
        startupCosts: 0,
        startingRevenue: 0,
        startingExpenses: 0,
        investment: 0,
      }, 
      results: {} 
    },
    funding: { filters: {}, savedOptions: [], trackerRows: [] },
  },
  sell: { 
      crm: { leads: [] }, 
      persona: { personas: [] }, 
      marketing: { channels: [], timeline: [] }, 
      ads: { 
        inputs: { 
          monthlyBudget: 0, 
          duration: 0, 
          avgOrderValue: 0, 
          channels: {} 
        } 
      } 
  },
  grow: {
    milestones: { list: [] },
    performance: { kpis: { monthlyRevenue: 0, monthlyExpenses: 0, netProfit: 0, roi: 0, conversionRate: 0, milestonesComplete: 0 }, range: '12m' },
    networking: { contacts: [] },
    grants: { saved: [], tracker: [] },
  },
  blog: {
    posts: BLOG_POSTS,
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appState, setAppState] = useLocalStorage<AppState>('business-gap-finder-state', defaultState);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const setUser = (user: User) => {
    setAppState(prev => ({ ...prev, user }));
  };
  
  const setQuizData = (data: Partial<QuizData>) => {
    setAppState(prev => ({...prev, quizData: { ...prev.quizData, ...data }}));
  };

  const setChosenIdea = (idea: BusinessIdea | null) => {
    setAppState(prev => ({ ...prev, chosenIdea: idea }));
  };

  const saveIdea = (idea: SavedIdea) => {
    setAppState(prev => {
      if (prev.savedIdeas.find(i => i.id === idea.id)) {
        showToast('Idea already saved!', 'error');
        return prev;
      }
      showToast('Idea saved!', 'success');
      return { ...prev, savedIdeas: [...prev.savedIdeas, idea] };
    });
  };

  const removeIdea = (id: string) => {
    setAppState(prev => ({
      ...prev,
      savedIdeas: prev.savedIdeas.filter(idea => idea.id !== id),
    }));
    showToast('Idea removed.', 'success');
  };

  const updatePlan = (planUpdate: Partial<Plan>) => {
    setAppState(prev => ({
      ...prev,
      plan: { ...prev.plan, ...planUpdate }
    }));
  };

  const updateBrand = (brandUpdate: Partial<Brand>) => {
    setAppState(prev => ({
      ...prev,
      brand: { ...prev.brand, ...brandUpdate }
    }));
  };

  const updateFinance = (financeUpdate: Partial<Finance>) => {
    setAppState(prev => ({
      ...prev,
      finance: { ...prev.finance, ...financeUpdate }
    }));
  };

  const updateSell = (sellUpdate: Partial<Sell>) => {
    setAppState(prev => ({
      ...prev,
      sell: { ...prev.sell, ...sellUpdate }
    }));
  };
  
  const updateGrow = (growUpdate: Partial<Grow>) => {
    setAppState(prev => ({
      ...prev,
      grow: { ...prev.grow, ...growUpdate }
    }));
  };

  const updateBlog = (blogUpdate: Partial<Blog>) => {
    setAppState(prev => ({
      ...prev,
      blog: { ...prev.blog, ...blogUpdate }
    }));
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  const value: AppContextType = {
    ...appState,
    setUser,
    setQuizData,
    setChosenIdea,
    saveIdea,
    removeIdea,
    updatePlan,
    updateBrand,
    updateFinance,
    updateSell,
    updateGrow,
    updateBlog,
    showToast,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};