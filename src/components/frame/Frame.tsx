import styles from "./index.module.css";

interface FrameProps {
  imageSrc: string;
  url?: string;
}

export const Frame = ({ imageSrc, url = "localhost:5173" }: FrameProps) => {
  const cleanUrl = url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];

  return (
    <div className={styles.macWindow}>
      {/* The macOS Title Bar */}
      <div className={styles.titleBar}>
        <div className={styles.trafficLights}>
          <span className={`${styles.dot} ${styles.close}`}></span>
          <span className={`${styles.dot} ${styles.minimize}`}></span>
          <span className={`${styles.dot} ${styles.maximize}`}></span>
        </div>
        {/* Optional: A mock URL bar to complete the browser look */}
        <div className={styles.urlBar}>
          <span>{cleanUrl}</span>
        </div>
      </div>

      {/* The Screenshot Container */}
      <div className={styles.windowContent}>
        <img src={imageSrc} alt="Captured tab" className={styles.screenshot} />
      </div>
    </div>
  );
};
