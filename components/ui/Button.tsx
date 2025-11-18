
import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ to, variant = 'primary', children, className, ...props }) => {
  const baseClasses = "px-6 py-3 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform hover:scale-105";
  const variantClasses = {
    primary: "bg-accent hover:bg-accent-hover text-white focus:ring-accent",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    outline: "bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white focus:ring-accent",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={`${combinedClasses} inline-block text-center`}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
