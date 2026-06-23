import { ratios } from "../../constants/ratios";
import { useControlsStore } from "../../store/useControlsStore";
import { BACKGROUNDS } from "../../constants/backgrounds";

export type CanvasDimensions = {
  BASE_WIDTH: number;
  BASE_HEIGHT: number;
};

export function resolveCanvasDimensions(): CanvasDimensions {
  const { aspectRatio, imageNaturalWidth, imageNaturalHeight } =
    useControlsStore.getState();

  const currentRatio = ratios.find((r) => r.value === aspectRatio);

  if (currentRatio?.width && currentRatio?.height) {
    return { BASE_WIDTH: currentRatio.width, BASE_HEIGHT: currentRatio.height };
  }

  return {
    BASE_WIDTH: imageNaturalWidth || 1920,
    BASE_HEIGHT: imageNaturalHeight || 1080,
  };
}

function isGradientString(value: string): boolean {
  return /linear-gradient|radial-gradient/i.test(value);
}

function isSolidColor(value: string): boolean {
  return (
    value.startsWith("#") ||
    value.startsWith("rgb") ||
    value.startsWith("hsl") ||
    /^[a-zA-Z]+$/.test(value.trim())
  );
}

function applyCanvasGradient(
  ctx: CanvasRenderingContext2D,
  gradientStr: string,
  width: number,
  height: number,
): boolean {
  const match = gradientStr.match(/linear-gradient\((.*)\)/i);
  if (!match) return false;

  const inner = match[1];
  const parts: string[] = [];
  let depth = 0;
  let current = "";

  for (const ch of inner) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());

  if (parts.length < 2) return false;

  let x0 = 0,
    y0 = 0,
    x1 = 0,
    y1 = height;
  let colorStopStartIndex = 0;
  const firstPart = parts[0].toLowerCase();

  if (firstPart.startsWith("to ") || firstPart.endsWith("deg")) {
    colorStopStartIndex = 1;
    if (firstPart === "to right") {
      x1 = width;
      y1 = 0;
    } else if (firstPart === "to top") {
      y0 = height;
      y1 = 0;
    } else if (firstPart === "to left") {
      x0 = width;
      y1 = 0;
    } else if (firstPart === "to bottom right") {
      x1 = width;
      y1 = height;
    } else if (firstPart === "to top right") {
      y0 = height;
      x1 = width;
      y1 = 0;
    } else if (firstPart === "to bottom left") {
      x0 = width;
      y1 = height;
    } else if (firstPart === "to top left") {
      x0 = width;
      y0 = height;
      x1 = 0;
      y1 = 0;
    } else if (firstPart.endsWith("deg")) {
      const degrees = parseFloat(firstPart);
      const angleRad = (degrees - 90) * (Math.PI / 180);
      x0 = width / 2 - (Math.cos(angleRad) * width) / 2;
      y0 = height / 2 - (Math.sin(angleRad) * height) / 2;
      x1 = width / 2 + (Math.cos(angleRad) * width) / 2;
      y1 = height / 2 + (Math.sin(angleRad) * height) / 2;
    }
  }

  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  const colorStops = parts.slice(colorStopStartIndex);

  colorStops.forEach((stop, index) => {
    const stopMatch = stop.match(
      /(rgba?\(.*?\)|hsla?\(.*?\)|#[a-fA-F0-9]+|[a-zA-Z]+)\s*([\d.]+)%/i,
    );
    let color = stop;
    let offset = index / (colorStops.length - 1);
    if (stopMatch) {
      color = stopMatch[1];
      offset = parseFloat(stopMatch[2]) / 100;
    }
    gradient.addColorStop(Math.max(0, Math.min(1, offset)), color);
  });

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  return true;
}

// ── Helpers for CSS Presets ─────────────────────────────────────────────────

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });

function drawRadialElliptical(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  color0: string,
  color1: string,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1, ry / rx); // Scale to create ellipse
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  grad.addColorStop(0, color0);
  grad.addColorStop(1, color1);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, rx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Native Canvas rendering of complex CSS background presets */
