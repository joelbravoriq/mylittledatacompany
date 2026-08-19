import ConsoleHeader from "@/components/console/ConsoleHeader";
import SourcesTable from "@/components/console/SourcesTable";

const catalog = [
  {
    category: "Parque Vehicular y Transporte",
    sources: ["Patentes & Tasación Fiscal", "PRT / Kilometraje", "Recalls (VIN)", "Peajes & TAG"],
  },
  {
    category: "Perfilamiento Financiero y Sociodemográfico",
    sources: ["NSE por Zona", "Actividad Económica SII", "Mercado Público", "UF / UTM / Tasas"],
  },
  {
    category: "Inmobiliario y Territorial",
    sources: ["Catastro SII", "Avalúo Fiscal", "Permisos DOM", "Uso de Suelo"],
  },
];

export default function SourcesPage() {
  return (
    <>
      <ConsoleHeader
        eyebrow="Data Sources"
        title="Catálogo y Estado de Fuentes"
        desc="Reemplazo de bases estáticas anuales por feeds vivos, con monitoreo de frecuencia y calidad por fuente."
      />

      <div className="px-8 py-8 space-y-10">
        <div>
          <h2 className="text-sm font-semibold text-base-100 mb-4">Estado operacional</h2>
          <SourcesTable />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-base-100 mb-4">Catálogo por dominio</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {catalog.map((c) => (
              <div key={c.category} className="rounded-lg card-border bg-base-850/70 p-5">
                <h3 className="text-sm font-semibold text-base-50">{c.category}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.sources.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-mono rounded-sm border border-base-600 bg-base-900/70 px-2 py-1 text-base-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
