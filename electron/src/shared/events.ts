import { ipcMain, ipcRenderer, IpcMainEvent, IpcRendererEvent } from 'electron';

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
    register,
    send,
  });
}

export const R = Object.freeze({
  generatedRandomImages: createREvent<{
    success: boolean;
  }>('generatedRandomImages'),
});

export const M = Object.freeze({
  generateRandomImages: createMEvent<{
    images: string;
    policyId: string;
    output: {
      images: string;
      meta: string;
    };
    numberOfImages: number;
  }>('generateRandomImages'),
});
