"""
MLDC — Pipeline de ingesta: Registro de Empresas y Sociedades (datos.gob.cl)

Fuente oficial y de uso lícito:
  https://datos.gob.cl/dataset/registro-de-empresas-y-sociedades
  Publicado por el Ministerio de Economía. Licencia Creative Commons Attribution.
  Cubre personas jurídicas (empresas) constituidas bajo el régimen simplificado
  (Ley 20.659, "Tu Empresa en un Día"). No contiene datos de personas naturales.

Requisitos:
  pip install requests pandas supabase python-dotenv

Variables de entorno esperadas (.env, NO commitear):
  SUPABASE_URL=https://<project>.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=<service role key>   # nunca la anon key: este script escribe.

Uso:
  python servel_ingestion.py --year 2024
  python servel_ingestion.py --year 2024 --limit 5000   # corrida de prueba
"""

from __future__ import annotations

import argparse
import io
import os
import sys
import time
from dataclasses import dataclass

import pandas as pd
import requests
from dotenv import load_dotenv
from supabase import Client, create_client

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

# Obtenidas via la API de CKAN del portal (package_show?id=registro-de-empresas-y-sociedades),
# no adivinadas: cada recurso tiene un UUID propio por año que no sigue un patrón predecible.
DATASET_URLS = {
    2013: "https://datos.gob.cl/dataset/363edd60-4919-4ff1-b85f-f8e14d61285a/resource/fd2b91b0-eb8e-45f1-98d0-1f3316bb6468/download/2013-sociedades-por-fecha-rut-constitucion.csv",
    2014: "https://datos.gob.cl/dataset/363edd60-4919-4ff1-b85f-f8e14d61285a/resource/ba5d9b2a-c292-45f5-9767-93420c62529e/download/2014-sociedades-por-fecha-rut-constitucion.csv",
    2015: "https://datos.gob.cl/dataset/363edd60-4919-4ff1-b85f-f8e14d61285a/resource/6ffd416f-376f-40a8-9537-0d739f29fac9/download/2015-sociedades-por-fecha-rut-constitucion.csv",
    2016: "https://datos.gob.cl/dataset/363edd60-4919-4ff1-b85f-f8e14d61285a/resource/288b0a7d-2d40-4c59-a312-2cc562cfe4eb/download/2016-sociedades-por-fecha-rut-constitucion_v3.csv",
    2017: "https://datos.gob.cl/dataset/363edd60-4919-4ff1-b85f-f8e14d61285a/resource/667eef5c-0896-424b-baf1-d13356d40326/download/2017-sociedades-por-fecha-rut-constitucion.csv",
    2018: "https://datos.gob.cl/dataset/363edd60-4919-4ff1-b85f-f8e14d61285a/resource/ca45026b-4dde-44b0-8725-64446a95f69d/download/2018-sociedades-por-fecha-rut-constitucion-v2.csv",
    2019: "https://datos.gob.cl/dataset/363edd60-4919-4ff1-b85f-f8e14d61285a/resource/0d0d0ffb-fb28-4314-9bf0-8402353c9448/download/2019-sociedades-por-fecha-rut-constitucion-v3.csv",
    2020: "https://datos.gob.cl/dataset/363edd60-4919-4ff1-b85f-f8e14d61285a/resource/1ad6cd82-8859-4601-a993-043009279f45/download/2020-sociedades-por-fecha-rut-constitucion.csv",
    2021: "https://datos.gob.cl/dataset/363edd60-4919-4ff1-b85f-f8e14d61285a/resource/d5c69cb4-2fa8-4e92-906f-34776a30ce59/download/2021-sociedades-por-fecha-rut-constitucion.csv",
    2022: "https://datos.gob.cl/dataset/363edd60-4919-4ff1-b85f-f8e14d61285a/resource/3e286353-146d-47aa-ac42-e2f36e703d1f/download/2022-sociedades-por-fecha-rut-constitucion.csv",
    2023: "https://datos.gob.cl/dataset/363edd60-4919-4ff1-b85f-f8e14d61285a/resource/2fbe5f40-6c3d-42e6-8a84-e6ddce56d888/download/2023-sociedades-por-fecha-rut-constitucion.csv",
    2024: "https://datos.gob.cl/dataset/363edd60-4919-4ff1-b85f-f8e14d61285a/resource/42ee8c8c-59cf-42e4-89af-ec19a87dbf8d/download/2024-sociedades-por-fecha-rut-constitucion.csv",
    2025: "https://datos.gob.cl/dataset/363edd60-4919-4ff1-b85f-f8e14d61285a/resource/71c8e355-226a-461e-809a-870c2275a178/download/2025-sociedades-por-fecha-rut-constitucion.csv",
}

