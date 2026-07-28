import type { CSSProperties } from "react";

import { GrainToggle } from "./grain-toggle";
import styles from "./lab.module.css";

const swatches = [
  ["Canvas", "#fcf8f3", "var(--canvas)"],
  ["Surface", "#fffefc", "var(--surface)"],
  ["Muted surface", "#f5f0ea", "var(--surface-muted)"],
  ["Strong surface", "#ebe4dc", "var(--surface-strong)"],
  ["Strong text", "#151412", "var(--text-strong)", "dark"],
  ["Body text", "#4f4a44", "var(--text-body)", "dark"],
  ["Accent", "#f05217", "var(--accent)"],
  ["Accent text", "#b9380e", "var(--accent-text)", "dark"],
] as const;

export const metadata = {
  title: "Design foundation lab",
};

export default function DesignFoundationLabPage() {
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={`tessli-container ${styles.topbarInner}`}>
          <span className={styles.wordmark}>Tessli</span>
          <span className={styles.topbarMeta}>Design foundation · Slice 1.2</span>
          <GrainToggle />
        </div>
      </header>

      <main>
        <section className={`tessli-container ${styles.intro}`}>
          <div className={`tessli-grid ${styles.introGrid}`}>
            <div className={styles.introCopy}>
              <p className={styles.eyebrow}>Browser-rendered visual contract</p>
              <h1 className="tessli-display">
                A warm, editorial system for useful discovery.
              </h1>
              <p className={styles.lede}>
                This lab verifies Tessli&apos;s real fonts, palette, grain,
                spacing, sharp surfaces, small-radius controls, and responsive
                grid before product components are built.
              </p>
            </div>
            <aside className={styles.status} aria-label="Foundation status">
              <div className={styles.statusRow}>
                <span>Display</span>
                <strong>Newsreader Variable</strong>
              </div>
              <div className={styles.statusRow}>
                <span>Interface</span>
                <strong>Instrument Sans Variable</strong>
              </div>
              <div className={styles.statusRow}>
                <span>Surface</span>
                <strong>Sharp editorial</strong>
              </div>
              <div className={styles.statusRow}>
                <span>Theme</span>
                <strong>Warm light</strong>
              </div>
            </aside>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="type-title">
          <div className="tessli-container">
            <div className={styles.sectionHeading}>
              <h2 className="tessli-section-title" id="type-title">
                Typography with character, not decoration.
              </h2>
              <p>
                Newsreader carries the brand and page-level storytelling.
                Instrument Sans remains responsible for every product control,
                label, table, and explanatory paragraph.
              </p>
            </div>

            <div className={styles.typeGrid}>
              <article className={styles.typePanel}>
                <p className={styles.panelLabel}>Newsreader Variable</p>
                <p className={styles.typeWordmark}>Tessli</p>
                <p className={styles.typeHeadline}>
                  Find better design resources, faster.
                </p>
                <p className={styles.typeNumerals}>295 · 11 · 2026 · 01—09</p>
              </article>
              <article className={`${styles.typePanel} ${styles.interfacePanel}`}>
                <p className={styles.panelLabel}>Instrument Sans Variable</p>
                <h3 className={styles.interfaceTitle}>
                  Clear interface typography should disappear into the task.
                </h3>
                <p className={styles.interfaceCopy}>
                  Search, filters, card metadata, forms, tables, and account
                  surfaces use a neutral but recognisable sans-serif rhythm.
                </p>
                <div className={styles.typeScale} aria-label="Interface type scale">
                  <span>20px · Strong interface heading</span>
                  <span>16px · Standard body and form text</span>
                  <span>14px · Metadata, buttons, and navigation</span>
                  <span>12px · Labels and supporting details</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="colour-title">
          <div className="tessli-container">
            <div className={styles.sectionHeading}>
              <h2 className="tessli-section-title" id="colour-title">
                Soothing colour comes from restraint.
              </h2>
              <p>
                Warm canvas, charcoal copy, low-contrast lines, and a single
                orange signal create the atmosphere. Orange never replaces
                hierarchy.
              </p>
            </div>
            <div className={styles.swatches}>
              {swatches.map(([name, value, token, tone]) => (
                <article
                  className={`${styles.swatch} ${tone === "dark" ? styles.swatchDark : ""}`}
                  key={token}
                  style={{ "--swatch": value } as CSSProperties}
                >
                  <strong>{name}</strong>
                  <span>{value}</span>
                  <span>{token}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="layout-title">
          <div className="tessli-container">
            <div className={styles.sectionHeading}>
              <h2 className="tessli-section-title" id="layout-title">
                A grid that recomposes instead of shrinking.
              </h2>
              <p>
                Tessli uses twelve columns on desktop, eight on tablet, and
                four on mobile. Content owns space intentionally and never
                relies on oversized rounded wrappers.
              </p>
            </div>
            <div className={`tessli-grid ${styles.layoutGrid}`}>
              <article className={`tessli-panel ${styles.layoutPanel}`}>
                <p className={styles.panelLabel}>Responsive columns</p>
                <div className={styles.columnDemo} aria-hidden="true">
                  {Array.from({ length: 12 }, (_, index) => (
                    <span key={index} />
                  ))}
                </div>
              </article>
              <article className={`tessli-panel ${styles.layoutPanel}`}>
                <p className={styles.panelLabel}>4px spacing base</p>
                <div className={styles.spacingList} aria-label="Spacing scale">
                  {[8, 16, 24, 32, 48].map((size) => (
                    <span
                      key={size}
                      style={{ "--size": `${size}px` } as CSSProperties}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </article>
              <article className={`tessli-panel ${styles.layoutPanel}`}>
                <p className={styles.panelLabel}>Surface hierarchy</p>
                <div className={styles.surfaceStack}>
                  <div>Canvas</div>
                  <div>Bordered surface</div>
                  <div>Elevated only when necessary</div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="component-title">
          <div className="tessli-container">
            <div className={styles.sectionHeading}>
              <h2 className="tessli-section-title" id="component-title">
                Sharp content surfaces, comfortable controls.
              </h2>
              <p>
                Cards and panels stay square. Buttons, inputs, menus, and tags
                may use small radii only where touch and interaction benefit.
              </p>
            </div>
            <div className={`tessli-grid ${styles.componentGrid}`}>
              <article className={`tessli-panel ${styles.componentPanel}`}>
                <p className={styles.panelLabel}>Buttons</p>
                <div className={styles.buttonRow}>
                  <button className={`${styles.button} ${styles.buttonPrimary}`} type="button">
                    Primary action
                  </button>
                  <button className={`${styles.button} ${styles.buttonSecondary}`} type="button">
                    Secondary
                  </button>
                  <button className={`${styles.button} ${styles.buttonQuiet}`} type="button">
                    Quiet action
                  </button>
                </div>
              </article>
              <article className={`tessli-panel ${styles.componentPanel}`}>
                <p className={styles.panelLabel}>Search field</p>
                <label className={`tessli-control ${styles.field}`}>
                  <span aria-hidden="true">⌕</span>
                  <input aria-label="Example resource search" placeholder="Search resources" />
                </label>
              </article>
              <article className={`tessli-panel ${styles.componentPanel}`}>
                <p className={styles.panelLabel}>Tags and selection</p>
                <div className={styles.tagRow}>
                  <span className={`${styles.tag} ${styles.tagActive}`}>All resources</span>
                  <span className={styles.tag}>Typography</span>
                  <span className={styles.tag}>Motion</span>
                  <span className={styles.tag}>Open source</span>
                </div>
              </article>
            </div>

            <div className={styles.rules} aria-label="Geometry rules">
              <div className={styles.rule}>
                <span>Cards and panels</span>
                <strong>0px radius · border-led hierarchy</strong>
              </div>
              <div className={styles.rule}>
                <span>Buttons and inputs</span>
                <strong>4–7px radius · visible focus · 42px minimum height</strong>
              </div>
              <div className={styles.rule}>
                <span>Menus and sheets</span>
                <strong>7–10px radius · shadow only for elevation</strong>
              </div>
              <div className={styles.rule}>
                <span>Avatars and true pills</span>
                <strong>Circular only when the shape has semantic meaning</strong>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className="tessli-container">
          Tessli design foundation · Product pages begin only after this lab is approved.
        </div>
      </footer>
    </div>
  );
}
