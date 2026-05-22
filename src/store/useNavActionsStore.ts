import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";
import { toPng, toJpeg, toBlob } from "html-to-image";
import html2canvas from "html2canvas";

// ── Types ────────────────────────────────────────────────

type ExportFormat =
  | "clipboard"
  | "png"
  | "jpeg"
  | "webp"
  | "gif"
  | "mp4"
  | "webm";

interface NavActionsState {
  isExporting: boolean;
  exportProgress: number; // 0–1, only used for gif/video
  triggerExport: (format: ExportFormat) => Promise<void>;
}

// ── Chrome Storage Engine ────────────────────────────────

const chromeStorage: StateStorage = {
  getItem: async (name) =>
    new Promise((resolve) => {
      chrome.storage.local.get(name, (result) => {
        resolve((result[name] as string) || null);
      });
    }),
  setItem: async (name, value) =>
    new Promise<void>((resolve) => {
      chrome.storage.local.set({ [name]: value }, resolve);
    }),
  removeItem: async (name) =>
    new Promise<void>((resolve) => {
      chrome.storage.local.remove(name, resolve);
    }),
};

// ── Helpers ──────────────────────────────────────────────

const TARGET_ID = "portfolio-export-target";
const FILENAME = (ext: string) => `portfolio-frame-${Date.now()}.${ext}`;

function download(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}

function getTarget(): HTMLElement | null {
  const el = document.getElementById(TARGET_ID);
  if (!el) console.error("[The Portfolio Frame] Export target not found.");
  return el;
}

// ── Export functions ─────────────────────────────────────

async function exportToClipboard(el: HTMLElement): Promise<void> {
  const blob = await toBlob(el, { pixelRatio: 3 });
  if (!blob) throw new Error("Failed to generate blob for clipboard.");
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}

async function exportImage(
  el: HTMLElement,
  format: "png" | "jpeg" | "webp",
): Promise<void> {
  if (format === "png") {
    const url = await toPng(el, { quality: 1.0, pixelRatio: 3 });
    download(url, FILENAME("png"));
    return;
  }

  if (format === "jpeg") {
    const url = await toJpeg(el, { quality: 0.95, pixelRatio: 3 });
    download(url, FILENAME("jpg"));
    return;
  }

  if (format === "webp") {
    const canvas = await html2canvas(el, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      scale: 3,
    });
    canvas.toBlob(
      (blob) => {
        if (!blob) throw new Error("WebP conversion failed.");
        const url = URL.createObjectURL(blob);
        download(url, FILENAME("webp"));
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      },
      "image/webp",
      0.92,
    );
  }
}

// ── Store ────────────────────────────────────────────────

export const useNavActionsStore = create<NavActionsState>()(
  persist(
    (set) => ({
      isExporting: false,
      exportProgress: 0,

      triggerExport: async (format: ExportFormat) => {
        const el = getTarget();
        if (!el) return;

        // const onProgress = (p: number) => set({ exportProgress: p });

        try {
          set({ isExporting: true, exportProgress: 0 });

          switch (format) {
            case "clipboard":
              await exportToClipboard(el);
              break;
            case "png":
            case "jpeg":
            case "webp":
              await exportImage(el, format);
              break;
          }
        } catch (err) {
          console.error(
            `[The Portfolio Frame] Export (${format}) failed:`,
            err,
          );
        } finally {
          set({ isExporting: false, exportProgress: 0 });
        }
      },
    }),
    {
      name: "portfolio-nav-storage",
      storage: createJSONStorage(() => chromeStorage),
      partialize: ({ isExporting, exportProgress, ...rest }) => rest,
    },
  ),
);
