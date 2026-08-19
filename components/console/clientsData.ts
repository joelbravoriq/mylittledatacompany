export type ClientSource = {
  name: string;
  endpoint: string;
  status: "ok" | "warning";
  freshness: string;
  errorRate: string;
};

export type ClientLog = {
  timestamp: string;
  tag: string;
  text: string;
};

export type Client = {
  id: string;
  name: string;
  planLabel: string;
  slaUptime: string;
  slaState: "COMPLYING" | "AT_RISK";
  dailyRequests: number;
  dailyRequestsLimit: number;
  activeFeeds: number;
  avgResponseMs: number;
  sources: ClientSource[];
  logs: ClientLog[];
};

export const clients: Client[] = [
  {
    id: "itau",
    name: "Banco Itaú Chile",
    planLabel: "Enterprise SLA 99.9%",
    slaUptime: "99.94%",
    slaState: "COMPLYING",
    dailyRequests: 42150,
    dailyRequestsLimit: 100000,
    activeFeeds: 3,
    avgResponseMs: 120,
    sources: [
      {
        name: "Vehicle Enriched Feed (Reemplazo TransUnion)",
        endpoint: "API REST /v1/vehicles",
        status: "ok",
        freshness: "hace 8 min",
        errorRate: "0.00%",
      },
      {
        name: "PRT Live History Stream",
        endpoint: "Snowflake Data Share",
        status: "ok",
        freshness: "hace 1 hora",
        errorRate: "0.02%",
      },
      {
        name: "SII Fiscal Valuation Matrix",
        endpoint: "API REST /v1/sii",
        status: "warning",
        freshness: "hace 4 horas",
        errorRate: "1.15%",
      },
    ],
    logs: [
      { timestamp: "2026-08-19 16:40:12", tag: "ITAU-PROD", text: "GET /v1/vehicles/RUT-15432890-K -> 200 OK (112ms)" },
      { timestamp: "2026-08-19 16:38:05", tag: "ITAU-PROD", text: "Data Freshness Check Passed (Freshness: < 1h)" },
      { timestamp: "2026-08-19 16:35:00", tag: "ITAU-PROD", text: "Compliance Anonymization Hash Applied" },
      { timestamp: "2026-08-19 16:31:47", tag: "ITAU-PROD", text: "GET /v1/sii/avaluo?rol=1234-5 -> 200 OK (340ms)" },
    ],
  },
  {
    id: "bci",
    name: "BCI Seguros",
    planLabel: "Professional Plan",
    slaUptime: "99.81%",
    slaState: "COMPLYING",
    dailyRequests: 18400,
    dailyRequestsLimit: 50000,
    activeFeeds: 2,
    avgResponseMs: 138,
    sources: [
      {
        name: "Vehicle Enriched Feed",
        endpoint: "API REST /v1/vehicles",
        status: "ok",
        freshness: "hace 22 min",
        errorRate: "0.03%",
      },
      {
        name: "PRT Live History Stream",
        endpoint: "Snowflake Data Share",
        status: "ok",
        freshness: "hace 2 horas",
        errorRate: "0.01%",
      },
    ],
    logs: [
      { timestamp: "2026-08-19 16:39:02", tag: "BCI-PROD", text: "GET /v1/vehicles/patente-KPRX88 -> 200 OK (129ms)" },
      { timestamp: "2026-08-19 16:22:18", tag: "BCI-PROD", text: "Data Freshness Check Passed (Freshness: < 2h)" },
      { timestamp: "2026-08-19 15:58:41", tag: "BCI-PROD", text: "Compliance Anonymization Hash Applied" },
    ],
  },
  {
    id: "fintech-x",
    name: "Fintech Automotriz X",
    planLabel: "Sandbox / PoC Active",
    slaUptime: "—",
    slaState: "AT_RISK",
    dailyRequests: 640,
    dailyRequestsLimit: 2000,
    activeFeeds: 1,
    avgResponseMs: 165,
    sources: [
      {
        name: "Vehicle Enriched Feed (Sandbox)",
        endpoint: "API REST /v1/vehicles (test)",
        status: "warning",
        freshness: "hace 6 horas",
        errorRate: "2.40%",
      },
    ],
    logs: [
      { timestamp: "2026-08-19 14:12:09", tag: "FTX-SANDBOX", text: "GET /v1/vehicles/patente-TEST01 -> 200 OK (210ms)" },
      { timestamp: "2026-08-19 13:50:33", tag: "FTX-SANDBOX", text: "Rate limit warning: 80% of sandbox quota used" },
    ],
  },
];
