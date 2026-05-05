/**
 * Fixed, low-opacity neural-network / constellation backdrop.
 * Sits behind all content at z=-10, doesn't intercept pointer events.
 */
export function NeuralBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      {/* Soft color washes for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,oklch(0.30_0.12_250/0.30),transparent_60%),radial-gradient(ellipse_60%_40%_at_100%_0%,oklch(0.30_0.15_220/0.18),transparent_60%),radial-gradient(ellipse_50%_40%_at_0%_100%,oklch(0.30_0.15_280/0.15),transparent_60%)]" />

      {/* Constellation mesh — denser nodes + thin connections */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.16]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="mesh"
            x="0"
            y="0"
            width="220"
            height="220"
            patternUnits="userSpaceOnUse"
          >
            <g stroke="oklch(0.85 0.15 240)" strokeWidth="0.5" fill="none" opacity="0.55">
              <path d="M14 18 L92 44 L168 12 L210 70" />
              <path d="M92 44 L48 110 L130 130 L196 96" />
              <path d="M48 110 L18 184 L96 200 L150 168 L210 188" />
              <path d="M130 130 L168 12" />
              <path d="M14 18 L48 110" />
              <path d="M196 96 L210 188" />
              <path d="M96 200 L130 130" />
            </g>
            <g fill="oklch(0.88 0.18 240)">
              <circle cx="14" cy="18" r="1.6" />
              <circle cx="92" cy="44" r="1.3" />
              <circle cx="168" cy="12" r="1.7" />
              <circle cx="210" cy="70" r="1.2" />
              <circle cx="48" cy="110" r="1.4" />
              <circle cx="130" cy="130" r="1.9" />
              <circle cx="196" cy="96" r="1.3" />
              <circle cx="18" cy="184" r="1.5" />
              <circle cx="96" cy="200" r="1.2" />
              <circle cx="150" cy="168" r="1.6" />
              <circle cx="210" cy="188" r="1.3" />
            </g>
          </pattern>
          <radialGradient id="fade" cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="white" stopOpacity="0.55" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="fadeMask">
            <rect width="100%" height="100%" fill="url(#fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#mesh)" mask="url(#fadeMask)" />
      </svg>

      {/* Subtle grid for technical feel */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.85 0.15 240) 1px, transparent 1px), linear-gradient(90deg, oklch(0.85 0.15 240) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Vignette to keep cards crisp */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,oklch(0.10_0.015_260/0.6)_100%)]" />
    </div>
  );
}
