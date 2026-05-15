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
