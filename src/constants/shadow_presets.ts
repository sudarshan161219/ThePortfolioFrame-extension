export const SHADOW_PRESETS = [
  { label: "None", value: "none" },

  // Minimal
  { label: "Hairline", value: "0 1px 2px rgba(0, 0, 0, __OPACITY__)" },
  { label: "Subtle", value: "0 4px 20px rgba(0, 0, 0, __OPACITY__)" },
  { label: "Soft", value: "0 10px 30px rgba(0, 0, 0, __OPACITY__)" },

  // Elevated
  { label: "Lift", value: "0 12px 24px -6px rgba(0, 0, 0, __OPACITY__)" },
  { label: "Float", value: "0 15px 40px -5px rgba(0, 0, 0, __OPACITY__)" },
  { label: "Hover", value: "0 20px 45px -10px rgba(0, 0, 0, __OPACITY__)" },

  // Strong
  { label: "Deep", value: "0 25px 50px -12px rgba(0, 0, 0, __OPACITY__)" },
  { label: "Heavy", value: "0 35px 65px -15px rgba(0, 0, 0, __OPACITY__)" },
  { label: "Max", value: "0 40px 80px -20px rgba(0, 0, 0, __OPACITY__)" },

  // Stylized
  {
    label: "Glow",
    value: "0 0 30px rgba(0, 0, 0, calc(__OPACITY__ + 0.05))",
  },
  {
    label: "Ambient",
    value:
      "0 10px 40px rgba(0, 0, 0, calc(__OPACITY__ * 0.6)), 0 2px 8px rgba(0, 0, 0, calc(__OPACITY__ * 0.4))",
  },
  {
    label: "Layered",
    value:
      "0 4px 10px rgba(0,0,0,calc(__OPACITY__ * 0.5)), 0 20px 40px rgba(0,0,0,calc(__OPACITY__ * 0.4))",
  },
  {
    label: "Cinema",
    value: "0 30px 90px -25px rgba(0, 0, 0, __OPACITY__)",
  },
  {
    label: "Dream",
    value:
      "0 8px 30px rgba(0,0,0,calc(__OPACITY__ * 0.35)), 0 0 60px rgba(0,0,0,calc(__OPACITY__ * 0.15))",
  },
];
