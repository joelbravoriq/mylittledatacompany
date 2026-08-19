"use client";

import { useState } from "react";

type EnrichedRow = {
  rutMasked: string;
  rutValid: boolean;
  matchType: "company_found" | "no_match" | "invalid_rut";
  company?: {
    legalName: string;
    companyType: string;
    communeTax: string | null;
    capitalClp: number | null;
  };
};

type BridgeResponse = {
  jobId: string;
  storageStatus: string;
  recordsProcessed: number;
  matched: number;
  qualityScore: number;
  executionTimeMs: number;
  results: EnrichedRow[];
};

function matchBadge(row: EnrichedRow) {
  if (row.matchType === "invalid_rut") {
    return <span className="text-[11px] font-mono rounded-sm px-2 py-1 border text-base-400 bg-base-800 border-base-600">RUT inválido</span>;
  }
  if (row.matchType === "company_found") {
    return <span className="text-[11px] font-mono rounded-sm px-2 py-1 border text-ok bg-ok/10 border-ok/25">Match en mldc_companies</span>;
  }
  return <span className="text-[11px] font-mono rounded-sm px-2 py-1 border text-amber-bright bg-amber/10 border-amber/25">Sin coincidencia</span>;
}

export default function BridgeEngineTester() {
  const [mode, setMode] = useState<"single" | "csv">("single");
  const [rut, setRut] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BridgeResponse | null>(null);

  const canSubmit = mode === "single" ? rut.trim().length > 0 : file !== null;

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      if (mode === "single") {
        formData.append("rut", rut.trim());
      } else if (file) {
        formData.append("file", file);
      }
      formData.append("clientLabel", "SANDBOX_SELF_TEST");

      const res = await fetch("/api/bridge-engine", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error desconocido del Bridge Engine.");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("No se pudo conectar con el Bridge Engine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Legal notice */}
      <div className="rounded-lg border border-policy/30 bg-policy/[0.06] p-5">
        <p className="text-sm font-semibold text-policy">Antes de probar</p>
        <p className="mt-2 text-sm text-base-300 leading-relaxed">
          Este sandbox procesa RUTs reales en memoria y los cruza contra el
          dataset público de empresas — no persiste ningún RUT. Aun así, solo
          debes ingresar <strong className="text-base-100">tu propio RUT</strong>{" "}
          (o el de tu empresa), o el de personas que te hayan autorizado
          explícitamente a usarlo como prueba. No subas nóminas de terceros
          sin su consentimiento: el Bridge Engine no valida la base de
          licitud del dato que ingresas, eso es responsabilidad de quien lo hace.
        </p>
      </div>

      {/* Mode switch */}
      <div className="mt-6 inline-flex rounded-lg border border-base-600 bg-base-900/60 p-1">
        <button
          onClick={() => setMode("single")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === "single" ? "bg-amber text-base-950" : "text-base-300 hover:text-base-100"
          }`}
        >
          Un RUT
        </button>
        <button
          onClick={() => setMode("csv")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === "csv" ? "bg-amber text-base-950" : "text-base-300 hover:text-base-100"
          }`}
        >
          CSV / nómina
        </button>
      </div>

      {/* Input panel */}
      <div className="mt-3 rounded-lg card-border bg-base-850/70 p-6">
        {mode === "single" ? (
          <>
            <label className="block text-sm font-medium text-base-200 mb-2">
              RUT (tuyo o de tu empresa) — ej: 12.345.678-9 o 77.877.779-7
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                placeholder="12.345.678-9"
                className="flex-1 rounded-lg bg-base-900 border border-base-600 px-4 py-3 text-sm font-mono text-base-100 placeholder:text-base-500 focus:outline-none focus:border-amber/60 focus:ring-1 focus:ring-amber/40 transition-colors"
              />
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber px-5 py-3 text-sm font-semibold text-base-950 hover:bg-amber-bright transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap glow"
              >
                {loading ? "Procesando…" : "Ejecutar Bridge Engine"}
              </button>
            </div>
          </>
        ) : (
          <>
            <label className="block text-sm font-medium text-base-200 mb-2">
              CSV de RUTs (una columna, con o sin encabezado &quot;RUT&quot;)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="flex-1 rounded-lg bg-base-900 border border-base-600 px-4 py-3 text-sm text-base-100 file:mr-3 file:rounded-sm file:border-0 file:bg-base-700 file:px-3 file:py-1.5 file:text-xs file:text-base-100 focus:outline-none focus:border-amber/60 transition-colors"
              />
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber px-5 py-3 text-sm font-semibold text-base-950 hover:bg-amber-bright transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap glow"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Procesando en memoria
                  </>
                ) : (
                  "Ejecutar Bridge Engine"
                )}
              </button>
            </div>
          </>
        )}
        {error && <p className="mt-3 text-sm text-amber-bright">{error}</p>}
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 animate-fade-up">
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="rounded-lg card-border bg-base-850/70 p-4">
              <p className="text-[11px] font-mono uppercase tracking-wide text-base-500">Job ID</p>
              <p className="mt-1 text-xs font-mono text-base-200 truncate">{result.jobId}</p>
            </div>
            <div className="rounded-lg card-border bg-base-850/70 p-4">
              <p className="text-[11px] font-mono uppercase tracking-wide text-base-500">Storage Status</p>
              <p className="mt-1 text-sm font-mono text-ok">{result.storageStatus}</p>
            </div>
            <div className="rounded-lg card-border bg-base-850/70 p-4">
              <p className="text-[11px] font-mono uppercase tracking-wide text-base-500">Procesados / Match</p>
              <p className="mt-1 text-sm font-mono text-base-100 tabular-nums">
                {result.recordsProcessed} / {result.matched}
              </p>
            </div>
            <div className="rounded-lg card-border bg-base-850/70 p-4">
              <p className="text-[11px] font-mono uppercase tracking-wide text-base-500">Tiempo de ejecución</p>
              <p className="mt-1 text-sm font-mono text-base-100 tabular-nums">{result.executionTimeMs}ms</p>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-ok/25 bg-ok/[0.05] px-4 py-3 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-ok shrink-0">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <p className="text-sm text-base-200">
              Memoria liberada. Ningún RUT de esta consulta fue escrito a una tabla ni a disco —
              solo se registró metadata sin datos personales en <span className="font-mono text-base-100">mldc_audit_trail</span>.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto scrollbar-thin rounded-lg border border-base-700">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="bg-base-850 text-left text-[11px] font-mono uppercase tracking-wide text-base-500">
                  <th className="px-5 py-3 font-medium">RUT (enmascarado)</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 font-medium">Razón Social</th>
                  <th className="px-5 py-3 font-medium">Tipo</th>
                  <th className="px-5 py-3 font-medium">Comuna</th>
                </tr>
              </thead>
              <tbody>
                {result.results.map((row, i) => (
                  <tr key={i} className={i !== result.results.length - 1 ? "border-t border-base-800" : ""}>
                    <td className="px-5 py-3 font-mono text-base-300">{row.rutMasked}</td>
                    <td className="px-5 py-3">{matchBadge(row)}</td>
                    <td className="px-5 py-3 text-base-100">{row.company?.legalName ?? "—"}</td>
                    <td className="px-5 py-3 text-base-400 font-mono">{row.company?.companyType ?? "—"}</td>
                    <td className="px-5 py-3 text-base-400">{row.company?.communeTax ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
