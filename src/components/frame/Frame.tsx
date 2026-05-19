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

  const innerRadius =
    borderWidth > 0 ? Math.max(0, borderRadius - borderWidth) : borderRadius;

  return (
    <div className={styles.canvasWrapper}>
      <div
        className={`${styles.windowWrapper} ${!isGlassBorder ? styles.noGlass : ""}`}
        style={
          {
            transform: combinedTransform,
            borderRadius: `${borderRadius}px`,
            boxShadow: dynamicShadow,
            border:
              borderWidth > 0
                ? `${borderWidth}px solid ${borderColor}`
                : "none",
            "--glass-opacity": 0.12,
          } as React.CSSProperties
        }
      >
        <div
          className={styles.innerClip}
          style={{ borderRadius: `${innerRadius}px` }}
        >
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
          <div
            className={styles.windowContent}
            style={{ isolation: "isolate" }}
          >
            <img
              src={imageSource!}
              alt="Captured tab"
              className={styles.screenshot}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
