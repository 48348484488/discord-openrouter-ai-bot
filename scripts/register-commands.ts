import process from "node:process";
import { commands } from "../src/commands/commands.js";

for (const file of [".env", ".dev.vars"]) {
  try { process.loadEnvFile(file); } catch { /* optional local file */ }
}

const appId = process.env.DISCORD_APPLICATION_ID;
const token = process.env.DISCORD_BOT_TOKEN;
if (!appId || !token) throw new Error("Set DISCORD_APPLICATION_ID and DISCORD_BOT_TOKEN in .env/.dev.vars or the shell environment.");

const action = process.argv[2] ?? "register";
if (action !== "register" && action !== "unregister") throw new Error("Usage: npm run register | npm run unregister");

const response = await fetch(`https://discord.com/api/v10/applications/${appId}/commands`, {
  method: "PUT",
  headers: { Authorization: `Bot ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify(action === "register" ? commands : [])
});
if (!response.ok) throw new Error(`Discord API ${response.status}: ${await response.text()}`);
console.log(action === "register" ? "Slash commands registered." : "Slash commands removed.");
