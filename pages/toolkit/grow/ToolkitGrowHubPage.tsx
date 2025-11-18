
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { view_page } from '../../../utils/analytics';

const growSections = [
  { name: 'Milestone Tracker', path: '/toolkit/grow/milestones', description: 'Set and track business goals across every stage.' },
  { name: 'Performance Dashboard', path: '/toolkit/grow/performance', description: 'Visualize revenue, expenses, and sales trends.' },
  { name: 'Networking & Suppliers', path: '/toolkit/grow/networking', description: 'Build connections that help your business scale.' },
  { name: 'Grant Finder', path: '/toolkit/grow/grants', description: 'Discover funding opportunities and apply directly.' },
];

const ToolkitGrowHubPage: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { view_page('/toolkit/grow'); }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Grow Your Business</h1>
      <p className="text-gray-600 mb-8">Track your journey, monitor results, and unlock opportunities.</p>
      
      <div className="space-y-6">
        {growSections.map(section => (
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

export default ToolkitGrowHubPage;
