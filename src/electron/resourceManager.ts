import os_utils from "os-utils";
import si from "systeminformation";
import fs from "fs";
import os from "os";

const POLLING_INTERVAL = 500;

export function pollResources() {
    setInterval(async () => { 
        const cpuUsage = await getCpuUsage();
        const ramUsage = getRamUsage();
        const storageData = getStorageData();
    }, POLLING_INTERVAL);
}

export async function getStaticData() {
    const totalStorage = getStorageData().total;
    const cpu = os.cpus()[0].model;           // Assume only one CPU for time being
    const uptime = os_utils.sysUptime() / 60; // Convert sec -> min
    const totalMemory = Math.floor(os_utils.totalmem() / 1024);
    
    return {
        totalStorage,
        cpu,
        uptime,
        totalMemory,
    }
}

export async function getGPUStats() {
    const { controllers, displays } = await si.graphics();
    const { vendor: gpuVendor, model: gpuModel, vram: gpuVRAM } = controllers[0];
    const { model: displayModel, currentRefreshRate: refreshRate } = displays[0]; 

    const gpu = `${gpuVendor} ${gpuModel}`;

    return {
        gpu,
        gpuVRAM,
        displayModel,
        refreshRate
    }
}

function getCpuUsage() {
    return new Promise((resolve) => {
        os_utils.cpuUsage(resolve);
    })
}

function getRamUsage() {
    // The amount of memory that is free (as %) out of the rest
    return 1 - os_utils.freememPercentage();
}

function getStorageData() {
    // Stats about specific region in file system
    // If on Win, test for C drive, else Linux/Mac
    const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");

    // Total storage space
    const total = stats.bsize * stats.blocks; // Size of one block * how many blocks = total bytes
    const free = stats.bsize * stats.bfree;   // Same method for free space

    return {
        total: Math.floor(total / 1000000000), // Convert to GB
        usage: 1 - free / total
    }
}