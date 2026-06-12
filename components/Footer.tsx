"use client";

import { useState } from "react";
import { ArrowRight, Heart } from "lucide-react";

// ── Social icons as inline SVGs (replaces removed lucide icons) ──────────────
function IconInstagram({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function IconYoutube({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function IconTwitterX({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function IconFacebook({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const footerLinks = {
  Shop: ["New Arrivals", "Plush Toys", "Wooden Toys", "Art Kits", "Gift Sets", "Sale"],
  Help: ["FAQ", "Shipping Info", "Returns", "Track Order", "Size Guide"],
  Company: ["About Us", "Our Makers", "Sustainability", "Press", "Careers"],
};

const socialLinks = [
  { icon: IconInstagram, label: "Instagram", color: "#FF78AC" },
  { icon: IconYoutube,   label: "YouTube",   color: "#FF5757" },
  { icon: IconTwitterX,  label: "Twitter",   color: "#A8D5E3" },
  { icon: IconFacebook,  label: "Facebook",  color: "#6BCB77" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer style={{ backgroundColor: "#A8D5E3", borderTop: "3px solid #1A1A2E" }}>
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <a
              href="/"
              style={{
                fontFamily: "'Pacifico', cursive",
                color: "#1A1A2E",
                fontSize: "1.8rem",
                textDecoration: "none",
                display: "block",
                marginBottom: "16px",
              }}
            >
              <span style={{ color: "#FF78AC" }}>Craft</span>Nest
            </a>

            <p
              style={{
                fontFamily: "'Nunito', sans-serif",
                color: "#1A1A2E",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                maxWidth: "280px",
                opacity: 0.85,
                marginBottom: "24px",
              }}
            >
              Every toy is made by hand in our little studio — stitched, painted,
              and packed with love by real artisans who care.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, label, color }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: color,
                    border: "2px solid #1A1A2E",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#1A1A2E",
                    textDecoration: "none",
                    transition: "transform 0.15s, box-shadow 0.15s",
                    boxShadow: "2px 2px 0 #1A1A2E",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = "translate(-1px, -1px)";
                    el.style.boxShadow = "3px 3px 0 #1A1A2E";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = "translate(0, 0)";
                    el.style.boxShadow = "2px 2px 0 #1A1A2E";
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: "1.1rem",
                  color: "#1A1A2E",
                  marginBottom: "16px",
                }}
              >
                {category}
              </h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        color: "#1A1A2E",
                        textDecoration: "none",
                        opacity: 0.8,
                        transition: "opacity 0.15s",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.8")}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div
          style={{
            marginTop: "48px",
            backgroundColor: "#1A1A2E",
            borderRadius: "24px",
            padding: "32px 36px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <div>
            <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.5rem", color: "#FF78AC", margin: "0 0 6px 0" }}>
              Join the CraftNest family! 🎁
            </h3>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.9rem", color: "#ffffff", margin: 0, opacity: 0.8 }}>
              Get 10% off your first order + exclusive sneak peeks.
            </p>
          </div>

          {subscribed ? (
            <div style={{ backgroundColor: "#6BCB77", border: "2px solid #6BCB77", borderRadius: "50px", padding: "14px 28px", fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#1A1A2E" }}>
              You&apos;re in! Welcome to the family 🎉
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              style={{ display: "flex", borderRadius: "50px", overflow: "hidden", border: "2.5px solid #FF78AC", flexShrink: 0 }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{ backgroundColor: "#ffffff", border: "none", padding: "12px 20px", fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#1A1A2E", outline: "none", width: "220px" }}
              />
              <button type="submit" style={{ backgroundColor: "#FF78AC", border: "none", padding: "12px 20px", cursor: "pointer", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowRight size={20} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "2px solid rgba(26,26,46,0.2)", padding: "16px 24px" }}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.85rem", color: "#1A1A2E", opacity: 0.7, margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
            © 2026 CraftNest. Made with <Heart size={12} fill="#FF78AC" stroke="#FF78AC" /> somewhere cozy.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Preferences"].map((item) => (
              <a key={item} href="#" style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "#1A1A2E", textDecoration: "none", opacity: 0.65 }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}