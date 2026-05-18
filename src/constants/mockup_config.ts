type TextOverlay = {
  type: "url" | "title";
  top: string;
  left: string;
  width: string;
  fontSize: string;
  color: string;
  align: "left" | "center";
  fontWeight?: string;
};

type MockupConfig = {
  src: string;
  overlays: TextOverlay[];
};

export const MOCKUP_CONFIG: Record<string, MockupConfig> = {
  "chrome-win-light": {
    src: "/chrome-win-light.png",
    overlays: [
      {
        type: "title",
        top: "18%",
        left: "4%",
        width: "25%",
        fontSize: "0.9cqw",
        color: "#4A4A4A",
        align: "left",
      },
      {
        type: "url",
        top: "58%",
        left: "10%",
        width: "60%",
        fontSize: "1.01cqw",
        color: "#1F1F1F",
        align: "left",
      },
    ],
  },
  "chrome-win-dark": {
    src: "/chrome-win-dark.png",
    overlays: [
      {
        type: "title",
        top: "22%",
        left: "4%",
        width: "25%",
        fontSize: "0.9cqw",
        color: "#9CA3AF",
        align: "left",
      },
      {
        type: "url",
        top: "58%",
        left: "10%",
        width: "60%",
        fontSize: "1.01cqw",
        color: "#E3E3E3",
        align: "left",
      },
    ],
  },
  "chrome-mac-light": {
    src: "/chrome-mac-light.png",
    overlays: [
      {
        type: "title",
        top: "29%",
        left: "7%",
        width: "25%",
        fontSize: "1cqw",
        color: "#4A4A4A", // Dark grey for light mode tab
        align: "left",
      },
      {
        type: "url",
        top: "73%",
        left: "10%",
        width: "64%",
        fontSize: "1.01cqw",
        color: "#1F1F1F",
        align: "left",
      },
    ],
  },
  "chrome-mac-dark": {
    src: "/chrome-mac-dark.png",
    overlays: [
      {
        type: "title",
        top: "26%",
        left: "7%",
        width: "25%",
        fontSize: "1cqw",
        color: "#9CA3AF",
        align: "left",
      },
      {
        type: "url",
        top: "73%",
        left: "10%",
        width: "64%",
        fontSize: "1.01cqw",
        color: "#E3E3E3",
        align: "left",
      },
    ],
  },
  "safari-mac-light": {
    src: "/safari-mac-light.png",
    overlays: [
      {
        type: "url",
        top: "50%",
        left: "41%",
        width: "27%",
        fontSize: "1cqw",
        color: "#1F1F1F",
        align: "center",
        fontWeight: "600",
      },
    ],
  },
  "safari-mac-dark": {
    src: "/safari-mac-dark.png",
    overlays: [
      {
        type: "url",
        top: "50%",
        left: "41%",
        width: "27%",
        fontSize: "1cqw",
        color: "#E3E3E3",
        align: "center",
        fontWeight: "600",
      },
    ],
  },
} as const;
