"use client";

import Link from "next/link";

interface BackButtonProps {
  href?: string;
  label?: string;
}

// FIX #15 — Glass-type back button on every page
export function BackButton({ href = "/", label = "Back to Home" }: BackButtonProps) {
  return (
    <div style={{ padding: "20px 24px 0" }} className="max-w-7xl mx-auto">
      <Link
        href={href}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 700,
          fontSize: "0.9rem",
          color: "#ffffff",
          textDecoration: "none",
          padding: "9px 20px",
          // Glass effect
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px) saturate(160%)",
          WebkitBackdropFilter: "blur(12px) saturate(160%)",
          border: "1.5px solid rgba(255, 255, 255, 0.35)",
          borderRadius: "50px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25)",
          transition: "transform 0.15s, box-shadow 0.15s, background 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translate(-1px,-1px)";
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translate(0,0)";
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25)";
        }}
      >
        ← {label}
      </Link>
    </div>
  );
}