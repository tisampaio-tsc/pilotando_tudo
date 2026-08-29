/** Traço fino que imita uma costura de jeans. Usado com moderação, só como enfeite. */
export default function StitchDivider({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`jeans-stitch mx-auto w-16 rounded-full ${className}`}
      aria-hidden
    />
  );
}
