import { M, R } from '../shared/events';
import { scan } from '../../../scripts/generate-random-image';

export const registerIpcEventHandlers = () => {
  console.log('register');
  M.scanImages.register(async (event, { directory }) => {
    const result = await scan(directory);

    R.scannedImages.reply(event, { layers: result.result });
  });
};
