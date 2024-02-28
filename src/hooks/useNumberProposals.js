import { useEffect, useState } from 'react';
import { useGlobalMutation } from '../utils/container';
import { useWalletSelector } from '../contexts/WalletSelectorContext';

export const useNumberProposals = (props) => {
  const { setShowLoading, contractId } = props;
  const mutationCtx = useGlobalMutation();
  const [numberProposals, setNumberProposals] = useState(0);

  const { viewMethod } = useWalletSelector();

  const getLastProposalId = async () => {
    return await viewMethod({ contractId, method: 'get_last_proposal_id' }) || 0;
  };

  useEffect(() => {
    (async () => {
      try {
        const proposalId = await getLastProposalId();
        setNumberProposals(proposalId);
        setShowLoading(false);
      } catch (e) {
        setShowLoading(false);
        mutationCtx.toastError(e);
      }
    })();

    return () => {
      setNumberProposals(0);
    };
  }, []);

  return { numberProposals };
};
