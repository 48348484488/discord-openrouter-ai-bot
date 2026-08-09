import type { Env, OpenRouterResponse } from "../types.js";

const URL = "https://openrouter.ai/api/v1/chat/completions";

export async function chatCompletion(env: Env, prompt: string, system?: string): Promise<string> {
  const messages = [
    ...(system ? [{ role: "system", content: system }] : []),
    { role: "user", content: prompt }
  ];
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://discord.com",
      "X-Title": "Discord OpenRouter AI Bot"
    },
    body: JSON.stringify({ model: env.OPENROUTER_MODEL, messages })
  });
  const data = (await response.json()) as OpenRouterResponse;
  if (!response.ok) throw new Error(data.error?.message ?? `OpenRouter API ${response.status}`);
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter returned an empty response");
  return content;
}
