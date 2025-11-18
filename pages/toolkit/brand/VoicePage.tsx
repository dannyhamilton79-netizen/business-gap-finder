
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { view_page, save_state, export_doc, generate_voice, paywall_trigger, click_button } from '../../../utils/analytics';
import { generateVoiceGuide } from '../../../services/geminiService';

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/brand" className="hover:underline">Brand</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">Brand Voice</span>
    </nav>
);

const voiceTraitsOptions = ['Friendly', 'Trustworthy', 'Innovative', 'Confident', 'Witty', 'Luxurious', 'Professional'];

const VoicePage: React.FC = () => {
  const navigate = useNavigate();
  const { brand, updateBrand, user, showToast, chosenIdea } = useAppContext();
  const [traits, setTraits] = useState<string[]>(brand.voice.traits || []);
  const [guide, setGuide] = useState<any>(brand.voice || {});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { view_page('/toolkit/brand/voice'); }, []);

  const handleTraitToggle = (trait: string) => {
    setTraits(prev => prev.includes(trait) ? prev.filter(t => t !== trait) : [...prev, trait]);
  };
  
  const handleGenerate = async () => {
    if (traits.length === 0) {
      showToast('Please select at least one voice trait.', 'error');
      return;
    }
    setIsLoading(true);
    generate_voice({ traits });
    const result = await generateVoiceGuide(brand.naming.selectedName?.name || 'My Business', chosenIdea?.industry || 'General', traits);
    setGuide(result);
    setIsLoading(false);
  };
  
  const handleSave = () => {
    updateBrand({ voice: { ...guide, traits, updatedAt: new Date().toISOString() } });
    save_state('brand.voice');
    showToast('Voice guide saved!', 'success');
  };

  const handleExport = () => {
    if (user.plan === 'free' && !user.isFoundingMember) {
      paywall_trigger('Export Voice Guide');
      navigate('/paywall', { state: { from: 'export', feature: 'Export Voice Guide' } });
      return;
    }
    export_doc('Voice Guide PDF');
    showToast('Exporting PDF...', 'success');
  };
  
  const handleSendToSocial = () => {
    handleSave();
    click_button('Send to Social Kit');
    navigate('/toolkit/brand/social');
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <Breadcrumb />
      <h1 className="text-3xl font-bold">Brand Voice Assistant</h1>
      <p className="text-gray-600 mb-6">Define how your brand sounds and connects.</p>

      <Card className="p-6 mb-8">
        <label className="font-semibold">Desired Voice Traits (select up to 3)</label>
        <div className="flex flex-wrap gap-2 my-2">
          {voiceTraitsOptions.map(trait => (
            <Button key={trait} variant={traits.includes(trait) ? 'primary' : 'outline'} onClick={() => handleTraitToggle(trait)}>
              {trait}
            </Button>
          ))}
        </div>
        <div className="text-center mt-4">
            <Button onClick={handleGenerate} disabled={isLoading || traits.length === 0}>
                {isLoading ? 'Generating...' : 'Generate Voice Guide'}
            </Button>
        </div>
      </Card>
      
      {guide.personality && (
        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="font-bold">Personality Summary</h2>
            <p>{guide.personality}</p>
          </Card>
          <Card className="p-4">
            <h2 className="font-bold">Elevator Pitch</h2>
            <textarea value={guide.pitch || ''} onChange={e => setGuide({...guide, pitch: e.target.value})} className="w-full p-1 border rounded" rows={2}/>
          </Card>
          <Card className="p-4">
            <h2 className="font-bold">Website Bio</h2>
            <textarea value={guide.bio || ''} onChange={e => setGuide({...guide, bio: e.target.value})} className="w-full p-1 border rounded" rows={4}/>
          </Card>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4 z-10">
        <div className="container mx-auto max-w-4xl flex justify-between items-center">
            <Button variant="secondary" onClick={() => navigate('/toolkit/brand')}>Back to Brand</Button>
            <div className="flex gap-4">
                <Button variant="outline" onClick={handleSave} disabled={!guide.personality}>Save Voice Guide</Button>
                <Button variant="outline" onClick={handleExport} disabled={!guide.personality}>Export PDF</Button>
                <Button onClick={handleSendToSocial} disabled={!guide.personality}>Send to Social Kit</Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VoicePage;
