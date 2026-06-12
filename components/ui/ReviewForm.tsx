"use client";

/**
 * components/ReviewForm.tsx
 *
 * Example usage of the E2EE helpers. Drop this wherever users submit reviews.
 * The comment is encrypted in the browser before hitting the wire — the server
 * stores only ciphertext.
 */

import { useState } from "react";
import { encryptComment, fetchServerPublicKey } from "@/lib/e2ee";

interface ReviewFormProps {
  productId: string;
}

export default function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit() {
    if (!comment.trim()) {
      setErrorMessage("Please write a comment before submitting.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      // 1. Fetch the server's ECDH public key
      const serverPublicJwk = await fetchServerPublicKey();

      // 2. Encrypt the comment client-side
      const { encrypted_comment, encryption_iv, clientPublicKeyJwk } =
        await encryptComment(comment, serverPublicJwk);

      // 3. POST the encrypted payload to /api/reviews
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          rating,
          comment,            // plain-text fallback (browser compatibility)
          encrypted_comment,  // AES-GCM ciphertext
          encryption_iv,      // 96-bit IV
          client_public_key: clientPublicKeyJwk, // needed by server for key agreement
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Something went wrong.");
      }

      setStatus("success");
      setComment("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Submission failed.");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} star{n !== 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Comment <span className="text-gray-400">(max 500 chars)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          rows={4}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Share your thoughts about this product…"
        />
        <p className="text-xs text-gray-400 mt-1">{comment.length}/500</p>
      </div>

      {errorMessage && (
        <p className="text-red-600 text-sm">{errorMessage}</p>
      )}

      {status === "success" && (
        <p className="text-green-600 text-sm">
          Review submitted — thank you!
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={status === "loading"}
        className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50"
      >
        {status === "loading" ? "Submitting…" : "Submit Review"}
      </button>
    </div>
  );
}