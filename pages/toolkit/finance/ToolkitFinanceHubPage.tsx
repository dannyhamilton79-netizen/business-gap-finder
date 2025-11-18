
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { view_page } from '../../../utils/analytics';

const financeSections = [
  { name: 'Cashflow Template', path: '/toolkit/finance/cashflow', description: 'Track monthly income and expenses.' },
  { name: 'Financial Projections', path: '/toolkit/finance/projections', description: 'See your 1-year and 3-year outlook with profit and ROI forecasts.' },
  { name: 'Funding Hub', path: '/toolkit/finance/funding', description: 'Find grants, investors, or loans suited to your business.' },
];

const ToolkitFinanceHubPage: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { view_page('/toolkit/finance'); }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Manage Your Finances</h1>
      <p className="text-gray-600 mb-8">Plan your numbers — from startup costs to funding.</p>
      
      <div className="space-y-6">
        {financeSections.map(section => (
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

export default ToolkitFinanceHubPage;
