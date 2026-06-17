import type { NewsArticle, NewsApiResponse, NewsTag } from "@/types/news";

const WC_KEYWORDS = [
  "world cup",
  "mundial",
  "wc2026",
  "wc 2026",
  "fifa 2026",
  "squad",
  "injury",
  "lineup",
  "line-up",
  "preview",
  "group stage",
  "knockout",
  "penalty",
  "golden boot",
  "hat-trick",
  "transfer",
  "england",
  "france",
  "brazil",
  "argentina",
  "germany",
  "spain",
  "portugal",
  "mexico",
  "usa",
  "canada",
  "morocco",
  "nigeria",
  "messi",
  "ronaldo",
  "mbappe",
  "vinicius",
  "bellingham",
  "kane",
  "saka",
  "salah",
  "neymar",
  "lewandowski",
  "de bruyne",
];

const BBC_FEED = "https://feeds.bbci.co.uk/sport/football/rss.xml";
const ESPN_FEED = "https://www.espn.com/espn/rss/soccer/news";
const ARTICLE_LIMIT = 20;

function isRelevant(text: string): boolean {
  const low = text.toLowerCase();
  return WC_KEYWORDS.some((keyword) => low.includes(keyword));
}

function tagFromText(text: string): NewsTag {
  const low = text.toLowerCase();
  if (
    low.includes("injur") ||
    low.includes("fitness") ||
    low.includes("doubt") ||
    low.includes("ruled out")
  ) {
    return "INJURY";
  }
  if (
    low.includes("squad") ||
    low.includes("named") ||
    low.includes("call-up") ||
    low.includes("callup")
  ) {
    return "SQUAD";
  }
  if (low.includes("preview") || low.includes("prediction")) {
    return "PREVIEW";
  }
  if (
    low.includes("result") ||
    low.includes(" win") ||
    low.includes("beat") ||
    low.includes("score") ||
    low.includes("goal")
  ) {
    return "RESULT";
  }
  if (
    low.includes("breaking") ||
    low.includes("confirm") ||
    low.includes("official")
  ) {
    return "BREAKING";
  }
  if (
    low.includes("transfer") ||
    low.includes("sign") ||
    low.includes("deal")
  ) {
    return "TRANSFER";
  }
  return "NEWS";
}

function decodeHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function parseRssItem(item: string): Omit<NewsArticle, "source"> | null {
  const titleMatch =
    item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
    item.match(/<title>(.*?)<\/title>/);
  const linkMatch =
    item.match(/<link>(.*?)<\/link>/) || item.match(/<guid>(.*?)<\/guid>/);
  const descMatch =
    item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) ||
    item.match(/<description>(.*?)<\/description>/);
  const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
  const imgMatch =
    item.match(/<media:thumbnail[^>]+url="([^"]+)"/) ||
    item.match(/<media:content[^>]+url="([^"]+)"/) ||
    item.match(/<enclosure[^>]+url="([^"]+)"/);

  const title = decodeHtml(titleMatch?.[1] ?? "");
  const link = decodeHtml(linkMatch?.[1] ?? "");
  const description = decodeHtml(descMatch?.[1] ?? "");
  const pubDate = pubDateMatch?.[1] ?? "";
  const image = imgMatch?.[1] ?? "";

  if (!title || !link) {
    return null;
  }

  if (!isRelevant(title) && !isRelevant(description)) {
    return null;
  }

  const excerpt =
    description.length > 180
      ? `${description.slice(0, 180)}…`
      : description;

  return {
    title,
    link,
    excerpt,
    date: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
    tag: tagFromText(`${title} ${description}`),
    ...(image ? { image } : {}),
  };
}

function parseRss(xml: string): Omit<NewsArticle, "source">[] {
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
  const articles: Omit<NewsArticle, "source">[] = [];

  for (const item of items) {
    const parsed = parseRssItem(item);
    if (parsed) {
      articles.push(parsed);
    }
  }

  return articles;
}

async function fetchFeed(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "GoalCurrent/1.0 RSS Reader" },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      return null;
    }
    return await response.text();
  } catch {
    return null;
  }
}

function dedupeArticles(articles: NewsArticle[]): NewsArticle[] {
  const seenTitles = new Set<string>();
  const seenLinks = new Set<string>();

  return articles.filter((article) => {
    const titleKey = article.title.toLowerCase().slice(0, 40);
    const linkKey = article.link.toLowerCase();
    if (seenTitles.has(titleKey) || seenLinks.has(linkKey)) {
      return false;
    }
    seenTitles.add(titleKey);
    seenLinks.add(linkKey);
    return true;
  });
}

export async function fetchNewsFeed(): Promise<NewsApiResponse> {
  const [bbcXml, espnXml] = await Promise.all([
    fetchFeed(BBC_FEED),
    fetchFeed(ESPN_FEED),
  ]);

  let articles: NewsArticle[] = [];
  const sources: string[] = [];

  if (bbcXml) {
    articles = articles.concat(
      parseRss(bbcXml).map((article) => ({ ...article, source: "BBC Sport" })),
    );
    sources.push("BBC Sport");
  }

  if (espnXml) {
    articles = articles.concat(
      parseRss(espnXml).map((article) => ({ ...article, source: "ESPN" })),
    );
    sources.push("ESPN");
  }

  articles = dedupeArticles(articles);
  articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  articles = articles.slice(0, ARTICLE_LIMIT);

  return {
    articles,
    sources,
    count: articles.length,
    fetched: new Date().toISOString(),
  };
}
