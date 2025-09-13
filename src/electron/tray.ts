import path from "path";
import { app, BrowserWindow, Menu, Tray } from "electron";
import { getAssetPath } from "./pathResolver.js";

export function createTray(mainWindow: BrowserWindow) {
    const tray = new Tray(path.join(getAssetPath(), "paper-tray.png"));

    // Menu that pops up when clicking on tray
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: "Quit",
            click: () => app.quit()
        },
        {
            label: "Show",
            click: () => {
                mainWindow.show();  // For Win/Lin
                if(app.dock) {      // For Mac
                    app.dock.show();
                }
            }
        }
    ]));
}