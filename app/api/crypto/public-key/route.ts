/**
 * app/api/crypto/public-key/route.ts
 *
 * Serves the server's ECDH public key so clients can derive a shared
 * AES-GCM key for encrypting review comments before sending them.
 *
 * The private key stays in the environment variable ECDH_PRIVATE_KEY_JWK
 * and is never transmitted.
 *
 * ── One-time key generation (run once, store in .env) ──────────────────────
 *
 *   node -e "
 *     const { subtle } = require('crypto').webcrypto;
 *     subtle.generateKey({ name:'ECDH', namedCurve:'P-256' }, true, ['deriveKey'])
 *       .then(async kp => {
 *         const pub = await subtle.exportKey('jwk', kp.publicKey);
 *         const priv = await subtle.exportKey('jwk', kp.privateKey);
 *         console.log('ECDH_PUBLIC_KEY_JWK=' + JSON.stringify(pub));
 *         console.log('ECDH_PRIVATE_KEY_JWK=' + JSON.stringify(priv));
 *       });
 *   "
 *
 * Add both lines to .env.local (never commit the private key).
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const rawPublicKey = process.env.ECDH_PUBLIC_KEY_JWK;

  if (!rawPublicKey) {
    console.error(
      "[api/crypto/public-key] ECDH_PUBLIC_KEY_JWK env var is not set."
    );
    return NextResponse.json(
      { error: "Encryption service is not configured." },
      { status: 503 }
    );
  }

  let publicKey: JsonWebKey;
  try {
    publicKey = JSON.parse(rawPublicKey) as JsonWebKey;
  } catch {
    return NextResponse.json(
      { error: "Server key is malformed." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { publicKey },
    {
      headers: {
        // Cache the public key aggressively — it only changes if you rotate keys
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      },
    }
  );
}