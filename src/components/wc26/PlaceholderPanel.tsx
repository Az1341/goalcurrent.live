import styles from "./wc26.module.css";

type PlaceholderPanelProps = {
  title: string;
  description: string;
};

export default function PlaceholderPanel({
  title,
  description,
}: PlaceholderPanelProps) {
  return (
    <section className={styles.placeholderPanel} aria-label={title}>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}
