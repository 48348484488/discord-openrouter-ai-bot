export const commands = [
  { name: "ask", description: "Ask the configured OpenRouter model", options: [
    { name: "prompt", description: "Your question or instruction", type: 3, required: true, max_length: 4000 },
    { name: "system", description: "Optional system instruction", type: 3, required: false, max_length: 4000 }
  ] },
  { name: "models", description: "Show the configured OpenRouter model" },
  { name: "help", description: "Show bot help" }
] as const;
