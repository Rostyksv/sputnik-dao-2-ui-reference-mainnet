import { useEffect, useState } from 'react';
import { useGlobalMutation } from '../utils/container';
import { nearConfig } from '../utils/utils';
import { useWalletSelector } from '../contexts/WalletSelectorContext';

export const useDaoCount = (props) => {
  const { setShowLoading } = props;
  const mutationCtx = useGlobalMutation();
  const [daoCount, setDaoCount] = useState(0);

  const { provider, viewMethod } = useWalletSelector();

  useEffect(() => {
    (async () => {
      try {
        const count = await viewMethod({ method: 'get_number_daos' });

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
