type ArticleBodyWithAdProps = {
  html: string;
};

export default function ArticleBodyWithAd({ html }: ArticleBodyWithAdProps) {
  return (
    <article style={{ color: "#475569", lineHeight: 1.8, fontSize: 15 }}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
