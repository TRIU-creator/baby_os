import WorkstationWindow from "./components/WorkstationWindow";
import TradingDashboard from "./components/TradingDashboard";
import TerminalManager from "./components/TerminalManager";

export default function App() {
  return (
    <main>
      <h1>SAB-OS Agentic Workstation</h1>
      <p>Hardware Telemetry: ULTRA_LIGHT_MODE (&lt;150MB Allocated) / GPU_ACCELERATED_MODE</p>
      <WorkstationWindow />
      <TradingDashboard />
      <TerminalManager />
    </main>
  );
}
