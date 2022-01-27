import { ipcMain, ipcRenderer, IpcMainEvent, IpcRendererEvent } from 'electron';

import { Layer } from '../../../scripts/generate-random-image';

function createREvent<EventData>(channel: string) {
  const register = (
    handler: (event: IpcRendererEvent, data: EventData) => void
  ) => {
    ipcRenderer.on(channel, handler);
  };

  const reply = (mainEvent: IpcMainEvent, data: EventData) => {
    return mainEvent.reply(channel, data);
  };

  return Object.freeze({
    type: channel,
    register,
    reply,
  });
}

function createMEvent<EventData>(channel: string) {
  const register = (
    handler: (event: IpcMainEvent, data: EventData) => void
  ) => {
    ipcMain.on(channel, handler);
  };

  const send = (data: EventData) => {
    return ipcRenderer.send(channel, data);
  };

  return Object.freeze({
    type: channel,
    register: register,
    send,
  });
}

export const R = Object.freeze({
  scannedImages: createREvent<{ layers: readonly Layer[] }>('scannedImages'),
});

export const M = Object.freeze({
  scanImages: createMEvent<{
    directory: string;
  }>('scanImages'),
  
});
