import { describe, expect, it } from "vitest";
import { initialResponse } from "../src/commands/handlers.js";

const env = {
  DISCORD_PUBLIC_KEY: "public",
  DISCORD_APPLICATION_ID: "application",
  DISCORD_BOT_TOKEN: "token",
  OPENROUTER_API_KEY: "key",
  OPENROUTER_MODEL: "test/model"
};

describe("Discord command responses", () => {
  it("answers PING", async () => {
    const response = initialResponse({ id: "1", application_id: "a", type: 1, token: "t" }, env);
    expect(await response.json()).toEqual({ type: 1 });
  });
  it("defers /ask", async () => {
    const response = initialResponse({ id: "1", application_id: "a", type: 2, token: "t", data: { name: "ask" } }, env);
    expect(await response.json()).toMatchObject({ type: 5 });
  });
  it("reports the configured model", async () => {
    const response = initialResponse({ id: "1", application_id: "a", type: 2, token: "t", data: { name: "models" } }, env);
    expect(await response.text()).toContain("test/model");
  });
});
