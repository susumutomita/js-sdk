/* global accessControlConditions */

import { litActionHandler } from '../../litActionHandler';
import { generateEncryptedSolanaPrivateKey } from '../../raw-action-functions/solana/generateEncryptedSolanaPrivateKey';

declare global {
  var accessControlConditions: string
}

(async () =>
  litActionHandler(async () =>
    generateEncryptedSolanaPrivateKey({
      accessControlConditions,
    })
  ))();
