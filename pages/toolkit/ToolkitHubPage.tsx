
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { view_page } from '../../utils/analytics';

const toolkitSections = [
  { name: 'Plan', path: '/toolkit/plan', description: 'Build your business plan, analyze markets, and handle legalities.' },
  { name: 'Brand', path: '/toolkit/brand', description: 'Create a memorable brand with our AI-powered tools.' },
  { name: 'Finance', path: '/toolkit/finance', description: 'Manage cashflow, make projections, and explore funding.' },
  { name: 'Sell', path: '/toolkit/sell', description: 'Develop your marketing plan and manage customer relationships.' },
  { name: 'Grow', path: '/toolkit/grow', description: 'Track milestones and scale your business effectively.' },
];

const ToolkitHubPage: React.FC = () => {
    useEffect(() => { view_page('/toolkit'); }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Your Business Toolkit</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {toolkitSections.map(section => (
          <Link to={section.path} key={section.name}>
            <Card className="p-6 h-full hover:border-accent border-2 border-transparent transition-all">
              <h2 className="text-2xl font-bold text-accent mb-2">{section.name}</h2>
              <p className="text-gray-600">{section.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ToolkitHubPage;
