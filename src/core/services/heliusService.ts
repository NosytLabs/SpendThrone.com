import type { Commitment } from '@solana/web3.js';
import { getRpcUrl, isRpcEnabled } from '../../core/constants/endpoints';
import { apiClient } from './apiClient';

export type HeliusTransactionSummary = {
    signature: string;
    slot: number;
    blockTime?: number;
    success: boolean;
    fee?: number;
};

export type GetTxOptions = {
    limit?: number; // default 25
    commitment?: Commitment; // default 'finalized'
    before?: string; // pagination cursor
    until?: string; // pagination cursor
    transactionDetails?: 'signatures' | 'full'; // default 'signatures'
    maxConcurrency?: number; // default 4, only used when transactionDetails==='full'
};

const jsonRpcBase = () => getRpcUrl();

export async function getTransactionsForAddress(
    address: string,
    opts: GetTxOptions = {}
): Promise<HeliusTransactionSummary[]> {
    if (!isRpcEnabled()) {
        return [];
    }
    const url = jsonRpcBase();

    // Step 1: Fetch signatures for the address (Solana-compatible JSON RPC)
    const sigPayload = {
        jsonrpc: '2.0',
        id: 'getSignaturesForAddress',
        method: 'getSignaturesForAddress',
        params: [
            address,
            {
                limit: opts.limit ?? 25,
                commitment: opts.commitment ?? 'finalized',
                before: opts.before,
                until: opts.until,
            },
        ],
    };

    type SignaturesResponse = { result?: Array<{ signature: string; slot: number; blockTime?: number }> };
    const sigData = await apiClient.post<SignaturesResponse, typeof sigPayload>(url, sigPayload);
    const signatures = sigData.result ?? [];

    // If only signatures are requested, return minimal summaries
    if ((opts.transactionDetails ?? 'signatures') === 'signatures') {
        return signatures.map((sig) => ({
            signature: sig.signature ?? 'unknown',
            slot: sig.slot ?? 0,
            blockTime: sig.blockTime ?? undefined,
            // Without fetching full transaction, success and fee are unknown.
            success: true,
            fee: undefined,
        }));
    }

    // Step 2: Fetch full transaction details for each signature when requested
    const maxConcurrency = Math.max(1, opts.maxConcurrency ?? 4);
    const txSummaries: HeliusTransactionSummary[] = new Array(signatures.length);

    let cursor = 0;
    const worker = async () => {
        while (cursor < signatures.length) {
            const idx = cursor++;
            const sig = signatures[idx];
            const signature = sig?.signature;
            if (!signature) {
                txSummaries[idx] = {
                    signature: 'unknown',
                    slot: sig?.slot ?? 0,
                    blockTime: sig?.blockTime ?? undefined,
                    success: true, // Assuming success as we can't verify
                    fee: undefined,
                };
                continue;
            }

            const txPayload = {
                jsonrpc: '2.0',
                id: 'getTransaction',
                method: 'getTransaction',
                params: [
                    signature,
                    {
                        commitment: opts.commitment ?? 'finalized',
                        maxSupportedTransactionVersion: 0,
                    },
                ],
            };

            try {
                type TxResponse = { result?: { slot?: number; blockTime?: number; meta?: { err?: unknown; fee?: number } } };
                const txData = await apiClient.post<TxResponse, typeof txPayload>(url, txPayload);
                const tx = txData.result;
                txSummaries[idx] = {
                    signature,
                    slot: (tx?.slot ?? sig?.slot ?? 0),
                    blockTime: (tx?.blockTime ?? sig?.blockTime ?? undefined),
                    success: !(tx?.meta?.err),
                    fee: tx?.meta?.fee ?? undefined,
                };
            } catch {
                txSummaries[idx] = {
                    signature,
                    slot: sig?.slot ?? 0,
                    blockTime: sig?.blockTime ?? undefined,
                    success: true, // Assuming success as we can't verify
                    fee: undefined,
                };
            }
        }
    };

    const workers = Array.from({ length: maxConcurrency }, () => worker());
    await Promise.all(workers);
    // Filter out any undefined entries in case of race conditions
    return txSummaries.filter(Boolean);
}
