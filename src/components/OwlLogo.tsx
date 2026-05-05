export function OwlLogo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Ear tufts */}
      <path
        d="M16 10 L22 20 M48 10 L42 20"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Head + body silhouette */}
      <path
        d="M32 8 C20 8 12 17 12 28 C12 33 13 37 12 41 C11 46 12 52 17 56 C22 59 27 60 32 60 C37 60 42 59 47 56 C52 52 53 46 52 41 C51 37 52 33 52 28 C52 17 44 8 32 8 Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.08"
      />
      {/* Eye discs */}
      <circle cx="23" cy="29" r="7.5" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="41" cy="29" r="7.5" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="23" cy="29" r="2.6" fill="currentColor" />
      <circle cx="41" cy="29" r="2.6" fill="currentColor" />
      {/* Beak */}
      <path d="M32 35 L29 41 Q32 43.5 35 41 Z" fill="currentColor" />
      {/* Chest arc */}
      <path
        d="M20 47 Q32 54 44 47"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}
