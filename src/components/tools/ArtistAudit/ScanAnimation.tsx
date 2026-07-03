import { useEffect, useState } from "react";

const STEPS = [
  "Pulling your catalog…",
  "Checking your release cadence…",
  "Comparing you to similar artists…",
  "Scoring your momentum…",
];

export function ScanAnimation() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c >= STEPS.length - 1 ? c : c + 1));
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="neu-extruded rounded-3xl p-8 sm:p-10">
      <h2 className="font-display font-bold text-[#3D4852] text-xl sm:text-2xl">
        Running your audit…
      </h2>
      <ul className="mt-6 space-y-3">
        {STEPS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className="flex items-center gap-3">
              <span className="w-5 h-5 flex items-center justify-center shrink-0">
                {done ? (
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="w-5 h-5 text-[#38B2AC]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 10.5 L8.5 15 L16 6" />
                  </svg>
                ) : active ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6C63FF] animate-pulse" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[#9AA3B2]" />
                )}
              </span>
              <span
                className={
                  done
                    ? "text-[#3D4852]"
                    : active
                      ? "text-[#3D4852] font-semibold"
                      : "text-[#9AA3B2]"
                }
              >
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
