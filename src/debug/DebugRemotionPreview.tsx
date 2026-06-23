import { RemotionFrame } from "../components/remotionFrame/RemotionFrame";
import { useControlsStore } from "../store/useControlsStore";
import { ratios } from "../constants/ratios";

export const DebugRemotionPreview = () => {
  const appState = useControlsStore.getState();
  const ratio = ratios.find((r) => r.value === appState.aspectRatio);

  return (
    <div
      style={{
        width: ratio?.width ?? 1920,
        height: ratio?.height ?? 1080,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <RemotionFrame
        {...(appState as any)}
        imageSourceRaw={appState.imageSourceRaw}
        bgImageRaw={appState.bgImageRaw}
        previewScale={1}
      />
    </div>
  );
};
