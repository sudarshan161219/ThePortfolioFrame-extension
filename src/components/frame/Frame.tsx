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
    imageSource,
    zoom,
    borderRadius,
    shadowVariant,
    shadowOpacity,
  } = useControlsStore();

  const combinedTransform = tilt
    ? `scale(${zoom}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
    : `scale(${zoom})`;

  // Clean the URL for display
  const cleanUrl = pageUrl.replace(/^https?:\/\//, "").replace(/^www\./, "");

  const displayTitle =
    pageTitle.trim() !== "" ? pageTitle : cleanUrl.split("/")[0];
  const activeConfig =
    MOCKUP_CONFIG[browserMockup as keyof typeof MOCKUP_CONFIG];

  const currentPreset = SHADOW_PRESETS[shadowVariant] || SHADOW_PRESETS[0];
  const dynamicShadow = currentPreset.value.replace(
    /__OPACITY__/g,
    shadowOpacity.toString(),
  );

  return (
    <div
      className={styles.canvasWrapper}
      style={{
        transform: combinedTransform,
        transformStyle: "preserve-3d",
        borderRadius: `${borderRadius}px`,
        boxShadow: dynamicShadow,
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
          {/* The dynamically positioned URL text */}
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
  );
};
