import type { Plugin } from "@elizaos/core";
import { transferAction } from "./actions/transfer.ts";
import { redeemAction } from "./actions/redeem.ts";

export const wormholePlugin: Plugin = {
  name: "wormhole",
  description: "Wormhole Cross chain token transfer Plugin",
  providers: [],
  evaluators: [],
  services: [],
  actions: [transferAction, redeemAction],
};

export default wormholePlugin;
