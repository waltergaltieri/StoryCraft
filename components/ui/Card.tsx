'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'solid';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'md'
}) => {
  const baseClasses = 'rounded-lg border transition-all duration-200';
  
  // Only apply default variant styles if no custom className contains background/border colors
  const hasCustomStyles = className.includes('bg-') || className.includes('border-');
  
  const variantClasses = {
    default: hasCustomStyles ? '' : 'bg-slate-800/50 border-slate-600/30',
    glass: 'bg-white/10 dark:bg-black/10 border-white/20 dark:border-white/10 backdrop-blur-md',
    solid: hasCustomStyles ? '' : 'bg-slate-800/80 border-slate-600/50'
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  };
  
  // Put className at the end so it can override default styles
  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card; 