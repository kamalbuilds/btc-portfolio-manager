import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const pushEnvSchema = z.object({
    WALLET_PRIVATE_KEY: z.string().min(1, "Wallet Private Key"),
});

export type pushConfig = z.infer<typeof pushEnvSchema>;

export async function validatePushConfig(
    runtime: IAgentRuntime
): Promise<pushConfig> {
    try {
        const config = {
            WALLET_PRIVATE_KEY:
                runtime.getSetting("WALLET_PRIVATE_KEY") ||
                process.env.WALLET_PRIVATE_KEY,
        };

        return pushEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Push Plugin configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
