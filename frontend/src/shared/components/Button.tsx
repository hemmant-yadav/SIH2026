import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  href,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-dmsans text-sm font-semibold px-6 py-3.5 rounded-full transition-colors duration-150 cursor-pointer focus:outline-none';

  const variants = {
    primary:
      'bg-lime text-bone shadow-none hover:bg-marigold-dark active:opacity-90',
    ghost:
      'bg-transparent text-forest border border-forest hover:bg-surface-container active:bg-surface-container-high',
  };

  const combinedClass = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedClass}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClass} {...props}>
      {children}
    </button>
  );
};
