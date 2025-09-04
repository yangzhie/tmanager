import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";

import { isDev } from "./util.js";
import { getStaticData, pollResources } from "./resourceManager.js";
import { getPreloadPath } from "./pathResolver.js";

// When app is ready, run arrow function
app.on("ready", () => {
    // Create new instance of window
    const mainWindow = new BrowserWindow({
        title: "Test",
        webPreferences: {
            preload: getPreloadPath() // Run script before opening window
        }
    });

    if (isDev()) {
        mainWindow.loadURL('http://localhost:9999/')
    } else {
        // Load initial file inside mainWindow
        // path helps configure Windows' \
        mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"));
    }

    // Already has a reference to the BrowserWindow
    // Main is pushing messages into the renderer, unprompted
    // Renderer doesn’t need to call main, only listen
    pollResources(mainWindow);

    // on/send is fire-and-forget, invoke/handle gives a promise response
    // Registers a handler named "getStaticData" and exposes getStaticData
    // Any renderer process can now invoke("getStaticData")
    // Renderer asks for data
    ipcMain.handle("getStaticData", () => {
        return getStaticData();
    });
})