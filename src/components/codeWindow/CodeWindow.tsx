import CodeEditor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-rust";
import "prismjs/themes/prism-tomorrow.css";

import { useControlsStore } from "../../store/useControlsStore";
import styles from "./index.module.css";

const Editor = (CodeEditor as any).default || CodeEditor;

const LANGUAGE_ICONS = {
  javascript: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#F7DF1E">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M21.99 2.22H2.01c-.55 0-.99.44-.99.99v17.58c0 .55.44.99.99.99h19.98c.55 0 .99-.44.99-.99V3.21c0-.55-.44-.99-.99-.99zM11.55 19.43c-1.39 1.15-3.32 1.63-5.26 1.14-.38-.1-.66-.43-.69-.82l-.12-1.92c-.03-.54.34-1.01.88-1.07.61-.06 1.25.04 1.83.27.75.29 1.11.83 1.11 1.65v.02c0 .24.11.46.3.6.43.32 1.05.35 1.5.06.33-.21.49-.57.49-.96V11.2c0-.55.45-1 1-1h1.56c.55 0 1 .45 1 1v7.22c0 1.2-.5 2.14-1.42 2.76-.92.62-2.18.77-3.18.25zM21 16.5c0 3.25-2.6 4.62-5.73 4.62-1.4 0-2.81-.32-4.04-.97-.43-.23-.65-.72-.54-1.2l.37-1.74c.12-.55.66-.88 1.18-.73 1.07.31 2.21.44 3.26.44 1.54 0 2.3-.47 2.3-1.22 0-.68-.53-.98-1.78-1.4l-.87-.29c-2.31-.77-3.37-1.96-3.37-3.83 0-2.73 2.19-4.22 5.25-4.22 1.27 0 2.49.2 3.65.62.46.17.72.67.57 1.14l-.45 1.48c-.14.47-.64.75-1.12.63-1.03-.26-2.09-.36-3.13-.36-1.16 0-1.77.34-1.77.94 0 .54.43.83 1.46 1.18l.89.31c2.51.87 3.57 2.1 3.57 4.14z" />
    </svg>
  ),
  typescript: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#3178C6">
      <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zm16.536 12.879c1.996 0 3.243 1.018 3.243 2.652 0 2.277-1.848 3.197-4.28 3.197-1.233 0-2.39-.234-3.418-.73a.855.855 0 01-.422-1.078l.848-1.916a.82.82 0 011.054-.42c.691.31 1.503.54 2.23.54.896 0 1.341-.284 1.341-.745 0-.443-.377-.665-1.428-1.018l-.75-.247c-2.052-.693-3.078-1.884-3.078-3.6 0-1.994 1.583-3.178 3.864-3.178 1.139 0 2.115.19 3.03.568a.86.86 0 01.472 1.082l-.78 1.838a.837.837 0 01-1.04.453 5.485 5.485 0 00-1.97-.378c-.812 0-1.222.284-1.222.684 0 .43.344.62 1.25.908l.764.254a6.574 6.574 0 01.3-.1zM11.196 6.516h4.084a.826.826 0 01.826.826v1.442a.826.826 0 01-.826.826h-1.636v8.423a.826.826 0 01-.826.826H9.72a.826.826 0 01-.826-.826V9.61h-1.63a.826.826 0 01-.826-.826V7.342a.826.826 0 01.826-.826h3.932z" />
    </svg>
  ),
  python: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#3776AB">
      <path d="M11.758 1.18c-3.155 0-5.717 2.126-5.717 5.752v2.541h5.811v.65H5.481C2.529 10.123.633 12.39.633 15.65c0 3.255 1.956 5.568 4.966 5.568h2.096v-3.048c0-2.316 1.866-4.183 4.182-4.183h4.634c1.192 0 2.148-.956 2.148-2.148v-8.08c0-1.393-1.123-2.516-2.516-2.516h-4.385zm-.69 2.06c.646 0 1.173.528 1.173 1.174s-.527 1.173-1.173 1.173-1.174-.527-1.174-1.173.528-1.174 1.174-1.174zm7.427 6.467c0 1.256-1.007 2.262-2.263 2.262h-4.633c-1.332 0-2.427 1.096-2.427 2.428v4.98c0 1.417 1.139 2.556 2.556 2.556h4.63c3.085 0 5.093-2.228 5.093-5.385v-2.7h-5.81v-.65h6.368c2.955 0 4.864-2.26 4.864-5.508 0-3.242-1.89-5.556-4.88-5.556h-1.921v2.986c0 2.37-1.91 4.28-4.28 4.28h-1.464c-1.11 0-2.012.902-2.012 2.012v.294zm-2.072 8.65c.646 0 1.174.528 1.174 1.174 0 .646-.528 1.173-1.174 1.173-.646 0-1.173-.527-1.173-1.173 0-.646.527-1.174 1.173-1.174z" />
    </svg>
  ),
  css: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#1572B6">
      <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.16l-.24-2.7H3.64l1.39 15.53 6.94 1.94 6.96-1.93.44-4.9h-2.58l-.18 2.01-4.64 1.26-4.67-1.26-.33-3.64h12.57l.18-2.05-12.78.01-.22-2.41h12.38l.19-2.05H5.06l-.2-2.22h13.73z" />
    </svg>
  ),
  rust: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#DEA584">
      <path d="M23.834 8.163a.855.855 0 00-.709-.43l-2.062-.12a10.027 10.027 0 00-.737-2.253l1.455-1.472a.853.853 0 00.111-.979L20.25 1.05a.85.85 0 00-1.042-.317l-1.916.787a10.04 10.04 0 00-1.979-1.282L15.016.14a.855.855 0 00-.819-.596H9.805a.855.855 0 00-.82.596L8.68 2.24A9.972 9.972 0 006.7 3.522l-1.917-.787a.852.852 0 00-1.041.317L2.1 4.912a.85.85 0 00.11.978l1.456 1.472A9.944 9.944 0 002.93 9.615l-2.062.12a.854.854 0 00-.71.43L.1 11.895a.854.854 0 000 .822l2.062 1.73a9.98 9.98 0 00.737 2.254l-1.455 1.472a.85.85 0 00-.111.979l1.642 1.859a.85.85 0 001.042.317l1.916-.787a9.984 9.984 0 001.979 1.282l.297 2.1a.854.854 0 00.819.595h4.39a.855.855 0 00.82-.596l.298-2.1a9.972 9.972 0 001.979-1.281l1.917.787a.855.855 0 001.041-.317l1.643-1.86a.85.85 0 00-.111-.978l-1.456-1.472a9.944 9.944 0 00.737-2.253l2.062-.12a.855.855 0 00.71-.43l.058-1.731a.855.855 0 00-.058-.823L23.834 8.163zM12 18.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z" />
    </svg>
  ),
};

