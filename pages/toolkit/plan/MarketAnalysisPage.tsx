import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { view_page, save_state, export_doc, click_button } from '../../../utils/analytics';
import type { Competitor } from '../../../types';
import { generateNicheSuggestions } from '../../../services/geminiService';

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/plan" className="hover:underline">Plan</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">Market Analysis</span>
    </nav>
);

const MarketAnalysisPage: React.FC = () => {
    const navigate = useNavigate();
    const { plan, updatePlan, user, showToast } = useAppContext();
    const [marketData, setMarketData] = useState(plan.market || { competitors: [], nicheSuggestions: [] });
    const [hasGenerated, setHasGenerated] = useState(!!plan.market?.demand);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { view_page('/toolkit/plan/market'); }, []);

    const handleGenerate = async () => {
        click_button('Generate Snapshot');
        if (!marketData.location || !marketData.keywords) {
            showToast('Location and Industry/Keywords are required.', 'error');
            return;
        }
        setIsLoading(true);
        setHasGenerated(true);
        // Clear previous data while loading new data
        setMarketData(prev => ({
            ...prev,
            demand: '',
            pricingBands: undefined,
            customerSegments: [],
            swot: undefined,
            gapScore: 0,
            nicheSuggestions: [],
        }));


        // AI call for niche suggestions
        const suggestionsPromise = generateNicheSuggestions(marketData.keywords, marketData.location);

        // Mock data for other fields
        const mockMarketData = {
            demand: 'Demand is currently high, with a projected 15% year-over-year growth. Seasonality peaks in summer.',
            pricingBands: { entry: '$15/hr', median: '$25/hr', premium: '$50+/hr' },
            customerSegments: ['Busy professionals seeking convenience', 'Eco-conscious families', 'Small local businesses'],
            swot: {
                strengths: 'Unique eco-friendly angle.',
                weaknesses: 'Limited brand recognition.',
                opportunities: 'Growing market, potential for partnerships.',
                threats: 'High competition from established players.'
            },
            gapScore: 78
        };
        
        const suggestions = await suggestionsPromise;

        setMarketData(prev => ({
            ...prev,
            ...mockMarketData,
            nicheSuggestions: suggestions
        }));
        
        setIsLoading(false);
        showToast('Market snapshot and niche suggestions generated!', 'success');
    };

    const handleSave = () => {
        updatePlan({ market: { ...marketData, updatedAt: new Date().toISOString() }});
        save_state('plan.market');
        showToast('Market analysis saved.', 'success');
    };

    const handleExport = () => {
        if (user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', { state: { from: 'export-pdf', feature: 'Market Analysis Export' } });
            return;
        }
        export_doc('Market Analysis PDF');
        showToast('Exporting as PDF...', 'success');
    };
    
    const handleSendToPricing = () => {
        if (user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', { state: { from: 'send-data', feature: 'Send to Pricing' } });
            return;
        }
        click_button('Send Pricing Bands to Calculator');
        // A real implementation would parse numbers from strings
        const suggestedBands = { entry: 15, median: 25, premium: 50 };
        updatePlan({ pricing: { ...plan.pricing, suggestedBands } });
        showToast('Pricing bands sent to calculator!', 'success');
    };
    
    const handleSendToPlan = () => {
         if (user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', { state: { from: 'send-data', feature: 'Send to Business Plan' } });
            return;
        }
        click_button('Send Insights to Business Plan');
        const insights = `Based on recent market analysis, the demand is high. Key customer segments include: ${marketData.customerSegments?.join(', ')}. The competitive landscape is challenging but offers opportunities.`;
        const currentMarketOverview = plan.businessPlan.market || '';
        updatePlan({ businessPlan: { ...plan.businessPlan, market: `${currentMarketOverview}\n\n[Market Analysis Insight - ${new Date().toLocaleDateString()}]:\n${insights}` } });
        showToast('Insights appended to business plan!', 'success');
    }

    const handleCompetitorChange = (index: number, field: keyof Competitor, value: string) => {
        const updatedCompetitors = [...(marketData.competitors || [])];
        updatedCompetitors[index] = { ...updatedCompetitors[index], [field]: value };
        setMarketData(prev => ({ ...prev, competitors: updatedCompetitors }));
    };

    const addCompetitor = () => {
        const newCompetitor: Competitor = { id: Date.now().toString(), name: '', offer: '', pricing: '', strengths: '', weaknesses: '', link: '' };
        setMarketData(prev => ({ ...prev, competitors: [...(prev.competitors || []), newCompetitor] }));
    };

    const removeCompetitor = (id: string) => {
        setMarketData(prev => ({ ...prev, competitors: (prev.competitors || []).filter(c => c.id !== id) }));
    };

    const handleSuggestionChange = (index: number, value: string) => {
        const updatedSuggestions = [...(marketData.nicheSuggestions || [])];
        updatedSuggestions[index] = value;
        setMarketData(prev => ({ ...prev, nicheSuggestions: updatedSuggestions }));
    };

    return (
        <div className="max-w-6xl mx-auto pb-24">
            <Breadcrumb />
            <h1 className="text-3xl font-bold">Market & Competitor Analysis</h1>
            <p className="text-gray-600 mb-6">Understand demand, competition, and your unique edge.</p>

            <Card className="p-6 mb-8">
                <div className="grid md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block font-semibold">Location*</label>
                        <input type="text" value={marketData.location || ''} onChange={e => setMarketData(prev => ({ ...prev, location: e.target.value }))} className="w-full p-2 border rounded-md" placeholder="e.g., San Diego, CA" />
                    </div>
                    <div>
                        <label className="block font-semibold">Industry/Keywords*</label>
                        <input type="text" value={marketData.keywords || ''} onChange={e => setMarketData(prev => ({ ...prev, keywords: e.target.value }))} className="w-full p-2 border rounded-md" placeholder="e.g., coffee shop, cafe" />
                    </div>
                    <div>
                        <Button onClick={handleGenerate} className="w-full" disabled={isLoading}>
                           {isLoading ? 'Generating...' : 'Generate Snapshot'}
                        </Button>
                    </div>
                </div>
            </Card>

            {hasGenerated && (
                <div className="space-y-6">
                    {/* Snapshot Boxes */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="p-4"><h3 className="font-bold">Demand Snapshot</h3><p className="text-sm">{isLoading ? 'Loading...' : marketData.demand}</p></Card>
                        <Card className="p-4"><h3 className="font-bold">Pricing Bands</h3><p className="text-sm">{isLoading ? 'Loading...' : `Entry: ${marketData.pricingBands?.entry}, Median: ${marketData.pricingBands?.median}, Premium: ${marketData.pricingBands?.premium}`}</p></Card>
                        <Card className="p-4"><h3 className="font-bold">Customer Segments</h3>{isLoading ? <p className="text-sm">Loading...</p> : <ul className="list-disc list-inside text-sm">{marketData.customerSegments?.map(s => <li key={s}>{s}</li>)}</ul>}</Card>
                    </div>
                    {/* Competitors */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4">Competitors</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="p-2 text-left">Name</th>
                                        <th className="p-2 text-left">Offer</th>
                                        <th className="p-2 text-left">Pricing</th>
                                        <th className="p-2 text-left">Strengths</th>
                                        <th className="p-2 text-left">Weaknesses</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(marketData.competitors || []).map((comp, index) => (
                                        <tr key={comp.id} className="border-b">
                                            <td><input value={comp.name} onChange={e => handleCompetitorChange(index, 'name', e.target.value)} className="p-1 w-full border rounded" /></td>
                                            <td><input value={comp.offer} onChange={e => handleCompetitorChange(index, 'offer', e.target.value)} className="p-1 w-full border rounded" /></td>
                                            <td><input value={comp.pricing} onChange={e => handleCompetitorChange(index, 'pricing', e.target.value)} className="p-1 w-24 border rounded" /></td>
                                            <td><input value={comp.strengths} onChange={e => handleCompetitorChange(index, 'strengths', e.target.value)} className="p-1 w-full border rounded" /></td>
                                            <td><input value={comp.weaknesses} onChange={e => handleCompetitorChange(index, 'weaknesses', e.target.value)} className="p-1 w-full border rounded" /></td>
                                            <td><button onClick={() => removeCompetitor(comp.id)} className="text-red-500 p-1">✖</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Button onClick={addCompetitor} variant="outline" className="mt-4 text-sm">Add Competitor</Button>
                    </Card>
                    {/* SWOT & Gap Score */}
                     <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-4">SWOT Analysis</h2>
                             {isLoading ? <p className="text-sm">Loading...</p> : 
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><h4 className="font-semibold">Strengths</h4><textarea value={marketData.swot?.strengths || ''} onChange={e => setMarketData(prev => ({...prev, swot: {...prev.swot, strengths: e.target.value}}))} className="w-full border rounded p-1"/></div>
                                    <div><h4 className="font-semibold">Weaknesses</h4><textarea value={marketData.swot?.weaknesses || ''} onChange={e => setMarketData(prev => ({...prev, swot: {...prev.swot, weaknesses: e.target.value}}))} className="w-full border rounded p-1"/></div>
                                    <div><h4 className="font-semibold">Opportunities</h4><textarea value={marketData.swot?.opportunities || ''} onChange={e => setMarketData(prev => ({...prev, swot: {...prev.swot, opportunities: e.target.value}}))} className="w-full border rounded p-1"/></div>
                                    <div><h4 className="font-semibold">Threats</h4><textarea value={marketData.swot?.threats || ''} onChange={e => setMarketData(prev => ({...prev, swot: {...prev.swot, threats: e.target.value}}))} className="w-full border rounded p-1"/></div>
                                </div>
                            }
                        </Card>
                        <Card className="p-6 text-center flex flex-col justify-center">
                            <h2 className="text-xl font-bold mb-2">Market Gap Score</h2>
                            {isLoading ? <p className="text-6xl font-extrabold text-gray-400">...</p> : <p className="text-6xl font-extrabold text-accent">{marketData.gapScore}</p>}
                            <p className="text-gray-500">Based on demand and competition.</p>
                        </Card>
                    </div>
                    {/* Niche Suggestions */}
                     <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4">💡 Niche Opportunities & USPs</h2>
                        <p className="text-sm text-gray-500 mb-4">AI-generated ideas to help you stand out. These are fully editable.</p>
                        {isLoading ? (
                            <div className="text-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                                <p className="mt-2 text-gray-500">Generating suggestions...</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {(marketData.nicheSuggestions || []).map((suggestion, index) => (
                                    <textarea
                                        key={index}
                                        value={suggestion}
                                        onChange={(e) => handleSuggestionChange(index, e.target.value)}
                                        className="w-full p-2 border rounded bg-amber-50"
                                        rows={2}
                                    />
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            )}
            
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4 z-10">
                <div className="container mx-auto max-w-6xl flex flex-wrap gap-4 justify-between items-center">
                    <Button variant="secondary" onClick={() => navigate('/toolkit/plan')}>Back to Plan</Button>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={handleSendToPricing} disabled={!hasGenerated || isLoading}>Send Pricing Bands to Calculator</Button>
                        <Button variant="outline" onClick={handleSendToPlan} disabled={!hasGenerated || isLoading}>Send Insights to Business Plan</Button>
                        <Button variant="outline" onClick={handleSave}>Save Analysis</Button>
                        <Button onClick={handleExport} disabled={!hasGenerated || isLoading}>Export PDF</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketAnalysisPage;