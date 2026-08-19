import ConsoleHeader from "@/components/console/ConsoleHeader";
import KpiCard from "@/components/console/KpiCard";
import SourcesTable from "@/components/console/SourcesTable";

export default function ObservabilityPage() {
  return (
    <>
      <ConsoleHeader
        eyebrow="Observabilidad & Pipelines"
        title="Health Check de Data Pipelines"
        desc="Estado en vivo de la ingesta, calidad y frescura de todos los feeds del catálogo DaaS."
      />

      <div className="px-8 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Registros procesados hoy" value="1,420,890" delta="+12% vs ayer" />
          <KpiCard label="Data Quality Score promedio" value="99.8%" tone="ok" />
          <KpiCard label="Data Freshness SLA" value="< 2h" tone="ok" />
          <KpiCard label="Compliance Ley 21.719" value="100%" tone="ok" delta="Passed" />
        </div>

        <div className="mt-10">
          <h2 className="text-sm font-semibold text-base-100 mb-4">
            Monitoreo de Fuentes de Datos
          </h2>
          <SourcesTable />
        </div>
      </div>
    </>
  );
}
