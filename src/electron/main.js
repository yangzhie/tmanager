import {app, BrowserWindow} from "electron";
import path from "path";

// When app is ready, run arrow function
app.on("ready", () => {
    // Create new instance of window
    const mainWindow = new BrowserWindow({});
    // Load initial file inside mainWindow
    // path helps configure Windows' \
    mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"));
})