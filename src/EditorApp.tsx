import { useEffect, useState } from "react";
// import { toPng } from "html-to-image";
import { Frame } from "./components/frame/Frame.tsx";
import { useControllsStore } from "./store/useControllsStore.ts";

import { SidebarLayout } from "./layout/sidebarLayout/SidebarLayout.tsx";
import { SettingsModal } from "./components/settingsModal/SettingsModal.tsx";

import styles from "./EditorApp.module.css";

export const EditorApp = () => {
  // const exportRef = useRef<HTMLDivElement>(null);

  const {
    bgImage,
    imageSource,
    customBg,
    activeBg,
    bgBlur,
    bgSize,
    padding,
    handle,
    setIsPro,
    setPageUrl,
    setImageSource,
  } = useControllsStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // const [shadowType, setShadowType] = useState<"soft" | "hard">("soft");
  // const [isAscii, setIsAscii] = useState(false);

  // const renderAscii = (imgElement: HTMLImageElement) => {};

  useEffect(() => {
    chrome.storage.local.get(
      ["capturedImage", "isPro", "capturedUrl"],
      (result) => {
        if (result.isPro) setIsPro(true);

        const image = result.capturedImage;
        const url = result.capturedUrl;

        if (url && typeof url === "string") {
          setPageUrl(url);
        }

        if (image && typeof image === "string") {
          setImageSource(image);

          // chrome.storage.local.remove("capturedImage");
        } else {
          console.warn(
            "[The Portfolio Frame] No valid image found in storage.",
          );
        }
      },
    );
  }, [setImageSource, setIsPro, setPageUrl]);

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

  // const usePreset = !isPro || (!bgImage && customBg === "#F7F7F3");
  const usePreset = !bgImage && !customBg;
  console.log("editor", activeBg);

  return (
    <div className={styles.container}>
      <SidebarLayout>
        <div className={styles.exportClipContainer}>
          <div
            id="portfolio-export-target"
            className={styles.exportWrapper}
            style={{ padding: `${padding}px` }}
          >
            {/* THE FIX: Apply the preset class OR the custom style to this div ONLY */}
            <div
              className={`${styles.absoluteBg} ${usePreset ? styles[activeBg?.bgKey as keyof typeof styles] : ""}`}
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

        <main className={styles.canvasArea}></main>
      </SidebarLayout>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSuccess={() => setIsPro(true)}
      />
    </div>
  );
};
