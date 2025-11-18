
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { view_page, save_state, export_doc, generate_marketing_plan } from '../../../utils/analytics';
import { generateMarketingPlan } from '../../../services/geminiService';
import type { MarketingTimelineItem } from '../../../types';

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/sell" className="hover:underline">Sell</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">Marketing Plan</span>
    </nav>
);

const channels = ['Social', 'Email', 'Events', 'Ads', 'Partnerships', 'SEO'];

const MarketingPlanPage: React.FC = () => {
    const navigate = useNavigate();
    const { sell, updateSell, user, showToast, brand } = useAppContext();
    const [plan, setPlan] = useState(sell.marketing || { channels: [], timeline: [] });
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => { view_page('/toolkit/sell/marketing'); }, []);

    const handleChannelToggle = (channel: string) => {
        const updatedChannels = plan.channels?.includes(channel)
            ? plan.channels.filter(c => c !== channel)
            : [...(plan.channels || []), channel];
        setPlan(prev => ({ ...prev, channels: updatedChannels }));
    };

    const handleGenerate = async () => {
        if (!plan.goal || !plan.channels || plan.channels.length === 0) {
            showToast('Please set a goal and select at least one channel.', 'error');
            return;
        }
        setIsLoading(true);
        generate_marketing_plan({});
        const timeline = await generateMarketingPlan(plan, brand.voice?.personality);
        setPlan(prev => ({ ...prev, timeline }));
        setIsLoading(false);
    };

    const handleSave = () => {
        updateSell({ marketing: { ...plan, updatedAt: new Date().toISOString() } });
        save_state('sell.marketing');
        showToast('Marketing plan saved.', 'success');
    };
    
    const handleExport = () => {
        if(user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', {state: {from: 'export', feature: 'Export Marketing Plan'}});
            return;
        }
        export_doc('Marketing Plan PDF');
        showToast('Exporting plan...', 'success');
    };

    return (
        <div className="max-w-6xl mx-auto pb-24">
            <Breadcrumb />
            <h1 className="text-3xl font-bold">Marketing Plan Builder</h1>
            <p className="text-gray-600 mb-6">Craft your campaigns and map your customer journey.</p>
            
            <Card className="p-6 mb-8">
                <div className="grid md:grid-cols-2 gap-4">
                    <input placeholder="Business Goal*" value={plan.goal || ''} onChange={e => setPlan({...plan, goal: e.target.value})} className="p-2 border rounded" />
                    <select value={plan.focus || ''} onChange={e => setPlan({...plan, focus: e.target.value})} className="p-2 border rounded">
                        <option>-- Campaign Focus --</option>
                        {['Brand Awareness', 'Lead Gen', 'Sales', 'Retention'].map(f => <option key={f}>{f}</option>)}
                    </select>
                </div>
                <div className="mt-4">
                    <label className="font-semibold">Primary Channels*</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {channels.map(c => <Button key={c} variant={plan.channels?.includes(c) ? 'primary' : 'outline'} onClick={() => handleChannelToggle(c)}>{c}</Button>)}
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">3-Month Sample Plan</h2>
                    <Button onClick={handleGenerate} disabled={isLoading}>{isLoading ? 'Generating...' : '✨ Generate Sample Plan'}</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b"><th className="p-2 text-left">Month</th><th className="p-2 text-left">Focus</th><th className="p-2 text-left">Activities</th><th className="p-2 text-left">Outcome</th></tr></thead>
                        <tbody>
                            {(plan.timeline || []).map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-2">{item.month}</td>
                                    <td className="p-2">{item.focus}</td>
                                    <td className="p-2">{item.activities}</td>
                                    <td className="p-2">{item.outcome}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4 z-10">
                <div className="container mx-auto max-w-6xl flex justify-between items-center">
                    <Button variant="secondary" onClick={() => navigate('/toolkit/sell')}>Back to Sell</Button>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleSave}>Save Plan</Button>
                        <Button onClick={handleExport}>Export Plan (PDF)</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketingPlanPage;
