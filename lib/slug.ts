const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";

export function generateSlug(length = 7) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

export function normalizeSlug(raw: string) {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 40);
}
