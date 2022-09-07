import { Abi, Contract } from "starknet";
import contributionsAbi from "./contributions.json";
import { retool, starknet } from "./libraries";

let contract: Contract;

const connect = async (contractAddress: any) => {
  const [account] = await starknet.enable();
  contract = new Contract(
    contributionsAbi as Abi,
    contractAddress,
    starknet.provider
  );
  contract.connect(starknet.account);
  retool.updateModel({
    connect: false,
    account,
    chainId: starknet.account.chainId,
  });
};

export const retoolSubscription = async (model: any) => {
  if (
    starknet &&
    (starknet.isConnected || model.connect) &&
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
    retool.updateModel({ createContribution: false });
  }
};

retool.subscribe(retoolSubscription);
