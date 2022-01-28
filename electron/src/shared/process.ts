import child from 'child_process';
import path from 'path';
import { promises as fsp } from 'fs';
import os from 'os';
import { resume as ntResume, suspend as ntSuspend } from 'ntsuspend';

import { currentTime } from './date';

import environment from './environment';

const defaultCallback = () => {};

// eslint-disable-next-line import/prefer-default-export
export async function runScript<InputData>(
  name: 'generate-random-image',
  inputData: InputData,
  startedCallback: (arg: { process: number }) => void = defaultCallback
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

  if (process.pid) {
    startedCallback({ process: process.pid });
  }

  return new Promise((resolve, reject) => {
    process.on('close', (code) => {
      if (code === null) {
        return reject();
      }

      return resolve(code);
    });
  });
}

export function isWindows() {
  const platform = os.platform();
  return platform === 'win32';
}

export function suspend(pid: number): boolean {
  if (isWindows()) {
    return ntSuspend(pid);
  }
  return process.kill(pid, 'SIGSTOP');
}

export function resume(pid: number): boolean {
  if (isWindows()) {
    return ntResume(pid);
  }
  return process.kill(pid, 'SIGCONT');
}
