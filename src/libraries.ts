import { IStarknetWindowObject } from "get-starknet/src/types";

declare global {
  interface Window {
    Retool: {
      subscribe: Function;
      updateModel: Function;
      triggerQuery: Function;
    };
    starknet_braavos: IStarknetWindowObject;
    starknet: IStarknetWindowObject;
  }
}

export const starknet = window.starknet_braavos || window.starknet;

export const retool = window.Retool;
