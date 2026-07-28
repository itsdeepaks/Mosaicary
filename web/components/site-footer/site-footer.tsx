import Link from "next/link";

import { footerGroups } from "./footer-navigation";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`tessli-container ${styles.inner}`}>
        <div className={styles.intro}>
          <Link className={styles.wordmark} href="/" aria-label="Tessli home">
            Tessli
          </Link>
          <p>
            A curated index for discovering design resources, studying useful
            patterns, and creating original work.
          </p>
        </div>

        <div className={styles.groups}>
          {footerGroups.map((group) => (
            <nav aria-labelledby={group.id} className={styles.group} key={group.id}>
              <h2 id={group.id}>{group.label}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a href={link.href} rel="noreferrer" target="_blank">
                        {link.label}
                        <span className={styles.externalMark} aria-hidden="true">
                          ↗
                        </span>
                      </a>
                    ) : (
                      <Link href={link.href}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={styles.footnote}>
          <p>
            Tessli indexes links and limited descriptive metadata. Third-party
            names, trademarks, content, and assets remain the property of their
            respective owners.
          </p>
          <p>
            Verify the original source and its licence before using a resource
            in production.
          </p>
        </div>
      </div>
    </footer>
  );
}
