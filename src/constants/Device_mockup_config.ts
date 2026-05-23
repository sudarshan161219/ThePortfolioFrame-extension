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
      height: "73.02%",
      borderRadius: "2px",
    },
  },

  {
    id: "macbook-pro-2021-16",
    label: "macbook pro 2021 16",
    src: "/mockups/device/macbook-pro-2021-16.png",
    aspectRatio: 1.573,
    pngW: 5780.46,
    pngH: 3675.65,
    screen: {
      top: "13.20%",
      left: "13%",
      width: "74.43%",
      height: "73.02%",
      borderRadius: "2px",
    },
  },
  {
    id: "iphone-14-pro",
    label: "iPhone 14 Pro",
    src: "/mockups/device/iPhone-14-Pro.png",
    aspectRatio: 0.883,
    pngW: 4035.38,
    pngH: 4569.64,
    screen: {
      top: "6.04%", // top looks right
      left: "27.04%", // need relative x from Figma
      width: "45.92%", // width looks right
      height: "88.06%",
      borderRadius: "40px",
    },
  },
  {
    id: "iwatch",
    label: "iWatch",
    src: "/mockups/device/iWatch.png",
    aspectRatio: 0.628,
    pngW: 2420.73,
    pngH: 3855.24,
    screen: {
      top: "21.97%",
      left: "13.04%",
      width: "73.76%",
      height: "56.46%",
      borderRadius: "20px",
    },
  },
];
