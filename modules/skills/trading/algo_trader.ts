import { EMA, RSI, MACD, BollingerBands } from "technicalindicators";

export interface Candle {
  close: number;
}

export interface TradingResult {
  status: "ACTIVE" | "HALTED: 2% Daily Drawdown Limit Exceeded";
  drawdownPct: number;
  indicators: { ema: number[]; rsi: number[]; macd: number[]; bbMiddle: number[] };
}

export function runStrategy(candles: Candle[], startCapital: number, currentCapital: number): TradingResult {
  const closes = candles.map((c) => c.close);
  const drawdownPct = ((startCapital - currentCapital) / startCapital) * 100;

  const ema = EMA.calculate({ period: 20, values: closes });
  const rsi = RSI.calculate({ period: 14, values: closes });
  const macd = MACD.calculate({
    values: closes,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  }).map((x) => x.MACD ?? 0);
  const bbMiddle = BollingerBands.calculate({ period: 20, values: closes, stdDev: 2 }).map((x) => x.middle);

  if (drawdownPct >= 2) {
    return { status: "HALTED: 2% Daily Drawdown Limit Exceeded", drawdownPct, indicators: { ema, rsi, macd, bbMiddle } };
  }

  return { status: "ACTIVE", drawdownPct, indicators: { ema, rsi, macd, bbMiddle } };
}
