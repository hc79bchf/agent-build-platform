import React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  variant?: 'default' | 'success' | 'orange' | 'violet' | 'secondary';
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        {...props}
      />
    );
  }
);

Label.displayName = 'Label';

// Badge component for tags
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'orange' | 'violet' | 'secondary';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
          {
            'bg-primary/10 text-primary': variant === 'default',
            'bg-success/10 text-success-foreground': variant === 'success',
            'bg-warning/10 text-warning-foreground': variant === 'orange',
            'bg-info/10 text-info-foreground': variant === 'violet',
            'bg-secondary text-secondary-foreground': variant === 'secondary',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
