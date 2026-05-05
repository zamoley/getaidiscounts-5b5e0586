export function OwlLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="owlGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="oklch(0.78 0.22 240)" />
          <stop offset="100%" stopColor="oklch(0.62 0.22 250)" />
        </linearGradient>
      </defs>
      {/* Head silhouette */}
      <path
        d="M32 6c-9 0-16 6-19 13-2 5-2 11 0 16 1 3 1 5 0 8-1 2-2 4-2 6 0 5 9 9 21 9s21-4 21-9c0-2-1-4-2-6-1-3-1-5 0-8 2-5 2-11 0-16C48 12 41 6 32 6z"
        stroke="url(#owlGrad)"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="oklch(0.72 0.21 245 / 0.08)"
      />
      {/* Ear tufts */}
      <path d="M14 14l6 6M50 14l-6 6" stroke="url(#owlGrad)" strokeWidth="2" strokeLinecap="round" />
      {/* Eyes — concentric circles like AI lens */}
      <circle cx="23" cy="28" r="7" stroke="url(#owlGrad)" strokeWidth="2" fill="none" />
      <circle cx="41" cy="28" r="7" stroke="url(#owlGrad)" strokeWidth="2" fill="none" />
      <circle cx="23" cy="28" r="2.5" fill="url(#owlGrad)" />
      <circle cx="41" cy="28" r="2.5" fill="url(#owlGrad)" />
      {/* Beak */}
      <path d="M32 33l-3 5h6l-3-5z" fill="url(#owlGrad)" />
      {/* Chest neural lines */}
      <path d="M22 46c4 3 16 3 20 0" stroke="url(#owlGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M26 50c2 1.5 10 1.5 12 0" stroke="url(#owlGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
