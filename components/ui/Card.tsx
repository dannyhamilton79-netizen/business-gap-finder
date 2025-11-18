
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  // FIX: Add onClick property to allow the card to be clickable
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div onClick={onClick} className={`bg-white rounded-lg shadow-lg overflow-hidden transition-shadow hover:shadow-xl ${className}`}>
      {children}
    </div>
  );
};

export default Card;
