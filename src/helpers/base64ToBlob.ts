export function base64ToBlob(base64: string): Blob {
  const [header, data] = base64.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/png";
  const bytes = atob(data);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

// export async function base64ToBlob(base64: string): Promise<string> {
//   const mime = base64.match(/data:(.*?);/)?.[1] ?? "image/png";
//   const isGif = mime === "image/gif";

//   if (isGif) {
//     // ── GIF: manual byte conversion, preserves animation ──
//     const data = base64.split(",")[1];
//     const bytes = atob(data);
//     const arr = new Uint8Array(bytes.length);
//     for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
//     const blob = new Blob([arr], { type: mime });
//     return URL.createObjectURL(blob);
//   }

//   // ── Static images: canvas route, non-blocking ──
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       canvas.width = img.naturalWidth;
//       canvas.height = img.naturalHeight;
//       canvas.getContext("2d")?.drawImage(img, 0, 0);
//       canvas.toBlob((blob) => {
//         if (!blob) return reject(new Error("Blob conversion failed"));
//         resolve(URL.createObjectURL(blob));
//       }, mime);
//     };
//     img.onerror = reject;
//     img.src = base64;
//   });
// }
