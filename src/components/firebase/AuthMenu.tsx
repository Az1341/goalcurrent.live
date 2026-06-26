"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";
import {
  getNotificationPermission,
  requestFirebasePushPermission,
} from "@/components/firebase/FcmRegistration";
import { isFirebaseMessagingConfigured } from "@/lib/firebase/config";
import styles from "./firebase-auth.module.css";

type AuthMenuProps = {
  variant?: "header" | "sheet";
  onAction?: () => void;
};

export default function AuthMenu({ variant = "header", onAction }: AuthMenuProps) {
  const t = useTranslations("auth");
  const { enabled, user, loading, signInGoogle, signInApple, signOut } =
    useFirebaseAuth();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>("default");
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    setPushPermission(getNotificationPermission());
  }, [enabled, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  if (!enabled) {
    return null;
  }

  const close = () => setOpen(false);

  const handleSignIn = async (provider: "google" | "apple") => {
    setError(null);
    try {
      if (provider === "google") {
        await signInGoogle();
      } else {
        await signInApple();
      }
      close();
      onAction?.();
    } catch {
      setError(t("signInError"));
    }
  };

  const handleSignOut = async () => {
    setError(null);
    await signOut();
    close();
    onAction?.();
  };

  const handleEnablePush = () => {
    requestFirebasePushPermission();
    setPushPermission(getNotificationPermission());
    onAction?.();
  };

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || t("account");
  const isSheet = variant === "sheet";

  if (loading) {
    return (
      <div className={isSheet ? styles.sheetWrap : styles.headerWrap}>
        <span className={styles.loading}>{t("loading")}</span>
      </div>
    );
  }

  if (user) {
    return (
      <div
        ref={rootRef}
        className={isSheet ? styles.sheetWrap : styles.headerWrap}
      >
        <div className={styles.signedInBlock}>
          <p className={styles.signedInLabel}>
            {t("signedInAs", { name: displayName })}
          </p>
          {isFirebaseMessagingConfigured() ? (
            <button
              type="button"
              className={styles.pushButton}
              onClick={handleEnablePush}
              disabled={pushPermission === "denied"}
            >
              {pushPermission === "granted"
                ? t("notificationsEnabled")
                : pushPermission === "denied"
                  ? t("notificationsBlocked")
                  : t("enableNotifications")}
            </button>
          ) : null}
          <button
            type="button"
            className={isSheet ? styles.sheetButton : styles.signOutButton}
            onClick={() => void handleSignOut()}
          >
            {t("signOut")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={isSheet ? styles.sheetWrap : styles.headerWrap}
    >
      {isSheet ? (
        <div className={styles.sheetProviders}>
          <button
            type="button"
            className={styles.sheetButton}
            onClick={() => void handleSignIn("google")}
          >
            {t("continueWithGoogle")}
          </button>
          <button
            type="button"
            className={styles.sheetButton}
            onClick={() => void handleSignIn("apple")}
          >
            {t("continueWithApple")}
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            className={styles.signInTrigger}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            {t("signIn")}
          </button>
          {open ? (
            <div id={menuId} className={styles.menu} role="menu">
              <button
                type="button"
                className={styles.menuItem}
                role="menuitem"
                onClick={() => void handleSignIn("google")}
              >
                {t("continueWithGoogle")}
              </button>
              <button
                type="button"
                className={styles.menuItem}
                role="menuitem"
                onClick={() => void handleSignIn("apple")}
              >
                {t("continueWithApple")}
              </button>
            </div>
          ) : null}
        </>
      )}
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
