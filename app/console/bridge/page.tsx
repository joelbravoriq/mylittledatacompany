import ConsoleHeader from "@/components/console/ConsoleHeader";
import BridgeEngineTester from "@/components/console/BridgeEngineTester";

export default function BridgePage() {
  return (
    <>
      <ConsoleHeader
        eyebrow="Bridge Engine · Zero-Storage"
        title="Pruebas de Ingesta In-Memory"
        desc="Sube un CSV de RUTs para ver el ciclo completo: recepción, cruce en caliente contra datos públicos, entrega y purge — sin persistencia de datos personales."
      />
      <div className="px-8 py-8">
        <BridgeEngineTester />
      </div>
    </>
  );
}
