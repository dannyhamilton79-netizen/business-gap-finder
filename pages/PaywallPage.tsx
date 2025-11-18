
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { paywall_view, upgrade_success, click_button } from '../utils/analytics';
import { PRICING_DETAILS, TRENDING_IDEAS } from '../constants';

const CheckIcon = () => (
    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);


const PaywallPage: React.FC = () => {
    const { user, setUser, showToast } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const context = location.state;
    const ideaId = context?.ideaId;
    const ideaPreview = ideaId ? TRENDING_IDEAS.find(i => i.id === ideaId) : null;


    useEffect(() => {
        paywall_view(context);
    }, [context]);

    if (user.isFoundingMember) {
        return (
            <div className="max-w-2xl mx-auto text-center">
                <Card className="p-8 bg-gradient-to-r from-yellow-100 to-amber-200">
                    <h1 className="text-3xl font-bold text-yellow-800 mb-4">Founders Access Unlocked!</h1>
                    <p className="text-yellow-700 mb-6">Full Pro features are unlocked for your first 60 days. Thank you for helping us shape the future of this app!</p>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </Card>
            </div>
        );
    }
    
    const handleUpgrade = () => {
        click_button('Unlock Pro');
        setUser({ ...user, plan: 'pro', isAuthenticated: true, name: 'Pro User' });
        upgrade_success('pro');
        showToast('Upgrade successful! Welcome to Pro!', 'success');
        if (ideaId) {
            navigate('/toolkit/plan'); // Should prefill with idea
        } else {
            navigate('/dashboard');
        }
    };
    
    const handleContinueFree = () => {
        click_button('Continue Free');
        navigate(-1);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-center mb-8">Unlock Your Potential with Pro</h1>
            
            <div className="grid lg:grid-cols-2 gap-8">
                <Card className="p-8">
                    <h2 className="text-2xl font-bold mb-4">Pro Builder Plan</h2>
                    <p className="text-4xl font-bold mb-4">${PRICING_DETAILS.monthly}<span className="text-lg font-normal text-gray-500">/mo</span></p>
                    <p className="text-gray-600 mb-6">Cancel anytime. Full access to all tools and features.</p>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center"><CheckIcon /> Unlimited Idea Details</li>
                        <li className="flex items-center"><CheckIcon /> Complete Planning Toolkit</li>
                        <li className="flex items-center"><CheckIcon /> Brand & Logo Builders</li>
                        <li className="flex items-center"><CheckIcon /> Financial Projection Tools</li>
                        <li className="flex items-center"><CheckIcon /> Private Community Access</li>
                    </ul>
                    <div className="space-y-3">
                      <Button onClick={handleUpgrade} className="w-full">Unlock Pro</Button>
                      <Button onClick={handleContinueFree} variant="secondary" className="w-full">Continue Free</Button>
                    </div>
                </Card>
                
                {ideaPreview && (
                    <Card>
                        <div className="p-8">
                            <h3 className="text-xl font-bold mb-4">Previewing Full Plan for:</h3>
                            <p className="text-2xl font-bold text-accent mb-6">{ideaPreview.name}</p>
                            <div className="relative">
                                <div className="space-y-4 text-gray-700 blur-sm select-none">
                                    <h4 className="font-semibold">Business Plan Snapshot:</h4>
                                    <p>The executive summary outlines a strategy to capture 5% of the local market within two years by focusing on a superior customer experience...</p>
                                    <h4 className="font-semibold">Market Analysis:</h4>
                                    <p>Key competitors include Local Cafe and BrewHouse, but our unique selling proposition of ethically sourced beans provides a key advantage...</p>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                                    <p className="text-lg font-bold text-primary">Unlock Pro to see the full details.</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default PaywallPage;
