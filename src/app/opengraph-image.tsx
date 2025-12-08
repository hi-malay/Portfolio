import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Malay Mishra - Fullstack Engineer | AdeptMind";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontSize: 80,
              fontWeight: "bold",
              background: "linear-gradient(90deg, #60a5fa 0%, #22d3ee 100%)",
              backgroundClip: "text",
              color: "transparent",
              margin: 0,
              padding: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Malay Mishra
          </h1>

          <p
            style={{
              fontSize: 36,
              color: "#22d3ee",
              margin: "20px 0 0 0",
              fontWeight: 600,
            }}
          >
            Fullstack Engineer | AdeptMind
          </p>

          <div
            style={{
              display: "flex",
              gap: 20,
              marginTop: 40,
              fontSize: 24,
              color: "#94a3b8",
            }}
          >
            <span>Python</span>
            <span>•</span>
            <span>GO</span>
            <span>•</span>
            <span>React</span>
            <span>•</span>
            <span>Next.js</span>
            <span>•</span>
            <span>Node.js</span>
          </div>

          <p
            style={{
              fontSize: 20,
              color: "#64748b",
              marginTop: 40,
            }}
          >
            Bangalore, India
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
