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

const createContribution = async (
  projectId: string,
  issueNumber: string,
  gate: string
) => {
  await contract.new_contribution(projectId, issueNumber, gate);
  retool.updateModel({ createContribution: false });
};

const assignContribution = async (
  contributionId: string,
  contributorId: string
) => {
  await contract.assign_contributor_to_contribution(
    [contributionId],
    [contributorId, ""]
  );
  retool.updateModel({ assignContribution: false });
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
    await createContribution(
      model.projectId.toString(),
      model.issueNumber.toString(),
      model.gate.toString()
    );
    return;
  }

  if (model.assignContribution) {
    await assignContribution(
      model.contributionToAssign.toString(),
      model.contributorToAssign.toString()
    );
    return;
  }
};

retool && retool.subscribe(retoolSubscription);
