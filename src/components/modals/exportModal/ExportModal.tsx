import { useState } from "react";
import styles from "./ExportModal.module.css";

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

interface ExportModalProps {
  isOpen: boolean;
  isPro: boolean;
  onClose: () => void;
  onExport: (format: ExportFormat) => void;
  onUpgrade: () => void;
}

export const ExportModal = ({
  isOpen,
  isPro,
  onClose,
  onExport,
  onUpgrade,
}: ExportModalProps) => {
  const [selected, setSelected] = useState<ExportFormat>("png");

  if (!isOpen) return null;

  const selectedOption = OPTIONS.find((o) => o.value === selected)!;
  const exportLabel =
    selected === "clipboard"
      ? "Copy to clipboard"
      : `Export .${selectedOption.ext}`;

  const handleSelect = (opt: Option) => {
    if (opt.isPro && !isPro) {
      onUpgrade();
      return;
    }
    setSelected(opt.value);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>Export</span>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

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
                      className={`${styles.card} ${selected === opt.value ? styles.selected : ""} ${locked ? styles.disabled : ""}`}
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

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.exportBtn}
            onClick={() => onExport(selected)}
          >
            {exportLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
