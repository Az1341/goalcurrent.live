"use client";

import CompetitionMatchHub from "@/components/home/v5/CompetitionMatchHub";
import type { UnlFixtureRow } from "@/lib/unl/types";

export default function UnlMatchClient({ fixture }: { fixture: UnlFixtureRow }) {
  return <CompetitionMatchHub competition="unl" fixtureId={fixture.fixtureId} initialFixture={fixture} />;
}
