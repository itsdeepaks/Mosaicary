"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { CloseIcon, MenuIcon } from "./icons";
import { availableNavigationItems, type NavigationItem } from "./navigation";
import styles from "./site-header.module.css";

function isItemActive(item: NavigationItem, pathname: string) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 8);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [closeMenu, pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const sheet = sheetRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusableSelector =
      'a[href], button:not([disabled]):not([tabindex="-1"])';
    const focusable = () =>
      Array.from(
        sheet?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      );

    requestAnimationFrame(() => focusable()[0]?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const elements = focusable();
      const first = elements[0];
      const last = elements.at(-1);

      if (!first || !last) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [closeMenu, isMenuOpen]);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={`tessli-container ${styles.inner}`}>
        <Link className={styles.wordmark} href="/" aria-label="Tessli home">
          Tessli
        </Link>

        <nav className={styles.desktopNavigation} aria-label="Primary navigation">
          {availableNavigationItems.map((item) => {
            const active = isItemActive(item, pathname);
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`${styles.navigationLink} ${active ? styles.active : ""}`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <button
            aria-controls="mobile-navigation-sheet"
            aria-expanded={isMenuOpen}
            aria-label="Open navigation menu"
            className={styles.menuTrigger}
            data-mobile-menu-trigger
            onClick={() => setIsMenuOpen(true)}
            ref={triggerRef}
            type="button"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <div
        className={`${styles.sheetLayer} ${isMenuOpen ? styles.sheetLayerOpen : ""}`}
        hidden={!isMenuOpen}
      >
        <button
          aria-label="Close navigation menu"
          className={styles.backdrop}
          onClick={closeMenu}
          tabIndex={-1}
          type="button"
        />
        <div
          aria-label="Mobile navigation"
          aria-modal="true"
          className={styles.sheet}
          id="mobile-navigation-sheet"
          ref={sheetRef}
          role="dialog"
        >
          <div className={styles.sheetHeader}>
            <span className={styles.sheetTitle}>Navigate</span>
            <button
              aria-label="Close navigation menu"
              className={styles.closeButton}
              onClick={closeMenu}
              type="button"
            >
              <CloseIcon />
            </button>
          </div>
          <nav className={styles.mobileNavigation} aria-label="Mobile primary navigation">
            {availableNavigationItems.map((item) => {
              const active = isItemActive(item, pathname);
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`${styles.mobileLink} ${active ? styles.mobileLinkActive : ""}`}
                  href={item.href}
                  key={item.href}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
