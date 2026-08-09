import { describe, expect, it } from "vitest";
import { chunkDiscordMessage } from "../src/discord/response.js";

describe("Discord message chunking", () => {
  it("keeps short messages intact", () => expect(chunkDiscordMessage("hello")).toEqual(["hello"]));
  it("splits long messages within the limit", () => {
    const chunks = chunkDiscordMessage("a".repeat(4500));
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((chunk) => chunk.length <= 2000)).toBe(true);
  });
});
