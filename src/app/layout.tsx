import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "AzubiPro – Lernen, planen, bestehen", description: "Die Plattform für Ausbildung im Handwerk" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="de"><body>{children}</body></html>;
}
