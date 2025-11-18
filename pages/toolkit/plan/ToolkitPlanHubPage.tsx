
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { view_page } from '../../../utils/analytics';
import { useAppContext } from '../../../context/AppContext';

const planSections = [
  { name: 'Business Plan Generator', path: '/toolkit/plan/business-plan', description: 'Auto-build a professional plan you can edit and export.' },
  { name: 'Market & Competitor Analysis', path: '/toolkit/plan/market', description: 'Snapshot demand, compare competitors, and generate a SWOT.' },
  { name: 'Legal & Compliance Checklist', path: '/toolkit/plan/legal', description: 'Jurisdiction-aware steps for registration, permits, and tax.' },
  { name: 'Pricing & Breakeven Calculator', path: '/toolkit/plan/pricing', description: 'Set pricing, see margins, and estimate time to breakeven.' },
];

const ToolkitPlanHubPage: React.FC = () => {
    const navigate = useNavigate();
    const { chosenIdea, setChosenIdea, savedIdeas } = useAppContext();

    useEffect(() => { 
        view_page('/toolkit/plan'); 
    }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Plan Your Business</h1>
      <p className="text-gray-600 mb-8">Structure your business from strategy to pricing.</p>

      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Active Business Idea</h2>
        {chosenIdea ? (
          <div>
            <p className="text-xl font-semibold text-accent">{chosenIdea.name}</p>
            <p className="text-gray-600">{chosenIdea.shortDescription}</p>
          </div>
        ) : (
           <p className="text-gray-500">No active idea selected. Choose one from your saved ideas to begin planning.</p>
        )}
        
        {savedIdeas.length > 0 && (
          <div className="mt-4">
            <label htmlFor="idea-selector" className="block text-sm font-medium text-gray-700">
              Switch to another saved idea:
            </label>
            <select
              id="idea-selector"
              value={chosenIdea?.id || ''}
              onChange={(e) => {
                const selected = savedIdeas.find(i => i.id === e.target.value);
                setChosenIdea(selected || null);
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md"
            >
              <option value="">-- Select an idea --</option>
              {savedIdeas.map(idea => (
                <option key={idea.id} value={idea.id}>{idea.name}</option>
              ))}
            </select>
          </div>
        )}

        {savedIdeas.length === 0 && !chosenIdea && (
            <div className="mt-4 text-center border-t pt-4">
                <p className="mb-4">You have no saved ideas to plan.</p>
                <Button to="/find/quiz">Find an Idea</Button>
            </div>
        )}
      </Card>
      
      <div className="space-y-6">
        {planSections.map(section => (
          <Card key={section.name} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">{section.name}</h2>
              <p className="text-gray-500 mt-1">{section.description}</p>
            </div>
            <Button to={section.path} className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">Open</Button>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button variant="secondary" onClick={() => navigate('/toolkit')}>Back to Toolkit</Button>
      </div>
    </div>
  );
};

export default ToolkitPlanHubPage;