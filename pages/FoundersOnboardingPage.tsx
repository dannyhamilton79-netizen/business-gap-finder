
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import { view_page, click_button, upgrade_success } from '../utils/analytics';

const FoundersOnboardingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, setUser, showToast } = useAppContext();

    useEffect(() => {
        view_page('/onboarding/founders');
    }, []);

    const handleJoin = () => {
        click_button('Join Founders Beta');
        setUser({ 
            ...user, 
            isAuthenticated: true, 
            isFoundingMember: true, 
            plan: 'pro',
            name: 'Founder' 
        });
        upgrade_success('pro_founder');
        showToast('Welcome, Founding Member!', 'success');
        navigate('/dashboard');
    };

    const handleLater = () => {
        click_button('Maybe later');
        navigate('/');
    };

    return (
        <div className="max-w-2xl mx-auto text-center py-12">
            <div className="bg-gradient-to-br from-primary to-secondary text-white p-10 rounded-xl shadow-2xl">
                <span className="text-sm font-bold uppercase text-accent tracking-widest">Founding Members Beta</span>
                <h1 className="text-4xl font-bold my-4">Be Among the First</h1>
                <p className="text-lg text-gray-300 mb-8">
                    Join our exclusive beta program. Get full Pro access free for 60 days, and a 50% lifetime discount afterward. Your feedback will shape the future of this app.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={handleJoin} variant='primary'>Join Founders Beta</Button>
                    <Button onClick={handleLater} variant='outline'>Maybe Later</Button>
                </div>
            </div>
        </div>
    );
};

export default FoundersOnboardingPage;
