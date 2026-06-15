import { WC26_TEAMS, WC26_TEAM_COUNT } from "@/data/wc26";
import TeamCard from "./TeamCard";
import styles from "./wc26.module.css";

export default function TeamsSection() {
  return (
    <section aria-labelledby="teams-section-heading">
      <h2 id="teams-section-heading" className={styles.sectionTitle}>
        Qualified nations
      </h2>

      <p className={styles.phaseNote}>
        {WC26_TEAM_COUNT} teams from local data — placeholder names until official
        squads are loaded.
      </p>

      <div className={styles.tileGrid}>
        {WC26_TEAMS.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </section>
  );
}
