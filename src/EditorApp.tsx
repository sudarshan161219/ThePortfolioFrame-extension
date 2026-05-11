import { useEffect, useState, useRef } from "react";
import { toPng } from "html-to-image";
import { Frame } from "./components/frame/Frame.tsx";
import { StarIcon, DownloadIcon } from "lucide-react";
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
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [pageUrl, setPageUrl] = useState<string>("localhost:5173");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [activeBg, setActiveBg] = useState(BACKGROUNDS[0]);

  const exportRef = useRef<HTMLDivElement>(null);

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
  }, []);

  const handleExport = async () => {
    if (!exportRef.current) return;

    try {
      setIsExporting(true);

      // pixelRatio: 2 ensures the output is high-res (Retina quality)
      const dataUrl = await toPng(exportRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });

      // Create a temporary link to trigger the download
      const link = document.createElement("a");
      link.download = `portfolio-frame-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("[The Portfolio Frame] Export failed:", err);
    } finally {
      setIsExporting(false);
    }
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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <div
            className={`${styles.logoDot} ${isPro ? styles.logoDotActive : ""}`}
          />
          <div>
            <span className={styles.logoText}>The Portfolio Frame</span>
            <span className={styles.logoVersion}>v1.0.0</span>
          </div>
        </div>

        <div className={styles.headerControls}>
          {!isPro ? (
            <button
              className={styles.upgradeBtn}
              onClick={() => setIsSettingsOpen(true)}
            >
              <StarIcon />
              Upgrade to Pro
            </button>
          ) : (
            <span className={styles.proBadge}>
              <span className={styles.proDot} />
              Pro Active
            </span>
          )}

          <div className={styles.sep} />

          <button
            className={`${styles.exportBtn} ${isExporting ? styles.exporting : ""}`}
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <span className={styles.spinner} />
                Processing...
              </>
            ) : (
              <>
                <DownloadIcon />
                Export PNG
              </>
            )}
          </button>
        </div>
      </header>

      <main
        className={`${styles.canvasArea} ${styles[activeBg.bgKey as keyof typeof styles]}`}
      >
        {/*  macOS Frame component  */}
        <div
          ref={exportRef}
          className={`${styles.exportWrapper} ${styles[activeBg.bgKey as keyof typeof styles]}`}
        >
          <Frame imageSrc={imageSource} url={pageUrl} />
        </div>
      </main>

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
