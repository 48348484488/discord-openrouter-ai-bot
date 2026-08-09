import type { Env, DiscordInteraction } from "../types.js";
import { chatCompletion } from "../openrouter/client.js";
import { createFollowupMessage, editOriginalResponse } from "../discord/api.js";
import { chunkDiscordMessage, NO_MENTIONS } from "../discord/response.js";

const MAX_PROMPT = 4000;
const MAX_SYSTEM = 4000;

const getOption = (interaction: DiscordInteraction, name: string): string | undefined =>
  interaction.data?.options?.find((option) => option.name === name)?.value;

export function initialResponse(interaction: DiscordInteraction, env: Env): Response {
  if (interaction.type === 1) return Response.json({ type: 1 });
  if (interaction.type !== 2) {
    return Response.json({ type: 4, data: { content: "Unsupported interaction.", allowed_mentions: NO_MENTIONS } });
  }

  switch (interaction.data?.name) {
    case "ask":
      return Response.json({ type: 5, data: { flags: 64 } });
    case "models":
      return Response.json({
        type: 4,
        data: { content: `Configured OpenRouter model: \`${env.OPENROUTER_MODEL}\``, allowed_mentions: NO_MENTIONS }
      });
    case "help":
      return Response.json({
        type: 4,
        data: {
          content: "**Discord OpenRouter AI Bot**\n`/ask prompt:<text> system:<optional>` — send a request to the configured model.\n`/models` — show the configured model.\n`/help` — show this help.",
          allowed_mentions: NO_MENTIONS
        }
      });
    default:
      return Response.json({ type: 4, data: { content: "Unknown command.", allowed_mentions: NO_MENTIONS } });
  }
}

export async function handleAsk(env: Env, interaction: DiscordInteraction): Promise<void> {
  const prompt = getOption(interaction, "prompt")?.trim();
  const system = getOption(interaction, "system")?.trim();

  if (!prompt) {
    await editOriginalResponse(env.DISCORD_APPLICATION_ID, interaction.token, { content: "Prompt is required.", allowed_mentions: NO_MENTIONS });
    return;
  }
  if (prompt.length > MAX_PROMPT) {
    await editOriginalResponse(env.DISCORD_APPLICATION_ID, interaction.token, { content: `Prompt must be ${MAX_PROMPT} characters or fewer.`, allowed_mentions: NO_MENTIONS });
    return;
  }
  if (system && system.length > MAX_SYSTEM) {
    await editOriginalResponse(env.DISCORD_APPLICATION_ID, interaction.token, { content: `System instruction must be ${MAX_SYSTEM} characters or fewer.`, allowed_mentions: NO_MENTIONS });
    return;
  }

  try {
    const answer = await chatCompletion(env, prompt, system);
    const chunks = chunkDiscordMessage(answer);
    await editOriginalResponse(env.DISCORD_APPLICATION_ID, interaction.token, { content: chunks[0], allowed_mentions: NO_MENTIONS });
    for (const chunk of chunks.slice(1)) {
      await createFollowupMessage(env.DISCORD_APPLICATION_ID, interaction.token, { content: chunk, allowed_mentions: NO_MENTIONS });
    }
  } catch (error) {
    console.error("ask failed", error);
    try {
      await editOriginalResponse(env.DISCORD_APPLICATION_ID, interaction.token, {
        content: "I couldn't complete that request. Please try again later.",
        allowed_mentions: NO_MENTIONS
      });
    } catch (followupError) {
      console.error("failed to send error response", followupError);
    }
  }
}
