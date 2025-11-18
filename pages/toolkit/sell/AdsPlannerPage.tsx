import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { view_page, save_state, export_doc, calculate_roi } from '../../../utils/analytics';
import type { AdsPlannerData } from '../../../types';

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/sell" className="hover:underline">Sell</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">Ad Budget Planner</span>
    </nav>
);

const channelOptions = ['Meta', 'Google', 'TikTok', 'LinkedIn'];

const AdsPlannerPage: React.FC = () => {
    const navigate = useNavigate();
    const { sell, updateSell, user, showToast } = useAppContext();
    // FIX: Ensure initial state conforms to AdsPlannerData type.
    const [data, setData] = useState<AdsPlannerData>(
        sell.ads?.inputs
        ? (sell.ads as AdsPlannerData)
        : { inputs: { monthlyBudget: 1000, duration: 3, avgOrderValue: 50, channels: { Meta: { cpc: 1.5, conversionRate: 2 } } } }
    );

    useEffect(() => { view_page('/toolkit/sell/ads'); }, []);

    const handleChannelToggle = (channel: string) => {
        const newChannels = { ...data.inputs.channels };
        if (newChannels[channel]) {
            delete newChannels[channel];
        } else {
            newChannels[channel] = { cpc: 1, conversionRate: 1 };
        }
        setData(prev => ({ ...prev, inputs: { ...prev.inputs, channels: newChannels } }));
    };

    const handleCalculate = () => {
        calculate_roi({});
        const { monthlyBudget, avgOrderValue, channels } = data.inputs;
        if (!monthlyBudget || Object.keys(channels).length === 0) {
            showToast('Budget and at least one channel are required.', 'error');
            return;
        }
        const spendPerChannel = monthlyBudget / Object.keys(channels).length;
        
        // FIX: Cast `metrics` to a specific type to avoid TypeScript errors when accessing its properties and spreading it.
        const table = Object.entries(channels).map(([name, metrics]) => {
            const typedMetrics = metrics as { cpc: number; conversionRate: number };
            const clicks = spendPerChannel / typedMetrics.cpc;
            const conversions = clicks * (typedMetrics.conversionRate / 100);
            const revenue = conversions * avgOrderValue;
            const roi = spendPerChannel > 0 ? ((revenue - spendPerChannel) / spendPerChannel) * 100 : 0;
            return { channel: name, spend: spendPerChannel, ...typedMetrics, clicks, conversions, revenue, roi };
        });

        const totalRevenue = table.reduce((sum, item) => sum + item.revenue, 0);
        const overallRoi = monthlyBudget > 0 ? ((totalRevenue - monthlyBudget) / monthlyBudget) * 100 : 0;

        setData(prev => ({...prev, results: { table, totalSpend: monthlyBudget, totalRevenue, overallRoi }}));
        showToast('ROI calculated!', 'success');
    };

    const handleSave = () => {
        updateSell({ ads: { ...data, updatedAt: new Date().toISOString() } });
        save_state('sell.ads');
        showToast('Ad budget saved.', 'success');
    };

    const handleExport = () => {
        if(user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', {state: {from: 'export', feature: 'Export Ad Budget'}});
            return;
        }
        export_doc('Ad Budget Sheet');
        showToast('Exporting sheet...', 'success');
    };

    return (
        <div className="max-w-6xl mx-auto pb-24">
            <Breadcrumb />
            <h1 className="text-3xl font-bold">Ad Budget Planner</h1>
            <p className="text-gray-600 mb-6">Plan your ad spend and estimate your returns.</p>

            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="p-6 space-y-4 lg:col-span-1">
                    <h2 className="text-xl font-bold">Inputs</h2>
                    <input type="number" placeholder="Monthly Budget*" value={data.inputs.monthlyBudget || ''} onChange={e => setData({...data, inputs: {...data.inputs, monthlyBudget: parseFloat(e.target.value)}})} className="w-full p-2 border rounded"/>
                    <input type="number" placeholder="Avg. Order Value ($)*" value={data.inputs.avgOrderValue || ''} onChange={e => setData({...data, inputs: {...data.inputs, avgOrderValue: parseFloat(e.target.value)}})} className="w-full p-2 border rounded"/>
                    <div className="space-y-2">
                        <label className="font-semibold">Channels</label>
                        {channelOptions.map(c => (
                            <div key={c}><label><input type="checkbox" checked={!!data.inputs.channels[c]} onChange={() => handleChannelToggle(c)}/> {c}</label></div>
                        ))}
                    </div>
                    <Button onClick={handleCalculate} className="w-full">Calculate ROI</Button>
                </Card>
                <Card className="p-6 lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Results</h2>
                    {data.results ? (
                        <>
                            {data.results.overallRoi < 0 && <Badge color="red" className="mb-4">Negative ROI — revise plan.</Badge>}
                            <div className="grid grid-cols-3 gap-4 text-center mb-4">
                                <div><p className="text-sm">Total Spend</p><p className="font-bold text-lg">${data.results.totalSpend.toFixed(2)}</p></div>
                                <div><p className="text-sm">Total Revenue</p><p className="font-bold text-lg">${data.results.totalRevenue.toFixed(2)}</p></div>
                                <div><p className="text-sm">Overall ROI</p><p className="font-bold text-lg text-accent">{data.results.overallRoi.toFixed(1)}%</p></div>
                            </div>
                            <table className="w-full text-sm">
                                <thead><tr className="border-b"><th className="p-1 text-left">Channel</th><th className="p-1">Spend</th><th className="p-1">Est. Clicks</th><th className="p-1">Est. Conversions</th><th className="p-1">Revenue</th><th className="p-1">ROI</th></tr></thead>
                                <tbody>
                                    {data.results.table.map(row => (
                                        <tr key={row.channel} className="border-b">
                                            <td className="p-1 font-semibold">{row.channel}</td>
                                            <td className="p-1 text-center">${row.spend.toFixed(2)}</td>
                                            <td className="p-1 text-center">{row.clicks.toFixed(0)}</td>
                                            <td className="p-1 text-center">{row.conversions.toFixed(1)}</td>
                                            <td className="p-1 text-center">${row.revenue.toFixed(2)}</td>
                                            <td className={`p-1 text-center font-bold ${row.roi > 0 ? 'text-green-600' : 'text-red-500'}`}>{row.roi.toFixed(1)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : <p className="text-gray-500 text-center py-16">Enter inputs and calculate to see results.</p>}
                </Card>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4 z-10">
                <div className="container mx-auto max-w-6xl flex justify-between items-center">
                    <Button variant="secondary" onClick={() => navigate('/toolkit/sell')}>Back to Sell</Button>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleSave}>Save Budget Plan</Button>
                        <Button onClick={handleExport}>Export Budget Sheet</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdsPlannerPage;
