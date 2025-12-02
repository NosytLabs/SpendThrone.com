import { PublicKey } from '@solana/web3.js'
import nacl from 'tweetnacl'

export type SiwsResult = {
  address: string
  message: string
  signature: Uint8Array
  verified: boolean
}

export function buildSiwsMessage(address: string): string {
  const ts = new Date().toISOString()
  return `SpendThrone Admin Approval\nAddress: ${address}\nTimestamp: ${ts}`
}

export async function requestSiwsSignature(wallet: { publicKey?: PublicKey | null; signMessage?: (msg: Uint8Array) => Promise<Uint8Array> }): Promise<SiwsResult> {
  if (!wallet.publicKey || !wallet.signMessage) throw new Error('Wallet must support message signing')
  const address = wallet.publicKey.toBase58()
  const message = buildSiwsMessage(address)
  const data = new globalThis.TextEncoder().encode(message)
  const signature = await wallet.signMessage(data)
  const verified = verifySiwsSignature(address, data, signature)
  return { address, message, signature, verified }
}

export function verifySiwsSignature(address: string, message: Uint8Array, signature: Uint8Array): boolean {
  try {
    const pubkey = new PublicKey(address)
    return nacl.sign.detached.verify(message, signature, pubkey.toBytes())
  } catch {
    return false
  }
}