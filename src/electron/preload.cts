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
    subStatistics: (callback) => {
        ipcOn("statistics", (data) => 
            callback(data)
        );
    },

    subChangeView: (callback) => {
        ipcOn("changeView", (data) => 
            callback(data)
        );
    },
    
    // Req-res IPC pattern (invoke / ipcMain.handle)
    // Renderer asks once -> Main replies once -> Done
    getStaticData: () => ipcInvoke("getStaticData")
} satisfies Window["electron"]); // satisfies tell TS what to expect, different to 'as'

// Frontend functions cannot reside in utils.ts

// Key is constrained to "statistics" | "getStaticData"
function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key
): Promise<EventPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key);
};

function ipcOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    callback: (payload: EventPayloadMapping[Key]) => void
) {
    // Event + payload sent from main
    // cb forwards payload to callback
    const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload)
    // Registers the listener so whenever main calls webContents.send(key, payload), cb runs
    electron.ipcRenderer.on(key, cb);
    // Function itself returns another function
    // Returned function removes the listener just added
    return () => electron.ipcRenderer.off(key, cb);
};