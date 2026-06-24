import { useEffect, useRef, useState } from "react";
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
import { TOOL_BUTTONS } from "../../constants/annotation_tools_buttons";
import { DRAW_TOOLS } from "../../constants/annotation_draw_tools";
import { ANNOTATION_LABEL } from "../../utils/annatation_label";
import { ANIMATION_PRESETS } from "../../constants/animations";
import {
  ANNOTATION_FONTS,
  ANNOTATION_SIZES,
  ANNOTATION_COLORS,
} from "../../constants/annotation_fonts";
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
  const isPro = useControlsStore((s) => s.isPro);
  const tilt = useControlsStore((s) => s.tilt);
  const showBrowserFrame = useControlsStore((s) => s.showBrowserFrame);
  const showDeviceFrame = useControlsStore((s) => s.showDeviceFrame);
  const pageUrl = useControlsStore((s) => s.pageUrl);
  const pageTitle = useControlsStore((s) => s.pageTitle);
  const bgImage = useControlsStore((s) => s.bgImage);
  const customBg = useControlsStore((s) => s.customBg);
  const bgBlur = useControlsStore((s) => s.bgBlur);
  const bgSize = useControlsStore((s) => s.bgSize);
  const bgScale = useControlsStore((s) => s.bgScale);
  const bgPositionX = useControlsStore((s) => s.bgPositionX);
  const bgPositionY = useControlsStore((s) => s.bgPositionY);
  // const handle = useControlsStore((s) => s.handle);
  const activeBg = useControlsStore((s) => s.activeBg);
  const tiltX = useControlsStore((s) => s.tiltX);
  const tiltY = useControlsStore((s) => s.tiltY);
  const tiltZ = useControlsStore((s) => s.tiltZ);
  const zoom = useControlsStore((s) => s.zoom);
  const animation = useControlsStore((s) => s.animation);
  const aspectRatio = useControlsStore((s) => s.aspectRatio);
  const browserMockup = useControlsStore((s) => s.browserMockup);
  const deviceMockup = useControlsStore((s) => s.deviceMockup);
  const borderRadius = useControlsStore((s) => s.borderRadius);
  const shadowVariant = useControlsStore((s) => s.shadowVariant);
  const shadowOpacity = useControlsStore((s) => s.shadowOpacity);
  const borderWidth = useControlsStore((s) => s.borderWidth);
  const borderColor = useControlsStore((s) => s.borderColor);
  const isGlassBorder = useControlsStore((s) => s.isGlassBorder);
  const screenLeft = useControlsStore((s) => s.screenLeft);
  const screenTop = useControlsStore((s) => s.screenTop);
  const screenWidth = useControlsStore((s) => s.screenWidth);
  const screenHeight = useControlsStore((s) => s.screenHeight);
  const annotations = useControlsStore((s) => s.annotations);
  const addAnnotation = useControlsStore((s) => s.addAnnotation);
  const removeAnnotation = useControlsStore((s) => s.removeAnnotation);
  const annotationColor = useControlsStore((s) => s.annotationColor);
  const annotationFontSize = useControlsStore((s) => s.annotationFontSize);
  const annotationFontFamily = useControlsStore((s) => s.annotationFontFamily);
  const activeAnnotationTool = useControlsStore((s) => s.activeAnnotationTool);
  const selectedAnnotationId = useControlsStore((s) => s.selectedAnnotationId);
  const setTilt = useControlsStore((s) => s.setTilt);
  const setBrowserFrame = useControlsStore((s) => s.setBrowserFrame);
  const setDeviceFrame = useControlsStore((s) => s.setDeviceFrame);
  const setMockupCategory = useControlsStore((s) => s.setMockupCategory);
  const setBgImage = useControlsStore((s) => s.setBgImage);
  const setBgImageRaw = useControlsStore((s) => s.setBgImageRaw);
  const setCustomBg = useControlsStore((s) => s.setCustomBg);
  const setBgBlur = useControlsStore((s) => s.setBgBlur);
  const setBgSize = useControlsStore((s) => s.setBgSize);
  const setBgScale = useControlsStore((s) => s.setBgScale);
  const setBgPositionX = useControlsStore((s) => s.setBgPositionX);
  const setBgPositionY = useControlsStore((s) => s.setBgPositionY);
  // const setHandle = useControlsStore((s) => s.setHandle);
  const setPageUrl = useControlsStore((s) => s.setPageUrl);
  const setPageTitle = useControlsStore((s) => s.setPageTitle);
  const setActiveBg = useControlsStore((s) => s.setActiveBg);
  const setTiltX = useControlsStore((s) => s.setTiltX);
  const setTiltY = useControlsStore((s) => s.setTiltY);
  const setTiltZ = useControlsStore((s) => s.setTiltZ);
  const setAspectRatio = useControlsStore((s) => s.setAspectRatio);
  const setZoom = useControlsStore((s) => s.setZoom);
  const setAnimation = useControlsStore((s) => s.setAnimation);
  const setBrowserMockup = useControlsStore((s) => s.setBrowserMockup);
  const setDeviceMockup = useControlsStore((s) => s.setDeviceMockup);
  const setBorderRadius = useControlsStore((s) => s.setBorderRadius);
  const setShadowVariant = useControlsStore((s) => s.setShadowVariant);
  const setShadowOpacity = useControlsStore((s) => s.setShadowOpacity);
  const setBorderWidth = useControlsStore((s) => s.setBorderWidth);
  const setBorderColor = useControlsStore((s) => s.setBorderColor);
  const setIsGlassBorder = useControlsStore((s) => s.setIsGlassBorder);
  const setScreenLeft = useControlsStore((s) => s.setScreenLeft);
  const setScreenTop = useControlsStore((s) => s.setScreenTop);
  const setScreenWidth = useControlsStore((s) => s.setScreenWidth);
  const setScreenHeight = useControlsStore((s) => s.setScreenHeight);
  const setActiveAnnotationTool = useControlsStore(
    (s) => s.setActiveAnnotationTool,
  );
  const setAnnotationColor = useControlsStore((s) => s.setAnnotationColor);
  const setAnnotationFontSize = useControlsStore(
    (s) => s.setAnnotationFontSize,
  );
  const setAnnotationFontFamily = useControlsStore(
    (s) => s.setAnnotationFontFamily,
  );
  const updateAnnotation = useControlsStore((s) => s.updateAnnotation);

  // glass effect
  const glassEnabled = useControlsStore((s) => s.glassEnabled);
  const glassScale = useControlsStore((s) => s.glassScale);
  const glassRadius = useControlsStore((s) => s.glassRadius);
  const glassGlow = useControlsStore((s) => s.glassGlow);
  const glassCurvature = useControlsStore((s) => s.glassCurvature);
  const glassChroma = useControlsStore((s) => s.glassChroma);
  const setGlassEnabled = useControlsStore((s) => s.setGlassEnabled);
  const setGlassScale = useControlsStore((s) => s.setGlassScale);
  const setGlassRadius = useControlsStore((s) => s.setGlassRadius);
  const setGlassGlow = useControlsStore((s) => s.setGlassGlow);
  const setGlassCurvature = useControlsStore((s) => s.setGlassCurvature);
  const setGlassChroma = useControlsStore((s) => s.setGlassChroma);

  const showWatermark = useControlsStore((s) => s.showWatermark);
  const watermarkType = useControlsStore((s) => s.watermarkType);
  const watermarkText = useControlsStore((s) => s.watermarkText);
  const watermarkLogo = useControlsStore((s) => s.watermarkLogo);
  const watermarkSocialPlatform = useControlsStore(
    (s) => s.watermarkSocialPlatform,
  );
  const watermarkTheme = useControlsStore((s) => s.watermarkTheme);
  const watermarkFont = useControlsStore((s) => s.watermarkFont);
  const watermarkColor = useControlsStore((s) => s.watermarkColor);

  const setShowWatermark = useControlsStore((s) => s.setShowWatermark);
  const setWatermarkType = useControlsStore((s) => s.setWatermarkType);
  const setWatermarkText = useControlsStore((s) => s.setWatermarkText);
  const setWatermarkLogo = useControlsStore((s) => s.setWatermarkLogo);
  const setWatermarkSocialPlatform = useControlsStore(
    (s) => s.setWatermarkSocialPlatform,
  );
  const setWatermarkTheme = useControlsStore((s) => s.setWatermarkTheme);
  const setWatermarkFont = useControlsStore((s) => s.setWatermarkFont);
  const setWatermarkColor = useControlsStore((s) => s.setWatermarkColor);

  const showContextBadge = useControlsStore((s) => s.showContextBadge);
  const setShowContextBadge = useControlsStore((s) => s.setShowContextBadge);
  const contextBadgeText = useControlsStore((s) => s.contextBadgeText);
  const setContextBadgeText = useControlsStore((s) => s.setContextBadgeText);

  const annotationsRef = useRef(annotations);
  const prevBgUrl = useRef<string | null>(null);
  const readerRef = useRef<FileReader | null>(null);

  useEffect(() => {
    annotationsRef.current = annotations;
  }, [annotations]);

  // When selection changes → pull that annotation's values into sidebar controls
  useEffect(() => {
    if (!selectedAnnotationId) return;
    const ann = annotationsRef.current.find(
      (a) => a.id === selectedAnnotationId,
    );
    if (!ann) return;

    if (ann.color) setAnnotationColor(ann.color);
    if (ann.fontSize) setAnnotationFontSize(ann.fontSize);
    if (ann.fontFamily) setAnnotationFontFamily(ann.fontFamily);
  }, [
    selectedAnnotationId,
    setAnnotationColor,
    setAnnotationFontFamily,
    setAnnotationFontSize,
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // abort in-flight read
    if (readerRef.current) readerRef.current.abort();

    if (prevBgUrl.current) URL.revokeObjectURL(prevBgUrl.current);

    const objectUrl = URL.createObjectURL(file);
    setBgImage(objectUrl);

    prevBgUrl.current = objectUrl;

    const reader = new FileReader();
    readerRef.current = reader;
    reader.onloadend = () => setBgImageRaw(reader.result as string);
    reader.readAsDataURL(file);

    setCustomBg("");
    setActiveBg(null);
  };

  const handleBgClear = () => {
    if (prevBgUrl.current) {
      URL.revokeObjectURL(prevBgUrl.current);
      prevBgUrl.current = null;
    }
    setBgImage(null);
    setBgImageRaw(null);
  };

  const handleBgSelect = (bg: (typeof BACKGROUNDS)[0]) => {
    if (bg.isPro && !isPro) {
      console.log("Upsell triggered");
    } else {
      setActiveBg(bg);
      setBgImage(null);
      setBgImageRaw(null);
      setCustomBg("");
    }
  };

  const handleColorSelect = (colorOrGradient: string) => {
    setCustomBg(colorOrGradient);
    setBgImage(null);
    setBgImageRaw(null);
    setActiveBg(null);
  };

  const handleAnimationSelect = (preset: (typeof ANIMATION_PRESETS)[0]) => {
    if (preset.isPro && !isPro) {
      console.log("Trigger Upsell Modal!");
      return;
    }
    setAnimation(preset.id);
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

          <Section title="VIDEO ANIMATIONS" defaultOpen={true}>
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
          </Section>

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
                  setMockupCategory("device");
                } else {
                  setMockupCategory("none");
                }
              }}
            />

            {showDeviceFrame && (
              <>
                <ControlRow label="Mockup Style">
                  <select
                    className={styles.select}
                    value={deviceMockup}
                    onChange={(e) =>
                      setDeviceMockup(e.target.value as DeviceMockup)
                    }
                  >
                    {DEVICE_MOCKUPS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </ControlRow>

                <ControlRow label="Position X">
                  <div className={styles.arrowSliderRow}>
                    <span className={styles.arrowLabel}>Left</span>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      step={0.1}
                      value={screenLeft}
                      onChange={(e) => setScreenLeft(Number(e.target.value))}
                      className={styles.slider}
                    />
                    <span className={styles.arrowLabel}>Right</span>
                  </div>
                </ControlRow>

                <ControlRow label="Position Y">
                  <div className={styles.arrowSliderRow}>
                    <span className={styles.arrowLabel}>Top</span>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      step={0.1}
                      value={screenTop}
                      onChange={(e) => setScreenTop(Number(e.target.value))}
                      className={styles.slider}
                    />
                    <span className={styles.arrowLabel}>Bottom</span>
                  </div>
                </ControlRow>

                <ControlRow label="Width">
                  <div className={styles.arrowSliderRow}>
                    <span className={styles.arrowLabel}>Narrow</span>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={0.1}
                      value={screenWidth}
                      onChange={(e) => setScreenWidth(Number(e.target.value))}
                      className={styles.slider}
                    />
                    <span className={styles.arrowLabel}>Wide</span>
                  </div>
                </ControlRow>

                <ControlRow label="Height">
                  <div className={styles.arrowSliderRow}>
                    <span className={styles.arrowLabel}>Short</span>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={0.1}
                      value={screenHeight}
                      onChange={(e) => setScreenHeight(Number(e.target.value))}
                      className={styles.slider}
                    />
                    <span className={styles.arrowLabel}>Tall</span>
                  </div>
                </ControlRow>

                <button
                  onClick={() => {
                    const active = DEVICE_MOCKUPS.find(
                      (m) => m.id === deviceMockup,
                    );
                    if (!active) return;
                    setScreenLeft(parseFloat(active.screen.left));
                    setScreenTop(parseFloat(active.screen.top));
                    setScreenWidth(parseFloat(active.screen.width));
                    setScreenHeight(parseFloat(active.screen.height));
                  }}
                  className={styles.resetBtn}
                >
                  Reset to defaults
                </button>
              </>
            )}
          </Section>

          {/* ── 4. Frame Styles ─────────────────────── */}
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

          {/* ── 5. Backgrounds ──────────────────────── */}
          <Section title="Backgrounds">
            {/* glass effect */}
            <ControlRow label="Glass Effect">
              <input
                type="checkbox"
                checked={glassEnabled}
                onChange={(e) => setGlassEnabled(e.target.checked)}
              />
            </ControlRow>

            {glassEnabled && (
              <>
                <ControlRow label="Refraction" value={glassScale.toFixed(2)}>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={Math.round(glassScale * 100)}
                    onChange={(e) =>
                      setGlassScale(Number(e.target.value) / 100)
                    }
                    className={styles.slider}
                  />
                </ControlRow>

                <ControlRow label="Curvature" value={glassCurvature}>
                  <input
                    type="range"
                    min={10}
                    max={80}
                    step={1}
                    value={glassCurvature}
                    onChange={(e) => setGlassCurvature(Number(e.target.value))}
                    className={styles.slider}
                  />
                </ControlRow>

                <ControlRow label="Radius" value={`${glassRadius}px`}>
                  <input
                    type="range"
                    min={0}
                    max={80}
                    step={1}
                    value={glassRadius}
                    onChange={(e) => setGlassRadius(Number(e.target.value))}
                    className={styles.slider}
                  />
                </ControlRow>

                <ControlRow label="Glow" value={glassGlow.toFixed(2)}>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    step={1}
                    value={Math.round(glassGlow * 100)}
                    onChange={(e) => setGlassGlow(Number(e.target.value) / 100)}
                    className={styles.slider}
                  />
                </ControlRow>

                <ControlRow label="Chroma" value={glassChroma.toFixed(2)}>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={Math.round(glassChroma * 100)}
                    onChange={(e) =>
                      setGlassChroma(Number(e.target.value) / 100)
                    }
                    className={styles.slider}
                  />
                </ControlRow>
              </>
            )}
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
                  onClick={(e) => {
                    (e.target as HTMLInputElement).value = "";
                  }}
                />
                {bgImage ? "Replace image…" : "Choose image…"}
              </label>
              {bgImage && (
                <button
                  onClick={handleBgClear}
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

                <ControlRow label="BG Scale" value={`${bgScale.toFixed(1)}x`}>
                  <input
                    type="range"
                    min={50}
                    max={200}
                    value={bgScale * 100}
                    onChange={(e) => setBgScale(Number(e.target.value) / 100)}
                    className={styles.slider}
                  />
                </ControlRow>

                <ControlRow label="BG Position X" value={`${bgPositionX}%`}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={bgPositionX}
                    onChange={(e) => setBgPositionX(Number(e.target.value))}
                    className={styles.slider}
                  />
                </ControlRow>

                <ControlRow label="BG Position Y" value={`${bgPositionY}%`}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={bgPositionY}
                    onChange={(e) => setBgPositionY(Number(e.target.value))}
                    className={styles.slider}
                  />
                </ControlRow>
              </>
            )}
          </Section>

          {/* ── 6. Annotations ──────────────────────── */}
          <Section title="Annotations" defaultOpen={false}>
            {/* ── Tool buttons ──────────────────────────── */}
            <ControlRow label="Add">
              <div className={styles.btnGrid3}>
                {TOOL_BUTTONS.map(({ type, icon, label }) => {
                  const isActive = activeAnnotationTool === type;
                  const isDrawTool = DRAW_TOOLS.includes(type);
                  return (
                    <button
                      key={type}
                      className={`${styles.presetBtn} ${isActive ? styles.active : ""}`}
                      title={
                        isDrawTool
                          ? `Click then drag on canvas`
                          : `Add ${label}`
                      }
                      onClick={() => {
                        if (isActive) {
                          setActiveAnnotationTool(null);
                          return;
                        }
                        if (isDrawTool) {
                          // Draw tools: activate draw mode, user drags on canvas
                          setActiveAnnotationTool(type);
                        } else if (type === "text") {
                          addAnnotation("text");
                        } else if (type === "number") {
                          // Auto-increment number
                          const existingNumbers = annotations
                            .filter((a) => a.type === "number")
                            .map((a) => a.number ?? 1);
                          const next =
                            existingNumbers.length > 0
                              ? Math.max(...existingNumbers) + 1
                              : 1;
                          addAnnotation("number", { number: next });
                        }
                      }}
                    >
                      <span style={{ marginRight: 4, opacity: 0.7 }}>
                        {icon}
                      </span>
                      {isActive && isDrawTool ? "Drawing…" : label}
                    </button>
                  );
                })}
              </div>
            </ControlRow>

            {/* Draw mode hint */}
            {activeAnnotationTool &&
              DRAW_TOOLS.includes(activeAnnotationTool) && (
                <div className={styles.controlRow}>
                  <p className={styles.hint}>
                    Click and drag on the canvas · <kbd>Esc</kbd> to cancel
                  </p>
                </div>
              )}

            {/* ── Color ─────────────────────────────────── */}
            <ControlRow label="Color">
              <div className={styles.swatchGrid}>
                {ANNOTATION_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`${styles.colorSwatch} ${annotationColor === color ? styles.swatchActive : ""}`}
                    style={{
                      background: color,
                      outline:
                        color === "#ffffff"
                          ? "0.5px solid rgba(255,255,255,0.2)"
                          : "none",
                    }}
                    onClick={() => {
                      setAnnotationColor(color);
                      if (selectedAnnotationId) {
                        updateAnnotation(selectedAnnotationId, {
                          color: color,
                        });
                      }
                    }}
                  />
                ))}
              </div>
              <input
                type="text"
                placeholder="#hex or rgba(…)"
                value={annotationColor}
                onChange={(e) => {
                  setAnnotationColor(e.target.value);

                  if (selectedAnnotationId) {
                    updateAnnotation(selectedAnnotationId, {
                      color: e.target.value,
                    });
                  }
                }}
                className={styles.input}
              />
            </ControlRow>

            {/* ── Font (text only) ──────────────────────── */}
            <ControlRow label="Font">
              <select
                className={styles.select}
                value={annotationFontFamily}
                onChange={(e) => {
                  setAnnotationFontFamily(e.target.value);
                  if (selectedAnnotationId) {
                    updateAnnotation(selectedAnnotationId, {
                      fontFamily: e.target.value,
                    });
                  }
                }}
              >
                {ANNOTATION_FONTS.map((f) => (
                  <option
                    key={f.value}
                    value={f.value}
                    style={{ fontFamily: f.value }}
                  >
                    {f.label}
                  </option>
                ))}
              </select>
            </ControlRow>

            {/* ── Font size ─────────────────────────────── */}
            <ControlRow label="Size" value={`${annotationFontSize}px`}>
              <input
                type="range"
                min={10}
                max={48}
                step={1}
                value={annotationFontSize}
                onChange={(e) => {
                  setAnnotationFontSize(Number(e.target.value));
                  if (selectedAnnotationId) {
                    updateAnnotation(selectedAnnotationId, {
                      fontSize: Number(e.target.value),
                    });
                  }
                }}
                className={styles.slider}
              />
              <div className={styles.btnGrid4}>
                {ANNOTATION_SIZES.filter((_, i) => i % 2 === 0).map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setAnnotationFontSize(size);
                      if (selectedAnnotationId) {
                        updateAnnotation(selectedAnnotationId, {
                          fontSize: size,
                        });
                      }
                    }}
                    className={`${styles.presetBtn} ${annotationFontSize === size ? styles.active : ""}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </ControlRow>

            {/* ── Layers list ───────────────────────────── */}
            {annotations.length > 0 && (
              <ControlRow label="Layers">
                <div className={styles.annotationList}>
                  {[...annotations].reverse().map((ann, i) => (
                    <div key={ann.id} className={styles.annotationItem}>
                      <span className={styles.annotationIcon}>
                        {ann.type === "text"
                          ? "T"
                          : ann.type === "box"
                            ? "□"
                            : ann.type === "arrow"
                              ? "↗"
                              : ann.type === "number"
                                ? "①"
                                : ann.type === "highlight"
                                  ? "▬"
                                  : "▪"}
                      </span>
                      <span
                        className={styles.annotationIcon}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: ann.color,
                          flexShrink: 0,
                        }}
                      />
                      <span className={styles.annotationLabel}>
                        {ANNOTATION_LABEL(ann, annotations.length - 1 - i)}
                      </span>
                      <button
                        className={styles.annotationDelete}
                        onClick={() => removeAnnotation(ann.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </ControlRow>
            )}

            {/* ── Clear all ─────────────────────────────── */}
            {annotations.length > 0 && (
              <div className={styles.controlRow}>
                <button
                  className={styles.ghostBtn}
                  onClick={() =>
                    [...annotations].forEach((a) => removeAnnotation(a.id))
                  }
                >
                  Clear all
                </button>
              </div>
            )}
          </Section>

          {/* ── 7. Watermark ────────────────────────── */}
          {/* ── 7. Brand & Context ────────────────────────── */}
          <Section title="Brand & Context" defaultOpen={false}>
            {/* --- 1. BUILD CONTEXT (The Journey Badge) --- */}
            <ToggleRow
              id="contextBadgeToggle"
              label="Build Context Badge"
              checked={showContextBadge}
              onChange={(checked) => setShowContextBadge(checked)}
            />

            {showContextBadge && (
              <ControlRow label="Context Text">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Added new feature • {date}"
                    value={contextBadgeText}
                    onChange={(e) => setContextBadgeText(e.target.value)}
                    className={styles.input}
                  />
                  {/* The Variable Chips */}
                  <div
                    style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}
                  >
                    <button
                      className={styles.ghostBtn}
                      style={{
                        padding: "3px 6px",
                        fontSize: "8px",
                        textTransform: "lowercase",
                        flex: "none",
                      }}
                      onClick={() =>
                        setContextBadgeText(`${contextBadgeText} {url}`.trim())
                      }
                    >
                      + {"{url}"}
                    </button>
                    <button
                      className={styles.ghostBtn}
                      style={{
                        padding: "3px 6px",
                        fontSize: "8px",
                        textTransform: "lowercase",
                        flex: "none",
                      }}
                      onClick={() =>
                        setContextBadgeText(`${contextBadgeText} {date}`.trim())
                      }
                    >
                      + {"{date}"}
                    </button>
                    <button
                      className={styles.ghostBtn}
                      style={{
                        padding: "3px 6px",
                        fontSize: "8px",
                        textTransform: "lowercase",
                        flex: "none",
                      }}
                      onClick={() =>
                        setContextBadgeText(
                          `${contextBadgeText} {title}`.trim(),
                        )
                      }
                    >
                      + {"{title}"}
                    </button>
                  </div>
                </div>
              </ControlRow>
            )}

            <div className={styles.divider} style={{ margin: "12px 0" }} />

            {/* --- 2. WATERMARK (The Brand Identity) --- */}
            <ToggleRow
              id="watermarkToggle"
              label="Brand Watermark"
              checked={showWatermark}
              onChange={(checked) => {
                if (!isPro)
                  return alert("Upgrade to Pro to remove the watermark!");
                setShowWatermark(checked);
              }}
            />

            {showWatermark && (
              <>
                <ControlRow label="Type">
                  <div className={styles.btnRow}>
                    <button
                      onClick={() => {
                        if (!isPro) return alert("Upgrade to unlock modes!");
                        setWatermarkType("text");
                      }}
                      className={`${styles.ghostBtn} ${watermarkType === "text" ? styles.active : ""}`}
                      style={
                        watermarkType === "text"
                          ? {
                              background: "var(--accent-soft)",
                              color: "var(--accent-main)",
                              borderColor: "var(--border-active)",
                            }
                          : {}
                      }
                    >
                      Text
                    </button>
                    <button
                      onClick={() => {
                        if (!isPro) return alert("Upgrade to unlock modes!");
                        setWatermarkType("social");
                      }}
                      className={`${styles.ghostBtn} ${watermarkType === "social" ? styles.active : ""}`}
                      style={
                        watermarkType === "social"
                          ? {
                              background: "var(--accent-soft)",
                              color: "var(--accent-main)",
                              borderColor: "var(--border-active)",
                            }
                          : {}
                      }
                    >
                      Social
                    </button>
                    <button
                      onClick={() => {
                        if (!isPro) return alert("Upgrade to unlock modes!");
                        setWatermarkType("logo");
                      }}
                      className={`${styles.ghostBtn} ${watermarkType === "logo" ? styles.active : ""}`}
                      style={
                        watermarkType === "logo"
                          ? {
                              background: "var(--accent-soft)",
                              color: "var(--accent-main)",
                              borderColor: "var(--border-active)",
                            }
                          : {}
                      }
                    >
                      Logo
                    </button>
                  </div>
                </ControlRow>

                {/* Conditional Inputs based on Watermark Mode */}
                {watermarkType === "text" || watermarkType === "social" ? (
                  <>
                    {watermarkType === "social" && (
                      <ControlRow label="Platform">
                        <select
                          className={styles.select}
                          value={watermarkSocialPlatform}
                          onChange={(e) =>
                            setWatermarkSocialPlatform(
                              e.target.value as
                                | "x"
                                | "github"
                                | "linkedin"
                                | "instagram",
                            )
                          }
                          disabled={!isPro}
                        >
                          <option value="x">X (Twitter)</option>
                          <option value="github">GitHub</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="instagram">Instagram</option>
                        </select>
                      </ControlRow>
                    )}

                    <ControlRow
                      label={
                        watermarkType === "social" ? "Handle" : "Custom Text"
                      }
                    >
                      <div style={{ position: "relative" }}>
                        <input
                          type="text"
                          placeholder={
                            watermarkType === "social"
                              ? "@yourhandle"
                              : "Enter brand name..."
                          }
                          value={
                            !isPro ? "✨ Made with AppName" : watermarkText
                          }
                          onChange={(e) => setWatermarkText(e.target.value)}
                          disabled={!isPro}
                          className={styles.input}
                        />
                        {!isPro && (
                          <div
                            className={styles.lockOverlay}
                            onClick={() =>
                              alert("Upgrade to customize watermark text!")
                            }
                            style={{
                              borderRadius: "var(--radius-sm)",
                              cursor: "pointer",
                            }}
                          >
                            🔒 Upgrade to customize
                          </div>
                        )}
                      </div>
                    </ControlRow>
                  </>
                ) : (
                  <ControlRow label="Upload Logo">
                    <label
                      className={styles.fileUpload}
                      style={{ position: "relative", overflow: "hidden" }}
                    >
                      <input
                        type="file"
                        accept="image/png, image/svg+xml"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onloadend = () =>
                            setWatermarkLogo(reader.result as string);
                          reader.readAsDataURL(file);
                        }}
                        disabled={!isPro}
                      />
                      {watermarkLogo ? "Replace logo..." : "Choose PNG/SVG..."}
                      {!isPro && (
                        <div
                          className={styles.lockOverlay}
                          onClick={() => alert("Upgrade to upload logos!")}
                        >
                          🔒
                        </div>
                      )}
                    </label>
                  </ControlRow>
                )}

                {/* Theme, Font & Color settings for the Brand Watermark */}
                {/* Theme Selector (Glass, Dark, Light, Transparent) */}
                <ControlRow label="Theme">
                  <div
                    className={styles.btnGrid4}
                    style={{ gridTemplateColumns: "1fr 1fr", gap: "5px" }}
                  >
                    {(["glass", "dark", "light", "transparent"] as const).map(
                      (theme) => {
                        const isActive = watermarkTheme === theme;
                        return (
                          <button
                            key={theme}
                            onClick={() => {
                              if (!isPro)
                                return alert("Upgrade to unlock themes!");
                              setWatermarkTheme(theme);
                            }}
                            className={`${styles.presetBtn} ${isActive ? styles.active : ""}`}
                            style={{
                              position: "relative",
                              textTransform: "capitalize",
                            }}
                          >
                            {theme}
                            {!isPro && (
                              <span
                                style={{
                                  position: "absolute",
                                  top: 2,
                                  right: 3,
                                  fontSize: 8,
                                }}
                              >
                                🔒
                              </span>
                            )}
                          </button>
                        );
                      },
                    )}
                  </div>
                </ControlRow>

                {/* Font and Color Selector (Inline Row) */}
                <ControlRow label="Font & Color">
                  <div style={{ display: "flex", gap: "6px" }}>
                    {/* Font Dropdown */}
                    <select
                      className={styles.select}
                      value={watermarkFont}
                      onChange={(e) => {
                        if (!isPro) return alert("Upgrade to unlock fonts!");
                        setWatermarkFont(e.target.value);
                      }}
                      disabled={!isPro}
                      style={{ flex: 1, padding: "7px 20px 7px 8px" }}
                    >
                      <option value="system-ui, sans-serif">System UI</option>
                      <option value="Inter, sans-serif">Inter</option>
                      <option value="'JetBrains Mono', monospace">
                        JetBrains Mono
                      </option>
                      <option value="'Playfair Display', serif">
                        Playfair
                      </option>
                    </select>

                    {/* Color Picker Box */}
                    <div
                      style={{
                        position: "relative",
                        width: "30px",
                        height: "30px",
                        flexShrink: 0,
                        borderRadius: "4px",
                        overflow: "hidden",
                        border: "0.5px solid var(--border-medium)",
                      }}
                      onClick={() => {
                        if (!isPro) alert("Upgrade to unlock custom colors!");
                      }}
                    >
                      <input
                        type="color"
                        value={!isPro ? "#ffffff" : watermarkColor}
                        onChange={(e) => {
                          if (!isPro) return;
                          setWatermarkColor(e.target.value);
                        }}
                        disabled={!isPro}
                        style={{
                          position: "absolute",
                          top: "-10px",
                          left: "-10px",
                          width: "50px",
                          height: "50px",
                          cursor: isPro ? "pointer" : "not-allowed",
                        }}
                      />
                      {/* Transparent Lock Overlay for the color box */}
                      {!isPro && (
                        <div
                          className={styles.lockOverlay}
                          style={{ background: "rgba(10,10,12,0.3)" }}
                        />
                      )}
                    </div>
                  </div>
                </ControlRow>
              </>
            )}
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
