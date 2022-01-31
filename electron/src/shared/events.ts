import { ipcMain, ipcRenderer, IpcMainEvent, IpcRendererEvent } from 'electron';

import environment from './environment';
import { ScriptName } from './types';

function createREvent<EventData>(channel: string) {
  const register = (
    handler: (event: IpcRendererEvent, data: EventData) => void
  ) => {
    ipcRenderer.on(channel, handler);

    return () => {
      ipcRenderer.off(channel, handler);
    };
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

  scriptStarted: createREvent<{
    script: ScriptName;
    pid: number;
  }>('scriptStarted'),

  scriptSuspended: createREvent<{
    pid: number;
    result: boolean;
  }>('scriptSuspended'),

  scriptResumed: createREvent<{
    pid: number;
    result: boolean;
  }>('scriptResumed'),

  sendEnv: createREvent<typeof environment>('sendEnv'),
});

export const M = Object.freeze({
  generateRandomImages: createMEvent<{
    images: string;
    policyId: string;
    policyName: string;
    output: {
      images: string;
      meta: string;
    };
    numberOfImages: number;
  }>('generateRandomImages'),

  suspendScript: createMEvent<{ pid: number }>('suspendScript'),

  resumeScript: createMEvent<{ pid: number }>('resumeScript'),

  requestEnv: createMEvent<void>('requestEnv'),
});
