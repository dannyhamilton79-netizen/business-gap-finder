
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Modal from '../../../components/ui/Modal';
import Badge from '../../../components/ui/Badge';
import { view_page, save_state, export_doc, click_button, compute_pricing, create_packages } from '../../../utils/analytics';
import type { PricingScenario } from '../../../types';

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/plan" className="hover:underline">Plan</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">Pricing Calculator</span>
    </nav>
);

// FIX: Define a default results object to prevent type errors on initialization and rendering.
const defaultResults = {
    grossMargin: 0,
    monthlyRevenue: 0,
    monthlyGrossProfit: 0,
    monthlyNetProfit: 0,
    breakevenUnits: 0,
    monthsToBreakeven: '',
};

const PricingCalculatorPage: React.FC = () => {
    const navigate = useNavigate();
    const { plan, updatePlan, user, showToast } = useAppContext();
    const [inputs, setInputs] = useState<Partial<PricingScenario>>(plan.pricing || {});
    const [results, setResults] = useState(plan.pricing?.results || defaultResults);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => { view_page('/toolkit/plan/pricing'); }, []);

    const handleInputChange = (field: keyof PricingScenario, value: any) => {
        setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
    };

    const handleCalculate = () => {
        compute_pricing();
        const { targetPrice = 0, variableCost = 0, volumePerWeek = 0, fixedMonthlyCosts = 0, startupCosts = 0 } = inputs;
        
        if (!targetPrice || !volumePerWeek || !fixedMonthlyCosts) {
            showToast('Please fill all required fields.', 'error');
            return;
        }

        const grossMargin = targetPrice > 0 ? ((targetPrice - variableCost) / targetPrice) * 100 : 0;
        const monthlyRevenue = targetPrice * (volumePerWeek * 4.33);
        const monthlyGrossProfit = (targetPrice - variableCost) * (volumePerWeek * 4.33);
        const monthlyNetProfit = monthlyGrossProfit - fixedMonthlyCosts;
        const breakevenUnits = (targetPrice - variableCost > 0) ? Math.ceil(fixedMonthlyCosts / (targetPrice - variableCost)) : Infinity;
        
        let monthsToBreakeven: number | string = '> 12 months (revise price/volume)';
        if (monthlyNetProfit > 0) {
            monthsToBreakeven = Math.ceil(startupCosts / monthlyNetProfit);
        }

        setResults({ grossMargin, monthlyRevenue, monthlyGrossProfit, monthlyNetProfit, breakevenUnits, monthsToBreakeven });
        showToast('Calculations updated!', 'success');
    };
    
    const handleSave = () => {
        if (user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', { state: { from: 'save', feature: 'Save Pricing Scenario' } });
            return;
        }
        updatePlan({ pricing: { ...inputs, results, updatedAt: new Date().toISOString() } });
        save_state('plan.pricing');
        showToast('Pricing scenario saved.', 'success');
    };
    
    const handleExport = () => {
        if (user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', { state: { from: 'export', feature: 'Export Pricing' } });
            return;
        }
        export_doc('Pricing Scenario PDF');
        showToast('Exporting as PDF...', 'success');
    };
    
    const handleCreatePackages = () => {
        if (user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', { state: { from: 'create-packages' } });
            return;
        }
        create_packages();
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-6xl mx-auto pb-24">
            <Breadcrumb />
            <h1 className="text-3xl font-bold">Pricing & Breakeven Calculator</h1>
            <p className="text-gray-600 mb-6">Set prices, see margins, and estimate time to breakeven.</p>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <Card className="p-6 space-y-4">
                    <h2 className="text-xl font-bold">Inputs</h2>
                     <div>
                        <label className="font-semibold">Revenue Model*</label>
                        <select value={inputs.revenueModel || ''} onChange={e => setInputs(prev=>({...prev, revenueModel: e.target.value}))} className="w-full p-2 border rounded-md">
                            <option>Service</option><option>Product</option><option>Subscription</option>
                        </select>
                     </div>
                     <div><label className="font-semibold">Variable Cost per Unit/Hour</label><input type="number" value={inputs.variableCost || ''} onChange={e => handleInputChange('variableCost', e.target.value)} className="w-full p-2 border rounded-md"/></div>
                     <div><label className="font-semibold">Target Price per Unit/Hour*</label><input type="number" value={inputs.targetPrice || ''} onChange={e => handleInputChange('targetPrice', e.target.value)} className="w-full p-2 border rounded-md"/></div>
                     <div><label className="font-semibold">Expected Volume per Week*</label><input type="number" value={inputs.volumePerWeek || ''} onChange={e => handleInputChange('volumePerWeek', e.target.value)} className="w-full p-2 border rounded-md"/></div>
                     <div><label className="font-semibold">Fixed Monthly Costs*</label><input type="number" value={inputs.fixedMonthlyCosts || ''} onChange={e => handleInputChange('fixedMonthlyCosts', e.target.value)} className="w-full p-2 border rounded-md"/></div>
                     <div><label className="font-semibold">One-time Startup Costs</label><input type="number" value={inputs.startupCosts || ''} onChange={e => handleInputChange('startupCosts', e.target.value)} className="w-full p-2 border rounded-md"/></div>
                     {plan.market?.pricingBands && <p className="text-sm text-green-700 bg-green-50 p-2 rounded"><strong>From Market Analysis:</strong> Suggested prices range from {plan.market.pricingBands.entry} to {plan.market.pricingBands.premium}.</p>}
                </Card>
                {/* Results */}
                <Card className="p-6 space-y-4 bg-gray-50">
                     <h2 className="text-xl font-bold">Results</h2>
                     <div className="text-center p-4 bg-white rounded-lg shadow-inner">
                        {results.grossMargin < 20 && <Badge color="red" className="mb-2">Tight margin — consider higher price or lower cost.</Badge>}
                        {typeof results.monthsToBreakeven === 'number' && results.monthsToBreakeven > 12 && <Badge color="yellow" className="mb-2">Long breakeven — consider revising price/volume.</Badge>}
                        <div className="grid grid-cols-2 gap-4 text-left">
                            <p><strong>Gross Margin:</strong> {results.grossMargin?.toFixed(1) ?? '...'}%</p>
                            <p><strong>Monthly Revenue:</strong> ${results.monthlyRevenue?.toFixed(2) ?? '...'}</p>
                            <p><strong>Monthly Net Profit:</strong> ${results.monthlyNetProfit?.toFixed(2) ?? '...'}</p>
                            <p><strong>Breakeven Units/Month:</strong> {results.breakevenUnits ?? '...'}</p>
                            <p className="col-span-2"><strong>Months to Breakeven:</strong> {results.monthsToBreakeven ?? '...'}</p>
                        </div>
                     </div>
                     <div className="h-48 bg-gray-200 rounded flex items-center justify-center text-gray-500">Simple Chart Placeholder</div>
                </Card>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create 3-Tier Packages">
                <p>Based on your target price of ${inputs.targetPrice}, here are some suggested packages. You can edit and append them to your business plan.</p>
                {/* Add form here to edit packages */}
                <div className="text-right mt-4">
                    <Button onClick={() => {
                        showToast('Packages appended to business plan!', 'success');
                        setIsModalOpen(false);
                    }}>Save to Business Plan</Button>
                </div>
            </Modal>
            
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4 z-10">
                <div className="container mx-auto max-w-6xl flex flex-wrap gap-4 justify-between items-center">
                    <Button variant="secondary" onClick={() => navigate('/toolkit/plan')}>Back to Plan</Button>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={handleCalculate} variant="primary">Calculate</Button>
                        <Button variant="outline" onClick={handleSave}>Save Scenario</Button>
                        <Button variant="outline" onClick={handleExport}>Export PDF</Button>
                        <Button variant="outline" onClick={handleCreatePackages}>Create 3-Tier Packages</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingCalculatorPage;
