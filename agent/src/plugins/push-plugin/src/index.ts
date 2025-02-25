import type { Plugin } from "@elizaos/core";
import { walletProvider } from "./providers/wallet.ts";

import channelActions from "./actions/channel-actions.ts";

export const pushPlugin: Plugin = {
    name: "Push Plugin",
    description: "Plugin for support for Push Notification",
    providers: [walletProvider],
    evaluators: [],
    services: [],
    actions: [channelActions],
};

export default pushPlugin;
