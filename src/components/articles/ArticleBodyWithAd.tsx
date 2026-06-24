"use client";

import { ContentAdSlot } from "@/components/ads/ContentAdSlot";
import { ADSENSE_SLOTS } from "@/lib/adsense-slots";

type ArticleBodyWithAdProps = {
  html: string;
};

function splitAfterSecondParagraph(html: string): [string, string] {
  const closingTag = /<\/p>/gi;
  let match: RegExpExecArray | null;
  let count = 0;
  let splitAt = -1;

  while ((match = closingTag.exec(html)) !== null) {
    count += 1;
    if (count === 2) {
      splitAt = match.index + match[0].length;
      break;
    }
  }

  if (splitAt === -1) {
    return [html, ""];
  }

  return [html.slice(0, splitAt), html.slice(splitAt)];
}

export default function ArticleBodyWithAd({ html }: ArticleBodyWithAdProps) {
  const [leadHtml, restHtml] = splitAfterSecondParagraph(html);

  return (
    <article style={{ color: "#475569", lineHeight: 1.8, fontSize: 15 }}>
      <div dangerouslySetInnerHTML={{ __html: leadHtml }} />
      <ContentAdSlot slot={ADSENSE_SLOTS.articleMid} minHeight={250} />
      {restHtml ? <div dangerouslySetInnerHTML={{ __html: restHtml }} /> : null}
    </article>
  );
}