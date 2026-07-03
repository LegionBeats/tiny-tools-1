export function ScanAnimation() {
  return (
    <div className="neu-extruded rounded-3xl p-10 text-center">
      <div className="inline-flex items-center gap-3">
        <span className="h-3 w-3 rounded-full bg-[#6C63FF] animate-pulse" />
        <span className="text-[#3D4852] font-semibold tracking-wide">Analyzing…</span>
      </div>
      <p className="mt-3 text-sm text-[#6B7280]">
        Pulling releases, cadence, and reach.
      </p>
    </div>
  );
}
