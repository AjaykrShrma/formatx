// src/tools/base64.js

export function encodeBase64(raw) {
  if (!raw || !raw.trim()) {
    throw new Error("Input is empty");
  }

  try {
    // Check for extremely long strings
    if (raw.length > 1000000) {
      throw new Error("Input too large (max 1MB)");
    }

    return btoa(unescape(encodeURIComponent(raw)));
  } catch (err) {
    throw new Error(`Failed to encode: ${err.message}`);
  }
}

export function decodeBase64(raw) {
  if (!raw || !raw.trim()) {
    throw new Error("Input is empty");
  }

  const cleanInput = raw.trim();

  // VALIDATION: Check Base64 format
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanInput)) {
    throw new Error(
      "Invalid Base64: Contains invalid characters. Base64 only allows A-Z, a-z, 0-9, +, /, and = padding"
    );
  }

  if (cleanInput.length % 4 !== 0) {
    throw new Error("Invalid Base64: Length must be multiple of 4 (including padding)");
  }

  // Check padding
  const paddingCount = (cleanInput.match(/=/g) || []).length;
  if (paddingCount > 2) {
    throw new Error("Invalid Base64: Too many padding characters (max 2 allowed)");
  }

  try {
    return decodeURIComponent(escape(atob(cleanInput)));
  } catch (err) {
    throw new Error("Invalid Base64: Decoding failed - data may be corrupted");
  }
}