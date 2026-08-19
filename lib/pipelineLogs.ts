import { supabase } from "./supabase";

export type PipelineLog = {
  id: string;
  data_source_name: string;
  client_id: string | null;
  status: "OK" | "WARNING" | "ERROR";
  records_processed: number;
  records_upserted: number;
  data_quality_score: number | null;
  execution_time_ms: number | null;
  error_message: string | null;
  created_at: string;
};

/**
 * Trae la corrida más reciente por data_source_name (una fila por fuente).
 * Usado por la consola /console para el health check general.
 */
export async function getLatestPipelineRuns(): Promise<PipelineLog[]> {
  const { data, error } = await supabase
    .from("mldc_pipeline_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;

  const latestBySource = new Map<string, PipelineLog>();
  for (const log of data ?? []) {
    if (!latestBySource.has(log.data_source_name)) {
      latestBySource.set(log.data_source_name, log);
    }
  }
  return Array.from(latestBySource.values());
}

/**
 * Trae el historial de corridas de una fuente específica, para el detalle
 * de una tarjeta en /console/sources o /console/clients.
 */
export async function getPipelineRunHistory(
  dataSourceName: string,
  limit = 20
): Promise<PipelineLog[]> {
  const { data, error } = await supabase
    .from("mldc_pipeline_logs")
    .select("*")
    .eq("data_source_name", dataSourceName)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
