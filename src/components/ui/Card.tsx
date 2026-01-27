import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  glass?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  glass = false,
  padding = 'md',
}) => {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: '',
  };

  return (
    <div
      className={`
        rounded-2xl border border-gray-100
        ${glass ? 'glass backdrop-blur-md bg-white/80' : 'bg-white'}
        ${paddingStyles[padding]}
        ${hoverable ? 'hover:shadow-lg transition-all duration-300' : 'shadow-soft'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};