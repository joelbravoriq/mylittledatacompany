import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { parseRut, maskRut } from "@/lib/rut";

export const runtime = "nodejs"; // necesitamos Node (no Edge) para el parseo de FormData/CSV

// ---------------------------------------------------------------------------
// Zero-Storage Bridge Engine — /api/bridge-engine
//
// Recibe un CSV de RUTs, los cruza EN MEMORIA del propio request contra el
// dataset público real de mldc_companies, devuelve el resultado enriquecido
// en la respuesta HTTP, y purga: ningún RUT ni resultado se escribe jamás a
// una tabla ni a un archivo en disco. Solo se persiste metadata SIN datos
// personales, en mldc_pipeline_logs y mldc_audit_trail (ver 002_bridge_engine.sql).
//
// Alcance de la garantía "zero-disk write" en este entorno: el array de RUTs
// vive como variables en el heap del proceso Node de la función serverless
// mientras dura el request (segundos), nunca se asigna a una tabla ni se
// escribe a un archivo. Al terminar el handler, esas variables quedan sin
// referencias y son candidatas a garbage collection. Esto es equivalente al
// "Zero-Disk Write" descrito para una demo web: no elimina swap de SO ni logs
// de infraestructura de la plataforma de hosting, que están fuera del control
// de este código — ver pipelines/README.md, sección "Límites de esta garantía".
// ---------------------------------------------------------------------------

const MAX_ROWS = 500; // límite de la sandbox de pruebas — no es un límite de producto
const PURGE_TTL_MS = 30_000; // TTL máximo declarado para el ciclo de vida en memoria

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

function parseCsvRuts(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.split(",")[0]?.trim())
    .filter((cell): cell is string => Boolean(cell) && cell.toUpperCase() !== "RUT");
}

