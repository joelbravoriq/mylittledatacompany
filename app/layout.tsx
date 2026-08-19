import type { Metadata } from "next";
import { Oswald, Source_Sans_3, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
});

const siteUrl = "https://mylittledatacompany.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "My Little Data Company — Big Data Power. Zero Corporate BS.",
  description:
    "Plataforma DaaS con feeds de datos vehiculares, financieros y territoriales, frescos y vía API REST o Snowflake Data Sharing, 100% alineados con la Ley N° 21.719. Boutique Data Studio & DaaS para Banca, Seguros, Fintech y más en Latam.",
  keywords: [
    "Data as a Service",
    "DaaS",
    "Snowflake Data Sharing",
    "Ley 21.719",
    "Modern Data Stack",
    "dbt",
    "Airflow",
    "Databricks",
    "Data Quality",
    "Datos vehiculares",
    "Datos inmobiliarios",
    "Banca Chile",
  ],
  authors: [{ name: "My Little Data Company" }],
  openGraph: {
    title: "My Little Data Company — Big Data Power. Zero Corporate BS.",
    description:
      "Datos externos frescos para tus modelos y procesos. Catálogo multi-fuente + API DaaS + Consultoría boutique en Modern Data Stack.",
    url: siteUrl,
    siteName: "My Little Data Company",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Little Data Company",
    description: "Big Data Power. Zero Corporate BS.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-CL" className="dark">
      <body
        className={`${oswald.variable} ${sourceSans.variable} ${jbMono.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
