export type NewsTag =
  | "INJURY"
  | "SQUAD"
  | "PREVIEW"
  | "RESULT"
  | "BREAKING"
  | "TRANSFER"
  | "NEWS"
  | "FEATURE";

export type NewsArticle = {
  title: string;
  link: string;
  excerpt: string;
  date: string;
  source: string;
  tag: NewsTag;
  image?: string;
};

export type NewsApiResponse = {
  articles: NewsArticle[];
  sources: string[];
  count: number;
  fetched: string;
  error?: string;
};
