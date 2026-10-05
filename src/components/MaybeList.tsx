const IDEAS = [
  {
    name: "vCard generator",
    url: "https://linke.ro/tools/vcard-generator",
  },
  {
    name: "Link-in-bio checklist (or apply the checklist idea to something else)",
    url: "https://linke.ro/tools/link-in-bio-checklist",
  },
];

export function MaybeList() {
  return (
    <section className="neu-extruded rounded-3xl p-6 sm:p-8 ">
      <h2 className="font-display text-xl font-bold text-[#3D4852]">Maybe list</h2>
      <p className="mt-1 text-sm text-[#6B7280]">
        Tool ideas you're still deciding on.
      </p>
      <ul className="mt-4 space-y-2">
        {IDEAS.map((i) => (
          <li key={i.url} className="neu-inset-sm rounded-2xl px-4 py-3 text-sm">
            <span className="font-semibold text-[#3D4852]">{i.name}</span>{" "}
            <a
              href={i.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6C63FF] hover:underline break-all"
            >
              {i.url}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
