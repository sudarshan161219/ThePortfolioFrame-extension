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
  | "square"
  | "portrait"
  | "story"
  | "landscape"
  | "slides";

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
export interface AppState {
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
  imageSource: string | null; // ObjectURL — used in DOM/Frame.tsx
  imageSourceRaw: string | null; // base64 — used only in exportVideo()
  bgImage: string | null; // ObjectURL
  bgImageRaw: string | null; // base64
  activeBg: Background | null;

  customBg: string;
  bgBlur: number;
  bgSize: "cover" | "contain" | "auto";
  bgScale: number;
  bgPositionX: number;
  bgPositionY: number;

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

  imageNaturalWidth: number;
  imageNaturalHeight: number;

  annotations: Annotation[];
  activeAnnotationTool: AnnotationType | null;
  annotationColor: string;
  annotationFontSize: number;
  annotationFontFamily: string;
  selectedAnnotationId: string | null;

  /// glass
  glassEnabled: boolean;
  glassScale: number;
  glassRadius: number;
  glassGlow: number;
  glassCurvature: number;
  glassChroma: number;

  // Water mark
  showWatermark: boolean;
  watermarkType: "text" | "logo" | "social" | "qr";
  watermarkQrContent: string;
  watermarkLogo: string | null;
  watermarkSocialPlatform: "x" | "github" | "linkedin" | "instagram";
  watermarkText: string;
  watermarkTheme: "glass" | "dark" | "light" | "transparent";
  watermarkFont: string;
  watermarkColor: string;
  watermarkRadius: number;
  watermarkFontSize: number;

  // watermark Tile
  watermarkTiled: boolean;
  tiledTheme: "solid" | "outline" | "overlay";
  tiledOpacity: number;
  tiledAngle: number;
  tiledFontSize: number;
  tiledSpacing: number;

  // Context Badge
  showContextBadge: boolean;
  contextBadgeText: string;
  badgePosition: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  badgeTheme: "glass" | "dark" | "light" | "transparent";
  badgeRadius: number;
  badgeFontSize: number;
  badgeIconType: "dot" | "emoji" | "custom" | "none";
  badgeIconValue: string;

  // export quality
  exportQuality: number;
  jpegQuality: number;

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
  setImageSourceRaw: (src: string | null) => void;
  setBgImage: (src: string | null) => void;
  setBgImageRaw: (src: string | null) => void;

  setActiveBg: (background: Background | null) => void;

  setCustomBg: (val: string) => void;
  setBgBlur: (val: number) => void;
  setBgSize: (val: "cover" | "contain" | "auto") => void;
  setBgScale: (val: number) => void;
  setBgPositionX: (val: number) => void;
  setBgPositionY: (val: number) => void;
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

  updateImageNaturalSize: (w: number, h: number) => void;

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

  // glass
  setGlassEnabled: (val: boolean) => void;
  setGlassScale: (val: number) => void;
  setGlassRadius: (val: number) => void;
  setGlassGlow: (val: number) => void;
  setGlassCurvature: (val: number) => void;
  setGlassChroma: (val: number) => void;

  // water mark
  setShowWatermark: (show: boolean) => void;
  setWatermarkType: (type: "text" | "logo" | "social" | "qr") => void;
  setWatermarkQrContent: (content: string) => void;
  setWatermarkLogo: (logo: string | null) => void;
  setWatermarkSocialPlatform: (
    platform: "x" | "github" | "linkedin" | "instagram",
  ) => void;
  setWatermarkText: (text: string) => void;
  setWatermarkTheme: (
    theme: "glass" | "dark" | "light" | "transparent",
  ) => void;
  setWatermarkFont: (font: string) => void;
  setWatermarkColor: (color: string) => void;
  setWatermarkRadius: (radius: number) => void;
  setWatermarkFontSize: (size: number) => void;

  // watermark Tile
  setWatermarkTiled: (tiled: boolean) => void;
  setTiledTheme: (theme: "solid" | "outline" | "overlay") => void;
  setTiledOpacity: (opacity: number) => void;
  setTiledAngle: (angle: number) => void;
  setTiledFontSize: (size: number) => void;
  setTiledSpacing: (spacing: number) => void;

  // Context Badge
  setShowContextBadge: (show: boolean) => void;
  setContextBadgeText: (text: string) => void;
  setBadgePosition: (
    pos: "top-left" | "top-right" | "bottom-left" | "bottom-right",
  ) => void;
  setBadgeTheme: (theme: "glass" | "dark" | "light" | "transparent") => void;
  setBadgeRadius: (radius: number) => void;
  setBadgeFontSize: (size: number) => void;
  setBadgeIconType: (type: "dot" | "emoji" | "custom" | "none") => void;
  setBadgeIconValue: (val: string) => void;

  // export
  setExportQuality: (quality: number) => void;
  setJpegQuality: (quality: number) => void;
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
      isPro: true,
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
      imageSourceRaw: null,
      bgImage: null,
      bgImageRaw: null,
      customBg: "",
      bgBlur: 0,
      bgSize: "cover",
      bgScale: 1.0,
      bgPositionX: 50,
      bgPositionY: 50,

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

      imageNaturalWidth: 0,
      imageNaturalHeight: 0,

