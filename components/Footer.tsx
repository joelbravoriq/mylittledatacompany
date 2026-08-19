const columns = [
  {
    title: "Producto",
    links: [
      { label: "API DaaS (Vehículos)", href: "#api-daas" },
      { label: "Data Quality", href: "#data-quality" },
      { label: "Documentación", href: "#api-daas" },
    ],
  },
  {
    title: "Compañía",
    links: [
      { label: "Servicios", href: "#servicios" },
      { label: "Consultoría Boutique", href: "#servicios" },
      { label: "Compliance Ley 21.719", href: "#compliance" },
    ],
  },
  {
    title: "Contacto",
    links: [
      { label: "hello@mylittledatacompany.com", href: "mailto:hello@mylittledatacompany.com" },
      { label: "Agendar Demo PoC", href: "#poc" },
      { label: "LinkedIn", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-base-800 bg-base-900/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-sm bg-amber/15 border border-amber/40 flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-amber" />
              </span>
              <span className="font-display font-medium uppercase tracking-tight text-base-50">
                My Little Data Company
              </span>
            </div>
            <p className="mt-4 text-sm text-base-400 leading-relaxed">
              Big Data Power. Zero Corporate BS.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-medium text-base-100">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-base-400 hover:text-base-100 transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-base-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-base-500">
            © {new Date().getFullYear()} My Little Data Company. Todos los derechos reservados.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-base-700 bg-base-850 px-3 py-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-policy shrink-0">
              <path d="M12 2 4 6v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6l-8-4Z" />
            </svg>
            <span className="text-[11px] text-base-400">
              Designed &amp; Engineered in Chile under Privacy-by-Design Standards (Ley N° 21.719 / 19.628)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
