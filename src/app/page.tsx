import { SiteHeader } from "@/components/navigation/SiteHeader";
import { siteContent } from "@/content/siteContent";
import { HistorySection } from "@/features/home/HistorySection";
import { HomeHero } from "@/features/home/HomeHero";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <SiteHeader />
      <HomeHero />
      <HistorySection />
      <footer className={styles.footer}>{siteContent.footer}</footer>
    </main>
  );
}
