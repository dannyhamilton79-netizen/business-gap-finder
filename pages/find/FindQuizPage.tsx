import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/ui/Button';
import { BUDGET_OPTIONS, TIME_COMMITMENT_OPTIONS } from '../../constants';
import type { QuizData } from '../../types';
import { view_page, click_button } from '../../utils/analytics';

const QuizStep: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="w-full">
    <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
    <div className="space-y-4 max-w-md mx-auto">{children}</div>
  </div>
);

const FindQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { quizData, setQuizData } = useAppContext();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<QuizData>>(quizData);

  useEffect(() => {
    view_page('/find/quiz');
  }, []);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = () => {
    click_button('See My Matches', '/find/quiz/results');
    setQuizData(formData);
    navigate('/find/quiz/results');
  };

  const totalSteps = 5;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <div className="mb-8">
        <div className="flex justify-between mb-1">
          <span className="text-base font-medium text-accent">Step {step} of {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-accent h-2.5 rounded-full" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        </div>
      </div>
      
      {step === 1 && (
        <QuizStep title="What's your target area?">
            <input
              type="text"
              placeholder="e.g., Austin, TX"
              value={formData.area || ''}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className="p-3 border rounded-md w-full"
            />
        </QuizStep>
      )}
      {step === 2 && (
        <QuizStep title="What's your startup budget?">
          {BUDGET_OPTIONS.map(opt => (
            <label key={opt} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="budget" value={opt} checked={formData.budget === opt} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="h-5 w-5 text-accent focus:ring-accent"/>
              <span className="ml-3 text-lg">{opt}</span>
            </label>
          ))}
        </QuizStep>
      )}
      {step === 3 && (
        <QuizStep title="How much time can you commit per week?">
          {TIME_COMMITMENT_OPTIONS.map(opt => (
             <label key={opt} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="time" value={opt} checked={formData.timeCommitment === opt} onChange={(e) => setFormData({...formData, timeCommitment: e.target.value})} className="h-5 w-5 text-accent focus:ring-accent"/>
              <span className="ml-3 text-lg">{opt}</span>
            </label>
          ))}
        </QuizStep>
      )}
      {step === 4 && (
        <QuizStep title="What is your area of expertise? (Optional)">
            <input
              type="text"
              placeholder="e.g., Digital Marketing, Woodworking"
              value={formData.expertise || ''}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
              className="p-3 border rounded-md w-full"
            />
        </QuizStep>
      )}
      {step === 5 && (
        <QuizStep title="What sector are you interested in?">
            <input
              type="text"
              placeholder="e.g., Food & Beverage, Tech, Home Services"
              value={formData.sector || ''}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              className="p-3 border rounded-md w-full"
            />
        </QuizStep>
      )}

      <div className="mt-12 flex justify-between items-center">
        <Button variant="secondary" onClick={handleBack} disabled={step === 1}>Back</Button>
        {step < totalSteps ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button onClick={handleSubmit}>See My Matches</Button>
        )}
      </div>
    </div>
  );
};

export default FindQuizPage;