import { forwardRef, useImperativeHandle, useRef } from 'react';
import html2canvas from 'html2canvas';
import { RoyalIcon } from '@/components/ui/RoyalIcon';
import { formatCurrency } from '@/shared/utils/formatting/currency';
import warrantBg from '@/assets/images/warrant-bg.png';

interface RoyalWarrantProps {
  userData: {
    displayName: string;
    rank: number;
    totalContributed: number;
    walletAddress: string;
    joinedDate: string;
    tier: string;
  };
}

export interface RoyalWarrantHandle {
  generateImage: () => Promise<string>;
}

export const RoyalWarrant = forwardRef<RoyalWarrantHandle, RoyalWarrantProps>(({ userData }, ref) => {
  const warrantRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    generateImage: async () => {
      if (!warrantRef.current) return '';
      
      try {
        // Wait for fonts to load
        await document.fonts.ready;
        
        const canvas = await html2canvas(warrantRef.current, {
          scale: 2, // High DPI
          backgroundColor: '#000000',
          logging: false,
          useCORS: true,
          allowTaint: true
        });
        
        return canvas.toDataURL('image/png');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to generate warrant:', error);
        return '';
      }
    }
  }));

  // Determine title based on rank
  const title = userData.rank === 1 ? 'EMPEROR' : 
                userData.rank <= 10 ? 'HIGH NOBLE' : 
                'ASPIRANT';

  const borderColor = userData.rank === 1 ? 'border-accent-primary' : 
                      userData.rank <= 10 ? 'border-accent-secondary' : 
                      'border-border-primary';

  const glowColor = userData.rank === 1 ? 'shadow-[0_0_50px_rgba(255,215,0,0.3)]' :
                    userData.rank <= 10 ? 'shadow-[0_0_30px_rgba(192,192,192,0.2)]' :
                    'shadow-none';

  return (
    <div className="absolute left-[-9999px] top-[-9999px]">
      <div 
        ref={warrantRef}
        className={`w-[800px] h-[418px] bg-black relative overflow-hidden flex flex-col items-center justify-center text-center p-12 border-[8px] ${borderColor} ${glowColor}`}
        style={{
          backgroundImage: `url(${warrantBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-50px] left-[-50px] w-[300px] h-[300px] rounded-full bg-accent-primary blur-[100px]" />
          <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] rounded-full bg-accent-secondary blur-[100px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-4 w-full h-full border border-white/10 p-8">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <RoyalIcon variant="crown" size={32} className={userData.rank === 1 ? "text-accent-primary" : "text-white/80"} />
            <h2 className="text-2xl font-serif tracking-[0.2em] text-white/90 uppercase">Royal Warrant of Status</h2>
            <RoyalIcon variant="crown" size={32} className={userData.rank === 1 ? "text-accent-primary" : "text-white/80"} />
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-6" />

          {/* Main Text */}
          <p className="text-text-secondary text-lg font-light italic">By the decree of the Blockchain, it is known that</p>
          
          <h1 className="text-4xl font-bold text-white my-2 tracking-wide text-shadow-lg truncate max-w-full px-4">
            {userData.displayName}
          </h1>
          
          <p className="text-text-secondary text-lg font-light italic">holds the exalted title of</p>
          
          <div className="my-4 relative">
             <div className="absolute inset-0 bg-accent-primary/20 blur-xl rounded-full" />
             <span className={`relative text-5xl font-black uppercase tracking-widest ${userData.rank === 1 ? 'text-accent-primary' : 'text-white'}`}>
               {title}
             </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-8 w-full mt-auto pt-6 border-t border-white/10">
            <div className="text-center">
              <div className="text-xs uppercase tracking-widest text-text-muted mb-1">Rank</div>
              <div className="text-2xl font-bold text-white">#{userData.rank}</div>
            </div>
            <div className="text-center border-l border-r border-white/10">
              <div className="text-xs uppercase tracking-widest text-text-muted mb-1">Tribute</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(userData.totalContributed)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs uppercase tracking-widest text-text-muted mb-1">Authenticated</div>
              <div className="text-2xl font-bold text-white">{new Date().toLocaleDateString()}</div>
            </div>
          </div>

          {/* Footer Logo */}
          <div className="absolute bottom-2 right-4 text-[10px] text-white/30 font-mono tracking-widest">
            SPENDTHRONE.COM // VERIFIED ON CHAIN
          </div>
        </div>
      </div>
    </div>
  );
});

RoyalWarrant.displayName = 'RoyalWarrant';
