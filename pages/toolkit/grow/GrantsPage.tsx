
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { view_page, save_state, export_doc, search_grants } from '../../../utils/analytics';
import type { Grant } from '../../../types';

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/grow" className="hover:underline">Grow</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">Grant Finder</span>
    </nav>
);

const GrantsPage: React.FC = () => {
    const navigate = useNavigate();
    const { grow, updateGrow, user, showToast } = useAppContext();
    const [grants, setGrants] = useState<Grant[]>(grow.grants?.tracker || []);

    useEffect(() => { view_page('/toolkit/grow/grants'); }, []);
    
    const handleSearch = () => {
        search_grants({});
        showToast('Mock search complete. Add findings to your tracker below.', 'success');
    }
    
    const handleAddGrant = () => {
         if (user.plan === 'free' && !user.isFoundingMember && grants.length >= 3) {
            showToast('Free plan limited to 3 saved grants. Upgrade for more.', 'error');
            navigate('/paywall', { state: { from: 'add-grant' } });
            return;
        }
        const newGrant: Grant = { id: Date.now().toString(), name: '', type: 'Grant', amount: '', deadline: '', status: 'Research', notes: '' };
        setGrants([...grants, newGrant]);
    };
    
    const handleUpdateGrant = (id: string, field: keyof Grant, value: any) => {
        setGrants(grants.map(g => g.id === id ? {...g, [field]: value} : g));
    };

    const handleSave = () => {
        updateGrow({ grants: { tracker: grants, updatedAt: new Date().toISOString() } });
        save_state('grow.grants');
        showToast('Grants tracker saved.', 'success');
    };

    const handleExport = () => {
        if (user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', { state: { from: 'export', feature: 'Export Grants' } });
            return;
        }
        export_doc('Grants PDF');
        showToast('Exporting grants...', 'success');
    };

    return (
        <div className="max-w-6xl mx-auto pb-24">
            <Breadcrumb />
            <h1 className="text-3xl font-bold">Grant Finder</h1>
            <p className="text-gray-600 mb-6">Find funding opportunities to help your business expand.</p>
            
            <Card className="p-6 mb-8">
                <div className="grid md:grid-cols-4 gap-4 items-end">
                    <input placeholder="Country" className="p-2 border rounded" />
                    <select className="p-2 border rounded"><option>Grant</option><option>Loan</option></select>
                    <input type="number" placeholder="Funding Needed" className="p-2 border rounded" />
                    <Button onClick={handleSearch} className="w-full">Find Grants</Button>
                </div>
            </Card>

            <Card className="p-6">
                <Button onClick={handleAddGrant} className="mb-4">Add to Tracker</Button>
                 {user.plan === 'free' && !user.isFoundingMember && <p className="text-sm text-gray-500 mb-4">You have {3 - grants.length} grant slots remaining on the free plan.</p>}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b"><th className="p-1 text-left">Grant Name</th><th className="p-1 text-left">Amount</th><th className="p-1 text-left">Deadline</th><th className="p-1 text-left">Status</th></tr></thead>
                        <tbody>
                            {grants.map(g => (
                                <tr key={g.id} className="border-b">
                                    <td className="p-1"><input value={g.name} onChange={e => handleUpdateGrant(g.id, 'name', e.target.value)} className="p-1 border rounded w-full"/></td>
                                    <td className="p-1"><input value={g.amount} onChange={e => handleUpdateGrant(g.id, 'amount', e.target.value)} className="p-1 border rounded w-full"/></td>
                                    <td className="p-1"><input type="date" value={g.deadline} onChange={e => handleUpdateGrant(g.id, 'deadline', e.target.value)} className="p-1 border rounded w-full"/></td>
                                    <td className="p-1">
                                        <select value={g.status} onChange={e => handleUpdateGrant(g.id, 'status', e.target.value)} className="p-1 border rounded w-full">
                                            {['Research', 'Applied', 'Approved', 'Declined'].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4 z-10">
                <div className="container mx-auto max-w-6xl flex justify-between items-center">
                    <Button variant="secondary" onClick={() => navigate('/toolkit/grow')}>Back to Grow</Button>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleSave}>Save Grants</Button>
                        <Button onClick={handleExport}>Export Grants (PDF)</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrantsPage;
