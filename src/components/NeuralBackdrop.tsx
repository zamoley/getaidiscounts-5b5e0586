/**
 * Fixed, low-opacity neural-network pattern overlay.
 * Sits behind all content at z=-10, doesn't intercept pointer events.
 */
export function NeuralBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Soft color washes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,oklch(0.30_0.12_250/0.35),transparent_60%),radial-gradient(ellipse_60%_40%_at_100%_0%,oklch(0.30_0.15_220/0.20),transparent_60%)]" />
      {/* Neural / circuit SVG pattern */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.18]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="neural"
            x="0"
            y="0"
            width="160"
            height="160"
            patternUnits="userSpaceOnUse"
          >
            {/* Nodes */}
            <circle cx="20" cy="20" r="1.6" fill="oklch(0.78 0.22 240)" />
            <circle cx="80" cy="40" r="1.2" fill="oklch(0.78 0.22 240)" />
            <circle cx="140" cy="20" r="1.6" fill="oklch(0.78 0.22 240)" />
            <circle cx="40" cy="100" r="1.2" fill="oklch(0.78 0.22 240)" />
            <circle cx="110" cy="110" r="1.8" fill="oklch(0.78 0.22 240)" />
            <circle cx="20" cy="150" r="1.2" fill="oklch(0.78 0.22 240)" />
            <circle cx="140" cy="140" r="1.4" fill="oklch(0.78 0.22 240)" />
            {/* Connections */}
            <g stroke="oklch(0.78 0.22 240)" strokeWidth="0.6" fill="none" opacity="0.55">
              <path d="M20 20 L80 40 L140 20" />
              <path d="M80 40 L40 100 L110 110" />
              <path d="M110 110 L140 140" />
              <path d="M40 100 L20 150" />
              <path d="M110 110 L140 20" />
              <path d="M20 150 L110 110" />
            </g>
          </pattern>
          <radialGradient id="fade" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="fadeMask">
            <rect width="100%" height="100%" fill="url(#fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#neural)" mask="url(#fadeMask)" />
      </svg>
      {/* Subtle vignette to keep cards crisp */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.10_0.015_260/0.5)_100%)]" />
    </div>
  );
}
