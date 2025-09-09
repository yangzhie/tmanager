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

type EventPayloadMapping = {
    statistics: Statistics;
    getStaticData: StaticData;
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
}

interface Window {
    electron: {
        subStatistics: (callback: (statistics: Statistics) => void) => void;
        getStaticData: () => Promise<StaticData>;
    };
};