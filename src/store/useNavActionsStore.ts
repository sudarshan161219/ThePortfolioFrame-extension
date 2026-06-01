import { create } from "zustand";
import { useControlsStore } from "./useControlsStore";

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
  const { toBlob } = await import("html-to-image");
  const blob = await toBlob(el, { pixelRatio: 3 });
  if (!blob) throw new Error("Failed to generate blob for clipboard.");
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}

async function exportImage(
  el: HTMLElement,
  format: "png" | "jpeg" | "webp",
): Promise<void> {
  const options = {
    pixelRatio: 3,
    width: el.offsetWidth,
    height: el.offsetHeight,
    style: {
      overflow: "hidden",
    },
  };

  if (format === "png") {
    const { toPng } = await import("html-to-image");
    const url = await toPng(el, { ...options, pixelRatio: 3 });
    download(url, FILENAME("png"));
    return;
  }

  if (format === "jpeg") {
    const { toJpeg } = await import("html-to-image");
    const url = await toJpeg(el, { ...options, pixelRatio: 3 });
    download(url, FILENAME("jpg"));
    return;
  }

  if (format === "webp") {
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(el, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      scale: 3,
      ...options,
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
  const [{ renderMediaOnWeb }, { RemotionFrame }] = await Promise.all([
    import("@remotion/web-renderer"),
    import("../components/remotionFrame/RemotionFrame"),
  ]);

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
    console.warn("Failed to parse aspect ratio, falling back to 16:9", err);
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

  if (appState.bgImageRaw) {
    serializableProps.bgImageRaw = appState.bgImageRaw;
  }

  if (appState.imageSourceRaw) {
    serializableProps.imageSourceRaw = appState.imageSourceRaw;
  }

  const isGif = appState.bgImageRaw?.startsWith("data:image/gif");

  const abortController = new AbortController();

  try {
    // Trigger the WebCodecs render
    const { getBlob } = await renderMediaOnWeb({
      composition: {
        id: "PortfolioMockup",
        component: RemotionFrame, // We will build this next!
        durationInFrames: isGif ? 180 : 120, // 4 seconds at 30fps
        fps: 30,
        width: videoWidth,
        height: videoHeight,
      } as any,
      // Remotion components must be pure. Pass the Zustand state as props here!
      inputProps: serializableProps,
      container: format,
      videoCodec: format === "mp4" ? "h264" : "vp8",
      audioCodec: "opus", // explicit — stops the AAC fallback warning
      muted: true,
      // 3. Connect Remotion's progress directly to your Zustand store
      onProgress: ({ progress }) => {
        onProgress(progress);
      },
    });

    // Download the final video
    const blob = await getBlob();

    // Release the large base64 strings immediately after render
    serializableProps.imageSourceRaw = null;
    serializableProps.bgImageRaw = null;

    const url = URL.createObjectURL(blob);
    download(url, FILENAME(format));
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    if (abortController.signal.aborted) {
      console.log("[The Portfolio Frame] Render was cancelled.");
    } else {
      throw error;
    }
  } finally {
    abortController.abort();
  }
}

// ── Store ────────────────────────────────────────────────

export const useNavActionsStore = create<NavActionsState>()((set) => ({
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
      console.error(`[The Portfolio Frame] Export (${format}) failed:`, err);
    } finally {
      set({ isExporting: false, exportProgress: 0 });
    }
  },
}));
