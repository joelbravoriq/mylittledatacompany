"use client";

import { useState } from "react";
import { clients } from "./clientsData";
import KpiCard from "./KpiCard";

function StatusBadge({ status }: { status: "ok" | "warning" }) {
  if (status === "ok") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-ok">
        <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" />
        OK
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-bright">
      <span className="h-1.5 w-1.5 rounded-full bg-amber" />
      WARNING &middot; Latencia en origen
    </span>
  );
}

type ActionState = {
  broadcast: "idle" | "open" | "sent";
  rotate: "idle" | "confirming" | "done";
  download: "idle" | "preparing" | "done";
};

export default function ClientTenancyDashboard() {
  const [clientId, setClientId] = useState(clients[0].id);
  const client = clients.find((c) => c.id === clientId) ?? clients[0];
  const [action, setAction] = useState<ActionState>({
    broadcast: "idle",
    rotate: "idle",
    download: "idle",
  });
  const [broadcastMsg, setBroadcastMsg] = useState("");

  const quotaPct = Math.round((client.dailyRequests / client.dailyRequestsLimit) * 100);

  const resetActions = () =>
    setAction({ broadcast: "idle", rotate: "idle", download: "idle" });

  const handleClientChange = (id: string) => {
    setClientId(id);
    resetActions();
    setBroadcastMsg("");
  };

  return (
    <div>
      {/* Selector */}
      <div className="rounded-lg card-border bg-base-850/70 p-5">
        <label className="block text-[11px] font-mono uppercase tracking-wide text-base-500 mb-2">
          Seleccionar Cliente Activo
        </label>
        <select
          value={clientId}
          onChange={(e) => handleClientChange(e.target.value)}
          className="w-full sm:w-auto rounded-lg bg-base-900 border border-base-600 px-4 py-3 text-sm font-medium text-base-100 focus:outline-none focus:border-amber/60 focus:ring-1 focus:ring-amber/40 transition-colors"
        >
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.planLabel})
            </option>
          ))}
        </select>
      </div>

      {/* Client KPIs */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="SLA Uptime Mensual"
          value={client.slaUptime}
          tone={client.slaState === "COMPLYING" ? "ok" : "neutral"}
          delta={client.slaState === "COMPLYING" ? "Complying" : "At risk"}
        />
        <KpiCard
          label="Daily API Requests"
          value={`${client.dailyRequests.toLocaleString("es-CL")} / ${client.dailyRequestsLimit.toLocaleString("es-CL")}`}
          delta={`${quotaPct}% consumo`}
        />
        <KpiCard label="Active Enriched Feeds" value={`${client.activeFeeds}`} delta="Data Sources" />
        <KpiCard label="Average Response Time" value={`${client.avgResponseMs}ms`} tone="ok" delta="Óptima" />
      </div>

      {/* Data sources table */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-base-100 mb-4">
          Data Sources Asociados &middot; {client.name}
        </h2>
        <div className="overflow-x-auto scrollbar-thin rounded-lg border border-base-700">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="bg-base-850 text-left text-[11px] font-mono uppercase tracking-wide text-base-500">
                <th className="px-5 py-3.5 font-medium">Data Source / Feed</th>
                <th className="px-5 py-3.5 font-medium">Endpoint / Data Sharing</th>
                <th className="px-5 py-3.5 font-medium">Estado</th>
                <th className="px-5 py-3.5 font-medium">Freshness</th>
                <th className="px-5 py-3.5 font-medium">Errores</th>
                <th className="px-5 py-3.5 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {client.sources.map((s, i) => (
                <tr
                  key={s.name}
                  className={i !== client.sources.length - 1 ? "border-t border-base-800" : ""}
                >
                  <td className="px-5 py-4 font-medium text-base-100">{s.name}</td>
                  <td className="px-5 py-4 font-mono text-base-400">{s.endpoint}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-5 py-4 text-base-400">{s.freshness}</td>
                  <td className="px-5 py-4 font-mono text-base-400 tabular-nums">{s.errorRate}</td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-xs font-mono text-amber hover:text-amber-bright transition-colors">
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Support & technical actions */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-base-100 mb-4">Soporte y Acciones Técnicas</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {/* Broadcast */}
          <div className="rounded-lg card-border bg-base-850/70 p-5">
            <p className="text-sm font-medium text-base-100">Notificar Incidencia</p>
            <p className="mt-1 text-xs text-base-400">
              Envía una alerta de mantenimiento al equipo de datos de {client.name}.
            </p>
            {action.broadcast === "idle" && (
              <button
                onClick={() => setAction((a) => ({ ...a, broadcast: "open" }))}
                className="mt-4 w-full rounded-lg border border-policy/30 bg-policy/[0.06] px-3 py-2 text-xs font-mono text-policy hover:bg-policy/10 transition-colors"
              >
                Notificar Incidencia / Broadcast
              </button>
            )}
            {action.broadcast === "open" && (
              <div className="mt-4 space-y-2">
                <textarea
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  placeholder="Ej: Mantención programada en SII Fiscal Valuation Matrix, 02:00-03:00 UTC."
                  rows={3}
                  className="w-full rounded-lg bg-base-900 border border-base-600 px-3 py-2 text-xs text-base-100 placeholder:text-base-500 focus:outline-none focus:border-policy/60 transition-colors"
                />
                <button
                  onClick={() => setAction((a) => ({ ...a, broadcast: "sent" }))}
                  className="w-full rounded-lg bg-policy px-3 py-2 text-xs font-semibold text-base-950 hover:bg-policy-bright transition-colors"
                >
                  Enviar a Data Team
                </button>
              </div>
            )}
            {action.broadcast === "sent" && (
              <p className="mt-4 text-xs font-mono text-ok">
                &#10003; Broadcast enviado al Data Team de {client.name}.
              </p>
            )}
          </div>

          {/* Rotate key */}
          <div className="rounded-lg card-border bg-base-850/70 p-5">
            <p className="text-sm font-medium text-base-100">Rotar API Key</p>
            <p className="mt-1 text-xs text-base-400">
              Invalida la key actual del cliente y genera una nueva.
            </p>
            {action.rotate === "idle" && (
              <button
                onClick={() => setAction((a) => ({ ...a, rotate: "confirming" }))}
                className="mt-4 w-full rounded-lg border border-amber/30 bg-amber/[0.06] px-3 py-2 text-xs font-mono text-amber hover:bg-amber/10 transition-colors"
              >
                Rotar API Key del Cliente
              </button>
            )}
            {action.rotate === "confirming" && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-amber-bright">
                  Esto invalidará la key activa de inmediato.
                </p>
                <button
                  onClick={() => setAction((a) => ({ ...a, rotate: "done" }))}
                  className="w-full rounded-lg bg-amber px-3 py-2 text-xs font-semibold text-base-950 hover:bg-amber-bright transition-colors"
                >
                  Confirmar rotación
                </button>
              </div>
            )}
            {action.rotate === "done" && (
              <p className="mt-4 text-xs font-mono text-ok">
                &#10003; Key rotada. Nueva key enviada al contacto técnico registrado.
              </p>
            )}
          </div>

          {/* Compliance PDF */}
          <div className="rounded-lg card-border bg-base-850/70 p-5">
            <p className="text-sm font-medium text-base-100">Registro de Compliance</p>
            <p className="mt-1 text-xs text-base-400">
              Audit log en PDF alineado a la Ley N&deg; 21.719 para {client.name}.
            </p>
            {action.download === "idle" && (
              <button
                onClick={() => {
                  setAction((a) => ({ ...a, download: "preparing" }));
                  window.setTimeout(
                    () => setAction((a) => ({ ...a, download: "done" })),
                    900
                  );
                }}
                className="mt-4 w-full rounded-lg border border-base-600 bg-base-900/70 px-3 py-2 text-xs font-mono text-base-200 hover:border-base-500 transition-colors"
              >
                Descargar Audit Log (PDF)
              </button>
            )}
            {action.download === "preparing" && (
              <p className="mt-4 text-xs font-mono text-base-400">Generando documento&hellip;</p>
            )}
            {action.download === "done" && (
              <p className="mt-4 text-xs font-mono text-ok">
                &#10003; Audit log listo &middot; entorno de demostración, sin archivo real.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Live client logs */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-base-100 mb-4">
          Logs de Cliente en Tiempo Real
        </h2>
        <div className="rounded-lg border border-base-700 bg-base-900/80 overflow-hidden">
          <div className="border-b border-base-700 bg-base-850 px-4 py-2.5">
            <span className="text-[11px] font-mono text-base-400">
              client_traffic_stream &middot; {client.name}
            </span>
          </div>
          <div className="p-5 font-mono text-[12.5px] leading-7 max-h-[220px] overflow-y-auto scrollbar-thin">
            {client.logs.map((log, idx) => (
              <p key={idx} className="text-base-300">
                <span className="text-base-500">[{log.timestamp}]</span>{" "}
                <span className="text-policy">[{log.tag}]</span> {log.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
