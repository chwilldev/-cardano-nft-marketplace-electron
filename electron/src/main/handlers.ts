import { M, R } from '../shared/events';
import { runScript } from '../shared/process';

// eslint-disable-next-line import/prefer-default-export
export const registerIpcEventHandlers = () => {
  M.generateRandomImages.register(async (event, inputData) => {
    const code = await runScript<typeof inputData>(
      'generate-random-image',
      inputData
    );

    R.generatedRandomImages.reply(event, { success: code === 0 });
  });
};
