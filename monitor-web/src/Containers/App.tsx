import ServerStatus from "../Components/ServerStatus";
import URLNumber from "../Components/URLNumber";
import MetricsCard from "../Components/MetricsCard";
import DailyTrendsChart from "./DailyTrendsChart"
import FailReasonsChart from "./FailReasonsChart";

import { useServerStatus } from "./hook/useServerStatus";

export default function StatusDashboard() {
  const { serverStatus, serverNumStats, metrics, daily } = useServerStatus();

  return (
    <div className="bg-black p-8 text-black min-h-screen min-w-screen">
      <div className="max-w-7xl mx-auto">

        {/* Server Status */}
        <ServerStatus serverStatus={serverStatus} />

        {/* URL Number */}
        <URLNumber statsTop={serverNumStats} />

        {/* Bottom Metrics */}
        <MetricsCard metrics={metrics}/>

        <DailyTrendsChart data={daily} />

        <FailReasonsChart data={daily} />
      </div>
    </div>
  );
}
