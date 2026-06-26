/**
 * Generate a SHA-256 hash for certificate validation.
 * Uses the Web Crypto API (available in all modern browsers).
 */
export async function generateCertificateHash(
  userId: string,
  authCode: string,
  issuedAt: string
): Promise<string> {
  const input = `${userId}::${authCode}::${issuedAt}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
