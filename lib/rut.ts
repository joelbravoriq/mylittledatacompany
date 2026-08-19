export type ParsedRut = {
  raw: string;
  number: number;
  dv: string; // dígito verificador provisto en el input, en mayúsculas
  valid: boolean; // true si el DV provisto coincide con el calculado (Módulo 11)
};

/** Calcula el dígito verificador de un RUT chileno con el algoritmo Módulo 11. */
export function computeDv(rutNumber: number): string {
  const digits = String(rutNumber).split("").reverse();
  const factors = [2, 3, 4, 5, 6, 7];
  let total = 0;
  for (let i = 0; i < digits.length; i++) {
    total += Number(digits[i]) * factors[i % factors.length];
  }
  const remainder = 11 - (total % 11);
  if (remainder === 11) return "0";
  if (remainder === 10) return "K";
  return String(remainder);
}

export function formatRut(rutNumber: number, dv: string): string {
  const withDots = rutNumber.toLocaleString("es-CL");
  return `${withDots}-${dv}`;
}

/** Parsea un string de RUT en cualquier formato común (con o sin puntos/guion). */
export function parseRut(input: string): ParsedRut | null {
  const clean = input.trim().replace(/\./g, "").toUpperCase();
  const match = clean.match(/^(\d{6,9})-?([\dK])$/);
  if (!match) return null;

  const number = Number(match[1]);
  const dv = match[2];
  const expected = computeDv(number);

  return { raw: input.trim(), number, dv, valid: dv === expected };
}

/** Enmascara un RUT para logs/UI: conserva los primeros dígitos, oculta el resto. */
export function maskRut(number: number): string {
  const str = String(number);
  const visible = str.slice(0, Math.max(str.length - 3, 2));
  return `${visible}***`;
}
