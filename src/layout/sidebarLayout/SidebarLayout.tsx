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
import { SOLID_COLORS, GRADIENTS } from "../../constants/palettes";

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
    tiltZ,
    zoom,
    aspectRatio,
    browserMockup,
    borderRadius,
    shadowVariant,
    shadowOpacity,
    borderWidth,
    borderColor,
    isGlassBorder,
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
    setTiltZ,
    setAspectRatio,
    setZoom,
    setBrowserMockup,
    setBorderRadius,
    setShadowVariant,
    setShadowOpacity,
    setBorderWidth,
    setBorderColor,
    setIsGlassBorder,
  } = useControlsStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBgImage(url);
    setCustomBg(""); // Clear colors if image is uploaded
    setActiveBg(null);
  };

  const handleBgSelect = (bg: (typeof BACKGROUNDS)[0]) => {
    if (bg.isPro && !isPro) {
      console.log("Upsell triggered");
    } else {
      setActiveBg(bg);
      setBgImage(null);
      setCustomBg("");
    }
  };

  const handleColorSelect = (colorOrGradient: string) => {
    setCustomBg(colorOrGradient);
    setBgImage(null);
    setActiveBg(null);
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
            SECTION 1: CANVAS & LAYOUT 
        ========================================== */}
        <div className={styles.sectionHeader}>Canvas & Layout</div>

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
          <label htmlFor="zoomSlider">ZOOM: {zoom}x</label>
          <input
            id="zoomSlider"
            type="range"
            min={0.1}
            max={2}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>

        <div className={styles.controlGroup}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <label htmlFor="tiltToggle">3D_TRANSFORM</label>
            <label className={styles.switchLabel} style={{ marginTop: 0 }}>
              <input
                id="tiltToggle"
                type="checkbox"
                checked={tilt}
                onChange={(e) => setTilt(e.target.checked)}
                className={styles.toggleSwitch}
              />
            </label>
          </div>

          {tilt && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                background: "rgba(0,0,0,0.02)",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              <div>
                <label
                  htmlFor="tiltX"
                  style={{
                    fontSize: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>TILT_X (Up/Down)</span> <span>{tiltX}°</span>
                </label>
                <input
                  id="tiltX"
                  type="range"
                  min={-60}
                  max={60}
                  step={1}
                  value={tiltX}
                  onChange={(e) => setTiltX(Number(e.target.value))}
                />
              </div>
              <div>
                <label
                  htmlFor="tiltY"
                  style={{
                    fontSize: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>TILT_Y (Left/Right)</span> <span>{tiltY}°</span>
                </label>
                <input
                  id="tiltY"
                  type="range"
                  min={-60}
                  max={60}
                  step={1}
                  value={tiltY}
                  onChange={(e) => setTiltY(Number(e.target.value))}
                />
              </div>
              <div>
                <label
                  htmlFor="tiltZ"
                  style={{
                    fontSize: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>ROTATION (Spin)</span> <span>{tiltZ}°</span>
                </label>
                <input
                  id="tiltZ"
                  type="range"
                  min={-180}
                  max={180}
                  step={1}
                  value={tiltZ}
                  onChange={(e) => setTiltZ(Number(e.target.value))}
                />
              </div>
              <button
                onClick={() => {
                  setTiltX(0);
                  setTiltY(0);
                  setTiltZ(0);
                }}
                className={styles.smallBtn}
                style={{ marginTop: "4px" }}
              >
                Reset Angles
              </button>
            </div>
          )}
        </div>

        {/* ==========================================
            SECTION 2: BROWSER MOCKUP 
        ========================================== */}
        <div className={styles.sectionHeader}>Browser Mockup</div>

        <div className={styles.controlGroup}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label htmlFor="showMockupToggle">SHOW_BROWSER_FRAME</label>
            <label className={styles.switchLabel} style={{ marginTop: 0 }}>
              <input
                id="showMockupToggle"
                type="checkbox"
                checked={showBrowserFrame}
                onChange={(e) => setBrowserFrame(e.target.checked)}
                className={styles.toggleSwitch}
              />
            </label>
          </div>
        </div>

        {showBrowserFrame && (
          <>
            <div className={styles.controlGroup}>
              <label htmlFor="mockupSelect">CHOOSE_MOCKUP</label>
              <select
                id="mockupSelect"
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

        {/* ==========================================
            SECTION 3: FRAME STYLES 
        ========================================== */}
        <div className={styles.sectionHeader}>Frame Styles</div>

        <div className={styles.controlGroup}>
          <label htmlFor="borderRadius">BORDER_RADIUS: {borderRadius}px</label>
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
          <input
            id="shadowOpacity"
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={shadowOpacity}
            onChange={(e) => setShadowOpacity(Number(e.target.value))}
            style={{ marginBottom: "12px" }}
            disabled={shadowVariant === 0}
          />
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

        <div className={styles.controlGroup}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <label htmlFor="borderWidth">BORDER_WIDTH: {borderWidth}px</label>
            <label className={styles.switchLabel} style={{ marginTop: 0 }}>
              <span style={{ fontSize: "10px" }}>GLASS_EFFECT</span>
              <input
                id="glassToggle"
                type="checkbox"
                checked={isGlassBorder}
                onChange={(e) => setIsGlassBorder(e.target.checked)}
                className={styles.toggleSwitch}
              />
            </label>
          </div>
          <input
            id="borderWidth"
            type="range"
            min={0}
            max={20}
            step={1}
            value={borderWidth}
            onChange={(e) => setBorderWidth(Number(e.target.value))}
            style={{ marginBottom: "12px" }}
          />

          <label htmlFor="borderColorInput">BORDER_COLOR</label>
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <button
              onClick={() => setBorderColor("rgba(255, 255, 255, 0.2)")}
              className={styles.smallBtn}
              style={{ flex: 1, background: "rgba(255, 255, 255, 0.1)" }}
            >
              Light
            </button>
            <button
              onClick={() => setBorderColor("rgba(0, 0, 0, 0.2)")}
              className={styles.smallBtn}
              style={{ flex: 1, background: "rgba(0, 0, 0, 0.2)" }}
            >
              Dark
            </button>
            <button
              onClick={() => setBorderColor("#6366F1")}
              className={styles.smallBtn}
              style={{ flex: 1, background: "#6366F1", color: "#fff" }}
            >
              Accent
            </button>
          </div>
          <input
            id="borderColorInput"
            type="text"
            placeholder="rgba() or #hex..."
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
          />
        </div>

        {/* ==========================================
            SECTION 4: BACKGROUNDS 
        ========================================== */}
        <div className={styles.sectionHeader}>Backgrounds</div>

        <div className={styles.controlGroup}>
          <label>SOLID_COLORS</label>
          <div className={styles.colorGrid}>
            <button
              onClick={() => handleColorSelect("transparent")}
              className={`${styles.colorSwatch} ${customBg === "transparent" && !bgImage ? styles.activeSwatch : ""}`}
              style={{
                backgroundImage:
                  "conic-gradient(#e5e7eb 25%, white 25%, white 50%, #e5e7eb 50%, #e5e7eb 75%, white 75%, white 100%)",
                backgroundSize: "8px 8px",
              }}
              title="Transparent"
            />
            {SOLID_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`${styles.colorSwatch} ${customBg === color && !bgImage ? styles.activeSwatch : ""}`}
                style={{ background: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label>ABSTRACT_GRADIENTS</label>
          <div className={styles.colorGrid}>
            {GRADIENTS.map((gradient, index) => (
              <button
                key={index}
                onClick={() => handleColorSelect(gradient)}
                className={`${styles.colorSwatch} ${customBg === gradient && !bgImage ? styles.activeSwatch : ""}`}
                style={{ background: gradient }}
              />
            ))}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label>PREMIUM_SCENES</label>
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
          <label htmlFor="customBgInput">CUSTOM_HEX_OR_CSS</label>
          <input
            id="customBgInput"
            type="text"
            placeholder="hex or linear-gradient..."
            value={customBg}
            onChange={(e) => handleColorSelect(e.target.value)}
          />
        </div>

        <div className={styles.controlGroup}>
          <label htmlFor="bgImageUpload">CUSTOM_IMAGE_UPLOAD</label>
          <input
            id="bgImageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {bgImage && (
            <button
              onClick={() => setBgImage(null)}
              className={styles.smallBtn}
              style={{ marginTop: "8px" }}
            >
              REMOVE_IMAGE
            </button>
          )}
        </div>

        {bgImage && (
          <>
            <div className={styles.controlGroup}>
              <label htmlFor="bgBlurSlider">BG_BLUR: {bgBlur}px</label>
              <input
                id="bgBlurSlider"
                type="range"
                min="0"
                max="40"
                value={bgBlur}
                onChange={(e) => setBgBlur(Number(e.target.value))}
              />
            </div>
            <div className={styles.controlGroup}>
              <label htmlFor="bgSizeSelect">BG_SIZE</label>
              <select
                id="bgSizeSelect"
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
            SECTION 5: EFFECTS & WATERMARK 
        ========================================== */}
        <div className={styles.sectionHeader}>Watermark</div>

        <div className={styles.controlGroup}>
          <label htmlFor="socialHandle">SOCIAL_HANDLE</label>
          <input
            id="socialHandle"
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
