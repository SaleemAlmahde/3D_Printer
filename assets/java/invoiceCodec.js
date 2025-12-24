/* invoiceCodec.js
   يعتمد على pako (يجب تحميل pako قبل هذا الملف في HTML)
*/

// تحويل مصفوفة بايت -> base64url
function bytesToBase64Url(bytes) {
  const bin = Array.from(bytes)
    .map((b) => String.fromCharCode(b))
    .join("");
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// تحويل base64url -> Uint8Array
function base64UrlToBytes(b64url) {
  let b64 = String(b64url || "");
  // tolerate if it's already standard base64 or base64url
  b64 = b64.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4;
  if (pad) b64 += "=".repeat(4 - pad);
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

// ضغط JSON (pako.deflate) ثم تحويل لبase64url
function encodeInvoice(invoiceObj) {
  if (typeof pako === "undefined")
    throw new Error(
      "pako library is required for encodeInvoice (load pako before this file)"
    );
  try {
    const json = JSON.stringify(invoiceObj);
    const compressed = pako.deflate(json);
    return bytesToBase64Url(compressed);
  } catch (err) {
    throw new Error("encodeInvoice failed: " + (err && err.message));
  }
}

// فك base64url ثم فك الضغط ثم JSON.parse
function decodeInvoice(code) {
  if (typeof pako === "undefined")
    throw new Error(
      "pako library is required for decodeInvoice (load pako before this file)"
    );
  try {
    const bytes = base64UrlToBytes(code);
    const json = pako.inflate(bytes, { to: "string" });
    return JSON.parse(json);
  } catch (err) {
    throw new Error("decodeInvoice failed: " + (err && err.message));
  }
}

// expose to global/window for other scripts
try {
  if (typeof window !== "undefined") {
    window.encodeInvoice = encodeInvoice;
    window.decodeInvoice = decodeInvoice;
  }
} catch (e) {
  // ignore if environment doesn't allow window assignment
}
