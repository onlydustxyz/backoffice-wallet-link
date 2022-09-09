import { IStarknetWindowObject } from "get-starknet/src/types";

declare global {
  interface Window {
    Retool: {
      subscribe: Function;
      updateModel: Function;
      triggerQuery: Function;
    };
    starknet_braavos: IStarknetWindowObject;
  }
}

export const starknet = window.starknet_braavos;

export const retool = window.Retool;
