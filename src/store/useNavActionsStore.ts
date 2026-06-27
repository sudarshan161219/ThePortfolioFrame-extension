import { create } from "zustand";
import { type AppState, useControlsStore } from "./useControlsStore";
// import {
//   resolveCanvasDimensions,
//   renderBackgroundLayer,
// } from "../helpers/exportLayers/backgroundLayer";
// import { generateMockupCanvas } from "../helpers/exportLayers/mockupRenderer";
// import { DEVICE_MOCKUPS } from "../constants/Device_mockup_config";
// import { BROWSER_MOCKUP_CONFIG } from "../constants/browser_mockup_config";
// import { parseBoxShadow } from "../helpers/exportLayers/parseBoxShadow";
import { toBlob, toJpeg, toSvg } from "html-to-image";
import { ratios } from "../constants/ratios";
// import { HtmlInCanvas } from "remotion";

// ── Types ────────────────────────────────────────────────

type ExportFormat =
  | "clipboard"
  | "png"
  | "jpeg"
  | "webp"
  | "svg"
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

async function exportToClipboard(el: HTMLElement): Promise<void> {
  const { toBlob } = await import("html-to-image");
  const blob = await toBlob(el, { pixelRatio: 3 });
  if (!blob) throw new Error("Failed to generate blob for clipboard.");
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}

const BASE_WIDTH = 1920;

const calculatePixelRatio = (appState: AppState, domWidth: number) => {
  const currentRatio = ratios.find((r) => r.value === appState.aspectRatio);
  const exportScale = appState.exportQuality || 1;

  // Add `currentRatio.width == null` to catch both null and undefined widths
  if (
    !currentRatio ||
    currentRatio.value === "auto" ||
    currentRatio.width == null
  ) {
    const naturalW = appState.imageNaturalWidth || domWidth;
    const targetWidth = Math.max(BASE_WIDTH, naturalW);
    return (targetWidth / domWidth) * exportScale;
  }

  // TypeScript now knows for a fact that currentRatio.width is a number
  const isHighDensityPreset = currentRatio.width >= BASE_WIDTH * 1.5;
  const scale = isHighDensityPreset ? 1 : exportScale;

  return (currentRatio.width / domWidth) * scale;
};

/**
 * Handles the creation and cleanup of a temporary anchor tag for downloading.
 */
const triggerDownload = (blob: Blob, format: string) => {
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = downloadUrl;
  anchor.download = `portfolio-frame.${format === "jpeg" ? "jpg" : format}`;
  anchor.click();

  // Cleanup memory safely after download initiates
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
};

// export
export async function exportImage(
  format: "png" | "jpeg" | "webp" | "svg",
): Promise<void> {
  // 1. Grab the exact DOM node
  const targetNode = document.getElementById("portfolio-export-target");

  if (!targetNode) {
    console.error("Export failed: target node not found in DOM.");
    // TIP: Add a UI toast notification here so the user knows it failed!
    return;
  }

  // 2. Fetch State & Calculate Dimensions
  const appState = useControlsStore.getState();
  const finalPixelRatio = calculatePixelRatio(appState, targetNode.offsetWidth);
  const jpegQuality = appState.jpegQuality || 0.95;

  // 3. Configure Export Options
  const exportOptions = {
    pixelRatio: finalPixelRatio,
    quality: format === "jpeg" || format === "webp" ? jpegQuality : undefined,
    skipFonts: false,
    // Safely exclude UI controls from the final image
    filter: (node: HTMLElement) =>
      !node?.classList?.contains("ignore-on-export"),
  };

  try {
    let blob: Blob | null = null;

    // 4. Generate the Image
    if (format === "jpeg") {
      const dataUrl = await toJpeg(targetNode, exportOptions);
      blob = await (await fetch(dataUrl)).blob();
    } else if (format === "svg") {
      // html-to-image returns SVGs as a dataUrl string
      const dataUrl = await toSvg(targetNode, exportOptions);
      blob = await (await fetch(dataUrl)).blob();
    } else {
      blob = await toBlob(targetNode, exportOptions);
    }

    if (!blob) {
      throw new Error("Blob generation returned null");
    }

    // 5. Fire Download
    triggerDownload(blob, format);
  } catch (error) {
    console.error("Failed to export image via SVG/DOM capture:", error);
  }
}

