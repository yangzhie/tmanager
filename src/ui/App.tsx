import { useEffect, useMemo, useState } from 'react'
import { useStatistics } from './useStatistics'
import { Chart } from './Chart';

import "./App.css";

function App() {
  const statistics = useStatistics(10);
  const [activeView, setActiveView] = useState<View>("CPU");

  const cpuUsage = useMemo(
    () => statistics.map((stat) => stat.cpuUsage), [statistics]
  );

  const ramUsage = useMemo(
    () => statistics.map((stat) => stat.ramUsage), [statistics]
  );

  const storageUsage = useMemo(
    () => statistics.map((stat) => stat.storageData), [statistics]
  );

  const activeUsage = useMemo(() => {
    switch(activeView) {
      case "CPU":
        return cpuUsage;
      case "RAM":
        return ramUsage;
      case "STORAGE":
        return storageUsage;
    }
  }, [activeView, cpuUsage, ramUsage, storageUsage]);

  useEffect(() => {
    window.electron.subChangeView((view) => setActiveView(view))
  }, []);

  return (
    <>
      <div className="App">
        <header>
          <button id="close" onClick={() => window.electron.sendFrameAction("CLOSE")} />
          <button id="minimize" onClick={() => window.electron.sendFrameAction("MINIMIZE")} />
          <button id="maximize" onClick={() => window.electron.sendFrameAction("MAXIMIZE")} />
        </header>

        <div style={{height: 120}}>
          <Chart data={activeUsage} maxDataPoints={10}/>
        </div>
      </div>
      statisticsstatisticsstatisticsstatisticsstatisticsstatisticsstatistics
    </>
  )
}

export default App
