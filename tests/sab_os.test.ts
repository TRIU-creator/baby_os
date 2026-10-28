import { test, expect } from "bun:test";
import { routeWorkload } from "../core/model_router";
import { runStrategy } from "../modules/skills/trading/algo_trader";
import { detectRunner } from "../modules/skills/vision/cctv_cv_engine";

test("routes deterministic tasks to tier 0", () => {
  const routed = routeWorkload({ task: "invoice math", isDeterministic: true });
  expect(routed.tier).toBe(0);
});

test("enforces 2% drawdown hard cap", () => {
  const result = runStrategy(
    Array.from({ length: 40 }, (_, i) => ({ close: 100 + i })),
    100_000,
    98_000
  );
  expect(result.status).toBe("HALTED: 2% Daily Drawdown Limit Exceeded");
});

test("raises runner alert when velocity exceeds threshold", () => {
  const alert = detectRunner(
    { x: 0, y: 0, width: 10, height: 10, timestampMs: 0 },
    { x: 500, y: 0, width: 10, height: 10, timestampMs: 1000 },
    250
  );
  expect(alert?.type).toBe("RUNNER_DETECTED");
});
