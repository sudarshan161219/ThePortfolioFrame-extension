import { Nav } from "../../components/nav/Nav";
import {
  useControlsStore,
  type AspectRatio,
  type BrowserMockup,
} from "../../store/useControlsStore";
import { ratios } from "../../constants/ratios";
import { BACKGROUNDS } from "../../constants/backgrounds";
import { BROWSER_MOCKUPS } from "../../constants/browser_mockups";
import { RADIUS_PRESETS } from "../../constants/radius_presets";
import { SHADOW_PRESETS } from "../../constants/shadow_presets";

import styles from "./index.module.css";

interface SidebarLayoutProps {
  children?: React.ReactNode;
}

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const {
    isPro,
    tilt,
    showBrowserFrame,
    pageUrl,
    pageTitle,
    bgImage,
    customBg,
    bgBlur,
    bgSize,
    handle,
    activeBg,
    tiltX,
    tiltY,
    zoom,
    aspectRatio,
    browserMockup,
    borderRadius,
    shadowVariant,
    shadowOpacity,
    setTilt,
    setBrowserFrame,
    setBgImage,
    setCustomBg,
    setBgBlur,
    setBgSize,
    setHandle,
    setPageUrl,
    setPageTitle,
    setActiveBg,
    setTiltX,
    setTiltY,
    setAspectRatio,
    setZoom,
    setBrowserMockup,
    setBorderRadius,
    setShadowVariant,
    setShadowOpacity,
  } = useControlsStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBgImage(url);
  };

  const handleBgSelect = (bg: (typeof BACKGROUNDS)[0]) => {
    if (bg.isPro && !isPro) {
      // Trigger the upsell if they aren't pro
      console.log("Upsell triggered");
    } else {
      setActiveBg(bg);
      // THE FIX: Clear custom values so the preset can take priority!
      setBgImage(null);
      setCustomBg("");
    }
  };

  return (
    <div className={styles.root}>
      <aside className={styles.proPanel}>
        {/* --- HEADER --- */}
        <div className={styles.logo}>
          <div
            className={`${styles.logoDot} ${isPro ? styles.logoDotActive : ""}`}
          />
          <div>
            <span className={styles.logoText}>The Portfolio Frame</span>
            <span className={styles.logoVersion}>v1.0.0</span>
          </div>
        </div>

        {/* ==========================================
            SECTION 1: FRAME SETTINGS 
        ========================================== */}

        <div className={styles.controlGroup}>
          <label className={styles.switchLabel}>
            <span>SHOW_BROWSER_MOCKUP</span>
            <input
              type="checkbox"
              checked={showBrowserFrame}
              onChange={(e) => setBrowserFrame(e.target.checked)}
              className={styles.toggleSwitch}
            />
          </label>
        </div>

        {/* ONLY show OS settings if the browser mockup is enabled */}
        {showBrowserFrame && (
          <>
            <div className={styles.controlGroup}>
              <label htmlFor="CHOOSE_MOCKUP">CHOOSE_MOCKUP</label>
              <select
                id="CHOOSE_MOCKUP"
                className={styles.select}
                value={browserMockup}
                onChange={(e) =>
                  setBrowserMockup(e.target.value as BrowserMockup)
                }
              >
                {BROWSER_MOCKUPS.map((mockup) => (
                  <option key={mockup.id} value={mockup.id}>
                    {mockup.label} - {mockup.os}
                  </option>
                ))}
              </select>
            </div>

            {/* NEW: Custom Text Inputs */}
            <div className={styles.controlGroup}>
              <label htmlFor="pageUrl">BROWSER_URL</label>
              <input
                id="pageUrl"
                type="text"
                placeholder="e.g., yourdomain.com"
                value={pageUrl}
                onChange={(e) => setPageUrl(e.target.value)}
              />
            </div>

            <div className={styles.controlGroup}>
              <label htmlFor="pageTitle">TAB_TITLE</label>
              <input
                id="pageTitle"
                type="text"
                placeholder="Leave blank to auto-generate..."
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
              />
            </div>
          </>
        )}

        <div className={styles.controlGroup}>
          <label htmlFor="borderRadius">BORDER_RADIUS: {borderRadius}px</label>

          {/* The precise slider */}
          <input
            id="borderRadius"
            type="range"
            min={0}
            max={40}
            step={1}
            value={borderRadius}
            onChange={(e) => setBorderRadius(Number(e.target.value))}
            style={{ marginBottom: "12px" }}
          />

          {/* The 4 quick-preset buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "8px",
            }}
          >
            {RADIUS_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setBorderRadius(preset.value)}
                className={`${styles.ratioBtn} ${borderRadius === preset.value ? styles.active : ""}`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label htmlFor="shadowOpacity">
            SHADOW_OPACITY: {Math.round(shadowOpacity * 100)}%
          </label>

          {/* The Opacity Slider */}
          <input
            id="shadowOpacity"
            type="range"
            min={0}
            max={1}
            step={0.02} // Fine-grain control
            value={shadowOpacity}
            onChange={(e) => setShadowOpacity(Number(e.target.value))}
            style={{ marginBottom: "12px" }}
            disabled={shadowVariant === 0} // Disable slider if "None" is selected
          />

          {/* The 6 Preset Buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
            }}
          >
            {SHADOW_PRESETS.map((preset, index) => (
              <button
                key={preset.label}
                onClick={() => setShadowVariant(index)}
                className={`${styles.ratioBtn} ${shadowVariant === index ? styles.active : ""}`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* ==========================================
            SECTION 2: CANVAS & LAYOUT 
        ========================================== */}

        <div className={styles.controlGroup}>
          <label>ASPECT_RATIO</label>
          <div className={styles.ratioGrid}>
            {ratios.map((ratio) => {
              const isPortrait = (ratio.height ?? 0) > (ratio.width ?? 0);
              const isSquare = ratio.width === ratio.height;

              return (
                <button
                  key={ratio.value}
                  onClick={() => setAspectRatio(ratio.value as AspectRatio)}
                  className={`${styles.ratioBtn} ${aspectRatio === ratio.value ? styles.active : ""}`}
                  style={
                    {
                      "--ratio":
                        ratio.width && ratio.height
                          ? `${ratio.width} / ${ratio.height}`
                          : "1 / 1",
                      "--preview-w": isPortrait ? "14px" : "20px",
                      "--preview-h": isPortrait && !isSquare ? "20px" : "14px",
                    } as React.CSSProperties
                  }
                >
                  <div className={styles.ratioShape} />
                  <span className={styles.ratioLabel}>{ratio.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label htmlFor="zoom">ZOOM: {zoom}x</label>
          <input
            id="zoom"
            type="range"
            min={0.1}
            max={2}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>

        {/* ==========================================
            SECTION 3: BACKGROUNDS 
        ========================================== */}

        <div className={styles.controlGroup}>
          <label>PRESET_BACKGROUNDS</label>
          <div className={styles.sidebarBgGrid}>
            {BACKGROUNDS.map((bg) => {
              const isLocked = bg.isPro && !isPro;
              const isActive = activeBg?.id === bg.id;
              return (
                <div key={bg.id} className={styles.swatchGroup}>
                  <button
                    onClick={() => !isLocked && handleBgSelect(bg)}
                    className={`${styles.swatch} ${styles[bg.bgKey as keyof typeof styles]} ${isActive ? styles.active : ""} ${isLocked ? styles.locked : ""}`}
                    disabled={isLocked}
                  >
                    {isLocked && <div className={styles.lockOverlay}>🔒</div>}
                  </button>
                  <div className={styles.swatchMeta}>
                    <span className={styles.swatchName}>
                      {bg.name.split(" ")[0]}
                    </span>
                    <span
                      className={bg.isPro ? styles.proPill : styles.freePill}
                    >
                      {bg.isPro ? "Pro" : "Free"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
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
              <label htmlFor="BG_SIZE">BG_SIZE</label>
              <select
                id="BG_SIZE"
                className={styles.select}
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

        {/* ==========================================
            SECTION 4: EFFECTS & WATERMARK 
        ========================================== */}

        <div className={styles.controlGroup}>
          <label className={styles.switchLabel}>
            <span>3D_ISOMETRIC_TILT</span>
            <input
              type="checkbox"
              checked={tilt}
              onChange={(e) => setTilt(e.target.checked)}
              className={styles.toggleSwitch}
            />
          </label>

          {/* ONLY show the sliders if the checkbox is turned on! */}
          {tilt && (
            <div className={styles.subSliders}>
              <div className={styles.sliderRow}>
                <span>X-Axis</span>
                <input
                  type="range"
                  min={-20}
                  max={20}
                  value={tiltX}
                  onChange={(e) => setTiltX(Number(e.target.value))}
                />
              </div>
              <div className={styles.sliderRow}>
                <span>Y-Axis</span>
                <input
                  type="range"
                  min={-20}
                  max={20}
                  value={tiltY}
                  onChange={(e) => setTiltY(Number(e.target.value))}
                />
              </div>
            </div>
          )}
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

      {/* Main canvas area */}
      <main className={styles.main}>
        <Nav />
        <div className={styles.canvas}>{children}</div>
      </main>
    </div>
  );
};
