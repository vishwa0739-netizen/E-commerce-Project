/**
 * lib/e2ee.ts — End-to-End Encryption for CraftNest
 *
 * Uses the Web Crypto API (available in all modern browsers and in
 * Next.js Edge / Node 18+ runtimes).
 *
 * Flow:
 *   1. Client generates an ephemeral ECDH key pair.
 *   2. Server exposes a static ECDH public key at /api/crypto/public-key.
 *   3. Client derives a shared AES-GCM key via ECDH.
 *   4. Client encrypts the review comment locally before sending.
 *   5. Server stores only the ciphertext — it never holds the plaintext
 *      unless it imports its own private key for decryption (e.g. for moderation).
 *
 * USAGE (client component):
 *   const { encrypted_comment, encryption_iv, clientPublicKeyJwk } =
 *     await encryptComment(plainText, serverPublicKeyJwk);
 *
 *   // Then POST these fields to /api/reviews alongside rating and product_id
 */

// ─── Key helpers ──────────────────────────────────────────────────────────────

/** Import a server JWK public key for ECDH key agreement */
async function importServerPublicKey(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    [] // public key — no usages
  );
}

/** Generate a one-time ECDH key pair on the client */
async function generateClientKeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true, // extractable so we can send the public key to the server
    ["deriveKey"]
  );
}

/** Derive a 256-bit AES-GCM key from an ECDH shared secret */
async function deriveAesKey(
  clientPrivateKey: CryptoKey,
  serverPublicKey: CryptoKey
): Promise<CryptoKey> {
  return crypto.subtle.deriveKey(
    { name: "ECDH", public: serverPublicKey },
    clientPrivateKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );
}

// ─── Encoding helpers ─────────────────────────────────────────────────────────

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface EncryptedPayload {
  /** AES-GCM ciphertext, base64-encoded */
  encrypted_comment: string;
  /** 96-bit IV, base64-encoded */
  encryption_iv: string;
  /** Client's ephemeral ECDH public key (JWK) — sent to server for key agreement */
  clientPublicKeyJwk: JsonWebKey;
}

/**
 * Encrypt a review comment client-side using AES-GCM.
 *
 * @param plainText       The raw comment to encrypt.
 * @param serverPublicJwk The server's ECDH public key (fetch from /api/crypto/public-key).
 */
export async function encryptComment(
  plainText: string,
  serverPublicJwk: JsonWebKey
): Promise<EncryptedPayload> {
  const serverPublicKey = await importServerPublicKey(serverPublicJwk);
  const clientKeyPair = await generateClientKeyPair();
  const aesKey = await deriveAesKey(clientKeyPair.privateKey, serverPublicKey);

  // Generate a random 96-bit IV (recommended for AES-GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encoder = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoder.encode(plainText)
  );

  const clientPublicKeyJwk = await crypto.subtle.exportKey(
    "jwk",
    clientKeyPair.publicKey
  );

  return {
    encrypted_comment: arrayBufferToBase64(ciphertext),
    encryption_iv: arrayBufferToBase64(iv.buffer),
    clientPublicKeyJwk,
  };
}

/**
 * Decrypt a stored review comment (server-side / admin dashboard use).
 *
 * @param encryptedBase64   The stored ciphertext from the DB.
 * @param ivBase64          The IV stored alongside it.
 * @param serverPrivateKey  The server's ECDH private key (never leaves the server).
 * @param clientPublicJwk   The client's ephemeral public key stored with the review.
 */
export async function decryptComment(
  encryptedBase64: string,
  ivBase64: string,
  serverPrivateKey: CryptoKey,
  clientPublicJwk: JsonWebKey
): Promise<string> {
  const clientPublicKey = await crypto.subtle.importKey(
    "jwk",
    clientPublicJwk,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    []
  );

  const aesKey = await crypto.subtle.deriveKey(
    { name: "ECDH", public: clientPublicKey },
    serverPrivateKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));
  const ciphertext = base64ToArrayBuffer(encryptedBase64);

  const plainBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    ciphertext
  );

  return new TextDecoder().decode(plainBuffer);
}

// ─── Server key endpoint helper ───────────────────────────────────────────────

/**
 * Fetch the server's ECDH public key from /api/crypto/public-key.
 * Call this once per session and cache the result.
 */
export async function fetchServerPublicKey(): Promise<JsonWebKey> {
  const res = await fetch("/api/crypto/public-key", { cache: "force-cache" });
  if (!res.ok) throw new Error("Could not fetch server encryption key.");
  const { publicKey } = await res.json();
  return publicKey as JsonWebKey;
}