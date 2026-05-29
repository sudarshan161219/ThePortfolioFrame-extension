import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";
import { toPng, toJpeg, toBlob } from "html-to-image";
import html2canvas from "html2canvas";
import { renderMediaOnWeb } from "@remotion/web-renderer";
import { useControlsStore } from "./useControlsStore";
import { RemotionFrame } from "../components/remotionFrame/RemotionFrame";

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

// The Remotion Video Exporter
async function exportVideo(
  format: "mp4" | "webm",
  onProgress: (progress: number) => void,
  previewContainerWidth: number,
): Promise<void> {
  // 1. Grab the current state from your controls store to feed into Remotion
  const appState = useControlsStore.getState();

  if (!appState.imageSource) {
    console.error("Cannot export video: No image source found.");
    return;
  }

  let videoHeight = 1080;
  let videoWidth = 1920;

  try {
    if (appState.aspectRatio && appState.aspectRatio !== "auto") {
      const parts = appState.aspectRatio.split("/");

      // Ensure it actually split into exactly two pieces (e.g., ["16", "9"])
      if (parts.length === 2) {
        const ratioW = parseFloat(parts[0].trim());
        const ratioH = parseFloat(parts[1].trim());

        // Only do the math if both are perfectly valid numbers
        if (!isNaN(ratioW) && !isNaN(ratioH) && ratioH !== 0) {
          videoWidth = Math.round(videoHeight * (ratioW / ratioH));

          // H264 Codec Safety: Must be an even number
          if (videoWidth % 2 !== 0) videoWidth += 1;
        }
      }
    }
  } catch (err) {
    console.warn("Failed to parse aspect ratio, falling back to 16:9");
  }

  if (isNaN(videoWidth) || videoWidth <= 0) videoWidth = 1920;
  if (isNaN(videoHeight) || videoHeight <= 0) videoHeight = 1080;

  const previewScale = videoWidth / previewContainerWidth;

  const serializableProps = Object.fromEntries(
    Object.entries(appState).filter(
      ([_, value]) => typeof value !== "function",
    ),
  ) as Record<string, unknown>;

  serializableProps.previewScale = previewScale;

  // 2. Trigger the WebCodecs render
  const { getBlob } = await renderMediaOnWeb({
    composition: {
      id: "PortfolioMockup",
      component: RemotionFrame, // We will build this next!
      durationInFrames: 120, // 4 seconds at 30fps
      fps: 30,
      width: videoWidth,
      height: videoHeight,
    } as any,
    // Remotion components must be pure. Pass the Zustand state as props here!
    inputProps: serializableProps,
    container: format,
    videoCodec: format === "mp4" ? "h264" : "vp8",
    // 3. Connect Remotion's progress directly to your Zustand store
    onProgress: ({ progress }) => {
      onProgress(progress);
    },
  });

  // 4. Download the final video
  const blob = await getBlob();
  const url = URL.createObjectURL(blob);
  download(url, FILENAME(format));
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ── Store ────────────────────────────────────────────────

export const useNavActionsStore = create<NavActionsState>()(
  persist(
    (set) => ({
      isExporting: false,
      exportProgress: 0,

      triggerExport: async (format: ExportFormat) => {
        const needsDOM = ["clipboard", "png", "jpeg", "webp"].includes(format);
        const el = needsDOM ? getTarget() : null;
        if (needsDOM && !el) return;

        const onProgress = (p: number) => set({ exportProgress: p });

        try {
          set({ isExporting: true, exportProgress: 0 });

          switch (format) {
            case "clipboard":
              await exportToClipboard(el!);
              break;
            case "png":
            case "jpeg":
            case "webp":
              await exportImage(el!, format);
              break;
            case "mp4":
            case "webm": {
              const previewEl = document.getElementById(
                "remotion-preview-container",
              );
              const previewContainerWidth = previewEl?.clientWidth ?? 1280;
              await exportVideo(format, onProgress, previewContainerWidth);
              break;
            }
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
