export interface DefenseContractInput {
  contractPrice: number;
  directImportCosts: number;
  foreignTechnicalFees: number;
  foreignRoyalties: number;
}

export interface DefenseScanResult {
  indigenousContentPct: number;
  qualifiesIndianIddm: boolean;
  makeIFundingSupport: number;
  procurementChecklist: string[];
}

export function scanDap2026(input: DefenseContractInput): DefenseScanResult {
  const indigenousValue = input.contractPrice - input.directImportCosts - input.foreignTechnicalFees - input.foreignRoyalties;
  const indigenousContentPct = (indigenousValue / input.contractPrice) * 100;

  return {
    indigenousContentPct,
    qualifiesIndianIddm: indigenousContentPct >= 50,
    makeIFundingSupport: input.contractPrice * 0.7,
    procurementChecklist: ["Right Quality", "Right Quantity", "Right Price", "Right Time", "Right Source"]
  };
}
