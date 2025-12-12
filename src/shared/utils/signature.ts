import nacl from 'tweetnacl';
import bs58 from 'bs58';

/**
 * Creates a standardized message for the user to sign.
 * This prevents replay attacks by including a timestamp (optional in this basic version, but good practice).
 */
export const createLoginMessage = (walletAddress: string, timestamp: number): string => {
  return `Login to SpendThrone.com\nWallet: ${walletAddress}\nTimestamp: ${timestamp}`;
};

/**
 * Verifies a Solana signature.
 * 
 * @param message The original message string that was signed.
 * @param signature The signature in base58 format or Uint8Array.
 * @param publicKey The signer's public key in base58 format.
 * @returns boolean indicating if the signature is valid.
 */
export const verifySignature = (
  message: string,
  signature: string | Uint8Array,
  publicKey: string
): boolean => {
  try {
    const messageBytes = new Uint8Array(new TextEncoder().encode(message));
    
    let signatureBytes: Uint8Array;
    if (typeof signature === 'string') {
      signatureBytes = new Uint8Array(bs58.decode(signature));
    } else {
      signatureBytes = new Uint8Array(signature);
    }

    const publicKeyBytes = new Uint8Array(bs58.decode(publicKey));

    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
  } catch (error) {
    // console.error('Signature verification failed:', error);
    return false;
  }
};
