# OpenRouter setup

Create an OpenRouter API key and save it as the Cloudflare secret `OPENROUTER_API_KEY`.

Set `OPENROUTER_MODEL` to the desired model slug. The Worker calls:

`POST https://openrouter.ai/api/v1/chat/completions`

with a `messages` array and the configured model.
