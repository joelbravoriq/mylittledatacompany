# Pipeline de ingesta — Registro de Empresas y Sociedades

Ingesta el primer dataset real de MLDC: empresas constituidas bajo el régimen
simplificado (Ley 20.659), publicadas por el Ministerio de Economía en
[datos.gob.cl](https://datos.gob.cl/dataset/registro-de-empresas-y-sociedades)
bajo licencia **Creative Commons Attribution**.

> Nota de alcance: este dataset cubre **personas jurídicas** (empresas), no
> personas naturales. No requiere tratamiento bajo el régimen de datos
> personales sensibles de la Ley 21.719 en el mismo grado que un dataset de
> individuos, pero igual se registra `source_origin` y `quality_score` por
> fila para trazabilidad y auditoría.

## 1. Setup

```bash
cd pipelines
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Crea `pipelines/.env` (no se commitea, ver `.gitignore` en la raíz) con:

```
SUPABASE_URL=https://<tu-proyecto>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

La **service role key** es necesaria porque el pipeline escribe (`upsert`).
Nunca la uses en el frontend — el frontend usa la `anon key` de solo lectura
(ver `lib/supabase.ts` en la raíz del proyecto Next.js).

## 2. Crear el esquema en Supabase

En el SQL Editor de tu proyecto Supabase, ejecuta:

```
sql/001_schema.sql
```

Crea las tablas `mldc_companies` (dataset) y `mldc_pipeline_logs`
(observabilidad, consumida por `/console` y `/console/clients`), con Row
Level Security habilitado.

## 3. Correr el pipeline

```bash
# Corrida de prueba (solo 5.000 filas, rápido)
python servel_ingestion.py --year 2024 --limit 5000

# Corrida completa (~165.000 filas para 2024)
python servel_ingestion.py --year 2024
```

Al finalizar, el script inserta automáticamente una fila en
`mldc_pipeline_logs` con `status`, `records_processed`, `records_upserted`,
`data_quality_score` y `execution_time_ms` — visible desde la consola web
vía `lib/pipelineLogs.ts`.

## 4. Agregar más años

`DATASET_URLS` en `servel_ingestion.py` solo tiene registrado 2024. Para
sumar otro año, busca el recurso correspondiente en la
[dataset page](https://datos.gob.cl/dataset/registro-de-empresas-y-sociedades)
y agrega su URL de descarga directa al diccionario.
