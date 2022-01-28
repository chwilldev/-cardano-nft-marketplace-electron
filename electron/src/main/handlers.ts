import { M, R } from '../shared/events';
import { resume, runScript, suspend } from '../shared/process';
import environment from '../shared/environment';

// eslint-disable-next-line import/prefer-default-export
export const registerIpcEventHandlers = () => {
  M.generateRandomImages.register(async (event, inputData) => {
    const code = await runScript<typeof inputData>(
      'generate-random-image',
      inputData,
      ({ process }) => {
        R.scriptStarted.reply(event, {
          script: 'generate-random-image',
          pid: process,
        });
      }
    );

    R.generatedRandomImages.reply(event, { success: code === 0 });
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
