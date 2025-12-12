import React from 'react';
import { RoyalIcon, RoyalIconProps } from '../ui/RoyalIcon';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: RoyalIconProps['variant'] | React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    variant?: 'default' | 'compact';
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    icon,
    children,
    className = '',
    variant = 'default'
}) => {
    const isCompact = variant === 'compact';

    return (
        <section className={`relative ${isCompact ? 'py-6 md:py-10' : 'py-10 md:py-16'} overflow-hidden text-center ${className}`}>
            {/* Global Hero Gradient (Transparent to let PageLayout mesh show through) */}
            <div className="absolute inset-0 bg-gradient-to-b from-gold-500/10 to-transparent z-0" />

            <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">

                {/* Animated Icon */}
                {icon && (
                    <div className={`flex justify-center w-full ${!isCompact && 'animate-float'}`}>
                        {typeof icon === 'string' ? (
                            <RoyalIcon
                                variant={icon as RoyalIconProps['variant']}
                                size={isCompact ? 48 : 64}
                                className={`mb-6 md:mb-8 ${isCompact ? 'opacity-90' : ''}`}
                            />
                        ) : (
                            <div className="mb-6 md:mb-8">{icon}</div>
                        )}
                    </div>
                )}

                {/* Title with Glow */}
                <h1 className={`${isCompact ? 'royal-text-title' : 'royal-text-hero'} royal-heading-glow text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 drop-shadow-[0_0_35px_var(--shadow-solana-lg)] animate-text-gradient px-4`}>
                    {title}
                </h1>

                {/* Subtitle */}
                {subtitle && (
                    <p className={`${isCompact ? 'text-lg md:text-xl' : 'royal-text-subtitle'} text-text-secondary max-w-3xl mx-auto italic font-serif`}>
                        {subtitle}
                    </p>
                )}

                {/* Action Buttons (Children) */}
                {children && (
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8">
                        {children}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PageHeader;
