const services = [
  {
    title: "Modern Data Stack Architecture",
    desc: "Diseño e implementación de arquitecturas sobre Snowflake, Databricks, dbt y Airflow, pensadas para escalar sin deuda técnica.",
    tags: ["Snowflake", "Databricks", "dbt", "Airflow"],
  },
  {
    title: "Embedded Data Pods",
    desc: "Células de desarrollo senior apalancadas que se integran directo a tu equipo, sin la burocracia de una consultora tradicional.",
    tags: ["Staff Augmentation Senior", "Delivery ágil"],
  },
  {
    title: "Pipeline & Data Quality Audits",
    desc: "Auditoría técnica de tus pipelines actuales: cuellos de botella, riesgos de calidad y oportunidades de automatización.",
    tags: ["Data Quality", "Observabilidad", "Cost Optimization"],
  },
];

export default function Consulting() {
  return (
    <section className="py-24 sm:py-32 border-t border-base-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-mono uppercase tracking-wide text-amber mb-3">Consultoría Boutique · Engineering</p>
          <h2 className="font-display font-semibold uppercase tracking-tight text-3xl sm:text-4xl text-base-50">
            Un estudio senior, no una fábrica de consultores junior.
          </h2>
          <p className="mt-4 text-base-300">
            Trabajamos con equipos reducidos de ingenieros senior. Sin capas de
            gerencia intermedia, sin meses de onboarding.
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-lg card-border bg-base-850/70 p-6 flex flex-col hover:border-amber/40 transition-colors"
            >
              <h3 className="text-base font-semibold text-base-50">{s.title}</h3>
              <p className="mt-2.5 text-sm text-base-400 leading-relaxed flex-1">
                {s.desc}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-mono rounded-sm border border-base-600 bg-base-900/70 px-2.5 py-1 text-base-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
