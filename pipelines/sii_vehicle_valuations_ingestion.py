"""
MLDC — Pipeline de ingesta: Tasación Fiscal de Vehículos (SII)

Fuente oficial y de uso lícito, bulk, sin login ni CAPTCHA:
  https://www.sii.cl/servicios_online/1049-2612.html
  Subdirección de Avaluaciones, Departamento de Tasaciones.

Nota de alcance: esta tabla mapea MODELO/AÑO -> valor fiscal. No vincula un
vehículo específico (patente) a un propietario (RUT) — esa información no
tiene fuente pública bulk lícita en Chile hoy (ver pipelines/README.md).

Requisitos:
  pip install requests pandas openpyxl supabase python-dotenv

Uso:
  python sii_vehicle_valuations_ingestion.py --year 2026 --category liviano
  python sii_vehicle_valuations_ingestion.py --year 2026 --category pesado
  python sii_vehicle_valuations_ingestion.py --year 2026 --category liviano --limit 2000
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

BASE_URL = "https://www.sii.cl/servicios_online/tasacion_fiscal_vehiculos"
REQUEST_TIMEOUT_S = 60
MAX_RETRIES = 3
BATCH_SIZE = 1000
HEADER_ROW = 11  # fila 0-indexed donde empieza el encabezado real de la tabla

SOURCE_ORIGIN = "SII_TASACION_FISCAL_VEHICULOS"


@dataclass
class RunResult:
    status: str
    records_processed: int
    records_upserted: int
    execution_time_ms: int
    error_message: str | None = None


def build_url(year: int, category: str) -> str:
    prefix = "liv" if category == "liviano" else "pes"
    return f"{BASE_URL}/{prefix}{year}.xlsx"


def download_xlsx(url: str) -> bytes:
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
    raise RuntimeError(f"No se pudo descargar {url} tras {MAX_RETRIES} intentos") from last_error


COLUMN_MAP = {
    "Código SII": "sii_code",
    "Año": "model_year",
    "Tipo": "vehicle_type",
    "Marca": "brand",
    "Modelo": "model",
    "Versión": "version",
    "Puertas": "doors",
    "Cilindrada (CC)": "displacement_cc",
    "Potencia (HP)": "power_hp",
    "Combustible": "fuel_type",
    "Transmisión": "transmission",
    "Marchas": "gears",
    "Tracción": "drivetrain",
    "País": "country",
    "Equipamiento": "equipment",
}


def parse_and_clean(raw_xlsx: bytes, year: int, is_heavy: bool, limit: int | None) -> pd.DataFrame:
    df = pd.read_excel(io.BytesIO(raw_xlsx), header=HEADER_ROW)

    # La columna de tasación/permiso lleva el año en el nombre (ej. "Tasación 2026"):
    # la ubicamos por prefijo en vez de hardcodear el año en el nombre exacto.
    valuation_col = next((c for c in df.columns if str(c).startswith("Tasaci")), None)
    permit_col = next((c for c in df.columns if str(c).startswith("Permiso")), None)
    if valuation_col is None:
        raise ValueError("No se encontró la columna de Tasación en el archivo.")

    missing = set(COLUMN_MAP.keys()) - set(df.columns)
    if missing:
        raise ValueError(f"El archivo no tiene las columnas esperadas. Faltan: {missing}")

    if limit:
        df = df.head(limit)

    df = df.rename(columns=COLUMN_MAP)
    df = df.rename(columns={valuation_col: "fiscal_valuation_clp"})
    if permit_col:
        df = df.rename(columns={permit_col: "permit_fee_clp"})
    else:
        df["permit_fee_clp"] = None

    before = len(df)
    df = df.dropna(subset=["sii_code", "brand", "model", "fiscal_valuation_clp"])
    dropped = before - len(df)
    if dropped:
        print(f"[INFO] {dropped} filas descartadas por campos clave nulos.")

    df["model_year"] = pd.to_numeric(df["model_year"], errors="coerce").astype("Int64")
    df["doors"] = pd.to_numeric(df["doors"], errors="coerce").astype("Int64")
    df["displacement_cc"] = pd.to_numeric(df["displacement_cc"], errors="coerce").astype("Int64")
    df["gears"] = pd.to_numeric(df["gears"], errors="coerce").astype("Int64")
    df["fiscal_valuation_clp"] = pd.to_numeric(df["fiscal_valuation_clp"], errors="coerce").astype("Int64")
    df["permit_fee_clp"] = pd.to_numeric(df["permit_fee_clp"], errors="coerce").astype("Int64")

    df["is_heavy_vehicle"] = is_heavy
    df["source_year"] = year
    df["source_origin"] = SOURCE_ORIGIN

    return df


def to_records(df: pd.DataFrame) -> list[dict]:
    out_cols = [
        "sii_code", "model_year", "vehicle_type", "brand", "model", "version",
        "doors", "displacement_cc", "power_hp", "fuel_type", "transmission",
        "gears", "drivetrain", "country", "equipment",
        "fiscal_valuation_clp", "permit_fee_clp", "is_heavy_vehicle",
        "source_year", "source_origin",
    ]
    slim = df[out_cols].copy()
    slim = slim.where(pd.notnull(slim), None)

    records = slim.to_dict("records")
    int_cols = ["model_year", "doors", "displacement_cc", "gears", "fiscal_valuation_clp", "permit_fee_clp"]
    float_cols = ["power_hp"]
    for record in records:
        for col in int_cols:
            val = record[col]
            record[col] = None if val is None or pd.isna(val) else int(val)
        for col in float_cols:
            val = record[col]
            record[col] = None if val is None or pd.isna(val) else float(val)
    return records


def upsert_batches(client: Client, records: list[dict], batch_size: int = BATCH_SIZE) -> int:
    upserted = 0
    conflict_cols = "sii_code,model_year,source_year,is_heavy_vehicle"
    for i in range(0, len(records), batch_size):
        batch = records[i : i + batch_size]
        client.table("mldc_vehicle_valuations").upsert(batch, on_conflict=conflict_cols).execute()
        upserted += len(batch)
        print(f"[INFO] Upsert {upserted}/{len(records)}")
    return upserted


def write_pipeline_log(client: Client, category: str, result: RunResult) -> None:
    client.table("mldc_pipeline_logs").insert(
        {
            "data_source_name": f"SII Tasación Fiscal de Vehículos ({category})",
            "client_id": None,
            "status": result.status,
            "records_processed": result.records_processed,
            "records_upserted": result.records_upserted,
            "execution_time_ms": result.execution_time_ms,
            "storage_status": "NOT_APPLICABLE",
            "error_message": result.error_message,
        }
    ).execute()


def get_supabase_client() -> Client:
    load_dotenv()
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError("Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en el entorno (.env).")
    return create_client(url, key)


def run(year: int, category: str, limit: int | None) -> RunResult:
    started = time.monotonic()
    client = get_supabase_client()
    is_heavy = category == "pesado"

    try:
        url = build_url(year, category)
        raw = download_xlsx(url)
        df = parse_and_clean(raw, year, is_heavy, limit)
        records = to_records(df)
        upserted = upsert_batches(client, records)

        elapsed_ms = int((time.monotonic() - started) * 1000)
        status = "OK" if upserted == len(records) else "WARNING"
        result = RunResult(status, len(records), upserted, elapsed_ms)
    except Exception as exc:  # noqa: BLE001
        elapsed_ms = int((time.monotonic() - started) * 1000)
        result = RunResult("ERROR", 0, 0, elapsed_ms, error_message=str(exc))
        print(f"[ERROR] Pipeline falló: {exc}", file=sys.stderr)

    write_pipeline_log(client, category, result)
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--year", type=int, required=True, help="Año de la tabla de tasación (ej. 2026)")
    parser.add_argument("--category", choices=["liviano", "pesado"], default="liviano")
    parser.add_argument("--limit", type=int, default=None, help="Límite de filas para corridas de prueba")
    args = parser.parse_args()

    result = run(args.year, args.category, args.limit)
    print(f"[DONE] status={result.status} processed={result.records_processed} "
          f"upserted={result.records_upserted} time_ms={result.execution_time_ms}")

    if result.status == "ERROR":
        sys.exit(1)


if __name__ == "__main__":
    main()
