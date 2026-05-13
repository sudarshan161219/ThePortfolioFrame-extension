import { useEffect, useState } from "react";
// import { toPng } from "html-to-image";
import { Frame } from "./components/frame/Frame.tsx";
import { useControllsStore } from "./store/useControllsStore.ts";

import { SidebarLayout } from "./layout/sidebarLayout/SidebarLayout.tsx";
import { SettingsModal } from "./components/settingsModal/SettingsModal.tsx";

import styles from "./EditorApp.module.css";

const BACKGROUNDS = [
  {
    id: "free-noise-glass",
    name: "Noise Glass",
    isPro: false,
    bgKey: "bgNoiseGlass",
  },
  {
    id: "free-mesh-gradient",
    name: "Mesh Gradient",
    isPro: false,
    bgKey: "bgMeshGradient",
  },
  {
    id: "pro-contour-lines",
    name: "Contour Lines",
    isPro: true,
    bgKey: "bgContourLines",
  },
  {
    id: "pro-aurora-bands",
    name: "Aurora Bands",
    isPro: true,
    bgKey: "bgAuroraBands",
  },
  {
    id: "pro-carbon-fiber",
    name: "Carbon Fiber",
    isPro: true,
    bgKey: "bgCarbonFiber",
  },
  {
    id: "pro-scanline-haze",
    name: "Scanline Haze",
    isPro: true,
    bgKey: "bgScanlineHaze",
  },
];

export const EditorApp = () => {
  // const exportRef = useRef<HTMLDivElement>(null);

  const {
    isPro,
    bgImage,
    imageSource,
    customBg,
    bgBlur,
    bgSize,
    padding,
    handle,
    setIsPro,
    setPageUrl,
    setImageSource,
  } = useControllsStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeBg, setActiveBg] = useState(BACKGROUNDS[0]);

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
    background: bgImage ? `url(${bgImage})` : customBg,
    backgroundSize: bgSize,
    backgroundPosition: "center",
    filter: `blur(${bgBlur}px)`,
    transition: "all 0.3s ease",
  };

  const handleBgSelect = (bg: (typeof BACKGROUNDS)[0]) => {
    if (bg.isPro && !isPro) {
      // Trigger the upsell if they aren't pro
      setIsSettingsOpen(true);
    } else {
      setActiveBg(bg);
    }
  };

  if (!imageSource) {
    return (
      <div className={styles.loadingState}>
        <span>[ INIT ] Awaiting capture data...</span>
      </div>
    );
  }

  const usePreset = !isPro || (!bgImage && customBg === "#F7F7F3");

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
              className={`${styles.absoluteBg} ${usePreset ? styles[activeBg.bgKey as keyof typeof styles] : ""}`}
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
      <footer className={styles.toolbar}>
        <span className={styles.toolbarLabel}>Background</span>
        <div className={styles.divider} />
        <div className={styles.bgList}>
          {BACKGROUNDS.map((bg) => {
            const isLocked = bg.isPro && !isPro;
            const isActive = activeBg.id === bg.id;
            return (
              <div key={bg.id} className={styles.swatchGroup}>
                <button
                  onClick={() => !isLocked && handleBgSelect(bg)}
                  className={`${styles.swatch} ${styles[bg.bgKey as keyof typeof styles]} ${isActive ? styles.active : ""} ${isLocked ? styles.locked : ""}`}
                  title={bg.name}
                  aria-label={bg.name}
                  disabled={isLocked}
                >
                  {isLocked && <div className={styles.lockOverlay}>🔒</div>}
                </button>
                <div className={styles.swatchMeta}>
                  <span className={styles.swatchName}>
                    {bg.name.split(" ")[0]}
                  </span>
                  <span className={bg.isPro ? styles.proPill : styles.freePill}>
                    {bg.isPro ? "Pro" : "Free"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.divider} />
        {/* {!isPro && (
          <button className={styles.upgradeBtn} onClick={handleUpgrade}>
            Upgrade to Pro
          </button>
        )} */}
      </footer>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSuccess={() => setIsPro(true)}
      />
    </div>
  );
};
