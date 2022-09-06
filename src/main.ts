import { Abi, Contract } from "starknet";
import contributionsAbi from "./contributions.json";

declare global {
  interface Window {
    Retool: any;
    connect: any;
    starknet_braavos?: any;
  }
}

let contract: Contract;

const connect = async (contractAddress: any) => {
  const [account] = await window.starknet_braavos.enable();
  contract = new Contract(
    contributionsAbi as Abi,
    contractAddress,
    window.starknet_braavos.provider
  );
  contract.connect(window.starknet_braavos.account);
  window.Retool.updateModel({
    connect: false,
    account,
    chainId: window.starknet_braavos.account.chainId,
  });
};

window.Retool.subscribe(async (model: any) => {
  if (
    window.starknet_braavos &&
    (window.starknet_braavos.isConnected || model.connect) &&
    model.account === false
  ) {
    await connect(model.contractAddress);
    return;
  }

  if (model.createContribution) {
    await contract.new_contribution(
      model.projectId.toString(),
      model.issueNumber.toString(),
      model.gate.toString()
    );
    window.Retool.updateModel({ createContribution: false });
  }
});
