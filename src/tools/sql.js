// src/tools/sql.js

const KEYWORDS = [
  "SELECT", "FROM", "WHERE",
  "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN", "JOIN",
  "ON", "GROUP BY", "ORDER BY", "HAVING",
  "LIMIT", "OFFSET", "UNION ALL", "UNION",
  "INSERT INTO", "VALUES", "UPDATE", "SET",
  "DELETE FROM", "CREATE TABLE", "ALTER TABLE",
  "DROP TABLE", "WITH", "AND", "OR",
];

export function formatSQL(raw) {
  if (!raw.trim()) throw new Error("Input is empty");

  // VALIDATION
  validateSQL(raw);

  // FORMAT
  return performSQLFormatting(raw);
}

function validateSQL(raw) {
  // Check for unclosed single quotes
  const singleQuotes = (raw.match(/'/g) || []).length;
  if (singleQuotes % 2 !== 0) {
    throw new Error("Invalid SQL: Unclosed string literal (missing closing single quote)");
  }

  // Check for unclosed double quotes
  const doubleQuotes = (raw.match(/"/g) || []).length;
  if (doubleQuotes % 2 !== 0) {
    throw new Error("Invalid SQL: Unclosed identifier (missing closing double quote)");
  }

  // Check for balanced parentheses
  const openParen = (raw.match(/\(/g) || []).length;
  const closeParen = (raw.match(/\)/g) || []).length;

  if (openParen !== closeParen) {
    throw new Error(
      `Invalid SQL: ${openParen} opening but ${closeParen} closing parentheses`
    );
  }

  // Check for unclosed comments
  const blockComments = (raw.match(/\/\*/g) || []).length;
  const blockCommentsEnd = (raw.match(/\*\//g) || []).length;

  if (blockComments !== blockCommentsEnd) {
    throw new Error("Invalid SQL: Unclosed block comment /* ... */");
  }

  // Basic SQL structure validation
  const cleaned = raw.toLowerCase();
  
  // Check if it looks like SQL (has SELECT, INSERT, UPDATE, DELETE, CREATE, etc)
  const sqlKeywords = ["select", "insert", "update", "delete", "create", "drop", "alter", "with"];
  const hasKeyword = sqlKeywords.some((kw) => cleaned.includes(kw));

  if (!hasKeyword && raw.trim().length > 0) {
    // Only warn, don't throw - might be a fragment
    console.warn("Warning: SQL might be incomplete or invalid");
  }
}

function performSQLFormatting(raw) {
  let result = raw.replace(/\s+/g, " ").trim();

  const sorted = [...KEYWORDS].sort((a, b) => b.length - a.length);

  sorted.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, "gi");
    result = result.replace(regex, `\n${kw.toUpperCase()}`);
  });

  return result
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

export function minifySQL(raw) {
  if (!raw.trim()) throw new Error("Input is empty");

  validateSQL(raw);

  return raw.replace(/\s+/g, " ").trim();
}