/// <reference types="chrome"/>

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.windowId) return;

  try {
    const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
      format: "png",
    });
    const currentUrl = tab.url || "";

    await chrome.storage.local.set({
      capturedImage: dataUrl,
      capturedUrl: currentUrl,
    });

    await chrome.tabs.create({ url: "editor.html" });
  } catch (error) {
    console.error("[The Portfolio Frame] Capture failed:", error);
  }
});
