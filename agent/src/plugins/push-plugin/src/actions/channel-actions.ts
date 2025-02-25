import {
    Action,
    ActionExample,
    composeContext,
    elizaLogger,
    generateObjectDeprecated,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
} from "@elizaos/core";
import { validatePushConfig } from "../environment.ts";
import { ChannelDetailsTemplate } from "../templates/ChannelTemplate.ts";
import { initPushProvider } from "../providers/wallet.ts";

type channelDetailsParams = {
    channel_address: string;
};

export default {
    name: "CHANNEL_DETAILS",
    similes: ["CHANNEL_DETAILS", "CHANNEL_INFORMATION"],
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        await validatePushConfig(runtime);
        return true;
    },
    description:
        "Get Channel Details for the channel address provided by the user",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.log("Starting Push Plugin...");

        // Initialize or update state
        let currentState = state;
        if (!currentState) {
            currentState = (await runtime.composeState(message)) as State;
        } else {
            currentState = await runtime.updateRecentMessageState(currentState);
        }

        const { pushUser } = await initPushProvider(runtime);
        elizaLogger.log("Push User initialised...", pushUser);

        const channelContext = composeContext({
            state: currentState,
            template: ChannelDetailsTemplate,
        });

        const content = (await generateObjectDeprecated({
            runtime,
            context: channelContext,
            modelClass: ModelClass.SMALL,
        })) as channelDetailsParams;

        try {
            const channelDetails = await pushUser.channel.info(
                content.channel_address
            );
            elizaLogger.log(
                `Channel Details for the channel ${content.channel_address}`,
                channelDetails
            );
            console.log("Channel details >>>", channelDetails);

            if (callback) {
                callback({
                    text: `Successfully fetched the channel details for the channel ${content.channel_address}. Here is the response:
                    {
                        channel_name:${channelDetails.name},
                        channel_info:${channelDetails.info},
                    }
                    `,
                    content: {
                        channelDetails,
                    },
                });
            }
            return true;
        } catch (error) {
            elizaLogger.error("Failed in getting channel details", error);
            if (callback) {
                callback({
                    text: `Failed in getting channel details`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Can you find the channel details for the Channel Address 0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924?",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Sure, I'll find the channel details",
                    action: "CHANNEL_DETAILS",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Successfully Fetched Channel Details for the channel 0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924 ",
                },
            },
        ],
    ] as ActionExample[][]
} as Action;
