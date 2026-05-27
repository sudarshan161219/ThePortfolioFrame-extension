import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEVICE_MOCKUPS } from "../constants/Device_mockup_config";

const firstDevice = DEVICE_MOCKUPS[0];

type Background = {
  id: string;
  name: string;
  isPro: boolean;
  bgKey: string;
};

type titleBar = {
  bg: string;
  borderColor: string;
  urlpathBg: string;
  urlpathText: string;
};

export type AnnotationType =
  | "text"
  | "box"
  | "arrow"
  | "number"
  | "highlight"
  | "redact";

export interface Annotation {
  id: string;
  type: AnnotationType;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  color: string;
  fontSize?: number;
  fontFamily?: string;
  number?: number;
}

export type AspectRatio =
  | "auto"
  | "1 / 1"
  | "4 / 5"
  | "9 / 16"
  | "2 / 3"
  | "3 / 4"
  | "16 / 9"
  | "4 / 3"
  | "3 / 2"
  | "21 / 9"
  | "1.91 / 1";

export type BrowserMockup =
  | "chrome-win-light"
  | "chrome-win-dark"
  | "chrome-mac-light"
  | "chrome-mac-dark"
  | "safari-mac-light"
  | "safari-mac-dark";

export type DeviceMockup =
  | "dell-ultrasharp-27"
  | "dell-ultrasharp-5k-monitor-27"
  | "apple-thunderbolt-display"
  | "apple-pro-display-xdr"
  | "microsoft-surface-book"
  | "dell-xps-15"
  | "dell-xps-13"
  | "macbook-pro"
  | "macbook-pro-16"
  | "iphone-14-pro"
  | "iwatch"
  | "macbook-air-13-silver"
  | "apple-macbook-space-grey"
  | "apple-macbook-gold"
  | "imac-retina";

// 1. Define the TypeScript types for your state and actions
interface AppState {
  isPro: boolean;
  showBrowserFrame: boolean;
  showDeviceFrame: boolean;
  titleBarTheme: titleBar;
  tilt: boolean;
  frameType: "browser" | "terminal";
  mockupCategory: "browser" | "device" | "none";
  osStyle: "mac" | "windows";
  pageUrl: string;
  pageTitle: string;
  imageSource: string | null;
  bgImage: string | null;
  activeBg: Background | null;

  customBg: string;
  bgBlur: number;
  bgSize: "cover" | "contain" | "auto";

  handle: string;
  terminalPath: string;

  tiltX: number;
  tiltY: number;
  tiltZ: number;

  aspectRatio: AspectRatio;
  zoom: number;
  browserMockup: BrowserMockup;
  deviceMockup: DeviceMockup;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  isGlassBorder: boolean;

  shadowVariant: number;
  shadowOpacity: number;

  animation: string;

  screenLeft: number;
  screenTop: number;
  screenWidth: number;
  screenHeight: number;

  annotations: Annotation[];
  activeAnnotationTool: AnnotationType | null;
  annotationColor: string;
  annotationFontSize: number;
  annotationFontFamily: string;
  selectedAnnotationId: string | null;

  // Setter Actions
  setIsPro: (status: boolean) => void;
  setBrowserFrame: (status: boolean) => void;
  setDeviceFrame: (status: boolean) => void;
  setOsStyle: (type: "mac" | "windows") => void;
  settitleBarTheme: (val: titleBar) => void;
  setTilt: (val: boolean) => void;
  setFrameType: (type: "browser" | "terminal") => void;
  setMockupCategory: (category: "browser" | "device" | "none") => void;
  setPageUrl: (url: string) => void;
  setPageTitle: (title: string) => void;
  setImageSource: (src: string | null) => void;
  setBgImage: (src: string | null) => void;

  setActiveBg: (background: Background | null) => void;

  setCustomBg: (val: string) => void;
  setBgBlur: (val: number) => void;
  setBgSize: (val: "cover" | "contain" | "auto") => void;
  setHandle: (val: string) => void;
  setTerminalPath: (path: string) => void;

