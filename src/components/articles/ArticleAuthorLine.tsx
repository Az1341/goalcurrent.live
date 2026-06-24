import { EDITORIAL_AUTHOR, EDITORIAL_PUBLISHER } from "@/lib/seo/constants";

type ArticleAuthorLineProps = {
  sepClassName?: string;
};

/** Visible byline: Ahmad Zafarani - GoalCurrent.live */
export default function ArticleAuthorLine({ sepClassName }: ArticleAuthorLineProps) {
  return (
    <>
      <span>
        By <strong>{EDITORIAL_AUTHOR}</strong>
      </span>
      {sepClassName ? <span className={sepClassName}>·</span> : <span> · </span>}
      <span>{EDITORIAL_PUBLISHER}</span>
    </>
  );
}

export function ArticleCopyrightNotice() {
  return (
    <>
      Written by <strong>{EDITORIAL_AUTHOR}</strong> for {EDITORIAL_PUBLISHER}. Unauthorised
      reproduction or republication of this article in whole or in part is strictly prohibited
      without prior written permission.
    </>
  );
}