const industries = [
  {
    name: "Seguros",
    tag: "Insurtech & Aseguradoras",
    pain: "Abandono de formularios por exceso de campos manuales y mala tarificación de riesgo por datos desactualizados.",
    useCase: "Autocompletado instantáneo al ingresar la patente y tarificación dinámica según kilometraje e historial técnico.",
    product: "API Vehicle Enriched",
  },
  {
    name: "Banca & Fintech",
    tag: "Financieras y Cajas de Compensación",
    pain: "Procesos lentos de evaluación patrimonial y aprobación manual de créditos automotrices o prendas.",
    useCase: "Scoring patrimonial automático en segundos para evaluar capacidad de pago y validar bienes en prenda.",
    product: "Patrimonial Score Feed",
  },
  {
    name: "Automotoras",
    tag: "Concesionarias y Portales de Usados",
    pain: "Tasación errónea de autos usados recibidos en parte de pago y falta de visibilidad de recalls.",
    useCase: "Tasador automático B2B para el salón de ventas y validación de alertas de seguridad del vehículo.",
    product: "Vehicle History & Recall API",
  },
  {
    name: "Logística",
    tag: "Flotas y Transporte",
    pain: "Falta de control en cobros de peajes/TAG y mantenciones no programadas.",
    useCase: "Auditoría de cobros de TAG contra rutas reales y alertas automáticas de vencimiento de PRT.",
    product: "Toll & Route Cost API",
  },
  {
    name: "Real Estate",
    tag: "Proptech y Fondos Inmobiliarios",
    pain: "Detección manual y lenta de oportunidades de inversión y desarrollo.",
    useCase: "Valoración y plusvalía predictiva cruzando precio de suelo, permisos aprobados y perfil de zona.",
    product: "Property & Land Use Feed",
  },
  {
    name: "Retail",
    tag: "E-commerce y Consumo Masivo",
    pain: "Fallas de entrega por direcciones mal escritas y falta de criterios para abrir sucursales.",
    useCase: "Normalización de direcciones en checkout y modelos de geomarketing para expansión física.",
    product: "Geocoding & Address API",
  },
];

export default function Industries() {
  return (
    <section id="industrias" className="py-24 sm:py-32 border-t border-base-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-mono uppercase tracking-wide text-policy mb-3">Industrias</p>
          <h2 className="font-display font-semibold uppercase tracking-tight text-3xl sm:text-4xl text-base-50">
            Mismo catálogo de datos, un caso de uso por industria.
          </h2>
          <p className="mt-4 text-base-300">
            Banca, Seguros y Fintech son nuestro foco principal — pero la
            misma infraestructura de datos ya resuelve problemas concretos en
            otras seis industrias.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {industries.map((ind) => (
            <div
              key={ind.name}
              className="rounded-lg card-border bg-base-850/70 p-6 flex flex-col"
            >
              <div>
                <h3 className="font-display font-semibold uppercase tracking-tight text-lg text-base-50">
                  {ind.name}
                </h3>
                <p className="mt-0.5 text-xs text-base-500">{ind.tag}</p>
              </div>

              <dl className="mt-4 space-y-3 flex-1">
                <div>
                  <dt className="text-[11px] font-mono uppercase tracking-wide text-base-500">
                    El problema
                  </dt>
                  <dd className="mt-1 text-sm text-base-400 leading-relaxed">
                    {ind.pain}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-mono uppercase tracking-wide text-base-500">
                    Caso de uso
                  </dt>
                  <dd className="mt-1 text-sm text-base-300 leading-relaxed">
                    {ind.useCase}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 pt-4 border-t border-base-800">
                <span className="text-[11px] font-mono rounded-sm border border-amber/30 bg-amber/[0.06] px-2.5 py-1.5 text-amber-bright inline-block">
                  {ind.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
