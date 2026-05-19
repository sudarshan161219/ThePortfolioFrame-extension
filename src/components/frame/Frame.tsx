import { useControlsStore } from "../../store/useControlsStore";
import { SHADOW_PRESETS } from "../../constants/shadow_presets";
import { MOCKUP_CONFIG } from "../../constants/mockup_config";
import styles from "./index.module.css";

export const Frame = () => {
  const {
    showBrowserFrame,
    browserMockup,
    pageUrl,
    pageTitle,
    tilt,
    tiltX,
    tiltY,
    tiltZ,
    imageSource,
    zoom,
    borderRadius,
    shadowVariant,
    shadowOpacity,
    borderWidth,
    borderColor,
    isGlassBorder,
  } = useControlsStore();

  const combinedTransform = tilt
    ? `scale(${zoom}) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${tiltZ}deg)`
    : `scale(${zoom})`;

  // Clean the URL for display
  const cleanUrl = pageUrl.replace(/^https?:\/\//, "").replace(/^www\./, "");

  const displayTitle =
    pageTitle.trim() !== "" ? pageTitle : cleanUrl.split("/")[0];
  const activeConfig =
    MOCKUP_CONFIG[browserMockup as keyof typeof MOCKUP_CONFIG];

  const currentPreset = SHADOW_PRESETS[shadowVariant] || SHADOW_PRESETS[0];
  let dynamicShadow = currentPreset.value.replace(
    /__OPACITY__/g,
    shadowOpacity.toString(),
  );

  if (isGlassBorder && borderWidth > 0) {
    dynamicShadow += `, inset 0 1px 1px rgba(255, 255, 255, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.1)`;
  }

  return (
    // 1. The stationary parent (This should get `perspective: 1200px` in your CSS)
    <div className={styles.canvasWrapper}>
      {/* // 2. The spinning child (This gets all the dynamic inline styles) */}
      <div
        className={styles.windowWrapper} // <-- Don't forget to add this class back!
        style={{
          transform: combinedTransform,
          transformStyle: "preserve-3d",
          borderRadius: `${borderRadius}px`,
          boxShadow: dynamicShadow,
          border:
            borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : "none",
          backdropFilter: isGlassBorder ? "blur(16px) saturate(180%)" : "none",
          WebkitBackdropFilter: isGlassBorder
            ? "blur(16px) saturate(180%)"
            : "none",
        }}
      >
        {/* Render the PNG Browser Mockup with absolute text overlay */}
        {showBrowserFrame && activeConfig && (
          <div className={styles.mockupHeader}>
            <img
              src={activeConfig.src}
              alt={browserMockup}
              className={styles.mockupImage}
            />
            {activeConfig.overlays.map((overlay, index) => (
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
        )}

        {/* The Screenshot */}
        <div className={styles.windowContent}>
          <img
            src={imageSource!}
            alt="Captured tab"
            className={styles.screenshot}
          />
        </div>
      </div>
    </div>
  );
};
