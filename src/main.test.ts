import { afterEach, describe, expect, it, vi } from "vitest";

const retoolMock = {
  updateModel: vi.fn(),
  subscribe: vi.fn(),
  triggerQuery: vi.fn(),
};
const starknetMock = {
  enable: vi.fn().mockResolvedValue([]),
  isConnected: false,
  account: {
    chainId: "123",
  },
};
vi.mock("./libraries", () => ({
  starknet: starknetMock,
  retool: retoolMock,
}));
import { retoolSubscription } from "./main";

describe("connect action", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("triggers the connection when wallet is not connected", async () => {
    await retoolSubscription({ pendingAction: "connect", account: false });
    expect(starknetMock.enable).toBeCalledTimes(1);
    expect(retoolMock.triggerQuery).toBeCalledTimes(1);
  });
});
