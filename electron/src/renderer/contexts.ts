import { IpcRendererEvent } from 'electron';
import React from 'react';
import environment from '../shared/environment';
import { ScriptClosedEventData } from '../shared/events';
import { InputData, ScriptStatus, ScriptName } from '../shared/types';

// eslint-disable-next-line import/prefer-default-export
export const EnvironmentContext = React.createContext<typeof environment>({
  scriptsRoot: '',
  storagePath: '',
});

export type ContextValue = {
  status: ScriptStatus;
  closeCode: number | null;
  currentPid: number | null;
  currentScript: ScriptName | null;
  suspendScript: () => void;
  resumeScript: () => void;
  startScript: (arg: { script: ScriptName; inputData: InputData }) => void;
  registerScriptClosed: (
    arg: (event: IpcRendererEvent, data: ScriptClosedEventData) => void
  ) => () => void;
};

export const ScriptServiceContext = React.createContext<ContextValue>({
  status: 'stopped',
  currentPid: null,
  closeCode: 0,
  currentScript: null,
  startScript: () => undefined,
  suspendScript: () => undefined,
  resumeScript: () => undefined,
  registerScriptClosed: () => () => {},
});
