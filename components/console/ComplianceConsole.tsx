"use client";

import { useEffect, useState } from "react";

type LogLine = {
  tag: "PRIVACY" | "VALIDATION" | "AUDIT";
  text: string;
};

const tagColor: Record<LogLine["tag"], string> = {
  PRIVACY: "text-policy",
  VALIDATION: "text-ok",
  AUDIT: "text-amber-bright",
};

function buildLog(auditId: number): LogLine[] {
  return [
    { tag: "PRIVACY", text: `Anonymization hash applied to RUT 15.432.890-K.` },
    { tag: "VALIDATION", text: `Zero-null check passed for Vehicle VIN structure.` },
    { tag: "VALIDATION", text: `Schema validation passed for 14/14 required fields.` },
    { tag: "PRIVACY", text: `PII fields stripped from response cache layer.` },
    { tag: "AUDIT", text: `Request logged for Compliance Audit Trail ID #MLDC-${auditId}.` },
  ];
}

export default function ComplianceConsole() {
  const [visible, setVisible] = useState<LogLine[]>([]);
  const [auditId, setAuditId] = useState(8849);

  useEffect(() => {
    const log = buildLog(auditId);
    setVisible([]);
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setVisible(log.slice(0, i));
      if (i >= log.length) clearInterval(t);
    }, 500);
    return () => clearInterval(t);
  }, [auditId]);

  return (
    <div className="rounded-lg border border-base-700 bg-base-900/80 overflow-hidden">
      <div className="border-b border-base-700 bg-base-850 px-4 py-2.5 flex items-center justify-between">
        <span className="text-[11px] font-mono text-base-400">
          compliance_audit_stream &middot; Ley N&deg; 21.719
        </span>
        <button
          onClick={() => setAuditId((id) => id + 1)}
          className="text-[11px] font-mono text-amber hover:text-amber-bright transition-colors"
        >
          Simular nueva request
        </button>
      </div>
      <div className="p-5 font-mono text-[13px] leading-7 min-h-[220px]">
        {visible.map((line, idx) => (
          <p key={idx}>
            <span className={`${tagColor[line.tag]} font-semibold`}>[{line.tag}]</span>{" "}
            <span className="text-base-300">{line.text}</span>
          </p>
        ))}
        {visible.length > 0 && visible.length < 5 && (
          <span className="inline-block w-2 h-4 bg-amber ml-1 align-middle animate-blink" />
        )}
      </div>
    </div>
  );
}
