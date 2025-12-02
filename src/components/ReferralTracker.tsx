import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PublicKey } from '@solana/web3.js';
import { useToast } from './ui/use-toast';

export const ReferralTracker = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      try {
        // Validate it's a valid Solana address
        new PublicKey(ref);
        
        // Store in localStorage
        const currentRef = localStorage.getItem('referrer_address');
        if (currentRef !== ref) {
          localStorage.setItem('referrer_address', ref);
          addToast({
            type: 'royal',
            title: 'Referral Applied',
            description: 'You have been referred by a noble subject.',
          });
        }
        
        // Clean URL
        searchParams.delete('ref');
        setSearchParams(searchParams);
      } catch (e) {
        // console.warn('Invalid referrer address:', ref);
      }
    }
  }, [searchParams, setSearchParams, addToast]);

  return null;
};