"use client";

type JsonLdScriptProps = {
  data: Record<string, unknown>;
};

/** Client-rendered JSON-LD for Google rich results (schema.org). */
export default function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
