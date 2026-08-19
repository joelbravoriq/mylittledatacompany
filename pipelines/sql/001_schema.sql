-- MLDC — Esquema Supabase/PostgreSQL para el dataset "Registro de Empresas y Sociedades"
-- Fuente: datos.gob.cl (Ministerio de Economía), licencia Creative Commons Attribution.
-- https://datos.gob.cl/dataset/registro-de-empresas-y-sociedades
--
-- Nota de alcance: este dataset cubre PERSONAS JURÍDICAS (empresas) constituidas bajo el
-- régimen simplificado (Ley 20.659, "Tu Empresa en un Día"), no personas naturales.
-- No requiere las columnas de derechos ARCO / opt-out que aplican a datos de individuos.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- A. Tabla maestra: empresas constituidas
-- ---------------------------------------------------------------------------
create table if not exists public.mldc_companies (
  id                    bigint primary key,               -- ID original del Registro (columna "ID")
  rut                   bigint not null,                   -- RUT de la empresa sin DV
  dv                    varchar(1) not null,                -- Dígito verificador (Módulo 11)
  rut_formatted         varchar(20) not null,               -- "77.877.779-7"
  legal_name            varchar(300) not null,              -- "Razon Social", normalizado
  company_type          varchar(10) not null,               -- Codigo de sociedad: SpA, SRL, EIRL, SA, ...
  action_type           varchar(50) not null,               -- Tipo de actuacion: CONSTITUCIÓN, etc.
  capital_clp           numeric(18, 2),                     -- Capital declarado en CLP
  commune_tax           varchar(100),                       -- Comuna Tributaria
  region_tax_code       smallint,                           -- Region Tributaria (codigo 1-16)
  commune_social        varchar(100),                       -- Comuna Social
  region_social_code     smallint,                           -- Region Social (codigo 1-16)
  filed_at              date,                               -- Fecha de actuacion (1era firma)
  registered_at         date,                               -- Fecha de registro (ultima firma)
  sii_approved_at        date,                               -- Fecha de aprobacion x SII
  source_year           smallint not null,                  -- Anio del archivo de origen
  quality_score         numeric(3, 2) not null default 1.00,
  source_origin         varchar(150) not null default 'DATOS_GOB_CL_REGISTRO_EMPRESAS_SOCIEDADES',
  ingested_at           timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

comment on table public.mldc_companies is
  'Empresas constituidas via regimen simplificado (Ley 20.659). Fuente publica CC-BY: datos.gob.cl.';

create unique index if not exists mldc_companies_rut_uk on public.mldc_companies (rut);
create index if not exists mldc_companies_rut_btree on public.mldc_companies using btree (rut);
create index if not exists mldc_companies_commune_idx on public.mldc_companies (commune_tax);
create index if not exists mldc_companies_type_idx on public.mldc_companies (company_type);

-- ---------------------------------------------------------------------------
-- B. Logs de observabilidad del pipeline (alimenta /console/clients y /console)
-- ---------------------------------------------------------------------------
create table if not exists public.mldc_pipeline_logs (
  id                    uuid primary key default gen_random_uuid(),
  data_source_name      varchar(150) not null,   -- 'Registro de Empresas y Sociedades (SpA/SRL/EIRL)'
  client_id             varchar(50),             -- nullable: log de ingesta general, no atado a 1 cliente
  status                varchar(10) not null check (status in ('OK', 'WARNING', 'ERROR')),
  records_processed     integer not null default 0,
  records_upserted      integer not null default 0,
  data_quality_score    numeric(3, 2),
  execution_time_ms     integer,
  error_message         text,
  created_at            timestamptz not null default now()
);

comment on table public.mldc_pipeline_logs is
  'Un registro por corrida del pipeline de ingesta. Consumido por la consola /console.';

create index if not exists mldc_pipeline_logs_created_idx on public.mldc_pipeline_logs (created_at desc);
create index if not exists mldc_pipeline_logs_source_idx on public.mldc_pipeline_logs (data_source_name);

-- ---------------------------------------------------------------------------
-- Row Level Security: lectura via anon key solo para logs (frontend), tabla de
-- empresas queda restringida a service_role (el pipeline y el backend admin).
-- ---------------------------------------------------------------------------
alter table public.mldc_companies enable row level security;
alter table public.mldc_pipeline_logs enable row level security;

drop policy if exists "service role full access companies" on public.mldc_companies;
create policy "service role full access companies"
  on public.mldc_companies for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "anon read pipeline logs" on public.mldc_pipeline_logs;
create policy "anon read pipeline logs"
  on public.mldc_pipeline_logs for select
  using (true);

drop policy if exists "service role write pipeline logs" on public.mldc_pipeline_logs;
create policy "service role write pipeline logs"
  on public.mldc_pipeline_logs for insert
  with check (auth.role() = 'service_role');
