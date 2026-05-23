// src/tools/html.js

const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr",
  "img", "input", "link", "meta", "param",
  "source", "track", "wbr"
]);

export function formatHTML(raw) {
  if (!raw.trim()) throw new Error("Input is empty");

  // VALIDATION
  validateHTML(raw);

  // FORMAT
  return performHTMLFormatting(raw);
}

function validateHTML(raw) {
  // Remove comments and doctypes for validation
  const cleaned = raw.replace(/<!--[\s\S]*?-->/g, "").replace(/<\![^>]*>/g, "");

  // Find all tags
  const tagRegex = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\s*([^>]*)>/gi;
  const stack = [];
  let match;

  while ((match = tagRegex.exec(cleaned)) !== null) {
    const isClosing = match[1].toLowerCase() === "/";
    const tagName = match[2].toLowerCase();
    const attributes = match[3];
    const isSelfClosing = attributes.endsWith("/") || VOID_ELEMENTS.has(tagName);

    if (isSelfClosing) continue;

    if (isClosing) {
      if (stack.length === 0) {
        throw new Error(
          `Invalid HTML: Closing tag </${tagName}> has no matching opening tag`
        );
      }
      const lastOpened = stack[stack.length - 1];
      if (lastOpened !== tagName) {
        throw new Error(
          `Invalid HTML: Expected </${lastOpened}> but found </${tagName}>`
        );
      }
      stack.pop();
    } else {
      stack.push(tagName);
    }
  }

  if (stack.length > 0) {
    throw new Error(`Invalid HTML: Tag <${stack[stack.length - 1]}> is not closed`);
  }

  // Check for incomplete tags
  if (/<[^>]*$/.test(cleaned)) {
    throw new Error("Invalid HTML: Incomplete tag found (missing >)");
  }
}

function performHTMLFormatting(raw) {
  let indent = 0;
  const tokens = raw.split(/(<[^>]+>)/g);
  const lines = [];

  tokens.forEach((token) => {
    token = token.trim();
    if (!token) return;

    if (token.startsWith("</")) {
      indent = Math.max(0, indent - 1);
      lines.push("  ".repeat(indent) + token);
    } else if (token.startsWith("<")) {
      lines.push("  ".repeat(indent) + token);

      const tagName = token.match(/^<([a-z0-9]+)/i)?.[1]?.toLowerCase();

      if (tagName && !VOID_ELEMENTS.has(tagName) && !token.endsWith("/>")) {
        indent++;
      }
    } else {
      if (token) lines.push("  ".repeat(indent) + token);
    }
  });

  return lines.join("\n");
}

export function minifyHTML(raw) {
  if (!raw.trim()) throw new Error("Input is empty");
  validateHTML(raw);

  return raw
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}