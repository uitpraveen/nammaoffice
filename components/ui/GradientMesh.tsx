/**
 * Animated mesh-gradient backdrop — purple/indigo/cyan/pink blurred blobs
 * that drift slowly behind hero content. Pure CSS animations (no JS), all
 * `transform` keyframes for GPU-only paint.
 */
export function GradientMesh({
  className = "",
  intensity = "default",
}: {
  className?: string;
  /** "subtle" reduces blob opacity; "intense" boosts size + opacity */
  intensity?: "subtle" | "default" | "intense";
}) {
  const opacityScale =
    intensity === "subtle" ? 0.6 : intensity === "intense" ? 1.25 : 1;

  return (
    <div
      aria-hidden
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <span
        className="mesh-blob mesh-blob-indigo anim-drift-1"
        style={{
          width: 700,
          height: 700,
          top: "-15%",
          left: "-10%",
          opacity: 0.55 * opacityScale,
        }}
      />
      <span
        className="mesh-blob mesh-blob-purple anim-drift-2"
        style={{
          width: 600,
          height: 600,
          top: "10%",
          right: "-12%",
          opacity: 0.45 * opacityScale,
        }}
      />
      <span
        className="mesh-blob mesh-blob-cyan anim-drift-3"
        style={{
          width: 650,
          height: 650,
          bottom: "-20%",
          left: "20%",
          opacity: 0.4 * opacityScale,
        }}
      />
      <span
        className="mesh-blob mesh-blob-pink anim-drift-4"
        style={{
          width: 450,
          height: 450,
          top: "40%",
          left: "45%",
          opacity: 0.28 * opacityScale,
        }}
      />
    </div>
  );
}