SOURCE_NAME = "Registro de Empresas y Sociedades (SpA/SRL/EIRL)"
SOURCE_ORIGIN = "DATOS_GOB_CL_REGISTRO_EMPRESAS_SOCIEDADES"
REQUEST_TIMEOUT_S = 60
MAX_RETRIES = 3
BATCH_SIZE = 1000

# Columnas del CSV real (separador ';', UTF-8 con BOM), verificadas contra el archivo 2024.
CSV_COLUMNS = [
    "ID",
    "RUT",
    "Razon Social",
    "Fecha de actuacion (1era firma)",
    "Fecha de registro (ultima firma)",
    "Fecha de aprobacion x SII",
    "Anio",
    "Mes",
    "Comuna Tributaria",
    "Region Tributaria",
    "Codigo de sociedad",
    "Tipo de actuacion",
    "Capital",
    "Comuna Social",
    "Region Social",
]


@dataclass
class RunResult:
    status: str  # 'OK' | 'WARNING' | 'ERROR'
    records_processed: int
    records_upserted: int
    quality_score: float
    execution_time_ms: int
    error_message: str | None = None


# ---------------------------------------------------------------------------
# Paso a) Descarga con reintentos
# ---------------------------------------------------------------------------

def download_csv(year: int) -> bytes:
    url = DATASET_URLS.get(year)
    if not url:
        raise ValueError(f"No hay URL registrada para el año {year}. Agrégala en DATASET_URLS.")

    last_error: Exception | None = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = requests.get(url, timeout=REQUEST_TIMEOUT_S)
            resp.raise_for_status()
            return resp.content
        except requests.RequestException as exc:
            last_error = exc
            wait = 2 ** attempt
            print(f"[WARN] Descarga falló (intento {attempt}/{MAX_RETRIES}): {exc}. Reintentando en {wait}s.")
            time.sleep(wait)

    raise RuntimeError(f"No se pudo descargar el dataset tras {MAX_RETRIES} intentos") from last_error


# ---------------------------------------------------------------------------
# Paso b) Módulo 11 — cálculo de dígito verificador chileno
# ---------------------------------------------------------------------------

def compute_dv(rut_number: int) -> str:
    """Calcula el dígito verificador de un RUT chileno usando el algoritmo Módulo 11."""
    reversed_digits = [int(d) for d in str(rut_number)][::-1]
    factors = [2, 3, 4, 5, 6, 7]
    total = 0
    for i, digit in enumerate(reversed_digits):
        total += digit * factors[i % len(factors)]
    remainder = 11 - (total % 11)
    if remainder == 11:
        return "0"
    if remainder == 10:
        return "K"
    return str(remainder)


def format_rut(rut_number: int, dv: str) -> str:
    s = str(rut_number)
    parts = []
    while s:
        parts.insert(0, s[-3:])
        s = s[:-3]
    return f"{'.'.join(parts)}-{dv}"


# ---------------------------------------------------------------------------
# Paso c/d) Parseo, limpieza y normalización
# ---------------------------------------------------------------------------

