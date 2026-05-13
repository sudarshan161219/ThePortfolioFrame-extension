import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 1. Define the TypeScript types for your state and actions
interface AppState {
  titleBarColor: string;
  tilt: boolean;
  frameType: "browser" | "terminal";
  pageUrl: string;
  imageSource: string | null;
  bgImage: string | null;

  customBg: string;
  bgBlur: number;
  bgSize: "cover" | "contain" | "auto";
  padding: number;
  handle: string;

  // Setter Actions
  setTitleBarColor: (color: string) => void;
  setTilt: (val: boolean) => void;
  setFrameType: (type: "browser" | "terminal") => void;
  setPageUrl: (url: string) => void;
  setImageSource: (src: string | null) => void;
  setBgImage: (src: string | null) => void;

  setCustomBg: (val: string) => void;
  setBgBlur: (val: number) => void;
  setBgSize: (val: "cover" | "contain" | "auto") => void;
  setPadding: (val: number) => void;
  setHandle: (val: string) => void;
}

// 2. The Chrome Storage Engine
const chromeStorage = {
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
export const useFrameStore = create<AppState>()(
  persist(
    (set) => ({
      // Default Values
      titleBarColor: "#fdfdfb",
      tilt: false,
      frameType: "browser",
      pageUrl: "localhost:5173",
      imageSource: null,
      bgImage: null,
      customBg: "",
      bgBlur: 0,
      bgSize: "cover",
      padding: 40,
      handle: "",

      // Action Implementations
      setTitleBarColor: (color) => set({ titleBarColor: color }),
      setTilt: (val) => set({ tilt: val }),
      setFrameType: (type) => set({ frameType: type }),
      setPageUrl: (url) => set({ pageUrl: url }),
      setImageSource: (src) => set({ imageSource: src }),
      setBgImage: (src) => set({ bgImage: src }),
      setCustomBg: (val) => set({ customBg: val }),
      setBgBlur: (val) => set({ bgBlur: val }),
      setBgSize: (val) => set({ bgSize: val }),
      setPadding: (val) => set({ padding: val }),
      setHandle: (val) => set({ handle: val }),
    }),
    {
      name: "portfolio-frame-storage", // The key used in chrome.storage.local
      storage: createJSONStorage(() => chromeStorage),
      // Optional: If you don't want to persist the imageSource across sessions
      // (to save storage space), you can partiallyize the store like this:
      // partialize: (state) => ({ ...state, imageSource: null }),
    },
  ),
);
