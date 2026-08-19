const categories = [
  {
    title: "Parque Vehicular y Transporte",
    desc: "Patentes, tasaciones fiscales, revisión técnica (PRT), recalls de fábrica y flujos de peajes/TAG.",
    fields: ["Patentes & Tasación", "PRT / Kilometraje", "Recalls (VIN)", "Peajes & TAG"],
    icon: (
      <path d="M4 17V7a2 2 0 0 1 2-2h6l2 2h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    ),
  },
  {
    title: "Perfilamiento Financiero y Sociodemográfico",
    desc: "Datos georreferenciados (NSE), actividad económica SII, compras públicas e indicadores del Banco Central / CMF.",
    fields: ["NSE por Zona", "Actividad SII", "Mercado Público", "UF / UTM / Tasas"],
    icon: (
      <path d="M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
    ),
  },
  {
    title: "Inmobiliario y Territorial",
    desc: "Catastro de bienes raíces del SII, avalúo fiscal, uso de suelo y permisos de edificación municipales (DOM).",
    fields: ["Catastro SII", "Avalúo Fiscal", "Permisos DOM", "Uso de Suelo"],
    icon: (
      <path d="M3 21V9l9-6 9 6v12M9 21v-8h6v8" />
    ),
  },
];

export default function ProductPillars() {
  return (
    <section id="api-daas" className="py-24 sm:py-32 border-t border-base-800 bg-base-900/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-mono uppercase tracking-wide text-amber mb-3">Catálogo de Data Sources</p>
          <h2 className="font-display font-semibold uppercase tracking-tight text-3xl sm:text-4xl text-base-50">
            Una plataforma DaaS, múltiples fuentes de datos.
          </h2>
          <p className="mt-4 text-base-300">
            El vehicular es solo uno de nuestros feeds. Ingerimos, enriquecemos
            y certificamos datos de distintos dominios bajo el mismo estándar
            de frescura, calidad y compliance.
          </p>
        </div>

        <div id="data-quality" className="mt-14 grid md:grid-cols-3 gap-5">
          {categories.map((c) => (
            <div
              key={c.title}
              className="group relative rounded-lg card-border bg-base-850/70 p-6 hover:border-amber/40 hover:bg-base-850 transition-colors"
            >
              <span className="absolute top-0 right-0 h-9 w-9 rounded-bl-lg rounded-tr-lg bg-amber/10 border-l border-b border-amber/25 flex items-center justify-center text-amber">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {c.icon}
                </svg>
              </span>
              <h3 className="pr-8 text-base font-semibold text-base-50">{c.title}</h3>
              <p className="mt-2 text-sm text-base-400 leading-relaxed">{c.desc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.fields.map((f) => (
                  <span
                    key={f}
                    className="text-[11px] font-mono rounded-sm border border-base-600 bg-base-900/70 px-2 py-1 text-base-300"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-base-400">
          ¿Necesitas un dominio que no está en el catálogo? Sumamos fuentes
          nuevas caso a caso —{" "}
          <a href="#poc" className="text-amber hover:text-amber-bright transition-colors">
            cuéntanos qué dato te falta
          </a>
          .
        </p>
      </div>
    </section>
  );
}
