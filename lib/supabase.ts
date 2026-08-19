import { createClient } from "@supabase/supabase-js";

// Cliente de solo-lectura para el frontend. Usa la anon key (nunca la
// service_role key, que solo debe vivir server-side en el pipeline Python
// y está protegida por Row Level Security en la tabla mldc_companies).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
