// pulls the url() value out of a computed backgroundImage string
export const extractGifUrl = (computedBg: string): string | null => {
  const match = computedBg.match(/url\(["']?([^"')]+)["']?\)/);
  if (!match) return null;
  const url = match[1];
  // only handle actual GIF urls (blob: or http with .gif)
  if (url.startsWith("blob:") || url.toLowerCase().includes(".gif")) {
    return url;
  }
  return null;
};

// draws a GIF frame-by-frame into ImageBitmap array
// uses the browser's native GIF decoder via an <img> + canvas trick
export const extractGifFrames = async (
  url: string,
  width: number,
  height: number,
): Promise<ImageBitmap[]> => {
  // We can't get individual GIF frames from the browser natively,
  // so we sample the rendered GIF at intervals by scrubbing
  // an offscreen img element and capturing its current painted state.
  //
  // Strategy: load the GIF into an img, wait for it to paint,
  // snapshot it every ~50ms for 2s to collect a frame pool.

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;

    const frames: ImageBitmap[] = [];
    const sampleInterval = 50; // ms between snapshots
    const sampleDuration = 2000; // sample for 2s to get a full loop

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;

    img.onload = () => {
      // append offscreen so browser renders/animates it
      img.style.cssText =
        "position:fixed;opacity:0;pointer-events:none;width:1px;height:1px;top:-9999px";
      document.body.appendChild(img);

      let elapsed = 0;
      const tick = setInterval(async () => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const bitmap = await createImageBitmap(
          ctx.getImageData(0, 0, width, height),
        );
        frames.push(bitmap);

        elapsed += sampleInterval;
        if (elapsed >= sampleDuration) {
          clearInterval(tick);
          document.body.removeChild(img);
          resolve(frames.length > 0 ? frames : []);
        }
      }, sampleInterval);
    };

    img.onerror = () => resolve([]);
  });
};
