export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  timestampMs: number;
}

export interface VelocityAlert {
  type: "RUNNER_DETECTED";
  velocity: number;
  x: number;
  y: number;
}

export function computeVelocity(previous: BoundingBox, current: BoundingBox): number {
  const dt = Math.max((current.timestampMs - previous.timestampMs) / 1000, 0.001);
  const dx = current.x - previous.x;
  return Math.abs(dx / dt);
}

export function detectRunner(previous: BoundingBox, current: BoundingBox, threshold = 250): VelocityAlert | null {
  const velocity = computeVelocity(previous, current);
  if (velocity > threshold) {
    return { type: "RUNNER_DETECTED", velocity, x: current.x, y: current.y };
  }
  return null;
}
