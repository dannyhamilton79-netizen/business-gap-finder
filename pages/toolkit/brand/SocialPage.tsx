
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { view_page, save_state, export_doc, generate_posts, paywall_trigger, click_button } from '../../../utils/analytics';
import { generateSocialPosts } from '../../../services/geminiService';
import type { SocialPost } from '../../../types';

const Breadcrumb = () => (
    <nav className="mb-4 text-sm text-gray-500">
        <Link to="/toolkit" className="hover:underline">Toolkit</Link>
        <span className="mx-2">▸</span>
        <Link to="/toolkit/brand" className="hover:underline">Brand</Link>
        <span className="mx-2">▸</span>
        <span className="font-semibold text-gray-700">Social Media Kit</span>
    </nav>
);

const SocialPage: React.FC = () => {
    const navigate = useNavigate();
    const { brand, updateBrand, user, showToast } = useAppContext();
    const [inputs, setInputs] = useState({
        platform: 'Instagram',
        goal: 'Awareness',
    });
    const [posts, setPosts] = useState<SocialPost[]>(brand.social.posts || []);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { view_page('/toolkit/brand/social'); }, []);

    const handleGenerate = async () => {
        setIsLoading(true);
        generate_posts(inputs);
        const results = await generateSocialPosts(
            brand.naming.selectedName?.name || 'Our Business',
            brand.voice,
            inputs.goal,
            inputs.platform
        );

        if(user.plan === 'free' && !user.isFoundingMember) {
            setPosts(results.slice(0, 3));
            showToast('Showing 3 post ideas. Upgrade for more!', 'success');
        } else {
            setPosts(results);
        }
        setIsLoading(false);
    };

    const handleSave = () => {
        updateBrand({ social: { posts, ...inputs, updatedAt: new Date().toISOString() } });
        save_state('brand.social');
        showToast('Social kit saved!', 'success');
    };
    
    const handleExport = () => {
        if (user.plan === 'free' && !user.isFoundingMember) {
            paywall_trigger('Export Launch Pack');
            navigate('/paywall', { state: { from: 'export', feature: 'Export Social Launch Pack' } });
            return;
        }
        export_doc('Social Launch Pack');
        showToast('Exporting Launch Pack...', 'success');
    };
    
    const handleCaptionChange = (id: number, newCaption: string) => {
        setPosts(posts.map(p => p.id === id ? {...p, caption: newCaption} : p));
    }

    return (
        <div className="max-w-4xl mx-auto pb-24">
            <Breadcrumb />
            <h1 className="text-3xl font-bold">Social Media Starter Kit</h1>
            <p className="text-gray-600 mb-6">Launch your online presence with AI-generated posts and visuals.</p>

            <Card className="p-6 mb-8">
                <div className="grid md:grid-cols-3 gap-4">
                    <select value={inputs.platform} onChange={e => setInputs({...inputs, platform: e.target.value})} className="p-2 border rounded">
                        {['Instagram', 'LinkedIn', 'Facebook', 'X'].map(p => <option key={p}>{p}</option>)}
                    </select>
                    <select value={inputs.goal} onChange={e => setInputs({...inputs, goal: e.target.value})} className="p-2 border rounded">
                        {['Awareness', 'Lead Generation', 'Community', 'Product Launch'].map(g => <option key={g}>{g}</option>)}
                    </select>
                    <Button onClick={handleGenerate} disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate Content Kit'}</Button>
                </div>
            </Card>

            <div className="space-y-4">
                {posts.map(post => (
                    <Card key={post.id} className="p-4 flex gap-4">
                        <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center text-center text-xs p-1">{post.visualConcept}</div>
                        <div className="flex-grow">
                            <textarea
                                value={post.caption}
                                onChange={e => handleCaptionChange(post.id, e.target.value)}
                                className="w-full p-1 border rounded text-sm"
                                rows={4}
                            />
                            <p className="text-xs text-blue-600 mt-1">{post.hashtags.join(' ')}</p>
                        </div>
                    </Card>
                ))}
            </div>

             <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4 z-10">
                <div className="container mx-auto max-w-4xl flex justify-between items-center">
                    <Button variant="secondary" onClick={() => navigate('/toolkit/brand')}>Back to Brand</Button>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleSave} disabled={posts.length === 0}>Save Kit</Button>
                        <Button onClick={handleExport} disabled={posts.length === 0}>Export Launch Pack</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialPage;
