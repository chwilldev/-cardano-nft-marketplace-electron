import child from 'child_process';
import path from 'path';
import { promises as fsp } from 'fs';

import { currentTime } from './date';

import environment from './environment';

// eslint-disable-next-line import/prefer-default-export
export async function runScript<InputData>(
  name: 'generate-random-image',
  inputData: InputData
): Promise<number> {
  const scriptPath = path.join(environment.scriptsRoot, name);
  const inputPath = path.join(
    environment.storagePath,
    'inputs',
    `${currentTime()}-${name}.json`
  );
  await fsp.writeFile(inputPath, JSON.stringify(inputData, null, 2), {
    encoding: 'utf8',
  });

  const args = [scriptPath, '--input', inputPath];
  const process = child.spawn('node', args);

  return new Promise((resolve, reject) => {
    process.on('close', (code) => {
      if (code === null) {
        return reject();
      }

      return resolve(code);
    });
  });
}
