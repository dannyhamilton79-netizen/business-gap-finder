
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { view_page, save_state, export_doc, generate_brand_name, paywall_trigger, click_button } from '../../../utils/analytics';
import { generateBrandIdeas } from '../../../services/geminiService';
import type { BrandNameIdea } from '../../../types';

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/brand" className="hover:underline">Brand</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">AI Brand Builder</span>
    </nav>
);

const NamingPage: React.FC = () => {
  const navigate = useNavigate();
  const { brand, updateBrand, user, showToast, chosenIdea } = useAppContext();
  const [inputs, setInputs] = useState({
      industry: chosenIdea?.industry || '',
      keywords: '',
      tone: 'Professional',
      style: 'Evocative',
  });
  const [ideas, setIdeas] = useState<BrandNameIdea[]>([]);
  const [selected, setSelected] = useState<BrandNameIdea | null>(brand.naming.selectedName || null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => { view_page('/toolkit/brand/naming'); }, []);

  const handleGenerate = async () => {
    if (!inputs.industry && !inputs.keywords) {
      showToast('Please provide an industry or keywords.', 'error');
      return;
    }
    setIsLoading(true);
    generate_brand_name(inputs);
    const results = await generateBrandIdeas(inputs.industry, inputs.keywords, inputs.tone, inputs.style);
    
    if (user.plan === 'free' && !user.isFoundingMember) {
      setIdeas(results.slice(0, 3));
      showToast('Showing 3 results. Upgrade to Pro for more!', 'success');
    } else {
      setIdeas(results);
    }
    setIsLoading(false);
  };
  
  const handleSave = () => {
    if (!selected) {
      showToast('Please select a name first.', 'error');
      return;
    }
    updateBrand({ naming: { ...brand.naming, selectedName: selected, ...inputs, updatedAt: new Date().toISOString() } });
    save_state('brand.naming');
    showToast('Brand name saved!', 'success');
  };
  
  const handleSendToLogo = () => {
    handleSave();
    click_button('Send to Logo & Style');
    if(selected) navigate('/toolkit/brand/logo');
  }
  
  const handleExport = () => {
    if (user.plan === 'free' && !user.isFoundingMember) {
      paywall_trigger('Export Names PDF');
      navigate('/paywall', { state: { from: 'export', feature: 'Export Brand Names' } });
      return;
    }
    export_doc('Brand Names PDF');
    showToast('Exporting PDF...', 'success');
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <Breadcrumb />
      <h1 className="text-3xl font-bold">AI Brand Builder</h1>
      <p className="text-gray-600 mb-6">Find the perfect name, tagline, and description.</p>

      <Card className="p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Business Type / Industry" value={inputs.industry} onChange={e => setInputs({...inputs, industry: e.target.value})} className="p-2 border rounded" />
          <input type="text" placeholder="Keywords or themes (e.g., fast, eco, local)" value={inputs.keywords} onChange={e => setInputs({...inputs, keywords: e.target.value})} className="p-2 border rounded" />
          <select value={inputs.tone} onChange={e => setInputs({...inputs, tone: e.target.value})} className="p-2 border rounded">
            {['Professional', 'Playful', 'Elegant', 'Bold', 'Eco', 'Tech'].map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={inputs.style} onChange={e => setInputs({...inputs, style: e.target.value})} className="p-2 border rounded">
            {['Literal', 'Abstract', 'Acronym', 'Evocative'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="text-center mt-4">
          <Button onClick={handleGenerate} disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate Ideas'}</Button>
        </div>
      </Card>
      
      {isLoading && <div className="text-center">Loading...</div>}

      <div className="space-y-4">
        {ideas.map((idea, index) => (
          <Card key={index} className={`p-4 cursor-pointer border-2 ${selected?.name === idea.name ? 'border-accent' : 'border-transparent'}`} onClick={() => setSelected(idea)}>
            <h3 className="font-bold text-lg">{idea.name}</h3>
            <p className="text-accent italic">"{idea.tagline}"</p>
            <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
          </Card>
        ))}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4 z-10">
        <div className="container mx-auto max-w-4xl flex justify-between items-center">
            <Button variant="secondary" onClick={() => navigate('/toolkit/brand')}>Back to Brand</Button>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleSave} disabled={!selected}>Save Selected</Button>
              <Button onClick={handleSendToLogo} disabled={!selected}>Send to Logo & Style</Button>
              <Button variant="outline" onClick={handleExport} disabled={ideas.length === 0}>Export Names PDF</Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NamingPage;
