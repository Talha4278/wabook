import { createAuthClient } from "better-auth/react";
import { AUTH_PROVIDERS, GROK_PROVIDERS } from "./providers";

const BEARER_KEY = "app-auth.bearer-token";

export function getBearerToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(BEARER_KEY);
  } catch {
    return null;
  }
}

function setBearerToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) window.sessionStorage.setItem(BEARER_KEY, token);
    else window.sessionStorage.removeItem(BEARER_KEY);
  } catch {
    /* storage unavailable */
  }
}

export const authClient = createAuthClient({
  fetchOptions: {
    onRequest(ctx) {
      const token = getBearerToken();
      if (token) ctx.headers.set("Authorization", `Bearer ${token}`);
      return ctx;
    },
  },
});

export const authEnabled = import.meta.env.VITE_AUTH_ENABLED !== "false";

export { AUTH_PROVIDERS, GROK_PROVIDERS };

export async function signIn(
  providerId = "google",
  opts: { callbackURL?: string; errorCallbackURL?: string } = {},
): Promise<void> {
  const callbackURL = opts.callbackURL ?? "/";
  const errorCallbackURL = opts.errorCallbackURL ?? "/";

  const { data, error } = await authClient.signIn.social({
    provider: "google",
    callbackURL,
    errorCallbackURL,
  });
  if (error) throw new Error(error.message ?? "Google sign-in failed");
  if (data?.url) window.location.href = data.url;
}

export async function signOut(opts: { redirectTo?: string } = {}): Promise<void> {
  const redirectTo = opts.redirectTo ?? "/login";
  try {
    await authClient.signOut();
  } catch {
    /* ignore network failure */
  }
  setBearerToken(null);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem("wabook_dev_mode");
    } catch {
      /* ignore */
    }
    window.location.href = redirectTo;
  }
}
