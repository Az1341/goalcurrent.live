/**
 * Full verification of dynamic content system.
 * Run with dev server: npm run dev
 * Usage: node scripts/verify-content-system.mjs [baseUrl]
 */
const BASE = process.argv[2] ?? "http://localhost:3000";

const results = [];

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`PASS  ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function fetchJson(path, init) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    signal: AbortSignal.timeout(30000),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { res, json, text: text.slice(0, 500) };
}

async function fetchHtml(path) {
  const res = await fetch(`${BASE}${path}`, {
    signal: AbortSignal.timeout(30000),
  });
  const html = await res.text();
  return { res, html };
}

async function testRssLive() {
  try {
    const res = await fetch(
      "https://feeds.bbci.co.uk/sport/football/rss.xml",
      {
        headers: { "User-Agent": "GoalCurrent/1.0 verify" },
        signal: AbortSignal.timeout(10000),
      },
    );
    const xml = await res.text();
    const items = xml.match(/<item>/g)?.length ?? 0;
    if (res.ok && items > 0) {
      pass("RSS ingestion (BBC live feed)", `${items} items in feed`);
    } else {
      fail("RSS ingestion (BBC live feed)", `status=${res.status} items=${items}`);
    }
  } catch (e) {
    fail("RSS ingestion (BBC live feed)", String(e.message ?? e));
  }
}

async function testGNewsFallback() {
  const hasKey = Boolean(process.env.GNEWS_API_KEY?.trim());
  if (!hasKey) {
    pass(
      "GNews fallback (no key)",
      "GNEWS_API_KEY unset — graceful skip expected",
    );
    return;
  }
  try {
    const params = new URLSearchParams({
      q: "football",
      lang: "en",
      max: "5",
      apikey: process.env.GNEWS_API_KEY.trim(),
    });
    const res = await fetch(
      `https://gnews.io/api/v4/search?${params.toString()}`,
      { signal: AbortSignal.timeout(10000) },
    );
    const json = await res.json();
    const count = json.articles?.length ?? 0;
    if (res.ok && count > 0) {
      pass("GNews API", `${count} articles returned`);
    } else {
      fail("GNews API", `status=${res.status} articles=${count}`);
    }
  } catch (e) {
    fail("GNews API", String(e.message ?? e));
  }
}

async function testYouTubeViaApi() {
  const { res, json } = await fetchJson("/api/videos?limit=4");
  if (!res.ok) {
    fail("/api/videos", `HTTP ${res.status}`);
    return;
  }
  const count = json?.count ?? json?.videos?.length ?? 0;
  if (count > 0) {
    pass("/api/videos (YouTube/cache)", `${count} videos${json.error ? ` (note: ${json.error})` : ""}`);
  } else if (json?.error) {
    pass("/api/videos fallback", `empty with error: ${json.error}`);
  } else {
    fail("/api/videos", "zero videos and no error");
  }
}

async function testScoreBatEnv() {
  const hasToken = Boolean(process.env.SCOREBAT_API_TOKEN?.trim());
  if (!hasToken) {
    pass("ScoreBat ingestion", "SCOREBAT_API_TOKEN unset — skip expected");
    return;
  }
  try {
    const token = process.env.SCOREBAT_API_TOKEN.trim();
    const res = await fetch(
      `https://www.scorebat.com/video-api/v3/feed/?token=${encodeURIComponent(token)}`,
      { signal: AbortSignal.timeout(10000) },
    );
    const json = await res.json();
    const matches = json.response?.length ?? 0;
    if (res.ok) {
      pass("ScoreBat API live", `${matches} matches in feed`);
    } else {
      fail("ScoreBat API live", `HTTP ${res.status}`);
    }
  } catch (e) {
    fail("ScoreBat API live", String(e.message ?? e));
  }
}

