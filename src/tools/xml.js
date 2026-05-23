// src/tools/xml.js

export function formatXML(raw) {
  if (!raw.trim()) throw new Error("Input is empty");

  // STEP 1: VALIDATE XML STRUCTURE
  validateXML(raw);

  // STEP 2: FORMAT (only if valid)
  return performFormatting(raw);
}

function validateXML(raw) {
  // Remove comments and declarations first for validation
  const cleaned = raw.replace(/<\?[^?]*\?>/g, "").replace(/<!--[\s\S]*?-->/g, "");

  // Find all tags
  const tagRegex = /<(\/?)([a-zA-Z_:][a-zA-Z0-9_:.-]*)\s*([^>]*)>/g;
  const stack = [];
  let match;
  const allTags = [];

  while ((match = tagRegex.exec(cleaned)) !== null) {
    const isClosing = match[1] === "/";
    const tagName = match[2];
    const attributes = match[3];
    const isSelfClosing = attributes.endsWith("/") || attributes.includes("/");

    allTags.push({ tagName, isClosing, isSelfClosing, fullTag: match[0] });
  }

  // Validate tag matching
  for (const tag of allTags) {
    if (tag.isSelfClosing) {
      // Self-closing tags don't need validation
      continue;
    }

    if (tag.isClosing) {
      // This is a closing tag
      if (stack.length === 0) {
        throw new Error(
          `Invalid XML: Closing tag </${tag.tagName}> has no matching opening tag`
        );
      }

      const lastOpened = stack[stack.length - 1];
      if (lastOpened !== tag.tagName) {
        throw new Error(
          `Invalid XML: Expected </${lastOpened}> but found </${tag.tagName}>`
        );
      }
      stack.pop();
    } else {
      // This is an opening tag
      stack.push(tag.tagName);
    }
  }

  // Check for unclosed tags
  if (stack.length > 0) {
    throw new Error(
      `Invalid XML: Tag <${stack[stack.length - 1]}> is not closed`
    );
  }

  // Additional check: Look for incomplete tags
  if (/<[^>]*$/.test(cleaned)) {
    throw new Error("Invalid XML: Incomplete tag found (missing >)");
  }

  if (/>.*<[^/]/.test(cleaned) && !/>[\s\n]*</.test(cleaned)) {
    // Might be missing closing tag
  }
}

function performFormatting(raw) {
  let indent = 0;

  // Split by tags, keeping the tags
  const normalized = raw.replace(/>\s*</g, ">\n<").trim();
  const lines = normalized.split("\n");

  const result = lines
    .map((line) => {
      line = line.trim();
      if (!line) return null;

      // Closing tag — decrease indent BEFORE printing
      if (line.match(/^<\/[^>]+>/)) {
        indent = Math.max(0, indent - 1);
      }

      const indented = "  ".repeat(indent) + line;

      // Opening tag (not self-closing) — increase indent AFTER printing
      if (
        line.match(/^<[^/?!][^>]*>$/) && // starts with < not </ <? <!
        !line.match(/<.*\/>/) // not self-closing
      ) {
        indent++;
      }

      return indented;
    })
    .filter((line) => line !== null)
    .join("\n");

  return result;
}

export function minifyXML(raw) {
  if (!raw.trim()) throw new Error("Input is empty");

  // Validate first
  validateXML(raw);

  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("")
    .replace(/>\s+</g, "><");
}