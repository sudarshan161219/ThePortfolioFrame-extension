type AnnotationType =
  | "text"
  | "box"
  | "arrow"
  | "number"
  | "highlight"
  | "redact";

interface Annotation {
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

export const ANNOTATION_LABEL = (ann: Annotation, i: number) => {
  if (ann.type === "text") return ann.text?.slice(0, 18) || "Text";
  if (ann.type === "number") return `Step ${ann.number ?? i + 1}`;
  if (ann.type === "arrow") return `Arrow ${i + 1}`;
  if (ann.type === "box") return `Box ${i + 1}`;
  if (ann.type === "highlight") return `Highlight ${i + 1}`;
  if (ann.type === "redact") return `Redact ${i + 1}`;
  return `Layer ${i + 1}`;
};
