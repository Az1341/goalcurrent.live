import styles from "./bracket.module.css";

const SKELETON_COUNTS = [8, 8, 4, 2, 2] as const;

export default function BracketSkeleton() {
  return (
    <div className={styles.skeletonGrid} aria-hidden="true">
      {SKELETON_COUNTS.map((count, columnIndex) => (
        <div key={columnIndex} className={styles.skeletonColumn}>
          <div className={styles.skeletonLabel} />
          {Array.from({ length: count }, (_, cardIndex) => (
            <div key={cardIndex} className={styles.skeletonCard} />
          ))}
        </div>
      ))}
    </div>
  );
}
