import React, { FC } from "react";

import { Button } from "@material-ui/core";

const AssignContribition: RetoolComponent<{
  contributionsContract: string,
  contributionId: string,
  contributorId: string,
  walletAddress?: string | null;
}> = ({ triggerQuery, model, modelUpdate }) => {
  const [walletAddress, setWalletAddress] = React.useState<string>();

  const assignContribution = () => {
    window.starknet.account.execute({
      contractAddress: model.contributionsContract,
      entrypoint: "assign_contributor_to_contribution",
      calldata: [
        model.contributionId,
        "0x000",
        model.contributorId,
      ]
    });
  };

  const connect = async () => {
    const res = await window.starknet.enable() as [string];
    setWalletAddress(res[0]);
    modelUpdate({ walletAddress: res[0] || null });
  };

  return (
    <div>
      {!walletAddress && (
        <Button color="primary" variant="outlined" onClick={connect}>
          Connect wallet
        </Button>
      )}
      {walletAddress && (
        <Button color="primary" variant="outlined" onClick={assignContribution}>
          Assign contribution
        </Button>
      )}
    </div>
  );
};

type RetoolComponent<T extends Object = {}> = FC<{
  triggerQuery: (query: string) => void;
  model: T;
  modelUpdate: (model: Partial<T>) => void;
}>;

export default AssignContribition;

declare global {
  interface Window {
    starknet: any;
  }
}
