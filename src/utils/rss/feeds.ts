export type RssFeedConfig = {
  url: string;
  source: string;
};

export const FOOTBALL_RSS_FEEDS: readonly RssFeedConfig[] = [
  {
    url: "https://feeds.bbci.co.uk/sport/football/rss.xml",
    source: "BBC Sport",
  },
  {
    url: "https://www.espn.com/espn/rss/soccer/news",
    source: "ESPN",
  },
  {
    url: "https://www.theguardian.com/football/rss",
    source: "The Guardian",
  },
];

export const VIDEO_RSS_FEEDS: readonly RssFeedConfig[] = [
  {
    url: "https://feeds.bbci.co.uk/sport/football/rss.xml",
    source: "BBC Sport",
  },
];
