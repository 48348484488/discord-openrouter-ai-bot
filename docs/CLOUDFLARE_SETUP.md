# Cloudflare setup

## Secrets
Set:
- `DISCORD_PUBLIC_KEY`
- `DISCORD_APPLICATION_ID`
- `DISCORD_BOT_TOKEN`
- `OPENROUTER_API_KEY`

The configured model is `OPENROUTER_MODEL` in `wrangler.jsonc`. Change it before deployment if desired.

## Deploy
```bash
npm install
npx wrangler login
npm run typecheck
npm test
npm run check
npm run deploy:dry-run
npm run deploy
```

Observability is enabled in `wrangler.jsonc` so Worker logs can be inspected from the Cloudflare dashboard.
