"use client";

import Link from "next/link";

const PINK  = "#FF78AC";
const TEAL  = "#A8D5E3";
const CREAM = "#ffffff";
const DARK  = "#1A1A2E";

const TEAM = [
  { name: "Priya Sharma",  role: "Founder & Chief Maker", emoji: "🧵" },
  { name: "Rahul Menon",   role: "Packaging & Shipping",  emoji: "📦" },
  { name: "Ananya Iyer",   role: "Pattern Designer",      emoji: "✏️" },
];

const VALUES = [
  { icon: "🤲", title: "Handmade Always",   desc: "Every single toy is made by hand. No factories, no machines — just skilled artisans and pure craft." },
  { icon: "🌿", title: "Eco Conscious",     desc: "We use natural cotton, non-toxic dyes, and recycled packaging to keep our footprint small." },
  { icon: "💛", title: "Made with Love",    desc: "We pour real emotion into every toy. Each one is checked by hand before it reaches your door." },
  { icon: "👶", title: "Safe for Children", desc: "Every material is tested and certified safe for children of all ages, from newborns upward." },
];

export default function AboutPage() {
  return (
    <main style={{ backgroundColor: CREAM, color: DARK, fontFamily: "'Nunito', sans-serif" }}>

      {/* ── Back button ── */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <Link href="/" style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          fontFamily: "'Nunito', sans-serif", fontWeight: 700,
          fontSize: "0.9rem", color: DARK, textDecoration: "none",
          padding: "8px 16px", border: `2px solid ${DARK}`,
          borderRadius: "50px", backgroundColor: "white",
          boxShadow: `3px 3px 0 ${DARK}`,
        }}>
          ← Back to Home
        </Link>
      </div>

      {/* ── Hero ── */}
      <section style={{ padding: "60px 24px 80px", textAlign: "center" }}>
        <div className="max-w-3xl mx-auto">
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            backgroundColor: TEAL, border: `2px solid ${DARK}`,
            borderRadius: "50px", padding: "4px 16px", marginBottom: "20px",
            fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "0.85rem",
          }}>
            ✦ Our Story
          </span>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", marginBottom: "20px" }}>
            We believe every toy should tell a story
          </h1>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.8, opacity: 0.8, maxWidth: "600px", margin: "0 auto 32px" }}>
            CraftNest started in a tiny apartment with a crochet hook, a ball of yarn,
            and a dream to bring something real and handmade back into children's lives.
            Today we ship to families across India — but every toy is still made exactly the same way.
          </p>
          <Link href="/shop" style={{
            backgroundColor: PINK, color: "#fff",
            border: `2.5px solid ${DARK}`, borderRadius: "50px",
            padding: "14px 32px", fontFamily: "'Nunito', sans-serif",
            fontWeight: 800, fontSize: "1rem", textDecoration: "none",
            boxShadow: `4px 4px 0 ${DARK}`, display: "inline-block",
          }}>
            Shop Our Collection →
          </Link>
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ backgroundColor: TEAL, borderTop: `3px solid ${DARK}`, borderBottom: `3px solid ${DARK}`, padding: "64px 24px" }}>
        <div className="max-w-7xl mx-auto">
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2rem", textAlign: "center", marginBottom: "48px" }}>
            What we stand for
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "28px" }}>
            {VALUES.map((v) => (
              <div key={v.title} style={{
                backgroundColor: "white", border: `2.5px solid ${DARK}`,
                borderRadius: "20px", padding: "28px", boxShadow: `5px 5px 0 ${DARK}`,
              }}>
                <div style={{ fontSize: "2.2rem", marginBottom: "12px" }}>{v.icon}</div>
                <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.2rem", marginBottom: "10px" }}>{v.title}</h3>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.7, opacity: 0.8 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section style={{ padding: "64px 24px" }}>
        <div className="max-w-7xl mx-auto">
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2rem", textAlign: "center", marginBottom: "8px" }}>
            Meet the makers
          </h2>
          <p style={{ textAlign: "center", opacity: 0.7, marginBottom: "40px", fontSize: "0.95rem" }}>
            The small but mighty team behind every toy.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", justifyItems: "center" }}>
            {TEAM.map((member) => (
              <div key={member.name} style={{
                backgroundColor: "white", border: `2.5px solid ${DARK}`,
                borderRadius: "20px", padding: "32px 24px", textAlign: "center",
                boxShadow: `5px 5px 0 ${DARK}`, width: "100%",
              }}>
                <div style={{
                  width: "72px", height: "72px", borderRadius: "50%",
                  backgroundColor: PINK, border: `2.5px solid ${DARK}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "2rem", margin: "0 auto 16px",
                }}>
                  {member.emoji}
                </div>
                <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.15rem", marginBottom: "4px" }}>{member.name}</h3>
                <p style={{ fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ backgroundColor: DARK, padding: "64px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2.2rem", color: PINK, marginBottom: "16px" }}>
          Ready to find a forever toy? 🧸
        </h2>
        <p style={{ color: "#ffffff", opacity: 0.8, marginBottom: "32px", fontSize: "1rem" }}>
          Every purchase supports our small team of independent makers.
        </p>
        <Link href="/shop" style={{
          backgroundColor: PINK, color: "#fff",
          border: `2.5px solid ${PINK}`, borderRadius: "50px",
          padding: "16px 40px", fontFamily: "'Nunito', sans-serif",
          fontWeight: 800, fontSize: "1.05rem", textDecoration: "none",
          boxShadow: `4px 4px 0 ${PINK}`, display: "inline-block",
        }}>
          Shop Now →
        </Link>
      </section>

    </main>
  );
}