import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ArticleSeo from "@/components/seo/ArticleSeo";
import RelatedInternalLinks from "@/components/seo/RelatedInternalLinks";
import ArticleBodyWithAd from "@/components/articles/ArticleBodyWithAd";
import { getArticleBySlug, getAllArticleSlugs } from "@/data/articles";
import {
  articleBreadcrumbs,
  articleSeoFromArticle,
  buildStaticArticleMetadata,
} from "@/lib/seo/article-seo";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { absoluteUrl } from "@/lib/site-url";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article — GoalCurrent.live" };
  return buildStaticArticleMetadata(slug);
}

const CATEGORY_LABELS: Record<string, string> = {
  "world-cup-2026": "🌍 World Cup 2026",
  "premier-league": "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League",
  "champions-league": "⭐ Champions League",
  editorial: "✍️ GoalCurrent Editorial",
};

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const seo = articleSeoFromArticle(article);

  return (
    <>
      <ArticleSeo
        article={seo}
        breadcrumbs={articleBreadcrumbs(slug, article.title)}
      />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px 120px" }}>
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.06) 0%, #f8fafc 100%)",
            border: "1px solid rgba(37,99,235,0.1)",
            borderRadius: 16,
            padding: "24px 20px",
            marginBottom: 28,
          }}
        >
          <div style={{ marginBottom: 10 }}>
            <span
              style={{
                background: "rgba(37,99,235,0.1)",
                color: "#2563eb",
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 20,
                letterSpacing: "0.05em",
              }}
            >
              {CATEGORY_LABELS[article.category] || article.category}
            </span>
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.25,
              marginBottom: 12,
            }}
          >
            {article.title}
          </h1>
          <div
            style={{
              display: "flex",
              gap: 14,
              fontSize: 12,
              color: "#94a3b8",
              flexWrap: "wrap",
            }}
          >
            <time dateTime={seo.datePublished}>📅 {article.date}</time>
            <span>✍️ GoalCurrent Editorial</span>
            <span>⏱ {article.readTime} min read</span>
          </div>
        </div>

        <ArticleBodyWithAd
          html={article.content
            .replace(
              /<h2>/g,
              '<h2 style="font-size:18px;font-weight:800;color:#0f172a;margin:28px 0 10px;padding-bottom:8px;border-bottom:2px solid #2563eb;">',
            )
            .replace(/<p>/g, '<p style="margin-bottom:16px;">')}
        />

        <ShareButtons
          url={absoluteUrl(`/articles/${article.slug}`)}
          title={article.title}
        />

        <RelatedInternalLinks
          links={[
            { href: "/articles", label: "All articles" },
            { href: "/worldcup2026", label: "World Cup 2026 hub" },
            { href: "/premier-league", label: "Premier League hub" },
            { href: "/live", label: "Live scores" },
          ]}
        />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
          <Link
            href="/articles"
            style={{
              padding: "8px 16px",
              background: "rgba(37,99,235,0.1)",
              color: "#2563eb",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            ← All Articles
          </Link>
        </div>
      </main>
    </>
  );
}
