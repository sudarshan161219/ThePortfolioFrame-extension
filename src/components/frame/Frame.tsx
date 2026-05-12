import styles from "./index.module.css";

interface FrameProps {
  imageSrc: string;
  url?: string;
  frameType?: "browser" | "terminal";
  customPath?: string;
  tiltEnabled?: boolean;
  titleBarColor?: string;
}

export const Frame = ({
  imageSrc,
  url = "localhost:5173",
  frameType = "browser",
  customPath = "~/dev/portfolio",
  tiltEnabled = false,
  titleBarColor = "#fdfdfb",
}: FrameProps) => {
  const cleanUrl = url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];

  return (
    <div
      className={`${styles.macWindow} ${tiltEnabled ? styles.tiltMode : ""}`}
    >
      {/* The macOS Title Bar */}
      <div
        className={styles.titleBar}
        style={{ backgroundColor: titleBarColor }}
      >
        <div className={styles.trafficLights}>
          <span className={`${styles.dot} ${styles.close}`}></span>
          <span className={`${styles.dot} ${styles.minimize}`}></span>
          <span className={`${styles.dot} ${styles.maximize}`}></span>
        </div>
        {/*  A mock URL bar to complete the browser look */}
        <div className={styles.headerContent}>
          {frameType === "browser" ? (
            <div className={styles.urlBar}>
              <span>{cleanUrl}</span>
            </div>
          ) : (
            <div className={styles.terminalPath}>
              <span>{customPath}</span>
            </div>
          )}
        </div>
      </div>

      {/* The Screenshot Container */}
      <div className={styles.windowContent}>
        <img src={imageSrc} alt="Captured tab" className={styles.screenshot} />
      </div>
    </div>
  );
};
