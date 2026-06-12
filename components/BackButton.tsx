"use client";

import Link from "next/link";

interface BackButtonProps {
  href?: string;
  label?: string;
}

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
          color: "#1A1A2E",
          textDecoration: "none",
          padding: "8px 18px",
          border: "2px solid #1A1A2E",
          borderRadius: "50px",
          backgroundColor: "white",
          boxShadow: "3px 3px 0 #1A1A2E",
          transition: "transform 0.1s, box-shadow 0.1s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translate(-1px,-1px)";
          e.currentTarget.style.boxShadow = "4px 4px 0 #1A1A2E";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translate(0,0)";
          e.currentTarget.style.boxShadow = "3px 3px 0 #1A1A2E";
        }}
      >
        ← {label}
      </Link>
    </div>
  );
}