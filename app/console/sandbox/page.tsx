import ConsoleHeader from "@/components/console/ConsoleHeader";
import ApiSandbox from "@/components/console/ApiSandbox";

export default function SandboxPage() {
  return (
    <>
      <ConsoleHeader
        eyebrow="PoC Sandbox"
        title="RUT → Vehículos API"
        desc="Entorno de demostración — no se consultan datos reales de terceros. Simula el enriquecimiento en vivo que recibiría un cliente vía API."
      />
      <div className="px-8 py-8">
        <ApiSandbox />
      </div>
    </>
  );
}