// Helper to parse "1, 3-5" into [1, 3, 4, 5]
const parseHighlightedLines = (input: string) => {
  const lines = new Set<number>();
  if (!input.trim()) return [];

  const parts = input.split(",");
  for (const part of parts) {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) lines.add(i);
      }
    } else {
      const num = Number(part);
      if (!isNaN(num)) lines.add(num);
    }
  }
  return Array.from(lines);
};

export const CodeWindow = () => {
  const borderRadius = useControlsStore((s) => s.borderRadius);
  const shadowOpacity = useControlsStore((s) => s.shadowOpacity);
  const codeSnippet = useControlsStore((s) => s.codeSnippet);
  const codeLanguage = useControlsStore((s) => s.codeLanguage);
  const codeTheme = useControlsStore((s) => s.codeTheme);
  const codeFontFamily = useControlsStore((s) => s.codeFontFamily);
  const showLanguageBadge = useControlsStore((s) => s.showLanguageBadge);
  const windowStyle = useControlsStore((s) => s.windowStyle);
  const showLineNumbers = useControlsStore((s) => s.showLineNumbers);
  const highlightedLines = useControlsStore((s) => s.highlightedLines);
  const codeFontSize = useControlsStore((s) => s.codeFontSize);
  const frameBorder = useControlsStore((s) => s.frameBorder);
  const setCodeSnippet = useControlsStore((s) => s.setCodeSnippet);

  // Calculations for perfect visual alignment
  const lineHeight = codeFontSize * 1.5;
  const editorPaddingTop = 24;
  const linesCount = codeSnippet.split("\n").length || 1;
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);
  const activeLines = parseHighlightedLines(highlightedLines);

  const highlightCode = (code: string) => {
    if (Prism.languages[codeLanguage]) {
      return Prism.highlight(code, Prism.languages[codeLanguage], codeLanguage);
    }
    return code;
  };

  return (
    <div
      className={`${styles.windowContainer} ${styles[`theme${codeTheme.charAt(0).toUpperCase() + codeTheme.slice(1)}`]}`}
      style={{
        borderRadius: `${borderRadius}px`,
        boxShadow: `0 20px 40px rgba(0, 0, 0, ${shadowOpacity}`,
        border:
          frameBorder === "none"
            ? "none"
            : frameBorder === "thin"
              ? "1px solid rgba(255, 255, 255, 0.15)"
              : frameBorder === "dashed"
                ? "2px dashed rgba(255, 255, 255, 0.3)"
                : "4px solid rgba(255, 255, 255, 0.1)",
        backgroundClip: frameBorder === "glass" ? "padding-box" : "border-box",
      }}
    >
      {/* macOS Style Header Bar */}
      {/* 2. Dynamic Header Styles */}
      <div
        className={`${styles.header} ${styles[`header${windowStyle.charAt(0).toUpperCase() + windowStyle.slice(1)}`]}`}
      >
        {windowStyle === "mac" && (
          <div className={styles.macButtons}>
            <span className={styles.dot} style={{ background: "#FF5F56" }} />
            <span className={styles.dot} style={{ background: "#FFBD2E" }} />
            <span className={styles.dot} style={{ background: "#27C93F" }} />
          </div>
        )}

        {/* 3. The Instagram-ready Language Badge */}
        {showLanguageBadge && (
          <div
            className={styles.languageBadge}
            style={{
              marginLeft: windowStyle === "windows" ? "auto" : undefined,
            }}
          >
            {LANGUAGE_ICONS[codeLanguage as keyof typeof LANGUAGE_ICONS]}
            {codeLanguage}
          </div>
        )}

        {windowStyle === "windows" && (
          <div className={styles.winButtons}>
            <span className={styles.winIcon}>—</span>
            <span className={styles.winIcon}>□</span>
            <span className={styles.winIcon}>×</span>
          </div>
        )}
      </div>

      {/* The Actual Editor */}
      <div className={styles.editorWrapper}>
        {/* 1. Highlight Overlay (Sits behind the text) */}
        <div
          className={styles.highlightLayer}
          style={{ top: editorPaddingTop }}
        >
          {activeLines.map((lineNum) => (
            <div
              key={lineNum}
              className={styles.highlightRow}
              style={{
                top: (lineNum - 1) * lineHeight,
                height: lineHeight,
              }}
            />
          ))}
        </div>

        {/* 2. Line Number Gutter */}
        {showLineNumbers && (
          <div
            className={styles.gutter}
            style={{
              paddingTop: editorPaddingTop,
              paddingBottom: editorPaddingTop,
            }}
          >
            {lineNumbers.map((n) => (
              <div
                key={n}
                className={`${styles.gutterLine} ${activeLines.includes(n) ? styles.gutterActive : ""}`}
                style={{ height: lineHeight, lineHeight: `${lineHeight}px` }}
              >
                {n}
              </div>
            ))}
          </div>
        )}
        <Editor
          value={codeSnippet}
          onValueChange={(code: string) => setCodeSnippet(code)}
          highlight={highlightCode}
          padding={editorPaddingTop}
          style={{
            fontFamily: codeFontFamily,
            fontSize: codeFontSize,
            lineHeight: `${lineHeight}px`,
            outline: "none",
            minHeight: "150px",
            // Push text to the right if gutter is active
            paddingLeft: showLineNumbers ? "64px" : "24px",
            background: "transparent", // Must be transparent to see highlights
          }}
          className={styles.editor}
        />
      </div>
    </div>
  );
};
