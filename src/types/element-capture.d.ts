// types/element-capture.d.ts
interface RestrictionTarget {
  readonly id: string;
}

declare const RestrictionTarget: {
  fromElement(element: Element): Promise<RestrictionTarget>;
};

interface BrowserCaptureMediaStreamTrack extends MediaStreamTrack {
  restrictTo(target: RestrictionTarget | null): Promise<void>;
  cropTo(target: CropTarget | null): Promise<void>;
}

interface CropTarget {
  readonly id: string;
}

declare const CropTarget: {
  fromElement(element: Element): Promise<CropTarget>;
};
