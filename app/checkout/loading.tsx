// app/checkout/loading.tsx
// Next.js automatically shows this while the checkout page is loading
// (e.g. during server-side data fetching or slow navigations).

export default function CheckoutLoading() {
  const DARK = "#1A1A2E"
  const PINK = "#FF78AC"

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fafafa",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        {/* Animated spinner ring */}
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            border: `4px solid #eee`,
            borderTopColor: PINK,
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 20px",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: "1.3rem",
            color: DARK,
            opacity: 0.7,
            margin: 0,
          }}
        >
          Loading Checkout…
        </p>
      </div>
    </main>
  )
}