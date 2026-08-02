const callbackStatuses = ["link-invalid", "unavailable"] as const;

export type AuthCallbackStatus = (typeof callbackStatuses)[number];

export function readAuthCallbackStatus(
  value: string | string[] | undefined,
): AuthCallbackStatus | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  return callbackStatuses.find((status) => status === value);
}

/**
 * Keeps post-auth navigation on this Tessli origin. OAuth and email links must
 * never turn a caller-provided `next` parameter into an external redirect.
 */
export function resolveSafeAuthRedirectPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  const baseUrl = new URL("https://tessli.invalid");
  const destination = new URL(value, baseUrl);

  if (destination.origin !== baseUrl.origin) {
    return "/";
  }

  return `${destination.pathname}${destination.search}${destination.hash}`;
}
