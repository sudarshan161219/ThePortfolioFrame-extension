import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";
import { toPng } from "html-to-image";

// 1. Define the state interface
interface NavActionsState {
  isExporting: boolean;
  triggerExport: () => Promise<void>;
}

// 2. Strongly typed Chrome Storage Engine
const chromeStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return new Promise((resolve) => {
      chrome.storage.local.get(name, (result) => {
        resolve((result[name] as string) || null);
      });
    });
  },
  setItem: async (name: string, value: string): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [name]: value }, () => {
        resolve();
      });
    });
  },
  removeItem: async (name: string): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.remove(name, () => {
        resolve();
      });
    });
  },
};

// 3. Create the store
export const useNavActionsStore = create<NavActionsState>()(
  persist(
    (set) => ({
      isExporting: false,

      triggerExport: async () => {
        const exportNode = document.getElementById("portfolio-export-target");

        if (!exportNode) {
          console.error(
            "[The Portfolio Frame] Export target not found in DOM.",
          );
          return;
        }

        try {
          set({ isExporting: true });

          const dataUrl = await toPng(exportNode, {
            quality: 1.0,
            pixelRatio: 3,
          });

          const link = document.createElement("a");
          link.download = `portfolio-frame-${Date.now()}.png`;
          link.href = dataUrl;
          link.click();
        } catch (err) {
          console.error("[The Portfolio Frame] Export failed:", err);
        } finally {
          set({ isExporting: false });
        }
      },
    }),
    {
      name: "portfolio-nav-storage", // Renamed to avoid colliding with your frame store
      storage: createJSONStorage(() => chromeStorage),
      // CORRECT PARTIALIZE: Return an object containing everything EXCEPT isExporting
      partialize: (state) => {
        const { isExporting, ...rest } = state;
        return rest;
      },
    },
  ),
);
