import { ipcMain, WebContents } from "electron";

export function isDev(): boolean {
    return process.env.NODE_ENV === "development";
}

// Backend type safe
// ipcHandle is forced to use EventPayloadMapping - type safe
export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
    key: string, 
    handler: () => EventPayloadMapping[Key]
) {
    ipcMain.handle(key, () => handler());
};

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    webContents: WebContents,
    payload: EventPayloadMapping[Key]
) {
    webContents.send(key, payload);
};

export function ipcMainOn<Key extends keyof EventPayloadMapping>(
    key: Key, 
    handler: () => (payload: EventPayloadMapping[Key]) => void
) {
    ipcMain.on(key, (_, payload) => {
        return handler(payload);
    });
};