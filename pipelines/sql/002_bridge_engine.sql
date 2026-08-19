-- MLDC — Bridge Engine (Zero-Storage Transactional DaaS)
--
-- Cambio de paradigma respecto a 001_schema.sql: MLDC deja de construir un
-- directorio propio de personas naturales. En su lugar, opera como capa de
-- procesamiento en vuelo: el cliente B2B envía RUTs bajo su propia base de
-- licitud, MLDC los cruza en memoria contra fuentes públicas y devuelve el
-- resultado sin persistir el RUT ni el dataset enriquecido en ninguna tabla.
--
-- Lo único que se persiste es metadata operacional/legal SIN datos personales:
--   - mldc_pipeline_logs: ya existía (001), se le agregan columnas de job/purge.
--   - mldc_audit_trail: NUEVA. Un evento por job, con foco compliance/legal
--     (evidencia de que el purge ocurrió), separado de los logs técnicos
--     porque su política de retención y su consumidor son distintos: los
--     logs los lee /console para observabilidad operativa; el audit trail
--     lo lee (o exporta) el oficial de compliance ante una auditoría de la
--     Agencia de Protección de Datos, y debe conservarse más tiempo que un
--     log operacional cualquiera.

-- ---------------------------------------------------------------------------
-- A. Extender mldc_pipeline_logs con trazabilidad de job y estado de purge
-- ---------------------------------------------------------------------------
alter table public.mldc_pipeline_logs
  add column if not exists job_id varchar(80),
  add column if not exists storage_status varchar(30)
    not null default 'NOT_APPLICABLE'
    check (storage_status in (
      'NOT_APPLICABLE',        -- corridas de ingesta de dataset propio (ej. 001), no aplica purge
      'ZERO_STORAGE_PURGED_OK',-- bridge engine: purge confirmado
      'PURGE_FAILED',          -- purge no pudo confirmarse: requiere alerta inmediata
      'PURGE_TIMEOUT'          -- el job excedió el tiempo máximo de vida en memoria
    ));

create index if not exists mldc_pipeline_logs_job_idx on public.mldc_pipeline_logs (job_id);

-- ---------------------------------------------------------------------------
-- B. Tabla de auditoría de compliance — un evento por job del Bridge Engine
-- ---------------------------------------------------------------------------
create table if not exists public.mldc_audit_trail (
  id                    uuid primary key default gen_random_uuid(),
  job_id                varchar(80) not null,
  client_id             varchar(50) not null,
  records_processed     integer not null default 0,
  input_received_at     timestamptz not null,
  purge_confirmed_at    timestamptz,               -- null hasta que el purge se confirme
  purge_deadline_at     timestamptz not null,       -- input_received_at + TTL máximo permitido
  storage_status        varchar(30) not null
    check (storage_status in (
      'ZERO_STORAGE_PURGED_OK',
      'PURGE_FAILED',
      'PURGE_TIMEOUT'
    )),
  compliance_law_21719  varchar(10) not null default 'PASSED'
    check (compliance_law_21719 in ('PASSED', 'FAILED')),
  legal_basis           varchar(50) not null default 'CLIENT_INSTRUCTED_PROCESSING',
  notes                 text,
  created_at            timestamptz not null default now()
);

comment on table public.mldc_audit_trail is
  'Evidencia de compliance por job del Bridge Engine: NUNCA contiene RUTs ni '
  'datos personales, solo metadata de que el ciclo ingesta->purge se cumplio. '
  'Retencion sugerida: minimo el plazo de prescripcion aplicable a auditorias '
  'de la Ley 21.719 (definir con asesoria legal antes de operar con clientes reales).';

create index if not exists mldc_audit_trail_job_idx on public.mldc_audit_trail (job_id);
create index if not exists mldc_audit_trail_client_idx on public.mldc_audit_trail (client_id);
create index if not exists mldc_audit_trail_created_idx on public.mldc_audit_trail (created_at desc);

-- Constraint de integridad: si el purge se confirmó, el timestamp debe existir;
-- si falló o hizo timeout, no puede haber timestamp de confirmación.
alter table public.mldc_audit_trail drop constraint if exists purge_confirmation_consistency;
alter table public.mldc_audit_trail add constraint purge_confirmation_consistency
  check (
    (storage_status = 'ZERO_STORAGE_PURGED_OK' and purge_confirmed_at is not null)
    or
    (storage_status <> 'ZERO_STORAGE_PURGED_OK' and purge_confirmed_at is null)
  );

-- ---------------------------------------------------------------------------
-- RLS: mismo criterio que 001 — lectura pública para consola, escritura solo
-- desde el backend (service_role). El audit trail nunca se escribe desde el
-- navegador: siempre lo cierra el propio Bridge Engine server-side.
-- ---------------------------------------------------------------------------
alter table public.mldc_audit_trail enable row level security;

drop policy if exists "anon read audit trail" on public.mldc_audit_trail;
create policy "anon read audit trail"
  on public.mldc_audit_trail for select
  using (true);

drop policy if exists "service role write audit trail" on public.mldc_audit_trail;
create policy "service role write audit trail"
  on public.mldc_audit_trail for insert
  with check (auth.role() = 'service_role');
