import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { TRENDING_IDEAS, BUDGET_OPTIONS } from '../constants';
import type { BusinessIdea } from '../types';
import { view_page, click_button } from '../utils/analytics';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setQuizData, saveIdea } = useAppContext();
  const [area, setArea] = useState('');
  const [sector, setSector] = useState('');
  const [budget, setBudget] = useState(BUDGET_OPTIONS[0]);
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);

  useEffect(() => {
    view_page('/');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    click_button('Go', '/find/results');
    setQuizData({ area, sector, budget });
    const queryParams = new URLSearchParams({ area, sector, budget }).toString();
    navigate(`/find/results?${queryParams}`);
  };

  const handleUseLocation = () => {
    click_button('Use my location');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // This is a mock reverse geocoding
          setArea('Near You (Lat/Lon)');
        },
        () => {
          alert('Could not get your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleViewIdea = (idea: BusinessIdea) => {
    click_button('View Idea');
    setSelectedIdea(idea);
  };
  
  const handleSaveIdeaFromModal = () => {
    if (selectedIdea) {
        saveIdea({ ...selectedIdea, type: 'idea' });
        setSelectedIdea(null);
    }
  };


  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-20 bg-white rounded-lg shadow-md mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
          Find your next business
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Tailored to your city and budget.
        </p>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg">
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Area (e.g., San Francisco)"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="p-3 border rounded-md w-full md:w-64"
            />
            <button type="button" onClick={handleUseLocation} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-accent font-semibold">Use my location</button>
          </div>
          <input
            type="text"
            placeholder="Sector (e.g., Tech)"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="p-3 border rounded-md w-full md:w-64"
          />
          <select value={budget} onChange={(e) => setBudget(e.target.value)} className="p-3 border rounded-md w-full md:w-48">
            {BUDGET_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <Button type="submit" className="w-full md:w-auto">Go</Button>
        </form>
      </section>

      {/* Trending Businesses */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Trending Businesses & Ideas</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TRENDING_IDEAS.map(idea => (
            <Card key={idea.id} className="flex flex-col">
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-primary mb-2">{idea.name}</h3>
                <p className="text-gray-600">{idea.shortDescription}</p>
              </div>
              <div className="p-4 bg-gray-50 border-t">
                <Button variant="outline" className="w-full" onClick={() => handleViewIdea(idea)}>
                  View Idea
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
      
      {selectedIdea && (
        <Modal isOpen={!!selectedIdea} onClose={() => setSelectedIdea(null)} title={selectedIdea.name}>
          <div className="space-y-4">
            {selectedIdea.longDescription.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700">{paragraph}</p>
            ))}
            <div className="pt-4 text-right">
                <Button onClick={handleSaveIdeaFromModal}>Save Idea</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HomePage;