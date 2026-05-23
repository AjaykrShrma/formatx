// src/utils/highlight.js

// CRITICAL: Always escape HTML before highlighting
// This prevents XSS attacks when user pastes malicious input
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")  // & must be first, otherwise we double-escape
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Wrap text in a colored span
function span(cls, text) {
  return `<span class="hl-${cls}">${text}</span>`;
}

// JSON highlighter
// Colors: keys=blue, strings=green, numbers=orange, booleans=pink, null=gray
function highlightJSON(escaped) {
  return escaped
    // Keys: "keyName":  (string followed by colon)
    .replace(/(&quot;(?:\\.|[^&])*&quot;)\s*:/g, (_, key) => span("key", key) + ":")
    // String values: ": "value"
    .replace(/:\s*(&quot;(?:\\.|[^&])*&quot;)/g, (_, val) => ": " + span("str", val))
    // Standalone strings in arrays
    .replace(/(?<![:\w])(&quot;(?:\\.|[^&])*&quot;)(?!\s*:)/g, (_, val) => span("str", val))
    // Numbers
    .replace(/(?<![&\w])-?\d+\.?\d*(?:[eE][+-]?\d+)?(?!\w)/g, (n) => span("num", n))
    // Booleans
    .replace(/\b(true|false)\b/g, (b) => span("bool", b))
    // Null
    .replace(/\bnull\b/g, span("null", "null"));
}

// XML highlighter
// Colors: tags=blue, attributes=pink, values=green, comments=gray
function highlightXML(escaped) {
  return escaped
    // Comments: <!-- ... -->
    .replace(/(&lt;!--[\s\S]*?--&gt;)/g, (c) => span("comment", c))
    // Tag names inside opening/closing tags
    .replace(/(&lt;\/?)([\w:-]+)/g, (_, bracket, name) =>
      span("tag", bracket + name)
    )
    // Attribute names
    .replace(/\s([\w:-]+)=/g, (_, attr) => " " + span("attr", attr) + "=")
    // Attribute values
    .replace(/=(&quot;[^&]*&quot;)/g, (_, val) => "=" + span("str", val))
    // Closing bracket
    .replace(/(\/?&gt;)/g, (b) => span("tag", b));
}

// HTML highlighter — same as XML but slightly different tag patterns
function highlightHTML(escaped) {
  return highlightXML(escaped); // HTML and XML highlighting is identical
}

// CSS highlighter
// Colors: selectors=yellow, properties=blue, values=green, comments=gray
function highlightCSS(escaped) {
  return escaped
    // Comments
    .replace(/(\/\*[\s\S]*?\*\/)/g, (c) => span("comment", c))
    // Selectors (text before opening brace)
    .replace(/([^{}\n]+)(\s*\{)/g, (_, sel, brace) => span("sel", sel) + brace)
    // Property names (word before colon)
    .replace(/([\w-]+)(\s*:)/g, (_, prop, colon) => span("prop", prop) + colon)
    // Values (after colon, before semicolon)
    .replace(/:\s*([^;{}]+);/g, (_, val) => ": " + span("val", val.trim()) + ";");
}

// SQL highlighter
// Colors: keywords=purple, strings=green, numbers=orange, comments=gray
function highlightSQL(escaped) {
  const keywords = [
    "SELECT", "FROM", "WHERE", "JOIN", "LEFT", "RIGHT", "INNER",
    "FULL", "ON", "GROUP BY", "ORDER BY", "HAVING", "LIMIT",
    "OFFSET", "INSERT", "INTO", "VALUES", "UPDATE", "SET",
    "DELETE", "CREATE", "ALTER", "DROP", "TABLE", "AND", "OR",
    "NOT", "IN", "LIKE", "BETWEEN", "AS", "DISTINCT", "COUNT",
    "SUM", "AVG", "MAX", "MIN", "UNION", "ALL", "WITH", "BY",
  ];

  let result = escaped;

  // Keywords — case insensitive match, output uppercase
  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b(${kw})\\b`, "gi");
    result = result.replace(regex, (match) => span("kw", match.toUpperCase()));
  });

  // String literals in single quotes
  result = result.replace(/'([^']*)'/g, (_, s) => span("str", `'${s}'`));

  // Numbers
  result = result.replace(/\b(\d+\.?\d*)\b/g, (n) => span("num", n));

  // Comments
  result = result.replace(/(--[^\n]*)/g, (c) => span("comment", c));

  return result;
}

// MAIN EXPORT — call this from your components
// type = "json" | "xml" | "html" | "css" | "sql" | null
export function highlight(text, type) {
  // Always escape first — security critical
  const escaped = escapeHTML(text);

  switch (type) {
    case "json": return highlightJSON(escaped);
    case "xml":  return highlightXML(escaped);
    case "html": return highlightHTML(escaped);
    case "css":  return highlightCSS(escaped);
    case "sql":  return highlightSQL(escaped);
    // base64, url, jwt — plain text, no highlighting needed
    default:     return escaped;
  }
}

// CSS classes used above — add these to your App.css or index.css
// .hl-key     { color: #60a5fa }   blue    — JSON keys
// .hl-str     { color: #4ade80 }   green   — strings
// .hl-num     { color: #fb923c }   orange  — numbers
// .hl-bool    { color: #f472b6 }   pink    — booleans
// .hl-null    { color: #94a3b8 }   gray    — null
// .hl-tag     { color: #60a5fa }   blue    — XML/HTML tags
// .hl-attr    { color: #f472b6 }   pink    — attributes
// .hl-sel     { color: #facc15 }   yellow  — CSS selectors
// .hl-prop    { color: #60a5fa }   blue    — CSS properties
// .hl-val     { color: #4ade80 }   green   — CSS values
// .hl-kw      { color: #c084fc }   purple  — SQL keywords
// .hl-comment { color: #6b7280 }   gray    — comments