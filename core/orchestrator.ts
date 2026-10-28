import { WebSocketServer } from "ws";
import { createServer } from "node:http";
import { routeWorkload } from "./model_router";
import { MemoryEngine } from "./memory_engine";
import { QuotaManager } from "./quota_manager";

type SecurityAlert = {
  type: "RUNNER_DETECTED";
  velocity: number;
  x: number;
  y: number;
  timestamp: string;
};

export class Orchestrator {
  private readonly memory = new MemoryEngine();
  private readonly quotas = new QuotaManager();
  private readonly wss: WebSocketServer;

  constructor(port = 7071) {
    const apiServer = createServer(async (req, res) => {
      if (req.method === "POST" && req.url === "/api/security/alert") {
        const chunks: Uint8Array[] = [];
        for await (const chunk of req) chunks.push(chunk);
        const body = Buffer.concat(chunks).toString("utf8");
        this.handleSecurityAlert(JSON.parse(body) as SecurityAlert);
        res.writeHead(202).end("accepted");
        return;
      }
      res.writeHead(404).end("not found");
    });
    this.wss = new WebSocketServer({ server: apiServer });
    apiServer.listen(port);
  }

  dispatch(task: string): string {
    const route = routeWorkload({ task, isDeterministic: task.includes("sqlite") });
    this.memory.write({ ts: new Date().toISOString(), summary: `Task routed to tier ${route.tier}: ${task}` });
    return `${route.provider}:${route.endpoint ?? "local"}`;
  }

  reportQuota(status: number): string {
    return this.quotas.onHttpStatus(status).name;
  }

  handleSecurityAlert(alert: SecurityAlert): void {
    const payload = JSON.stringify({ channel: "security", alert });
    this.wss.clients.forEach((client) => client.send(payload));
  }
}
