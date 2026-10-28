export interface CscWorkflowStatus {
  tecFeeInr: number;
  tecChapters: number;
  iibfCertificateVerified: boolean;
}

export function buildCscWorkflow(iibfCertificateId?: string): CscWorkflowStatus {
  return {
    tecFeeInr: 1480,
    tecChapters: 10,
    iibfCertificateVerified: Boolean(iibfCertificateId)
  };
}
