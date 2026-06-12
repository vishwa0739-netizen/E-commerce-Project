import { useState } from "react";
import { ShoppingCart, Heart, Star } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  badgeColor?: string;
  isNew?: boolean;
}

export function ProductCard({
  name,
  price,
  originalPrice,
  image,
  rating = 4.9,
  reviews = 128,
  badge = "Handmade",
  badgeColor = "#6BCB77",
  isNew = false,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "2.5px solid #1A1A2E",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "5px 5px 0 #1A1A2E",
        transition: "transform 0.2s, box-shadow 0.2s",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "300px",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translate(-3px, -3px)";
        el.style.boxShadow = "8px 8px 0 #1A1A2E";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translate(0, 0)";
        el.style.boxShadow = "5px 5px 0 #1A1A2E";
      }}
    >
      {/* Image container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4/3",
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        <img
          src={image}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.35s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLImageElement).style.transform =
              "scale(1.06)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")
          }
        />

        {/* New tag */}
        {isNew && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              backgroundColor: "#FF5757",
              color: "#ffffff",
              border: "2px solid #1A1A2E",
              borderRadius: "50px",
              padding: "2px 12px",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: "0.75rem",
              letterSpacing: "0.04em",
            }}
          >
            NEW
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setWishlisted(!wishlisted)}
          aria-label="Wishlist"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "#ffffff",
            border: "2px solid #1A1A2E",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >
          <Heart
            size={16}
            fill={wishlisted ? "#FF78AC" : "none"}
            stroke={wishlisted ? "#FF78AC" : "#1A1A2E"}
          />
        </button>
      </div>

      {/* Card body */}
      <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            style={{
              backgroundColor: badgeColor,
              color: "#1A1A2E",
              border: "1.5px solid #1A1A2E",
              borderRadius: "50px",
              padding: "2px 12px",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: "0.72rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            ✦ {badge}
          </span>
        </div>

        {/* Product name */}
        <h3
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: "1.15rem",
            color: "#1A1A2E",
            margin: 0,
            lineHeight: 1.25,
          }}
        >
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                fill={i < Math.round(rating) ? "#FF78AC" : "none"}
                stroke={i < Math.round(rating) ? "#FF78AC" : "#ccc"}
              />
            ))}
          </div>
          <span
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "0.8rem",
              color: "#1A1A2E",
              opacity: 0.65,
              fontWeight: 700,
            }}
          >
            {rating} ({reviews})
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-center gap-2 mt-auto">
          <span
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: "1.4rem",
              color: "#1A1A2E",
            }}
          >
            ${price.toFixed(2)}
          </span>
          {originalPrice && (
            <span
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "0.9rem",
                color: "#999",
                textDecoration: "line-through",
                fontWeight: 600,
              }}
            >
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          style={{
            backgroundColor: added ? "#6BCB77" : "#FF78AC",
            color: "#ffffff",
            border: "2.5px solid #1A1A2E",
            borderRadius: "50px",
            padding: "11px 20px",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            fontSize: "0.9rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "background-color 0.25s, transform 0.15s",
            width: "100%",
          }}
          onMouseEnter={(e) => !added && (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <ShoppingCart size={16} />
          {added ? "Added! ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
