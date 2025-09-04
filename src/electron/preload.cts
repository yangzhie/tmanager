const electron = require("electron"); 
// Loads renderer-side APIs
// contextBridge exposes some API to web page
// ipcRenderer recieves and requests data from Electron

// Bridge data between Electron process and UI
// "electron" is a whitelisted global on window now (window.electron.subStatistics & getStaticData)
// Anything put into this object becomes available to UI
electron.contextBridge.exposeInMainWorld("electron", {
    // Two different IPC patterns in Electron

    // Event subscription IPC pattern
    // Renderer registers a listener, Main keeps pushing updates whenever it has new data
    subStatistics: (callback: (statistics: any) => void) => {
        electron.ipcRenderer.on("statistics", (_, data) => {
            callback(data)
        });
    },
    
    // Req-res IPC pattern (invoke / ipcMain.handle)
    // Renderer asks once -> Main replies once -> Done
    getStaticData: () => electron.ipcRenderer.invoke("getStaticData")
});