'use client';

import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'accent' | 'secondary';
  size?: 'sm' | 'md';
}

const variantClasses = {
  default: 'bg-gray-100 text-text-main',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-yellow-700',
  accent: 'bg-accent/15 text-accent',
  secondary: 'bg-secondary/15 text-secondary',
};

const sizeClasses = { sm: 'px-2 py-0.5 text-xs', md: 'px-3 py-1 text-sm' };

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-body font-semibold ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  );
}
