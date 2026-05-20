declare module "gifenc" {
  export function GIFEncoder(): {
    writeFrame(
      index: Uint8Array,
      width: number,
      height: number,
      opts?: {
        palette?: number[][];
        delay?: number;
        repeat?: number;
        transparent?: boolean;
        transparentIndex?: number;
        colorDepth?: number;
        dispose?: number;
      }
    ): void;
    finish(): void;
    bytesView(): Uint8Array;
    bytes(): Uint8Array;
    reset(): void;
  };

  export function quantize(
    data: Uint8ClampedArray | Uint8Array,
    maxColors: number,
    opts?: {
      format?: "rgb565" | "rgb444" | "rgba4444";
      oneBitAlpha?: boolean;
    }
  ): number[][];

  export function applyPalette(
    data: Uint8ClampedArray | Uint8Array,
    palette: number[][],
    format?: "rgb565" | "rgb444" | "rgba4444"
  ): Uint8Array;

  export function nearestColorIndex(
    palette: number[][],
    r: number,
    g: number,
    b: number,
    a?: number
  ): number;

  export function nearestColor(
    palette: number[][],
    r: number,
    g: number,
    b: number,
    a?: number
  ): number[];
}