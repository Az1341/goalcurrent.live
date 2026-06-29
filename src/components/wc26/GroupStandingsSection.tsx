"use client";

import StandingsTable from "@/components/wc26/StandingsTable";
import { groupLabel, type Wc26GroupId } from "@/data/wc26";
import { getWc26FinalQualificationMap } from "@/lib/wc26-final-standings";
import { useWc26GroupStandings } from "@/lib/use-wc26-standings";
import type { GroupFormResult } from "@/lib/wc26-group-hub";
import type { TeamId } from "@/types/team";
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
  const standings = useWc26GroupStandings(groupId);

  return (
    <section aria-labelledby="standings-heading">
      <h2 id="standings-heading" className={styles.sectionTitle}>
        {sectionHeading}
      </h2>
      <p className={styles.phaseNote}>
        Group stage complete — final standings locked. Qualified teams advance to
        the Round of 32.
      </p>
      <StandingsTable
        standings={standings}
        title={`${title} table`}
        formByTeamId={formByTeamId}
        groupComplete
        qualificationByTeamId={getWc26FinalQualificationMap(groupId)}
      />
    </section>
  );
}