      annotations: [],
      activeAnnotationTool: "text",
      annotationColor: "#ffffff",
      annotationFontSize: 14,
      annotationFontFamily: "DM Sans, sans-serif",
      selectedAnnotationId: null,

      // glass
      glassEnabled: false,
      glassScale: 0.12,
      glassRadius: 24,
      glassGlow: 0.1,
      glassCurvature: 40,
      glassChroma: 0.15,

      // water mark
      showWatermark: true,

      watermarkType: "social",
      watermarkQrContent: "{url}",
      watermarkLogo: null,
      watermarkSocialPlatform: "x",
      watermarkText: "✨ Made with The Portfolio Frame.",
      watermarkTheme: "glass",
      watermarkFont: "Inter, sans-serif",
      watermarkColor: "#ffffff",
      watermarkRadius: 999, // Pill shape
      watermarkFontSize: 13,

      // watermark Tile
      watermarkTiled: false,
      tiledTheme: "solid",
      tiledOpacity: 0.15, // Subtle default
      tiledAngle: -30, // Classic diagonal
      tiledFontSize: 18,
      tiledSpacing: 250,

      // Context Badge
      showContextBadge: false, // Default off
      contextBadgeText: "Shipped new feature • {date}",
      badgePosition: "bottom-left",
      badgeTheme: "dark", // A sleek dark default looks great for build tags
      badgeRadius: 6,
      badgeFontSize: 11,
      badgeIconType: "dot",
      badgeIconValue: "#34D399",

      // export quality
      exportQuality: 1,
      jpegQuality: 0.95,

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
      setImageSourceRaw: (src) => set({ imageSourceRaw: src }),
      setBgImage: (src) => set({ bgImage: src }),
      setBgImageRaw: (src) => set({ bgImageRaw: src }),
      setCustomBg: (val) => set({ customBg: val }),
      setBgBlur: (val) => set({ bgBlur: val }),
      setBgSize: (val) => set({ bgSize: val }),
      setBgPositionX: (val) => set({ bgPositionX: val }),
      setBgPositionY: (val) => set({ bgPositionY: val }),
      setBgScale: (val) => set({ bgScale: val }),
      setHandle: (val) => set({ handle: val }),
      setActiveBg: (val) => set({ activeBg: val }),
      setTerminalPath: (path) => set({ terminalPath: path }),

      setTiltX: (val) => set({ tiltX: val }),
      setTiltY: (val) => set({ tiltY: val }),
      setTiltZ: (z) => set({ tiltZ: z }),

      updateImageNaturalSize: (w, h) =>
        set({ imageNaturalWidth: w, imageNaturalHeight: h }),

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

      // glass
      setGlassEnabled: (val) => set({ glassEnabled: val }),
      setGlassScale: (val) => set({ glassScale: val }),
      setGlassRadius: (val) => set({ glassRadius: val }),
      setGlassGlow: (val) => set({ glassGlow: val }),
      setGlassCurvature: (val) => set({ glassCurvature: val }),
      setGlassChroma: (val) => set({ glassChroma: val }),

      // water mark
      setShowWatermark: (show) => set({ showWatermark: show }),
      setWatermarkType: (type) => set({ watermarkType: type }),
      setWatermarkQrContent: (content) => set({ watermarkQrContent: content }),
      setWatermarkLogo: (logo) => set({ watermarkLogo: logo }),
      setWatermarkSocialPlatform: (platform) =>
        set({ watermarkSocialPlatform: platform }),
      setWatermarkText: (text) => set({ watermarkText: text }),
      setWatermarkTheme: (theme) => set({ watermarkTheme: theme }),
      setWatermarkFont: (font) => set({ watermarkFont: font }),
      setWatermarkColor: (color) => set({ watermarkColor: color }),
      setWatermarkRadius: (radius) => set({ watermarkRadius: radius }),
      setWatermarkFontSize: (size) => set({ watermarkFontSize: size }),

      // watermark Tile
      setWatermarkTiled: (tiled) => set({ watermarkTiled: tiled }),
      setTiledTheme: (theme) => set({ tiledTheme: theme }),
      setTiledOpacity: (opacity) => set({ tiledOpacity: opacity }),
      setTiledAngle: (angle) => set({ tiledAngle: angle }),
      setTiledFontSize: (size) => set({ tiledFontSize: size }),
      setTiledSpacing: (spacing) => set({ tiledSpacing: spacing }),

      // Context Badge
      setShowContextBadge: (show) => set({ showContextBadge: show }),
      setContextBadgeText: (text) => set({ contextBadgeText: text }),
      setBadgePosition: (pos) => set({ badgePosition: pos }),
      setBadgeTheme: (theme) => set({ badgeTheme: theme }),
      setBadgeRadius: (radius) => set({ badgeRadius: radius }),
      setBadgeFontSize: (size) => set({ badgeFontSize: size }),
      setBadgeIconType: (type) => set({ badgeIconType: type }),
      setBadgeIconValue: (val) => set({ badgeIconValue: val }),

      // image export Quality
      setExportQuality: (quality) => set({ exportQuality: quality }),
      setJpegQuality: (quality) => set({ jpegQuality: quality }),
    }),

    {
      name: "portfolio-frame-storage", // The key used in chrome.storage.local
      storage: createJSONStorage(() => chromeStorage),
      partialize: (state) => ({ ...state, imageSource: null }),
    },
  ),
);
