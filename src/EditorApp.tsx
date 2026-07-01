import { useEffect, useRef } from "react";
import { Frame } from "./components/frame/Frame.tsx";
import { useControlsStore } from "./store/useControlsStore.ts";
import { ratios } from "./constants/ratios";
import { base64ToBlob } from "./helpers/base64ToBlob.ts";
// import { GlassOverlay } from "./components/glassLayer/GlassLayer.tsx";
import { detectLanguage } from "./utils/detectLanguage.ts";
import { CodeWindow } from "./components/codeWindow/CodeWindow";
import { getDisplayUrl } from "./utils/formatUrl.ts";
import QRCode from "react-qr-code";
import styles from "./EditorApp.module.css";

const SOCIAL_ICONS = {
  x: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  github: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
    </svg>
  ),
  linkedin: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  ),
  instagram: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
};

export const EditorApp = () => {
  const bgImage = useControlsStore((s) => s.bgImage);
  const imageSource = useControlsStore((s) => s.imageSource);
  const pageUrl = useControlsStore((s) => s.pageUrl);
  const pageTitle = useControlsStore((s) => s.pageTitle);
  const customBg = useControlsStore((s) => s.customBg);
  const activeBg = useControlsStore((s) => s.activeBg);
  const aspectRatio = useControlsStore((s) => s.aspectRatio);
  const bgBlur = useControlsStore((s) => s.bgBlur);
  const setIsPro = useControlsStore((s) => s.setIsPro);
  const bgScale = useControlsStore((s) => s.bgScale);
  const bgPositionX = useControlsStore((s) => s.bgPositionX);
  const bgPositionY = useControlsStore((s) => s.bgPositionY);
  const isPro = useControlsStore((s) => s.isPro);
  const setPageUrl = useControlsStore((s) => s.setPageUrl);
  const setImageSource = useControlsStore((s) => s.setImageSource);
  const setImageSourceRaw = useControlsStore((s) => s.setImageSourceRaw);
  const showWatermark = useControlsStore((s) => s.showWatermark);
  const watermarkType = useControlsStore((s) => s.watermarkType);
  const watermarkQrContent = useControlsStore((s) => s.watermarkQrContent);
  const watermarkLogo = useControlsStore((s) => s.watermarkLogo);
  const watermarkSocialPlatform = useControlsStore(
    (s) => s.watermarkSocialPlatform,
  );
  const watermarkText = useControlsStore((s) => s.watermarkText);
  const watermarkTheme = useControlsStore((s) => s.watermarkTheme);
  const watermarkFont = useControlsStore((s) => s.watermarkFont);
  const watermarkColor = useControlsStore((s) => s.watermarkColor);
  const watermarkRadius = useControlsStore((s) => s.watermarkRadius);
  const watermarkFontSize = useControlsStore((s) => s.watermarkFontSize);

  const watermarkTiled = useControlsStore((s) => s.watermarkTiled);
  const tiledTheme = useControlsStore((s) => s.tiledTheme);
  const tiledOpacity = useControlsStore((s) => s.tiledOpacity);
  const tiledAngle = useControlsStore((s) => s.tiledAngle);
  const tiledFontSize = useControlsStore((s) => s.tiledFontSize);
  const tiledSpacing = useControlsStore((s) => s.tiledSpacing);

  const showContextBadge = useControlsStore((s) => s.showContextBadge);
  const contextBadgeText = useControlsStore((s) => s.contextBadgeText);
  const badgePosition = useControlsStore((s) => s.badgePosition);
  const badgeTheme = useControlsStore((s) => s.badgeTheme);
  const badgeRadius = useControlsStore((s) => s.badgeRadius);
  const badgeFontSize = useControlsStore((s) => s.badgeFontSize);
  const badgeIconType = useControlsStore((s) => s.badgeIconType);
  const badgeIconValue = useControlsStore((s) => s.badgeIconValue);

  const editorMode = useControlsStore((s) => s.editorMode);
  const framePadding = useControlsStore((s) => s.framePadding);

  const setEditorMode = useControlsStore((s) => s.setEditorMode);
  const setCodeSnippet = useControlsStore((s) => s.setCodeSnippet);
  const setCodeLanguage = useControlsStore((s) => s.setCodeLanguage);

  const viewportZoom = useControlsStore((s) => s.viewportZoom);


  const prevImageUrl = useRef<string | null>(null);

  useEffect(() => {
    // Expand the requested keys to include our code bridges
    chrome.storage.local.get(
      [
        "tempImageBridge",
        "tempUrlBridge",
        "capturedImage",
        "capturedUrl",
        "tempCodeBridge",
        "tempModeBridge",
      ],
      (result) => {
        // --- 1. HANDLE CONTEXT MENU TEXT ARRIVAL ---
        if (
          result.tempCodeBridge &&
          typeof result.tempCodeBridge === "string"
        ) {
          const incomingCode = result.tempCodeBridge;

          setCodeSnippet(incomingCode);
          setEditorMode("code");
          setIsPro(true);
          // Auto-detect code rules on the fly
          const inlineLang = detectLanguage(incomingCode);
          setCodeLanguage(inlineLang);

          if (
            result.tempUrlBridge &&
            typeof result.tempUrlBridge === "string"
          ) {
            setPageUrl(result.tempUrlBridge);
          }

          setIsPro(true);
        }

        // --- 2. FALLBACK TO EXISTING IMAGE CAPTURE LOGIC ---
        const finalImage = result.tempImageBridge || result.capturedImage;
        const finalUrl = result.tempUrlBridge || result.capturedUrl;
        setIsPro(true);

        if (finalImage && typeof finalImage === "string") {
          if (prevImageUrl.current) URL.revokeObjectURL(prevImageUrl.current);

          const blob = base64ToBlob(finalImage);
          const objectUrl = URL.createObjectURL(blob);
          prevImageUrl.current = objectUrl;
          setImageSource(objectUrl);
          setImageSourceRaw(finalImage);
          setEditorMode("image"); // Ensure it drops back into screenshot layout
        } else {
          console.warn("[The Portfolio Frame] No valid asset data found.");
        }

        if (finalUrl && typeof finalUrl === "string") {
          setPageUrl(finalUrl);
        }

        if (result.tempImageBridge) {
          chrome.storage.local.set(
            {
              capturedImage: result.tempImageBridge,
              capturedUrl: result.tempUrlBridge || result.capturedUrl,
            },
            () => {
              chrome.storage.local.remove(["tempImageBridge", "tempUrlBridge"]);
            },
          );
        }
      },
    );

    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string,
    ) => {
      if (areaName === "local" && changes.tempCodeBridge?.newValue) {
        // New code just arrived from the popup!
        const incomingCode = changes.tempCodeBridge.newValue;
        if (incomingCode && typeof incomingCode === "string") {
          setCodeSnippet(incomingCode);
          setEditorMode("code");
          setCodeLanguage(detectLanguage(incomingCode));
        }
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
      if (prevImageUrl.current) URL.revokeObjectURL(prevImageUrl.current);
    };
  }, [
    setImageSource,
    setImageSourceRaw,
    setIsPro,
    setPageUrl,
    setEditorMode,
    setCodeSnippet,
    setCodeLanguage,
  ]);

  const dynamicBgStyle: React.CSSProperties = {
    background: bgImage ? `url(${bgImage}) no-repeat` : customBg,
    backgroundSize: `${bgScale * 100}%`,
    backgroundPosition: `${bgPositionX}% ${bgPositionY}%`,
    backgroundRepeat: "no-repeat",
    filter: `blur(${bgImage && bgBlur}px)`,
    transform: bgImage ? `scale(${1 + bgBlur / 200})` : undefined,
    transition: "all 0.3s ease",
  };
  if (!imageSource) {
    return (
      <div className={styles.loadingState}>
        <span>[ INIT ] Awaiting capture data...</span>
      </div>
    );
  }

  const usePreset = !bgImage && !customBg;

  const ratio = ratios.find((r) => r.value === aspectRatio);
  const newAspectRatio =
    ratio?.width && ratio?.height ? `${ratio.width} / ${ratio.height}` : "auto";

  const cleanUrl = pageUrl.replace(/^https?:\/\//, "").replace(/^www\./, "");
  const displayTitle =
    pageTitle.trim() !== "" ? pageTitle : cleanUrl.split("/")[0];

  // The Smart Variable Engine
  const parseSmartVariables = (text: string) => {
    if (!text) return "";
    return text
      .replace(/{url}/g, cleanUrl)
      .replace(/{title}/g, displayTitle)
      .replace(
        /{date}/g,
        new Date().toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      );
  };

  const getBadgePositionStyles = (): React.CSSProperties => {
    switch (badgePosition) {
      case "top-left":
        return { top: "24px", left: "24px" };
      case "top-right":
        return { top: "24px", right: "24px" };
      case "bottom-left":
        return { bottom: "24px", left: "24px" };
      case "bottom-right":
        return { bottom: "24px", right: "24px" };
      default:
        return { bottom: "24px", left: "24px" };
    }
  };

  const renderBadgeIcon = () => {
    if (badgeIconType === "none") return null;

    if (badgeIconType === "dot") {
      return (
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: badgeIconValue || "#34D399",
            display: "inline-block",
            marginRight: "6px",
            boxShadow: `0 0 8px ${badgeIconValue || "#34D399"}80`, // Glow effect
          }}
        />
      );
    }
    if (badgeIconType === "emoji") {
      return (
        <span style={{ marginRight: "6px", fontSize: "1.1em", lineHeight: 1 }}>
          {badgeIconValue || "🚀"}
        </span>
      );
    }
    if (badgeIconType === "custom" && badgeIconValue) {
      return (
        <img
          src={badgeIconValue}
          alt="Custom Icon"
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            objectFit: "cover",
            marginRight: "6px",
          }}
        />
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.exportClipContainer}>
        <div
          id="portfolio-export-target"
          className={styles.exportWrapper}
          data-auto={ratio?.value === "auto"}
          data-bg={true}
          style={
            {
              "--w": ratio?.width,
              "--h": ratio?.height,
              "--ratio": newAspectRatio,
            } as React.CSSProperties
          }
        >
          <div
            className={`${styles.absoluteBg} ${
              usePreset ? styles[activeBg?.bgKey as keyof typeof styles] : ""
            }`}
            style={!usePreset ? dynamicBgStyle : {}}
            data-bg="true"
          />
          {/* <GlassOverlay /> */}
          {/* --- THE MAIN CONTENT (IMAGE OR CODE) --- */}
          {editorMode === "image" ? (
            <Frame />
          ) : (
            <div
              style={{
                padding: `${framePadding}px`,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition: "padding 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  transform: `scale(${viewportZoom})`,
                  transformOrigin: "center center",
                  transition: "transform 0.2s ease",
                }}
              >
                <CodeWindow />
              </div>
            </div>
          )}

          {/* --- BUILD CONTEXT BADGE (Bottom Left) --- */}
          {showContextBadge && (
            <div
              // We recycle the awesome watermark theme classes here!
              className={`${styles.watermark} ${styles[`watermark${badgeTheme.charAt(0).toUpperCase() + badgeTheme.slice(1)}`]}`}
              style={{
                ...getBadgePositionStyles(),
                fontFamily: '"JetBrains Mono", monospace',
                borderRadius: `${badgeRadius}px`,
                fontSize: `${badgeFontSize}px`,
                color:
                  badgeTheme === "light" ? "#111" : "rgba(255, 255, 255, 0.85)",
              }}
            >
              {renderBadgeIcon()}
              <span style={{ transform: "translateY(0.5px)" }}>
                {parseSmartVariables(contextBadgeText)}
              </span>
            </div>
          )}

          {/* --- IP PROTECTION: TILED PATTERN OVERLAY --- */}
          {isPro && watermarkTiled && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 40,
                // Use nullish coalescing to guarantee it never fails if state is undefined
                opacity: tiledOpacity ?? 0.15,
                mixBlendMode: tiledTheme === "overlay" ? "overlay" : "normal",
              }}
            >
              <svg width="100%" height="100%">
                <defs>
                  <pattern
                    id="tiled-watermark"
                    x="0"
                    y="0"
                    width={tiledSpacing || 250}
                    height={(tiledSpacing || 250) * 0.6}
                    patternUnits="userSpaceOnUse"
                    patternTransform={`rotate(${tiledAngle ?? -30})`}
                  >
                    <text
                      // THE FIX: Strict math instead of "50%" prevents rendering bugs
                      x={(tiledSpacing || 250) / 2}
                      y={((tiledSpacing || 250) * 0.6) / 2}
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fill={
                        tiledTheme === "outline"
                          ? "none"
                          : watermarkColor || "#ffffff"
                      }
                      stroke={
                        tiledTheme === "outline"
                          ? watermarkColor || "#ffffff"
                          : "none"
                      }
                      strokeWidth={tiledTheme === "outline" ? "1.5" : "0"}
                      style={{
                        fontFamily: watermarkFont || "system-ui, sans-serif",
                        fontSize: `${tiledFontSize || 18}px`,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                      }}
                    >
                      {/* THE FIX: Force uppercase via JS instead of CSS */}
                      {(
                        parseSmartVariables(watermarkText) || "PROTECTED"
                      ).toUpperCase()}
                    </text>
                  </pattern>
                </defs>
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="url(#tiled-watermark)"
                />
              </svg>
            </div>
          )}

          {/* --- WATERMARK LOGIC --- */}
          {(!isPro || showWatermark) && (
            <div
              className={`${styles.watermark} ${
                !isPro
                  ? styles.watermarkGlass
                  : styles[
                      `watermark${watermarkTheme.charAt(0).toUpperCase() + watermarkTheme.slice(1)}`
                    ]
              }`}
              style={{
                bottom: "24px",
                right: "24px",
                fontFamily: !isPro
                  ? '"JetBrains Mono", monospace'
                  : watermarkFont,
                color: !isPro ? "#ffffff" : watermarkColor,
                fontWeight: !isPro ? 600 : 500,
                borderRadius: !isPro ? "999px" : `${watermarkRadius}px`,
                fontSize: !isPro ? "13px" : `${watermarkFontSize}px`,
                padding:
                  watermarkType === "logo" && watermarkTheme === "transparent"
                    ? 0
                    : undefined,
              }}
            >
              {!isPro ? (
                "✨ Made with AppName"
              ) : watermarkType === "logo" && watermarkLogo ? (
                <img
                  src={watermarkLogo}
                  alt="Custom Logo"
                  style={{
                    maxHeight: "24px",
                    width: "auto",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              ) : watermarkType === "social" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {
                    SOCIAL_ICONS[
                      watermarkSocialPlatform as keyof typeof SOCIAL_ICONS
                    ]
                  }
                  {/* Parse variables here */}
                  <span style={{ transform: "translateY(0.5px)" }}>
                    {parseSmartVariables(watermarkText) || "@yourhandle"}
                  </span>
                </div>
              ) : watermarkType === "qr" ? (
                /* --- THE NEW QR CODE RENDERER --- */
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {/* The white safe-zone box to ensure scannability */}
                  <div
                    style={{
                      background: "#ffffff",
                      padding: "4px",
                      borderRadius: "6px",
                      display: "flex",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <QRCode
                      value={
                        parseSmartVariables(watermarkQrContent) ||
                        "https://yourdomain.com"
                      }
                      size={36} /* Nice compact size */
                      level="L" /* Low error correction for a cleaner, less dense pattern */
                      fgColor="#000000"
                      bgColor="transparent"
                    />
                  </div>
                  {/* Call to action block */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      lineHeight: 1.1,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75em",
                        opacity: 0.7,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontWeight: 700,
                      }}
                    >
                      Scan to visit
                    </span>
                    <span style={{ transform: "translateY(1px)" }}>
                      {parseSmartVariables(watermarkText) ||
                        getDisplayUrl(pageUrl)}
                    </span>
                  </div>
                </div>
              ) : (
                /* Parse variables here */
                parseSmartVariables(watermarkText) || "Your Text"
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
