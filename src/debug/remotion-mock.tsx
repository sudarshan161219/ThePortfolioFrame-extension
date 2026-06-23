import React from "react";

export const useVideoConfig = () => ({
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 120,
});

export const useCurrentFrame = () => 0;

export const spring = ({ to }: { to: number }) => to;

export const AbsoluteFill = ({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div style={{ position: "absolute", inset: 0, ...style }}>{children}</div>
);

export const Gif = ({
  src,
  style,
}: {
  src: string;
  style?: React.CSSProperties;
}) => <img src={src} style={style} />;

export const Img = ({
  src,
  style,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={src} style={style} {...rest} />
);
