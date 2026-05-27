import { useRef, useState, useEffect, useCallback } from "react";
import { Rnd } from "react-rnd";
import { useControlsStore } from "../../store/useControlsStore";
import type { Annotation } from "../../store/useControlsStore";
import styles from "./index.module.css";

// ── Arrow renderer (SVG, no Rnd — drawn by drag) ─────────
interface ArrowProps {
  ann: Annotation;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function ArrowAnnotation({ ann, isSelected, onSelect, onRemove }: ArrowProps) {
  const x2 = ann.x + ann.width;
  const y2 = ann.y + ann.height;
  const pad = 12;
  const minX = Math.min(ann.x, x2) - pad;
  const minY = Math.min(ann.y, y2) - pad;
  const svgW = Math.abs(ann.width) + pad * 2;
  const svgH = Math.abs(ann.height) + pad * 2;
  const lx1 = ann.x - minX;
  const ly1 = ann.y - minY;
  const lx2 = x2 - minX;
  const ly2 = y2 - minY;

  return (
    <svg
      className={`${styles.arrowSvg} ${isSelected ? styles.arrowSelected : ""}`}
      style={{ left: minX, top: minY, width: svgW, height: svgH }}
      onClick={onSelect}
    >
      <defs>
        <marker
          id={`arrowhead-${ann.id}`}
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L8,3 z" fill={ann.color} />
        </marker>
      </defs>
      <line
        x1={lx1}
        y1={ly1}
        x2={lx2}
        y2={ly2}
        stroke={ann.color}
        strokeWidth="2.5"
        strokeLinecap="round"
        markerEnd={`url(#arrowhead-${ann.id})`}
      />
      {isSelected && (
        <foreignObject x={lx2 - 8} y={ly2 - 8} width="16" height="16">
          <button
            className={styles.deleteBtn}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            ×
          </button>
        </foreignObject>
      )}
    </svg>
  );
}

// ── Arrow drawing overlay ─────────────────────────────────
interface DrawingArrow {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

// ── Main component ────────────────────────────────────────
export const AnnotationLayer = () => {
  const {
    annotations,
    updateAnnotation,
    removeAnnotation,
    addAnnotation,
    activeAnnotationTool,
    setActiveAnnotationTool,
  } = useControlsStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drawing, setDrawing] = useState<DrawingArrow | null>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Deselect on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (layerRef.current && !layerRef.current.contains(e.target as Node)) {
        setSelectedId(null);
        setEditingId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveAnnotationTool(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setActiveAnnotationTool]);

  // ── Arrow drawing handlers ────────────────────────────
  const handleLayerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (activeAnnotationTool !== "arrow") return;
      const rect = layerRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setDrawing({ startX: x, startY: y, endX: x, endY: y });
    },
    [activeAnnotationTool],
  );

  const handleLayerMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!drawing) return;
      const rect = layerRef.current!.getBoundingClientRect();
      setDrawing((d) =>
        d
          ? { ...d, endX: e.clientX - rect.left, endY: e.clientY - rect.top }
          : null,
      );
    },
    [drawing],
  );

  const handleLayerMouseUp = useCallback(() => {
    if (!drawing) return;
    const dx = drawing.endX - drawing.startX;
    const dy = drawing.endY - drawing.startY;
    // Ignore tiny accidental clicks
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      addAnnotation("arrow", {
        x: drawing.startX,
        y: drawing.startY,
        width: dx,
        height: dy,
      });
    }
    setDrawing(null);
    setActiveAnnotationTool(null);
  }, [drawing, addAnnotation, setActiveAnnotationTool]);

  // ── Click outside annotation to deselect ─────────────
  const handleLayerClick = (e: React.MouseEvent) => {
    if (e.target === layerRef.current) {
      setSelectedId(null);
      setEditingId(null);
    }
  };

  if (annotations.length === 0 && !drawing && activeAnnotationTool !== "arrow")
    return null;

  return (
    <div
      ref={layerRef}
      className={`${styles.layer} ${activeAnnotationTool === "arrow" ? styles.layerDrawing : ""}`}
      onMouseDown={handleLayerMouseDown}
      onMouseMove={handleLayerMouseMove}
      onMouseUp={handleLayerMouseUp}
      onClick={handleLayerClick}
    >
      {/* Live arrow preview while drawing */}
      {drawing && (
        <svg className={styles.drawingPreview}>
          <defs>
            <marker
              id="preview-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L0,6 L8,3 z" fill="var(--accent-main)" />
            </marker>
          </defs>
          <line
            x1={drawing.startX}
            y1={drawing.startY}
            x2={drawing.endX}
            y2={drawing.endY}
            stroke="var(--accent-main)"
            strokeWidth="2.5"
            strokeDasharray="6 3"
            strokeLinecap="round"
            markerEnd="url(#preview-arrow)"
          />
        </svg>
      )}

      {annotations.map((ann) => {
        const isSelected = selectedId === ann.id;
        const isEditing = editingId === ann.id;

        // ── Arrow ───────────────────────────────────────
        if (ann.type === "arrow") {
          return (
            <ArrowAnnotation
              key={ann.id}
              ann={ann}
              isSelected={isSelected}
              onSelect={() => setSelectedId(ann.id)}
              onRemove={() => removeAnnotation(ann.id)}
            />
          );
        }

        // ── Text + Box (Rnd) ────────────────────────────
        return (
          <Rnd
            key={ann.id}
            className={`${styles.rnd} ${isSelected ? styles.rndSelected : ""}`}
            bounds="parent"
            position={{ x: ann.x, y: ann.y }}
            size={{ width: ann.width, height: ann.height }}
            disableDragging={isEditing}
            onMouseDown={(e: MouseEvent) => {
              e.stopPropagation();
              setSelectedId(ann.id);
            }}
            onDragStop={(_e: unknown, d: { x: number; y: number }) =>
              updateAnnotation(ann.id, { x: d.x, y: d.y })
            }
            onResizeStop={(
              _e: unknown,
              _dir: unknown,
              ref: HTMLElement,
              _delta: unknown,
              pos: { x: number; y: number },
            ) =>
              updateAnnotation(ann.id, {
                width: parseFloat(ref.style.width),
                height: parseFloat(ref.style.height),
                x: pos.x,
                y: pos.y,
              })
            }
          >
            <div className={styles.annInner}>
              {/* Delete */}
              {isSelected && (
                <button
                  className={styles.deleteBtn}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAnnotation(ann.id);
                    setSelectedId(null);
                  }}
                >
                  ×
                </button>
              )}

              {/* Text */}
              {ann.type === "text" && (
                <>
                  {isEditing ? (
                    <textarea
                      autoFocus
                      className={styles.textArea}
                      style={{ borderColor: ann.color }}
                      value={ann.text ?? ""}
                      onChange={(e) =>
                        updateAnnotation(ann.id, { text: e.target.value })
                      }
                      onBlur={() => setEditingId(null)}
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div
                      className={`${styles.textDisplay} ${isSelected ? styles.textDisplaySelected : ""}`}
                      style={{
                        borderColor: isSelected ? ann.color : "transparent",
                      }}
                      onDoubleClick={() => {
                        if (clickTimer.current)
                          clearTimeout(clickTimer.current);
                        setEditingId(ann.id);
                      }}
                    >
                      {ann.text || (
                        <span className={styles.placeholder}>
                          Double-click to edit
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Box */}
              {ann.type === "box" && (
                <div
                  className={styles.box}
                  style={{ borderColor: ann.color }}
                />
              )}
            </div>
          </Rnd>
        );
      })}
    </div>
  );
};
