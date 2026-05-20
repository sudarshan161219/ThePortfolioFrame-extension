import { useCallback, useRef, useState } from "react";
import { GIFEncoder, quantize, applyPalette } from "gifenc";
import html2canvas from "html2canvas";

interface UseGifExportOptions {
  targetId: string;
  fps?: number; // default 15
  duration?: number; // ms, default 3000
}

export function useGifExport({
  targetId,
  fps = 15,
  duration = 3000,
}: UseGifExportOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0); // 0–1
  const abortRef = useRef(false);

  const exportGif = useCallback(async () => {
    const el = document.getElementById(targetId);
    if (!el) return;

    abortRef.current = false;
    setIsRecording(true);
    setProgress(0);

    const interval = 1000 / fps;
    const totalFrames = Math.floor((duration / 1000) * fps);
    const gif = GIFEncoder();

    try {
      for (let i = 0; i < totalFrames; i++) {
        if (abortRef.current) break;

        const canvas = await html2canvas(el, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          scale: 1, // keep 1 for perf; user can bump to 2
        });

        const ctx = canvas.getContext("2d")!;
        const { width, height } = canvas;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data; // Uint8ClampedArray, RGBA

        // gifenc needs Uint8Array of indexed colors
        const palette = quantize(data, 256);
        const indexed = applyPalette(data, palette);

        gif.writeFrame(indexed, width, height, {
          palette,
          delay: interval, // ms per frame
          transparent: true,
        });

        setProgress((i + 1) / totalFrames);

        // yield to browser so GIF bg keeps animating between frames
        await new Promise((r) => setTimeout(r, 0));
      }

      if (!abortRef.current) {
        gif.finish();
        const buffer = gif.bytesView();
        const blob = new Blob([buffer.buffer as ArrayBuffer], {
          type: "image/gif",
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `portfolio-frame-${Date.now()}.gif`;
        a.click();

        setTimeout(() => URL.revokeObjectURL(url), 5000);
      }
    } catch (err) {
      console.error("[GIF Export] Failed:", err);
    } finally {
      setIsRecording(false);
      setProgress(0);
    }
  }, [targetId, fps, duration]);

  const cancelExport = useCallback(() => {
    abortRef.current = true;
  }, []);

  return { exportGif, cancelExport, isRecording, progress };
}
