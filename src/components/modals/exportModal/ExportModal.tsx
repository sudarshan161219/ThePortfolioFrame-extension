import { useState } from "react";
import { useModalStore } from "../../../store/modalStore/useModalStore";
import { useNavActionsStore } from "../../../store/useNavActionsStore";
import { useControlsStore } from "../../../store/useControlsStore";
import styles from "./index.module.css";

type ExportFormat =
  | "clipboard"
  | "png"
  | "jpeg"
  | "webp"
  | "gif"
  | "mp4"
  | "webm";

interface Option {
  value: ExportFormat;
  label: string;
  ext?: string;
  desc: string;
  tier: "free" | "new" | "pro";
  icon: string;
  group: "quick" | "image" | "motion";
  isPro?: boolean;
}

const OPTIONS: Option[] = [
  {
    value: "clipboard",
    label: "Copy to clipboard",
    desc: "Paste directly into Notion, Figma, Slack, or any app",
    tier: "free",
    icon: "ti-clipboard",
    group: "quick",
  },
  {
    value: "png",
    label: ".png",
    ext: "png",
    desc: "Lossless — best for screenshots with sharp text",
    tier: "free",
    icon: "ti-photo",
    group: "image",
  },
  {
    value: "jpeg",
    label: ".jpg",
    ext: "jpg",
    desc: "Smaller file size, slight compression — good for sharing",
    tier: "free",
    icon: "ti-file-type-jpg",
    group: "image",
  },
  {
    value: "webp",
    label: ".webp",
    ext: "webp",
    desc: "Modern format — smaller than PNG, better than JPEG",
    tier: "new",
    icon: "ti-photo-scan",
    group: "image",
  },

  {
    value: "gif",
    label: ".gif",
    ext: "gif",
    desc: "Animated export — plays anywhere, limited palette",
    tier: "free",
    icon: "ti-player-record",
    group: "motion",
  },
  {
    value: "mp4",
    label: ".mp4",
    ext: "mp4",
    desc: "High-quality video loop — great for Twitter / X posts",
    tier: "free",
    icon: "ti-player-play",
    group: "motion",
  },
  {
    value: "webm",
    label: ".webm",
    ext: "webm",
    desc: "Smallest file size, alpha channel support",
    tier: "pro",
    icon: "ti-player-record",
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
  const { isPro } = useControlsStore();
  const { triggerExport, isExporting, exportProgress } = useNavActionsStore();
  const { isOpen, type, closeModal, openModal } = useModalStore();
  const [selected, setSelected] = useState<ExportFormat>("png");

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
      : `Export .${selectedOption.ext}`;
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

  return (
    <div
      className={styles.overlay}
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

        {/* Options */}
        <div className={styles.body}>
          {GROUPS.map((group, gi) => {
            const opts = OPTIONS.filter((o) => o.group === group.key);
            return (
              <div key={group.key}>
                {gi > 0 && <div className={styles.divider} />}
                <span className={styles.groupLabel}>{group.label}</span>
                {opts.map((opt) => {
                  const locked = opt.isPro && !isPro;
                  return (
                    <button
                      key={opt.value}
                      className={`${styles.card} ${selected === opt.value ? styles.selected : ""} ${locked ? styles.disabled : ""} ${isExporting ? styles.disabled : ""}`}
                      onClick={() => handleSelect(opt)}
                    >
                      <div className={styles.icon}>
                        <i className={`ti ${opt.icon}`} aria-hidden="true" />
                      </div>
                      <div className={styles.info}>
                        <div className={styles.label}>
                          {opt.label}
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
                        <div className={styles.desc}>{opt.desc}</div>
                      </div>
                      {locked && <span className={styles.lock}>🔒</span>}
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

        {/* Progress bar — only visible during motion exports */}
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
