
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { view_page, idea_saved, click_button } from '../../utils/analytics';
import type { SavedIdea } from '../../types';

const FindForSalePage: React.FC = () => {
  React.useEffect(() => {
    view_page('/find/for-sale');
  }, []);

  const { saveIdea } = useAppContext();
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');

  const handleImport = () => {
    if (!url) {
      alert("Please enter a URL.");
      return;
    }
    click_button('Import a Listing');
    const newForSaleIdea: SavedIdea = {
      id: `forsale-${Date.now()}`,
      name: `Imported Listing: ${url.substring(0, 30)}...`,
      shortDescription: 'Business for sale, details imported from URL.',
      longDescription: `Notes: ${notes}`,
      industry: 'Imported',
      targetMarket: 'Imported',
      startupCostEstimated: 'Varies',
      roiPotential: 'Medium',
      difficulty: 'Medium',
      revenueModel: 'Existing',
      type: 'forSale',
      listingUrl: url,
      notes,
    };
    saveIdea(newForSaleIdea);
    idea_saved(newForSaleIdea.id);
    setUrl('');
    setNotes('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Businesses for Sale</h1>
      
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Import a Listing</h2>
        <div className="grid md:grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <label htmlFor="url" className="font-semibold">Listing URL</label>
            <input id="url" type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/listing/123" className="w-full p-2 border rounded-md" />
          </div>
          <div className="space-y-2">
            <label htmlFor="notes" className="font-semibold">Short Notes</label>
            <input id="notes" type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Good location, needs marketing" className="w-full p-2 border rounded-md" />
          </div>
        </div>
        <div className="text-right mt-4">
          <Button onClick={handleImport}>Import Listing</Button>
        </div>
      </Card>
      
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Marketplace Listings</h2>
        <div className="flex items-center justify-center text-center text-gray-500 py-16">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Marketplace Integration Coming Soon</h3>
            <p className="mt-1 text-sm text-gray-500">Connect your preferred marketplace to browse listings directly.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FindForSalePage;
