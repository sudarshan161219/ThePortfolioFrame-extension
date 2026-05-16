import { useEffect, useState } from "react";
import { Frame } from "./components/frame/Frame.tsx";
import { useControlsStore } from "./store/useControlsStore.ts";
import { SidebarLayout } from "./layout/sidebarLayout/SidebarLayout.tsx";
import { SettingsModal } from "./components/settingsModal/SettingsModal.tsx";
import { ratios } from "./constants/ratios";
import styles from "./EditorApp.module.css";

export const EditorApp = () => {
  const {
    bgImage,
    imageSource,
    customBg,
    activeBg,
    aspectRatio,
    bgBlur,
    bgSize,
    handle,
    setIsPro,
    setPageUrl,
    setImageSource,
  } = useControlsStore();
  // const [tilt, setTilt] = useState({ x: 0, y: 0 });
  // const [isHovering, setIsHovering] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(
      ["tempImageBridge", "tempUrlBridge", "capturedImage", "capturedUrl"],
      (result) => {
        // 2. Prioritize the new bridge, fallback to the old capture method
        const finalImage = result.tempImageBridge || result.capturedImage;
        const finalUrl = result.tempUrlBridge || result.capturedUrl;

        if (finalImage && typeof finalImage === "string") {
          setImageSource(finalImage);
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
  }, [setImageSource, setPageUrl]);

  const dynamicBgStyle: React.CSSProperties = {
    background: bgImage ? `url(${bgImage})` : customBg || "transparent",
    backgroundSize: bgSize,
    backgroundPosition: "center",
    filter: `blur(${bgBlur}px)`,
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
      <SidebarLayout>
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
            />

            <Frame />

            {handle && (
              <div className={styles.watermark}>
                {handle.startsWith("@") ? handle : `@${handle}`}
              </div>
            )}
          </div>
        </div>
      </SidebarLayout>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSuccess={() => setIsPro(true)}
      />
    </div>
  );
};
