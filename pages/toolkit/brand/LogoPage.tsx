
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Modal from '../../../components/ui/Modal';
import { view_page, save_state, export_doc, generate_logo, paywall_trigger, click_button } from '../../../utils/analytics';

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/brand" className="hover:underline">Brand</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">Logo & Style</span>
    </nav>
);

const LogoPage: React.FC = () => {
    const navigate = useNavigate();
    const { brand, updateBrand, user, showToast } = useAppContext();
    const [inputs, setInputs] = useState({
        name: brand.naming.selectedName?.name || '',
        tagline: brand.naming.selectedName?.tagline || '',
        mood: 'Cool',
        style: 'Minimal',
        iconType: 'Abstract'
    });
    const [logos, setLogos] = useState<any[]>([]);
    const [selectedLogo, setSelectedLogo] = useState<any | null>(brand.logo.selectedLogo || null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => { view_page('/toolkit/brand/logo'); }, []);

    const handleGenerate = () => {
        if (!inputs.name) {
            showToast('Please set a business name first.', 'error');
            return;
        }
        generate_logo(inputs);
        // Mock generation
        const mockLogos = [
            { id: 1, text: inputs.name, font: 'Poppins', color: '#4A90E2', icon: 'M12 2L2 7l10 5 10-5-10-5z' },
            { id: 2, text: inputs.name, font: 'Roboto Slab', color: '#50E3C2', icon: 'M20 7l-8 5-8-5' },
            { id: 3, text: inputs.name, font: 'Montserrat', color: '#F5A623', icon: 'M12 2L2 7v10l10 5 10-5V7L12 2z' },
        ];
        setLogos(mockLogos);
        showToast('Logo concepts generated!', 'success');
    };

    const handleSave = () => {
        if (!selectedLogo) {
            showToast('Please select a logo first.', 'error');
            return;
        }
        updateBrand({ logo: { selectedLogo, ...inputs, updatedAt: new Date().toISOString() } });
        save_state('brand.logo');
        showToast('Logo and style saved!', 'success');
    };
    
    const handleExport = () => {
        if (user.plan === 'free' && !user.isFoundingMember) {
            paywall_trigger('Export Brand Kit');
            navigate('/paywall', { state: { from: 'export', feature: 'Export Brand Kit' } });
            return;
        }
        export_doc('Brand Kit ZIP');
        showToast('Exporting Brand Kit...', 'success');
    };

    return (
        <div className="max-w-4xl mx-auto pb-24">
            <Breadcrumb />
            <h1 className="text-3xl font-bold">Logo & Style Generator</h1>
            <p className="text-gray-600 mb-6">Create your business’s look and feel.</p>

            <Card className="p-6 mb-8">
                <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Business Name" value={inputs.name} onChange={e => setInputs({...inputs, name: e.target.value})} className="p-2 border rounded" />
                    <input type="text" placeholder="Tagline (optional)" value={inputs.tagline} onChange={e => setInputs({...inputs, tagline: e.target.value})} className="p-2 border rounded" />
                    <select value={inputs.mood} onChange={e => setInputs({...inputs, mood: e.target.value})} className="p-2 border rounded">
                        {['Cool', 'Warm', 'Neutral', 'Vibrant'].map(t => <option key={t}>{t}</option>)}
                    </select>
                     <select value={inputs.iconType} onChange={e => setInputs({...inputs, iconType: e.target.value})} className="p-2 border rounded">
                        {['Abstract', 'Symbolic', 'Text-based'].map(t => <option key={t}>{t}</option>)}
                    </select>
                </div>
                <div className="text-center mt-4">
                    <Button onClick={handleGenerate}>Generate Logo Concepts</Button>
                </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
                {logos.map(logo => (
                    <Card key={logo.id} className={`p-4 cursor-pointer border-2 ${selectedLogo?.id === logo.id ? 'border-accent' : ''}`} onClick={() => setSelectedLogo(logo)}>
                        <div className="h-32 bg-gray-100 flex items-center justify-center rounded">
                             <svg viewBox="0 0 24 24" className="w-8 h-8 mr-2" fill={logo.color}><path d={logo.icon}/></svg>
                             <span style={{ fontFamily: logo.font, color: logo.color }} className="text-xl">{logo.text}</span>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Mockups">
                <p>Showing how your logo looks on a business card, website, etc.</p>
                {/* Mockup images would go here */}
            </Modal>
            
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4 z-10">
                <div className="container mx-auto max-w-4xl flex justify-between items-center">
                    <Button variant="secondary" onClick={() => navigate('/toolkit/brand')}>Back to Brand</Button>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={() => setIsModalOpen(true)} disabled={!selectedLogo}>View Mockups</Button>
                        <Button variant="outline" onClick={handleSave} disabled={!selectedLogo}>Save Logo</Button>
                        <Button onClick={handleExport} disabled={!selectedLogo}>Export Brand Kit</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoPage;
