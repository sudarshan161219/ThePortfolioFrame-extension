import { useState } from "react";
import { useModalStore } from "../../../store/modalStore/useModalStore";
import { useNavActionsStore } from "../../../store/useNavActionsStore";
import { useControlsStore } from "../../../store/useControlsStore";
import { HtmlInCanvas } from "remotion";
import {
  Image,
  FileImage,
  ScanLine,
  SplinePointer,
  Clipboard,
  ImagePlay,
  Circle,
  Play,
  type LucideIcon,
} from "lucide-react";
import styles from "./index.module.css";

type ExportFormat =
  | "clipboard"
  | "png"
  | "jpeg"
  | "webp"
  | "svg"
  | "gif"
  | "mp4"
  | "webm";

interface Option {
  value: ExportFormat;
  label: string;
  ext?: string;
  desc: string;
  tier: "free" | "new" | "pro";
  icon: LucideIcon;
  group: "quick" | "image" | "motion";
  isPro?: boolean;
}

const OPTIONS: Option[] = [
  {
    value: "clipboard",
    label: "Copy to clipboard",
    desc: "Paste directly into Notion, Figma, Slack, or any app",
    tier: "free",
    icon: Clipboard,
    group: "quick",
  },
  {
    value: "png",
    label: ".png",
    ext: "png",
    desc: "Lossless — best for screenshots with sharp text",
    tier: "free",
    icon: Image,
    group: "image",
  },
  {
    value: "jpeg",
    label: ".jpg",
    ext: "jpg",
    desc: "Smaller file size, slight compression — good for sharing",
    tier: "free",
    icon: FileImage,
    group: "image",
  },
  {
    value: "webp",
    label: ".webp",
    ext: "webp",
    desc: "Modern format — smaller than PNG, better than JPEG",
    tier: "new",
    icon: ScanLine,
    group: "image",
  },
  {
    value: "svg",
    label: ".svg",
    ext: "svg",
    desc: "Browser-ready vector format (not compatible with Figma/Illustrator)",
    tier: "pro",
    icon: SplinePointer,
    group: "image",
    isPro: true,
  },
  {
    value: "gif",
    label: ".gif",
    ext: "gif",
    desc: "Animated export — plays anywhere, limited palette",
    tier: "free",
    icon: ImagePlay,
    group: "motion",
  },
  {
    value: "mp4",
    label: ".mp4",
    ext: "mp4",
    desc: "High-quality video loop — great for Twitter / X posts",
    tier: "free",
    icon: Play,
    group: "motion",
  },
  {
    value: "webm",
    label: ".webm",
    ext: "webm",
    desc: "Smallest file size, alpha channel support",
    tier: "pro",
    icon: Circle,
    group: "motion",
    isPro: true,
  },
];

const GROUPS: { key: Option["group"]; label: string }[] = [
  { key: "quick", label: "Quick action" },
  { key: "image", label: "Images" },
  { key: "motion", label: "Motion" },
];

