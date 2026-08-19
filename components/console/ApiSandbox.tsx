"use client";

import { useState } from "react";

type Vehicle = {
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  tasacionFiscal: number;
  prtStatus: "VIGENTE" | "VENCIDO";
};

type Result = {
  rutMasked: string;
  timestamp: string;
  quality: number;
  vehicles: Vehicle[];
};

function hashSeed(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function maskRut(rut: string) {
  const clean = rut.trim() || "15.432.890-K";
  const parts = clean.split("-");
  const body = parts[0] ?? clean;
  const head = body.slice(0, Math.max(body.length - 3, 2));
  return `${head}***-*`;
}

const vehiclePool: Omit<Vehicle, "tasacionFiscal" | "prtStatus">[] = [
  { patente: "KPRX88", marca: "TOYOTA", modelo: "RAV4 2.5 AUT", anio: 2023 },
  { patente: "HJRT42", marca: "TOYOTA", modelo: "COROLLA CROSS HYBRID", anio: 2024 },
  { patente: "FZLM19", marca: "CHEVROLET", modelo: "TRACKER 1.2T", anio: 2022 },
];

function runQuery(rut: string): Result {
  const seed = hashSeed(rut || "MLDC-DEFAULT");
  const count = 1 + (seed % 2);
  const vehicles: Vehicle[] = Array.from({ length: count }).map((_, i) => {
    const base = vehiclePool[(seed + i) % vehiclePool.length];
    return {
      ...base,
      tasacionFiscal: 12_000_000 + ((seed + i * 731) % 12) * 1_250_000,
      prtStatus: (seed + i) % 5 === 0 ? "VENCIDO" : "VIGENTE",
    };
  });

  return {
    rutMasked: maskRut(rut),
    timestamp: new Date().toISOString(),
    quality: 99 + ((seed % 80) / 100),
    vehicles,
  };
}

function formatCLP(n: number) {
  return new Intl.NumberFormat("es-CL").format(n);
}

export default function ApiSandbox() {
  const [rut, setRut] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const handleRun = () => {
    if (loading) return;
    setLoading(true);
    setResult(null);
    window.setTimeout(() => {
      setResult(runQuery(rut));
      setLoading(false);
    }, 850);
  };

  const jsonPayload = result
    ? {
        status: "success",
        data_freshness: result.timestamp,
        data_quality_score: Number((result.quality / 100).toFixed(3)),
        compliance_law_21719: true,
        owner: {
          rut_masked: result.rutMasked,
          vehicles_count: result.vehicles.length,
        },
        vehicles: result.vehicles.map((v) => ({
          patente: v.patente,
          marca: v.marca,
          modelo: v.modelo,
          anio: v.anio,
          tasacion_fiscal: v.tasacionFiscal,
          prt_status: v.prtStatus,
          last_updated_at: result.timestamp.slice(0, 10),
        })),
      }
    : null;

  return (
    <div>
      {/* Search panel */}
      <div className="rounded-lg card-border bg-base-850/70 p-6">
        <label className="block text-sm font-medium text-base-200 mb-2">
          Ingresar RUT de prueba para enriquecimiento
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            placeholder="Ej: 15.432.890-K"
            className="flex-1 rounded-lg bg-base-900 border border-base-600 px-4 py-3 text-sm font-mono text-base-100 placeholder:text-base-500 focus:outline-none focus:border-amber/60 focus:ring-1 focus:ring-amber/40 transition-colors"
          />
          <select className="rounded-lg bg-base-900 border border-base-600 px-3 py-3 text-sm font-mono text-base-300 focus:outline-none focus:border-amber/60">
            <option>Sandbox Mode / Data Quality Enriched</option>
          </select>
          <button
            onClick={handleRun}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber px-5 py-3 text-sm font-semibold text-base-950 hover:bg-amber-bright transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap glow"
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Consultando
              </>
            ) : (
              "Ejecutar Consulta API (Live Feed)"
            )}
          </button>
        </div>
      </div>

      {/* Split screen results */}
      {result && jsonPayload && !loading && (
        <div className="mt-6 grid lg:grid-cols-2 gap-5 animate-fade-up">
          {/* JSON viewer */}
          <div className="rounded-lg border border-base-700 bg-base-900/80 overflow-hidden">
            <div className="border-b border-base-700 bg-base-850 px-4 py-2.5 flex items-center justify-between">
              <span className="text-[11px] font-mono text-base-400">
                POST /v1/vehicle/enrich-by-rut
              </span>
              <span className="text-[11px] font-mono text-ok">200 OK</span>
            </div>
            <pre className="p-5 font-mono text-[12.5px] leading-6 overflow-x-auto scrollbar-thin text-base-300">
{JSON.stringify(jsonPayload, null, 2)
  .split("\n")
  .map((line) => line)
  .join("\n")}
            </pre>
          </div>

          {/* Executive UI card */}
          <div className="space-y-4">
            <div className="rounded-lg card-border bg-base-850/70 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wide text-base-500">
                    Propietario
                  </p>
                  <p className="mt-1 text-sm font-mono text-base-100">{result.rutMasked}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-ok bg-ok/10 border border-ok/25 rounded-sm px-2 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" />
                  Data Fresca &middot; &lt; 24 hrs
                </span>
              </div>
              <p className="mt-3 text-sm text-base-400">
                {result.vehicles.length} vehículo{result.vehicles.length > 1 ? "s" : ""} asociado
                {result.vehicles.length > 1 ? "s" : ""} &middot; Quality score{" "}
                <span className="text-ok font-mono">{result.quality.toFixed(1)}%</span>
              </p>
            </div>

            {result.vehicles.map((v) => (
              <div key={v.patente} className="rounded-lg card-border bg-base-850/70 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold uppercase tracking-tight text-base text-base-50">
                    {v.marca} {v.modelo}
                  </h3>
                  <span className="text-xs font-mono text-base-400">{v.patente}</span>
                </div>
                <p className="mt-1 text-sm text-base-400">Año {v.anio}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={`text-[11px] font-mono rounded-sm px-2.5 py-1 border ${
                      v.prtStatus === "VIGENTE"
                        ? "text-ok bg-ok/10 border-ok/25"
                        : "text-amber-bright bg-amber/10 border-amber/25"
                    }`}
                  >
                    PRT {v.prtStatus}
                  </span>
                  <span className="text-[11px] font-mono rounded-sm px-2.5 py-1 border text-policy bg-policy/[0.08] border-policy/25">
                    Tasación Actualizada
                  </span>
                </div>

                <p className="mt-3 text-sm text-base-100 font-mono tabular-nums">
                  ${formatCLP(v.tasacionFiscal)}{" "}
                  <span className="text-xs text-base-500 font-sans">tasación fiscal</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
