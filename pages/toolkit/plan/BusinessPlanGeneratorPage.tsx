
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { save_state, export_doc, view_page, click_button, send_to_milestones } from '../../../utils/analytics';
import { generateBusinessPlanSection } from '../../../services/geminiService';

const planSections = [
  { id: 'summary', title: 'Executive Summary', placeholder: "In one paragraph, describe the business, who it serves, and the value." },
  { id: 'problem', title: 'Problem & Solution' },
  { id: 'market', title: 'Market Overview' },
  { id: 'persona', title: 'Target Customer Persona' },
  { id: 'offering', title: 'Product / Service Offering' },
  { id: 'g2m', title: 'Go-to-Market Strategy' },
  { id: 'ops', title: 'Operations & Staffing' },
  { id: 'financials', title: 'Financial Overview' },
  { id: 'risks', title: 'Risks & Mitigations' },
  { id: 'milestones', title: 'Milestones & Timeline' },
];

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/plan" className="hover:underline">Plan</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">Business Plan Generator</span>
    </nav>
);

const BusinessPlanGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const { plan, updatePlan, user, showToast, chosenIdea, quizData } = useAppContext();
  const [businessPlan, setBusinessPlan] = useState(plan.businessPlan || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<string | null>(null);

  useEffect(() => { 
    view_page('/toolkit/plan/business-plan'); 
    if (!plan.businessPlan?.offering && chosenIdea) {
        setBusinessPlan(prev => ({...prev, offering: chosenIdea.longDescription}));
    }
  }, []);
  
  const handleGenerate = async (sectionId: string, sectionTitle: string) => {
    if (!businessPlan.summary && !businessPlan.offering && !chosenIdea) {
      showToast('Please describe your business idea first.', 'error');
      return;
    }
    setIsLoading(sectionId);
    click_button(`AI Improve Section`);
    const ideaContext = chosenIdea?.name || businessPlan.summary || businessPlan.offering;
    const content = await generateBusinessPlanSection(sectionTitle, ideaContext);
    setBusinessPlan(prev => ({ ...prev, [sectionId]: content }));
    setIsLoading(null);
  };
  
  const validate = () => {
      const newErrors: Record<string, string> = {};
      if (!businessPlan.summary) newErrors.summary = "Executive Summary is required for export.";
      if (!businessPlan.offering) newErrors.offering = "Offering is required for export.";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  const handleSave = () => {
    updatePlan({ businessPlan: { ...businessPlan, updatedAt: new Date().toISOString() } });
    save_state('plan.businessPlan');
    showToast('Business plan saved.', 'success');
  };
  
  const handleExport = () => {
    if (!validate()) {
        showToast('Please fill in required fields before exporting.', 'error');
        return;
    }
    if (user.plan === 'free' && !user.isFoundingMember) {
      navigate('/paywall', { state: { from: 'export-pdf', feature: 'Business Plan Export' } });
      return;
    }
    export_doc('Business Plan PDF');
    showToast('Exporting as PDF...', 'success');
    // Mock PDF generation
    console.log("--- GENERATING PDF ---", businessPlan);
  };
  
  const handleSendToGrow = () => {
    click_button('Send milestones to Grow');
    send_to_milestones('business-plan');
    showToast('Milestones sent to Grow tracker.', 'success');
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <Breadcrumb />
      <h1 className="text-3xl font-bold mb-6">Business Plan Generator</h1>
      
      {!chosenIdea && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6 flex justify-between items-center">
              <p>No idea selected. For better results, start with an idea.</p>
              <Button to="/find/quiz" variant="outline">Select Idea</Button>
          </div>
      )}
      
      {plan.pricing?.results?.monthlyRevenue > 0 && (
           <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg mb-6 text-sm">
             <strong>Cross-link:</strong> Pricing data detected. You can reference a monthly net profit of ${plan.pricing.results.monthlyNetProfit.toFixed(2)} in your Financial Overview.
           </div>
      )}

      <div className="space-y-6">
        {planSections.map(({ id, title, placeholder }) => (
          <Card key={id} className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{title}</h2>
              <Button onClick={() => handleGenerate(id, title)} disabled={!!isLoading} variant='outline' className="text-sm">
                {isLoading === id ? 'Generating...' : '✨ AI Improve Section'}
              </Button>
            </div>
            <textarea
              rows={8}
              className={`w-full p-2 border rounded-md bg-gray-50 ${errors[id] ? 'border-red-500' : 'border-gray-300'}`}
              placeholder={placeholder}
              value={businessPlan[id] || ''}
              onChange={(e) => setBusinessPlan(prev => ({ ...prev, [id]: e.target.value }))}
            />
            {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id]}</p>}
             {id === 'milestones' && <Button onClick={handleSendToGrow} className="mt-2 text-sm" variant="secondary">Send milestones to Grow</Button>}
          </Card>
        ))}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4 z-10">
        <div className="container mx-auto max-w-4xl flex justify-between items-center">
            <Button variant="secondary" onClick={() => navigate('/toolkit/plan')}>Back to Plan</Button>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleSave}>Save Draft</Button>
              <Button onClick={handleExport}>Export PDF</Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPlanGeneratorPage;
