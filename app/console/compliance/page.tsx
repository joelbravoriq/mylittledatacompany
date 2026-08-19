import ConsoleHeader from "@/components/console/ConsoleHeader";
import ComplianceConsole from "@/components/console/ComplianceConsole";
import KpiCard from "@/components/console/KpiCard";

export default function CompliancePage() {
  return (
    <>
      <ConsoleHeader
        eyebrow="Compliance Logs"
        title="Auditoría Ley N° 21.719"
        desc="Trazabilidad en vivo de las reglas de privacidad, validación y auditoría aplicadas a cada request."
      />
      <div className="px-8 py-8 space-y-8">
        <div className="grid sm:grid-cols-3 gap-4">
          <KpiCard label="Requests auditadas hoy" value="48,213" delta="100% trazadas" />
          <KpiCard label="Anonymization compliance" value="100%" tone="ok" />
          <KpiCard label="Reglas Ley 21.719 activas" value="12" />
        </div>
        <ComplianceConsole />
      </div>
    </>
  );
}
