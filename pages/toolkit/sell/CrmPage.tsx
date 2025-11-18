
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { view_page, save_state, export_doc, click_button } from '../../../utils/analytics';
import type { Lead } from '../../../types';

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/sell" className="hover:underline">Sell</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">Mini CRM</span>
    </nav>
);

const CrmPage: React.FC = () => {
    const navigate = useNavigate();
    const { sell, updateSell, user, showToast } = useAppContext();
    const [leads, setLeads] = useState<Lead[]>(sell.crm?.leads || []);

    useEffect(() => { view_page('/toolkit/sell/crm'); }, []);
    
    const addLead = () => {
        const newLead: Lead = { id: Date.now().toString(), name: '', contact: '', source: 'Website', stage: 'New', value: 0, nextActionDate: '', notes: '' };
        setLeads([...leads, newLead]);
    };

    const updateLead = (id: string, field: keyof Lead, value: any) => {
        setLeads(leads.map(lead => lead.id === id ? { ...lead, [field]: value } : lead));
    };

    const removeLead = (id: string) => {
        setLeads(leads.filter(lead => lead.id !== id));
    };

    const handleSave = () => {
        updateSell({ crm: { leads, updatedAt: new Date().toISOString() } });
        save_state('sell.crm');
        showToast('CRM data saved.', 'success');
    };

    const handleExport = () => {
        if (user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', { state: { from: 'export', feature: 'Export Leads CSV' } });
            return;
        }
        export_doc('Leads CSV');
        showToast('Exporting leads...', 'success');
    };

    const totalValue = leads.reduce((sum, lead) => sum + (lead.stage === 'Won' ? lead.value : 0), 0);
    const conversionRate = leads.length > 0 ? (leads.filter(l => l.stage === 'Won').length / leads.length) * 100 : 0;
    const avgDealSize = leads.filter(l => l.stage === 'Won').length > 0 ? totalValue / leads.filter(l => l.stage === 'Won').length : 0;

    return (
        <div className="max-w-7xl mx-auto pb-24">
            <Breadcrumb />
            <h1 className="text-3xl font-bold">Mini CRM & Lead Tracker</h1>
            <p className="text-gray-600 mb-6">Keep tabs on potential customers and never miss a follow-up.</p>

            <Card className="p-4 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div><p className="text-sm text-gray-500">Total Leads</p><p className="text-2xl font-bold">{leads.length}</p></div>
                    <div><p className="text-sm text-gray-500">Conversion Rate</p><p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p></div>
                    <div><p className="text-sm text-gray-500">Total Value (Won)</p><p className="text-2xl font-bold">${totalValue.toFixed(2)}</p></div>
                    <div><p className="text-sm text-gray-500">Avg Deal Size</p><p className="text-2xl font-bold">${avgDealSize.toFixed(2)}</p></div>
                </div>
            </Card>

            <Card className="p-6">
                <Button onClick={addLead} className="mb-4">Add Lead</Button>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b"><th className="p-2 text-left">Lead</th><th className="p-2 text-left">Stage</th><th className="p-2 text-left">Value</th><th className="p-2 text-left">Next Action</th><th></th></tr>
                        </thead>
                        <tbody>
                            {leads.map(lead => (
                                <tr key={lead.id} className="border-b">
                                    <td className="p-2"><input value={lead.name} onChange={e => updateLead(lead.id, 'name', e.target.value)} className="p-1 border rounded w-full"/></td>
                                    <td className="p-2">
                                        <select value={lead.stage} onChange={e => updateLead(lead.id, 'stage', e.target.value)} className="p-1 border rounded w-full">
                                            {['New', 'Contacted', 'Negotiating', 'Won', 'Lost'].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-2"><input type="number" value={lead.value} onChange={e => updateLead(lead.id, 'value', parseFloat(e.target.value))} className="p-1 border rounded w-24"/></td>
                                    <td className="p-2"><input type="date" value={lead.nextActionDate} onChange={e => updateLead(lead.id, 'nextActionDate', e.target.value)} className="p-1 border rounded w-full"/></td>
                                    <td className="p-2 text-right"><Button onClick={() => removeLead(lead.id)} variant="secondary" className="bg-red-500 text-xs p-1">Delete</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4 z-10">
                <div className="container mx-auto max-w-7xl flex justify-between items-center">
                    <Button variant="secondary" onClick={() => navigate('/toolkit/sell')}>Back to Sell</Button>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleSave}>Save CRM</Button>
                        <Button onClick={handleExport}>Export Leads (CSV)</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrmPage;
