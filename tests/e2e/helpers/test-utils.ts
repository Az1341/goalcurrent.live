import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

export const VISUAL_VIEWPORTS = [390, 1440, 1920] as const;
export const STABLE_MATCH_FIXTURE_ID = "fixture-001";

const AXE_WARN_ONLY_RULES = new Set(["color-contrast"]);

export async function preparePage(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem("gc_cookie_consent_v1", "accepted");
    localStorage.setItem("gc_subscribe_popup_v1", "1");
  });
}

export async function runAxeScan(page: Page, label = "page"): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  for (const violation of results.violations) {
    if (AXE_WARN_ONLY_RULES.has(violation.id)) {
      console.warn(`[axe:${label}] deferred — ${violation.id}: ${violation.help}`);
      continue;
    }
    if (violation.impact === "moderate" || violation.impact === "minor") {
      console.warn(`[axe:${label}] ${violation.impact} — ${violation.id}: ${violation.help}`);
      continue;
    }
    if (violation.impact === "serious" || violation.impact === "critical") {
      const samples = violation.nodes.slice(0, 3).map((node) => node.html).join("\n");
      throw new Error(`[axe:${label}] ${violation.impact} — ${violation.id}: ${violation.help}\n${samples}`);
    }
  }
}

export async function gotoApp(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await waitForShell(page);
}

export async function waitForShell(page: Page): Promise<void> {
  await page.waitForSelector("[data-gc-shell]", { state: "attached", timeout: 60_000 });
  await page.locator('img[src="/logo.svg"]').first().waitFor({ state: "visible", timeout: 60_000 });
}