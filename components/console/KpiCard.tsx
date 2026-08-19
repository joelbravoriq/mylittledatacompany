type KpiCardProps = {
  label: string;
  value: string;
  delta?: string;
  tone?: "ok" | "neutral";
};

export default function KpiCard({ label, value, delta, tone = "neutral" }: KpiCardProps) {
  return (
    <div className="rounded-lg card-border bg-base-850/70 p-5">
      <p className="text-[11px] font-mono uppercase tracking-wide text-base-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <p
          className={`text-2xl font-semibold font-mono tabular-nums ${
            tone === "ok" ? "text-ok" : "text-base-50"
          }`}
        >
          {value}
        </p>
        {delta && (
          <span className="text-xs font-mono text-ok bg-ok/10 border border-ok/25 rounded-sm px-1.5 py-0.5">
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
