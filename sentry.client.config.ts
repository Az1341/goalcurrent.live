import * as Sentry from "@sentry/nextjs";
import { buildSentryInitOptions } from "@/lib/sentry-config";

Sentry.init(buildSentryInitOptions());