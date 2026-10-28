import { useEffect, useState } from "react";
import { get, set } from "idb-keyval";

type SaleEvent = {
  id: string;
  amount: number;
  synced: boolean;
};

const QUEUE_KEY = "offline-sale-queue";

export default function TerminalManager() {
  const [queueSize, setQueueSize] = useState(0);

  useEffect(() => {
    const syncQueue = async () => {
      const events = ((await get<SaleEvent[]>(QUEUE_KEY)) ?? []).map((event) => ({ ...event, synced: true }));
      if (events.length > 0) {
        const ws = new WebSocket("ws://localhost:7071");
        ws.addEventListener("open", () => {
          ws.send(JSON.stringify({ channel: "transactions", events }));
          ws.close();
        });
        await set(QUEUE_KEY, events);
      }
      setQueueSize(events.length);
    };

    const storeOfflineEvent = async () => {
      const events = (await get<SaleEvent[]>(QUEUE_KEY)) ?? [];
      events.push({ id: crypto.randomUUID(), amount: 0, synced: false });
      await set(QUEUE_KEY, events);
      setQueueSize(events.length);
    };

    if (navigator.onLine) {
      void syncQueue();
    } else {
      void storeOfflineEvent();
    }

    window.addEventListener("online", syncQueue);
    return () => window.removeEventListener("online", syncQueue);
  }, []);

  return <section aria-label="terminal-manager">Franchise POS Offline Queue: {queueSize}</section>;
}
