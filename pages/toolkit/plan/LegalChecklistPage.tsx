
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { view_page, save_state, export_doc, send_to_milestones, click_button } from '../../../utils/analytics';
import type { LegalChecklistItem } from '../../../types';

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/plan" className="hover:underline">Plan</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">Legal Checklist</span>
    </nav>
);

const LegalChecklistPage: React.FC = () => {
    const navigate = useNavigate();
    const { plan, updatePlan, user, showToast } = useAppContext();
    const [checklistData, setChecklistData] = useState(plan.legal || {});
    
    useEffect(() => { view_page('/toolkit/plan/legal'); }, []);
    
    const handleItemChange = (id: number, field: keyof LegalChecklistItem, value: any) => {
        const updatedItems = (checklistData.items || []).map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setChecklistData(prev => ({ ...prev, items: updatedItems }));
    };

    const handleSave = () => {
        if (!checklistData.jurisdiction?.country) {
            showToast('Country is required to save.', 'error');
            return;
        }
        updatePlan({ legal: { ...checklistData, updatedAt: new Date().toISOString() } });
        save_state('plan.legal');
        showToast('Checklist saved.', 'success');
    };

    const handleExport = () => {
        if (user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', { state: { from: 'export-pdf', feature: 'Legal Checklist Export' } });
            return;
        }
        export_doc('Legal Checklist PDF');
        showToast('Exporting as PDF...', 'success');
    };
    
    const handleSync = () => {
        if (user.plan === 'free' && !user.isFoundingMember) {
            navigate('/paywall', { state: { from: 'sync-tasks', feature: 'Sync to Milestones' } });
            return;
        }
        click_button('Sync to Milestones');
        send_to_milestones('legal-checklist');
        showToast('Incomplete items synced to Milestones.', 'success');
    };
    
    const progress = checklistData.items ? (checklistData.items.filter(i => i.done).length / checklistData.items.length) * 100 : 0;

    return (
        <div className="max-w-4xl mx-auto pb-24">
            <Breadcrumb />
            <h1 className="text-3xl font-bold">Legal & Compliance Checklist</h1>
            <p className="text-gray-600 mb-6">Country/province aware steps. Mark items done to track progress.</p>
            
            <Card className="p-6 mb-8">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="font-semibold">Country*</label>
                        <input value={checklistData.jurisdiction?.country || ''} onChange={e => setChecklistData(prev => ({...prev, jurisdiction: {...prev.jurisdiction, country: e.target.value}}))} className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="font-semibold">State/Province</label>
                        <input value={checklistData.jurisdiction?.state || ''} onChange={e => setChecklistData(prev => ({...prev, jurisdiction: {...prev.jurisdiction, state: e.target.value}}))} className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="font-semibold">City</label>
                        <input value={checklistData.jurisdiction?.city || ''} onChange={e => setChecklistData(prev => ({...prev, jurisdiction: {...prev.jurisdiction, city: e.target.value}}))} className="w-full p-2 border rounded-md" />
                    </div>
                </div>
                 <div className="flex gap-8">
                    <div>
                        <label className="font-semibold block mb-2">Entity Type</label>
                        <div className="flex gap-4">
                           <label><input type="radio" name="entity" value="Sole Prop" checked={checklistData.entityType === 'Sole Prop'} onChange={e => setChecklistData(prev=>({...prev, entityType: e.target.value}))}/> Sole Prop</label>
                           <label><input type="radio" name="entity" value="Partnership" checked={checklistData.entityType === 'Partnership'} onChange={e => setChecklistData(prev=>({...prev, entityType: e.target.value}))}/> Partnership</label>
                           <label><input type="radio" name="entity" value="Corporation" checked={checklistData.entityType === 'Corporation'} onChange={e => setChecklistData(prev=>({...prev, entityType: e.target.value}))}/> Corporation</label>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-accent h-4 rounded-full text-white text-xs text-center" style={{ width: `${progress}%` }}>
                       {progress.toFixed(0)}%
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {(checklistData.items || []).map(item => (
                    <Card key={item.id} className="p-4">
                        <div className="flex items-start">
                            <input type="checkbox" checked={item.done} onChange={e => handleItemChange(item.id, 'done', e.target.checked)} className="h-5 w-5 mt-1 text-accent focus:ring-accent rounded"/>
                            <div className="ml-4 flex-grow">
                                <h3 className="font-semibold text-lg">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.note}</p>
                                <textarea
                                    placeholder="Add a custom note..."
                                    value={item.note || ''}
                                    onChange={e => handleItemChange(item.id, 'note', e.target.value)}
                                    className="w-full p-1 mt-2 border rounded-md text-sm"
                                    rows={2}
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4 z-10">
                <div className="container mx-auto max-w-4xl flex justify-between items-center">
                    <Button variant="secondary" onClick={() => navigate('/toolkit/plan')}>Back to Plan</Button>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleSync}>Sync to Milestones</Button>
                        <Button variant="outline" onClick={handleSave}>Save Checklist</Button>
                        <Button onClick={handleExport}>Export PDF</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalChecklistPage;