def parse_and_clean(raw_csv: bytes, limit: int | None = None) -> pd.DataFrame:
    df = pd.read_csv(
        io.BytesIO(raw_csv),
        sep=";",
        encoding="utf-8-sig",
        dtype=str,
    )

    missing = set(CSV_COLUMNS) - set(df.columns)
    if missing:
        raise ValueError(f"El CSV no tiene las columnas esperadas. Faltan: {missing}")

    if limit:
        df = df.head(limit)

    # Renombramos a snake_case explícito de inmediato: evita depender de la
    # posición de columnas (itertuples con nombres tipo "_10") más adelante.
    df = df.rename(
        columns={
            "Comuna Tributaria": "commune_tax_raw",
            "Region Tributaria": "region_tax_raw",
            "Codigo de sociedad": "company_type",
            "Tipo de actuacion": "action_type",
            "Comuna Social": "commune_social_raw",
            "Region Social": "region_social_raw",
        }
    )

    # RUT viene como "77877779-7": separamos número y DV, pero recalculamos el DV
    # con Módulo 11 para dejar constancia de integridad del dato (data quality check).
    rut_split = df["RUT"].str.split("-", n=1, expand=True)
    df["rut_number"] = pd.to_numeric(rut_split[0], errors="coerce")
    df["dv_source"] = rut_split[1].str.upper()

    before = len(df)
    df = df.dropna(subset=["rut_number", "Razon Social"])
    dropped = before - len(df)
    if dropped:
        print(f"[INFO] {dropped} filas descartadas por RUT o Razón Social nulos.")

    df["rut_number"] = df["rut_number"].astype("int64")
    df["dv_calculated"] = df["rut_number"].apply(compute_dv)

    # Data quality: marca si el DV recalculado difiere del DV publicado en la fuente.
    df["dv_mismatch"] = df["dv_calculated"] != df["dv_source"]
    mismatches = int(df["dv_mismatch"].sum())
    if mismatches:
        print(f"[WARN] {mismatches} RUT con DV recalculado distinto al de origen (se usa el recalculado).")

    df["rut_formatted"] = df.apply(
        lambda r: format_rut(r["rut_number"], r["dv_calculated"]), axis=1
    )

    df["legal_name"] = (
        df["Razon Social"].str.strip().str.replace(r"\s+", " ", regex=True).str.upper()
    )

    df["capital_clp"] = pd.to_numeric(df["Capital"], errors="coerce")

    for date_col, out_col in [
        ("Fecha de actuacion (1era firma)", "filed_at"),
        ("Fecha de registro (ultima firma)", "registered_at"),
        ("Fecha de aprobacion x SII", "sii_approved_at"),
    ]:
        df[out_col] = pd.to_datetime(df[date_col], format="%d-%m-%Y", errors="coerce").dt.date.astype(str)

    df["region_tax_code"] = pd.to_numeric(df["region_tax_raw"], errors="coerce")
    df["region_social_code"] = pd.to_numeric(df["region_social_raw"], errors="coerce")

    return df


def to_records(df: pd.DataFrame) -> list[dict]:
    """Convierte el DataFrame limpio a una lista de dicts lista para upsert.

    Usamos to_dict("records") sobre columnas ya renombradas a snake_case en
    parse_and_clean, en vez de itertuples posicional — así un cambio en el
    orden de columnas del CSV de origen no rompe el mapeo silenciosamente.
    """
    out_cols = {
        "ID": "id",
        "rut_number": "rut",
        "dv_calculated": "dv",
        "rut_formatted": "rut_formatted",
        "legal_name": "legal_name",
        "company_type": "company_type",
        "action_type": "action_type",
        "capital_clp": "capital_clp",
        "commune_tax_raw": "commune_tax",
        "region_tax_code": "region_tax_code",
        "commune_social_raw": "commune_social",
        "region_social_code": "region_social_code",
        "filed_at": "filed_at",
        "registered_at": "registered_at",
        "sii_approved_at": "sii_approved_at",
        "Anio": "source_year",
    }
    slim = df[list(out_cols.keys())].rename(columns=out_cols)

    slim["id"] = slim["id"].astype("int64")
    slim["rut"] = slim["rut"].astype("int64")
    slim["source_year"] = slim["source_year"].astype("int64")
    slim["quality_score"] = df["dv_mismatch"].map({True: 0.98, False: 1.00})
    slim["source_origin"] = SOURCE_ORIGIN

    # region_tax_code / region_social_code llegan como float64 (por los NaN que
    # to_numeric produce en filas sin región). Usamos Int64 nullable de pandas
    # para que el upsert mande enteros reales ("7", no "7.0") o None — un
    # smallint de Postgres rechaza "7.0" con error de sintaxis.
    for region_col in ("region_tax_code", "region_social_code"):
        slim[region_col] = slim[region_col].astype("Int64")

    for date_col in ("filed_at", "registered_at", "sii_approved_at"):
        slim[date_col] = slim[date_col].where(slim[date_col] != "NaT", None)

    slim = slim.where(pd.notnull(slim), None)

    # pandas serializa Int64/NA a través de .where() como object; nos aseguramos
    # de que cada valor quede como int nativo de Python o None, nunca float.
    records = slim.to_dict("records")
    for record in records:
        for region_col in ("region_tax_code", "region_social_code"):
            val = record[region_col]
            record[region_col] = None if val is None or pd.isna(val) else int(val)
    return records


