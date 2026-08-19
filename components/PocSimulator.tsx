"use client";

import { useState } from "react";

type SimResult = {
  input: string;
  quality: number;
  freshnessHours: number;
  compliant: boolean;
  fields: number;
};

function hashSeed(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function runSimulation(input: string): SimResult {
  const seed = hashSeed(input || "MLDC-DEFAULT");
  const quality = 97 + (seed % 280) / 100;
  const freshnessHours = 1 + (seed % 20);
  return {
    input: input.trim() || "HJRT-42",
    quality: Math.min(99.9, Number(quality.toFixed(1))),
    freshnessHours,
    compliant: true,
    fields: 14 + (seed % 6),
  };
}

export default function PocSimulator() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimResult | null>(null);

  const handleSimulate = () => {
    if (loading) return;
    setLoading(true);
    setResult(null);
    window.setTimeout(() => {
      setResult(runSimulation(value));
      setLoading(false);
    }, 900);
  };

  return (
    <section id="poc" className="py-24 sm:py-32 border-t border-base-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-mono uppercase tracking-wide text-amber mb-3">Simulador PoC</p>
          <h2 className="font-display font-semibold uppercase tracking-tight text-3xl sm:text-4xl text-base-50">
            Evaluador de Data Quality en vivo
          </h2>
          <p className="mt-4 text-base-300">
            Simula una búsqueda por Patente o RUT sobre el source vehicular
            —el mismo motor de calidad corre en cada uno de nuestros feeds—
            y observa cómo enriquecemos y validamos el dato en tiempo real.
            (Entorno de demostración — no se consultan datos reales de terceros).
          </p>
        </div>

        <div className="mt-12 max-w-xl mx-auto">
          <div className="rounded-lg card-border bg-base-850/70 p-6 sm:p-8">
            <label className="block text-sm font-medium text-base-200 mb-2">
              Patente o RUT
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ej: HJRT-42 o 12.345.678-9"
                className="flex-1 rounded-lg bg-base-900 border border-base-600 px-4 py-3 text-sm font-mono text-base-100 placeholder:text-base-500 focus:outline-none focus:border-amber/60 focus:ring-1 focus:ring-amber/40 transition-colors"
              />
              <button
                onClick={handleSimulate}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber px-5 py-3 text-sm font-semibold text-base-950 hover:bg-amber-bright transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Procesando
                  </>
                ) : (
                  "Simular Enriquecimiento & Quality Check"
                )}
              </button>
            </div>

            {result && !loading && (
              <div className="mt-8 grid sm:grid-cols-3 gap-4 animate-fade-up">
                <div className="rounded-lg border border-base-700 bg-base-900/70 p-4">
                  <p className="text-[11px] font-mono text-base-500 uppercase tracking-wide">
                    Estado del dato
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-ok">
                    <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" />
                    VIVO
                  </p>
                  <p className="mt-1 text-xs text-base-400">
                    hace {result.freshnessHours}h · {result.fields} campos enriquecidos
                  </p>
                </div>

                <div className="rounded-lg border border-base-700 bg-base-900/70 p-4">
                  <p className="text-[11px] font-mono text-base-500 uppercase tracking-wide">
                    Score de calidad
                  </p>
                  <p className="mt-2 text-sm font-semibold text-base-50 font-mono tabular-nums">
                    {result.quality}%
                  </p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-base-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber transition-all duration-700"
                      style={{ width: `${result.quality}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-base-700 bg-base-900/70 p-4">
                  <p className="text-[11px] font-mono text-base-500 uppercase tracking-wide">
                    Cumplimiento legal
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-policy">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Certificado
                  </p>
                  <p className="mt-1 text-xs text-base-400">Ley N° 21.719 / 19.628</p>
                </div>
              </div>
            )}

            {result && !loading && (
              <p className="mt-6 text-center text-xs text-base-500 font-mono">
                target: <span className="text-base-300">{result.input}</span> · fuente: snowflake_data_share::mldc_vehicle_live
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
