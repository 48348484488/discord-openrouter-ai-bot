import { describe, expect, it } from "vitest";
import { verifyDiscordSignature } from "../src/discord/signature.js";

describe("Discord signature verification", () => {
  it("accepts a valid Ed25519 signature", async () => {
    // RFC 8032 Ed25519 test vector: empty message.
    const publicKey = "d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a";
    const signature = "e5564300c360ac729086e2cc806e828a84877f1eb8e5d974d873e06522490155" +
      "5fb8821590a33bacc61e39701cf9b46bd25bf5f0595bbe24655141438e7a100b";
    expect(await verifyDiscordSignature(publicKey, signature, "", "")).toBe(true);
  });

  it("rejects malformed signatures", async () => {
    expect(await verifyDiscordSignature("00", "00", "123", "body")).toBe(false);
  });
});
