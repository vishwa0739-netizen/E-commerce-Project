"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, Heart } from "lucide-react";

// ── Social icons ──────────────────────────────────────────────────────────────
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
function IconClose({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const PINK = "#FF78AC";
const DARK = "#1A1A2E";
const font = "'Nunito', sans-serif";
const heading = "'Fredoka One', cursive";

// FIX #05 — real social hrefs (update these URLs to your actual pages)
const socialLinks = [
  { icon: IconInstagram, label: "Instagram", color: "#FF78AC", href: "https://www.instagram.com/craftnest" },
  { icon: IconYoutube,   label: "YouTube",   color: "#FF5757", href: "https://www.youtube.com/@craftnest" },
  { icon: IconTwitterX,  label: "Twitter",   color: "#A8D5E3", href: "https://twitter.com/craftnest" },
  { icon: IconFacebook,  label: "Facebook",  color: "#6BCB77", href: "https://www.facebook.com/craftnest" },
];

// FIX #06 — footer link content for popup box
const footerLinkContent: Record<string, string> = {
  "FAQ":           "Have questions? We've got answers! From toy safety to care instructions, our FAQ covers everything you need to know about your CraftNest purchase.",
  "Shipping Info": "We ship across India! Orders above ₹500 get free delivery. Standard delivery takes 3–7 business days. Express delivery (1–2 days) is available at checkout.",
  "Returns":       "Not happy? Return any item within 14 days of delivery for a full refund. Items must be unused and in original packaging. Contact us to start a return.",
  "Track Order":   "Once your order ships, you'll receive a tracking link via email and SMS. You can also track your order from the Orders page when logged in.",
  "Size Guide":    "Our plush toys come in Small (15–20 cm), Medium (25–30 cm), and Large (40–50 cm). Wooden toys are measured individually — check each product listing for exact dimensions.",
  "New Arrivals":  "Fresh from the studio! Our makers are always creating something new. New arrivals drop every Friday. Subscribe to our newsletter to get first pick before they sell out.",
  "Plush Toys":    "Soft, huggable, and made to last. Every plush toy in our collection is hand-stitched with child-safe materials and filled with hypoallergenic stuffing.",
  "Wooden Toys":   "Carved and painted by hand using FSC-certified wood and water-based, non-toxic paints. Safe for kids from 18 months and above.",
  "Art Kits":      "Everything little artists need — non-toxic paints, chunky brushes, and step-by-step guides. Perfect for ages 3 and up.",
  "Gift Sets":     "Beautifully curated sets packed in our signature kraft gift box with a handwritten note. Perfect for birthdays, baby showers, and festivals.",
  "Sale":          "Great finds at even better prices. Our sale items are still handmade with the same love — just clearing space for new collections!",
  "About Us":      "CraftNest was born from a simple idea: every child deserves a toy made with intention. We're a small team of artisans based in India, making every toy by hand.",
  "Our Makers":    "Meet the talented artisans behind every stitch and stroke. Our makers are skilled craftspeople from across India who bring decades of tradition to modern toy design.",
  "Sustainability":"We use eco-friendly materials, minimal plastic packaging, and support fair wages for all our makers. Sustainability isn't a buzzword for us — it's how we operate.",
  "Press":         "CraftNest has been featured in The Hindu, Vogue India, and Times of India. For press enquiries and media kits, contact press@craftnest.in",
  "Careers":       "We're a growing team! We occasionally hire for craft production, customer support, and design roles. Send your portfolio to careers@craftnest.in",
};

const footerLinks = {
  Shop:    ["New Arrivals", "Plush Toys", "Wooden Toys", "Art Kits", "Gift Sets", "Sale"],
  Help:    ["FAQ", "Shipping Info", "Returns", "Track Order", "Size Guide"],
  Company: ["About Us", "Our Makers", "Sustainability", "Press", "Careers"],
};

// FIX #06 — popup component for footer link info
function FooterLinkPopup({
  link,
  onClose,
}: {
  link: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 200,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.45)",
      backdropFilter: "blur(3px)",
      padding: "24px",
    }}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={link}
        style={{
          backgroundColor: "#fff",
          borderRadius: "24px",
          border: `2.5px solid ${DARK}`,
          boxShadow: `6px 6px 0 ${DARK}`,
          padding: "28px 32px 32px",
          maxWidth: "480px",
          width: "100%",
          position: "relative",
          animation: "cn-popup-in 0.22s ease",
        }}
      >
        <style>{`
          @keyframes cn-popup-in {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: "16px", right: "16px",
            background: "rgba(0,0,0,0.06)", border: "none",
            borderRadius: "50%", width: "32px", height: "32px",
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", color: DARK,
          }}
        >
          <IconClose size={14} />
        </button>

        <h3 style={{
          fontFamily: heading,
          fontSize: "1.3rem",
          color: DARK,
          margin: "0 0 14px 0",
        }}>
          {link}
        </h3>

        <p style={{
          fontFamily: font,
          fontSize: "0.95rem",
          color: DARK,
          lineHeight: 1.75,
          margin: 0,
          opacity: 0.85,
        }}>
          {footerLinkContent[link] ?? "Coming soon — check back later!"}
        </p>
      </div>
    </div>
  );
}

// ─── Main Footer ──────────────────────────────────────────────────────────────
export function Footer() {
  const [email, setEmail]         = useState("");
  const [subscribed, setSubscribed] = useState(false);
  // FIX #06 — track which popup is open
  const [activePopup, setActivePopup] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <>
      {/* FIX #06 — render popup when a footer link is clicked */}
      {activePopup && (
        <FooterLinkPopup
          link={activePopup}
          onClose={() => setActivePopup(null)}
        />
      )}

      <footer style={{ backgroundColor: "#A8D5E3", borderTop: "3px solid #1A1A2E" }}>
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

            {/* Brand column */}
            <div className="lg:col-span-2">
              <a href="/" style={{
                fontFamily: "'Pacifico', cursive",
                color: DARK,
                fontSize: "1.8rem",
                textDecoration: "none",
                display: "block",
                marginBottom: "16px",
              }}>
                <span style={{ color: PINK }}>Craft</span>Nest
              </a>

              <p style={{
                fontFamily: font,
                color: DARK,
                fontSize: "0.95rem",
                lineHeight: 1.7,
                maxWidth: "280px",
                opacity: 0.85,
                marginBottom: "24px",
              }}>
                Every toy is made by hand in our little studio — stitched, painted,
                and packed with love by real artisans who care.
              </p>

              {/* FIX #05 — Social icons with real hrefs */}
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, label, color, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: color,
                      border: `2px solid ${DARK}`,
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: DARK,
                      textDecoration: "none",
                      transition: "transform 0.15s, box-shadow 0.15s",
                      boxShadow: `2px 2px 0 ${DARK}`,
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.transform = "translate(-1px, -1px)";
                      el.style.boxShadow = `3px 3px 0 ${DARK}`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.transform = "translate(0, 0)";
                      el.style.boxShadow = `2px 2px 0 ${DARK}`;
                    }}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* FIX #06 — Link columns: clicking opens popup */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 style={{
                  fontFamily: heading,
                  fontSize: "1.1rem",
                  color: DARK,
                  marginBottom: "16px",
                }}>
                  {category}
                </h4>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {links.map((link) => (
                    <li key={link}>
                      <button
                        onClick={() => setActivePopup(link)}
                        style={{
                          fontFamily: font,
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          color: DARK,
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                          opacity: 0.8,
                          transition: "opacity 0.15s, color 0.15s",
                          textAlign: "left",
                          textDecoration: "underline",
                          textDecorationColor: "transparent",
                          textUnderlineOffset: "3px",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.opacity = "1";
                          (e.currentTarget as HTMLElement).style.textDecorationColor = PINK;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.opacity = "0.8";
                          (e.currentTarget as HTMLElement).style.textDecorationColor = "transparent";
                        }}
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div style={{
            marginTop: "48px",
            backgroundColor: DARK,
            borderRadius: "24px",
            padding: "32px 36px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}>
            <div>
              <h3 style={{ fontFamily: heading, fontSize: "1.5rem", color: PINK, margin: "0 0 6px 0" }}>
                Join the CraftNest family! 🎁
              </h3>
              <p style={{ fontFamily: font, fontSize: "0.9rem", color: "#ffffff", margin: 0, opacity: 0.8 }}>
                Get 10% off your first order + exclusive sneak peeks.
              </p>
            </div>

            {subscribed ? (
              <div style={{ backgroundColor: "#6BCB77", border: "2px solid #6BCB77", borderRadius: "50px", padding: "14px 28px", fontFamily: font, fontWeight: 800, color: DARK }}>
                You&apos;re in! Welcome to the family 🎉
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: "flex", borderRadius: "50px", overflow: "hidden", border: `2.5px solid ${PINK}`, flexShrink: 0 }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{ backgroundColor: "#ffffff", border: "none", padding: "12px 20px", fontFamily: font, fontWeight: 600, fontSize: "0.9rem", color: DARK, outline: "none", width: "220px" }}
                />
                <button type="submit" style={{ backgroundColor: PINK, border: "none", padding: "12px 20px", cursor: "pointer", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ArrowRight size={20} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "2px solid rgba(26,26,46,0.2)", padding: "16px 24px" }}>
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <p style={{ fontFamily: font, fontSize: "0.85rem", color: DARK, opacity: 0.7, margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
              © 2026 CraftNest. Made with <Heart size={12} fill={PINK} stroke={PINK} /> somewhere cozy.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Preferences"].map((item) => (
                <button
                  key={item}
                  onClick={() => setActivePopup(item)}
                  style={{ fontFamily: font, fontSize: "0.82rem", fontWeight: 600, color: DARK, background: "none", border: "none", cursor: "pointer", opacity: 0.65, padding: 0 }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}