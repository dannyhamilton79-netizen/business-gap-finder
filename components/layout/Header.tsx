import React, { useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { click_button } from '../../utils/analytics';
import Badge from '../ui/Badge';

const NavDropDown: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleOpen = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    timerRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 200); // A small delay to allow moving mouse to dropdown
  };

  const closeMenuImmediate = () => {
    if (timerRef.current) {
        clearTimeout(timerRef.current);
    }
    setIsOpen(false);
  }

  return (
    <div className="relative" onMouseEnter={handleOpen} onMouseLeave={handleClose}>
      <button className="text-white hover:text-accent focus:outline-none flex items-center">
        {title}
        <svg className={`w-4 h-4 ml-1 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                  // FIX: Cast child to access props safely.
                  const originalOnClick = (child as React.ReactElement<any>).props.onClick || (() => {});
                  return React.cloneElement(child as React.ReactElement<any>, {
                      onClick: () => {
                          originalOnClick();
                          closeMenuImmediate();
                      }
                  });
              }
              return child;
          })}
        </div>
      )}
    </div>
  );
};


const Header: React.FC = () => {
  const { user } = useAppContext();

  const handleNavClick = (label: string, route: string) => {
    click_button(label, route);
  }

  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-accent">
          BusinessGapFinder
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <NavDropDown title="Find">
            <Link to="/find/quiz" onClick={() => handleNavClick('Quiz - Match Me', '/find/quiz')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Quiz — Match Me</Link>
            <Link to="/find/research" onClick={() => handleNavClick('Research an Idea', '/find/research')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Research an Idea</Link>
            <Link to="/find/for-sale" onClick={() => handleNavClick('Businesses for Sale', '/find/for-sale')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Businesses for Sale</Link>
          </NavDropDown>
          <NavLink to="/blog" onClick={() => handleNavClick('Blog', '/blog')} className={({isActive}) => isActive ? 'text-accent' : 'text-white hover:text-accent'}>Blog</NavLink>
          <NavLink to="/community" onClick={() => handleNavClick('Community', '/community')} className={({isActive}) => isActive ? 'text-accent' : 'text-white hover:text-accent'}>Community</NavLink>
          <NavDropDown title="Toolkit">
            <Link to="/toolkit/plan" onClick={() => handleNavClick('Plan', '/toolkit/plan')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Plan</Link>
            <Link to="/toolkit/brand" onClick={() => handleNavClick('Brand', '/toolkit/brand')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Brand</Link>
            <Link to="/toolkit/finance" onClick={() => handleNavClick('Finance', '/toolkit/finance')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Finance</Link>
            <Link to="/toolkit/sell" onClick={() => handleNavClick('Sell', '/toolkit/sell')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sell</Link>
            <Link to="/toolkit/grow" onClick={() => handleNavClick('Grow', '/toolkit/grow')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Grow</Link>
          </NavDropDown>
        </div>
        <div className="flex items-center space-x-4">
          {user.isAuthenticated ? (
            <>
              {user.isFoundingMember && <Badge color="yellow">Founding Member</Badge>}
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0)}
                </div>
              </Link>
            </>
          ) : (
            <Link to="/onboarding/founders" onClick={() => handleNavClick('Sign In', '/onboarding/founders')} className="text-white hover:text-accent">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
