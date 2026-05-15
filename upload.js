const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const loadingOverlay = document.getElementById("loadingOverlay");

function processFile(file) {
  if (
    !file ||
    (!file.type.startsWith("image/") &&
      !file.name.match(/\.(heic|heif|avif|tiff?|bmp|ico|svg|jxl)$/i))
  ) {
    return;
  }

  loadingOverlay.classList.add("visible");

  const reader = new FileReader();
  reader.onload = (e) => {
    chrome.storage.local.set(
      {
        tempImageBridge: e.target.result,
        tempUrlBridge: "localhost:5173",
      },
      () => {
        chrome.tabs.create({ url: chrome.runtime.getURL("editor.html") });
        chrome.tabs.getCurrent((tab) => chrome.tabs.remove(tab.id));
      },
    );
  };
  reader.readAsDataURL(file);
}

// file input change
fileInput.addEventListener("change", (e) => {
  processFile(e.target.files?.[0]);
});

// drag & drop
dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("drag-over");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("drag-over");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("drag-over");
  processFile(e.dataTransfer.files?.[0]);
});

// click anywhere on dropzone (not the label/button)
dropzone.addEventListener("click", (e) => {
  if (e.target.closest("label") || e.target === fileInput) return;
  fileInput.click();
});

// auto-trigger on load (original behavior preserved)
window.addEventListener("load", () => {
  fileInput.click();
});
