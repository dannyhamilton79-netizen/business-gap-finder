
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { view_page } from '../utils/analytics';
import { useNavigate } from 'react-router-dom';

const CommunityPage: React.FC = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  useEffect(() => { view_page('/community'); }, []);
  const [activeTab, setActiveTab] = useState('All');

  const handlePost = () => {
    if (user.plan !== 'pro' && !user.isFoundingMember) {
      navigate('/paywall', { state: { from: 'community-post' } });
    } else {
      alert('Opening post creation form...');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Founder Forum</h1>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="flex border-b mb-4">
            {['All', 'By Industry', 'By Location', 'By Stage'].map(tab => (
              <button
                key={tab}
                className={`py-2 px-4 -mb-px ${activeTab === tab ? 'border-b-2 border-accent text-accent font-semibold' : 'text-gray-500'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {/* Post List */}
            <Card className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold">How did you get your first 10 customers?</h3>
                <p className="text-sm text-gray-500">by Jane Doe, last reply 5m ago</p>
              </div>
              <Button variant="outline">Open</Button>
            </Card>
            <Card className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold">Best accounting software for a solo founder?</h3>
                <p className="text-sm text-gray-500">by John Smith, last reply 2h ago</p>
              </div>
              <Button variant="outline">Open</Button>
            </Card>
          </div>
        </div>
        <aside className="space-y-6">
          <Button className="w-full" onClick={handlePost}>Create New Post</Button>
          <Card className="p-4">
            <h3 className="font-bold mb-2">Trending Discussions</h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-accent">
              <li><a href="#" className="hover:underline">Marketing on a $0 budget</a></li>
              <li><a href="#" className="hover:underline">LLC vs. Sole Proprietorship</a></li>
            </ul>
          </Card>
          <Card className="p-4">
            <h3 className="font-bold mb-2">Success Stories</h3>
            <p className="text-sm text-gray-600">Read about how Sarah launched her coffee cart and broke even in 3 months.</p>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default CommunityPage;
