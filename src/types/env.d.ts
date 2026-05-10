declare global {
  interface CloudflareEnv {
    DB: D1Database;
    PII_KEY: string;
    SESSION_SECRET: string;
    RESEND_API_KEY: string;
    TURNSTILE_SECRET: string;
    TURNSTILE_SITE_KEY: string;
    CRON_SECRET: string;
    ACCESS_TEAM_DOMAIN: string;
    ACCESS_AUD: string;
    NOTIFY_EMAILS: string;
    SITE_URL: string;
    SENDER_EMAIL: string;
  }
}
export {};
