// src/tools/css.js

export function formatCSS(raw) {
  if (!raw.trim()) throw new Error("Input is empty");

  // VALIDATION: Check for unmatched braces
  const openBraces = (raw.match(/{/g) || []).length;
  const closeBraces = (raw.match(/}/g) || []).length;

  if (openBraces !== closeBraces) {
    throw new Error(
      `Invalid CSS: ${openBraces} opening braces but ${closeBraces} closing braces`
    );
  }

  // VALIDATION: Check for unclosed strings
  const strings = raw.match(/"[^"]*"/g) || [];
  const quotes = raw.match(/"/g) || [];
  
  if (quotes.length % 2 !== 0) {
    throw new Error("Invalid CSS: Unclosed string (missing closing quote)");
  }

  return raw
    .replace(/\s*{\s*/g, " {\n  ")
    .replace(/;\s*/g, ";\n  ")
    .replace(/\s*}\s*/g, "\n}\n")
    .replace(/,\s*(?=[^\s])/g, ",\n")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

export function minifyCSS(raw) {
  if (!raw.trim()) throw new Error("Input is empty");

  // Validate first
  formatCSS(raw);

  return raw
    .replace(/\s+/g, " ")
    .replace(/\s*{\s*/g, "{")
    .replace(/\s*}\s*/g, "}")
    .replace(/\s*:\s*/g, ":")
    .replace(/\s*;\s*/g, ";")
    .replace(/\s*,\s*/g, ",")
    .trim();
}