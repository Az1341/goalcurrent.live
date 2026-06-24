import "server-only";
import { getFixtureById, getTeamById } from "@/data/wc26";

type ScoreBatItem = {
  title: string;
  embed: string;
};

type ScoreBatResponse = {
  response?: ScoreBatItem[];
};

export async function getScoreBatEmbed(
  homeTeamName: string,
  awayTeamName: string,
): Promise<string | null> {
  const token = process.env.SCOREBAT_API_TOKEN?.trim();
  if (!token || !homeTeamName || !awayTeamName) {
    return null;
  }

  try {
    const res = await fetch(
      `https://www.scorebat.com/video-api/v3/feed/?token=${encodeURIComponent(token)}`,
      {
        next: { revalidate: 300 },
      },
    );

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as ScoreBatResponse;
    const items = data.response ?? [];
    const home = homeTeamName.toLowerCase();
    const away = awayTeamName.toLowerCase();

    const matchItem = items.find((item) => {
      const title = item.title.toLowerCase();
      return title.includes(home) && title.includes(away);
    });

    return matchItem?.embed ?? null;
  } catch {
    return null;
  }
}

/** Resolve ScoreBat embed HTML for a local WC26 fixture id. */
export async function getScoreBatEmbedForFixture(
  fixtureId: string,
): Promise<string | null> {
  const fixture = getFixtureById(fixtureId);
  if (!fixture) {
    return null;
  }

  const home = getTeamById(fixture.homeTeamId);
  const away = getTeamById(fixture.awayTeamId);
  if (!home || !away) {
    return null;
  }

  return getScoreBatEmbed(home.name, away.name);
}