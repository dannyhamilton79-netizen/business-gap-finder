
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { view_page, save_state, export_doc, funding_search, click_button } from '../../../utils/analytics';
import type { FundingTrackerRow } from '../../../types';

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/finance" className="hover:underline">Finance</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">Funding Hub</span>
    </nav>
);

const FundingPage: React.FC = () => {
    const navigate = useNavigate();
    const { finance, updateFinance, user, showToast } = useAppContext();
    const [filters, setFilters] = useState(finance.funding?.filters || { type: 'Grant' });
    const [results, setResults] = useState<any[]>([]);
    const [trackerRows, setTrackerRows] = useState<FundingTrackerRow[]>(finance.funding?.trackerRows || []);

    useEffect(() => { view_page('/toolkit/finance/funding'); }, []);

    const handleSearch = () => {
        funding_search(filters);
        // Mock results
        setResults([
            { id: 1, title: 'Local Innovator Grant', type: 'Grant', amount: '$5,000', region: 'Local' },
            { id: 2, title: 'Small Business Boost Loan', type: 'Loan', amount: '$25,000', region: 'National' },
            { id: 3, title: 'Tech Startup Accelerator', type: 'Accelerator', amount: '$100,000', region: 'Varies' },
        ]);
        showToast('Funding options found!', 'success');
    };
    
    const handleSave = () => {
        updateFinance({ funding: { filters, trackerRows, updatedAt: new Date().toISOString() } });
        save_state('finance.funding');
        showToast('Funding tracker saved!', 'success');
    };
    
    const handleExport = () => {
        if(user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', { state: { from: 'export', feature: 'Export Funding Report' } });
            return;
        }
        export_doc('Funding Report PDF');
        showToast('Exporting PDF...', 'success');
    }

    const addTrackerRow = () => {
        setTrackerRows(prev => [...prev, {id: Date.now().toString(), source: '', type: 'Grant', amount: 0, status: 'Pending', notes: ''}]);
    }
    
    const updateTrackerRow = (id: string, field: keyof FundingTrackerRow, value: any) => {
        setTrackerRows(prev => prev.map(row => row.id === id ? {...row, [field]: value} : row));
    }
    
    const removeTrackerRow = (id: string) => {
        setTrackerRows(prev => prev.filter(row => row.id !== id));
    }

    return (
        <div className="max-w-6xl mx-auto pb-24">
            <Breadcrumb />
            <h1 className="text-3xl font-bold">Funding Hub</h1>
            <p className="text-gray-600 mb-6">Discover grants, investors, or loans that fit your goals.</p>

            <Card className="p-6 mb-8">
                <div className="grid md:grid-cols-4 gap-4 items-end">
                    <input placeholder="Country" className="p-2 border rounded" />
                    <select value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})} className="p-2 border rounded">
                        {['Grant', 'Loan', 'Equity', 'Accelerator'].map(t => <option key={t}>{t}</option>)}
                    </select>
                    <input type="number" placeholder="Max Funding Needed" className="p-2 border rounded" />
                    <Button onClick={handleSearch} className="w-full">Find Funding Options</Button>
                </div>
            </Card>

            {results.length > 0 && (
                <div className="space-y-4 mb-8">
                    {results.map(r => (
                        <Card key={r.id} className="p-4 flex justify-between items-center">
                            <div><p className="font-bold">{r.title}</p><p className="text-sm text-gray-500">{r.type} - {r.amount}</p></div>
                            <Button variant="outline">Save Option</Button>
                        </Card>
                    ))}
                </div>
            )}
            
            <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">My Funding Tracker</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b"><th className="p-1 text-left">Source</th><th className="p-1 text-left">Type</th><th className="p-1 text-left">Amount</th><th className="p-1 text-left">Status</th><th className="p-1 text-left">Notes</th><th></th></tr></thead>
                        <tbody>
                            {trackerRows.map(row => (
                                <tr key={row.id}>
                                    <td><input value={row.source} onChange={e=>updateTrackerRow(row.id, 'source', e.target.value)} className="p-1 w-full border rounded"/></td>
                                    <td><select value={row.type} onChange={e=>updateTrackerRow(row.id, 'type', e.target.value)} className="p-1 w-full border rounded"><option>Grant</option><option>Loan</option></select></td>
                                    <td><input type="number" value={row.amount} onChange={e=>updateTrackerRow(row.id, 'amount', e.target.value)} className="p-1 w-24 border rounded"/></td>
                                    <td><select value={row.status} onChange={e=>updateTrackerRow(row.id, 'status', e.target.value)} className="p-1 w-full border rounded"><option>Pending</option><option>Applied</option><option>Approved</option><option>Declined</option></select></td>
                                    <td><input value={row.notes} onChange={e=>updateTrackerRow(row.id, 'notes', e.target.value)} className="p-1 w-full border rounded"/></td>
                                    <td><button onClick={() => removeTrackerRow(row.id)} className="text-red-500 p-1">✖</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Button onClick={addTrackerRow} variant="outline" className="mt-4 text-sm">Add Row</Button>
            </Card>
            
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4 z-10">
                <div className="container mx-auto max-w-6xl flex justify-between items-center">
                    <Button variant="secondary" onClick={() => navigate('/toolkit/finance')}>Back to Finance</Button>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleSave}>Save Tracker</Button>
                        <Button onClick={handleExport}>Export Report (PDF)</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FundingPage;
