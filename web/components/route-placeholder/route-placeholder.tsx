import Link from "next/link";

import { repositoryUrl } from "@/components/site-footer/footer-navigation";

import styles from "./route-placeholder.module.css";

type RoutePlaceholderProps = Readonly<{
  eyebrow: string;
  title: string;
  summary: string;
  details: readonly string[];
}>;

export function RoutePlaceholder({
  eyebrow,
  title,
  summary,
  details,
}: RoutePlaceholderProps) {
  return (
    <main className={styles.page} id="main-content">
      <div className={`tessli-container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          <p className={styles.summary}>{summary}</p>
        </div>

        <section aria-labelledby="route-status-title" className={styles.status}>
          <h2 id="route-status-title">What this route does today</h2>
          <ul>
            {details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </section>

        <div className={styles.actions}>
          <Link className={styles.primaryAction} href="/">
            Return to Explore
          </Link>
          <a
            className={styles.secondaryAction}
            href={repositoryUrl}
            rel="noreferrer"
            target="_blank"
          >
            View the repository
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </main>
  );
}
