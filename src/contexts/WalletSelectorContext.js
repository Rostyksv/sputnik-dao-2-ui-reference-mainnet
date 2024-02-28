import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';

import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import Loading from '../utils/Loading';
import { nearConfig } from '../utils/utils';
import { distinctUntilChanged, map } from "rxjs";
import { providers } from 'near-api-js';

const WalletSelectorContext = React.createContext(null);

export const WalletSelectorContextProvider = ({ children }) => {
  const [selector, setSelector] = useState(null);
  const [modal, setModal] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const CONTRACT_ID = nearConfig.contractName;
  const THIRTY_TGAS = '30000000000000';
  const NO_DEPOSIT = '0';

  const init = useCallback(async () => {
    const _selector = await setupWalletSelector({
      network: "testnet",
      modules: [setupMyNearWallet()],
    });
    const _modal = setupModal(_selector, {
      contractId: CONTRACT_ID,
    });
    console.log(_selector, 'sel1');
    const state = _selector.store.getState();
    console.log(state, 'state1');
    setAccounts(state.accounts);

    window.selector = _selector;
    window.modal = _modal;

    setSelector(_selector);
    setModal(_modal);
    setLoading(false);
  }, []);

  useEffect(() => {
    init().catch((err) => {
      console.error(err);
      alert('Failed to initialise wallet selector');
    });
  }, [init]);

  useEffect(() => {
    if (!selector) {
      return;
    }

    const subscription = selector.store.observable
      .pipe(map((state) => state.accounts), distinctUntilChanged())
      .subscribe((nextAccounts) => {
        console.log('Accounts Update', nextAccounts);

        setAccounts(nextAccounts);
      });
console.log(modal, '11111');
    const onHideSubscription = modal && modal.on("onHide", (event) => {
        console.log(event, 'ev1');
      });
    console.log('22222');

    return () => {
      subscription.unsubscribe();
      onHideSubscription?.remove();
    };
  }, [selector, modal]);

  console.log(selector, 'sele1');
  const { network } = selector?.options || {};
  console.log(network, 'net1');
  const provider = new providers.JsonRpcProvider({ url: network?.nodeUrl });
console.log(provider, 'pro');

  async function viewMethod({ contractId = nearConfig.contractName, method, args = {} }) {
    console.log(contractId, 'con111');
    let res = await provider.query({
      request_type: 'call_function',
      account_id: contractId,
      method_name: method,
      args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
      finality: 'optimistic',
    });
    console.log(res, 'res555');
    return JSON.parse(Buffer.from(res.result).toString());
  }

  async function callMethod({ contractId = nearConfig.contractName, method, args = {}, gas = THIRTY_TGAS, deposit = NO_DEPOSIT }) {
    const wallet = await selector.wallet();
    console.log(wallet, 'wallet1');
    const outcome = await wallet.signAndSendTransaction({
      receiverId: contractId,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: method,
            args,
            gas,
            deposit,
          },
        },
      ],
    });

    return providers.getTransactionLastResult(outcome)
  }

  const walletSelectorContextValue = useMemo(
    () => ({
      selector: selector,
      modal: modal,
      accounts,
      accountId: accounts.find((account) => account.active)?.accountId || null,
      provider,
      viewMethod,
      callMethod
    }),
    [selector, modal, accounts]
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <WalletSelectorContext.Provider value={walletSelectorContextValue}>
      {children}
    </WalletSelectorContext.Provider>
  );
};

export function useWalletSelector() {
  const context = useContext(WalletSelectorContext);

  if (!context) {
    throw new Error('useWalletSelector must be used within a WalletSelectorContextProvider');
  }

  return context;
}
