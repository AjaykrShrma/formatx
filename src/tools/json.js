// src/tools/json.js

export function formatJSON(raw, opts = {}) {
  const indent = opts.indent || 2;

  if (!raw || !raw.trim()) {
    throw new Error("Input is empty");
  }

  try {
    // Parse validates the JSON
    const parsed = JSON.parse(raw);

    // Check if it's valid JSON type
    if (typeof parsed === "undefined") {
      throw new Error("Invalid JSON: undefined is not valid JSON");
    }

    return JSON.stringify(parsed, null, indent);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error.message}`);
  }
}

export function minifyJSON(raw) {
  if (!raw || !raw.trim()) {
    throw new Error("Input is empty");
  }

  try {
    const parsed = JSON.parse(raw);
    return JSON.stringify(parsed);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error.message}`);
  }
}

export function validateJSON(raw) {
  try {
    JSON.parse(raw);
    return { valid: true, message: "Valid JSON" };
  } catch (e) {
    return { valid: false, message: e.message };
  }
}

export function getJSONStats(raw) {
  try {
    const parsed = JSON.parse(raw);
    let keys = 0;

    function countKeys(obj) {
      if (typeof obj !== "object" || obj === null) return;
      if (Array.isArray(obj)) {
        obj.forEach(countKeys);
      } else {
        Object.keys(obj).forEach((k) => {
          keys++;
          countKeys(obj[k]);
        });
      }
    }

    countKeys(parsed);
    return { keys };
  } catch {
    return { keys: 0 };
  }
}