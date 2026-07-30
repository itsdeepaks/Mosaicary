import Link from "next/link";

import styles from "./auth-shell.module.css";

type AuthShellProps = Readonly<{
  configurationState: "configured" | "unconfigured";
}>;

const accountBenefits = [
  "Browse every public resource without signing in.",
  "Your current saves remain private in this browser.",
  "Cloud sync activates only after secure setup and review.",
] as const;

export function AuthShell({ configurationState }: AuthShellProps) {
  const isConfigured = configurationState === "configured";
  const statusLabel = isConfigured
    ? "Configuration detected"
    : "Account access unavailable";
  const statusDescription = isConfigured
    ? "The public Supabase client configuration is present. Password, email-code, and Google sign-in remain inactive until provider setup and live validation are reviewed."
    : "The account shell is ready, but this environment does not have the public Supabase project details required to begin sign-in.";

  return (
    <main
      className={styles.page}
      data-auth-configuration={configurationState}
      data-auth-shell="ready"
    >
      <div className={`tessli-container ${styles.layout}`}>
        <section
          className={styles.introduction}
          aria-labelledby="auth-page-title"
        >
          <p className={styles.eyebrow}>Private workspace</p>
          <h1 className={styles.title} id="auth-page-title">
            Keep your research close.
          </h1>
          <p className={styles.summary}>
            Tessli accounts will sync saved resources, private collections, and
            notes across devices once cloud features are activated. Public
            browsing remains open, and local saves keep working without an
            account.
          </p>

          <ul className={styles.benefitList}>
            {accountBenefits.map((benefit) => (
              <li className={styles.benefitItem} key={benefit}>
                <span aria-hidden="true" className={styles.benefitMarker} />
                {benefit}
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="account-panel-title"
          className={styles.accountPanel}
        >
          <div
            aria-live="polite"
            className={`${styles.status} ${isConfigured ? styles.statusConfigured : styles.statusUnavailable}`}
          >
            <span aria-hidden="true" className={styles.statusDot} />
            {statusLabel}
          </div>

          <div className={styles.panelHeading}>
            <p className={styles.panelEyebrow}>Tessli account</p>
            <h2 className={styles.panelTitle} id="account-panel-title">
              Sign in to Tessli
            </h2>
            <p className={styles.panelDescription}>{statusDescription}</p>
          </div>

          <form
            aria-describedby="auth-availability-note"
            className={styles.form}
          >
            <fieldset className={styles.fieldset} disabled>
              <legend className={styles.visuallyHidden}>Sign-in methods</legend>

              <button className={styles.googleButton} type="button">
                <span aria-hidden="true" className={styles.googleMark}>
                  G
                </span>
                Continue with Google
              </button>

              <div aria-hidden="true" className={styles.divider}>
                <span>or continue with email</span>
              </div>

              <label className={styles.label} htmlFor="auth-email">
                Email address
              </label>
              <input
                autoComplete="email"
                className={styles.input}
                disabled
                id="auth-email"
                inputMode="email"
                name="email"
                placeholder="you@example.com"
                type="email"
              />

              <button className={styles.continueButton} disabled type="submit">
                Continue
              </button>

              <div className={styles.methodPreview}>
                <span>Password</span>
                <span>Six-digit email code</span>
              </div>
            </fieldset>
          </form>

          <p className={styles.availabilityNote} id="auth-availability-note">
            No sign-in request is sent from this page yet. Your browser-local
            saves remain available while account activation is deferred.
          </p>

          <Link className={styles.backLink} href="/">
            Continue browsing
            <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
