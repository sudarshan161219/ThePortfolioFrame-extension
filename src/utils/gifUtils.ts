import { parseGIF, decompressFrames } from 'gifuct-js';

export interface GifFrameData {
  dataUrl: string;
  delay: number;
}

export const extractGifFrames = async (gifUrl: string): Promise<GifFrameData[]> => {
  // 1. Fetch the GIF as a buffer
  const response = await fetch(gifUrl);
  const buffer = await response.arrayBuffer();

  // 2. Parse the GIF format and decompress the frames
  const gif = parseGIF(buffer);
  const frames = decompressFrames(gif, true);

  // 3. Prepare a temporary canvas to draw the raw pixels
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const frameImages: GifFrameData[] = [];

  // 4. Draw each frame and convert to Base64
  for (const frame of frames) {
    if (!canvas.width || !canvas.height) {
      canvas.width = frame.dims.width;
      canvas.height = frame.dims.height;
    }

    const imageData = new ImageData(
      new Uint8ClampedArray(frame.patch),
      frame.dims.width,
      frame.dims.height
    );

    // Note: GIF frames sometimes only contain the *changed* pixels from the last frame.
    // gifuct-js usually handles this if you pass `buildPatch: true`, but we draw over the canvas.
    ctx.putImageData(imageData, frame.dims.left, frame.dims.top);

    frameImages.push({
      dataUrl: canvas.toDataURL('image/png'),
      delay: frame.delay || 100, 
    });
  }

  return frameImages;
};