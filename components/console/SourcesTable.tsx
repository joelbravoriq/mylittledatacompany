type Row = {
  source: string;
  frequency: string;
  status: "ok" | "warning";
  lastSync: string;
  errorRate: string;
};

const rows: Row[] = [
  {
    source: "Chile Vehicle Registry Feed (Live)",
    frequency: "Diario (Automático)",
    status: "ok",
    lastSync: "hace 14 min",
    errorRate: "0.01%",
  },
  {
    source: "PRT Technical Inspection Stream",
    frequency: "Diario",
    status: "ok",
    lastSync: "hace 1 hora",
    errorRate: "0.04%",
  },
  {
    source: "SII Fiscal Valuation Dataset",
    frequency: "Semanal",
    status: "warning",
    lastSync: "hace 3 horas",
    errorRate: "1.10%",
  },
  {
    source: "Legacy Provider Delta Comparison",
    frequency: "Batch",
    status: "ok",
    lastSync: "hace 12 horas",
    errorRate: "0.00%",
  },
];

function StatusBadge({ status }: { status: Row["status"] }) {
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
      WARNING &middot; Latencia
    </span>
  );
}

export default function SourcesTable() {
  return (
    <div className="overflow-x-auto scrollbar-thin rounded-lg border border-base-700">
      <table className="w-full min-w-[820px] text-sm">
        <thead>
          <tr className="bg-base-850 text-left text-[11px] font-mono uppercase tracking-wide text-base-500">
            <th className="px-5 py-3.5 font-medium">Data Source</th>
            <th className="px-5 py-3.5 font-medium">Frecuencia</th>
            <th className="px-5 py-3.5 font-medium">Estado</th>
            <th className="px-5 py-3.5 font-medium">Última sync</th>
            <th className="px-5 py-3.5 font-medium">Errores</th>
            <th className="px-5 py-3.5 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.source}
              className={i !== rows.length - 1 ? "border-t border-base-800" : ""}
            >
              <td className="px-5 py-4 font-medium text-base-100">{r.source}</td>
              <td className="px-5 py-4 text-base-400">{r.frequency}</td>
              <td className="px-5 py-4">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-5 py-4 font-mono text-base-400">{r.lastSync}</td>
              <td className="px-5 py-4 font-mono text-base-400 tabular-nums">{r.errorRate}</td>
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
  );
}
