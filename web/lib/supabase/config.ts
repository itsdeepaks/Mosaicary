export type SupabasePublicConfig = Readonly<{
  url: string;
  publishableKey: string;
}>;

export type SupabaseConfigurationStatus =
  | Readonly<{
      state: "configured";
      config: SupabasePublicConfig;
    }>
  | Readonly<{
      state: "unconfigured";
      message: string;
    }>;

type SupabasePublicEnvironment = Readonly<{
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
}>;

const URL_ENVIRONMENT_KEY = "NEXT_PUBLIC_SUPABASE_URL";
const PUBLISHABLE_KEY_ENVIRONMENT_KEY = "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";

export class SupabaseConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseConfigurationError";
  }
}

function readRequiredValue(value: string | undefined, key: string): string {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new SupabaseConfigurationError(
      `Missing required public Supabase environment variable: ${key}.`,
    );
  }

  return normalizedValue;
}

function parseSupabaseUrl(value: string): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new SupabaseConfigurationError(
      `${URL_ENVIRONMENT_KEY} must be a valid absolute URL.`,
    );
  }

  const isLocalHost =
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname === "::1";
  const hasAllowedProtocol = isLocalHost
    ? url.protocol === "http:" || url.protocol === "https:"
    : url.protocol === "https:";

  if (!hasAllowedProtocol) {
    throw new SupabaseConfigurationError(
      `${URL_ENVIRONMENT_KEY} must use HTTPS unless it points to localhost.`,
    );
  }

  if (url.username || url.password || url.search || url.hash) {
    throw new SupabaseConfigurationError(
      `${URL_ENVIRONMENT_KEY} must not contain credentials, query parameters, or a fragment.`,
    );
  }

  return url.toString().replace(/\/$/, "");
}

function validatePublishableKey(value: string): string {
  const normalizedValue = value.trim();
  const looksSecret =
    normalizedValue.startsWith("sb_secret_") ||
    normalizedValue.toLowerCase().includes("service_role");

  if (looksSecret) {
    throw new SupabaseConfigurationError(
      `${PUBLISHABLE_KEY_ENVIRONMENT_KEY} must never contain a Supabase secret or service-role key.`,
    );
  }

  if (normalizedValue.length < 20) {
    throw new SupabaseConfigurationError(
      `${PUBLISHABLE_KEY_ENVIRONMENT_KEY} does not look like a valid publishable key.`,
    );
  }

  return normalizedValue;
}

function readRuntimeEnvironment(): SupabasePublicEnvironment {
  return {
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  };
}

export function readSupabasePublicConfig(
  environment: SupabasePublicEnvironment = readRuntimeEnvironment(),
): SupabasePublicConfig {
  const url = parseSupabaseUrl(
    readRequiredValue(
      environment.NEXT_PUBLIC_SUPABASE_URL,
      URL_ENVIRONMENT_KEY,
    ),
  );
  const publishableKey = validatePublishableKey(
    readRequiredValue(
      environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      PUBLISHABLE_KEY_ENVIRONMENT_KEY,
    ),
  );

  return { publishableKey, url };
}

export function inspectSupabasePublicConfig(
  environment: SupabasePublicEnvironment = readRuntimeEnvironment(),
): SupabaseConfigurationStatus {
  try {
    return {
      state: "configured",
      config: readSupabasePublicConfig(environment),
    };
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return {
        state: "unconfigured",
        message: error.message,
      };
    }

    throw error;
  }
}
