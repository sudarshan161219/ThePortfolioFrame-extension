import { useRef, useState, useEffect, useCallback } from "react";
import { Rnd } from "react-rnd";
import { useControlsStore } from "../../store/useControlsStore";
import type { Annotation } from "../../store/useControlsStore";
import styles from "./index.module.css";

// ── Arrow ─────────────────────────────────────────────────
function ArrowAnnotation({
  ann,
  zoom,
  isSelected,
  onDragStart,
  onDragStop,
  onSelect,
  onRemove,

  // onUpdate,
}: {
  ann: Annotation;
  isSelected: boolean;
  zoom: number;
  onDragStart: () => void;
  onDragStop: (e: unknown, d: Partial<Annotation>) => void;
  onSelect: () => void;
  onRemove: () => void;
  // onUpdate: (updates: Partial<Annotation>) => void;
}) {
  const x2 = ann.x + ann.width;
  const y2 = ann.y + ann.height;
  const pad = 16;
  const minX = Math.min(ann.x, x2) - pad;
  const minY = Math.min(ann.y, y2) - pad;
  const svgW = Math.abs(ann.width) + pad * 2;
  const svgH = Math.abs(ann.height) + pad * 2;
  const lx1 = ann.x - minX;
  const ly1 = ann.y - minY;
  const lx2 = x2 - minX;
  const ly2 = y2 - minY;

  return (
    <Rnd
      className={`${styles.rnd} ${isSelected ? styles.rndSelected : ""}`}
      scale={zoom}
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      dragGrid={[1, 1]}
      bounds="parent"
      position={{ x: minX, y: minY }}
      size={{ width: svgW, height: svgH }}
      enableResizing={false}
      onMouseDown={(e: MouseEvent) => {
        e.stopPropagation();
        onSelect();
      }}
      // onDragStop={(_e: unknown, d: { x: number; y: number }) => {
      //   // Calculate exactly how many pixels the user dragged the box
      //   const dragDeltaX = d.x - minX;
      //   const dragDeltaY = d.y - minY;

      //   // Apply that movement to the arrow's true anchor coordinates
      //   onUpdate({
      //     x: ann.x + dragDeltaX,
      //     y: ann.y + dragDeltaY,
      //   });
      // }}
    >
      <div className={styles.annInner}>
        {isSelected && (
          <foreignObject x={lx2 - 10} y={ly2 - 10} width="20" height="20">
            <button
              className={styles.deleteBtn}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              ×
            </button>
          </foreignObject>
        )}

        <svg
          className={styles.arrowSvg}
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <marker
              id={`ah-${ann.id}`}
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
            markerEnd={`url(#ah-${ann.id})`}
          />
        </svg>
      </div>
    </Rnd>
  );
}

// ── Number marker ─────────────────────────────────────────
function NumberAnnotation({
  ann,
  zoom,
  isSelected,
  onSelect,
  onRemove,
  onUpdate,
}: {
  ann: Annotation;
  zoom: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onUpdate: (updates: Partial<Annotation>) => void;
}) {
  return (
    <Rnd
      className={`${styles.rnd} ${isSelected ? styles.rndSelected : ""}`}
      scale={zoom}
      bounds="parent"
      dragGrid={[1, 1]}
      F
      position={{ x: ann.x, y: ann.y }}
      size={{ width: ann.width, height: ann.height }}
      lockAspectRatio
      onMouseDown={(e: MouseEvent) => {
        e.stopPropagation();
        onSelect();
      }}
      onDragStop={(_e: unknown, d: { x: number; y: number }) =>
        onUpdate({ x: d.x, y: d.y })
      }
      onResizeStop={(
        _e: unknown,
        _dir: unknown,
        ref: HTMLElement,
        _delta: unknown,
        pos: { x: number; y: number },
      ) =>
        onUpdate({
          width: parseFloat(ref.style.width),
          height: parseFloat(ref.style.height),
          x: pos.x,
          y: pos.y,
        })
      }
    >
      <div className={styles.annInner}>
        {isSelected && (
          <button
            className={styles.deleteBtn}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            ×
          </button>
        )}
        <div
          className={styles.numberMarker}
          style={{ background: ann.color, fontSize: ann.fontSize ?? 14 }}
        >
          {ann.number ?? 1}
        </div>
      </div>
    </Rnd>
  );
}

