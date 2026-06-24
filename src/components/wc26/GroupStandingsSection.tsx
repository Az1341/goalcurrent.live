"use client";

import StandingsTable from "@/components/wc26/StandingsTable";
import { groupLabel, type Wc26GroupId } from "@/data/wc26";
import { WC26_QUALIFYING_SPOTS } from "@/lib/wc26-groups";
import { isGroupComplete } from "@/lib/wc26-standings";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { useWc26GroupStandings } from "@/lib/use-wc26-standings";
import type { GroupFormResult } from "@/lib/wc26-group-hub";
import type { TeamId } from "@/types/team";
import { useMemo } from "react";
import styles from "./wc26.module.css";

type GroupStandingsSectionProps = {
  groupId: Wc26GroupId;
  formByTeamId?: ReadonlyMap<TeamId, readonly GroupFormResult[]>;
  /** Override section h2 — defaults to "Standings" (group hub). */
  sectionHeading?: string;
};

export default function GroupStandingsSection({
  groupId,
  formByTeamId,
  sectionHeading = "Standings",
}: GroupStandingsSectionProps) {
  const title = groupLabel(groupId);
  const fixtures = useEffectiveFixtures();
  const standings = useWc26GroupStandings(groupId);
  const groupComplete = useMemo(
    () => isGroupComplete(groupId, fixtures),
    [groupId, fixtures],
  );

  return (
    <section aria-labelledby="standings-heading">
      <h2 id="standings-heading" className={styles.sectionTitle}>
        {sectionHeading}
      </h2>
      <p className={styles.phaseNote}>
        {groupComplete
          ? "Group stage complete — final standings locked. Qualified teams advance to the Round of 32."
          : `Calculated from completed group matches. Top ${WC26_QUALIFYING_SPOTS} advance when the group is complete.`}
      </p>
      <StandingsTable
        standings={standings}
        title={`${title} table`}
        qualifyingSpots={WC26_QUALIFYING_SPOTS}
        formByTeamId={formByTeamId}
        groupComplete={groupComplete}
      />
    </section>
  );
}
