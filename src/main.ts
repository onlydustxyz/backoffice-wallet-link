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
    pendingAction: "",
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
  retool.updateModel({ pendingAction: "" });
};

const assignContribution = async (
  contributionId: string,
  contributorId: string
) => {
  await contract.assign_contributor_to_contribution(
    [contributionId],
    [contributorId, ""]
  );
  retool.updateModel({ pendingAction: "" });
};

const validateContribution = async (contributionId: string) => {
  await contract.validate_contribution([contributionId]);
  retool.updateModel({ pendingAction: "" });
};

export const retoolSubscription = async (model: any) => {
  if (
    starknet &&
    (starknet.isConnected || model.pendingAction === "connect") &&
    model.account === false
  ) {
    await connect(model.contractAddress);
    retool.triggerQuery(model.onConnectCallback);
    return;
  }

  if (model.pendingAction === "createContribution") {
    await createContribution(
      model.create.projectId.toString(),
      model.create.issueNumber.toString(),
      model.create.gate.toString()
    );
    return;
  }

  if (model.pendingAction === "assignContribution") {
    await assignContribution(
      model.assign.contributionId.toString(),
      model.assign.contributorId.toString()
    );
    return;
  }

  if (model.pendingAction === "validateContribution") {
    await validateContribution(model.validate.contributionId.toString());
    return;
  }
};

retool && retool.subscribe(retoolSubscription);
