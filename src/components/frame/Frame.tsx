import { useControlsStore } from "../../store/useControlsStore";
import { SHADOW_PRESETS } from "../../constants/shadow_presets";
import { BROWSER_MOCKUP_CONFIG } from "../../constants/browser_mockup_config";
import { DEVICE_MOCKUPS } from "../../constants/Device_mockup_config";
import { AnnotationLayer } from "../annotationLayer/AnnotationLayer";
import styles from "./index.module.css";

export const Frame = () => {
  const zoom = useControlsStore((s) => s.zoom);
  const tiltX = useControlsStore((s) => s.tiltX);
  const tiltY = useControlsStore((s) => s.tiltY);
  const tiltZ = useControlsStore((s) => s.tiltZ);
  const animation = useControlsStore((s) => s.animation);
  const borderRadius = useControlsStore((s) => s.borderRadius);
  const screenTop = useControlsStore((s) => s.screenTop);
  const screenLeft = useControlsStore((s) => s.screenLeft);
  const screenWidth = useControlsStore((s) => s.screenWidth);
  const screenHeight = useControlsStore((s) => s.screenHeight);
  const mockupCategory = useControlsStore((s) => s.mockupCategory);
  const browserMockup = useControlsStore((s) => s.browserMockup);
  const deviceMockup = useControlsStore((s) => s.deviceMockup);
  const pageUrl = useControlsStore((s) => s.pageUrl);
  const pageTitle = useControlsStore((s) => s.pageTitle);
  const tilt = useControlsStore((s) => s.tilt);
  // const imageSource = useControlsStore((s) => s.imageSource);
  const imageSourceRaw = useControlsStore((s) => s.imageSourceRaw);

  const shadowVariant = useControlsStore((s) => s.shadowVariant);
  const shadowOpacity = useControlsStore((s) => s.shadowOpacity);
  const borderWidth = useControlsStore((s) => s.borderWidth);
  const borderColor = useControlsStore((s) => s.borderColor);
  const isGlassBorder = useControlsStore((s) => s.isGlassBorder);
  const updateImageNaturalSize = useControlsStore(
    (s) => s.updateImageNaturalSize,
  );

  const combinedTransform = tilt
    ? `scale(${zoom}) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${tiltZ}deg)`
    : `scale(${zoom})`;

  // Clean the URL for display
  const cleanUrl = pageUrl.replace(/^https?:\/\//, "").replace(/^www\./, "");

  const displayTitle =
    pageTitle.trim() !== "" ? pageTitle : cleanUrl.split("/")[0];
  const activeBrowserConfig =
    BROWSER_MOCKUP_CONFIG[browserMockup as keyof typeof BROWSER_MOCKUP_CONFIG];

  const activeDeviceConfig =
    DEVICE_MOCKUPS.find((d) => d.id === deviceMockup) || DEVICE_MOCKUPS[0];

  const currentPreset = SHADOW_PRESETS[shadowVariant] || SHADOW_PRESETS[0];
  let dynamicShadow = currentPreset.value.replace(
    /__OPACITY__/g,
    shadowOpacity.toString(),
  );

  if (isGlassBorder && borderWidth > 0) {
    dynamicShadow += `inset 0 1px 1px rgba(255, 255, 255, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.1)`;
  }

  const innerRadius =
    borderWidth > 0 ? Math.max(0, borderRadius - borderWidth) : borderRadius;

  const animationClass =
    animation !== "none" ? styles[`anim-${animation}`] : "";

  const baseStyle = {
    transform: animation === "none" ? combinedTransform : undefined,
    "--zoom": zoom,
  } as React.CSSProperties;

  const frameStyle =
    mockupCategory === "device"
      ? baseStyle
      : ({
          ...baseStyle,
          borderRadius: `${borderRadius}px`,
          boxShadow: dynamicShadow,
          border:
            borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : "none",
          "--glass-opacity": 0.12,
          "--border-width": `${borderWidth}px`,
        } as React.CSSProperties);

  return (
    <div className={styles.canvasWrapper}>
      <div
        className={`${styles.windowWrapper} ${animationClass} ${!isGlassBorder ? styles.noGlass : ""}`}
        style={frameStyle}
      >
        <div
          className={styles.innerClip}
          style={{ borderRadius: `${innerRadius}px` }}
        >
          {/* ==========================================
              RENDER A: BROWSER MOCKUP
          ========================================== */}
          {mockupCategory === "browser" && activeBrowserConfig && (
            <>
              <div className={styles.mockupHeader}>
                <img
                  src={activeBrowserConfig.src}
                  alt={browserMockup}
                  className={styles.mockupImage}
                />
                {activeBrowserConfig.overlays.map((overlay, index) => (
                  <div
                    key={index}
                    className={styles.absoluteText}
                    style={{
                      top: overlay.top,
                      left: overlay.left,
                      width: overlay.width,
                      fontSize: overlay.fontSize,
                      color: overlay.color,
                      textAlign: overlay.align,
                      fontWeight: overlay.fontWeight || "400",
                    }}
                  >
                    {overlay.type === "url" ? cleanUrl : displayTitle}
                  </div>
                ))}
              </div>
              <div className={styles.windowContent}>
                <img
                  src={imageSourceRaw!}
                  alt="Captured tab"
                  className={styles.screenshot}
                />
              </div>

              <AnnotationLayer />
            </>
          )}

          {/* ==========================================
              RENDER B: DEVICE MOCKUP (NEW)
          ========================================== */}
          {mockupCategory === "device" && activeDeviceConfig && (
            <div
              className={styles.deviceMockupContainer}
              style={{ aspectRatio: activeDeviceConfig.aspectRatio }}
            >
              {/* 1. Screenshot sits behind, in the screen cutout area */}
              <div
                className={styles.deviceScreenArea}
                style={{
                  top: `${screenTop}%`,
                  left: `${screenLeft}%`,
                  width: `${screenWidth}%`,
                  height: `${screenHeight}%`,
                  borderRadius: activeDeviceConfig.screen.borderRadius ?? "0px",
                }}
              >
                <img
                  src={imageSourceRaw!}
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    updateImageNaturalSize(img.naturalWidth, img.naturalHeight);
                  }}
                  alt="Captured tab"
                />

                <AnnotationLayer />
              </div>

              {/* 2. Device frame on top */}
              <img
                src={activeDeviceConfig.src}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  updateImageNaturalSize(img.naturalWidth, img.naturalHeight);
                }}
                alt={activeDeviceConfig.label}
                className={styles.deviceBaseImage}
              />
            </div>
          )}

          {/* ==========================================
              RENDER C: NO MOCKUP (Plain Image)
          ========================================== */}
          {mockupCategory === "none" && (
            <div className={styles.windowContent}>
              <img
                src={imageSourceRaw!}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  updateImageNaturalSize(img.naturalWidth, img.naturalHeight);
                }}
                alt="Captured tab"
                className={styles.screenshot}
              />

              <AnnotationLayer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
