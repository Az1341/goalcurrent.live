import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getClubBySlug, getAllClubSlugs } from "@/data/pl-clubs";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

type PageProps = { params: Promise<{ club: string }> };

export function generateStaticParams() {
  return getAllClubSlugs().map(slug => ({ club: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { club } = await params;
  const data = getClubBySlug(club);
  if (!data) return { title: "Club — Premier League" };
  return buildPageMetadata({
    title: `${data.name} — Premier League 2026/27`,
    description: `${data.name} Premier League profile — manager, stadium, history and season stats on ${SITE_NAME}.`,
    path: `/premier-league/clubs/${data.slug}`,
  });
}

export default async function ClubPage({ params }: PageProps) {
  const { club } = await params;
  const data = getClubBySlug(club);
  if (!data) notFound();

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px 120px" }}>

      {/* Breadcrumb */}
      <nav style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
        <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
        {" › "}
        <Link href="/premier-league" style={{ color: "#94a3b8", textDecoration: "none" }}>Premier League</Link>
        {" › "}
        <Link href="/premier-league/clubs" style={{ color: "#94a3b8", textDecoration: "none" }}>Clubs</Link>
        {" › "}
        <strong style={{ color: "#0f172a" }}>{data.name}</strong>
      </nav>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${data.primaryColor}18 0%, #f8fafc 100%)`,
        border: `1px solid ${data.primaryColor}30`,
        borderRadius: 16, padding: "24px 20px", marginBottom: 24
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
          {data.emoji} {data.name}
        </h1>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 0 }}>
          {data.stadium} · Est. {data.founded} · Manager: <strong>{data.manager}</strong>
        </p>
      </div>

      {/* Stats grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
        gap: 12, marginBottom: 28
      }}>
        {[
          { label: "2025/26 Position", value: `${data.position}${(["st","nd","rd"] as const)[data.position-1] ?? "th"}` },
          { label: "PL Titles", value: String(data.plTitles) },
          { label: "Founded", value: String(data.founded) },
          { label: "Capacity", value: data.capacity },
        ].map(s => (
          <div key={s.label} style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(255,255,255,0.7)",
            borderRadius: 12, padding: "14px 12px", textAlign: "center"
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#2563eb" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* About */}
      <section style={{ marginBottom: 28 }}>
        <h2 style={{
          fontSize: 14, fontWeight: 800, letterSpacing: "0.1em",
          textTransform: "uppercase", color: "#2563eb",
          paddingBottom: 8, borderBottom: "2px solid #2563eb", marginBottom: 14
        }}>
          About {data.name}
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.75, fontSize: 15 }}>
          {data.description}
        </p>
        <div style={{ marginTop: 12, fontSize: 13, color: "#64748b" }}>
          <strong>Stadium:</strong> {data.stadium} · <strong>Capacity:</strong> {data.capacity}
        </div>
      </section>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
        <Link href="/premier-league/clubs" style={{
          padding: "8px 16px", background: "rgba(37,99,235,0.1)",
          color: "#2563eb", borderRadius: 8, textDecoration: "none",
          fontWeight: 700, fontSize: 13
        }}>← All Clubs</Link>
        <Link href="/premier-league/table" style={{
          padding: "8px 16px", background: "#2563eb",
          color: "#fff", borderRadius: 8, textDecoration: "none",
          fontWeight: 700, fontSize: 13
        }}>📊 PL Table</Link>
        <Link href="/premier-league/fixtures" style={{
          padding: "8px 16px", background: "rgba(37,99,235,0.1)",
          color: "#2563eb", borderRadius: 8, textDecoration: "none",
          fontWeight: 700, fontSize: 13
        }}>📅 Fixtures</Link>
      </div>

    </main>
  );
}
