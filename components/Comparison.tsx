const rows = [
  {
    label: "Datos",
    old: "Tablas estáticas actualizadas 1 vez al año",
    new: "Feed vivo diario con SLA sub-24h",
  },
  {
    label: "Entrega",
    old: "Archivos CSV gigantes e ineficientes",
    new: "Snowflake Secure Data Sharing & Fast API",
  },
  {
    label: "Agilidad",
    old: "Procesos burocráticos de meses",
    new: "Integración e ingesta en días",
  },
  {
    label: "Cumplimiento",
    old: "Incertidumbre legal",
    new: "Compliance nativo con la Ley N° 21.719",
  },
];

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0 text-base-500">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0 text-ok">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function Comparison() {
  return (
    <section id="servicios" className="py-24 sm:py-32 border-t border-base-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-mono uppercase tracking-wide text-amber mb-3">Por qué MLDC</p>
          <h2 className="font-display font-semibold uppercase tracking-tight text-3xl sm:text-4xl text-base-50">
            Consultoras tradicionales vs. My Little Data Company
          </h2>
          <p className="mt-4 text-base-300">
            Body-leasing y cárnicos de recursos no resuelven el problema real:
            datos vivos, de calidad, y con cumplimiento legal desde el día uno.
          </p>
        </div>

        <div className="mt-14 overflow-x-auto scrollbar-thin -mx-6 px-6 lg:mx-0 lg:px-0">
          <div className="min-w-[720px] rounded-lg border border-base-700 overflow-hidden">
            <div className="grid grid-cols-[1fr_1.4fr_1.4fr] bg-base-850 text-sm font-medium text-base-300">
              <div className="px-5 py-4">Dimensión</div>
              <div className="px-5 py-4 border-l border-base-700">
                Consultoras Tradicionales
              </div>
              <div className="px-5 py-4 border-l border-base-700 bg-ok/[0.06] text-ok">
                My Little Data Company
              </div>
            </div>
            {rows.map((r, i) => (
              <div
                key={r.label}
                className={`grid grid-cols-[1fr_1.4fr_1.4fr] text-sm ${
                  i !== rows.length - 1 ? "border-t border-base-800" : ""
                }`}
              >
                <div className="px-5 py-5 font-medium text-base-100 bg-base-900/60">
                  {r.label}
                </div>
                <div className="px-5 py-5 border-l border-base-800 text-base-400 flex items-start gap-2.5">
                  <XIcon />
                  <span>{r.old}</span>
                </div>
                <div className="px-5 py-5 border-l border-base-800 bg-ok/[0.04] text-base-100 flex items-start gap-2.5">
                  <CheckIcon />
                  <span>{r.new}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
