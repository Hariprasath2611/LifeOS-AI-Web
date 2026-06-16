import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  interactive = true, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`rounded-xl p-6 ${
        interactive ? 'glass-panel-interactive' : 'glass-panel'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
