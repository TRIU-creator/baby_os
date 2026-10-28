export interface ScaffoldRequest {
  productType: "web" | "saas" | "baas" | "erp" | "pos" | "crm" | "desktop";
  billingProvider?: "stripe" | "razorpay";
  database?: "postgres" | "supabase";
}

export function buildScaffoldPlan(input: ScaffoldRequest): string[] {
  return [
    `Create ${input.productType} architecture with Next.js App Router + React + Tailwind`,
    `Provision runtime via Node.js/Bun and ${input.database ?? "postgres"} migrations`,
    `Add billing integration for ${input.billingProvider ?? "stripe"}`
  ];
}
