import * as Sentry from "@sentry/nextjs";

export function logError(context: string, error: unknown): void {
  console.error(`[${context}]`, error);
}

export function logInfo(context: string, message: string, extra?: unknown): void {
  console.info(`[${context}]`, message, extra ?? "");
}

export function captureRouteError(context: string, error: unknown): void {
  logError(context, error);

  if (error instanceof Error) {
    Sentry.captureException(error, { tags: { route: context } });
    return;
  }

  Sentry.captureException(new Error(String(error)), {
    tags: { route: context },
    extra: { raw: error },
  });
}