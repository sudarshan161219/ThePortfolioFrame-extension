import { StarIcon, DownloadIcon } from "lucide-react";
import { useNavActionsStore } from "../../store/useNavActionsStore";
import styles from "./index.module.css";
import { useState } from "react";
import { useControlsStore } from "../../store/useControlsStore";
import { useThemeStore } from "../../store/useThemeStore";

export const Nav = () => {
  const { isExporting, triggerExport } = useNavActionsStore();
  const { theme, toggleTheme } = useThemeStore();
  const { isPro } = useControlsStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className={styles.header}>
      {isSettingsOpen && ""}
      <button onClick={toggleTheme} className={styles.iconBtn}>
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
      {/* <div className={styles.logo}>
        <div
          className={`${styles.logoDot} ${isPro ? styles.logoDotActive : ""}`}
        />
        <div>
          <span className={styles.logoText}>The Portfolio Frame</span>
          <span className={styles.logoVersion}>v1.0.0</span>
        </div>
      </div> */}

      <div className={styles.headerControls}>
        {!isPro ? (
          <button
            className={styles.upgradeBtn}
            onClick={() => setIsSettingsOpen(true)}
          >
            <StarIcon />
            Upgrade to Pro
          </button>
        ) : (
          <span className={styles.proBadge}>
            <span className={styles.proDot} />
            Pro Active
          </span>
        )}

        <div className={styles.sep} />

        <button
          className={`${styles.exportBtn} ${isExporting ? styles.exporting : ""}`}
          onClick={triggerExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <span className={styles.spinner} />
              Processing...
            </>
          ) : (
            <>
              <DownloadIcon />
              Export PNG
            </>
          )}
        </button>
      </div>
    </header>
  );
};
