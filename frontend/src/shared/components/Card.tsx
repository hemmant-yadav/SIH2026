import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
  bgColor?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  divider = false,
  bgColor = 'bg-surface-container',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flat-card ${bgColor} p-6 rounded-2xl ${
        divider ? 'border-t border-outline-variant/40' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
