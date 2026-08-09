# discord-openrouter-ai-bot

A production-oriented Discord Interactions application built for Cloudflare Workers with TypeScript, Wrangler, Web Crypto Ed25519 verification, and OpenRouter Chat Completions.

## What it does
- `GET /` health endpoint.
- `POST /discord/interactions` Discord HTTP Interactions endpoint.
- Verifies `X-Signature-Ed25519` against the exact raw request body.
- Answers Discord PING requests with PONG (`type: 1`).
- Registers `/ask`, `/models`, and `/help`.
- `/ask` accepts required `prompt` and optional `system`, immediately defers, then calls OpenRouter using `ctx.waitUntil()`.
- `/models` reports `OPENROUTER_MODEL`.
- `/help` explains the commands.
- Splits generated output into Discord-sized messages and disables automatic mentions with `allowed_mentions: { parse: [] }`.
- No mutable global user/session state.
- Cloudflare Workers observability is enabled.

## Requirements
- Node.js 20+.
- A Cloudflare account with Workers access.
- A Discord Developer application.
- An OpenRouter account/API key.

## Install and validate
```bash
npm install
npm run typecheck
npm test
npm run check
npm run deploy:dry-run
```

The repository intentionally does not contain secrets. `.dev.vars` and `.env` are ignored by Git.

## Configuration
### Cloudflare secrets
Set these four secrets:
- `DISCORD_PUBLIC_KEY`
- `DISCORD_APPLICATION_ID`
- `DISCORD_BOT_TOKEN`
- `OPENROUTER_API_KEY`

`OPENROUTER_MODEL` is a normal Worker variable in `wrangler.jsonc`; change it to the OpenRouter model ID you want. You can also override it per environment using your deployment configuration.

CLI:
```bash
npx wrangler secret put DISCORD_PUBLIC_KEY
npx wrangler secret put DISCORD_APPLICATION_ID
npx wrangler secret put DISCORD_BOT_TOKEN
npx wrangler secret put OPENROUTER_API_KEY
```

For local development, copy `.dev.vars.example` to `.dev.vars` and fill it in. Do not commit that file.

## Discord setup
1. Open the Discord Developer Portal and create an application.
2. Copy the **Application ID** from General Information.
3. Copy the **Public Key** from General Information.
4. Create/add the bot user and copy its **Bot Token**.
5. Deploy the Worker.
6. In the application's Interactions/General settings, set the Interactions Endpoint URL to:
   `https://YOUR-WORKER-DOMAIN/discord/interactions`
7. Discord validates the endpoint by sending a PING. This Worker verifies the signature before answering it.
8. Register the commands.

Discord's HTTP interaction protocol requires signature verification and a PONG for PING validation. Interaction tokens can then be used for follow-ups for the interaction lifetime. See the official Discord documentation linked below.

## Register slash commands
The included Node script calls Discord's application-command REST endpoint.

With `DISCORD_APPLICATION_ID` and `DISCORD_BOT_TOKEN` available in `.env`, `.dev.vars`, or the shell:
```bash
npm run register
```

Remove all global commands:
```bash
npm run unregister
```

The script uses Node only for development/administration; the Worker runtime does not depend on Node APIs.

## OpenRouter setup
1. Create an OpenRouter API key.
2. Put it in `OPENROUTER_API_KEY` as a Cloudflare secret.
3. Set `OPENROUTER_MODEL` to the model slug you want.
4. The Worker sends `POST https://openrouter.ai/api/v1/chat/completions` with the configured model and messages.

## Deploy
Authenticate Wrangler first:
```bash
npx wrangler login
```
Then:
```bash
npm run typecheck
npm test
npm run check
npm run deploy:dry-run
npm run deploy
```

## GitHub
Push the complete repository to GitHub. The GitHub Action runs:
- dependency installation;
- TypeScript typecheck;
- Vitest tests;
- `wrangler check`;
- `wrangler deploy --dry-run`.

No Discord/OpenRouter secrets are committed. If you later add automatic production deployment, store credentials in GitHub Actions Secrets rather than source control.

## Cloudflare logs and observability
`wrangler.jsonc` enables Workers Observability. Use the Worker dashboard to inspect invocation logs, errors and runtime behavior.

## Mobile Android workflow
You can do the deployment from an Android phone without turning the project into a different/mobile-only codebase:

1. Download this ZIP and extract it on your phone.
2. Create a GitHub repository in Chrome.
3. Use GitHub's **Add file / Upload files** interface to upload the project files. If the mobile browser makes folder upload inconvenient, upload the files from the extracted folders while preserving their paths, or use GitHub Codespaces from the browser.
4. Open Cloudflare Dashboard in Chrome and create/connect the Worker project, or use a browser-based development environment with Node.js and Wrangler.
5. Configure the four Cloudflare secrets in Worker Settings → Variables and Secrets.
6. Verify `OPENROUTER_MODEL` under Variables.
7. Deploy the Worker.
8. Copy the deployed Worker URL and append `/discord/interactions`.
9. Paste that URL into Discord's Interactions Endpoint URL.
10. Register the commands from a Node-capable environment using `npm run register`.

For a phone-only workflow, GitHub Codespaces is the most practical option because it provides a terminal, Node.js and the repository in the browser. The same `npm install`, validation and deployment commands apply.

## Troubleshooting
### Discord says the endpoint is invalid
- Confirm the URL ends with `/discord/interactions`.
- Confirm `DISCORD_PUBLIC_KEY` is the application's Public Key, not the Bot Token.
- Confirm the Worker is publicly reachable.
- Confirm the Worker returns PONG for signed PING requests.

### `/ask` fails
- Check the OpenRouter key and model ID.
- Check OpenRouter credits/rate limits.
- Inspect Cloudflare Worker logs.

### Commands are not visible
Run `npm run register` again with the correct Application ID and Bot Token. This project registers global application commands, which can take time to propagate in Discord.

### 401 Invalid request signature
The signature must be verified against the exact raw request body plus the timestamp. Do not parse and re-stringify the body before verification.

## Project structure
```text
discord-openrouter-ai-bot/
├── .github/workflows/ci.yml
├── docs/
│   ├── CLOUDFLARE_SETUP.md
│   ├── DISCORD_SETUP.md
│   └── OPENROUTER_SETUP.md
├── scripts/register-commands.ts
├── src/
│   ├── commands/commands.ts
│   ├── commands/handlers.ts
│   ├── discord/api.ts
│   ├── discord/response.ts
│   ├── discord/signature.ts
│   ├── openrouter/client.ts
│   ├── index.ts
│   └── types.ts
├── tests/
├── .dev.vars.example
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── package.json
├── tsconfig.json
└── wrangler.jsonc
```

## Official documentation
- Discord Interactions: https://docs.discord.com/developers/interactions/receiving-and-responding
- Discord Interactions overview: https://docs.discord.com/developers/interactions/overview
- OpenRouter Chat Completions: https://openrouter.ai/docs/api/api-reference/chat/send-chat-completion-request
- Wrangler configuration: https://developers.cloudflare.com/workers/wrangler/configuration/
