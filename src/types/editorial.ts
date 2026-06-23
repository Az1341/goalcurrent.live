export type EditorialImagePlaceholder = {
  label: string;
  alt: string;
  caption?: string;
};

export type EditorialSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  image?: EditorialImagePlaceholder;
};

export type EditorialArticle = {
  slug: string;
  path: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  keywords: string[];
  relatedLinks: { href: string; label: string }[];
  sections: EditorialSection[];
};
