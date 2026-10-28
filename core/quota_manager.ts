export interface ProviderQuotaState {
  name: "free" | "paid";
  key?: string;
  exhaustedUntil?: number;
}

export interface PreferencePayload {
  styleTokens?: Record<string, string>;
  frameworks?: string[];
  architectureRules?: string[];
}

export class QuotaManager {
  private active: ProviderQuotaState;
  private readonly backup: ProviderQuotaState;
  private readonly db: Database;

  constructor() {
    this.active = { name: "free", key: process.env.OPENROUTER_API_KEY };
    this.backup = { name: "paid", key: process.env.MONID_API_KEY };
    this.db = new Database("sab_memory.db");
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS preferences (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        payload TEXT NOT NULL
      );
    `);
  }

  onHttpStatus(status: number): ProviderQuotaState {
    if (status === 429 && this.backup.key) {
      this.active = { ...this.backup, exhaustedUntil: Date.now() + 5 * 60_000 };
    }
    return this.active;
  }

  refresh(now = Date.now()): ProviderQuotaState {
    if (this.active.name === "paid" && this.active.exhaustedUntil && now > this.active.exhaustedUntil) {
      this.active = { name: "free", key: process.env.OPENROUTER_API_KEY };
    }
    return this.active;
  }

  savePreferences(preferences: PreferencePayload): PreferencePayload {
    const existing = this.getPreferences();
    const merged = { ...existing, ...preferences };
    this.db
      .query("INSERT INTO preferences (id, payload) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET payload = excluded.payload")
      .run(JSON.stringify(merged));
    return merged;
  }

  getPreferences(): PreferencePayload {
    const row = this.db.query("SELECT payload FROM preferences WHERE id = 1").get() as { payload: string } | null;
    return row ? (JSON.parse(row.payload) as PreferencePayload) : {};
  }
}
import { Database } from "bun:sqlite";
