export type WorkTier = 0 | 1 | 2 | 3;

export interface RouteInput {
  task: string;
  isDeterministic?: boolean;
  requiresArchitectureDepth?: boolean;
  includesImage?: boolean;
}

export interface RouteResult {
  tier: WorkTier;
  provider: string;
  endpoint?: string;
}

export function routeWorkload(input: RouteInput): RouteResult {
  if (input.isDeterministic) {
    return { tier: 0, provider: "local-js-functions" };
  }

  if (input.includesImage) {
    return { tier: 3, provider: "local-vision", endpoint: "florence-2-or-local-ocr" };
  }

  if (input.requiresArchitectureDepth) {
    return { tier: 2, provider: "frontier-llm", endpoint: "claude-3.5-sonnet|gpt-4o" };
  }

  const endpoint = process.env.OPENROUTER_API_KEY
    ? "openrouter"
    : process.env.MONID_API_KEY
      ? "monid"
      : "http://localhost:11434";

  return { tier: 1, provider: "fast-slm", endpoint };
}
