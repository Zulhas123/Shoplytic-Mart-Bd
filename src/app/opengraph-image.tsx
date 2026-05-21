import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(135deg, #0f172a 0%, #111827 35%, #1d4ed8 100%)",
          color: "white"
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -1 }}>Shoplytic</div>
        <div style={{ marginTop: 18, fontSize: 30, opacity: 0.9 }}>
          Simple Commerce. Fast Shopping. Clean Experience.
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 12 }}>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.14)",
              fontSize: 18
            }}
          >
            Products
          </div>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.14)",
              fontSize: 18
            }}
          >
            Checkout
          </div>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.14)",
              fontSize: 18
            }}
          >
            Orders
          </div>
        </div>
      </div>
    ),
    size
  );
}

