"use client";

import { useMemo } from "react";
import NewsArticleCard from "@/components/news/NewsArticleCard";
import { useNewsFeed } from "@/lib/use-news-feed";
import { filterNewsByKeywords } from "@/lib/team-profile/fixture-utils";
import ProfileFallback from "./ProfileFallback";
import ProfileSection from "./ProfileSection";
import styles from "./team-profile.module.css";

export default function ProfileNewsSection({ keywords, sectionId = "profile-news" }: { keywords: string[]; sectionId?: string }) {
  const { articles, loading } = useNewsFeed();
  const filtered = useMemo(() => filterNewsByKeywords(articles, keywords), [articles, keywords]);

  return (
    <ProfileSection id={sectionId} title="Latest news">
      {loading ? (
        <p className={styles.loading}>Loading news...</p>
      ) : filtered.length ? (
        <div className={styles.newsList}>
          {filtered.slice(0, 5).map((article) => (
            <NewsArticleCard key={`${article.link}-${article.title}`} article={article} />
          ))}
        </div>
      ) : (
        <ProfileFallback message="No latest news available yet." />
      )}
    </ProfileSection>
  );
}