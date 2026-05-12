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
  const exportRef = useRef<HTMLDivElement>(null);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [pageUrl, setPageUrl] = useState<string>("localhost:5173");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeBg, setActiveBg] = useState(BACKGROUNDS[0]);
  ///
  const [padding, setPadding] = useState(64);
  const [tilt, setTilt] = useState(false);
  const [frameType, setFrameType] = useState<"browser" | "terminal">("browser");
  const [handle, setHandle] = useState("");
  // const [shadowType, setShadowType] = useState<"soft" | "hard">("soft");
  // const [isAscii, setIsAscii] = useState(false);

  const [titleBarColor, setTitleBarColor] = useState("#fdfdfb");
  const [customBg, setCustomBg] = useState("#F7F7F3"); // Default Cream
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [bgBlur, setBgBlur] = useState(0);
  const [bgSize, setBgSize] = useState<"cover" | "contain" | "auto">("cover");

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
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const dynamicBgStyle: React.CSSProperties = {
    background: bgImage ? `url(${bgImage})` : customBg,
    backgroundSize: bgSize,
    backgroundPosition: "center",
    filter: `blur(${bgBlur}px)`,
    transition: "all 0.3s ease",
  };

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

  const usePreset = !isPro || (!bgImage && customBg === "#F7F7F3");

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

      <main className={styles.canvasArea}>
        <div className={styles.exportClipContainer}>
          <div
            ref={exportRef}
            className={styles.exportWrapper}
            style={{ padding: `${padding}px` }}
          >
            {/* THE FIX: Apply the preset class OR the custom style to this div ONLY */}
            <div
              className={`${styles.absoluteBg} ${usePreset ? styles[activeBg.bgKey as keyof typeof styles] : ""}`}
              style={!usePreset ? dynamicBgStyle : {}}
            />

            <Frame
              imageSrc={imageSource!}
              url={pageUrl}
              frameType={frameType}
              tiltEnabled={tilt}
              titleBarColor={titleBarColor}
            />

            {handle && (
              <div className={styles.watermark}>
                {handle.startsWith("@") ? handle : `@${handle}`}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* NEW: Pro Sidebar (Only visible if isPro) */}
      {isPro && (
        <aside className={styles.proPanel}>
          <h3>PRO_CONTROLS</h3>

          <div className={styles.controlGroup}>
            <label>FRAME_TYPE</label>
            <select
              value={frameType}
              onChange={(e) =>
                setFrameType(e.target.value as "browser" | "terminal")
              }
            >
              <option value="browser">BROWSER</option>
              <option value="terminal">TERMINAL</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label>TITLE_BAR_COLOR</label>
            <input
              type="color"
              value={titleBarColor}
              onChange={(e) => setTitleBarColor(e.target.value)}
            />
          </div>

          <div className={styles.controlGroup}>
            <label>CUSTOM_BG_COLOR / GRADIENT</label>
            <input
              type="text"
              placeholder="hex or linear-gradient..."
              value={customBg}
              onChange={(e) => setCustomBg(e.target.value)}
            />
          </div>

          <div className={styles.controlGroup}>
            <label>BG_IMAGE_UPLOAD</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {bgImage && (
              <button
                onClick={() => setBgImage(null)}
                className={styles.smallBtn}
              >
                REMOVE_IMAGE
              </button>
            )}
          </div>

          {bgImage && (
            <>
              <div className={styles.controlGroup}>
                <label>BG_BLUR: {bgBlur}px</label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={bgBlur}
                  onChange={(e) => setBgBlur(Number(e.target.value))}
                />
              </div>
              <div className={styles.controlGroup}>
                <label>BG_SIZE</label>
                <select
                  value={bgSize}
                  onChange={(e) =>
                    setBgSize(e.target.value as "cover" | "contain" | "auto")
                  }
                >
                  <option value="cover">COVER</option>
                  <option value="contain">CONTAIN</option>
                  <option value="auto">ORIGINAL</option>
                </select>
              </div>
            </>
          )}

          <div className={styles.controlGroup}>
            <label>CANVAS_PADDING: {padding}px</label>
            <input
              type="range"
              min="0"
              max="120"
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
            />
          </div>

          <div className={styles.controlGroup}>
            <label>3D_ISOMETRIC_TILT</label>
            <input
              type="checkbox"
              checked={tilt}
              onChange={(e) => setTilt(e.target.checked)}
            />
          </div>

          <div className={styles.controlGroup}>
            <label>SOCIAL_HANDLE</label>
            <input
              type="text"
              placeholder="@yourname"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
            />
          </div>
        </aside>
      )}

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
