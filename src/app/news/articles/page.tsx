import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/data/articles";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "GoalCurrent Editorial — Articles & Analysis",
  description: `Original football articles, analysis and editorial content from ${SITE_NAME}.`,
  path: "/news/articles",
});

const CATEGORY_LABELS: Record<string, string> = {
  "world-cup-2026": "🌍 World Cup 2026",
  "premier-league": "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League",
  "champions-league": "⭐ Champions League",
  "editorial": "✍️ Editorial",
};

export default function ArticlesPage() {
  const sorted = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px 120px" }}>
      <nav style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
        <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
        {" › "}
        <Link href="/news" style={{ color: "#94a3b8", textDecoration: "none" }}>News</Link>
        {" › "}
        <strong style={{ color: "#0f172a" }}>Articles</strong>
      </nav>

      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
        GoalCurrent Editorial
      </h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>
        Original football articles, analysis and editorial content from {SITE_NAME}.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {sorted.map(article => (
          <Link
            key={article.slug}
            href={`/news/articles/${article.slug}`}
            style={{ textDecoration: "none" }}
          >
            <div style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(255,255,255,0.7)",
              borderRadius: 14, padding: "18px 20px",
              transition: "box-shadow 0.2s",
            }}>
              <div style={{ marginBottom: 8 }}>
                <span style={{
                  background: "rgba(37,99,235,0.1)", color: "#2563eb",
                  fontSize: 11, fontWeight: 700, padding: "2px 8px",
                  borderRadius: 20
                }}>
                  {CATEGORY_LABELS[article.category]}
                </span>
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6, lineHeight: 1.3 }}>
                {article.title}
              </h2>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginBottom: 10 }}>
                {article.description}
              </p>
              <div style={{ fontSize: 11, color: "#94a3b8", display: "flex", gap: 12 }}>
                <span>📅 {article.date}</span>
                <span>⏱ {article.readTime} min read</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
