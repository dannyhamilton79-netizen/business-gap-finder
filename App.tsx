
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import FindResultsPage from './pages/find/FindResultsPage';
import FindQuizPage from './pages/find/FindQuizPage';
import FindQuizResultsPage from './pages/find/FindQuizResultsPage';
import FindForSalePage from './pages/find/FindForSalePage';
import FindResearchPage from './pages/find/FindResearchPage'; // New Import
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/blog/BlogPostPage';
import CommunityPage from './pages/CommunityPage';
import PricingPage from './pages/PricingPage';
import PaywallPage from './pages/PaywallPage';
import FoundersOnboardingPage from './pages/FoundersOnboardingPage';
import DashboardPage from './pages/DashboardPage';

import ToolkitHubPage from './pages/toolkit/ToolkitHubPage';
import ToolkitPlanHubPage from './pages/toolkit/plan/ToolkitPlanHubPage';
import BusinessPlanGeneratorPage from './pages/toolkit/plan/BusinessPlanGeneratorPage';
import MarketAnalysisPage from './pages/toolkit/plan/MarketAnalysisPage';
import LegalChecklistPage from './pages/toolkit/plan/LegalChecklistPage';
import PricingCalculatorPage from './pages/toolkit/plan/PricingCalculatorPage';

import ToolkitBrandHubPage from './pages/toolkit/brand/ToolkitBrandHubPage';
import NamingPage from './pages/toolkit/brand/NamingPage';
import LogoPage from './pages/toolkit/brand/LogoPage';
import VoicePage from './pages/toolkit/brand/VoicePage';
import SocialPage from './pages/toolkit/brand/SocialPage';

import ToolkitFinanceHubPage from './pages/toolkit/finance/ToolkitFinanceHubPage';
import CashflowPage from './pages/toolkit/finance/CashflowPage';
import ProjectionsPage from './pages/toolkit/finance/ProjectionsPage';
import FundingPage from './pages/toolkit/finance/FundingPage';

import ToolkitSellHubPage from './pages/toolkit/sell/ToolkitSellHubPage';
import CrmPage from './pages/toolkit/sell/CrmPage';
import PersonaPage from './pages/toolkit/sell/PersonaPage';
import MarketingPlanPage from './pages/toolkit/sell/MarketingPlanPage';
import AdsPlannerPage from './pages/toolkit/sell/AdsPlannerPage';

import ToolkitGrowHubPage from './pages/toolkit/grow/ToolkitGrowHubPage';
import MilestonesPage from './pages/toolkit/grow/MilestonesPage';
import PerformancePage from './pages/toolkit/grow/PerformancePage';
import NetworkingPage from './pages/toolkit/grow/NetworkingPage';
import GrantsPage from './pages/toolkit/grow/GrantsPage';


const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/find/results" element={<FindResultsPage />} />
            <Route path="/find/quiz" element={<FindQuizPage />} />
            <Route path="/find/quiz/results" element={<FindQuizResultsPage />} />
            <Route path="/find/for-sale" element={<FindForSalePage />} />
            <Route path="/find/research" element={<FindResearchPage />} /> {/* New Route */}
            
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />

            <Route path="/community" element={<CommunityPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/paywall" element={<PaywallPage />} />
            <Route path="/onboarding/founders" element={<FoundersOnboardingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            
            <Route path="/toolkit" element={<ToolkitHubPage />} />
            <Route path="/toolkit/plan" element={<ToolkitPlanHubPage />} />
            <Route path="/toolkit/plan/business-plan" element={<BusinessPlanGeneratorPage />} />
            <Route path="/toolkit/plan/market" element={<MarketAnalysisPage />} />
            <Route path="/toolkit/plan/legal" element={<LegalChecklistPage />} />
            <Route path="/toolkit/plan/pricing" element={<PricingCalculatorPage />} />

            <Route path="/toolkit/brand" element={<ToolkitBrandHubPage />} />
            <Route path="/toolkit/brand/naming" element={<NamingPage />} />
            <Route path="/toolkit/brand/logo" element={<LogoPage />} />
            <Route path="/toolkit/brand/voice" element={<VoicePage />} />
            <Route path="/toolkit/brand/social" element={<SocialPage />} />

            <Route path="/toolkit/finance" element={<ToolkitFinanceHubPage />} />
            <Route path="/toolkit/finance/cashflow" element={<CashflowPage />} />
            <Route path="/toolkit/finance/projections" element={<ProjectionsPage />} />
            <Route path="/toolkit/finance/funding" element={<FundingPage />} />
            
            <Route path="/toolkit/sell" element={<ToolkitSellHubPage />} />
            <Route path="/toolkit/sell/crm" element={<CrmPage />} />
            <Route path="/toolkit/sell/persona" element={<PersonaPage />} />
            <Route path="/toolkit/sell/marketing" element={<MarketingPlanPage />} />
            <Route path="/toolkit/sell/ads" element={<AdsPlannerPage />} />

            <Route path="/toolkit/grow" element={<ToolkitGrowHubPage />} />
            <Route path="/toolkit/grow/milestones" element={<MilestonesPage />} />
            <Route path="/toolkit/grow/performance" element={<PerformancePage />} />
            <Route path="/toolkit/grow/networking" element={<NetworkingPage />} />
            <Route path="/toolkit/grow/grants" element={<GrantsPage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
