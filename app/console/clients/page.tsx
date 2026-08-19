import ConsoleHeader from "@/components/console/ConsoleHeader";
import ClientTenancyDashboard from "@/components/console/ClientTenancyDashboard";

export default function ClientsPage() {
  return (
    <>
      <ConsoleHeader
        eyebrow="Clientes & Tenancy"
        title="Gestión Granular B2B"
        desc="Monitoreo, soporte y compliance por cliente activo del catálogo DaaS."
      />
      <div className="px-8 py-8">
        <ClientTenancyDashboard />
      </div>
    </>
  );
}
