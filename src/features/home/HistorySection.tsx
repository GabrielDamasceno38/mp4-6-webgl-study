import { siteContent } from "@/content/siteContent";
import styles from "./Home.module.css";

export function HistorySection() {
  return (
    <section className={styles.history} aria-label="Car and driver history">
      {siteContent.history.map((item) => (
        <article key={item.number}>
          <p className={styles.historyNumber}>{item.number}</p>
          <h2>{item.title}</h2>
          <p>{item.text}</p>
        </article>
      ))}
    </section>
  );
}
