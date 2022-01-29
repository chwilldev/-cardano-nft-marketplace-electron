import { IpcRendererEvent } from 'electron';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { ScriptServiceContext } from '../../contexts';
import { R, M, ScriptClosedEventData } from '../../../shared/events';
import { ScriptName } from '../../../shared/types';

type Props = {
  children: React.ReactNode;
};

export default function ScriptServiceProvider(props: Props) {
  const { children } = props;
  const [status, setStatus] = useState<'stopped' | 'running' | 'paused'>(
    'stopped'
  );
  const [currentPid, setCurrentPid] = useState<number | null>(null);
  const [closeCode, setCloseCode] = useState<number | null>(null);
  const [currentScript, setCurrentScript] = useState<ScriptName | null>(null);

  useEffect(() => {
    return R.scriptStarted.register((_event, { pid: process, script }) => {
      setCurrentPid(process);
      setCurrentScript(script);
      setStatus('running');
    });
  }, []);

  useEffect(() => {
    return R.scriptClosed.register((_event, { code }) => {
      setCurrentPid(null);
      setCloseCode(code);
      setStatus('stopped');
    });
  }, []);

  useEffect(() => {
    return R.scriptSuspended.register((_event, { result }) => {
      if (result) {
        setStatus('paused');
      } else {
        toast.error('Suspend failed!');
      }
    });
  }, []);

  useEffect(() => {
    return R.scriptResumed.register((_event, { result }) => {
      if (result) {
        setStatus('running');
      } else {
        toast.error('Resume failed!');
      }
    });
  }, []);

  const suspendScript = useCallback(() => {
    if (!currentPid) {
      toast.error('No script running');
      return;
    }

    M.suspendScript.send({ pid: currentPid });
  }, [currentPid]);

  const resumeScript = useCallback(() => {
    if (!currentPid) {
      toast.error('No script running');
      return;
    }

    M.resumeScript.send({ pid: currentPid });
  }, [currentPid]);

  const startScript = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (arg: { script: ScriptName; inputData: Record<string, any> }) => {
      if (status !== 'stopped') {
        toast.error('Current script is not stopped');
        return;
      }

      M.startScript.send(arg);
    },
    [status]
  );

  const registerScriptClosed = useCallback(
    (fn: (_event: IpcRendererEvent, data: ScriptClosedEventData) => void) => {
      return R.scriptClosed.register(fn);
    },
    []
  );

  const contextValue = useMemo(() => {
    return {
      status,
      closeCode,
      currentPid,
      currentScript,
      startScript,
      suspendScript,
      resumeScript,
      registerScriptClosed,
    };
  }, [
    status,
    closeCode,
    currentScript,
    currentPid,
    startScript,
    suspendScript,
    resumeScript,
    registerScriptClosed,
  ]);

  return (
    <ScriptServiceContext.Provider value={contextValue}>
      {children}
    </ScriptServiceContext.Provider>
  );
}
