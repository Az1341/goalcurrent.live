"use client";

import * as Sentry from "@sentry/nextjs";
import { useTranslations } from "next-intl";
import React from "react";

type Props = { children: React.ReactNode };

type State = { hasError: boolean };

function ErrorFallback() {
  const t = useTranslations("errors.generic");
  return (
    <div role="alert" style={{ padding: "1.5rem", textAlign: "center" }}>
      {t("description")}
    </div>
  );
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    Sentry.captureException(error, {
      extra: { componentStack: errorInfo.componentStack },
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}