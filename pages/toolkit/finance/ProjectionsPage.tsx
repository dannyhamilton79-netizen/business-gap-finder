
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { view_page, save_state, export_doc, generate_projections, click_button } from '../../../utils/analytics';
import { ProjectionsData } from '../../../types';

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/finance" className="hover:underline">Finance</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">Financial Projections</span>
    </nav>
);

// FIX: Provide a complete default object for inputs to satisfy the ProjectionsData['inputs'] type.
const defaultInputs: ProjectionsData['inputs'] = {
    period: 1,
    revenueGrowth: 0,
    expenseGrowth: 0,
    taxRate: 0,
    startupCosts: 0,
    startingRevenue: 0,
    startingExpenses: 0,
    investment: 0,
};

const ProjectionsPage: React.FC = () => {
    const navigate = useNavigate();
    const { finance, updateFinance, user, showToast, plan } = useAppContext();
    const [inputs, setInputs] = useState(finance.projections?.inputs || defaultInputs);
    const [results, setResults] = useState(finance.projections?.results || {});

    useEffect(() => {
        view_page('/toolkit/finance/projections');
        // Prefill from other tools on mount
        const pricing = plan.pricing;
        if (pricing?.results?.monthlyRevenue && !inputs.startingRevenue) {
            setInputs(prev => ({
                ...prev,
                startupCosts: pricing.startupCosts || 0,
                startingRevenue: pricing.results.monthlyRevenue || 0,
                startingExpenses: (pricing.fixedMonthlyCosts || 0) + ((pricing.variableCost || 0) * (pricing.volumePerWeek || 0) * 4.33),
            }));
        }
    }, []);

    const handleGenerate = () => {
        generate_projections();
        if(!inputs.startingRevenue || !inputs.startingExpenses) {
            showToast('Please provide starting revenue and expenses.', 'error');
            return;
        }

        const summaryTable = [];
        let currentRevenue = inputs.startingRevenue * 12;
        let currentExpenses = inputs.startingExpenses * 12;
        
        for(let i=1; i <= inputs.period; i++) {
            if(i > 1) {
                currentRevenue *= (1 + (inputs.revenueGrowth / 100));
                currentExpenses *= (1 + (inputs.expenseGrowth / 100));
            }
            const profit = currentRevenue - currentExpenses;
            const margin = currentRevenue > 0 ? (profit / currentRevenue) * 100 : 0;
            summaryTable.push({ year: i, revenue: currentRevenue, expenses: currentExpenses, profit, margin });
        }
        
        const totalProfit = summaryTable.reduce((acc, year) => acc + year.profit, 0);
        const totalInvestment = (inputs.startupCosts || 0) + (inputs.investment || 0);
        const roi = totalInvestment > 0 ? ((totalProfit - totalInvestment) / totalInvestment) * 100 : Infinity;

        setResults({ summaryTable, kpis: { roi: roi.toFixed(1) } });
        showToast('Projections generated!', 'success');
    };

    const handleSave = () => {
        updateFinance({ projections: { inputs, results, updatedAt: new Date().toISOString() } });
        save_state('finance.projections');
        showToast('Projections saved.', 'success');
    };

    const handleExport = () => {
        if (user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', { state: { from: 'export', feature: 'Export Projections' } });
            return;
        }
        export_doc('Projections PDF');
        showToast('Exporting PDF...', 'success');
    };

    return (
        <div className="max-w-6xl mx-auto pb-24">
            <Breadcrumb />
            <h1 className="text-3xl font-bold">Financial Projections</h1>
            <p className="text-gray-600 mb-6">Forecast your growth and see when you’ll turn a profit.</p>
            
            <div className="grid lg:grid-cols-2 gap-8">
                <Card className="p-6 space-y-4">
                    <h2 className="text-xl font-bold">Inputs</h2>
                    <select value={inputs.period} onChange={e => setInputs({...inputs, period: parseInt(e.target.value)})} className="w-full p-2 border rounded">
                        <option value={1}>1 Year</option>
                        <option value={3}>3 Years</option>
                    </select>
                    <input type="number" placeholder="Revenue Growth Rate %" value={inputs.revenueGrowth || ''} onChange={e => setInputs({...inputs, revenueGrowth: parseFloat(e.target.value)})} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Expense Growth Rate %" value={inputs.expenseGrowth || ''} onChange={e => setInputs({...inputs, expenseGrowth: parseFloat(e.target.value)})} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="One-time Startup Costs" value={inputs.startupCosts || ''} onChange={e => setInputs({...inputs, startupCosts: parseFloat(e.target.value)})} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Starting Monthly Revenue*" value={inputs.startingRevenue || ''} onChange={e => setInputs({...inputs, startingRevenue: parseFloat(e.target.value)})} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Starting Monthly Expenses*" value={inputs.startingExpenses || ''} onChange={e => setInputs({...inputs, startingExpenses: parseFloat(e.target.value)})} className="w-full p-2 border rounded" />
                    <Button onClick={handleGenerate} className="w-full">Generate Projections</Button>
                </Card>

                <Card className="p-6 space-y-4 bg-gray-50">
                    <h2 className="text-xl font-bold">Outputs</h2>
                    {results.summaryTable ? (
                        <>
                            <table className="w-full text-sm">
                                <thead><tr className="border-b"><th className="p-1">Year</th><th className="p-1">Revenue</th><th className="p-1">Expenses</th><th className="p-1">Profit</th><th className="p-1">Margin</th></tr></thead>
                                <tbody>{results.summaryTable.map((y:any) => <tr key={y.year}><td className="p-1">{y.year}</td><td className="p-1">${y.revenue.toFixed(0)}</td><td className="p-1">${y.expenses.toFixed(0)}</td><td className="p-1">${y.profit.toFixed(0)}</td><td className="p-1">{y.margin.toFixed(1)}%</td></tr>)}</tbody>
                            </table>
                            <div className="text-center bg-white p-2 rounded"><strong>{inputs.period}-Year ROI:</strong> <span className="text-accent font-bold text-lg">{results.kpis?.roi}%</span></div>
                            {results.summaryTable[0].margin < 10 && <Badge color="yellow">Tight margins - revisit pricing.</Badge>}
                        </>
                    ) : <p className="text-gray-500">Generate projections to see results.</p>}
                </Card>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4 z-10">
                <div className="container mx-auto max-w-6xl flex justify-between items-center">
                    <Button variant="secondary" onClick={() => navigate('/toolkit/finance')}>Back to Finance</Button>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleSave} disabled={!results.summaryTable}>Save Projections</Button>
                        <Button onClick={handleExport} disabled={!results.summaryTable}>Export PDF</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectionsPage;
