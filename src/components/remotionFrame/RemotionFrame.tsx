import React from "react";
import { AbsoluteFill, Img } from "remotion";
import styles from "./index.module.css";
import { Gif } from "@remotion/gif";
// import { ratios } from "../../constants/ratios";

// Constants (Adjust import paths to match your project)
import { SHADOW_PRESETS } from "../../constants/shadow_presets";
import { BROWSER_MOCKUP_CONFIG } from "../../constants/browser_mockup_config";
import { DEVICE_MOCKUPS } from "../../constants/Device_mockup_config";
import { type Annotation } from "../../store/useControlsStore";

// 1. The Props Interface (Matches your Zustand AppState perfectly)
export interface RemotionFrameProps {
  imageSourceRaw: string;
  bgImageRaw: string | null;
  customBg: string;
  bgBlur: number;
  bgSize: "cover" | "contain" | "auto";
  handle: string;

  zoom: number;
  tilt: boolean;
  tiltX: number;
  tiltY: number;
  tiltZ: number;

  mockupCategory: "browser" | "device" | "none";
  browserMockup: string;
  deviceMockup: string;
  pageUrl: string;
  pageTitle: string;

  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  isGlassBorder: boolean;
  shadowVariant: number;
  shadowOpacity: number;

  screenTop: number;
  screenLeft: number;
  screenWidth: number;
  screenHeight: number;

  previewScale: number;
  previewWidth: number;
  previewHeight: number;

  imageNaturalWidth: number;
  imageNaturalHeight: number;

  animation: string;
  aspectRatio: string;
  annotations: Annotation[];
}

