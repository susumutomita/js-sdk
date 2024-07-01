import { Network } from '../types';

export type LitActionType =
  | 'signTransaction'
  | 'signMessage'
  | 'generateEncryptedKey';

export type LitCidRepositoryEntry = Readonly<Record<Network, string>>;

export type LitCidRepository = Readonly<
  Record<LitActionType, LitCidRepositoryEntry>
>;
