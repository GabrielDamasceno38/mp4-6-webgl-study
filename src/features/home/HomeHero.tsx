import Link from "next/link";
import { siteContent } from "@/content/siteContent";
import { HomeCarScene } from "./HomeCarScene";
import styles from "./Home.module.css";

export function HomeHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <p className={styles.kicker}>{siteContent.kicker}</p>
        <h1>{siteContent.title}</h1>
        <p className={styles.subtitle}>{siteContent.subtitle}</p>
        <p className={styles.description}>{siteContent.description}</p>

        <div className={styles.actions}>
          <Link className={`${styles.button} ${styles.primary}`} href="/drive">
            Drive
          </Link>
          <Link className={styles.button} href="/studio">
            Studio
          </Link>
        </div>
      </div>

      <HomeCarScene />
    </section>
  );
}