/** Native Canvas rendering of complex CSS background presets */
async function renderPresetBackground(
  ctx: CanvasRenderingContext2D,
  bgKey: string,
  w: number,
  h: number,
) {
  ctx.save();

  // ── THE FIX: Dimension-Agnostic Proportional Scaling ────────────────────────
  // A standard web preview usually maxes out around 1000px on its longest edge.
  // By checking Math.max(w, h), the scale adapts perfectly to both Portrait and Landscape.
  const CSS_REFERENCE_MAX = 1000;
  const s = Math.max(w, h) / CSS_REFERENCE_MAX;

  switch (bgKey) {
    case "bgNoiseGlass": {
      ctx.fillStyle = "#0d0d0d";
      ctx.fillRect(0, 0, w, h);
      const svgNoise = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E`;
      const noiseImg = await loadImage(svgNoise);
      ctx.globalAlpha = 0.5;

      const pattern = ctx.createPattern(noiseImg, "repeat")!;
      // Scale the noise pattern uniformly
      pattern.setTransform(new DOMMatrix().scale(s, s));
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case "bgMeshGradient":
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, w, h);
      drawRadialElliptical(
        ctx,
        w * 0.2,
        h * 0.3,
        w * 0.6,
        h * 0.6,
        "rgba(83, 74, 183, 0.35)",
        "transparent",
      );
      drawRadialElliptical(
        ctx,
        w * 0.8,
        h * 0.7,
        w * 0.5,
        h * 0.5,
        "rgba(15, 110, 86, 0.3)",
        "transparent",
      );
      drawRadialElliptical(
        ctx,
        w * 0.6,
        h * 0.1,
        w * 0.4,
        h * 0.4,
        "rgba(42, 42, 60, 0.5)",
        "transparent",
      );
      break;

    case "bgContourLines": {
      ctx.fillStyle = "#0c0f14";
      ctx.fillRect(0, 0, w, h);
      ctx.beginPath();

      const contourStep = 15 * s;
      for (let y = 0; y < h; y += contourStep) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.strokeStyle = "rgba(99, 153, 34, 0.07)";
      ctx.lineWidth = Math.max(1, 1 * s);
      ctx.stroke();

      ctx.beginPath();
      for (let x = 0; x < w; x += contourStep) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      ctx.strokeStyle = "rgba(99, 153, 34, 0.04)";
      ctx.stroke();
      break;
    }
    case "bgAuroraBands": {
      ctx.fillStyle = "#050810";
      ctx.fillRect(0, 0, w, h);
      ctx.filter = `blur(${60 * s}px)`;

      const g1 = ctx.createLinearGradient(0, 0, w, h);
      g1.addColorStop(0, "rgba(52, 10, 120, 0.7)");
      g1.addColorStop(0.5, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(-100, -100, w + 200, h + 200);

      const g2 = ctx.createLinearGradient(w, 0, 0, h);
      g2.addColorStop(0, "rgba(0, 120, 100, 0.5)");
      g2.addColorStop(0.5, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(-100, -100, w + 200, h + 200);

      const g3 = ctx.createLinearGradient(w / 2, h, w / 2, 0);
      g3.addColorStop(0, "rgba(180, 30, 80, 0.2)");
      g3.addColorStop(0.6, "transparent");
      ctx.fillStyle = g3;
      ctx.fillRect(-100, -100, w + 200, h + 200);
      break;
    }

    case "bgCarbonFiber": {
      ctx.fillStyle = "#111111";
      ctx.fillRect(0, 0, w, h);
      ctx.beginPath();

      const carbonStep = 8 * s;
      // Expand bounds slightly to ensure diagonals fill the screen perfectly
      const maxDim = Math.max(w, h);
      for (let i = -maxDim; i < maxDim * 2; i += carbonStep) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i + maxDim, maxDim);
        ctx.moveTo(i, maxDim);
        ctx.lineTo(i + maxDim, 0);
      }
      ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
      ctx.lineWidth = Math.max(1, 1 * s);
      ctx.stroke();
      break;
    }

    case "bgScanlineHaze": {
      ctx.fillStyle = "#080808";
      ctx.fillRect(0, 0, w, h);
      drawRadialElliptical(
        ctx,
        w * 0.5,
        h * 0.5,
        w * 0.8,
        h * 0.8,
        "rgba(180, 80, 255, 0.12)",
        "transparent",
      );

      ctx.beginPath();
      const scanStep = 4 * s;
      for (let y = 0; y < h; y += scanStep) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.strokeStyle = "rgba(255, 255, 255, 0.018)";
      ctx.lineWidth = Math.max(1, 2 * s);
      ctx.stroke();
      break;
    }

    case "bgLiquidChrome":
      ctx.fillStyle = "#060606";
      ctx.fillRect(0, 0, w, h);
      ctx.filter = `blur(${60 * s}px)`;
      drawRadialElliptical(
        ctx,
        w * 0.3,
        h * 0.3,
        w * 0.35,
        w * 0.35,
        "rgba(255, 255, 255, 0.18)",
        "transparent",
      );
      drawRadialElliptical(
        ctx,
        w * 0.7,
        h * 0.6,
        w * 0.4,
        w * 0.4,
        "rgba(120, 120, 255, 0.14)",
        "transparent",
      );
      drawRadialElliptical(
        ctx,
        w * 0.5,
        h * 0.8,
        w * 0.35,
        w * 0.35,
        "rgba(255, 100, 180, 0.1)",
        "transparent",
      );
      break;

    case "bgNeuralGrid": {
      ctx.fillStyle = "#0a0d12";
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.filter = `blur(${40 * s}px)`;
      drawRadialElliptical(
        ctx,
        w * 0.2,
        h * 0.2,
        w * 0.25,
        w * 0.25,
        "rgba(0, 255, 170, 0.12)",
        "transparent",
      );
      drawRadialElliptical(
        ctx,
        w * 0.8,
        h * 0.7,
        w * 0.3,
        w * 0.3,
        "rgba(100, 140, 255, 0.12)",
        "transparent",
      );
      ctx.restore();

      const gridCanvas = document.createElement("canvas");
      gridCanvas.width = w;
      gridCanvas.height = h;
      const gCtx = gridCanvas.getContext("2d")!;
      gCtx.beginPath();

      const gridStep = 32 * s;

      for (let x = 0; x < w; x += gridStep) {
        gCtx.moveTo(x, 0);
        gCtx.lineTo(x, h);
      }
      for (let y = 0; y < h; y += gridStep) {
        gCtx.moveTo(0, y);
        gCtx.lineTo(w, y);
      }
      gCtx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      gCtx.lineWidth = Math.max(1, 1 * s);
      gCtx.stroke();

      gCtx.globalCompositeOperation = "destination-in";
      const maskGrad = gCtx.createRadialGradient(
        w / 2,
        h / 2,
        w * 0.45,
        w / 2,
        h / 2,
        w * 0.9,
      );
      maskGrad.addColorStop(0, "black");
      maskGrad.addColorStop(1, "transparent");
      gCtx.fillStyle = maskGrad;
      gCtx.fillRect(0, 0, w, h);

      ctx.drawImage(gridCanvas, 0, 0);
      break;
    }

    case "bgVelvetGlow": {
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, "#08070d");
      bgGrad.addColorStop(0.5, "#11131a");
      bgGrad.addColorStop(1, "#09090c");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.filter = `blur(${50 * s}px)`;
      drawRadialElliptical(
        ctx,
        w * 0.3,
        h * 0.4,
        w * 0.6,
        h * 0.5,
        "rgba(120, 70, 255, 0.18)",
        "transparent",
      );
      drawRadialElliptical(
        ctx,
        w * 0.7,
        h * 0.6,
        w * 0.5,
        h * 0.4,
        "rgba(0, 180, 255, 0.12)",
        "transparent",
      );
      ctx.restore();

      const overlayGrad = ctx.createLinearGradient(0, 0, 0, h);
      overlayGrad.addColorStop(0, "rgba(255, 255, 255, 0.015)");
      overlayGrad.addColorStop(0.3, "transparent");
      overlayGrad.addColorStop(0.7, "transparent");
      overlayGrad.addColorStop(1, "rgba(255, 255, 255, 0.02)");
      ctx.fillStyle = overlayGrad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
  }

  ctx.restore();
}

/** Main Render Pipeline */
export async function renderBackgroundLayer(
  dims: CanvasDimensions,
): Promise<HTMLCanvasElement> {
  const { BASE_WIDTH, BASE_HEIGHT } = dims;
  const {
    customBg,
    activeBg,
    bgImageRaw,
    bgBlur,
    bgScale,
    bgPositionX,
    bgPositionY,
  } = useControlsStore.getState();

  const canvas = document.createElement("canvas");
  canvas.width = BASE_WIDTH;
  canvas.height = BASE_HEIGHT;
  const ctx = canvas.getContext("2d")!;

  // ── Branch 1: Image background ──────────────────────────────────────────────
  if (bgImageRaw) {
    const img = await loadImage(bgImageRaw);
    ctx.save();

    const BLEED = 160;
    const containerW = BASE_WIDTH + BLEED;
    const containerH = BASE_HEIGHT + BLEED;

    const cssW = containerW * bgScale;
    const cssH = (img.naturalHeight / img.naturalWidth) * cssW;

    const overflowX = cssW - containerW;
    const overflowY = cssH - containerH;

    const cssX = -(overflowX * bgPositionX) / 100 - BLEED / 2;
    const cssY = -(overflowY * bgPositionY) / 100 - BLEED / 2;

    let drawX = cssX,
      drawY = cssY,
      drawW = cssW,
      drawH = cssH;

    if (bgBlur > 0) {
      ctx.filter = `blur(${bgBlur}px)`;
      const blurScale = 1 + bgBlur / 200;
      drawW = cssW * blurScale;
      drawH = cssH * blurScale;
      drawX = cssX - (drawW - cssW) / 2;
      drawY = cssY - (drawH - cssH) / 2;
    }

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();

    return canvas;
  }

  // ── Branch 2: CSS Preset Backgrounds ───────────────────────────────────────
  // Checks if the customBg string matches any of the preset bgKeys
  if (activeBg && BACKGROUNDS.some((b) => b.bgKey === activeBg?.bgKey)) {
    await renderPresetBackground(ctx, activeBg?.bgKey, BASE_WIDTH, BASE_HEIGHT);
    return canvas;
  }

  // ── Branch 3: Native Gradient ───────────────────────────────────────────────
  if (customBg && isGradientString(customBg)) {
    const success = applyCanvasGradient(ctx, customBg, BASE_WIDTH, BASE_HEIGHT);
    if (success) return canvas;
  }

  // ── Branch 4: Solid color / Fallback ────────────────────────────────────────
  ctx.fillStyle = customBg && isSolidColor(customBg) ? customBg : "#111111";
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

  return canvas;
}
