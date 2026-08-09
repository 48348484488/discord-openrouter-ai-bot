export interface Env {
  DISCORD_PUBLIC_KEY: string;
  DISCORD_APPLICATION_ID: string;
  DISCORD_BOT_TOKEN: string;
  OPENROUTER_API_KEY: string;
  OPENROUTER_MODEL: string;
}

export interface DiscordInteraction {
  id: string;
  application_id: string;
  type: number;
  token: string;
  data?: {
    name: string;
    options?: Array<{ name: string; type: number; value?: string; focused?: boolean }>;
  };
}

export interface OpenRouterResponse {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { message?: string; code?: number };
}
