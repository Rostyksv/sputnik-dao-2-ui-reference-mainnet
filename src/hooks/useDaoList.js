import { useEffect, useState } from "react";
import { useGlobalMutation } from "../utils/container";
import { useWalletSelector } from '../contexts/WalletSelectorContext';
import { nearConfig } from '../utils/utils';

export const useDaoList = (props) => {
  const { setShowLoading } = props;
  const mutationCtx = useGlobalMutation();
  const [daoList, setDaoList] = useState();

  const { provider } = useWalletSelector();


  useEffect(() => {
    (async () => {
      try {
        async function getPublicDaos(contractId, method, args) {
          console.log('33333');
          const response = await provider.query({
            request_type: "call_function",
            account_id: contractId,
            method_name: method,
            args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
            finality: "optimistic"
          });
          console.log(response, 'resp111');
          return JSON.parse(Buffer.from(response.result).toString())
        }

        const daos = await getPublicDaos(nearConfig.contractName, "get_daos", {
          from_index: Math.floor(props.fromIndex * props.limit),
          limit: props.limit,
        });

        console.log(daos, 'daos5');

        if (daos) {
          setDaoList(daos);
          setShowLoading(false);
        }
      } catch (e) {
        setShowLoading(false);
        mutationCtx.toastError(e);
      }
    })();

    return setDaoList([]);
  }, [props?.fromIndex, props?.limit]);

  return { daoList };
};
