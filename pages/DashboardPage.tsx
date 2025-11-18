
import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { view_page, click_button } from '../utils/analytics';

const DashboardPage: React.FC = () => {
    const { user, savedIdeas, removeIdea, setChosenIdea } = useAppContext();

    useEffect(() => {
        view_page('/dashboard');
    }, []);

    const handleOpenIdea = (idea: any) => {
        click_button('Open', '/toolkit/plan');
        setChosenIdea(idea);
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Welcome to Your Dashboard, {user.name}</h1>
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Saved Ideas */}
                <Card className="lg:col-span-2 p-6">
                    <h2 className="text-2xl font-bold mb-4">Saved Ideas</h2>
                    {savedIdeas.length > 0 ? (
                        <ul className="space-y-4">
                            {savedIdeas.map(idea => (
                                <li key={idea.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold">{idea.name}</p>
                                        <p className="text-sm text-gray-500">{idea.shortDescription}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button to="/toolkit/plan" variant="outline" onClick={() => handleOpenIdea(idea)}>Open</Button>
                                        <Button onClick={() => removeIdea(idea.id)} variant="secondary" className="bg-red-500 hover:bg-red-600">Remove</Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">You haven't saved any ideas yet. Start by taking the quiz!</p>
                    )}
                </Card>

                {/* Other Tiles */}
                <div className="space-y-8">
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Next Milestone</h2>
                        <p className="text-gray-500">Complete your Business Plan.</p>
                    </Card>
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Community Highlights</h2>
                        <p className="text-gray-500">"How I got my first 10 customers" - discussion thread is trending.</p>
                    </Card>
                     <Card className="p-6 bg-accent text-white">
                        <h2 className="text-2xl font-bold mb-4">Continue Where You Left Off</h2>
                        <Button to="/toolkit" variant="secondary" className="bg-white text-accent hover:bg-gray-100 w-full">Go to Toolkit</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;