  setTiltX: (val: number) => void;
  setTiltY: (val: number) => void;
  setTiltZ: (z: number) => void;

  setAspectRatio: (ratio: AspectRatio) => void;
  setZoom: (val: number) => void;
  setBrowserMockup: (mockup: BrowserMockup) => void;
  setDeviceMockup: (mockup: DeviceMockup) => void;
  setBorderRadius: (radius: number) => void;
  setShadowVariant: (index: number) => void;
  setShadowOpacity: (opacity: number) => void;
  setBorderWidth: (width: number) => void;
  setBorderColor: (color: string) => void;
  setIsGlassBorder: (isGlass: boolean) => void;

  setAnimation: (anim: string) => void;
  setScreenLeft: (v: number) => void;
  setScreenTop: (v: number) => void;
  setScreenWidth: (v: number) => void;
  setScreenHeight: (v: number) => void;

  addAnnotation: (
    type: AnnotationType,
    overrides?: Partial<Annotation>,
  ) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  removeAnnotation: (id: string) => void;
  setActiveAnnotationTool: (tool: AnnotationType | null) => void;
  setAnnotationColor: (color: string) => void;
  setAnnotationFontSize: (size: number) => void;
  setAnnotationFontFamily: (family: string) => void;
  setSelectedAnnotationId: (id: string | null) => void;
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

const getDefaultScreenConfig = (id: string) => {
  const device = DEVICE_MOCKUPS.find((m) => m.id === id);
  if (!device) return null;
  return {
    screenLeft: parseFloat(device.screen.left),
    screenTop: parseFloat(device.screen.top),
    screenWidth: parseFloat(device.screen.width),
    screenHeight: parseFloat(device.screen.height),
  };
};

// 3. Create the store
export const useControlsStore = create<AppState>()(
  persist(
    (set) => ({
      // Default Values
      isPro: false,
      showBrowserFrame: true,
      showDeviceFrame: true,
      titleBarTheme: {
        bg: "#fdfdfb",
        borderColor: "",
        urlpathBg: "rgba(0, 0, 0, 0.05)",
        urlpathText: "#111827",
      },
      tilt: false,
      osStyle: "mac",
      frameType: "browser",
      mockupCategory: "browser",
      pageUrl: "localhost:5173",
      pageTitle: "",
      imageSource: null,
      bgImage: null,
      customBg: "",
      bgBlur: 0,
      bgSize: "cover",

      handle: "",
      activeBg: null,
      terminalPath: "~/home",
      tiltX: 15,
      tiltY: -15,
      tiltZ: 0,
      aspectRatio: "auto",
      zoom: 0.5,
      browserMockup: "safari-mac-light",
      deviceMockup: "macbook-pro",
      borderRadius: 12,
      shadowVariant: 4,
      shadowOpacity: 0.4,
      borderWidth: 0,
      borderColor: "rgba(255, 255, 255, 0.2)",
      isGlassBorder: false,
      animation: "none",
      screenLeft: parseFloat(firstDevice.screen.left),
      screenTop: parseFloat(firstDevice.screen.top),
      screenWidth: parseFloat(firstDevice.screen.width),
      screenHeight: parseFloat(firstDevice.screen.height),

      annotations: [],
      activeAnnotationTool: "text",
      annotationColor: "#ffffff",
      annotationFontSize: 14,
      annotationFontFamily: "DM Sans, sans-serif",
      selectedAnnotationId: null,

      // Action Implementations
      setIsPro: (status) => set({ isPro: status }),
      setBrowserFrame: (status) => set({ showBrowserFrame: status }),
      setDeviceFrame: (status) => set({ showDeviceFrame: status }),
      settitleBarTheme: (color) => set({ titleBarTheme: color }),
      setOsStyle: (type) => set({ osStyle: type }),
      setTilt: (val) => set({ tilt: val }),
      setFrameType: (type) => set({ frameType: type }),
      setMockupCategory: (category) => set({ mockupCategory: category }),
      setPageUrl: (url) => set({ pageUrl: url }),
      setPageTitle: (title) => set({ pageTitle: title }),
      setImageSource: (src) => set({ imageSource: src }),
      setBgImage: (src) => set({ bgImage: src }),
      setCustomBg: (val) => set({ customBg: val }),
      setBgBlur: (val) => set({ bgBlur: val }),
      setBgSize: (val) => set({ bgSize: val }),

      setHandle: (val) => set({ handle: val }),
      setActiveBg: (val) => set({ activeBg: val }),
      setTerminalPath: (path) => set({ terminalPath: path }),

      setTiltX: (val) => set({ tiltX: val }),
      setTiltY: (val) => set({ tiltY: val }),
      setTiltZ: (z) => set({ tiltZ: z }),
      setAspectRatio: (ratio) => set({ aspectRatio: ratio }),
      setZoom: (val) => set({ zoom: val }),
      setBrowserMockup: (mockup) => set({ browserMockup: mockup }),
      setDeviceMockup: (mockup) => {
        const defaults = getDefaultScreenConfig(mockup);
        set({
          deviceMockup: mockup,
          ...(defaults ?? {}),
        });
      },
      setBorderRadius: (radius) => set({ borderRadius: radius }),
      setShadowVariant: (index) => set({ shadowVariant: index }),
      setShadowOpacity: (opacity) => set({ shadowOpacity: opacity }),
      setBorderWidth: (width) => set({ borderWidth: width }),
      setBorderColor: (color) => set({ borderColor: color }),
      setIsGlassBorder: (isGlass) => set({ isGlassBorder: isGlass }),

      setAnimation: (anim) => set({ animation: anim }),

      setScreenLeft: (v: number) => set({ screenLeft: v }),
      setScreenTop: (v: number) => set({ screenTop: v }),
      setScreenWidth: (v: number) => set({ screenWidth: v }),
      setScreenHeight: (v: number) => set({ screenHeight: v }),

      addAnnotation: (type, overrides = {}) =>
        set((state) => ({
          annotations: [
            ...state.annotations,
            {
              id: crypto.randomUUID(),
              type,
              x: 50,
              y: 50,
              width:
                type === "text"
                  ? 160
                  : type === "number"
                    ? 36
                    : type === "arrow"
                      ? 100
                      : 120,
              height:
                type === "text"
                  ? 56
                  : type === "number"
                    ? 36
                    : type === "arrow"
                      ? 60
                      : 80,
              text: type === "text" ? "" : "",
              color: state.annotationColor,
              fontSize: state.annotationFontSize,
              fontFamily: state.annotationFontFamily,
              ...overrides, // arrow passes x,y,width,height from draw gesture
            },
          ],
        })),

      updateAnnotation: (id, updates) =>
        set((state) => ({
          annotations: state.annotations.map((ann) =>
            ann.id === id ? { ...ann, ...updates } : ann,
          ),
        })),

      removeAnnotation: (id) =>
        set((state) => ({
          annotations: state.annotations.filter((ann) => ann.id !== id),
        })),

      setActiveAnnotationTool: (tool: AnnotationType | null) =>
        set({ activeAnnotationTool: tool }),

      setAnnotationColor: (color) => set({ annotationColor: color }),

      setAnnotationFontSize: (size) => set({ annotationFontSize: size }),
      setAnnotationFontFamily: (family) =>
        set({ annotationFontFamily: family }),
      setSelectedAnnotationId: (id) => set({ selectedAnnotationId: id }),
    }),

    {
      name: "portfolio-frame-storage", // The key used in chrome.storage.local
      storage: createJSONStorage(() => chromeStorage),
      // partialize: (state) => {
      //   const { imageSource, ...rest } = state;
      //   return rest;
      // },
      // Optional: If you don't want to persist the imageSource across sessions
      // (to save storage space), you can partiallyize the store like this:
      partialize: (state) => ({ ...state, imageSource: null }),
    },
  ),
);
