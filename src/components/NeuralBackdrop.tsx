import neuralBg from "@/assets/neural-bg.jpg";

/**
 * Fixed neural-network background image with dark vignette overlay.
 */
export function NeuralBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${neuralBg})` }}
      />
      {/* Darkening overlay for content legibility */}
      <div className="absolute inset-0 bg-background/70" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0.10_0.015_260/0.85)_100%)]" />
    </div>
  );
}
