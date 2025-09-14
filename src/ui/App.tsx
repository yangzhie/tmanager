import { useEffect, useMemo, useState } from 'react'
import { useStatistics } from './useStatistics'
import { Chart } from './Chart';

import "./App.css";

function App() {
  const staticData = useStaticData();
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

  const uptime = useMemo(
    () => statistics.map((stat) => stat.uptime), [statistics]
  );

  const activeUsage = useMemo(() => {
    switch(activeView) {
      case "CPU":
        return cpuUsage;
      case "RAM":
        return ramUsage;
      case "STORAGE":
        return storageUsage;
      case "UPTIME":
        return uptime;
    }
  }, [activeView, cpuUsage, ramUsage, storageUsage, uptime]);

  useEffect(() => {
    window.electron.subChangeView((view) => setActiveView(view))
  }, []);

  return (
    <>
      <div className="App">
        <Header />
        <div className="main">
          <div>
            <SelectOption 
              onClick={() => setActiveView("CPU")}
              title="CPU"
              view="CPU"
              subTitle={staticData?.cpu ?? ""}
              data={cpuUsage}
            />
            <SelectOption 
              onClick={() => setActiveView("RAM")}
              title="RAM"
              view="RAM"
              subTitle={(staticData?.totalMemory ?? "") + " GB"}
              data={ramUsage}
            />
            <SelectOption 
              onClick={() => setActiveView("STORAGE")}
              title="STORAGE"
              view="STORAGE"
              subTitle={(staticData?.totalStorage.toString() ?? "") + " GB"}
              data={storageUsage}
            />
            {/* <SelectOption 
              onClick={() => setActiveView("UPTIME")}
              title="UPTIME"
              view="UPTIME"
              subTitle={staticData?.uptime ?? ""}
              data={staticData.uptime}
            /> */}
          </div>

          <div className="main-grid">
            <Chart selectedView={activeView} data={activeUsage} maxDataPoints={10}/>
          </div>
        </div>
      </div>
    </>
  )
}

function Header() {
  return (
    <>
      <header>
        <button id="close" onClick={() => window.electron.sendFrameAction("CLOSE")} />
        <button id="minimize" onClick={() => window.electron.sendFrameAction("MINIMIZE")} />
        <button id="maximize" onClick={() => window.electron.sendFrameAction("MAXIMIZE")} />
      </header>
    </>
  )
}

function SelectOption(props: {
  title: string;
  view: View;
  subTitle: string;
  data: number[];
  onClick: () => void;
}) {
  return (
    <>
      <button className="select-option" onClick={props.onClick}>
        <div className="select-option-title">
          <div>{props.title}</div>
          <div>{props.subTitle}</div>
        </div>
        <div className="select-option-chart">
          <Chart selectedView={props.view} data={props.data} maxDataPoints={10}/>
        </div>
      </button>
    </>
  )
}

function useStaticData() {
  const [staticData, setStaticData] = useState<StaticData | null>(null);

  useEffect(() => {
    (async () => {
      setStaticData(await window.electron.getStaticData());
    })();
  }, []);

  return staticData;
}

export default App
