export const detectLanguage = (text: string): string => {
  const clean = text.trim();

  if (
    clean.includes("import ") &&
    (clean.includes(".tsx") || clean.includes(".ts"))
  )
    return "typescript";
  if (
    clean.includes("const ") ||
    clean.includes("let ") ||
    clean.includes("function ")
  )
    return "javascript";
  if (clean.includes("def ") && clean.includes(":")) return "python";
  if (clean.includes("fn ") || clean.includes("impl ")) return "rust";
  if (
    clean.includes("{") &&
    (clean.includes("margin:") ||
      clean.includes("padding:") ||
      clean.includes("color:"))
  )
    return "css";

  return "javascript"; // Safe default fallback
};
