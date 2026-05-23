import { useState } from "react";
import { Nav } from "../../components/nav/Nav";
import {
  useControlsStore,
  type AspectRatio,
  type BrowserMockup,
  type DeviceMockup,
} from "../../store/useControlsStore";
import { ratios } from "../../constants/ratios";
import { BACKGROUNDS } from "../../constants/backgrounds";
import { BROWSER_MOCKUPS } from "../../constants/browser_mockup_config";
import { DEVICE_MOCKUPS } from "../../constants/Device_mockup_config";
import { RADIUS_PRESETS } from "../../constants/radius_presets";
import { SHADOW_PRESETS } from "../../constants/shadow_presets";
import { SOLID_COLORS, GRADIENTS } from "../../constants/palettes";
import styles from "./index.module.css";

interface SidebarLayoutProps {
  children?: React.ReactNode;
}

/** Thin collapsible section wrapper */
function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.section}>
      <button
        className={styles.sectionToggle}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className={styles.sectionTitle}>{title}</span>
        <span
          className={`${styles.sectionChevron} ${open ? styles.sectionChevronOpen : ""}`}
        >
          ▾
        </span>
      </button>
      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  );
}

/** Labelled control row */
function ControlRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string | number;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.controlRow}>
      <span className={styles.eyebrow}>
        {label}
        {value !== undefined && (
          <span className={styles.eyebrowVal}>{value}</span>
        )}
      </span>
      {children}
    </div>
  );
}

