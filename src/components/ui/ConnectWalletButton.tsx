import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { RoyalIcon } from './RoyalIcon';
import { useSoundEffects } from './useSoundEffects';

export const ConnectWalletButton = () => {
  const { connected } = useWallet();
  const { playSound } = useSoundEffects();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative group">
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative" onClickCapture={() => playSound('click')}>
        <WalletMultiButton className="!bg-black !text-accent-primary !border !border-accent-primary/50 !font-cinzel !font-bold !px-6 !rounded-lg hover:!bg-accent-primary/10 transition-all duration-300 !h-12 !flex !items-center !justify-center gap-2 text-sm sm:text-base">
            {!connected && <RoyalIcon variant="wallet" className="mr-2" />}
            {connected ? 'Connected' : 'Connect Wallet'}
        </WalletMultiButton>
      </div>
    </div>
  );
};
