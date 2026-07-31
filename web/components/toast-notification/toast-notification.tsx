"use client";

import React, { useEffect } from "react";
import styles from "./toast-notification.module.css";

export interface ToastMessage {
  id: string;
  message: string;
  onUndo?: () => void;
  undoLabel?: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastNotification({
  toasts,
  onDismiss,
}: ToastNotificationProps) {
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      onDismiss(toasts[0].id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div
      className={styles.container}
      aria-live="polite"
      aria-atomic="true"
      data-toast-container="true"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className={styles.toast} data-toast-id={toast.id}>
          <span>{toast.message}</span>
          {toast.onUndo && (
            <button
              type="button"
              className={styles.undoButton}
              onClick={() => {
                toast.onUndo?.();
                onDismiss(toast.id);
              }}
              data-toast-undo="true"
            >
              {toast.undoLabel || "Undo"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
