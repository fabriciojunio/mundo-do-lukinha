'use client';

import { type ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-bg hover:bg-primary/90 shadow-md shadow-primary/20 font-bold',
  secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-md shadow-secondary/20',
  success: 'bg-success text-bg hover:bg-success/90 shadow-md shadow-success/20',
  danger: 'bg-error text-white hover:bg-error/90 shadow-md shadow-error/20',
  ghost: 'bg-transparent text-text-main hover:bg-surface-2 border border-border',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm min-h-[36px] rounded-lg',
  md: 'px-4 py-2 text-base min-h-[44px] rounded-xl',
  lg: 'px-6 py-3 text-lg min-h-[52px] rounded-xl',
  xl: 'px-8 py-4 text-xl min-h-[64px] rounded-2xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center font-display
          transition-all duration-200 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