export const ExportModal = () => {
  const {
    isPro,
    exportQuality,
    setExportQuality,
    jpegQuality,
    setJpegQuality,
  } = useControlsStore();
  const { triggerExport, isExporting, exportProgress } = useNavActionsStore();
  const { isOpen, type, closeModal, openModal } = useModalStore();
  const [selected, setSelected] = useState<ExportFormat>("png");
  const [isHtmlCanvasSupported] = useState(() => HtmlInCanvas.isSupported());

  if (!isOpen || type !== "EXPORT") return null;

  const selectedOption = OPTIONS.find((o) => o.value === selected)!;
  const isMotion =
    selected === "gif" || selected === "mp4" || selected === "webm";

  const exportLabel = () => {
    if (isExporting) {
      return isMotion
        ? `Encoding… ${Math.round(exportProgress * 100)}%`
        : "Exporting…";
    }
    return selected === "clipboard"
      ? "Copy to clipboard"
      : `Export ${selectedOption.ext ? `.${selectedOption.ext}` : ""}`;
  };

  const handleSelect = (opt: Option) => {
    if (isExporting) return;
    if (opt.isPro && !isPro) {
      openModal("SETTINGS");
      return;
    }
    setSelected(opt.value);
  };

  const handleExport = async () => {
    if (isExporting) return;
    await triggerExport(selected);
    if (selected === "clipboard") closeModal();
  };

  const showQuality = selected !== "svg" && !isMotion;
  const showSlider = selected === "jpeg" || selected === "webp";

  return (
    <div
      className={`${styles.overlay} ${styles.exportModal}`}
      onClick={!isExporting ? closeModal : undefined}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.title}>Export</span>
          <button
            className={styles.closeBtn}
            onClick={closeModal}
            disabled={isExporting}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable options list */}
        <div className={styles.body}>
          {GROUPS.map((group, gi) => {
            const opts = OPTIONS.filter((o) => o.group === group.key);
            return (
              <div key={group.key}>
                {gi > 0 && <div className={styles.divider} />}
                <span className={styles.groupLabel}>{group.label}</span>
                {opts.map((opt) => {
                  const locked = opt.isPro && !isPro;
                  const isSelected = selected === opt.value;
                  return (
                    <button
                      key={opt.value}
                      className={[
                        styles.card,
                        isSelected ? styles.selected : "",
                        locked || isExporting ? styles.disabled : "",
                      ].join(" ")}
                      onClick={() => handleSelect(opt)}
                    >
                      <div className={styles.icon}>
                        {/* <i className={`ti ${opt.icon}`} aria-hidden="true" /> */}
                        <opt.icon size={14} strokeWidth={1.5} />
                      </div>

                      <div className={styles.info}>
                        <div className={styles.labelRow}>
                          <span className={styles.label}>{opt.label}</span>
                          <span
                            className={`${styles.badge} ${styles[`badge_${opt.tier}`]}`}
                          >
                            {opt.tier === "free"
                              ? "Free"
                              : opt.tier === "new"
                                ? "New"
                                : "Pro"}
                          </span>
                        </div>

                        {/* Description — always rendered, animated via CSS */}
                        <div
                          className={`${styles.desc} ${isSelected ? styles.descVisible : ""}`}
                        >
                          {opt.value === "mp4" && !isHtmlCanvasSupported ? (
                            <>
                              Enable{" "}
                              <code>chrome://flags/#canvas-draw-element</code>{" "}
                              for pixel-perfect export
                            </>
                          ) : (
                            opt.desc
                          )}
                        </div>
                      </div>

                      {locked && (
                        <span className={styles.lock} aria-hidden="true">
                          🔒
                        </span>
                      )}
                      <div className={styles.radio}>
                        <div className={styles.radioDot} />
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Settings panel — anchored below the scroll */}
        {(showQuality || showSlider) && (
          <div className={styles.settings}>
            {showQuality && (
              <div className={styles.settingsRow}>
                <span className={styles.settingLabel}>Resolution</span>
                <div className={styles.qualityToggle}>
                  <button
                    className={`${styles.qualityBtn} ${exportQuality === 1 ? styles.active : ""}`}
                    onClick={() => setExportQuality(1)}
                    disabled={isExporting}
                  >
                    1x <span className={styles.qualitySubtext}>(Standard)</span>
                  </button>
                  <button
                    className={`${styles.qualityBtn} ${exportQuality === 2 ? styles.active : ""}`}
                    onClick={() => setExportQuality(2)}
                    disabled={isExporting}
                  >
                    2x <span className={styles.qualitySubtext}>(High)</span>
                  </button>
                </div>
              </div>
            )}

            {showSlider && (
              <div className={styles.settingsRow}>
                <span className={styles.settingLabel}>Quality</span>
                <div className={styles.sliderGroup}>
                  <span className={styles.sliderValue}>
                    {Math.round(jpegQuality * 100)}%
                  </span>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={jpegQuality}
                    onChange={(e) => setJpegQuality(parseFloat(e.target.value))}
                    className={styles.rangeSlider}
                    disabled={isExporting}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Progress bar — motion exports only */}
        {isExporting && isMotion && (
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${Math.round(exportProgress * 100)}%` }}
            />
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <button
            className={styles.cancelBtn}
            onClick={closeModal}
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            className={`${styles.exportBtn} ${isExporting ? styles.exporting : ""}`}
            onClick={handleExport}
            disabled={isExporting}
          >
            {exportLabel()}
          </button>
        </div>
      </div>
    </div>
  );
};
