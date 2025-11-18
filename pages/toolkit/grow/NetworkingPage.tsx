
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { view_page, save_state, export_doc } from '../../../utils/analytics';
import type { Contact } from '../../../types';

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/grow" className="hover:underline">Grow</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">Networking</span>
    </nav>
);

const NetworkingPage: React.FC = () => {
    const navigate = useNavigate();
    const { grow, updateGrow, user, showToast } = useAppContext();
    const [contacts, setContacts] = useState<Contact[]>(grow.networking?.contacts || []);

    useEffect(() => { view_page('/toolkit/grow/networking'); }, []);
    
    const handleAddContact = () => {
        if (user.plan === 'free' && !user.isFoundingMember && contacts.length >= 5) {
            showToast('Free plan limited to 5 contacts. Upgrade for more.', 'error');
            navigate('/paywall', { state: { from: 'add-contact' } });
            return;
        }
        const newContact: Contact = { id: Date.now().toString(), name: '', type: 'Supplier', company: '', location: '', contactInfo: '', status: 'Active', notes: '' };
        setContacts([...contacts, newContact]);
    };
    
    const handleUpdateContact = (id: string, field: keyof Contact, value: any) => {
        setContacts(contacts.map(c => c.id === id ? {...c, [field]: value} : c));
    };

    const handleSave = () => {
        updateGrow({ networking: { contacts, updatedAt: new Date().toISOString() } });
        save_state('grow.networking');
        showToast('Network saved.', 'success');
    };

    const handleExport = () => {
        if (user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', { state: { from: 'export', feature: 'Export Contacts' } });
            return;
        }
        export_doc('Contacts CSV');
        showToast('Exporting contacts...', 'success');
    };

    return (
        <div className="max-w-6xl mx-auto pb-24">
            <Breadcrumb />
            <h1 className="text-3xl font-bold">Networking & Suppliers</h1>
            <p className="text-gray-600 mb-6">Build relationships and source reliable partners.</p>

            <Card className="p-6">
                <Button onClick={handleAddContact} className="mb-4">Add Contact</Button>
                {user.plan === 'free' && !user.isFoundingMember && <p className="text-sm text-gray-500 mb-4">You have {5 - contacts.length} contact slots remaining on the free plan.</p>}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b"><th className="p-1 text-left">Name</th><th className="p-1 text-left">Type</th><th className="p-1 text-left">Contact</th><th className="p-1 text-left">Notes</th></tr></thead>
                        <tbody>
                            {contacts.map(c => (
                                <tr key={c.id} className="border-b">
                                    <td className="p-1"><input value={c.name} onChange={e => handleUpdateContact(c.id, 'name', e.target.value)} className="p-1 border rounded w-full"/></td>
                                    <td className="p-1">
                                        <select value={c.type} onChange={e => handleUpdateContact(c.id, 'type', e.target.value)} className="p-1 border rounded w-full">
                                            {['Supplier', 'Partner', 'Mentor', 'Contractor', 'Investor'].map(t => <option key={t}>{t}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-1"><input value={c.contactInfo} onChange={e => handleUpdateContact(c.id, 'contactInfo', e.target.value)} className="p-1 border rounded w-full"/></td>
                                    <td className="p-1"><input value={c.notes} onChange={e => handleUpdateContact(c.id, 'notes', e.target.value)} className="p-1 border rounded w-full"/></td>
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
                        <Button variant="outline" onClick={handleSave}>Save Network</Button>
                        <Button onClick={handleExport}>Export Contacts (CSV)</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NetworkingPage;
