import type { Env, DiscordInteraction } from "./types.js";
import { verifyDiscordSignature } from "./discord/signature.js";
import { initialResponse, handleAsk } from "./commands/handlers.js";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return Response.json({ ok: true, service: "discord-openrouter-ai-bot", runtime: "cloudflare-workers" });
    }
    if (request.method !== "POST" || url.pathname !== "/discord/interactions") {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const signature = request.headers.get("X-Signature-Ed25519");
    const timestamp = request.headers.get("X-Signature-Timestamp");
    const body = await request.text();
    if (!signature || !timestamp || !(await verifyDiscordSignature(env.DISCORD_PUBLIC_KEY, signature, timestamp, body))) {
      return new Response("Invalid request signature", { status: 401 });
    }

    let interaction: DiscordInteraction;
    try {
      interaction = JSON.parse(body) as DiscordInteraction;
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    if (interaction.type === 1) return Response.json({ type: 1 });

    if (interaction.type === 2 && interaction.data?.name === "ask") {
      const response = initialResponse(interaction, env);
      ctx.waitUntil(handleAsk(env, interaction));
      return response;
    }

    return initialResponse(interaction, env);
  }
};
