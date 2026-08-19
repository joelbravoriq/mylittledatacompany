import "server-only";
import { createClient } from "@supabase/supabase-js";

// Cliente server-side con service_role key. Usado únicamente dentro de
// app/api/** (Route Handlers), NUNCA importado desde un Client Component —
// el import "server-only" de arriba rompe el build si eso llegara a pasar,
// para que la service_role key no termine en el bundle del navegador.
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  if (!url || !serviceKey) {
    throw new Error(
      "Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en las variables de entorno del servidor."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
