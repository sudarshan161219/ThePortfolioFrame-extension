import { useControlsStore } from "../../store/useControlsStore";
import { BROWSER_MOCKUP_CONFIG } from "../../constants/browser_mockup_config";
import { DEVICE_MOCKUPS } from "../../constants/Device_mockup_config";

/** Helper: Load image safely with CORS */
async function loadSafeImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Prevents tainting
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/** Helper: Draw image with 'object-fit: cover' and 'object-position: top center' */
function drawCoverTopCenter(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const targetRatio = w / h;
  let sourceW = img.naturalWidth;
  let sourceH = img.naturalHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (imgRatio > targetRatio) {
    // Image is wider than target box - crop sides, center horizontally
    sourceW = img.naturalHeight * targetRatio;
    sourceX = (img.naturalWidth - sourceW) / 2;
  } else {
    // Image is taller than target box - crop bottom, align top
    sourceH = img.naturalWidth / targetRatio;
    sourceY = 0; // Matches object-position: top center
  }

  ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, x, y, w, h);
}

/**
 * Generates an untainted Canvas containing the fully assembled Mockup
 */
export async function generateMockupCanvas(
  targetWidth: number // The desired pixel width of the generated mockup
): Promise<HTMLCanvasElement | null> {
  const state = useControlsStore.getState();
  const { mockupCategory, imageSource, pageUrl, pageTitle } = state;

  if (mockupCategory === "none" || !imageSource) {
    return null; // Handle "none" scenario in your main export loop
  }

  const screenshotImg = await loadSafeImage(imageSource);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { alpha: true })!;

  // ── 1. DEVICE MOCKUP ──────────────────────────────────────────────────────────
  if (mockupCategory === "device") {
    const config = DEVICE_MOCKUPS.find((d) => d.id === state.deviceMockup) || DEVICE_MOCKUPS[0];
    const frameImg = await loadSafeImage(config.src);

    canvas.width = targetWidth;
    canvas.height = targetWidth / config.aspectRatio;

    // Convert CSS percentages to raw pixels
    const sTop = (parseFloat(config.screen.top) / 100) * canvas.height;
    const sLeft = (parseFloat(config.screen.left) / 100) * canvas.width;
    const sWidth = (parseFloat(config.screen.width) / 100) * canvas.width;
    const sHeight = (parseFloat(config.screen.height) / 100) * canvas.height;

    // Draw Screenshot FIRST (behind the frame)
    drawCoverTopCenter(ctx, screenshotImg, sLeft, sTop, sWidth, sHeight);

    // Draw Device Frame OVER the screenshot
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

    return canvas;
  }

  // ── 2. BROWSER MOCKUP ─────────────────────────────────────────────────────────
  if (mockupCategory === "browser") {
    const config = BROWSER_MOCKUP_CONFIG[state.browserMockup as keyof typeof BROWSER_MOCKUP_CONFIG];
    if (!config) return null;

    const headerImg = await loadSafeImage(config.src);

    // Calculate aspect ratios
    const headerRatio = headerImg.naturalWidth / headerImg.naturalHeight;
    const headerHeightPx = targetWidth / headerRatio;
    
    // Screenshot scales to fit target width, height adjusts proportionally
    const screenshotRatio = screenshotImg.naturalWidth / screenshotImg.naturalHeight;
    const screenshotHeightPx = targetWidth / screenshotRatio;

    canvas.width = targetWidth;
    canvas.height = headerHeightPx + screenshotHeightPx; // Header + Content stack

    // 1. Draw Header
    ctx.drawImage(headerImg, 0, 0, canvas.width, headerHeightPx);

    // 2. Draw Text Overlays
    const cleanUrl = pageUrl.replace(/^https?:\/\//, "").replace(/^www\./, "");
    const displayTitle = pageTitle.trim() !== "" ? pageTitle : cleanUrl.split("/")[0];

    config.overlays.forEach((overlay) => {
      const text = overlay.type === "url" ? cleanUrl : displayTitle;
      
      // Calculate CSS percentages against the canvas width/height
      const topPx = (parseFloat(overlay.top) / 100) * headerHeightPx;
      const leftPx = (parseFloat(overlay.left) / 100) * canvas.width;
      
      // Parse CSS `cqw` (Container Query Width) into raw pixels
      const fontSizePct = parseFloat(overlay.fontSize); // e.g., 1 from "1cqw"
      const fontSizePx = (fontSizePct / 100) * canvas.width;

      ctx.save();
      ctx.font = `${overlay.fontWeight || "400"} ${fontSizePx}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
      ctx.fillStyle = overlay.color;
      ctx.textAlign = overlay.align;
      ctx.textBaseline = "middle"; // Replicates CSS `transform: translateY(-50%)`

      // If text align is center, we need to adjust the X coordinate
      let textX = leftPx;
      if (overlay.align === "center") {
         const widthPx = (parseFloat(overlay.width) / 100) * canvas.width;
         textX = leftPx + (widthPx / 2);
      }

      ctx.fillText(text, textX, topPx);
      ctx.restore();
    });

    // 3. Draw Screenshot underneath Header
    ctx.drawImage(screenshotImg, 0, headerHeightPx, canvas.width, screenshotHeightPx);

    return canvas;
  }

  return null;
}