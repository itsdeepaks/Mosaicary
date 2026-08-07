"use client";

import Link from "next/link";

import styles from "@/components/route-placeholder/route-placeholder.module.css";

type ErrorPageProps = Readonly<{
  reset: () => void;
}>;

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className={styles.page} id="main-content">
      <div className={`tessli-container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Something went wrong</p>
          <h1>We hit a temporary snag.</h1>
          <p className={styles.summary}>
            Tessli could not finish loading this page. Try again, or return to
            Explore while we recover.
          </p>
        </div>

        <section aria-labelledby="error-status-title" className={styles.status}>
          <h2 id="error-status-title">What you can do</h2>
          <ul>
            <li>Try loading this page again.</li>
            <li>Return to Explore to continue researching the catalogue.</li>
          </ul>
        </section>

        <div className={styles.actions}>
          <button
            className={styles.primaryAction}
            onClick={reset}
            type="button"
          >
            Try again
          </button>
          <Link className={styles.secondaryAction} href="/">
            Return to Explore
          </Link>
        </div>
      </div>
    </main>
  );
}
