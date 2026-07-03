interface CaptureFormProps {
  artistId: string;
  artistName: string;
  score: number;
}

// Placeholder — a fuller version replaces this next.
export function CaptureForm(_props: CaptureFormProps) {
  return (
    <div className="neu-extruded rounded-3xl p-6 text-center">
      <h3 className="font-display text-xl font-bold text-[#3D4852]">
        Want the full playbook?
      </h3>
      <p className="mt-2 text-sm text-[#6B7280]">
        We'll send a short breakdown of what to do next based on your score.
      </p>
    </div>
  );
}
