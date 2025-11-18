
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { view_page, click_button } from '../../utils/analytics';

const FindResearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { plan, updatePlan, showToast } = useAppContext();
  const [idea, setIdea] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    view_page('/find/research');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea || !location) {
      showToast('Please fill in both fields.', 'error');
      return;
    }
    click_button('Analyze Idea', '/toolkit/plan/market');

    // Update the market analysis state before navigating
    updatePlan({
      market: {
        ...plan.market,
        keywords: idea,
        location: location,
      }
    });

    // Navigate to the market analysis tool
    navigate('/toolkit/plan/market');
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-extrabold mb-4">Have a Business in Mind?</h1>
      <p className="text-lg text-gray-600 mb-8">
        Enter your idea and location to get an instant market analysis.
      </p>
      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="idea" className="block text-left font-semibold mb-2">Business Idea / Keywords</label>
            <input
              id="idea"
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g., Mobile Coffee Cart, Eco-friendly Cleaning"
              className="w-full p-3 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-left font-semibold mb-2">Location</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., San Diego, CA"
              className="w-full p-3 border rounded-md"
            />
          </div>
          <Button type="submit" className="w-full">
            Analyze Idea
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default FindResearchPage;
