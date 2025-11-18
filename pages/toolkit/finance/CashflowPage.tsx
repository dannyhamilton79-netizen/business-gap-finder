
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { view_page, save_state, export_doc, click_button } from '../../../utils/analytics';
import type { CashflowRow } from '../../../types';

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/finance" className="hover:underline">Finance</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">Cashflow Template</span>
    </nav>
);

const CashflowPage: React.FC = () => {
    const navigate = useNavigate();
    const { finance, updateFinance, user, showToast, plan } = useAppContext();
    const [cashflow, setCashflow] = useState(finance.cashflow || { rows: [], startingBalance: 0 });

    useEffect(() => { view_page('/toolkit/finance/cashflow'); }, []);

    const handleRowChange = (index: number, field: keyof CashflowRow, value: string) => {
        const updatedRows = [...(cashflow.rows || [])];
        updatedRows[index] = { ...updatedRows[index], [field]: parseFloat(value) || 0 };
        setCashflow(prev => ({ ...prev, rows: updatedRows }));
    };

    const handleSave = () => {
        updateFinance({ cashflow: { ...cashflow, updatedAt: new Date().toISOString() } });
        save_state('finance.cashflow');
        showToast('Cashflow saved.', 'success');
    };

    const handleExport = () => {
        if (user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', { state: { from: 'export', feature: 'Export Cashflow Sheet' } });
            return;
        }
        export_doc('Cashflow XLSX');
        showToast('Exporting as XLSX...', 'success');
    };
    
    const handleImportFromPlan = () => {
        // FIX: Correctly destructure properties from plan.pricing and plan.pricing.results.
        if(plan.pricing?.results?.monthlyRevenue) {
            const { monthlyRevenue } = plan.pricing.results;
            const { fixedMonthlyCosts, variableCost, volumePerWeek } = plan.pricing;
            
            const monthlyVariableCosts = (variableCost || 0) * (volumePerWeek || 0) * 4.33;
            
            const updatedRows = (cashflow.rows || []).map(row => ({
                ...row,
                revenue: monthlyRevenue,
                fixedCosts: fixedMonthlyCosts || 0,
                variableCosts: monthlyVariableCosts
            }));
            setCashflow(prev => ({...prev, rows: updatedRows}));
            showToast('Data imported from Pricing Calculator!', 'success');
        } else {
            showToast('No pricing data found in your plan to import.', 'error');
        }
    }

    let cumulativeCash = cashflow.startingBalance || 0;

    return (
        <div className="max-w-6xl mx-auto pb-24">
            <Breadcrumb />
            <h1 className="text-3xl font-bold">Cashflow Template</h1>
            <p className="text-gray-600 mb-6">Estimate your monthly inflows and outflows.</p>

            <Card className="p-6 mb-6">
                <div className="flex items-end gap-4">
                    <div>
                        <label className="font-semibold">Starting Balance</label>
                        <input type="number" value={cashflow.startingBalance || ''} onChange={e => setCashflow(prev => ({...prev, startingBalance: parseFloat(e.target.value) || 0}))} className="w-full p-2 border rounded-md" />
                    </div>
                    <Button onClick={handleImportFromPlan} variant='outline'>Import from Plan → Pricing</Button>
                </div>
            </Card>

            <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">12-Month Cashflow</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Month', 'Revenue', 'Fixed Costs', 'Variable Costs', 'Net Cashflow', 'Cumulative Cash'].map(h => <th key={h} className="p-2 font-semibold">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {cashflow.rows?.map((row, index) => {
                                const netCashflow = row.revenue - row.fixedCosts - row.variableCosts + row.otherIncome - row.otherExpenses;
                                cumulativeCash += netCashflow;
                                return (
                                    <tr key={index} className="border-b">
                                        <td className="p-2 font-semibold">{row.month}</td>
                                        <td><input type="number" value={row.revenue} onChange={e => handleRowChange(index, 'revenue', e.target.value)} className="p-1 w-24 border rounded" /></td>
                                        <td><input type="number" value={row.fixedCosts} onChange={e => handleRowChange(index, 'fixedCosts', e.target.value)} className="p-1 w-24 border rounded" /></td>
                                        <td><input type="number" value={row.variableCosts} onChange={e => handleRowChange(index, 'variableCosts', e.target.value)} className="p-1 w-24 border rounded" /></td>
                                        <td className="p-2 font-medium">{netCashflow.toFixed(2)}</td>
                                        <td className={`p-2 font-bold ${cumulativeCash < 0 ? 'text-red-500' : 'text-green-600'}`}>{cumulativeCash.toFixed(2)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
            
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4 z-10">
                <div className="container mx-auto max-w-6xl flex justify-between items-center">
                    <Button variant="secondary" onClick={() => navigate('/toolkit/finance')}>Back to Finance</Button>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleSave}>Save Cashflow</Button>
                        <Button onClick={handleExport}>Export Sheet (XLSX)</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CashflowPage;
