import { useState, useEffect } from "react";
import styles from "./index.module.css";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  onSuccess,
}: SettingsModalProps) => {
  const [licenseKey, setLicenseKey] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen && typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["licenseKey"], (result) => {
        const licenseKey = result.licenseKey;

        if (licenseKey && typeof licenseKey === "string")
          setLicenseKey(licenseKey);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        onSuccess();
        onClose();

        // Reset the modal state behind the scenes after it closes
        setTimeout(() => setStatus("idle"), 500);
      }, 1500);

      // Cleanup function prevents memory leaks if the user manually closes the modal early
      return () => clearTimeout(timer);
    }
  }, [status, onSuccess, onClose]);

  if (!isOpen) return null;

  const verifyLicense = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const key = licenseKey.trim();
    if (!key) return;

    setStatus("loading");
    setErrorMessage("");

    // ==========================================
    // DEV BYPASS: Remove this before production!
    // ==========================================
    if (key === "TEST-PRO-KEY") {
      // Simulate an 800ms network request
      setTimeout(() => {
        setStatus("success");

        if (typeof chrome !== "undefined" && chrome.storage) {
          chrome.storage.local.set({
            isPro: true,
            licenseKey: key,
          });
        }

        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }, 800);

      return; // Exit early so it doesn't hit the real API
    }
    // ==========================================

    try {
      // The real Lemon Squeezy API logic remains intact for later
      const response = await fetch(
        "https://api.lemonsqueezy.com/v1/licenses/validate",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ license_key: key }),
        },
      );

      const data = await response.json();

      if (data.valid) {
        setStatus("success");

        if (typeof chrome !== "undefined" && chrome.storage) {
          chrome.storage.local.set({
            isPro: true,
            licenseKey: key,
          });
        }

        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Invalid license key.");
      }
    } catch (err) {
      console.log(err);
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>[ UPGRADE_TO_PRO ]</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            X
          </button>
        </div>

        <form onSubmit={verifyLicense} className={styles.form}>
          <p className={styles.description}>
            Enter your Lemon Squeezy license key to unlock premium backgrounds
            and custom gradients.
          </p>

          <input
            type="text"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            className={styles.input}
            spellCheck="false"
          />

          {status === "error" && (
            <p className={styles.errorText}>ERR: {errorMessage}</p>
          )}
          {status === "success" && (
            <p className={styles.successText}>
              LICENCE_VALIDATED. UNLOCKING...
            </p>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={
              status === "loading" || status === "success" || !licenseKey
            }
          >
            {status === "loading" ? "VERIFYING..." : "ACTIVATE_LICENSE"}
          </button>
        </form>
      </div>
    </div>
  );
};
