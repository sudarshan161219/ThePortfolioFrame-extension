import { parseGIF, decompressFrames } from "gifuct-js";

export interface ExtractedBg {
  type: "gif" | "image" | "css";
  frames: { bitmap: ImageBitmap; delay: number }[];
  blur: number;
}

export const extractBackgroundData = async (
  bgEl: HTMLElement,
): Promise<ExtractedBg> => {
  const computed = getComputedStyle(bgEl);
  const bgImage = computed.backgroundImage;
  const filter = computed.filter;

  // Extract blur value (e.g., "blur(5px)" -> 5)
  let blur = 0;
  const blurMatch = filter.match(/blur\((.*?px)\)/);
  if (blurMatch) blur = parseFloat(blurMatch[1]);

  // Extract URL
  const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/i);

  if (urlMatch) {
    const url = urlMatch[1];

    // Scenario A: It's an animated GIF
    if (url.toLowerCase().includes(".gif") || url.includes("giphy.com")) {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      const gif = parseGIF(buffer);
      const frames = decompressFrames(gif, true);

      const masterCanvas = document.createElement("canvas");
      masterCanvas.width = frames[0].dims.width;
      masterCanvas.height = frames[0].dims.height;
      const masterCtx = masterCanvas.getContext("2d", {
        willReadFrequently: true,
      })!;
      masterCtx.fillStyle = "#ffffff";
      masterCtx.fillRect(0, 0, masterCanvas.width, masterCanvas.height);

      const loadedFrames = [];
      for (const frame of frames) {
        const patchCanvas = document.createElement("canvas");
        patchCanvas.width = frame.dims.width;
        patchCanvas.height = frame.dims.height;
        patchCanvas
          .getContext("2d")!
          .putImageData(
            new ImageData(
              new Uint8ClampedArray(frame.patch),
              frame.dims.width,
              frame.dims.height,
            ),
            0,
            0,
          );

        masterCtx.drawImage(patchCanvas, frame.dims.left, frame.dims.top);
        loadedFrames.push({
          bitmap: await createImageBitmap(masterCanvas),
          delay: frame.delay || 100,
        });

        if (frame.disposalType === 2) {
          masterCtx.fillStyle = "#ffffff";
          masterCtx.fillRect(
            frame.dims.left,
            frame.dims.top,
            frame.dims.width,
            frame.dims.height,
          );
        }
      }
      return { type: "gif", frames: loadedFrames, blur };
    }

    // Scenario B: It's a static image (PNG/JPG)
    else {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      await new Promise((resolve) => (img.onload = resolve));
      const bitmap = await createImageBitmap(img);
      return { type: "image", frames: [{ bitmap, delay: 1000 }], blur };
    }
  }

  // Scenario C: It's a pure CSS preset (no url found)
  return { type: "css", frames: [], blur: 0 };
};
