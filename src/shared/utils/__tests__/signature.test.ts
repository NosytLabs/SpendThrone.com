import { describe, it, expect } from 'vitest';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { createLoginMessage, verifySignature } from '../signature';

describe('Signature Utilities', () => {
  it('should create a correctly formatted login message', () => {
    const wallet = 'AgA7x4Qz5J...';
    const timestamp = 1234567890;
    const message = createLoginMessage(wallet, timestamp);
    
    expect(message).toBe(`Login to SpendThrone.com\nWallet: ${wallet}\nTimestamp: ${timestamp}`);
  });

  it('should verify a valid signature', () => {
    // Generate a keypair
    const keypair = nacl.sign.keyPair();
    const publicKey = bs58.encode(keypair.publicKey);
    
    const timestamp = Date.now();
    const message = createLoginMessage(publicKey, timestamp);
    const messageBytes = new TextEncoder().encode(message);
    
    // Sign the message - explicitly ensure Uint8Array
    const signature = nacl.sign.detached(new Uint8Array(messageBytes), new Uint8Array(keypair.secretKey));
    const signatureBase58 = bs58.encode(signature);

    // Verify
    const isValid = verifySignature(message, signatureBase58, publicKey);
    expect(isValid).toBe(true);
  });

  it('should reject an invalid signature', () => {
    const keypair = nacl.sign.keyPair();
    const publicKey = bs58.encode(keypair.publicKey);
    
    const message = 'Some other message';
    const messageBytes = new TextEncoder().encode(message);
    
    const signature = nacl.sign.detached(new Uint8Array(messageBytes), new Uint8Array(keypair.secretKey));
    const signatureBase58 = bs58.encode(signature);

    // Verify against DIFFERENT message
    const isValid = verifySignature('Original Message', signatureBase58, publicKey);
    expect(isValid).toBe(false);
  });

  it('should reject a signature from a different key', () => {
    const keypair1 = nacl.sign.keyPair();
    const keypair2 = nacl.sign.keyPair();
    
    const publicKey1 = bs58.encode(keypair1.publicKey);
    
    const message = 'Login Message';
    const messageBytes = new TextEncoder().encode(message);
    
    // Sign with Key 2
    const signature = nacl.sign.detached(new Uint8Array(messageBytes), new Uint8Array(keypair2.secretKey));
    const signatureBase58 = bs58.encode(signature);

    // Verify against Key 1
    const isValid = verifySignature(message, signatureBase58, publicKey1);
    expect(isValid).toBe(false);
  });
});
