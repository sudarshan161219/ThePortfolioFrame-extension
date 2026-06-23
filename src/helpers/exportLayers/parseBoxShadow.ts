import { SHADOW_PRESETS } from "../../constants/shadow_presets";

interface ParsedShadow {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
}

export const parseBoxShadow = (
  variantIndex: number,
  baseOpacity: number,
): ParsedShadow[] => {
  const preset = SHADOW_PRESETS[variantIndex] || SHADOW_PRESETS[0];
  const cssString = preset.value;

  if (!cssString || cssString === "none") return [];

  // 1. Evaluate the calc() and __OPACITY__ markers from your presets
  const resolvedString = cssString
    .replace(/calc\(__OPACITY__ \+ ([0-9.]+)\)/g, (_, add) =>
      String(Math.min(1, baseOpacity + parseFloat(add))),
    )
    .replace(/calc\(__OPACITY__ \* ([0-9.]+)\)/g, (_, mult) =>
      String(Math.min(1, baseOpacity * parseFloat(mult))),
    )
    .replace(/__OPACITY__/g, String(baseOpacity));

  // 2. Split multiple shadows by comma (ignoring commas inside rgba)
  const shadowLayers = resolvedString
    .split(/\),?\s*/)
    .filter(Boolean)
    .map((s) => (s.includes(")") ? s : s + ")")); // Re-close the parentheses

  // 3. Extract metrics and color
  return shadowLayers.map((layer) => {
    const colorMatch = layer.match(/(rgba?\([^)]+\))/);
    const color = colorMatch ? colorMatch[1] : "rgba(0,0,0,0)";

    // Strip the color out to parse the lengths (X Y Blur Spread)
    const metricsStr = layer.replace(color, "").trim();
    const metrics = metricsStr
      .split(/\s+/)
      .map((m) => parseFloat(m.replace("px", "")) || 0);

    return {
      x: metrics[0] || 0,
      y: metrics[1] || 0,
      blur: metrics[2] || 0,
      spread: metrics[3] || 0,
      color: color,
    };
  });
};
