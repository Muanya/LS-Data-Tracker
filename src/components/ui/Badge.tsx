// components/ui/Badge.tsx
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  rounded?: 'full' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'full',
}) => {
  const baseStyles = 'inline-flex items-center font-medium';
  
  const variants = {
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700',
    info: 'bg-blue-100 text-blue-700',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const roundedStyles = {
    full: 'rounded-full',
    lg: 'rounded-lg',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${roundedStyles[rounded]}`}>
      {children}
    </span>
  );
};