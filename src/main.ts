import { Abi, Contract } from "starknet";
import contributionsAbi from "./contributions.json";
import { retool, starknet } from "./libraries";

const getContract = (address: string) => {
  const contract = new Contract(
    contributionsAbi as Abi,
    address,
    starknet.provider
  );

  contract.connect(starknet.account);
  return contract;
};

const connect = async () => {
  const [account] = await starknet.enable();
  retool.updateModel({
    pendingAction: "",
    account,
    chainId: starknet.account.chainId,
  });
};

const createContribution = async (
  projectId: string,
  issueNumber: string,
  gate: string,
  contractAddress: string
) => {
  const contract = getContract(contractAddress);
  await contract.new_contribution(projectId, issueNumber, gate);
  retool.updateModel({ pendingAction: "" });
};

const assignContribution = async (
  contributionId: string,
  contributorAccountAddress: string,
  contractAddress: string
) => {
  const contract = getContract(contractAddress);
  await contract.assign_contributor_to_contribution(
    [contributionId],
    contributorAccountAddress
  );
  retool.updateModel({ pendingAction: "" });
};

const validateContribution = async (
  contributionId: string,
  contributorAccountAddress: string,
  contractAddress: string
) => {
  const contract = getContract(contractAddress);
  await contract.validate_contribution(
    [contributionId],
    contributorAccountAddress
  );
  retool.updateModel({ pendingAction: "" });
};

const addMember = async (
  projectId: string,
  contributorAccount: string,
  contractAddress: string
) => {
  const contract = getContract(contractAddress);
  await contract.add_member_for_project(projectId, contributorAccount);
  retool.updateModel({ pendingAction: "" });
};

const removeMember = async (
  projectId: string,
  contributorAccount: string,
  contractAddress: string
) => {
  const contract = getContract(contractAddress);
  await contract.remove_member_for_project(projectId, contributorAccount);
  retool.updateModel({ pendingAction: "" });
};

export const retoolSubscription = async (model: any) => {
  console.debug("Wallet link updated", model);
  if (starknet && model.pendingAction === "connect") {
    await connect();
    retool.triggerQuery(model.onConnectCallback);
    return;
  }

  if (model.pendingAction === "createContribution") {
    await createContribution(
      model.create.projectId.toString(),
      model.create.issueNumber.toString(),
      model.create.gate.toString(),
      model.contractAddress
    );
    return;
  }

  if (model.pendingAction === "assignContribution") {
    await assignContribution(
      model.assign.contributionId.toString(),
      model.assign.contributorAccountAddress.toString(),
      model.contractAddress
    );
    return;
  }

  if (model.pendingAction === "validateContribution") {
    await validateContribution(
      model.validate.contributionId.toString(),
      model.validate.contributorAccountAddress.toString(),
      model.contractAddress
    );
    return;
  }

  if (model.pendingAction === "addMember") {
    await addMember(
      model.addMember.projectId.toString(),
      model.addMember.contributorAccount,
      model.contractAddress
    );
    return;
  }

  if (model.pendingAction === "removeMember") {
    await removeMember(
      model.removeMember.projectId.toString(),
      model.removeMember.contributorAccount,
      model.contractAddress
    );
    return;
  }
};

retool && retool.subscribe(retoolSubscription);
