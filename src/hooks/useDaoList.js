import { useEffect, useState } from "react";
import { useGlobalMutation } from "../utils/container";
import { useWalletSelector } from '../contexts/WalletSelectorContext';
import { nearConfig } from '../utils/utils';

export const useDaoList = (props) => {
  const { setShowLoading } = props;
  const mutationCtx = useGlobalMutation();
  const [daoList, setDaoList] = useState();

  const { viewMethod } = useWalletSelector();

  useEffect(() => {
    (async () => {
      try {
        const daos = await viewMethod({ method: "get_daos", args: {
          from_index: Math.floor(props.fromIndex * props.limit),
            limit: props.limit,
        }});

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
