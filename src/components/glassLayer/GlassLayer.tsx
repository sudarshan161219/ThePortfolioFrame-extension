import { useId, useMemo } from "react";
import { useControlsStore } from "../../store/useControlsStore";
import styles from "./index.module.css";

function generateDisplacementMap(
  width: number,
  height: number,
  borderRadius: number,
  scale: number,
  curvature: number,
  glow: number,
): string {
  const data = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Normalized coords -1 to 1
      const nx = (x / width) * 2 - 1;
      const ny = (y / height) * 2 - 1;

      // Rounded rect SDF
      const qx = Math.abs(nx) - (1 - borderRadius / (width / 2));
      const qy = Math.abs(ny) - (1 - borderRadius / (height / 2));
      const sdf =
        Math.min(Math.max(qx, qy), 0) +
        Math.sqrt(Math.max(qx, 0) ** 2 + Math.max(qy, 0) ** 2);

      // Lens falloff — only pixels inside the lens are displaced
      const inside = Math.max(0, -sdf);
      const falloff = Math.pow(Math.min(inside * curvature, 1), 2);

      // Displacement — push outward from center (convex lens)
      const dispX = nx * falloff * scale;
      const dispY = ny * falloff * scale;

      const i = (y * width + x) * 4;
      // R = X displacement (128 = neutral), G = Y displacement
      data[i + 0] = Math.round((dispX + 1) * 127.5);
      data[i + 1] = Math.round((dispY + 1) * 127.5);
      data[i + 2] = Math.round(glow * falloff * 255); // B = glow intensity
      data[i + 3] = 255;
    }
  }

  // const offscreen = new OffscreenCanvas(w, h);
  // const ctx = offscreen.getContext("2d")!;
  // const imageData = new ImageData(data, w, h);
  // ctx.putImageData(imageData, 0, 0);

  // Convert to data URL via regular canvas (OffscreenCanvas can't toDataURL)
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  tempCanvas
    .getContext("2d")!
    .putImageData(new ImageData(data, width, height), 0, 0);
  return tempCanvas.toDataURL("image/png");
}

export const GlassOverlay = () => {
  const glassEnabled = useControlsStore((s) => s.glassEnabled);
  const glassScale = useControlsStore((s) => s.glassScale);
  const glassRadius = useControlsStore((s) => s.glassRadius);
  const glassGlow = useControlsStore((s) => s.glassGlow);
  const glassCurvature = useControlsStore((s) => s.glassCurvature);
  const glassChroma = useControlsStore((s) => s.glassChroma);
  const zoom = useControlsStore((s) => s.zoom);

  const frameW = 1920 * zoom;
  const frameH = frameW * 0.35;

  const id = useId();

  const mapUrl = useMemo(
    () =>
      generateDisplacementMap(
        Math.round(frameW),
        Math.round(frameH),
        glassRadius,
        glassScale,
        glassCurvature,
        glassGlow,
      ),
    [frameW, frameH, glassRadius, glassScale, glassCurvature, glassGlow],
  );

  // Refresh filter ID on every render so Safari doesn't cache stale output
  //   filterId.current = `glass-filter-${Math.random().toString(36).slice(2)}`;

  //   const fid = filterId.current;
  const filterId = `glass-filter-${id}`;
  const strength = glassScale * frameW;

  if (!glassEnabled) return null;

  return (
    <div
      className={styles.glassWrapper}
      style={{ width: frameW, height: frameH }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter
            id={filterId}
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
            colorInterpolationFilters="sRGB"
          >
            <feImage href={mapUrl} result="map" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={strength}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            {/* Chroma aberration */}
            <feOffset
              in="displaced"
              dx={glassChroma * 2}
              dy="0"
              result="chromaR"
            />
            <feOffset
              in="displaced"
              dx={-glassChroma * 2}
              dy="0"
              result="chromaB"
            />
            <feBlend in="chromaR" in2="chromaB" mode="screen" result="chroma" />
            <feComposite
              in="chroma"
              in2="displaced"
              operator="atop"
              result="withChroma"
            />
            {/* Specular highlight */}
            <feGaussianBlur in="map" stdDeviation="1" result="blurMap" />
            <feColorMatrix
              in="blurMap"
              type="matrix"
              values={`0 0 ${glassGlow * 4} 0 0  0 0 ${glassGlow * 4} 0 0  0 0 ${glassGlow * 4} 0 0  0 0 1 0 -0.5`}
              result="highlight"
            />
            <feComposite
              in="highlight"
              in2="withChroma"
              operator="atop"
              result="lit"
            />
            <feBlend in="withChroma" in2="lit" mode="screen" />
          </filter>
        </defs>
      </svg>

      <div
        className={styles.glassLens}
        style={{
          width: frameW,
          height: frameH,
          borderRadius: glassRadius,
          filter: `url(#${filterId})`,
        }}
      >
        <div
          className={styles.rimLight}
          style={{ borderRadius: glassRadius }}
        />
      </div>
    </div>
  );
};
