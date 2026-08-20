-- MLDC — Esquema Supabase/PostgreSQL para "Tasación Fiscal de Vehículos" (SII)
-- Fuente: sii.cl/servicios_online/1049-2612.html (Subdirección de Avaluaciones,
-- Departamento de Tasaciones), archivos Excel/ZIP publicados anualmente para
-- descarga masiva, sin login ni CAPTCHA. Verificado contra el archivo real
-- liv2026.xlsx (81.697 filas, esquema confirmado).
--
-- Nota de alcance importante: esta es una tabla de referencia MODELO/AÑO -> VALOR.
-- NO vincula un vehículo específico (patente) a un propietario (RUT). No existe
-- hoy una fuente pública bulk lícita en Chile que haga ese vínculo — ver
-- pipelines/README.md, sección "Qué NO resuelve este dataset".

create table if not exists public.mldc_vehicle_valuations (
  id                    bigserial primary key,
  sii_code              varchar(20) not null,       -- "Código SII", identifica el modelo/versión
  model_year            smallint not null,           -- "Año"
  vehicle_type          varchar(50) not null,         -- "Tipo": Cabriolet, Sedán, SUV, etc.
  brand                 varchar(100) not null,        -- "Marca"
  model                 varchar(150) not null,        -- "Modelo"
  version               varchar(250),                 -- "Versión"
  doors                 smallint,                     -- "Puertas"
  displacement_cc       integer,                      -- "Cilindrada (CC)"
  power_hp              numeric(6, 1),                -- "Potencia (HP)"
  fuel_type             varchar(50),                  -- "Combustible"
  transmission          varchar(50),                  -- "Transmisión"
  gears                 smallint,                     -- "Marchas"
  drivetrain            varchar(30),                  -- "Tracción"
  country               varchar(100),                 -- "País" de origen/ensamblaje
  equipment             text,                         -- "Equipamiento" (siglas separadas por coma)
  fiscal_valuation_clp  bigint not null,               -- "Tasación {año}" en CLP
  permit_fee_clp        bigint,                       -- "Permiso {año}" en CLP (base permiso circulación)
  is_heavy_vehicle       boolean not null default false, -- true = viene del archivo "pesados" (pes*.xlsx)
  source_year           smallint not null,             -- año de la tabla de origen (ej. 2026)
  source_origin         varchar(150) not null default 'SII_TASACION_FISCAL_VEHICULOS',
  ingested_at           timestamptz not null default now()
);

comment on table public.mldc_vehicle_valuations is
  'Tabla de referencia modelo/año -> tasación fiscal SII. NO vincula a patente ni RUT de propietario. Fuente bulk publica: sii.cl/servicios_online/1049-2612.html.';

-- Único por (sii_code, model_year, source_year, is_heavy_vehicle): el mismo
-- código+año puede repetirse entre archivos de años de publicación distintos
-- (ej. tasación 2025 vs 2026 del mismo modelo), y por eso NO usamos sii_code
-- solo como llave — necesitamos poder tener el histórico de tasaciones.
create unique index if not exists mldc_vehicle_valuations_uk
  on public.mldc_vehicle_valuations (sii_code, model_year, source_year, is_heavy_vehicle);

create index if not exists mldc_vehicle_valuations_brand_idx on public.mldc_vehicle_valuations (brand);
create index if not exists mldc_vehicle_valuations_model_idx on public.mldc_vehicle_valuations (brand, model);
create index if not exists mldc_vehicle_valuations_year_idx on public.mldc_vehicle_valuations (model_year);

alter table public.mldc_vehicle_valuations enable row level security;

drop policy if exists "anon read vehicle valuations" on public.mldc_vehicle_valuations;
create policy "anon read vehicle valuations"
  on public.mldc_vehicle_valuations for select
  using (true);

drop policy if exists "service role write vehicle valuations" on public.mldc_vehicle_valuations;
create policy "service role write vehicle valuations"
  on public.mldc_vehicle_valuations for insert
  with check (auth.role() = 'service_role');

drop policy if exists "service role update vehicle valuations" on public.mldc_vehicle_valuations;
create policy "service role update vehicle valuations"
  on public.mldc_vehicle_valuations for update
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
