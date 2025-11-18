import React, { useState, useEffect } from 'react';
import IdeaCard from '../../components/IdeaCard';
import type { BusinessIdea } from '../../types';
import Modal from '../../components/ui/Modal';
import { useAppContext } from '../../context/AppContext';
import { view_page } from '../../utils/analytics';
import Button from '../../components/ui/Button';
import { generateBusinessIdeas } from '../../services/geminiService';

const FindQuizResultsPage: React.FC = () => {
  const { quizData, saveIdea } = useAppContext();
  const [results, setResults] = useState<BusinessIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);

  useEffect(() => {
    view_page('/find/quiz/results');
    const fetchIdeas = async () => {
      setIsLoading(true);
      const ideas = await generateBusinessIdeas(quizData);
      setResults(ideas);
      setIsLoading(false);
    };

    fetchIdeas();
  }, [quizData]);

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
            <p className="text-lg text-gray-600">Analyzing your quiz answers to find the perfect match...</p>
        </div>
      );
    }
    
    if (results.length === 0) {
        return (
            <div className="text-center bg-white p-12 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Couldn't find an exact match.</h2>
                <p className="text-gray-600 mb-6">Try broadening your search criteria or explore trending ideas!</p>
                <Button to="/find/quiz">Retake Quiz</Button>
            </div>
        );
    }

    return (
      <div className="space-y-6">
        {results.map(idea => (
          <IdeaCard key={idea.id} idea={idea} onPreview={() => setSelectedIdea(idea)} />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Your Top Matches</h1>
      {renderContent()}

       {selectedIdea && (
        <Modal isOpen={!!selectedIdea} onClose={() => setSelectedIdea(null)} title={selectedIdea.name}>
          <div className="space-y-4">
             {selectedIdea.longDescription.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700">{paragraph}</p>
            ))}
             <h4 className="font-bold text-lg pt-4">Trending Hooks in Your Area:</h4>
             <ul className="list-disc list-inside text-gray-700">
                <li>Partner with local events for pop-up opportunities.</li>
                <li>Target eco-conscious millennials on social media.</li>
                <li>Offer a subscription service for recurring revenue.</li>
             </ul>
            <div className="pt-4 text-right">
                <Button onClick={handleSaveIdeaFromModal}>Save Idea</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FindQuizResultsPage;