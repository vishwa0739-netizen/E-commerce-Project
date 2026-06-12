import { Lock, ShoppingBag } from "lucide-react";

interface CheckoutButtonProps {
  label?: string;
  total?: number;
  itemCount?: number;
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "success";
}

const variantStyles = {
  primary: { bg: "#FF78AC", shadow: "#1A1A2E", text: "#ffffff" },
  secondary: { bg: "#A8D5E3", shadow: "#1A1A2E", text: "#1A1A2E" },
  success: { bg: "#6BCB77", shadow: "#1A1A2E", text: "#ffffff" },
};

const sizeStyles = {
  sm: { padding: "10px 24px", fontSize: "0.9rem", iconSize: 16 as const },
  md: { padding: "14px 36px", fontSize: "1rem", iconSize: 18 as const },
  lg: { padding: "18px 48px", fontSize: "1.15rem", iconSize: 20 as const },
};

export function CheckoutButton({
  label = "Proceed to Checkout",
  total,
  itemCount,
  onClick,
  disabled = false,
  size = "lg",
  variant = "primary",
}: CheckoutButtonProps) {
  const colors = variantStyles[variant];
  const sizing = sizeStyles[size];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? "#cccccc" : colors.bg,
        color: disabled ? "#888888" : colors.text,
        border: `2.5px solid ${disabled ? "#aaaaaa" : "#1A1A2E"}`,
        borderRadius: "100px",
        padding: sizing.padding,
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 800,
        fontSize: sizing.fontSize,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : `5px 5px 0 ${colors.shadow}`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        transition: "transform 0.15s, box-shadow 0.15s",
        width: "100%",
        maxWidth: "440px",
        letterSpacing: "0.01em",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        const el = e.currentTarget;
        el.style.transform = "translate(-2px, -2px)";
        el.style.boxShadow = `7px 7px 0 ${colors.shadow}`;
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        const el = e.currentTarget;
        el.style.transform = "translate(0, 0)";
        el.style.boxShadow = `5px 5px 0 ${colors.shadow}`;
      }}
      onMouseDown={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = "translate(2px, 2px)";
        e.currentTarget.style.boxShadow = `3px 3px 0 ${colors.shadow}`;
      }}
      onMouseUp={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = "translate(-2px, -2px)";
        e.currentTarget.style.boxShadow = `7px 7px 0 ${colors.shadow}`;
      }}
    >
      <ShoppingBag size={sizing.iconSize} />
      <span>
        {label}
        {total !== undefined && (
          <span style={{ marginLeft: "8px", opacity: 0.85 }}>
            — ${total.toFixed(2)}
          </span>
        )}
      </span>
      {!disabled && <Lock size={sizing.iconSize - 2} style={{ opacity: 0.7 }} />}
    </button>
  );
}

export function CheckoutButtonShowcase() {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "2.5px solid #1A1A2E",
        borderRadius: "24px",
        padding: "36px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "flex-start",
        maxWidth: "520px",
      }}
    >
      <h3
        style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: "1.4rem",
          color: "#1A1A2E",
          margin: 0,
        }}
      >
        Button Variants
      </h3>

      <CheckoutButton label="Proceed to Checkout" total={89.97} size="lg" variant="primary" />
      <CheckoutButton label="Proceed to Checkout" total={89.97} size="md" variant="secondary" />
      <CheckoutButton label="Order Confirmed!" size="md" variant="success" />
      <CheckoutButton label="Cart is empty" size="sm" disabled />
    </div>
  );
}
