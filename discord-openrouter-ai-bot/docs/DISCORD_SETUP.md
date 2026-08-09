# Discord setup

1. Create an application in the Discord Developer Portal.
2. From General Information, copy **Application ID** and **Public Key**.
3. Create the bot user and copy the **Bot Token**.
4. Deploy this Worker.
5. Set the Interactions Endpoint URL to `https://YOUR-WORKER-DOMAIN/discord/interactions`.
6. Discord sends a signed PING during validation. The Worker verifies the Ed25519 signature and returns `{ "type": 1 }`.
7. Register the slash commands with `npm run register`.

Never commit the Bot Token or other secrets.