# ---------------------------------------------------------------------------
# Paso e) Carga masiva (batch upsert) a Supabase
# ---------------------------------------------------------------------------

def upsert_batches(client: Client, records: list[dict], batch_size: int = BATCH_SIZE) -> int:
    upserted = 0
    for i in range(0, len(records), batch_size):
        batch = records[i : i + batch_size]
        client.table("mldc_companies").upsert(batch, on_conflict="rut").execute()
        upserted += len(batch)
        print(f"[INFO] Upsert {upserted}/{len(records)}")
    return upserted


# ---------------------------------------------------------------------------
# Paso f) Log de observabilidad
# ---------------------------------------------------------------------------

def write_pipeline_log(client: Client, result: RunResult) -> None:
    client.table("mldc_pipeline_logs").insert(
        {
            "data_source_name": SOURCE_NAME,
            "client_id": None,  # ingesta general del catálogo, no atada a un cliente específico
            "status": result.status,
            "records_processed": result.records_processed,
            "records_upserted": result.records_upserted,
            "data_quality_score": result.quality_score,
            "execution_time_ms": result.execution_time_ms,
            "error_message": result.error_message,
        }
    ).execute()


# ---------------------------------------------------------------------------
# Orquestación
# ---------------------------------------------------------------------------

def run(year: int, limit: int | None) -> RunResult:
    started = time.monotonic()
    client = get_supabase_client()

    try:
        raw = download_csv(year)
        df = parse_and_clean(raw, limit=limit)
        records = to_records(df)
        upserted = upsert_batches(client, records)

        avg_quality = round(float(df["quality_score"].mean()) if "quality_score" in df else 1.0, 2)
        elapsed_ms = int((time.monotonic() - started) * 1000)

        status = "OK" if upserted == len(records) else "WARNING"
        result = RunResult(
            status=status,
            records_processed=len(records),
            records_upserted=upserted,
            quality_score=avg_quality,
            execution_time_ms=elapsed_ms,
        )
    except Exception as exc:  # noqa: BLE001 — queremos loguear cualquier falla del pipeline
        elapsed_ms = int((time.monotonic() - started) * 1000)
        result = RunResult(
            status="ERROR",
            records_processed=0,
            records_upserted=0,
            quality_score=0.0,
            execution_time_ms=elapsed_ms,
            error_message=str(exc),
        )
        print(f"[ERROR] Pipeline falló: {exc}", file=sys.stderr)

    write_pipeline_log(client, result)
    return result


def get_supabase_client() -> Client:
    load_dotenv()
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError(
            "Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en el entorno (.env)."
        )
    return create_client(url, key)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--year", type=int, default=2024, help="Año del recurso a ingerir")
    parser.add_argument(
        "--limit", type=int, default=None, help="Límite de filas para corridas de prueba"
    )
    args = parser.parse_args()

    result = run(args.year, args.limit)
    print(f"[DONE] status={result.status} processed={result.records_processed} "
          f"upserted={result.records_upserted} quality={result.quality_score} "
          f"time_ms={result.execution_time_ms}")

    if result.status == "ERROR":
        sys.exit(1)


if __name__ == "__main__":
    main()