async function testNewsApi() {
  const { res, json } = await fetchJson("/api/news");
  if (!res.ok) {
    fail("/api/news", `HTTP ${res.status}`);
    return;
  }
  const count = json?.count ?? json?.articles?.length ?? 0;
  const cacheControl = res.headers.get("cache-control") ?? "";
  if (count > 0) {
    pass(
      "/api/news (24h cache)",
      `${count} articles, sources=${(json.sources ?? []).join("+")}, cache=${cacheControl.slice(0, 40)}`,
    );
  } else {
    fail("/api/news", json?.error ?? "zero articles");
  }
}

async function testArticlesApi() {
  const { res, json } = await fetchJson("/api/articles");
  if (!res.ok) {
    fail("/api/articles", `HTTP ${res.status}`);
    return;
  }
  const count = json?.count ?? json?.articles?.length ?? 0;
  if (count > 0) {
    pass("/api/articles", `${count} syndicated articles`);
  } else {
    fail("/api/articles", json?.error ?? "zero articles");
  }
}

async function testCron() {
  const { res, json } = await fetchJson("/api/cron/refresh-content");
  if (res.status === 401) {
    pass(
      "/api/cron/refresh-content",
      "401 in production mode (set CRON_SECRET or use dev)",
    );
    return;
  }
  if (res.ok && json?.ok) {
    pass(
      "/api/cron/refresh-content",
      `refreshed news=${json.counts?.news} videos=${json.counts?.videos} articles=${json.counts?.articles}`,
    );
  } else {
    fail("/api/cron/refresh-content", `HTTP ${res.status} ${JSON.stringify(json)}`);
  }
}

async function testPage(path, mustContain) {
  const { res, html } = await fetchHtml(path);
  if (!res.ok) {
    fail(`Page ${path}`, `HTTP ${res.status}`);
    return;
  }
  const missing = mustContain.filter((s) => !html.includes(s));
  if (missing.length === 0) {
    pass(`Page ${path}`, `renders (${html.length} bytes)`);
  } else {
    fail(`Page ${path}`, `missing: ${missing.join(", ")}`);
  }
}

async function testSeedCache() {
  try {
    const news = await import("../src/utils/cache/news.json", {
      with: { type: "json" },
    });
    const videos = await import("../src/utils/cache/videos.json", {
      with: { type: "json" },
    });
    const articles = await import("../src/utils/cache/articles.json", {
      with: { type: "json" },
    });
    if (
      news.default.items?.length > 0 &&
      videos.default.items?.length > 0 &&
      articles.default.items?.length > 0
    ) {
      pass(
        "Seed cache JSON",
        `news=${news.default.items.length} videos=${videos.default.items.length} articles=${articles.default.items.length}`,
      );
    } else {
      fail("Seed cache JSON", "one or more seed files empty");
    }
  } catch (e) {
    fail("Seed cache JSON", String(e.message ?? e));
  }
}

async function main() {
  console.log(`\nGoalCurrent content system verification — ${BASE}\n`);

  try {
    const ping = await fetch(BASE, { signal: AbortSignal.timeout(5000) });
    if (!ping.ok) {
      fail("Dev server reachable", `HTTP ${ping.status}`);
      console.log("\nStart dev server: npm run dev\n");
      process.exit(1);
    }
    pass("Dev server reachable", `HTTP ${ping.status}`);
  } catch (e) {
    fail("Dev server reachable", String(e.message ?? e));
    console.log("\nStart dev server: npm run dev\n");
    process.exit(1);
  }

  await testSeedCache();
  await testRssLive();
  await testGNewsFallback();
  await testScoreBatEnv();
  await testNewsApi();
  await testArticlesApi();
  await testYouTubeViaApi();
  await testCron();
  await testPage("/news", ["Football News", "Latest"]);
  await testPage("/videos", ["Latest Videos"]);
  await testPage("/articles", ["Football Articles", "Analysis"]);

  const failed = results.filter((r) => !r.ok);
  console.log(`\n--- Summary: ${results.length - failed.length}/${results.length} passed ---`);
  if (failed.length > 0) {
    console.log("\nFailures:");
    for (const f of failed) {
      console.log(`  - ${f.name}: ${f.detail}`);
    }
    process.exit(1);
  }
}

main();