// ── Main ──────────────────────────────────────────────────
interface DrawingState {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const AnnotationLayer = () => {
  const {
    zoom,
    annotations,
    addAnnotation,
    updateAnnotation,
    removeAnnotation,
    activeAnnotationTool,
    selectedAnnotationId,
    setActiveAnnotationTool,
    setSelectedAnnotationId,
  } = useControlsStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drawing, setDrawing] = useState<DrawingState | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const layerRef = useRef<HTMLDivElement>(null);

  // Esc cancels draw mode
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveAnnotationTool(null);
        setDrawing(null);
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedAnnotationId && editingId !== selectedAnnotationId) {
          removeAnnotation(selectedAnnotationId);
          setSelectedAnnotationId(null);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    selectedAnnotationId,
    editingId,
    setActiveAnnotationTool,
    removeAnnotation,
    setSelectedAnnotationId,
  ]);

  // Draw handlers (arrow + box + highlight + redact use drag-to-draw)
  const isDrawMode = ["arrow", "box", "highlight", "redact"].includes(
    activeAnnotationTool ?? "",
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawMode) return;

      const rect = layerRef.current!.getBoundingClientRect();

      // Calculate local visual coordinates and divide by zoom
      const scaleAwareX = (e.clientX - rect.left) / zoom;
      const scaleAwareY = (e.clientY - rect.top) / zoom;

      setDrawing({
        startX: scaleAwareX,
        startY: scaleAwareY,
        endX: scaleAwareX,
        endY: scaleAwareY,
      });
    },

    [isDrawMode, zoom],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!drawing) return;

      const rect = layerRef.current!.getBoundingClientRect();

      // 1. Calculate local visual coordinates
      const visualX = e.clientX - rect.left;
      const visualY = e.clientY - rect.top;

      // 2. Divide by the global zoom state to get logical coordinates
      const scaleAwareX = visualX / zoom;
      const scaleAwareY = visualY / zoom;

      setDrawing((d) =>
        d ? { ...d, endX: scaleAwareX, endY: scaleAwareY } : null,
      );
    },
    // 3. CRITICAL: Add zoom to the dependency array!
    [drawing, zoom],
  );

  const handleMouseUp = useCallback(() => {
    if (!drawing || !activeAnnotationTool) return;
    const dx = drawing.endX - drawing.startX;
    const dy = drawing.endY - drawing.startY;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
      if (activeAnnotationTool === "arrow") {
        addAnnotation("arrow", {
          x: drawing.startX,
          y: drawing.startY,
          width: dx,
          height: dy,
        });
      } else {
        const x = Math.min(drawing.startX, drawing.endX);
        const y = Math.min(drawing.startY, drawing.endY);
        addAnnotation(activeAnnotationTool as any, {
          x,
          y,
          width: Math.abs(dx),
          height: Math.abs(dy),
        });
      }
      setActiveAnnotationTool(null);
    }
    setDrawing(null);
  }, [drawing, activeAnnotationTool, addAnnotation, setActiveAnnotationTool]);

  const previewStyle = drawing
    ? {
        left: Math.min(drawing.startX, drawing.endX),
        top: Math.min(drawing.startY, drawing.endY),
        width: Math.abs(drawing.endX - drawing.startX),
        height: Math.abs(drawing.endY - drawing.startY),
      }
    : null;

  if (annotations.length === 0 && !drawing && !isDrawMode) return null;

  return (
    <>
      {isDragging && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            cursor: "move",
          }}
        />
      )}

      <div
        ref={layerRef}
        className={`${styles.layer} ${isDrawMode ? styles.layerDrawing : ""}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={(e) => {
          if (e.target === layerRef.current) {
            setSelectedAnnotationId(null);
            setEditingId(null);
          }
        }}
      >
        {/* Draw preview */}
        {drawing && activeAnnotationTool !== "arrow" && previewStyle && (
          <div
            className={`${styles.drawPreview} ${
              activeAnnotationTool === "highlight"
                ? styles.drawPreviewHighlight
                : activeAnnotationTool === "redact"
                  ? styles.drawPreviewRedact
                  : styles.drawPreviewBox
            }`}
            style={previewStyle}
          />
        )}
        {drawing && activeAnnotationTool === "arrow" && (
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
          const isSelected = selectedAnnotationId === ann.id;
          const isEditing = editingId === ann.id;
          const update = (u: Partial<Annotation>) =>
            updateAnnotation(ann.id, u);
          const remove = () => {
            removeAnnotation(ann.id);
            setSelectedAnnotationId(null);
          };
          const select = () => setSelectedAnnotationId(ann.id);

          // ── Arrow ─────────────────────────────────────
          if (ann.type === "arrow") {
            return (
              <ArrowAnnotation
                key={ann.id}
                zoom={zoom}
                onDragStart={() => setIsDragging(true)}
                onDragStop={(_e, d) => {
                  setIsDragging(false);
                  updateAnnotation(ann.id, { x: d.x, y: d.y });
                }}
                ann={ann}
                isSelected={isSelected}
                onSelect={select}
                onRemove={remove}
                // onUpdate={update}
              />
            );
          }

          // ── Number marker ─────────────────────────────
          if (ann.type === "number") {
            return (
              <NumberAnnotation
                key={ann.id}
                zoom={zoom}
                // onDragStart={() => setIsDragging(true)}
                ann={ann}
                isSelected={isSelected}
                onSelect={select}
                onRemove={remove}
                onUpdate={update}
              />
            );
          }

          // ── Rnd-based: text, box, highlight, redact ───
          return (
            <Rnd
              key={ann.id}
              scale={zoom}
              onDragStart={() => setIsDragging(true)}
              onDragStop={(_e, d) => {
                setIsDragging(false);
                updateAnnotation(ann.id, { x: d.x, y: d.y });
              }}
              className={`${styles.rnd} ${isSelected ? styles.rndSelected : ""}`}
              dragGrid={[1, 1]}
              bounds="parent"
              position={{ x: ann.x, y: ann.y }}
              size={{ width: ann.width, height: ann.height }}
              disableDragging={isEditing}
              onMouseDown={(e: MouseEvent) => {
                e.stopPropagation();
                select();
              }}
              // onDragStop={(_e: unknown, d: { x: number; y: number }) =>
              //   update({ x: d.x, y: d.y })
              // }
              onResizeStart={() => setIsDragging(true)}
              onResizeStop={(
                _e: unknown,
                _dir: unknown,
                ref: HTMLElement,
                _delta: unknown,
                pos: { x: number; y: number },
              ) => {
                setIsDragging(false);
                update({
                  width: parseFloat(ref.style.width),
                  height: parseFloat(ref.style.height),
                  x: pos.x,
                  y: pos.y,
                });
              }}
            >
              <div className={styles.annInner}>
                {isSelected && (
                  <button
                    className={styles.deleteBtn}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      remove();
                    }}
                  >
                    ×
                  </button>
                )}

                {/* Text */}
                {ann.type === "text" &&
                  (isEditing ? (
                    <textarea
                      autoFocus
                      className={styles.textArea}
                      style={{
                        borderColor: ann.color,
                        fontSize: ann.fontSize ?? 14,
                        fontFamily: ann.fontFamily ?? "DM Sans, sans-serif",
                      }}
                      value={ann.text ?? ""}
                      onChange={(e) => update({ text: e.target.value })}
                      onBlur={() => setEditingId(null)}
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div
                      className={`${styles.textDisplay} ${isSelected ? styles.textDisplaySelected : ""}`}
                      style={{
                        borderColor: isSelected ? ann.color : "transparent",
                        fontSize: ann.fontSize ?? 14,
                        fontFamily: ann.fontFamily ?? "DM Sans, sans-serif",
                        color: ann.color,
                      }}
                      onDoubleClick={() => setEditingId(ann.id)}
                    >
                      {ann.text || (
                        <span className={styles.placeholder}>
                          Double-click to edit
                        </span>
                      )}
                    </div>
                  ))}

                {/* Box */}
                {ann.type === "box" && (
                  <div
                    className={styles.box}
                    style={{ borderColor: ann.color }}
                  />
                )}

                {/* Highlight */}
                {ann.type === "highlight" && (
                  <div
                    className={styles.highlight}
                    style={{ background: ann.color }}
                  />
                )}

                {/* Redact */}
                {ann.type === "redact" && <div className={styles.redact} />}
              </div>
            </Rnd>
          );
        })}
      </div>
    </>
  );
};
