import { EDITORIAL_AUTHOR, EDITORIAL_PUBLISHER } from "@/lib/seo/constants";

type ArticleAuthorLineProps = {
  sepClassName?: string;
  author?: string;
};

/** Visible byline: Ahmad Zafarani - GoalCurrent.live */
export default function ArticleAuthorLine({
  sepClassName,
  author = EDITORIAL_AUTHOR,
}: ArticleAuthorLineProps) {
  return (
    <>
      <span>
        By <strong>{author}</strong>
      </span>
      {sepClassName ? <span className={sepClassName}>·</span> : <span> · </span>}
      <span>{EDITORIAL_PUBLISHER}</span>
    </>
  );
}

export function ArticleCopyrightNotice({ author = EDITORIAL_AUTHOR }: { author?: string }) {
  return (
    <>
      Written by <strong>{author}</strong> for {EDITORIAL_PUBLISHER}. Unauthorised
      reproduction or republication of this article in whole or in part is strictly prohibited
      without prior written permission.
    </>
  );
}