/* invoiceCodec.js
   يعتمد على pako (يجب تحميل pako قبل هذا الملف في HTML)
*/

// تحويل مصفوفة بايت -> base64url
function bytesToBase64Url(bytes) {
  const bin = Array.from(bytes).map(b => String.fromCharCode(b)).join('');
  const b64 = btoa(bin);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// تحويل base64url -> Uint8Array
function base64UrlToBytes(b64url) {
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

// ضغط JSON (pako.deflate) ثم تحويل لبase64url
function encodeInvoice(invoiceObj) {
  const json = JSON.stringify(invoiceObj);
  const compressed = pako.deflate(json); // pako يجب أن يكون محملاً
  return bytesToBase64Url(compressed);
}

// فك base64url ثم فك الضغط ثم JSON.parse
function decodeInvoice(code) {
  const bytes = base64UrlToBytes(code);
  const json = pako.inflate(bytes, { to: 'string' });
  return JSON.parse(json);
}
