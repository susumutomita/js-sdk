import { log } from '@lit-protocol/misc';
import { ethers } from 'ethers';
import { TinnyEnvironment } from 'local-tests/setup/tinny-environment';
import { api } from '@lit-protocol/wrapped-keys';
import { getPkpSessionSigs } from 'local-tests/setup/session-sigs/get-pkp-session-sigs';

const { importPrivateKey, signTransactionWithEncryptedKey } = api;
/**
 * Test Commands:
 * ✅ NETWORK=cayenne yarn test:local --filter=testFailEthereumSignTransactionWrappedKeyWithMissingParam
 * ✅ NETWORK=manzano yarn test:local --filter=testFailEthereumSignTransactionWrappedKeyWithMissingParam
 * ✅ NETWORK=localchain yarn test:local --filter=testFailEthereumSignTransactionWrappedKeyWithMissingParam
 */
export const testFailEthereumSignTransactionWrappedKeyWithMissingParam = async (
  devEnv: TinnyEnvironment
) => {
  const alice = await devEnv.createRandomPerson();

  const pkpSessionSigs = await getPkpSessionSigs(
    devEnv,
    alice,
    null,
    new Date(Date.now() + 1000 * 60 * 10).toISOString()
  ); // 10 mins expiry

  console.log(pkpSessionSigs);

  const privateKey = ethers.Wallet.createRandom().privateKey;

  const pkpAddress = await importPrivateKey({
    pkpSessionSigs,
    privateKey,
    litNodeClient: devEnv.litNodeClient,
    address: '0xdeadbeef',
    algo: 'K256',
  });

  const alicePkpAddress = alice.authMethodOwnedPkp.ethAddress;
  if (pkpAddress !== alicePkpAddress) {
    throw new Error(
      `Received address: ${pkpAddress} doesn't match Alice's PKP address: ${alicePkpAddress}`
    );
  }

  const pkpSessionSigsSigning = await getPkpSessionSigs(
    devEnv,
    alice,
    null,
    new Date(Date.now() + 1000 * 60 * 10).toISOString()
  ); // 10 mins expiry

  console.log(pkpSessionSigsSigning);

  try {
    const _res = await signTransactionWithEncryptedKey({
      pkpSessionSigs: pkpSessionSigsSigning,
      network: 'evm',
      unsignedTransaction: {
        chain: 'chronicleTestnet',
        // @ts-expect-error This test is intentionally using the type incorrectly.
        serializedTransaction: 'random-value',
      },
      broadcast: false,
      litNodeClient: devEnv.litNodeClient,
    });
  } catch (e: any) {
    console.log('❌ THIS IS EXPECTED: ', e);
    console.log(e.message);

    if (
      e.message.includes(
        'Error executing the Signing Lit Action: Error: Missing required field: toAddress'
      )
    ) {
      console.log(
        '✅ testFailEthereumSignTransactionWrappedKeyWithMissingParam is expected to have an error'
      );
    } else {
      throw e;
    }
  }

  log('✅ testFailEthereumSignTransactionWrappedKeyWithMissingParam');
};
