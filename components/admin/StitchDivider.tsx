/** Linha de costura com um "rebite" em cada ponta — enfeite de jeans do painel. */
export default function StitchDivider({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 w-24 ${className}`}
      aria-hidden
    >
      <span className="jeans-rivet jeans-rivet-sm shrink-0" />
      <span className="jeans-stitch flex-1" />
      <span className="jeans-rivet jeans-rivet-sm shrink-0" />
    </div>
  );
}
