import test from "node:test";
import assert from "node:assert/strict";

function decodeHtml(text) {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .trim();
}

function extractYouTubeVideoId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1).split("/")[0] || null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

function parseRssItemXml(itemXml) {
  const titleMatch =
    itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
    itemXml.match(/<title>(.*?)<\/title>/);
  const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
  const descMatch =
    itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) ||
    itemXml.match(/<description>(.*?)<\/description>/);
  const imgMatch = itemXml.match(/<media:thumbnail[^>]+url="([^"]+)"/);

  const title = decodeHtml(titleMatch?.[1] ?? "");
  const link = decodeHtml(linkMatch?.[1] ?? "");
  const description = decodeHtml(descMatch?.[1] ?? "");
  const image = imgMatch?.[1] ? decodeHtml(imgMatch[1]) : "";
  if (!title || !link) return null;

  const videoFromDesc = description.match(
    /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=[\w-]+|youtu\.be\/[\w-]+)/i,
  )?.[0];

  return {
    title,
    link,
    thumbnail: image,
    videoUrl: videoFromDesc ? extractYouTubeVideoId(videoFromDesc) : null,
  };
}

const SAMPLE_ITEM = `<item>
  <title><![CDATA[Test headline]]></title>
  <link>https://example.com/story</link>
  <description><![CDATA[Preview https://www.youtube.com/watch?v=dQw4w9WgXcQ]]></description>
  <media:thumbnail url="https://cdn.example.com/thumb.jpg"/>
</item>`;

test("parseRssItemXml extracts title, link, thumbnail, and youtube video", () => {
  const parsed = parseRssItemXml(SAMPLE_ITEM);
  assert.ok(parsed);
  assert.equal(parsed.title, "Test headline");
  assert.equal(parsed.link, "https://example.com/story");
  assert.equal(parsed.thumbnail, "https://cdn.example.com/thumb.jpg");
  assert.equal(parsed.videoUrl, "dQw4w9WgXcQ");
});

test("extractYouTubeVideoId handles watch and youtu.be URLs", () => {
  assert.equal(
    extractYouTubeVideoId("https://www.youtube.com/watch?v=abc123XYZ"),
    "abc123XYZ",
  );
  assert.equal(extractYouTubeVideoId("https://youtu.be/abc123XYZ"), "abc123XYZ");
});

const GUARDIAN_ITEM = `<item>
  <title>World Cup 2026 live</title>
  <link>https://www.theguardian.com/football/live/example</link>
  <description>Latest</description>
  <media:thumbnail url="https://i.guim.co.uk/img/media/example.jpg?width=140&amp;quality=85&amp;auto=format&amp;fit=max&amp;s=abc"/>
</item>`;

test("parseRssItemXml decodes HTML entities in Guardian thumbnail URLs", () => {
  const parsed = parseRssItemXml(GUARDIAN_ITEM);
  assert.ok(parsed);
  assert.equal(
    parsed.thumbnail,
    "https://i.guim.co.uk/img/media/example.jpg?width=140&quality=85&auto=format&fit=max&s=abc",
  );
});
