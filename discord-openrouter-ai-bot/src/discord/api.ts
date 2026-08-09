const DISCORD_API = "https://discord.com/api/v10";

async function webhookRequest(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${DISCORD_API}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) }
  });
}

export async function editOriginalResponse(applicationId: string, interactionToken: string, body: unknown): Promise<void> {
  const response = await webhookRequest(`/webhooks/${applicationId}/${interactionToken}/messages/@original`, {
    method: "PATCH",
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(`Discord edit original ${response.status}: ${await response.text()}`);
}

export async function createFollowupMessage(applicationId: string, interactionToken: string, body: unknown): Promise<void> {
  const response = await webhookRequest(`/webhooks/${applicationId}/${interactionToken}`, {
    method: "POST",
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(`Discord follow-up ${response.status}: ${await response.text()}`);
}
