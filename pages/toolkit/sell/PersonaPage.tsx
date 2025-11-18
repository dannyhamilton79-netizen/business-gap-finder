
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { view_page, save_state, export_doc, generate_persona, click_button } from '../../../utils/analytics';
import { generatePersonaSummary } from '../../../services/geminiService';
import type { Persona } from '../../../types';

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/sell" className="hover:underline">Sell</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">Persona Builder</span>
    </nav>
);

const PersonaPage: React.FC = () => {
    const navigate = useNavigate();
    const { sell, updateSell, user, showToast, brand } = useAppContext();
    const [persona, setPersona] = useState<Partial<Persona>>(sell.persona?.personas?.[0] || { id: Date.now().toString() });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { view_page('/toolkit/sell/persona'); }, []);
    
    const handleInputChange = (field: keyof Persona, value: string) => {
        setPersona(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerate = async () => {
        if (!persona.goals || !persona.challenges) {
            showToast('Please fill in Goals and Challenges.', 'error');
            return;
        }
        setIsLoading(true);
        generate_persona({});
        const result = await generatePersonaSummary(persona, brand.voice?.personality);
        setPersona(prev => ({ ...prev, summary: result.summary, insights: result.insights }));
        setIsLoading(false);
    };

    const handleSave = () => {
        if (user.plan === 'free' && !user.isFoundingMember && sell.persona?.personas && sell.persona.personas.length > 0 && sell.persona.personas[0].id !== persona.id) {
            showToast('Free plan is limited to 1 persona. Upgrade for more.', 'error');
            navigate('/paywall', { state: { from: 'save', feature: 'Multiple Personas' } });
            return;
        }
        updateSell({ persona: { personas: [persona as Persona], updatedAt: new Date().toISOString() } });
        save_state('sell.persona');
        showToast('Persona saved.', 'success');
    };

    const handleExport = () => {
        if (user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', { state: { from: 'export', feature: 'Export Persona' } });
            return;
        }
        export_doc('Persona PDF');
        showToast('Exporting persona...', 'success');
    };

    return (
        <div className="max-w-6xl mx-auto pb-24">
            <Breadcrumb />
            <h1 className="text-3xl font-bold">Customer Persona Builder</h1>
            <p className="text-gray-600 mb-6">Define who you’re selling to, so every message hits the mark.</p>
            
            <div className="grid lg:grid-cols-2 gap-8">
                <Card className="p-6 space-y-4">
                    <h2 className="text-xl font-bold">Persona Details</h2>
                    <input placeholder="Persona Name (e.g., Budget Homeowner)*" value={persona.name || ''} onChange={e => handleInputChange('name', e.target.value)} className="w-full p-2 border rounded" />
                    <textarea placeholder="Goals*" value={persona.goals || ''} onChange={e => handleInputChange('goals', e.target.value)} className="w-full p-2 border rounded" rows={3}/>
                    <textarea placeholder="Challenges / Pain Points*" value={persona.challenges || ''} onChange={e => handleInputChange('challenges', e.target.value)} className="w-full p-2 border rounded" rows={3}/>
                    <textarea placeholder="Interests / Media Habits" value={persona.interests || ''} onChange={e => handleInputChange('interests', e.target.value)} className="w-full p-2 border rounded" rows={3}/>
                    <select value={persona.motivation || ''} onChange={e => handleInputChange('motivation', e.target.value)} className="w-full p-2 border rounded">
                        <option value="">-- Buying Motivation --</option>
                        {['Price', 'Quality', 'Convenience', 'Trust', 'Status'].map(m => <option key={m}>{m}</option>)}
                    </select>
                    <div className="text-center pt-4">
                        <Button onClick={handleGenerate} disabled={isLoading}>{isLoading ? 'Generating...' : '✨ Generate Persona Summary'}</Button>
                    </div>
                </Card>
                <Card className="p-6 space-y-4 bg-gray-50">
                    <h2 className="text-xl font-bold">AI-Generated Summary</h2>
                    {persona.summary ? (
                        <>
                            <textarea value={persona.summary} onChange={e => handleInputChange('summary', e.target.value)} className="w-full p-2 border rounded bg-white" rows={5}/>
                            <h3 className="font-semibold pt-4">Quick Insights:</h3>
                            <ul className="list-disc list-inside text-sm space-y-2">
                               {persona.insights && Object.entries(persona.insights).map(([key, value]) => <li key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {value as string}</li>)}
                            </ul>
                        </>
                    ) : (
                        <div className="text-center text-gray-500 py-16">Fill in details and generate a summary.</div>
                    )}
                </Card>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4 z-10">
                <div className="container mx-auto max-w-6xl flex justify-between items-center">
                    <Button variant="secondary" onClick={() => navigate('/toolkit/sell')}>Back to Sell</Button>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleSave}>Save Persona</Button>
                        <Button variant="outline" onClick={() => { click_button('Send to Marketing Plan'); navigate('/toolkit/sell/marketing')}}>Send to Marketing Plan</Button>
                        <Button onClick={handleExport}>Export Persona (PDF)</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonaPage;