/** Toggle row — label left, switch right */
function ToggleRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className={`${styles.controlRow}`}>
      <div className={styles.toggleRow}>
        <label htmlFor={id} className={styles.toggleLabel}>
          {label}
        </label>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className={styles.switch}
        />
      </div>
    </div>
  );
}

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const {
    isPro,
    tilt,
    showBrowserFrame,
    showDeviceFrame,
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
    deviceMockup,
    borderRadius,
    shadowVariant,
    shadowOpacity,
    borderWidth,
    borderColor,
    isGlassBorder,

    setTilt,
    setBrowserFrame,
    setDeviceFrame,
    setMockupCategory,
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
    setDeviceMockup,
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
    setBgImage(URL.createObjectURL(file));
    setCustomBg("");
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
      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className={styles.sidebar}>
        {/* Header */}
        <div className={styles.logoBar}>
          <div className={styles.logoLeft}>
            <div
              className={`${styles.logoDot} ${isPro ? styles.logoDotActive : ""}`}
            />
            <div>
              <div className={styles.logoName}>Portfolio Frame</div>
              <div className={styles.logoVersion}>v1.0.0</div>
            </div>
          </div>
          {isPro && <span className={styles.proBadge}>Pro</span>}
        </div>

        {/* Scrollable controls */}
        <div className={styles.sidebarBody}>
          {/* ── 1. Canvas & Layout ──────────────────── */}
          <Section title="Canvas & Layout">
            {/* Aspect ratio */}
            <ControlRow label="Aspect Ratio">
              <div className={styles.btnGrid3}>
                {ratios.map((ratio) => {
                  const isPortrait = (ratio.height ?? 0) > (ratio.width ?? 0);
                  const isSquare = ratio.width === ratio.height;
                  return (
                    <button
                      key={ratio.value}
                      onClick={() => setAspectRatio(ratio.value as AspectRatio)}
                      className={`${styles.presetBtn} ${aspectRatio === ratio.value ? styles.active : ""}`}
                      style={
                        {
                          "--preview-w": isPortrait ? "13px" : "18px",
                          "--preview-h":
                            isPortrait && !isSquare ? "18px" : "13px",
                        } as React.CSSProperties
                      }
                    >
                      <div className={styles.ratioShape} />
                      {ratio.label}
                    </button>
                  );
                })}
              </div>
            </ControlRow>

            {/* Zoom */}
            <ControlRow label="Zoom" value={`${zoom}×`}>
              <input
                type="range"
                min={0.1}
                max={2}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className={styles.slider}
              />
            </ControlRow>

            {/* 3D Transform */}
            <ToggleRow
              id="tiltToggle"
              label="3D Transform"
              checked={tilt}
              onChange={setTilt}
            />

            {tilt && (
              <div className={styles.controlRow}>
                <div className={styles.subPanel}>
                  <div className={styles.subRow}>
                    <span className={styles.eyebrow}>
                      Tilt X <span className={styles.eyebrowVal}>{tiltX}°</span>
                    </span>
                    <input
                      type="range"
                      min={-60}
                      max={60}
                      step={1}
                      value={tiltX}
                      onChange={(e) => setTiltX(Number(e.target.value))}
                      className={styles.slider}
                    />
                  </div>
                  <div className={styles.subRow}>
                    <span className={styles.eyebrow}>
                      Tilt Y <span className={styles.eyebrowVal}>{tiltY}°</span>
                    </span>
                    <input
                      type="range"
                      min={-60}
                      max={60}
                      step={1}
                      value={tiltY}
                      onChange={(e) => setTiltY(Number(e.target.value))}
                      className={styles.slider}
                    />
                  </div>
                  <div className={styles.subRow}>
                    <span className={styles.eyebrow}>
                      Spin <span className={styles.eyebrowVal}>{tiltZ}°</span>
                    </span>
                    <input
                      type="range"
                      min={-180}
                      max={180}
                      step={1}
                      value={tiltZ}
                      onChange={(e) => setTiltZ(Number(e.target.value))}
                      className={styles.slider}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setTiltX(0);
                      setTiltY(0);
                      setTiltZ(0);
                    }}
                    className={styles.resetBtn}
                  >
                    Reset angles
                  </button>
                </div>
              </div>
            )}
          </Section>

          {/* <Section title="VIDEO ANIMATIONS" defaultOpen={true}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px",
              }}
            >
              {ANIMATION_PRESETS.map((preset) => {
                const isLocked = preset.isPro && !isPro;
                const isActive = animation === preset.id;

                return (
                  <button
                    key={preset.id}
                    onClick={() => handleAnimationSelect(preset)}
                    className={`${styles.ratioBtn} ${isActive ? styles.active : ""}`}
                    style={{ position: "relative", padding: "12px 8px" }}
                  >
                    {preset.label}
                    {isLocked && (
                      <span
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          fontSize: "10px",
                        }}
                      >
                        🔒
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Section> */}

          {/* ── 2. Browser Mockup ───────────────────── */}
          <Section title="Browser Mockup" defaultOpen={false}>
            <ToggleRow
              id="showBrowserToggle" // ✅ FIX: Unique ID
              label="Show Browser Frame"
              checked={showBrowserFrame}
              onChange={(checked) => {
                setBrowserFrame(checked);
                if (checked) {
                  setDeviceFrame(false);
                  setMockupCategory("browser"); // ✅ Syncs with Frame.tsx
                } else {
                  setMockupCategory("none"); // ✅ Resets to plain image
                }
              }}
            />

            {showBrowserFrame && (
              <>
                <ControlRow label="Mockup Style">
                  <select
                    className={styles.select}
                    value={browserMockup}
                    onChange={
                      (e) => setBrowserMockup(e.target.value as BrowserMockup) // Removed 'as BrowserMockup' if store expects string
                    }
                  >
                    {BROWSER_MOCKUPS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label} — {m.os}
                      </option>
                    ))}
                  </select>
                </ControlRow>

                <ControlRow label="Browser URL">
                  <input
                    type="text"
                    placeholder="yourdomain.com"
                    value={pageUrl}
                    onChange={(e) => setPageUrl(e.target.value)}
                    className={styles.input}
                  />
                </ControlRow>

                <ControlRow label="Tab Title">
                  <input
                    type="text"
                    placeholder="Leave blank to auto-generate…"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    className={styles.input}
                  />
                </ControlRow>
              </>
            )}
          </Section>

          {/* ── 3. Device Mockup ───────────────────── */}
          <Section title="Device Mockup" defaultOpen={false}>
            <ToggleRow
              id="showDeviceToggle" // ✅ FIX: Unique ID
              label="Show Device Frame"
              checked={showDeviceFrame}
              onChange={(checked) => {
                setDeviceFrame(checked);
                if (checked) {
                  setBrowserFrame(false);
                  setMockupCategory("device"); // ✅ Syncs with Frame.tsx
                } else {
                  setMockupCategory("none"); // ✅ Resets to plain image
                }
              }}
            />

            {showDeviceFrame && (
              <>
                <ControlRow label="Mockup Style">
                  <select
                    className={styles.select}
                    value={deviceMockup}
                    onChange={
                      (e) => setDeviceMockup(e.target.value as DeviceMockup) // Removed 'as DeviceMockup' if store expects string
                    }
                  >
                    {DEVICE_MOCKUPS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </ControlRow>
              </>
            )}
          </Section>

          {/* ── 3. Frame Styles ─────────────────────── */}
          <Section title="Frame Styles" defaultOpen={false}>
            {/* Border radius */}
            <ControlRow label="Border Radius" value={`${borderRadius}px`}>
              <input
                type="range"
                min={0}
                max={40}
                step={1}
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.btnGrid4}>
                {RADIUS_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setBorderRadius(preset.value)}
                    className={`${styles.presetBtn} ${borderRadius === preset.value ? styles.active : ""}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </ControlRow>

            {/* Shadow */}
            <ControlRow
              label="Shadow Opacity"
              value={`${Math.round(shadowOpacity * 100)}%`}
            >
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={shadowOpacity}
                onChange={(e) => setShadowOpacity(Number(e.target.value))}
                className={styles.slider}
                disabled={shadowVariant === 0}
              />
              <div className={styles.btnGrid3}>
                {SHADOW_PRESETS.map((preset, index) => (
                  <button
                    key={preset.label}
                    onClick={() => setShadowVariant(index)}
                    className={`${styles.presetBtn} ${shadowVariant === index ? styles.active : ""}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </ControlRow>

            {/* Border */}
            <ControlRow label="Border Width" value={`${borderWidth}px`}>
              <input
                type="range"
                min={0}
                max={20}
                step={1}
                value={borderWidth}
                onChange={(e) => setBorderWidth(Number(e.target.value))}
                className={styles.slider}
              />
            </ControlRow>

            <div className={styles.controlRow}>
              <div className={styles.toggleRow}>
                <label htmlFor="glassToggle" className={styles.toggleLabel}>
                  Glass Effect
                </label>
                <input
                  id="glassToggle"
                  type="checkbox"
                  checked={isGlassBorder}
                  onChange={(e) => setIsGlassBorder(e.target.checked)}
                  className={styles.switch}
                />
              </div>
            </div>

            <ControlRow label="Border Color">
              <div className={styles.btnRow}>
                <button
                  onClick={() => setBorderColor("rgba(255,255,255,0.2)")}
                  className={styles.ghostBtn}
                  style={{ background: "rgba(255,255,255,0.07)" }}
                >
                  Light
                </button>
                <button
                  onClick={() => setBorderColor("rgba(0,0,0,0.2)")}
                  className={styles.ghostBtn}
                  style={{ background: "rgba(0,0,0,0.3)" }}
                >
                  Dark
                </button>
                <button
                  onClick={() => setBorderColor("#6366F1")}
                  className={styles.ghostBtn}
                  style={{
                    background: "#6366F1",
                    color: "#fff",
                    borderColor: "#6366F1",
                  }}
                >
                  Accent
                </button>
              </div>
              <input
                type="text"
                placeholder="rgba() or #hex…"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                className={styles.input}
              />
            </ControlRow>
          </Section>

          {/* ── 4. Backgrounds ──────────────────────── */}
          <Section title="Backgrounds">
            {/* Solid colors */}
            <ControlRow label="Solid Colors">
              <div className={styles.swatchGrid}>
                <button
                  onClick={() => handleColorSelect("transparent")}
                  className={`${styles.colorSwatch} ${customBg === "transparent" && !bgImage ? styles.swatchActive : ""}`}
                  style={{
                    backgroundImage:
                      "conic-gradient(#333 25%, #1a1a1a 25%, #1a1a1a 50%, #333 50%, #333 75%, #1a1a1a 75%)",
                    backgroundSize: "8px 8px",
                  }}
                  title="Transparent"
                />
                {SOLID_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`${styles.colorSwatch} ${customBg === color && !bgImage ? styles.swatchActive : ""}`}
                    style={{ background: color }}
                    title={color}
                  />
                ))}
              </div>
            </ControlRow>

            {/* Gradients */}
            <ControlRow label="Gradients">
              <div className={styles.swatchGrid}>
                {GRADIENTS.map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorSelect(gradient)}
                    className={`${styles.colorSwatch} ${customBg === gradient && !bgImage ? styles.swatchActive : ""}`}
                    style={{ background: gradient }}
                  />
                ))}
              </div>
            </ControlRow>

            {/* Premium scenes */}
            <ControlRow label="Premium Scenes">
              <div className={styles.bgGrid}>
                {BACKGROUNDS.map((bg) => {
                  const isLocked = bg.isPro && !isPro;
                  const isActive = activeBg?.id === bg.id;
                  return (
                    <div key={bg.id} className={styles.swatchGroup}>
                      <button
                        onClick={() => !isLocked && handleBgSelect(bg)}
                        disabled={isLocked}
                        className={`${styles.bgSwatch} ${styles[bg.bgKey as keyof typeof styles]} ${isActive ? styles.bgSwatchActive : ""} ${isLocked ? styles.bgSwatchLocked : ""}`}
                      >
                        {isLocked && (
                          <div className={styles.lockOverlay}>🔒</div>
                        )}
                      </button>
                      <div className={styles.swatchMeta}>
                        <span className={styles.swatchName}>
                          {bg.name.split(" ")[0]}
                        </span>
                        <span
                          className={
                            bg.isPro ? styles.proPill : styles.freePill
                          }
                        >
                          {bg.isPro ? "Pro" : "Free"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ControlRow>

            {/* Custom CSS */}
            <ControlRow label="Custom CSS / Hex">
              <input
                type="text"
                placeholder="hex or linear-gradient(…)"
                value={customBg}
                onChange={(e) => handleColorSelect(e.target.value)}
                className={styles.input}
              />
            </ControlRow>

            {/* Image upload */}
            <ControlRow label="Image Upload">
              <label className={styles.fileUpload}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {bgImage ? "Replace image…" : "Choose image…"}
              </label>
              {bgImage && (
                <button
                  onClick={() => setBgImage(null)}
                  className={styles.ghostBtn}
                  style={{ marginTop: 6 }}
                >
                  Remove Image
                </button>
              )}
            </ControlRow>

            {bgImage && (
              <>
                <ControlRow label="BG Blur" value={`${bgBlur}px`}>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    value={bgBlur}
                    onChange={(e) => setBgBlur(Number(e.target.value))}
                    className={styles.slider}
                  />
                </ControlRow>

                <ControlRow label="BG Size">
                  <select
                    className={styles.select}
                    value={bgSize}
                    onChange={(e) =>
                      setBgSize(e.target.value as "cover" | "contain" | "auto")
                    }
                  >
                    <option value="cover">Cover</option>
                    <option value="contain">Contain</option>
                    <option value="auto">Original</option>
                  </select>
                </ControlRow>
              </>
            )}
          </Section>

          {/* ── 5. Watermark ────────────────────────── */}
          <Section title="Watermark" defaultOpen={false}>
            <ControlRow label="Social Handle">
              <input
                type="text"
                placeholder="@yourname"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className={styles.input}
              />
            </ControlRow>
          </Section>
        </div>
      </aside>

      {/* ── Main canvas ───────────────────────────── */}
      <main className={styles.main}>
        <Nav />
        <div className={styles.canvas}>{children}</div>
      </main>
    </div>
  );
};
