import { Link } from "@tanstack/react-router";

export function SiteNav() {
  return (
    <nav className="flex justify-center gap-3 mb-8 flex-wrap">
      <Link
        to="/"
        activeOptions={{ exact: true }}
        activeProps={{
          className:
            "neu-inset-sm rounded-full px-5 py-2 text-xs font-semibold tracking-wider uppercase text-[#6C63FF]",
        }}
        inactiveProps={{
          className:
            "neu-extruded-sm rounded-full px-5 py-2 text-xs font-semibold tracking-wider uppercase text-[#6B7280] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform",
        }}
      >
        Tiny Tools
      </Link>
      <Link
        to="/stack"
        activeProps={{
          className:
            "neu-inset-sm rounded-full px-5 py-2 text-xs font-semibold tracking-wider uppercase text-[#6C63FF]",
        }}
        inactiveProps={{
          className:
            "neu-extruded-sm rounded-full px-5 py-2 text-xs font-semibold tracking-wider uppercase text-[#6B7280] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform",
        }}
      >
        Software Stack
      </Link>
    </nav>
  );
}

export function SiteFooterNav() {
  return (
    <div className="mt-16 pt-8 border-t border-[#C8D0E0] flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#9AA3B2]">
      <Link to="/" className="text-[#6C63FF] hover:underline font-medium">
        Tiny Tools
      </Link>
      <span>·</span>
      <Link to="/stack" className="text-[#6C63FF] hover:underline font-medium">
        Software Stack
      </Link>
      <span>·</span>
      <Link to="/auth" className="text-[#6B7280] hover:underline font-medium">
        Admin login
      </Link>
      <span>·</span>
      <Link
        to="/stack/admin"
        className="text-[#6B7280] hover:underline font-medium"
      >
        Add software
      </Link>
    </div>
  );
}
