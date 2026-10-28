export interface MoleculeQuery {
  pubchemId?: string;
  uniprotId?: string;
  pdbId?: string;
}

export function validateScientificQuery(query: MoleculeQuery): boolean {
  return Boolean(query.pubchemId || query.uniprotId || query.pdbId);
}
