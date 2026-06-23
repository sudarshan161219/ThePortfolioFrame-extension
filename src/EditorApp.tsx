import { useEffect, useRef } from "react";
import { Frame } from "./components/frame/Frame.tsx";
import { useControlsStore } from "./store/useControlsStore.ts";
import { ratios } from "./constants/ratios";
import { base64ToBlob } from "./helpers/base64ToBlob.ts";
// import { GlassOverlay } from "./components/glassLayer/GlassLayer.tsx";
import styles from "./EditorApp.module.css";

export const EditorApp = () => {
  const bgImage = useControlsStore((s) => s.bgImage);
  const imageSource = useControlsStore((s) => s.imageSource);
  const customBg = useControlsStore((s) => s.customBg);
  const activeBg = useControlsStore((s) => s.activeBg);
  const aspectRatio = useControlsStore((s) => s.aspectRatio);
  const bgBlur = useControlsStore((s) => s.bgBlur);
  const setIsPro = useControlsStore((s) => s.setIsPro);
  const bgScale = useControlsStore((s) => s.bgScale);
  const bgPositionX = useControlsStore((s) => s.bgPositionX);
  const bgPositionY = useControlsStore((s) => s.bgPositionY);
  // const handle = useControlsStore((s) => s.handle);
  const isPro = useControlsStore((s) => s.isPro);
  const setPageUrl = useControlsStore((s) => s.setPageUrl);
  const setImageSource = useControlsStore((s) => s.setImageSource);
  const setImageSourceRaw = useControlsStore((s) => s.setImageSourceRaw);
  const showWatermark = useControlsStore((s) => s.showWatermark);
  const watermarkText = useControlsStore((s) => s.watermarkText);
  const watermarkTheme = useControlsStore((s) => s.watermarkTheme);
  const watermarkFont = useControlsStore((s) => s.watermarkFont);
  const watermarkColor = useControlsStore((s) => s.watermarkColor);

  const prevImageUrl = useRef<string | null>(null);

  useEffect(() => {
    chrome.storage.local.get(
      ["tempImageBridge", "tempUrlBridge", "capturedImage", "capturedUrl"],
      (result) => {
        // 1. Prioritize the new bridge, fallback to the old capture method
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
        } else {
          console.warn(
            "[The Portfolio Frame] No valid image found in storage.",
          );
        }

        if (finalUrl && typeof finalUrl === "string") {
          setPageUrl(finalUrl);
        }

        // 2. THE FIX: Transfer bridge data to permanent storage before destroying it
        if (result.tempImageBridge) {
          chrome.storage.local.set(
            {
              capturedImage: result.tempImageBridge,
              capturedUrl: result.tempUrlBridge || result.capturedUrl,
            },
            () => {
              // 3. Now it is safe to destroy the bridge data
              chrome.storage.local.remove(["tempImageBridge", "tempUrlBridge"]);
            },
          );
        }
      },
    );

    return () => {
      if (prevImageUrl.current) URL.revokeObjectURL(prevImageUrl.current);
    };
  }, [setImageSource, setImageSourceRaw, setIsPro, setPageUrl]);

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
          <Frame />

          {/* {handle && (
            <div className={styles.watermark}>
              {handle.startsWith("@") ? handle : `@${handle}`}
            </div>
          )} */}

          {(!isPro || showWatermark) && (
            <div
              className={`${styles.watermark} ${
                // Force "Glass" theme for Free users, let Pro users pick
                !isPro
                  ? styles.watermarkGlass
                  : styles[
                      `watermark${watermarkTheme.charAt(0).toUpperCase() + watermarkTheme.slice(1)}`
                    ]
              }`}
              style={{
                fontFamily: !isPro
                  ? '"JetBrains Mono", monospace'
                  : watermarkFont,
                color: !isPro ? "#ffffff" : watermarkColor,
                fontWeight: !isPro ? 600 : 500, // Adjust weight as needed
              }}
            >
              {!isPro ? "✨ Made with AppName" : watermarkText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
