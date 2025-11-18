import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import IdeaCard from '../../components/IdeaCard';
import Button from '../../components/ui/Button';
import type { BusinessIdea } from '../../types';
import Modal from '../../components/ui/Modal';
import { useAppContext } from '../../context/AppContext';
import { view_page, click_button } from '../../utils/analytics';
import { generateBusinessIdeas } from '../../services/geminiService';

const FindResultsPage: React.FC = () => {
  const location = useLocation();
  const { saveIdea } = useAppContext();
  const [results, setResults] = useState<BusinessIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [queryParams, setQueryParams] = useState({ area: '', sector: '', budget: '' });
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);

  useEffect(() => {
    view_page('/find/results');
    const params = new URLSearchParams(location.search);
    const area = params.get('area') || '';
    const sector = params.get('sector') || '';
    const budget = params.get('budget') || '';
    setQueryParams({ area, sector, budget });

    const fetchIdeas = async () => {
      if (area || sector || budget) {
        setIsLoading(true);
        const ideas = await generateBusinessIdeas({ area, sector, budget });
        setResults(ideas);
        setIsLoading(false);
      } else {
        setResults([]);
      }
    };

    fetchIdeas();
  }, [location.search]);
  
  const handleSaveIdeaFromModal = () => {
    if (selectedIdea) {
      saveIdea({ ...selectedIdea, type: 'idea' });
      setSelectedIdea(null);
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Generating personalized business ideas for you...</p>
        </div>
      );
    }

    if (results.length > 0) {
      return (
        <div className="space-y-6">
          {results.map(idea => (
            <IdeaCard key={idea.id} idea={idea} onPreview={() => setSelectedIdea(idea)} />
          ))}
          <div className="text-center mt-8">
            <Button to="/" variant="secondary">Refine Search</Button>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center bg-white p-12 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">No specific inputs provided.</h2>
        <p className="text-gray-600 mb-6">For more personalized matches, try our quiz!</p>
        <Button to="/find/quiz" onClick={() => click_button('Try the Quiz', '/find/quiz')}>Try the Quiz</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-2">Your Matches</h1>
      <p className="text-center text-gray-600 mb-8">Based on your search for "{queryParams.area || 'any area'}", "{queryParams.sector || 'any sector'}", and a budget of "{queryParams.budget || 'any budget'}"</p>
      
      {renderContent()}

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

export default FindResultsPage;