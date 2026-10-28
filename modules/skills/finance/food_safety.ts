export interface FoodSafetyInput {
  annualTurnover: number;
  labels: string[];
}

const REQUIRED_LMPC_LABELS = [
  "MRP",
  "Net Quantity",
  "Manufacturing Date",
  "Expiry Date",
  "Batch Number",
  "Manufacturer Name",
  "Manufacturer Address",
  "Consumer Care",
  "Country of Origin"
];

export function evaluateFoodSafety(input: FoodSafetyInput): { fssaiType: "FORM_A" | "FORM_B"; missingLabels: string[] } {
  const fssaiType = input.annualTurnover < 1_200_000 ? "FORM_A" : "FORM_B";
  const missingLabels = REQUIRED_LMPC_LABELS.filter((label) => !input.labels.includes(label));
  return { fssaiType, missingLabels };
}
