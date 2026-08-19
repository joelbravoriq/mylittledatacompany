const points = [
  {
    title: "Anonimización & Pseudonimización",
    desc: "Los datos personales sensibles se procesan bajo técnicas de anonimización antes de salir de nuestros pipelines.",
  },
  {
    title: "Encriptación en tránsito y reposo",
    desc: "TLS 1.3 en cada endpoint y cifrado nativo en Snowflake Secure Data Sharing.",
  },
  {
    title: "Trazabilidad y consentimiento",
    desc: "Logs de acceso y linaje de datos alineados a los principios de finalidad y proporcionalidad de la Ley 21.719.",
  },
  {
    title: "Auditoría continua",
    desc: "Revisiones periódicas de cumplimiento para que tu área de Riesgo y Compliance duerma tranquila.",
  },
];

export default function Compliance() {
  return (
    <section id="compliance" className="py-24 sm:py-32 border-t border-base-800 bg-base-900/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <p className="text-sm font-mono uppercase tracking-wide text-policy mb-3">Compliance</p>
            <h2 className="font-display font-semibold uppercase tracking-tight text-3xl sm:text-4xl text-base-50">
              Cumplimiento nativo con la Ley N° 21.719
            </h2>
            <p className="mt-4 text-base-300 leading-relaxed">
              La nueva Ley de Protección de Datos Personales en Chile eleva el
              estándar para Banca, Seguros y Fintech. Nuestra arquitectura fue
              diseñada bajo principios de <span className="text-base-100">Privacy-by-Design</span>,
              no como un parche posterior.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 rounded-lg border border-policy/30 bg-policy/[0.06] px-4 py-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-policy shrink-0">
                <path d="M12 2 4 6v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6l-8-4Z" />
              </svg>
              <p className="text-sm text-base-200">
                Compliance certificado en cada respuesta de nuestra API:{" "}
                <span className="font-mono text-ok">compliance_certified: true</span>
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {points.map((p) => (
              <div key={p.title} className="rounded-lg card-border bg-base-850/70 p-5">
                <h3 className="text-sm font-semibold text-base-50">{p.title}</h3>
                <p className="mt-2 text-sm text-base-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
