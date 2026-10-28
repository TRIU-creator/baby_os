export interface GstInput {
  turnover: number;
  stateCategory: "regular" | "special";
  businessType: "goods" | "services";
  marketplaceSeller: boolean;
  digitalReceipts: number;
}

export interface GstResult {
  gstRegistrationRequired: boolean;
  tcs: number;
  tds: number;
  section44adTaxableIncome: number;
}

export function reconcileGst(input: GstInput): GstResult {
  const threshold = input.businessType === "goods"
    ? input.stateCategory === "regular" ? 4_000_000 : 2_000_000
    : input.stateCategory === "regular" ? 2_000_000 : 1_000_000;

  const gstRegistrationRequired = input.marketplaceSeller || input.turnover >= threshold;
  const tcs = input.turnover * 0.005;
  const tds = input.turnover * 0.001;
  const section44adTaxableIncome = input.digitalReceipts * 0.06;

  return { gstRegistrationRequired, tcs, tds, section44adTaxableIncome };
}
