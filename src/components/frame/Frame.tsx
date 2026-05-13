import { useControllsStore } from "../../store/useControllsStore";
import styles from "./index.module.css";

export const Frame = () => {
  const { titleBarColor, tilt, frameType, pageUrl, imageSource } =
    useControllsStore();

  const cleanUrl = pageUrl
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];

  const customPath = "skibidi";

  return (
    <div className={`${styles.macWindow} ${tilt ? styles.tiltMode : ""}`}>
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
        <img
          src={imageSource!}
          alt="Captured tab"
          className={styles.screenshot}
        />
      </div>
    </div>
  );
};
