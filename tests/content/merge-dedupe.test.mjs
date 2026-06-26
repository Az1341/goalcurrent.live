import test from "node:test";
import assert from "node:assert/strict";

function dedupeContentItems(items) {
  const seenTitles = new Set();
  const seenLinks = new Set();
  return items.filter((item) => {
    const titleKey = item.title.toLowerCase().slice(0, 40);
    const linkKey = item.url.toLowerCase();
    if (seenTitles.has(titleKey) || seenLinks.has(linkKey)) return false;
    seenTitles.add(titleKey);
    seenLinks.add(linkKey);
    return true;
  });
}

function mergeContentSources(primary, secondary, limit = 30) {
  const merged = dedupeContentItems([...primary, ...secondary]);
  return merged
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, limit);
}

test("mergeContentSources prefers primary RSS items and dedupes API duplicates", () => {
  const rss = [
    {
      title: "World Cup 2026 opener kicks off",
      url: "https://news.example/a",
      publishedAt: "2026-06-24T10:00:00.000Z",
      source: "BBC Sport",
    },
    {
      title: "Premier League transfer latest",
      url: "https://news.example/b",
      publishedAt: "2026-06-23T10:00:00.000Z",
      source: "ESPN",
    },
  ];

  const api = [
    {
      title: "World Cup 2026 opener kicks off",
      url: "https://news.example/a",
      publishedAt: "2026-06-24T09:00:00.000Z",
      source: "GNews",
    },
    {
      title: "Norway edge Senegal in thriller",
      url: "https://news.example/c",
      publishedAt: "2026-06-24T11:00:00.000Z",
      source: "GNews",
    },
  ];

  const merged = mergeContentSources(rss, api);
  assert.equal(merged.length, 3);
  assert.equal(merged[0].url, "https://news.example/c");
  assert.equal(merged[1].url, "https://news.example/a");
  assert.equal(merged[1].source, "BBC Sport");
});
