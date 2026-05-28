import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  spring,
  useVideoConfig,
  Img,
} from "remotion";
import { Gif } from "@remotion/gif";

// Constants (Adjust import paths to match your project)
import { SHADOW_PRESETS } from "../../constants/shadow_presets";
import { BROWSER_MOCKUP_CONFIG } from "../../constants/browser_mockup_config";
import { DEVICE_MOCKUPS } from "../../constants/Device_mockup_config";
import { type Annotation } from "../../store/useControlsStore"; // Or wherever your types are

// 1. The Props Interface (Matches your Zustand AppState perfectly)
export interface RemotionFrameProps {
  imageSource: string;
  bgImage: string | null;
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

  animation: string;
  annotations: Annotation[];
}

export const RemotionFrame: React.FC<RemotionFrameProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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

  // ─── 3. Remotion Math Animations ─────────────────────────
  const baseScale = spring({
    frame,
    fps,
    config: { damping: 12 },
    from: 0.8,
    to: props.zoom,
  });

  // Recreate CSS animations using JS Math
  let animatedScale = baseScale;
  let floatY = 0;

  if (props.animation === "breathe") {
    animatedScale = baseScale + Math.sin(frame / 10) * 0.02;
  } else if (props.animation === "float") {
    floatY = Math.sin(frame / 15) * 15;
  }

  const combinedTransform = props.tilt
    ? `scale(${animatedScale}) translateY(${floatY}px) rotateX(${props.tiltX}deg) rotateY(${props.tiltY}deg) rotateZ(${props.tiltZ}deg)`
    : `scale(${animatedScale}) translateY(${floatY}px)`;

  // ─── 4. Render ───────────────────────────────────────────
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontStretch: "normal",
        textRendering: "auto",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* ==========================================
          LAYER 1: BACKGROUND (From EditorApp.tsx)
      ========================================== */}
      {/* <div
        style={{
          position: "absolute",
          inset: -100, // Overscan slightly to prevent edge gaps on blur
          zIndex: 0,
          background: props.bgImage ? `url(${props.bgImage})` : props.customBg,
          backgroundSize: props.bgSize,
          backgroundPosition: "center",
          filter: `blur(${props.bgImage ? props.bgBlur : 0}px)`,
          transform: props.bgImage
            ? `scale(${1 + props.bgBlur / 200})`
            : undefined,
        }}
      /> */}

      <div
        style={{
          position: "absolute",
          inset: -100, // Overscan slightly to prevent edge gaps on blur
          zIndex: 0,
          background: props.customBg || "#111827", // Base fallback color
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 🚀 FIX 2: Use Remotion Tags instead of CSS background-image */}
        {props.bgImage &&
          (isGif(props.bgImage) ? (
            <Gif
              src={props.bgImage}
              style={{
                width: "100%",
                height: "100%",
                objectFit: props.bgSize === "auto" ? "none" : props.bgSize, // "auto" isn't a valid objectFit
                filter: `blur(${props.bgBlur}px)`,
                transform: `scale(${1 + props.bgBlur / 200})`,
              }}
            />
          ) : (
            <Img
              src={props.bgImage}
              style={{
                width: "100%",
                height: "100%",
                objectFit: props.bgSize === "auto" ? "none" : props.bgSize,
                filter: `blur(${props.bgBlur}px)`,
                transform: `scale(${1 + props.bgBlur / 200})`,
              }}
            />
          ))}
      </div>

      {/* ==========================================
          LAYER 2: 3D WINDOW (From Frame.tsx)
      ========================================== */}
      <div
        style={{
          zIndex: 1,
          perspective: "1200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            transform: combinedTransform,
            transformStyle: "preserve-3d",
            borderRadius:
              props.mockupCategory !== "device"
                ? `${props.borderRadius}px`
                : "0px",
            boxShadow:
              props.mockupCategory !== "device" ? dynamicShadow : "none",
            border:
              props.mockupCategory !== "device" && props.borderWidth > 0
                ? `${props.borderWidth}px solid ${props.borderColor}`
                : "none",
            backgroundColor:
              props.mockupCategory !== "none" ? "transparent" : "#fff",
            position: "relative",
            width: "1200px", // Base rendering resolution
            display: "flex",
            flexDirection: "column",
          }}
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
                <div style={{ width: "100%", position: "relative" }}>
                  {isGif(props.imageSource) ? (
                    <Gif
                      src={props.imageSource}
                      style={{ width: "100%", display: "block" }}
                    />
                  ) : (
                    <Img
                      src={props.imageSource}
                      style={{ width: "100%", display: "block" }}
                    />
                  )}
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
                  {isGif(props.imageSource) ? (
                    <Gif
                      src={props.imageSource}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "top center",
                      }}
                    />
                  ) : (
                    <Img
                      src={props.imageSource}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "top center",
                      }}
                    />
                  )}
                  {/* Annotations specific to Device Screen */}
                  <AnnotationLayerStatic annotations={props.annotations} />
                </div>
                {/* 2. Device Frame (On Top) */}
                <Img
                  src={activeDeviceConfig.src}
                  style={{
                    width: "100%",
                    height: "100%",
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
              <div style={{ position: "relative", width: "100%" }}>
                {isGif(props.imageSource) ? (
                  <Gif
                    src={props.imageSource}
                    style={{ width: "100%", display: "block" }}
                  />
                ) : (
                  <Img
                    src={props.imageSource}
                    style={{ width: "100%", display: "block" }}
                  />
                )}
                <AnnotationLayerStatic annotations={props.annotations} />
              </div>
            )}

            {/* Browser annotations render over the whole window content */}
            {props.mockupCategory === "browser" && (
              <AnnotationLayerStatic annotations={props.annotations} />
            )}
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
}: {
  annotations: Annotation[];
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
            left: `${ann.x}px`,
            top: `${ann.y}px`,
            width: `${ann.width}px`,
            height: `${ann.height}px`,
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
