// src/tools/url.js

export function encodeURL(raw) {
  if (!raw || !raw.trim()) {
    throw new Error("Input is empty");
  }

  try {
    if (raw.length > 2048) {
      throw new Error("URL too long (max 2048 characters)");
    }

    return encodeURIComponent(raw);
  } catch (err) {
    throw new Error(`Failed to encode URL: ${err.message}`);
  }
}

export function decodeURL(raw) {
  if (!raw || !raw.trim()) {
    throw new Error("Input is empty");
  }

  try {
    const decoded = decodeURIComponent(raw);

    // Validate that decode actually changed something
    if (decoded === raw && raw.includes("%")) {
      throw new Error("Invalid URL encoding: Contains invalid escape sequences");
    }

    return decoded;
  } catch (err) {
    throw new Error(`Invalid URL encoding: ${err.message}`);
  }
}