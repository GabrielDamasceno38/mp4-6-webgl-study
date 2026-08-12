import Link from "next/link";
import styles from "./ExperienceOverlay.module.css";

type ExperienceOverlayProps = {
  help: string;
};

export function ExperienceOverlay({ help }: ExperienceOverlayProps) {
  return (
    <>
      <Link className={styles.back} href="/">
        ← Menu
      </Link>
      <p className={styles.help}>{help}</p>
    </>
  );
}
