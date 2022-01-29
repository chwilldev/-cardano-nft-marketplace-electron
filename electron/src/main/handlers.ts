import { M, R } from '../shared/events';
import { resume, runScript, suspend } from '../shared/process';
import environment from '../shared/environment';

// eslint-disable-next-line import/prefer-default-export
export const registerIpcEventHandlers = () => {
  M.startScript.register(async (event, { script, inputData }) => {
    const { code, pid } = await runScript(script, inputData, ({ process }) => {
      R.scriptStarted.reply(event, {
        script,
        pid: process,
      });
    });

    R.scriptClosed.reply(event, { pid, script, code });
  });

  M.requestEnv.register(async (event) => {
    R.sendEnv.reply(event, environment);
  });

  M.suspendScript.register((event, { pid: process }) => {
    const result = suspend(process);

    R.scriptSuspended.reply(event, { pid: process, result });
  });

  M.resumeScript.register((event, { pid: process }) => {
    const result = resume(process);

    R.scriptResumed.reply(event, { pid: process, result });
  });
};
