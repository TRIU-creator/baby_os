import { Database } from "bun:sqlite";

export interface MemoryRecord {
  id?: number;
  ts: string;
  summary: string;
  preferences?: string;
}

export class MemoryEngine {
  private readonly db: Database;

  constructor(path = "sab_memory.db") {
    this.db = new Database(path);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts TEXT NOT NULL,
        summary TEXT NOT NULL,
        preferences TEXT
      );
    `);
  }

  write(record: MemoryRecord): number {
    const stmt = this.db.query(
      "INSERT INTO memories (ts, summary, preferences) VALUES (?, ?, ?) RETURNING id"
    );
    const row = stmt.get(record.ts, record.summary, record.preferences ?? null) as { id: number };
    return row.id;
  }

  latest(limit = 10): MemoryRecord[] {
    const stmt = this.db.query("SELECT id, ts, summary, preferences FROM memories ORDER BY id DESC LIMIT ?");
    return stmt.all(limit) as MemoryRecord[];
  }
}
