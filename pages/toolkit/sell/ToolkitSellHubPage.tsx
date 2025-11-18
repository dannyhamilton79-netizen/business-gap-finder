
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { view_page } from '../../../utils/analytics';

const sellSections = [
  { name: 'Mini CRM & Lead Tracker', path: '/toolkit/sell/crm', description: 'Track your leads, follow-ups, and conversions.' },
  { name: 'Customer Persona Builder', path: '/toolkit/sell/persona', description: 'Define who your ideal customer really is.' },
  { name: 'Marketing Plan Builder', path: '/toolkit/sell/marketing', description: 'Map your message, channels, and campaigns.' },
  { name: 'Ad Budget Planner', path: '/toolkit/sell/ads', description: 'Estimate your spend and ROI across platforms.' },
];

const ToolkitSellHubPage: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { view_page('/toolkit/sell'); }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Sell Your Product</h1>
      <p className="text-gray-600 mb-8">Find customers, build relationships, and grow your revenue.</p>
      
      <div className="space-y-6">
        {sellSections.map(section => (
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

export default ToolkitSellHubPage;
