"use client";

type ScoreBatEmbedProps = {
  html: string;
};

export default function ScoreBatEmbed({ html }: ScoreBatEmbedProps) {
  if (!html) {
    return null;
  }

  return (
    <div
      className="scorebat-embed"
      style={{ minHeight: 300 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}