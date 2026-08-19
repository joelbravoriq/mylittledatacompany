import ConsoleHeader from "@/components/console/ConsoleHeader";
import ApiKeysPanel from "@/components/console/ApiKeysPanel";

export default function SettingsPage() {
  return (
    <>
      <ConsoleHeader
        eyebrow="Configuración"
        title="API Keys & Acceso"
        desc="Credenciales de acceso al catálogo DaaS. Entorno de demostración — las keys mostradas no son operativas."
      />
      <div className="px-8 py-8">
        <ApiKeysPanel />
      </div>
    </>
  );
}
