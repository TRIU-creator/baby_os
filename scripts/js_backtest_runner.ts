import * as dfd from "danfojs-node";
import { runStrategy, Candle } from "../modules/skills/trading/algo_trader";

export interface BacktestConfig {
  timeframe: "1m" | "3m" | "5m" | "15m";
  startCapital: number;
  currentCapital: number;
}

export function runBacktest(closes: number[], config: BacktestConfig) {
  const frame = new dfd.DataFrame({ close: closes });
  const candles: Candle[] = (frame.values as number[][]).map(([close]) => ({ close }));
  return { timeframe: config.timeframe, ...runStrategy(candles, config.startCapital, config.currentCapital) };
}
