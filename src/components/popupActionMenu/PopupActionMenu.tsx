import { Camera, UploadCloud } from "lucide-react";
import styles from "./index.module.css";

export const PopupActionMenu = () => {
  const openEditorTab = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("editor.html") });
  };

  // ─── OPTION 1: Capture Tab ───
  const handleCaptureTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTabUrl = tabs[0]?.url || "localhost:5173";

      chrome.tabs.captureVisibleTab(
        chrome.windows.WINDOW_ID_CURRENT,
        { format: "png" },
        (dataUrl) => {
          if (dataUrl) {
            chrome.storage.local.set(
              {
                tempImageBridge: dataUrl,
                tempUrlBridge: currentTabUrl,
              },
              () => {
                if (chrome.runtime.lastError) {
                  console.error(
                    "Storage failed:",
                    chrome.runtime.lastError.message,
                  );
                  alert("Failed to save image. Is unlimitedStorage enabled?");
                  return;
                }
                openEditorTab(); // Open the full-screen editor!
              },
            );
          }
        },
      );
    });
  };

  const handleFileUpload = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("upload.html") });
  };

  // ─── OPTION 2: Capture Highlighted Text ─── //
  const handleSelection = async () => {
    // 1. Locate the exact tab the user is actively looking at
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab?.id) return;

    // 2. Execute a lightweight runner inside that tab to read its window selection
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => window.getSelection()?.toString() || "",
      },
      (injectionResults) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Script injection failed:",
            chrome.runtime.lastError.message,
          );
          return;
        }

        const selectedText = injectionResults[0]?.result;

        // If the user didn't highlight anything, warn them gently and halt
        if (!selectedText || !selectedText.trim()) {
          alert(
            "Please highlight some code on the webpage first before opening the menu!",
          );
          return;
        }

        // 3. Fire the verified text across your local storage bridge
        chrome.storage.local.set(
          {
            tempCodeBridge: selectedText,
            tempUrlBridge: tab.url || "",
            tempModeBridge: "code",
          },
          () => {
            openEditorTab(); // Safe to open the canvas now that storage is populated!
          },
        );
      },
    );
  };

  return (
    <div className={styles.popupMenu}>
      <div className={styles.popupHeader}>
        <div className={styles.popupDot} />
        <span className={styles.popupTitle}>The Portfolio Frame</span>
      </div>

      <button className={styles.menuItem} onClick={handleCaptureTab}>
        <div className={styles.itemIcon}>
          <Camera size={15} />
        </div>
        <span className={styles.itemLabel}>
          Capture Active Tab
          <span className={styles.itemSub}>png · current window</span>
        </span>
        <span className={styles.itemArrow}>›</span>
      </button>

      {/* selection */}
      <button className={styles.menuItem} onClick={handleSelection}>
        <div className={styles.itemIcon}>
          <Camera size={15} />
        </div>
        <span className={styles.itemLabel}>
          Beautify Code Snippet
          <span className={styles.itemSub}>png · current window</span>
        </span>
        <span className={styles.itemArrow}>›</span>
      </button>

      <label className={styles.menuItem} onClick={handleFileUpload}>
        <div className={styles.itemIcon}>
          <UploadCloud size={15} />
        </div>
        <span className={styles.itemLabel}>
          Upload Local Image
          <span className={styles.itemSub}>png · jpg · webp · svg</span>
        </span>
        <span className={styles.itemArrow}>›</span>
      </label>

      <div className={styles.popupFooter}>
        <span className={styles.footerText}>
          Build<span className={styles.footerAccent}>withSud</span>
        </span>
      </div>
    </div>
  );
};
