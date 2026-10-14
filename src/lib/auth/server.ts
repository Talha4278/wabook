/**
 * Self-hosted Better Auth for THIS app (server-only).
 * Direct Google OAuth 2.0 integration without external brokers.
 */
import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { getCookie } from "@tanstack/react-start/server";
import { randomBytes } from "node:crypto";
import { Pool } from "pg";
import { ensureDbReady, getPglite } from "../db";
import { emailAndPasswordEnabled } from "./email-password";
import { AUTH_PROVIDERS } from "./providers";
import { pgliteDialect } from "./pglite-dialect";

void ensureDbReady();

const globalAuthRef = globalThis as typeof globalThis & {
  __authSecret__?: string;
};
function authSecret(): string {
  globalAuthRef.__authSecret__ ??= randomBytes(32).toString("hex");
  return globalAuthRef.__authSecret__;
}

const env = (key: string): string | undefined => {
  const value = process.env[key]?.trim();
  return value ? value : undefined;
};

const authDisabled = env("VITE_AUTH_ENABLED") === "false";

// Hardcode Google Cloud OAuth credentials here or pass via environment variables
const HARDCODED_GOOGLE_CLIENT_ID = "";
const HARDCODED_GOOGLE_CLIENT_SECRET = "";

const googleClientId = env("GOOGLE_CLIENT_ID") || HARDCODED_GOOGLE_CLIENT_ID;
const googleClientSecret = env("GOOGLE_CLIENT_SECRET") || HARDCODED_GOOGLE_CLIENT_SECRET;

/** True when direct Google OAuth sign-in is configured. */
export const authConfigured =
  !authDisabled && Boolean(googleClientId && googleClientSecret);

const explicitBaseURL = env("BETTER_AUTH_URL");
const LOCAL_DEV_ORIGINS: string[] = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://[::1]:8080",
];

const vercelBaseURL = env("VERCEL_PROJECT_PRODUCTION_URL")
  ? `https://${env("VERCEL_PROJECT_PRODUCTION_URL")}`
  : env("VERCEL_URL")
    ? `https://${env("VERCEL_URL")}`
    : undefined;

const baseURL = explicitBaseURL ?? (
  vercelBaseURL || (process.env.NODE_ENV === "production" ? "https://wabook.cloud" : undefined)
) ?? {
  allowedHosts: [
    "localhost",
    "127.0.0.1",
    "[::1]",
    "wabook.cloud",
    "wabook-nine.vercel.app",
    ...(env("VERCEL_URL") ? [env("VERCEL_URL")!] : []),
    ...(env("VERCEL_PROJECT_PRODUCTION_URL") ? [env("VERCEL_PROJECT_PRODUCTION_URL")!] : []),
  ],
  protocol: "auto" as const,
  fallback: "http://localhost:8080",
};

const trustedOrigins: string[] = [
  "https://wabook.cloud",
  "https://wabook-nine.vercel.app",
  ...(explicitBaseURL ? [explicitBaseURL] : []),
  ...(vercelBaseURL ? [vercelBaseURL] : []),
  ...LOCAL_DEV_ORIGINS,
];

const databaseUrl = env("DATABASE_URL");

const database = databaseUrl
  ? new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } })
  : { dialect: pgliteDialect(() => getPglite()), type: "postgres" as const };

export const SESSION_TOKEN_COOKIE = "better-auth.session_token";

export const auth = betterAuth({
  baseURL,
  secret: env("BETTER_AUTH_SECRET") || "wabook_auth_production_secret_key_8923a1f4",
  database,
  trustedOrigins,
  socialProviders: {
    google: {
      clientId: googleClientId || "",
      clientSecret: googleClientSecret || "",
    },
  },
  account: {
    encryptOAuthTokens: true,
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      requireLocalEmailVerified: false,
    },
  },
  session: { cookieCache: { enabled: true, maxAge: 300 } },
  ...(emailAndPasswordEnabled ? { emailAndPassword: { enabled: true } } : {}),
  plugins: [
    bearer(),
    tanstackStartCookies(),
  ],
});

export function readSessionToken(): string | null {
  return getCookie(SESSION_TOKEN_COOKIE) ?? null;
}

export { AUTH_PROVIDERS, AUTH_PROVIDERS as GROK_PROVIDERS } from "./providers";
