import { LIT_NETWORK } from '@lit-protocol/constants';
import { AccessControlConditions } from 'local-tests/setup/accs/accs';
import { getLitActionSessionSigs } from 'local-tests/setup/session-sigs/get-lit-action-session-sigs';
import { TinnyEnvironment } from 'local-tests/setup/tinny-environment';

/**
 * Test Commands:
 * ✅ NETWORK=datil-dev yarn test:local --filter=testUseValidLitActionCodeGeneratedSessionSigsToEncryptDecryptString
 * ✅ NETWORK=custom yarn test:local --filter=testUseValidLitActionCodeGeneratedSessionSigsToEncryptDecryptString
 *
 */
export const testExecuteJsBroadcastAndCollect = async (
  devEnv: TinnyEnvironment
) => {
  const alice = await devEnv.createRandomPerson();
  // set access control conditions for encrypting and decrypting
  const accs = AccessControlConditions.getEmvBasicAccessControlConditions({
    userAddress: alice.authMethodOwnedPkp.ethAddress,
  });

  const litActionSessionSigs = await getLitActionSessionSigs(devEnv, alice);

  const res = await devEnv.litNodeClient.executeJs({
    sessionSigs: litActionSessionSigs,
    code: `(async () => {
        let rand = Math.floor(Math.random() * 100);
        const resp = await Lit.Actions.broadcastAndCollect({
            name: "temperature",
            value: rand.toString(),
        });
        Lit.Actions.setResponse({
            response: JSON.stringify(resp)
        });
      })();`,
    jsParams: {},
  });
  devEnv.releasePrivateKeyFromUser(alice);

  const response = res.response;
  if (!response) {
    throw new Error('Should contained broadcast data');
  }
};
