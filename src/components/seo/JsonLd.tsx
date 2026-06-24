type JsonLdProps = {
  data: Record<string, unknown>;
};

/** Server-rendered JSON-LD for schema.org (preferred for crawlers). */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
