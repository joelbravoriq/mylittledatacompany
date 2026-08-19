"use client";

import { useEffect, useState } from "react";

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function fmt(d: Date) {
  return d.toISOString().replace("T", " ").slice(0, 19) + " UTC";
}

const jsonLines = (timestamp: string) => [
  { k: `"marca"`, v: `"Toyota"`, c: "text-base-100" },
  { k: `"modelo"`, v: `"Corolla Cross Hybrid"`, c: "text-base-100" },
  { k: `"anio"`, v: `2024`, c: "text-base-100", raw: true },
  { k: `"riesgo_siniestro_score"`, v: `0.132`, c: "text-ok", raw: true },
  { k: `"segmento_propenso_seguro"`, v: `"alto"`, c: "text-amber-bright" },
  { k: `"data_freshness"`, v: `"2h ago"`, c: "text-ok", bold: true },
  { k: `"data_quality_score"`, v: `99.8`, c: "text-ok", bold: true, raw: true },
  { k: `"compliance_certified"`, v: `true`, c: "text-ok", bold: true, raw: true },
  { k: `"ley_21719_alineado"`, v: `true`, c: "text-ok", raw: true },
  { k: `"source"`, v: `"snowflake_data_share::mldc_vehicle_live"`, c: "text-base-400" },
  { k: `"last_sync"`, v: `"${timestamp}"`, c: "text-base-400" },
];

export default function Hero() {
  const now = useNow();
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!now) return;
    setVisibleLines(0);
    const total = jsonLines(fmt(now)).length;
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setVisibleLines(i);
      if (i >= total) clearInterval(t);
    }, 70);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now?.getMinutes()]);

  const lines = now ? jsonLines(fmt(now)) : [];

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-40 pb-24 sm:pt-48 sm:pb-32"
    >
      <div className="absolute inset-0 bg-grid bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[560px] w-[560px] rounded-full bg-amber/[0.06] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-sm border border-base-600 bg-base-800/60 px-3 py-1 text-xs font-mono text-base-300 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" />
              SLA de frescura de datos sub-24h
            </div>

            <h1
              spellCheck={false}
              className="font-display font-semibold uppercase tracking-tight text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.03] text-base-50"
            >
              Datos externos frescos,{" "}
              <span className="text-gradient">no una vez al año.</span>
            </h1>

            <p className="mt-6 text-lg text-base-300 leading-relaxed max-w-xl">
              Olvídate de tablas desactualizadas. Enriquecemos tus modelos y
              procesos con feeds vivos de un catálogo multi-fuente —vehicular,
              financiero, territorial— vía{" "}
              <span className="text-base-100">API REST</span> y{" "}
              <span className="text-base-100">Snowflake Data Sharing</span>,
              100% alineados con la Ley de Protección de Datos Personales.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <a
                href="#poc"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-amber px-5 py-3 text-sm font-semibold text-base-950 hover:bg-amber-bright transition-colors glow"
              >
                Probar API Demo (PoC)
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <a
                href="#api-daas"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-base-600 bg-base-800/50 px-5 py-3 text-sm font-medium text-base-100 hover:border-base-500 hover:bg-base-800 transition-colors"
              >
                Ver Documentación
              </a>
            </div>

            <div className="mt-12 flex items-center gap-8 text-base-400">
              <div>
                <p className="text-2xl font-semibold text-base-50 font-mono tabular-nums">&lt;24h</p>
                <p className="text-xs mt-0.5">Frescura de datos</p>
              </div>
              <div className="h-8 w-px bg-base-700" />
              <div>
                <p className="text-2xl font-semibold text-base-50 font-mono tabular-nums">99.8%</p>
                <p className="text-xs mt-0.5">Data Quality Score</p>
              </div>
              <div className="h-8 w-px bg-base-700" />
              <div>
                <p className="text-2xl font-semibold text-base-50 font-mono tabular-nums">Ley 21.719</p>
                <p className="text-xs mt-0.5">Compliance nativo</p>
              </div>
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:150ms] opacity-0 [animation-fill-mode:forwards] flex flex-col items-center gap-5">
            {/* Placa patente — objeto central del hero */}
            <div className="w-full max-w-[380px] rounded-[10px] bg-base-50 px-6 py-5 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wide text-base-950/55">
                <span>República de Chile</span>
                <span>Registro Vehicular</span>
              </div>
              <div className="mt-3.5 border-y-2 border-base-950/[0.14] py-2.5 text-center font-display font-semibold text-4xl tracking-[0.12em] text-base-950">
                HJ&middot;RT&middot;42
              </div>
              <div className="mt-3.5 flex items-center justify-between font-mono text-[10.5px] text-base-950/55">
                <span>Consulta API &middot; MLDC</span>
                <span className="text-ok font-semibold">&#9679; ENRIQUECIDO</span>
              </div>
            </div>

            <div className="w-full max-w-[380px] rounded-lg border border-base-700 bg-base-900/80 overflow-hidden">
              <div className="border-b border-base-700 bg-base-850 px-4 py-2.5 flex items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-base-400 truncate">
                  GET /v1/vehicle/enrich
                </span>
                <span className="shrink-0 text-[10px] font-mono uppercase tracking-wide text-base-500">
                  Source 1/6
                </span>
              </div>
              <div className="p-5 font-mono text-[13px] leading-6">
                <p className="text-base-100">{"{"}</p>
                {lines.slice(0, visibleLines).map((line, idx) => (
                  <p key={line.k} className="pl-4">
                    <span className="text-base-500">{line.k}: </span>
                    <span className={`${line.c} ${line.bold ? "font-semibold" : ""}`}>
                      {line.v}
                    </span>
                    {idx < lines.length - 1 ? (
                      <span className="text-base-500">,</span>
                    ) : null}
                  </p>
                ))}
                <p className="text-base-100">
                  {"}"}
                  {visibleLines >= lines.length && (
                    <span className="inline-block w-2 h-4 bg-amber ml-1 align-middle animate-blink" />
                  )}
                </p>
              </div>
              <div className="border-t border-base-700 bg-base-850 px-4 py-2.5 flex items-center justify-between">
                <span className="text-[11px] font-mono text-base-400">
                  status: <span className="text-ok">200 OK</span>
                </span>
                <span className="text-[11px] font-mono text-base-400">
                  latency: <span className="text-base-200">142ms</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
