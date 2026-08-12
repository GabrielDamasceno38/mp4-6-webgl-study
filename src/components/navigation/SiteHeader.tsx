import Link from "next/link";
import { siteContent } from "@/content/siteContent";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/" aria-label="Home">
        {siteContent.brand}
      </Link>

      <nav className={styles.navigation} aria-label="Primary navigation">
        <Link href="/drive">Drive</Link>
        <Link href="/studio">Studio</Link>
      </nav>
    </header>
  );
}
