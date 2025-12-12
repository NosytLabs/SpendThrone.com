import React from 'react';
import { RoyalIcon } from '@/components/ui';
import { HistoryEraData } from '@/core/data/historyPageData';

interface VisualTimelineProps {
  eras: HistoryEraData[];
  activeEraId?: string;
  onEraSelect: (eraId: string) => void;
}

export const VisualTimeline: React.FC<VisualTimelineProps> = ({ 
  eras, 
  activeEraId, 
  onEraSelect 
}) => {
  return (
    <div className="w-full overflow-x-auto py-6 mb-8 scrollbar-hide">
      <div className="flex items-center min-w-max px-4">
        {eras.map((era, index) => {
          const isActive = activeEraId === era.id;
          return (
            <React.Fragment key={era.id}>
              {/* Timeline Node */}
              <button
                onClick={() => onEraSelect(era.id)}
                className={`
                  relative flex flex-col items-center group transition-all duration-300
                  ${isActive ? 'scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'}
                `}
              >
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-2 z-10 transition-all
                  ${isActive 
                    ? 'bg-accent-primary border-accent-primary text-black shadow-[0_0_15px_rgba(234,179,8,0.6)]' 
                    : 'bg-background-secondary border-border-primary text-text-secondary hover:border-accent-primary/50'}
                `}>
                  <RoyalIcon variant={era.icon} size={20} />
                </div>
                <div className="absolute top-14 text-center w-32">
                  <span className={`
                    text-xs font-bold block mb-1 transition-colors
                    ${isActive ? 'text-accent-primary' : 'text-text-secondary group-hover:text-text-primary'}
                  `}>
                    {era.title}
                  </span>
                  <span className="text-[10px] text-text-muted block">
                    {era.yearRange}
                  </span>
                </div>
              </button>

              {/* Connector Line */}
              {index < eras.length - 1 && (
                <div className="w-16 h-0.5 bg-border-primary mx-2 relative top-[-1.5rem]">
                  <div className="absolute inset-0 bg-accent-primary origin-left transform scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
