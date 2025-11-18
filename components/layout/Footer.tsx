
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-gray-300">
      <div className="container mx-auto px-4 py-6 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <Link to="/pricing" className="hover:text-accent">Pricing</Link>
          <a href="#" className="hover:text-accent">Privacy</a>
          <a href="#" className="hover:text-accent">Terms</a>
        </div>
        <p>&copy; {new Date().getFullYear()} BusinessGapFinder. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
