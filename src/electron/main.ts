import { app, BrowserWindow, ipcMain, Tray } from "electron";
import path from "path";

import { ipcMainHandle, ipcMainOn, isDev } from "./util.js";
import { getStaticData, pollResources } from "./resourceManager.js";
import { getPreloadPath } from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";

// When app is ready, run arrow function
app.on("ready", () => {
    // Create new instance of window
    const mainWindow = new BrowserWindow({
        title: "Test",
        webPreferences: {
            preload: getPreloadPath() // Run script before opening window
        },
        frame: false // Create custom frame
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
    ipcMainHandle("getStaticData", () => {
        return getStaticData();
    });

    ipcMainOn("sendFrameAction", (payload) => {
        switch(payload) {
            case "CLOSE":
                mainWindow.close();
                break;
            case "MAXIMIZE":
                mainWindow.maximize();
                break;
            case "MINIMIZE":
                mainWindow.minimize();
                break;
        }
    });

    createTray(mainWindow);
    handleClose(mainWindow);
    createMenu(mainWindow);
});

function handleClose(mainWindow: BrowserWindow) {
    let closed = false;

    // When app is closed, prevent default behaviour
    mainWindow.on("close", (event) => {
        if(closed) {
            return;
        }

        event.preventDefault();

        // Hides for Win/Lin
        mainWindow.hide();

        // If dock property exists (for Mac)
        if(app.dock) {
            app.dock.hide();
        }
    });

    app.on("before-quit", () => {
        closed = true;
    });

    mainWindow.on("show", () => {
        closed = false;
    });
}
