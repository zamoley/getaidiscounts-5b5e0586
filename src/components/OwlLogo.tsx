export function OwlLogo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="owlStroke" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="oklch(0.85 0.18 235)" />
          <stop offset="55%" stopColor="oklch(0.72 0.21 245)" />
          <stop offset="100%" stopColor="oklch(0.55 0.22 255)" />
        </linearGradient>
        <linearGradient id="owlFill" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="oklch(0.72 0.21 245 / 0.18)" />
          <stop offset="100%" stopColor="oklch(0.72 0.21 245 / 0.04)" />
        </linearGradient>
        <radialGradient id="owlEye" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="oklch(0.95 0.05 240)" />
          <stop offset="60%" stopColor="oklch(0.78 0.22 240)" />
          <stop offset="100%" stopColor="oklch(0.45 0.20 255)" />
        </radialGradient>
      </defs>

      {/* Ear tufts */}
      <path
        d="M14 12 L20 22 M50 12 L44 22"
        stroke="url(#owlStroke)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Head + body silhouette (rounded, owl-shaped) */}
      <path
        d="
          M32 7
          C20 7 11 16 11 28
          C11 33 12.5 37 11.2 41
          C10 44.5 9.2 47.5 9.2 50
          C9.2 56 18 60 32 60
          C46 60 54.8 56 54.8 50
          C54.8 47.5 54 44.5 52.8 41
          C51.5 37 53 33 53 28
          C53 16 44 7 32 7 Z"
        fill="url(#owlFill)"
        stroke="url(#owlStroke)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Brow / face mask line */}
      <path
        d="M14 25 C20 20 26 19 32 22 C38 19 44 20 50 25"
        stroke="url(#owlStroke)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />

      {/* Eyes — concentric AI-lens style */}
      <circle cx="23" cy="30" r="7.5" fill="oklch(0.18 0.02 260)" stroke="url(#owlStroke)" strokeWidth="1.8" />
      <circle cx="41" cy="30" r="7.5" fill="oklch(0.18 0.02 260)" stroke="url(#owlStroke)" strokeWidth="1.8" />
      <circle cx="23" cy="30" r="3.4" fill="url(#owlEye)" />
      <circle cx="41" cy="30" r="3.4" fill="url(#owlEye)" />
      <circle cx="24.2" cy="28.8" r="0.9" fill="white" />
      <circle cx="42.2" cy="28.8" r="0.9" fill="white" />

      {/* Beak */}
      <path
        d="M32 36 L29 41 Q32 43 35 41 Z"
        fill="url(#owlStroke)"
      />

      {/* Chest feather arcs / neural rhythm */}
      <path
        d="M19 47 Q32 53 45 47"
        stroke="url(#owlStroke)"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M23 52 Q32 56 41 52"
        stroke="url(#owlStroke)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}
