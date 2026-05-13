import { useFrameStore } from "../../store/useFrameStore";
import styles from "./index.module.css";

interface SidebarLayoutProps {
  children?: React.ReactNode;
}

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const {
    titleBarColor,
    tilt,
    frameType,
    bgImage,
    customBg,
    bgBlur,
    bgSize,
    padding,
    handle,

    setTitleBarColor,
    setTilt,
    setFrameType,

    setBgImage,
    setCustomBg,
    setBgBlur,
    setBgSize,
    setPadding,
    setHandle,
  } = useFrameStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBgImage(url);
  };

  return (
    <div className={styles.root}>
      {/* Main canvas area */}
      <main className={styles.canvas}>{children}</main>

      {/* Pro sidebar */}
      <aside className={styles.proPanel}>
        <h3>PRO_CONTROLS</h3>

        <div className={styles.controlGroup}>
          <label>FRAME_TYPE</label>
          <select
            value={frameType}
            onChange={(e) =>
              setFrameType(e.target.value as "browser" | "terminal")
            }
          >
            <option value="browser">BROWSER</option>
            <option value="terminal">TERMINAL</option>
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label>TITLE_BAR_COLOR</label>
          <input
            type="color"
            value={titleBarColor}
            onChange={(e) => setTitleBarColor(e.target.value)}
          />
        </div>

        <div className={styles.controlGroup}>
          <label>CUSTOM_BG_COLOR / GRADIENT</label>
          <input
            type="text"
            placeholder="hex or linear-gradient..."
            value={customBg}
            onChange={(e) => setCustomBg(e.target.value)}
          />
        </div>

        <div className={styles.controlGroup}>
          <label>BG_IMAGE_UPLOAD</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {bgImage && (
            <button
              onClick={() => setBgImage(null)}
              className={styles.smallBtn}
            >
              REMOVE_IMAGE
            </button>
          )}
        </div>

        {bgImage && (
          <>
            <div className={styles.controlGroup}>
              <label>BG_BLUR: {bgBlur}px</label>
              <input
                type="range"
                min="0"
                max="40"
                value={bgBlur}
                onChange={(e) => setBgBlur(Number(e.target.value))}
              />
            </div>
            <div className={styles.controlGroup}>
              <label>BG_SIZE</label>
              <select
                value={bgSize}
                onChange={(e) =>
                  setBgSize(e.target.value as "cover" | "contain" | "auto")
                }
              >
                <option value="cover">COVER</option>
                <option value="contain">CONTAIN</option>
                <option value="auto">ORIGINAL</option>
              </select>
            </div>
          </>
        )}

        <div className={styles.controlGroup}>
          <label>CANVAS_PADDING: {padding}px</label>
          <input
            type="range"
            min="0"
            max="120"
            value={padding}
            onChange={(e) => setPadding(Number(e.target.value))}
          />
        </div>

        <div className={styles.controlGroup}>
          <label>3D_ISOMETRIC_TILT</label>
          <input
            type="checkbox"
            checked={tilt}
            onChange={(e) => setTilt(e.target.checked)}
          />
        </div>

        <div className={styles.controlGroup}>
          <label>SOCIAL_HANDLE</label>
          <input
            type="text"
            placeholder="@yourname"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
          />
        </div>
      </aside>
    </div>
  );
};
