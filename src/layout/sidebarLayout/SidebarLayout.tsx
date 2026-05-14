import { Nav } from "../../components/nav/Nav";
import { useControllsStore } from "../../store/useControllsStore";
import styles from "./index.module.css";

interface SidebarLayoutProps {
  children?: React.ReactNode;
}

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

const PREMIUM_TITLE_BARS = [
  {
    name: "Classic Light",
    bg: "#FDFDFB",
    border: "#EAEAEA",
    inputBg: "rgba(0, 0, 0, 0.05)",
    inputText: "#111827",
  },
  {
    name: "macOS Silver",
    bg: "#E3E3E3",
    border: "#C9C9C9",
    inputBg: "rgba(255, 255, 255, 0.4)",
    inputText: "#111827",
  },
  {
    name: "Obsidian",
    bg: "#1E1E1E",
    border: "#111111",
    inputBg: "rgba(255, 255, 255, 0.1)",
    inputText: "#F3F4F6",
  },
  {
    name: "GitHub Dark",
    bg: "#161B22",
    border: "#0D1117",
    inputBg: "rgba(255, 255, 255, 0.08)",
    inputText: "#C9D1D9",
  },
  {
    name: "Vercel Pitch",
    bg: "#000000",
    border: "#333333",
    inputBg: "rgba(255, 255, 255, 0.12)",
    inputText: "#EDEDED",
  },
  {
    name: "Slate",
    bg: "#0F172A",
    border: "#020617",
    inputBg: "rgba(255, 255, 255, 0.08)",
    inputText: "#F8FAFC",
  },
  {
    name: "Midnight Blue",
    bg: "#0B132B",
    border: "#060B19",
    inputBg: "rgba(255, 255, 255, 0.1)",
    inputText: "#E2E8F0",
  },
  {
    name: "Hacker Green",
    bg: "#0D1F16",
    border: "#06120B",
    inputBg: "rgba(16, 185, 129, 0.1)",
    inputText: "#10B981",
  }, // Neon green text
  {
    name: "Lavender Dark",
    bg: "#1A1625",
    border: "#100D1A",
    inputBg: "rgba(255, 255, 255, 0.08)",
    inputText: "#E9D5FF",
  },
  {
    name: "Rose Gold",
    bg: "#F9EAE9",
    border: "#E5D1D0",
    inputBg: "rgba(0, 0, 0, 0.04)",
    inputText: "#4C0519",
  },
];

const TERMINAL_PRESETS = [
  {
    name: "Linux Fish (Default)",
    value: " mark-one       0ms   00:00 PM   ",
  },
  { name: "macOS Zsh", value: "   ~/portfolio   main  " },
  { name: "Node Minimal", value: "󰎙 src ❯  v20.11.0 ❯  main ❯" },
  { name: "Windows PS", value: " PS C:\\Dev\\app   master ≡ " },
  { name: "Cyberpunk", value: "󰆍 root@sys  󰉖 /api/v1  󰞷 compiled  " },
];

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const {
    isPro,
    titleBarTheme,
    tilt,
    frameType,
    bgImage,
    customBg,
    bgBlur,
    bgSize,
    padding,
    handle,
    activeBg,

    settitleBarTheme,
    setTilt,
    setFrameType,

    setBgImage,
    setCustomBg,
    setBgBlur,
    setBgSize,
    setPadding,
    setHandle,

    setActiveBg,
    setTerminalPath,
  } = useControllsStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBgImage(url);
  };

  const handleBgSelect = (bg: (typeof BACKGROUNDS)[0]) => {
    if (bg.isPro && !isPro) {
      // Trigger the upsell if they aren't pro
      // setIsSettingsOpen(true);
      console.log("s");
    } else {
      setActiveBg(bg);

      // THE FIX: Clear custom values so the preset can take priority!
      setBgImage(null);
      setCustomBg("");
    }
  };

  return (
    <div className={styles.root}>
      {/* Pro sidebar */}
      <aside className={styles.proPanel}>
        <div className={styles.logo}>
          <div
            className={`${styles.logoDot} ${isPro ? styles.logoDotActive : ""}`}
          />
          <div>
            <span className={styles.logoText}>The Portfolio Frame</span>
            <span className={styles.logoVersion}>v1.0.0</span>
          </div>
        </div>

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
          <label>TERMINAL_STYLE</label>
          <select
            onChange={(e) => setTerminalPath(e.target.value)}
            /* Keep the value tied to the text input so it updates if they type custom text! */
          >
            <option value="" disabled>
              Select a preset...
            </option>
            {TERMINAL_PRESETS.map((preset) => (
              <option key={preset.name} value={preset.value}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label>TITLE_BAR_THEME</label>
          <div className={styles.titleBarGrid}>
            {PREMIUM_TITLE_BARS.map((theme) => {
              const isActive = titleBarTheme.bg === theme.bg;

              const titleBarThemeObj = {
                bg: theme.bg,
                borderColor: theme.border,
                urlpathBg: theme.inputBg,
                urlpathText: theme.inputText,
              };

              return (
                <button
                  key={theme.name}
                  onClick={() => settitleBarTheme(titleBarThemeObj)}
                  className={`${styles.titleBarSwatch} ${isActive ? styles.activeSwatch : ""}`}
                  title={theme.name}
                  aria-label={theme.name}
                  style={{
                    backgroundColor: theme.bg,
                    borderBottomColor: theme.border,
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label>PRESET_BACKGROUNDS</label>
          <div className={styles.sidebarBgGrid}>
            {BACKGROUNDS.map((bg) => {
              const isLocked = bg.isPro && !isPro;
              const isActive = activeBg?.id === bg.id;
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
                    <span
                      className={bg.isPro ? styles.proPill : styles.freePill}
                    >
                      {bg.isPro ? "Pro" : "Free"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
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

      {/* Main canvas area */}
      <main className={styles.main}>
        <Nav />
        <div className={styles.canvas}>{children}</div>
      </main>
    </div>
  );
};
