import { useEffect, useRef } from "react";
import { Frame } from "./components/frame/Frame.tsx";
import { useControlsStore } from "./store/useControlsStore.ts";
import { ratios } from "./constants/ratios";
import { base64ToBlob } from "./helpers/base64ToBlob.ts";
import styles from "./EditorApp.module.css";

export const EditorApp = () => {
  const bgImage = useControlsStore((s) => s.bgImage);
  const imageSource = useControlsStore((s) => s.imageSource);
  const customBg = useControlsStore((s) => s.customBg);
  const activeBg = useControlsStore((s) => s.activeBg);
  const aspectRatio = useControlsStore((s) => s.aspectRatio);
  const bgBlur = useControlsStore((s) => s.bgBlur);
  const bgSize = useControlsStore((s) => s.bgSize);
  const handle = useControlsStore((s) => s.handle);
  const setPageUrl = useControlsStore((s) => s.setPageUrl);
  const setImageSource = useControlsStore((s) => s.setImageSource);
  const setImageSourceRaw = useControlsStore((s) => s.setImageSourceRaw);

  const prevImageUrl = useRef<string | null>(null);

  useEffect(() => {
    chrome.storage.local.get(
      ["tempImageBridge", "tempUrlBridge", "capturedImage", "capturedUrl"],
      (result) => {
        // 2. Prioritize the new bridge, fallback to the old capture method
        const finalImage = result.tempImageBridge || result.capturedImage;
        const finalUrl = result.tempUrlBridge || result.capturedUrl;

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

        // 3. Destroy ONLY the bridge data so it's fresh for next time
        if (result.tempImageBridge) {
          chrome.storage.local.remove(["tempImageBridge", "tempUrlBridge"]);
        }
      },
    );
    return () => {
      if (prevImageUrl.current) URL.revokeObjectURL(prevImageUrl.current);
    };
  }, [setImageSource, setImageSourceRaw, setPageUrl]);

  const dynamicBgStyle: React.CSSProperties = {
    background: bgImage ? `url(${bgImage})` : customBg,
    backgroundSize: bgSize,
    backgroundPosition: "center",
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

          <Frame />

          {handle && (
            <div className={styles.watermark}>
              {handle.startsWith("@") ? handle : `@${handle}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
