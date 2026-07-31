import DocsContent from "@/components/DocsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs - Aegis Dashboard",
  description: "Aegis Phishing & Fraud Detection Documentation",
};

export default function DashboardDocsPage() {
  return <DocsContent isDashboard={true} />;
}