export const RemotionFrame: React.FC<RemotionFrameProps> = (props) => {
  // ─── 1. Helpers ──────────────────────────────────────────
  const isGif = (url: string | null) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return (
      lowerUrl.includes(".gif") ||
      lowerUrl.includes("image/gif") ||
      lowerUrl.startsWith("data:image/gif")
    );
  };

  const cleanUrl = props.pageUrl
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "");
  const displayTitle =
    props.pageTitle.trim() !== "" ? props.pageTitle : cleanUrl.split("/")[0];

  const activeBrowserConfig =
    BROWSER_MOCKUP_CONFIG[
      props.browserMockup as keyof typeof BROWSER_MOCKUP_CONFIG
    ];
  const activeDeviceConfig =
    DEVICE_MOCKUPS.find((d) => d.id === props.deviceMockup) ||
    DEVICE_MOCKUPS[0];

  // ─── 2. Shadow & Border Calculations ─────────────────────
  const currentPreset =
    SHADOW_PRESETS[props.shadowVariant] || SHADOW_PRESETS[0];
  let dynamicShadow = currentPreset.value.replace(
    /__OPACITY__/g,
    props.shadowOpacity.toString(),
  );

  if (props.isGlassBorder && props.borderWidth > 0) {
    dynamicShadow += `, inset 0 1px 1px rgba(255, 255, 255, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.1)`;
  }

  const innerRadius =
    props.borderWidth > 0
      ? Math.max(0, props.borderRadius - props.borderWidth)
      : props.borderRadius;

  const combinedTransform = props.tilt
    ? `scale(${props.zoom}) rotateX(${props.tiltX}deg) rotateY(${props.tiltY}deg) rotateZ(${props.tiltZ}deg)`
    : `scale(${props.zoom})`;

  // const combinedTransform = props.tilt
  //   ? `scale(${props.zoom * props.previewScale}) rotateX(${props.tiltX}deg) rotateY(${props.tiltY}deg) rotateZ(${props.tiltZ}deg)`
  //   : `scale(${props.zoom * props.previewScale})`;

  const animationClass =
    props.animation !== "none" ? styles[`anim-${props.animation}`] : "";

  const baseStyle = {
    transform: props.animation === "none" ? combinedTransform : undefined,
  } as React.CSSProperties;

  const frameStyle =
    props.mockupCategory === "device"
      ? baseStyle
      : ({
          ...baseStyle,
          borderRadius: `${props.borderRadius}px`,
          boxShadow: dynamicShadow,
          border:
            props.borderWidth > 0
              ? `${props.borderWidth}px solid ${props.borderColor}`
              : "none",
          "--glass-opacity": 0.12,
        } as React.CSSProperties);

  const highResImageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "block",
    ...(props.tilt ? { transform: "translateZ(0)" } : {}),
  };

  // const ratio = ratios.find((r) => r.value === props.aspectRatio);
  // const newAspectRatio =
  //   ratio?.width && ratio?.height ? `${ratio.width} / ${ratio.height}` : "auto";

  // ─── 4. Render ───────────────────────────────────────────
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textRendering: "auto",
        WebkitFontSmoothing: "antialiased",
        position: "relative",
      }}
    >
      {/* ==========================================
          LAYER 1: BACKGROUND (From EditorApp.tsx)
      ========================================== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: props.customBg || "#111827",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {/* If we have an image (either GIF or Static) */}
        {
          props.bgImageRaw ? (
            isGif(props.bgImageRaw) ? (
              // 2. Render GIF using @remotion/gif
              <Gif
                src={props.bgImageRaw}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit:
                    props.bgSize === "auto" ? "none" : (props.bgSize as any),
                  objectPosition: "center",
                  filter: `blur(${props.bgBlur}px)`,
                  transform: `scale(${1 + props.bgBlur / 200}) translate3d(0,0,0)`,
                }}
              />
            ) : (
              // 3. Render Static Images using Remotion's <Img> for render synchronization
              <Img
                src={props.bgImageRaw}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: props.bgSize === "auto" ? "none" : props.bgSize,
                  objectPosition: "center",
                  filter: `blur(${props.bgBlur}px)`,
                  transform: `scale(${1 + props.bgBlur / 200}) translate3d(0,0,0)`,
                  imageRendering: "-webkit-optimize-contrast",
                }}
              />
            )
          ) : null /* If no image, the parent div's customBg color/gradient simply shows through */
        }
      </div>
      {/* ==========================================
          LAYER 2: 3D WINDOW (From Frame.tsx)
      ========================================== */}
      <div
        style={{
          zIndex: 1,
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          perspective: `${1200}px`,
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            width: `${props.previewWidth}px`,
            height: `${props.previewHeight}px`,
            transform: `scale(${props.previewScale})`,
            transformOrigin: "center center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            willChange: props.animation !== "none" ? "transform" : "auto",
          }}
        >
          <div
            style={frameStyle}
            className={`${styles.windowWrapper} ${animationClass} ${!props.isGlassBorder ? styles.noGlass : ""}`}
          >
            <div
              style={{
                borderRadius: `${innerRadius}px`,
                overflow: "hidden",
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              {/* RENDER A: BROWSER */}
              {props.mockupCategory === "browser" && activeBrowserConfig && (
                <>
                  <div style={{ position: "relative", width: "100%" }}>
                    <Img
                      src={activeBrowserConfig.src}
                      style={{ width: "100%", display: "block" }}
                    />
                    {activeBrowserConfig.overlays.map((overlay, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: "absolute",
                          top: overlay.top,
                          left: overlay.left,
                          width: overlay.width,
                          fontSize: overlay.fontSize,
                          color: overlay.color,
                          textAlign: overlay.align as any,
                          fontWeight: overlay.fontWeight || "400",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {overlay.type === "url" ? cleanUrl : displayTitle}
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      position: "relative",
                      flex: 1,
                      minHeight: 0,
                    }}
                  >
                    <Img
                      src={props.imageSourceRaw}
                      style={{
                        ...highResImageStyle,
                        imageRendering: "-webkit-optimize-contrast",
                        WebkitFontSmoothing: "antialiased",
                        height: "auto",
                      }}
                    />
                  </div>
                </>
              )}

              {/* RENDER B: DEVICE */}
              {props.mockupCategory === "device" && activeDeviceConfig && (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: activeDeviceConfig.aspectRatio.toString(),
                  }}
                >
                  {/* 1. Screen Area (Behind Device) */}
                  <div
                    style={{
                      position: "absolute",
                      top: `${props.screenTop}%`,
                      left: `${props.screenLeft}%`,
                      width: `${props.screenWidth}%`,
                      height: `${props.screenHeight}%`,
                      borderRadius:
                        activeDeviceConfig.screen.borderRadius ?? "0px",
                      overflow: "hidden",
                      zIndex: 1,
                    }}
                  >
                    <Img
                      src={props.imageSourceRaw}
                      style={{
                        ...highResImageStyle,
                        imageRendering: "-webkit-optimize-contrast",
                        WebkitFontSmoothing: "antialiased",
                      }}
                    />
                    {/* Annotations specific to Device Screen */}
                    <AnnotationLayerStatic
                      annotations={props.annotations}
                      scale={props.previewScale}
                    />
                  </div>
                  {/* 2. Device Frame (On Top) */}
                  <Img
                    src={activeDeviceConfig.src}
                    style={{
                      ...highResImageStyle,
                      position: "absolute",
                      inset: 0,
                      zIndex: 2,
                      pointerEvents: "none",
                    }}
                  />
                </div>
              )}

              {/* RENDER C: NONE */}
              {props.mockupCategory === "none" && (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Img
                    src={props.imageSourceRaw}
                    style={{
                      ...highResImageStyle,
                      imageRendering: "-webkit-optimize-contrast",
                      WebkitFontSmoothing: "antialiased",
                    }}
                  />
                  <AnnotationLayerStatic
                    annotations={props.annotations}
                    scale={props.previewScale}
                  />
                </div>
              )}

              {/* Browser annotations render over the whole window content */}
              {props.mockupCategory === "browser" && (
                <AnnotationLayerStatic
                  annotations={props.annotations}
                  scale={props.previewScale}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          LAYER 3: WATERMARK (From EditorApp.tsx)
      ========================================== */}
      {props.handle && (
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(10px)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "100px",
            fontSize: "24px",
            fontWeight: 600,
            zIndex: 10,
          }}
        >
          {props.handle.startsWith("@") ? props.handle : `@${props.handle}`}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─── Static Annotation Layer Helper ────────────────────────
// Because Remotion exports are videos, we don't need react-rnd or drag-and-drop.
// We just statically render the annotations at their exact X/Y coordinates!
const AnnotationLayerStatic = ({
  annotations,
  scale = 1,
}: {
  annotations: Annotation[];
  scale?: number;
}) => {
  if (!annotations || annotations.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {annotations.map((ann) => (
        <div
          key={ann.id}
          style={{
            position: "absolute",
            left: `${ann.x * scale}px`,
            top: `${ann.y * scale}px`,
            width: `${ann.width * scale}px`,
            height: `${ann.height * scale}px`,
          }}
        >
          {ann.type === "text" && (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "rgba(255, 255, 255, 0.9)",
                border: `2px solid ${ann.color}`,
                borderRadius: "8px",
                padding: "8px",
                fontSize: `${ann.fontSize || 14}px`,
                fontFamily: ann.fontFamily || "inherit",
                color: "#000",
                whiteSpace: "pre-wrap",
              }}
            >
              {ann.text}
            </div>
          )}
          {ann.type === "box" && (
            <div
              style={{
                width: "100%",
                height: "100%",
                border: `4px solid ${ann.color}`,
                borderRadius: "8px",
              }}
            />
          )}
          {ann.type === "highlight" && (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: ann.color,
                opacity: 0.4,
                borderRadius: "4px",
              }}
            />
          )}
          {/* Add arrow/redact static renders here based on your app's SVGs */}
        </div>
      ))}
    </div>
  );
};
