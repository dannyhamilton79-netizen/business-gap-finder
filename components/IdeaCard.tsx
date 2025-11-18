
import React from 'react';
import type { BusinessIdea } from '../types';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { click_button, idea_saved } from '../utils/analytics';

interface IdeaCardProps {
  idea: BusinessIdea;
  onPreview: (idea: BusinessIdea) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onPreview }) => {
  const { saveIdea, user, showToast } = useAppContext();
  const navigate = useNavigate();

  const handleSave = () => {
    saveIdea({ ...idea, type: 'idea' });
    idea_saved(idea.id);
  };
  
  const handleStartPlan = () => {
    click_button('Start Plan', user.plan === 'pro' ? '/toolkit/plan' : '/paywall');
    if (user.plan === 'pro' || user.isFoundingMember) {
      navigate('/toolkit/plan');
    } else {
      navigate('/paywall', { state: { from: 'start-plan', ideaId: idea.id } });
    }
  };
  
  const handleSeeDetails = () => {
    click_button('See Details', '/paywall');
    navigate('/paywall', { state: { from: 'see-details', ideaId: idea.id } });
  }

  return (
    <Card className="flex flex-col">
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold mb-2 text-primary">{idea.name}</h3>
        <p className="text-gray-600 mb-4">{idea.shortDescription}</p>
        <div className="flex flex-wrap gap-2">
          <Badge color="blue">{idea.startupCostEstimated}</Badge>
          <Badge color="green">ROI: {idea.roiPotential}</Badge>
          <Badge color="yellow">Difficulty: {idea.difficulty}</Badge>
        </div>
      </div>
      <div className="p-4 bg-gray-50 border-t flex flex-wrap gap-2 justify-end">
        <Button variant="outline" onClick={() => onPreview(idea)}>Preview</Button>
        <Button variant="secondary" onClick={handleSave}>Save Idea</Button>
        <Button variant="primary" onClick={handleSeeDetails}>See Details</Button>
      </div>
    </Card>
  );
};

export default IdeaCard;
