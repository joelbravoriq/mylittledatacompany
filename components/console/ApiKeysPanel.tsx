"use client";

import { useState } from "react";

const keys = [
  { name: "Production Key", value: "mldc_live_8f2a1c9e7b4d6a03f1e9c2b8", scope: "read:vehicle read:compliance" },
  { name: "Sandbox Key", value: "mldc_test_3d9f7a2e1c5b8901d4f6a7c2", scope: "read:vehicle (sandbox)" },
];

export default function ApiKeysPanel() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  return (
    <div className="rounded-lg border border-base-700 divide-y divide-base-800 overflow-hidden">
      {keys.map((k) => {
        const isRevealed = revealed[k.name];
        return (
          <div key={k.name} className="p-5 bg-base-850/70 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-base-100">{k.name}</p>
              <p className="mt-1 text-xs text-base-500">{k.scope}</p>
              <p className="mt-2 font-mono text-sm text-base-300 truncate">
                {isRevealed ? k.value : `${k.value.slice(0, 10)}${"•".repeat(16)}`}
              </p>
            </div>
            <button
              onClick={() => setRevealed((r) => ({ ...r, [k.name]: !r[k.name] }))}
              className="shrink-0 text-xs font-mono text-amber hover:text-amber-bright transition-colors"
            >
              {isRevealed ? "Ocultar" : "Revelar"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
