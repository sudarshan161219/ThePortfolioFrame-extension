/// <reference types="chrome"/>

// chrome.action.onClicked.addListener(async (tab) => {
//   if (!tab.windowId) return;

//   try {
//     const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
//       format: "png",
//     });
//     const currentUrl = tab.url || "";

//     await chrome.storage.local.set({
//       capturedImage: dataUrl,
//       capturedUrl: currentUrl,
//     });

//     await chrome.tabs.create({ url: "editor.html" });
//   } catch (error) {
//     console.error("[The Portfolio Frame] Capture failed:", error);
//   }
// });

// 1. Create the Context Menu option upon installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "beautify-code-selection",
    title: "✨ Beautify Code Snippet",
    contexts: ["selection"], // This ensures it only shows when text is highlighted
  });
});

// 2. Listen for clicks on your custom option
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "beautify-code-selection" && info.selectionText) {
    // Cache the text and target app metadata in extension storage
    chrome.storage.local.set(
      {
        tempCodeBridge: info.selectionText,
        tempUrlBridge: tab?.url || "",
        tempModeBridge: "code",
      },
      () => {
        // Launch your main app layout file
        chrome.tabs.create({ url: chrome.runtime.getURL("editor.html") });
      },
    );
  }
});
