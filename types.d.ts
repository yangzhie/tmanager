// Frontend/backend types
type Statistics = {
    cpuUsage: number,
    ramUsage: number,
    storageData: number,
    gpu: string,
    gpuVRAM: number,
    displayModel: string,
    refreshRate: number
};

type StaticData = {
    totalStorage: number,
    cpu: string,
    uptime: number,
    totalMemory: number,
};

type View = "CPU" | "RAM" | "STORAGE";

type FrameAction = "CLOSE" | "MAXIMIZE" | "MINIMIZE";

type EventPayloadMapping = {
    statistics: Statistics;
    getStaticData: StaticData;
    changeView: View;
    sendFrameAction: FrameAction;
};

type StorageData = {
    total: number,
    usage: number
};

type GPU = {
    gpu: string,
    gpuVRAM: number,
    displayModel: string,
    refreshRate: number
};

type Unsubscribe = () => void;

interface Window {
    electron: {
        subStatistics: (callback: (statistics: Statistics) => void) => Unsubscribe;
        getStaticData: () => Promise<StaticData>;
        subChangeView: (callback: (view: View) => void) => Unsubscribe;
        sendFrameAction: (payload: FrameAction) => void;
    };
};