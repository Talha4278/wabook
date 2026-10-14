/**
 * Identity providers offered by this app for direct authentication.
 * Google OAuth 2.0 is supported natively via Better Auth.
 */
export type AuthProvider = {
  providerId: string;
  idp: string;
  label: string;
};

export const AUTH_PROVIDERS: readonly AuthProvider[] = [
  { providerId: "google", idp: "google", label: "Google" },
];

export const GROK_PROVIDERS = AUTH_PROVIDERS;
export type GrokProvider = AuthProvider;