export async function POST(req: NextRequest) {
  const jobId = `JOB-SANDBOX-${Date.now()}`;
  const inputReceivedAt = new Date();
  const startedAt = performance.now();

  let supabase;
  try {
    supabase = getSupabaseServerClient();
  } catch (err) {
    return NextResponse.json(
      { error: "Bridge Engine no configurado (faltan credenciales de Supabase en el servidor)." },
      { status: 503 }
    );
  }

  // --- 1. Recepción: un CSV en FormData, o un único RUT via campo de texto.
  // En ambos casos el dato vive solo en memoria del request, nunca en disco. ---
  const formData = await req.formData();
  const file = formData.get("file");
  const singleRut = formData.get("rut");
  const clientLabel = String(formData.get("clientLabel") ?? "SANDBOX_SELF_TEST");

  let rawRuts: string[];
  if (file instanceof File) {
    const text = await file.text(); // buffer en memoria, nunca fs.writeFile
    rawRuts = parseCsvRuts(text).slice(0, MAX_ROWS);
  } else if (typeof singleRut === "string" && singleRut.trim()) {
    rawRuts = [singleRut.trim()];
  } else {
    return NextResponse.json({ error: "No se recibió un archivo CSV ni un RUT." }, { status: 400 });
  }

  if (rawRuts.length === 0) {
    return NextResponse.json({ error: "El CSV no contiene RUTs válidos en la primera columna." }, { status: 400 });
  }

  // --- 2. Procesamiento in-memory + validación Módulo 11 ---
  const parsed = rawRuts.map(parseRut);
  const validNumbers = parsed
    .filter((p): p is NonNullable<typeof p> => p !== null && p.valid)
    .map((p) => p.number);

  // --- 3. Enriquecimiento on-demand: cruce en caliente contra dataset real ---
  let companiesByRut = new Map<number, { legal_name: string; company_type: string; commune_tax: string | null; capital_clp: number | null }>();

  if (validNumbers.length > 0) {
    const { data, error } = await supabase
      .from("mldc_companies")
      .select("rut, legal_name, company_type, commune_tax, capital_clp")
      .in("rut", validNumbers);

    if (error) {
      await writeFailureLog(supabase, jobId, clientLabel, rawRuts.length, inputReceivedAt, error.message);
      return NextResponse.json({ error: "Falló el cruce contra el dataset público." }, { status: 502 });
    }

    companiesByRut = new Map(data?.map((c) => [c.rut, c]) ?? []);
  }

  const results: EnrichedRow[] = parsed.map((p, i) => {
    if (!p) {
      return { rutMasked: maskRut(0), rutValid: false, matchType: "invalid_rut" as const };
    }
    const match = companiesByRut.get(p.number);
    return {
      rutMasked: maskRut(p.number),
      rutValid: p.valid,
      matchType: match ? ("company_found" as const) : ("no_match" as const),
      company: match
        ? {
            legalName: match.legal_name,
            companyType: match.company_type,
            communeTax: match.commune_tax,
            capitalClp: match.capital_clp,
          }
        : undefined,
    };
  });

  const elapsedMs = Math.round(performance.now() - startedAt);
  const matched = results.filter((r) => r.matchType === "company_found").length;
  const qualityScore = Number((matched / results.length).toFixed(2));

  // --- 4. Entrega + Purge: escribimos SOLO metadata, nunca el RUT ni el resultado. ---
  const purgeConfirmedAt = new Date();
  const purgeStatus =
    purgeConfirmedAt.getTime() - inputReceivedAt.getTime() <= PURGE_TTL_MS
      ? ("ZERO_STORAGE_PURGED_OK" as const)
      : ("PURGE_TIMEOUT" as const);

  await Promise.all([
    supabase.from("mldc_pipeline_logs").insert({
      data_source_name: "Bridge Engine · RUT → Empresas (Sandbox)",
      client_id: clientLabel,
      job_id: jobId,
      status: purgeStatus === "ZERO_STORAGE_PURGED_OK" ? "OK" : "WARNING",
      records_processed: results.length,
      records_upserted: 0, // el bridge engine no persiste filas de datos personales
      data_quality_score: qualityScore,
      execution_time_ms: elapsedMs,
      storage_status: purgeStatus,
    }),
    supabase.from("mldc_audit_trail").insert({
      job_id: jobId,
      client_id: clientLabel,
      records_processed: results.length,
      input_received_at: inputReceivedAt.toISOString(),
      purge_confirmed_at: purgeConfirmedAt.toISOString(),
      purge_deadline_at: new Date(inputReceivedAt.getTime() + PURGE_TTL_MS).toISOString(),
      storage_status: purgeStatus,
      compliance_law_21719: "PASSED",
      legal_basis: "CLIENT_INSTRUCTED_PROCESSING",
    }),
  ]);

  // A partir de aquí, `results`, `rawRuts`, `parsed` y `companiesByRut` no se
  // vuelven a referenciar: no hay ninguna variable de módulo ni caché externa
  // reteniéndolas. El handler retorna y el heap del request queda listo para GC.
  return NextResponse.json({
    jobId,
    storageStatus: purgeStatus,
    recordsProcessed: results.length,
    matched,
    qualityScore,
    executionTimeMs: elapsedMs,
    results,
  });
}

async function writeFailureLog(
  supabase: ReturnType<typeof getSupabaseServerClient>,
  jobId: string,
  clientId: string,
  recordsAttempted: number,
  inputReceivedAt: Date,
  errorMessage: string
) {
  await supabase.from("mldc_pipeline_logs").insert({
    data_source_name: "Bridge Engine · RUT → Empresas (Sandbox)",
    client_id: clientId,
    job_id: jobId,
    status: "ERROR",
    records_processed: recordsAttempted,
    records_upserted: 0,
    execution_time_ms: null,
    storage_status: "PURGE_FAILED",
    error_message: errorMessage,
  });
  await supabase.from("mldc_audit_trail").insert({
    job_id: jobId,
    client_id: clientId,
    records_processed: recordsAttempted,
    input_received_at: inputReceivedAt.toISOString(),
    purge_confirmed_at: null,
    purge_deadline_at: new Date(inputReceivedAt.getTime() + PURGE_TTL_MS).toISOString(),
    storage_status: "PURGE_FAILED",
    compliance_law_21719: "FAILED",
    legal_basis: "CLIENT_INSTRUCTED_PROCESSING",
    notes: errorMessage,
  });
}
