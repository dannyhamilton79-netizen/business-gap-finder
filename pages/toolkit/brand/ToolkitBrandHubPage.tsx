
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { view_page } from '../../../utils/analytics';

const brandSections = [
  { name: 'AI Brand Builder', path: '/toolkit/brand/naming', description: 'Generate names, taglines, and short descriptions for your business.' },
  { name: 'Logo & Style Generator', path: '/toolkit/brand/logo', description: 'Create a visual identity — logo, colors, and fonts.' },
  { name: 'Brand Voice Assistant', path: '/toolkit/brand/voice', description: 'Define how your business speaks and connects with customers.' },
  { name: 'Social Media Starter Kit', path: '/toolkit/brand/social', description: 'Launch your online presence with ready-to-post content.' },
];

const ToolkitBrandHubPage: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { view_page('/toolkit/brand'); }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Build Your Brand</h1>
      <p className="text-gray-600 mb-8">Build your identity — from name to voice.</p>
      
      <div className="space-y-6">
        {brandSections.map(section => (
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

export default ToolkitBrandHubPage;
