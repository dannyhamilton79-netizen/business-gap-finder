
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { view_page, click_button } from '../utils/analytics';
import { PRICING_DETAILS } from '../constants';

const CheckIcon = () => (
    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

const PricingPage: React.FC = () => {
    useEffect(() => {
        view_page('/pricing');
    }, []);

    const features = [
        { name: 'Business Matching Quiz', free: true, pro: true },
        { name: 'Save Ideas', free: true, pro: true },
        { name: 'Trends & Blog Access', free: true, pro: true },
        { name: '1 Idea Detail View / Day', free: true, pro: false },
        { name: 'Unlimited Idea Detail Views', free: false, pro: true },
        { name: 'Full Setup Guides', free: false, pro: true },
        { name: 'ROI & Cost Calculators', free: false, pro: true },
        { name: 'Brand & Finance Tools', free: false, pro: true },
        { name: 'Mini CRM & Marketing Plan', free: false, pro: true },
        { name: 'Private Founder Forum', free: false, pro: true },
    ];

    return (
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold mb-4">Choose Your Plan</h1>
            <p className="text-lg text-gray-600 mb-12">Unlock your full potential with the right tools.</p>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="text-left p-8 flex flex-col">
                    <h2 className="text-2xl font-bold mb-2">Explorer</h2>
                    <p className="text-gray-500 mb-4">Perfect for getting started.</p>
                    <p className="text-4xl font-bold mb-6">Free</p>
                    <Button to="/" variant="secondary" className="w-full text-center mb-8" onClick={() => click_button('Start for Free', '/')}>Start for Free</Button>
                    <ul className="space-y-4 flex-grow">
                        {features.filter(f => f.free).map(f => (
                            <li key={f.name} className="flex items-center"><CheckIcon /><span className="ml-3">{f.name}</span></li>
                        ))}
                    </ul>
                </Card>
                <Card className="text-left p-8 border-4 border-accent flex flex-col">
                    <h2 className="text-2xl font-bold mb-2">Pro Builder</h2>
                    <p className="text-accent mb-4">For serious entrepreneurs.</p>
                    <p className="text-4xl font-bold mb-6">${PRICING_DETAILS.monthly}/mo</p>
                    <Button to="/paywall" className="w-full text-center mb-8" onClick={() => click_button('Upgrade to Pro', '/paywall')}>Upgrade to Pro</Button>
                    <ul className="space-y-4 flex-grow">
                        {features.filter(f => f.pro).map(f => (
                            <li key={f.name} className="flex items-center"><CheckIcon /><span className="ml-3">{f.name}</span></li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default PricingPage;
