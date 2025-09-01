import { app, BrowserWindow } from "electron";
import path from "path";

import { isDev } from "./util.js";

// When app is ready, run arrow function
app.on("ready", () => {
    // Create new instance of window
    const mainWindow = new BrowserWindow({});

    if (isDev()) {
        mainWindow.loadURL('http://localhost:9999/')
    } else {
        // Load initial file inside mainWindow
        // path helps configure Windows' \
        mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"));
    }
})