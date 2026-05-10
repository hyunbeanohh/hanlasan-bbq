declare global {
  interface CloudflareEnv {
    PII_KEY: string;
    SESSION_SECRET: string;
    RESEND_API_KEY: string;
    TURNSTILE_SECRET: string;
    CRON_SECRET: string;
    ACCESS_TEAM_DOMAIN: string;
    ACCESS_AUD: string;
  }
}
export {};
