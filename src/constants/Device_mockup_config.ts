export interface DeviceMockup {
  id: string;
  label: string;
  src: string;
  aspectRatio: number; // full PNG width / full PNG height
  pngW: number; // full PNG width in px
  pngH: number; // full PNG height in px
  screen: {
    top: string;
    left: string;
    width: string;
    height: string;
    borderRadius?: string;
  };
}

// macbook-pro 2021 16"

export const DEVICE_MOCKUPS: DeviceMockup[] = [
  {
    id: "macbook-pro",
    label: "MacBook Pro",
    src: "/mockups/device/Macbook-Pro.png",
    aspectRatio: 1.573,
    pngW: 5780.46,
    pngH: 3675.65,
    screen: {
      top: "13.20%",
      left: "13%",
      width: "74.43%",
      height: "74%",
      borderRadius: "2px",
    },
  },

  {
    id: "macbook-pro-16",
    label: "MacBook Pro 16",
    src: "/mockups/device/MacBook-Pro-16.png",
    aspectRatio: 1.573,
    pngW: 4000,
    pngH: 2667,
    screen: {
      top: "19%",
      left: "27%",
      width: "46%",
      height: "48%",
      borderRadius: "2px",
    },
  },
  {
    id: "iphone-14-pro",
    label: "iPhone 14 Pro",
    src: "/mockups/device/iPhone-14-Pro.png",
    aspectRatio: 1.573,
    pngW: 4000,
    pngH: 2667,
    screen: {
      top: "15",
      left: "39%",
      width: "22%",
      height: "71%",
      borderRadius: "10px",
    },
  },
  {
    id: "iwatch",
    label: "iWatch",
    src: "/mockups/device/iWatch.png",
    aspectRatio: 1.573,
    pngW: 4000,
    pngH: 2667,
    screen: {
      top: "26.8%",
      left: "35.7%",
      width: "29.5%",
      height: "46.4%",
      borderRadius: "20px",
    },
  },
];
