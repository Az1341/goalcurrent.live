import { redirect } from "next/navigation";
import { matchHref } from "@/lib/wc26-match";

type Wc26MatchRedirectProps = {
  params: Promise<{ fixtureId: string; locale: string }>;
};

/** Legacy path — permanent redirect configured in next.config; this guards locale-prefixed URLs. */
export default async function Wc26MatchRedirectPage({
  params,
}: Wc26MatchRedirectProps) {
  const { fixtureId: rawId } = await params;
  const fixtureId = decodeURIComponent(rawId);
  redirect(matchHref(fixtureId));
}
