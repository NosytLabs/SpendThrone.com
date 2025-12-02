import React from 'react';

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ title, subtitle, children, className = '' }) => {
  return (
    <section className={`mb-16 ${className}`}>
      <div className="w-full">
        {title && (
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold royal-text-title text-text-primary">{title}</h2>
            {subtitle && <p className="text-lg text-text-secondary max-w-3xl mx-auto font-serif italic">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;
