import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { view_page, save_state, export_doc, generate_charts } from '../../../utils/analytics';

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/grow" className="hover:underline">Grow</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">Performance</span>
    </nav>
);

const KPICard: React.FC<{title: string; value: string | number}> = ({title, value}) => (
    <Card className="p-4 text-center">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
    </Card>
);

const PerformancePage: React.FC = () => {
    const navigate = useNavigate();
    // FIX: Removed `milestones` from destructuring as it's not a direct property of the AppContext. It's accessed via `grow.milestones`.
    const { grow, updateGrow, user, showToast, finance, sell } = useAppContext();
    const [kpis, setKpis] = useState<any>({});
    const hasData = finance.cashflow?.rows && finance.cashflow.rows.some(r => r.revenue > 0);

    useEffect(() => {
        view_page('/toolkit/grow/performance');
        refreshData();
    }, []);
    
    const refreshData = () => {
        generate_charts();
        const lastMonth = finance.cashflow?.rows?.[new Date().getMonth()];
        const monthlyRevenue = lastMonth?.revenue || 0;
        const monthlyExpenses = (lastMonth?.fixedCosts || 0) + (lastMonth?.variableCosts || 0);
        const leads = sell.crm?.leads || [];
        const conversionRate = leads.length > 0 ? (leads.filter(l => l.stage === 'Won').length / leads.length) * 100 : 0;
        const milestonesList = grow.milestones?.list || [];
        const milestonesComplete = milestonesList.length > 0 ? (milestonesList.filter(m => m.status === 'Complete').length / milestonesList.length) * 100 : 0;

        setKpis({
            monthlyRevenue: monthlyRevenue.toFixed(2),
            monthlyExpenses: monthlyExpenses.toFixed(2),
            netProfit: (monthlyRevenue - monthlyExpenses).toFixed(2),
            roi: finance.projections?.results?.kpis?.roi || 'N/A',
            conversionRate: conversionRate.toFixed(1) + '%',
            milestonesComplete: milestonesComplete.toFixed(0) + '%'
        });
        showToast('Data refreshed!', 'success');
    }

    const handleSave = () => {
        updateGrow({ performance: { kpis, updatedAt: new Date().toISOString() } });
        save_state('grow.performance');
        showToast('Performance snapshot saved.', 'success');
    };

    const handleExport = () => {
        if (user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', { state: { from: 'export', feature: 'Export Performance Report' } });
            return;
        }
        export_doc('Performance Report PDF');
        showToast('Exporting report...', 'success');
    };
    
    return (
        <div className="max-w-6xl mx-auto pb-24">
            <Breadcrumb />
            <h1 className="text-3xl font-bold">Performance Dashboard</h1>
            <p className="text-gray-600 mb-6">Measure progress and visualize your key metrics.</p>
            
            {!hasData ? (
                <Card className="p-8 text-center text-gray-500">
                    <p>Awaiting data from your Finance and Sell toolkits.</p>
                    <p>Enter some cashflow or lead data to see your dashboard.</p>
                </Card>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <KPICard title="Monthly Revenue" value={`$${kpis.monthlyRevenue}`} />
                        <KPICard title="Monthly Expenses" value={`$${kpis.monthlyExpenses}`} />
                        <KPICard title="Net Profit" value={`$${kpis.netProfit}`} />
                        <KPICard title="Projected ROI" value={`${kpis.roi}%`} />
                        <KPICard title="Conversion Rate" value={kpis.conversionRate} />
                        <KPICard title="Milestones" value={kpis.milestonesComplete} />
                    </div>
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card className="p-4 h-64 flex items-center justify-center text-gray-400">Revenue vs Expenses Chart</Card>
                        <Card className="p-4 h-64 flex items-center justify-center text-gray-400">Leads vs Conversions Chart</Card>
                    </div>
                </div>
            )}
            
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4 z-10">
                <div className="container mx-auto max-w-6xl flex justify-between items-center">
                    <Button variant="secondary" onClick={() => navigate('/toolkit/grow')}>Back to Grow</Button>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={refreshData}>Refresh Data</Button>
                        <Button variant="outline" onClick={handleSave}>Save Snapshot</Button>
                        <Button onClick={handleExport}>Export Report (PDF)</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformancePage;
