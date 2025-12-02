import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/utils/utils';

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={() => onOpenChange(false)}
            />
            <div className="relative z-50 w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200">
                {children}
            </div>
        </div>,
        document.body
    );
};

export const DialogContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("relative w-full bg-background-secondary border border-border-primary rounded-xl shadow-2xl p-6", className)}>
        {children}
    </div>
);

export const DialogHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)}>
        {children}
    </div>
);

export const DialogTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight text-text-primary", className)}>
        {children}
    </h2>
);

export const DialogDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <p className={cn("text-sm text-text-secondary", className)}>
        {children}
    </p>
);

export const DialogFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6", className)}>
        {children}
    </div>
);
