import {
    type IAgentRuntime,
    type Provider,
    type Memory,
    type State,
    type ICacheManager,
    elizaLogger,
} from "@elizaos/core";
import {
    createPublicClient,
    createWalletClient,
    formatUnits,
    http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { CONSTANTS, PushAPI } from "@pushprotocol/restapi";

export const initPushProvider = async (runtime: IAgentRuntime) => {
    const privateKey = runtime.getSetting("WALLET_PRIVATE_KEY") as `0x${string}`;
    if (!privateKey) {
        throw new Error("WALLET_PRIVATE_KEY is missing");
    }
    const account = privateKeyToAccount(privateKey);
    const walletClient = createWalletClient({
        account,
        chain: sepolia,
        transport: http(),
    });

    const pushUser = await PushAPI.initialize(walletClient, {
        env: CONSTANTS.ENV.STAGING
    });

    return { pushUser };
};

export const walletProvider: Provider = {
    async get(
        runtime: IAgentRuntime,
        _message: Memory,
        state?: State
    ): Promise<string | null> {
        try {
            const privateKey = runtime.getSetting("WALLET_PRIVATE_KEY") as `0x${string}`;
            if (!privateKey) {
                throw new Error("WALLET_PRIVATE_KEY is missing");
            }
            const privateKeyAccount = privateKeyToAccount(privateKey);
            const walletClient = createWalletClient({
                account: privateKeyAccount,
                chain: sepolia,
                transport: http(),
            });

            const publicClient = createPublicClient({
                chain: sepolia,
                transport: http(),
            });
            const account = walletClient.account;
            const walletAddress = account.address;
            const balance = await publicClient.getBalance({
                address: walletAddress,
            });
            const balanceFormatted = formatUnits(balance, 18);
            const agentName = state?.agentName || "The agent";
            return `${agentName}'s EVM Wallet Address: ${walletAddress}\nBalance: ${balanceFormatted} `;
        } catch (error) {
            console.error("Error in EVM wallet provider:", error);
            return null;
        }
    },
};
