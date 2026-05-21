import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #111827 35%, #1d4ed8 100%)",
          color: "white",
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: -1
        }}
      >
        S
      </div>
    ),
    size
  );
}

