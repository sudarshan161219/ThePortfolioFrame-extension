// constants/device_mockups.ts

export interface DeviceMockup {
  id: string;
  label: string;
  src: string; // path to PNG in /public/mockups/
  aspectRatio: number; // frame width / frame height
  ScreenW: number;
  ScreenH: number;
  screen: {
    top: string; // % from top of frame
    left: string; // % from left of frame
    width: string; // % of frame width
    height: string; // % of frame height
    borderRadius?: string;
  };
}

export const DEVICE_MOCKUPS: DeviceMockup[] = [
  {
    id: "dell-ultrasharp-27",
    label: "Dell UltraSharp 27",
    src: "../mockups/device/Dell-UltraSharp-27.png",
    aspectRatio: 1.251,
    ScreenW: 2625,
    ScreenH: 2098,
    screen: {
      top: "0.00%",
      left: "0.00%",
      width: "99.96%",
      height: "99.95%",
      borderRadius: "2px",
    },
  },

  {
    id: "dell-ultrasharp-5k-monitor-27",
    label: "Dell UltraSharp 5K Monitor 27",
    src: "../mockups/device/Dell-UltraSharp-5K-Monitor-27.png",
    aspectRatio: 1.242,
    ScreenW: 4095,
    ScreenH: 3297,
    screen: {
      top: "0.00%",
      left: "0.00%",
      width: "99.98%",
      height: "99.97%",
      borderRadius: "2px",
    },
  },

  {
    id: "apple-thunderbolt-display",
    label: "Apple Thunderbolt Display",
    src: "../mockups/device/Apple-Thunderbolt-Display.png",
    aspectRatio: 1.291,
    ScreenW: 2783,
    ScreenH: 2155,
    screen: {
      top: "0.00%",
      left: "0.00%",
      width: "99.96%",
      height: "99.95%",
      borderRadius: "2px",
    },
  },

  {
    id: "apple-pro-display-xdr",
    label: "Apple Pro Display XDR",
    src: "../mockups/device/Apple-Pro-Display-XDR.png",
    aspectRatio: 1.326,
    ScreenW: 4095,
    ScreenH: 3089,
    screen: {
      top: "0.00%",
      left: "0.00%",
      width: "99.98%",
      height: "99.97%",
      borderRadius: "2px",
    },
  },

  {
    id: "microsoft-surface-book",
    label: "Microsoft Surface Book",
    src: "../mockups/device/Microsoft-Surface-Book.png",
    aspectRatio: 1.687,
    ScreenW: 4095,
    ScreenH: 2427,
    screen: {
      top: "0.00%",
      left: "0.00%",
      width: "99.98%",
      height: "99.96%",
      borderRadius: "2px",
    },
  },

  {
    id: "dell-xps-15",
    label: "Dell XPS 15",
    src: "../mockups/device/Dell-XPS-15.png",
    aspectRatio: 1.876,
    ScreenW: 4095,
    ScreenH: 2182,
    screen: {
      top: "0.00%",
      left: "0.00%",
      width: "99.98%",
      height: "99.95%",
      borderRadius: "2px",
    },
  },

  {
    id: "dell-xps-13",
    label: "Dell XPS 13",
    src: "../mockups/device/Dell-XPS-13.png",
    aspectRatio: 1.699,
    ScreenW: 3833,
    ScreenH: 2255,
    screen: {
      top: "0.00%",
      left: "0.00%",
      width: "99.97%",
      height: "99.96%",
      borderRadius: "2px",
    },
  },

  {
    id: "macbook-pro-15-silver",
    label: "Macbook Pro 15 Silver",
    src: "../mockups/device/Macbook-Pro-15-Silver.png",
    aspectRatio: 1.617,
    ScreenW: 3879,
    ScreenH: 2399,
    screen: {
      top: "0.00%",
      left: "0.00%",
      width: "99.97%",
      height: "99.96%",
      borderRadius: "2px",
    },
  },

  {
    id: "macbook-air-13-silver",
    label: "MacBook Air 13 Silver",
    src: "../mockups/device/MacBook-Air-13-Silver.png",
    aspectRatio: 1.68,
    ScreenW: 3459,
    ScreenH: 2059,
    screen: {
      top: "0.00%",
      left: "0.00%",
      width: "99.97%",
      height: "99.95%",
      borderRadius: "2px",
    },
  },

  {
    id: "apple-macbook-space-grey",
    label: "Apple Macbook Space Grey",
    src: "../mockups/device/Apple-Macbook-Space-Grey.png",
    aspectRatio: 1.703,
    ScreenW: 3063,
    ScreenH: 1798,
    screen: {
      top: "0.00%",
      left: "0.00%",
      width: "99.97%",
      height: "99.94%",
      borderRadius: "2px",
    },
  },

  {
    id: "apple-macbook-gold",
    label: "Apple Macbook Gold",
    src: "../mockups/device/Apple-Macbook-Gold.png",
    aspectRatio: 1.703,
    ScreenW: 3063,
    ScreenH: 1798,
    screen: {
      top: "0.00%",
      left: "0.00%",
      width: "99.97%",
      height: "99.94%",
      borderRadius: "2px",
    },
  },

  {
    id: "imac-retina",
    label: "iMac Retina",
    src: "../mockups/device/iMac-Retina.png",
    aspectRatio: 1.189,
    ScreenW: 4095,
    ScreenH: 3443,
    screen: {
      top: "0.00%",
      left: "0.00%",
      width: "99.98%",
      height: "99.97%",
      borderRadius: "2px",
    },
  },
];
