// src/tools/jwt.js

export function decodeJWT(raw) {
  if (!raw || !raw.trim()) {
    throw new Error("Input is empty");
  }

  const parts = raw.trim().split(".");

  // VALIDATION: Must have exactly 3 parts
  if (parts.length !== 3) {
    throw new Error(
      `Invalid JWT: Expected 3 parts (header.payload.signature) but got ${parts.length}`
    );
  }

  // VALIDATION: Each part must not be empty
  if (parts.some((part) => !part.trim())) {
    throw new Error("Invalid JWT: One or more parts are empty");
  }

  // VALIDATION: Parts must be valid Base64URL
  const base64UrlRegex = /^[A-Za-z0-9_-]+={0,2}$/;
  for (let i = 0; i < 3; i++) {
    if (!base64UrlRegex.test(parts[i])) {
      throw new Error(
        `Invalid JWT: Part ${i + 1} contains invalid characters (only A-Z, a-z, 0-9, -, _ allowed)`
      );
    }
  }

  function decodeBase64URL(str) {
    try {
      const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = atob(base64);
      const parsed = JSON.parse(decoded);
      return parsed;
    } catch (e) {
      throw new Error(`Part ${str === parts[0] ? 1 : str === parts[1] ? 2 : 3} is not valid JSON: ${e.message}`);
    }
  }

  try {
    const header = decodeBase64URL(parts[0]);
    const payload = decodeBase64URL(parts[1]);

    // VALIDATION: Header and payload must be objects
    if (typeof header !== "object" || header === null) {
      throw new Error("Invalid JWT header: Must be a JSON object");
    }
    if (typeof payload !== "object" || payload === null) {
      throw new Error("Invalid JWT payload: Must be a JSON object");
    }

    // VALIDATION: Header must have 'alg' field
    if (!header.alg) {
      throw new Error("Invalid JWT header: Missing 'alg' field");
    }

    return JSON.stringify(
      {
        header,
        payload,
        signature: parts[2] + " (cannot verify on frontend — needs secret key)",
      },
      null,
      2
    );
  } catch (err) {
    throw new Error(`Invalid JWT: ${err.message}`);
  }
}