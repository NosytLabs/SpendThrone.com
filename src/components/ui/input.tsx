import React from 'react';
import { cn } from '@/shared/utils/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-lg border border-border-primary bg-background-secondary px-3 py-2 text-sm text-text-primary shadow-sm transition-all duration-200",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                    "placeholder:text-text-muted",
                    "hover:border-accent-primary/50 hover:bg-background-secondary/80",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 focus-visible:border-accent-primary",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";
