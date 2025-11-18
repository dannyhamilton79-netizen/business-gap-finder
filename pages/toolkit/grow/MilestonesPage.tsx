
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { view_page, save_state, export_doc, click_button } from '../../../utils/analytics';
import type { Milestone } from '../../../types';

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/grow" className="hover:underline">Grow</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">Milestone Tracker</span>
    </nav>
);

const MilestonesPage: React.FC = () => {
    const navigate = useNavigate();
    const { grow, updateGrow, user, showToast, plan } = useAppContext();
    const [milestones, setMilestones] = useState<Milestone[]>(grow.milestones?.list || []);
    const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({ status: 'Not Started' });

    useEffect(() => { view_page('/toolkit/grow/milestones'); }, []);

    const handleAddMilestone = () => {
        if (!newMilestone.title || !newMilestone.targetDate) {
            showToast('Title and Target Date are required.', 'error');
            return;
        }
        const milestoneToAdd: Milestone = {
            id: Date.now().toString(),
            title: '',
            targetDate: '',
            category: 'Other',
            status: 'Not Started',
            description: '',
            dependencies: [],
            ...newMilestone
        };
        setMilestones([...milestones, milestoneToAdd]);
        setNewMilestone({ status: 'Not Started' }); // Reset form
    };
    
    const handleUpdateMilestone = (id: string, field: keyof Milestone, value: any) => {
        setMilestones(milestones.map(m => m.id === id ? {...m, [field]: value} : m));
    }
    
    const handleSave = () => {
        updateGrow({ milestones: { list: milestones, updatedAt: new Date().toISOString() } });
        save_state('grow.milestones');
        showToast('Milestones saved.', 'success');
    };
    
    const handleExport = () => {
        if (user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', { state: { from: 'export', feature: 'Export Milestones' } });
            return;
        }
        export_doc('Milestones PDF');
        showToast('Exporting timeline...', 'success');
    };

    const handleSyncFromPlan = () => {
        const planMilestonesText = plan.businessPlan?.milestones;
        if (planMilestonesText && typeof planMilestonesText === 'string') {
            const newMilestones = planMilestonesText.split('\n')
                .filter(line => line.trim() !== '')
                .map((line, index) => ({
                    id: `plan-${Date.now()}-${index}`,
                    title: line,
                    targetDate: new Date().toISOString().split('T')[0],
                    category: 'Setup' as const,
                    status: 'Not Started' as const,
                    description: 'Imported from Business Plan.',
                    dependencies: []
                }));
            setMilestones(prev => [...prev, ...newMilestones]);
            showToast(`${newMilestones.length} milestones imported from your business plan!`, 'success');
        } else {
            showToast('No milestones found in your business plan.', 'error');
        }
    };
    
    const completedCount = milestones.filter(m => m.status === 'Complete').length;
    const progress = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

    return (
        <div className="max-w-6xl mx-auto pb-24">
            <Breadcrumb />
            <h1 className="text-3xl font-bold">Milestone Tracker</h1>
            <p className="text-gray-600 mb-6">Define your key goals and track your progress.</p>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <Card className="p-4">
                        <h3 className="font-bold mb-2">Add New Milestone</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input value={newMilestone.title || ''} onChange={e => setNewMilestone({...newMilestone, title: e.target.value})} placeholder="Title*" className="p-2 border rounded col-span-2" />
                            <input type="date" value={newMilestone.targetDate || ''} onChange={e => setNewMilestone({...newMilestone, targetDate: e.target.value})} className="p-2 border rounded" />
                            <select value={newMilestone.category || 'Other'} onChange={e => setNewMilestone({...newMilestone, category: e.target.value as Milestone['category']})} className="p-2 border rounded">
                                {['Setup', 'Marketing', 'Sales', 'Operations', 'Finance', 'Growth', 'Other'].map(c => <option key={c}>{c}</option>)}
                            </select>
                            <Button onClick={handleAddMilestone} className="col-span-2">Add Milestone</Button>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b"><th className="p-1 text-left">Title</th><th className="p-1 text-left">Date</th><th className="p-1 text-left">Status</th></tr></thead>
                                <tbody>
                                    {milestones.map(m => (
                                        <tr key={m.id} className="border-b">
                                            <td className="p-1"><input value={m.title} onChange={e => handleUpdateMilestone(m.id, 'title', e.target.value)} className="p-1 border rounded w-full"/></td>
                                            <td className="p-1"><input type="date" value={m.targetDate} onChange={e => handleUpdateMilestone(m.id, 'targetDate', e.target.value)} className="p-1 border rounded"/></td>
                                            <td className="p-1">
                                                <select value={m.status} onChange={e => handleUpdateMilestone(m.id, 'status', e.target.value)} className="p-1 border rounded w-full">
                                                    <option>Not Started</option><option>In Progress</option><option>Complete</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
                <div className="space-y-4">
                    <Card className="p-4 text-center">
                        <h3 className="font-bold">Progress</h3>
                        <div className="w-full bg-gray-200 rounded-full h-4 my-2"><div className="bg-accent h-4 rounded-full" style={{width: `${progress}%`}}></div></div>
                        <p className="font-bold text-xl">{progress.toFixed(0)}% Complete</p>
                        <p className="text-sm text-gray-500">{completedCount} of {milestones.length} milestones</p>
                    </Card>
                    <Button onClick={handleSyncFromPlan} variant="outline" className="w-full">Sync from Plan</Button>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4 z-10">
                <div className="container mx-auto max-w-6xl flex justify-between items-center">
                    <Button variant="secondary" onClick={() => navigate('/toolkit/grow')}>Back to Grow</Button>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleSave}>Save Milestones</Button>
                        <Button onClick={handleExport}>Export Timeline (PDF)</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MilestonesPage;