// The Remotion Video Exporter
// The New Node.js Server Exporter
async function exportVideo(
  format: "mp4" | "webm",
  onProgress: (progress: number) => void,
  targetWidth: number,
  targetHeight: number,
): Promise<void> {
  const appState = useControlsStore.getState();

  if (!appState.imageSourceRaw) {
    console.error("Cannot export video: No raw image source found.");
    return;
  }

  // Ensure dimensions are even for H.264 encoding requirements
  const videoWidth = targetWidth % 2 !== 0 ? targetWidth + 1 : targetWidth;
  const videoHeight = targetHeight % 2 !== 0 ? targetHeight + 1 : targetHeight;

  const exportTarget = document.getElementById("portfolio-export-target");
  const previewWidth = exportTarget?.clientWidth ?? 1280;
  const previewHeight = exportTarget?.clientHeight ?? 720;
  const previewScale = videoWidth / previewWidth;

  // --- GIF DETECTION ---
  // If a GIF is detected, extend the duration so it has time to loop
  const isGif = appState.bgImageRaw?.startsWith("data:image/gif");
  const durationInFrames = isGif ? 180 : 120; // 6 seconds vs 4 seconds at 30fps

  // Clean the state to remove non-serializable functions before sending over HTTP
  const serializableProps = Object.fromEntries(
    Object.entries(appState).filter(
      ([_, value]) => typeof value !== "function",
    ),
  ) as Record<string, unknown>;

  // Inject backend-specific rendering metadata
  serializableProps.previewWidth = previewWidth;
  serializableProps.previewHeight = previewHeight;
  serializableProps.previewScale = previewScale;
  serializableProps.videoWidth = videoWidth;
  serializableProps.videoHeight = videoHeight;
  serializableProps.durationInFrames = durationInFrames;

  // 1. Setup the AbortController for manual user cancellations
  const abortController = new AbortController();

  try {
    // Optional: Simulate a progress bar for the UI since standard HTTP doesn't natively stream progress
    let simulatedProgress = 0;
    const progressInterval = setInterval(() => {
      simulatedProgress += 0.05;
      if (simulatedProgress < 0.9) onProgress(simulatedProgress);
    }, 1000);

    // 2. The Handshake: Send the massive payload to your local Node instance
    const response = await fetch("http://localhost:3001/api/export-video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        state: serializableProps,
        licenseKey: "sk_test_12345",
      }),
      signal: abortController.signal,
    });

    clearInterval(progressInterval);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to render video on server.");
    }

    onProgress(1); // Force progress to 100% on completion

    // 3. Receive the streamed MP4 and convert to a downloadable Blob
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    download(url, FILENAME(format));

    // Memory cleanup: destroy the object URL
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log(
        "[🛑] Export cancelled by user. Server kill switch triggered.",
      );
    } else {
      console.error("[The Portfolio Frame] Server Render Error:", error);
    }
    throw error;
  }
}

// ── Store ────────────────────────────────────────────────

export const useNavActionsStore = create<NavActionsState>()((set) => ({
  isExporting: false,
  exportProgress: 0,

  triggerExport: async (format: ExportFormat) => {
    const needsDOM = ["clipboard", "png", "jpeg", "webp", "svg"].includes(
      format,
    );
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
        case "svg":
          await exportImage(format);
          break;
        case "mp4":
        case "webm": {
          // Grab state from your central controls store
          const { aspectRatio, imageNaturalWidth, imageNaturalHeight } =
            useControlsStore.getState();
          const ratio = ratios.find((r) => r.value === aspectRatio);

          const TARGET_WIDTH = 1920; // High-res base
          let TARGET_HEIGHT = 1080; // Default fallback

          if (ratio && ratio.value !== "auto") {
            // If a standard aspect ratio preset is active (e.g., 16:9, 4:5, 1:1)
            if (ratio.height && ratio.width) {
              TARGET_HEIGHT = Math.round(
                (TARGET_WIDTH * ratio.height) / ratio.width,
              );
            }
          } else {
            // "auto" mode: Match the exact aspect ratio of the raw captured screenshot
            const naturalWidth = imageNaturalWidth || 1920;
            const naturalHeight = imageNaturalHeight || 1080;
            TARGET_HEIGHT = Math.round(
              (TARGET_WIDTH * naturalHeight) / naturalWidth,
            );
          }

          await exportVideo(format, onProgress, TARGET_WIDTH, TARGET_HEIGHT);
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
