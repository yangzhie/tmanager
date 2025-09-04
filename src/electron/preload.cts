const electron = require("electron");

// Bridge data between Electron process and UI
electron.contextBridge.exposeInMainWorld("electron", {
    subStatistics: (callback: (statistics: any) => void) => callback({}),
    getStaticData: () => console.log("static")
})