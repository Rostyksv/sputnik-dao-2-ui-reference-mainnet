import { useEffect, useState } from 'react';
import { useGlobalMutation } from '../utils/container';
import { nearConfig } from '../utils/utils';
import { useWalletSelector } from '../contexts/WalletSelectorContext';

export const useDaoCount = (props) => {
  const { setShowLoading } = props;
  const mutationCtx = useGlobalMutation();
  const [daoCount, setDaoCount] = useState(0);

  const { provider } = useWalletSelector();


  useEffect(() => {
    (async () => {
      try {
        async function getPublicDaosCount(contractId, method) {
          const response = await provider.query({
            request_type: "call_function",
            account_id: contractId,
            method_name: method,
            args_base64: Buffer.from("").toString("base64"),
            finality: "optimistic"
          });

          return JSON.parse(Buffer.from(response.result).toString())
        }

        const count = await getPublicDaosCount(nearConfig.contractName, "get_number_daos");

        if (count) {
          setDaoCount(count);
          setShowLoading(false);
        }
      } catch (e) {
        setShowLoading(false);
        mutationCtx.toastError(e);
      }
    })();

    return setDaoCount(0);
  }, []);

  return { daoCount };
};
