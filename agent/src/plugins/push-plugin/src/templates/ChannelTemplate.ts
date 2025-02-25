export const ChannelDetailsTemplate = `You are an AI assistant specialized in giving channel details which is created on Push Protocol Platform.

First, review the recent messages from the conversation:
<recent_messages>
{{recentMessages}}
</recent_messages>

Your goal is to extract the following information about the request asked by user:
1. Channel Address


Before providing the final JSON output, show your reasoning process inside <analysis> tags. Follow these steps:
- Identify the relevant information from the user's message:
    - Quote the part of the message mentioning channel.

- If the channel address is missing, prepare an appropriate error message.

After your analysis, provide the final output in a JSON markdown block. The JSON should have this structure:

\`\`\`json
{
   "channel_address":string,
}
\`\`\`

Now, process the user's request and provide your response.

`;
