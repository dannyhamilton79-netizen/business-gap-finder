
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'gray' | 'blue' | 'green' | 'yellow' | 'red';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, color = 'gray', className }) => {
  const colorClasses = {
    gray: 'bg-gray-200 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-200 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${colorClasses[color]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
