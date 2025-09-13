import { useMemo } from 'react'
import { useStatistics } from './useStatistics'
import { Chart } from './Chart';

function App() {
  const statistics = useStatistics(10);

  const cpuUsage = useMemo(
    () => statistics.map((stat) => stat.cpuUsage), [statistics]
  );

  return (
    <>
      <div style={{height: 120}}>
        <Chart data={cpuUsage} maxDataPoints={10}/>
      </div>
      statisticsstatisticsstatisticsstatisticsstatisticsstatisticsstatistics
    </>
  )
}

export default App
