import child from 'child_process';
import path from 'path';
import { promises as fsp } from 'fs';
import os from 'os';

import { currentTime } from './date';

import environment from './environment';
import { ScriptName } from './types';

const defaultCallback = () => {};

// eslint-disable-next-line import/prefer-default-export
export async function runScript(
  name: ScriptName,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputData: Record<string, any>,
  startedCallback: (arg: { process: number }) => void = defaultCallback
): Promise<{ code: number; pid: number }> {
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

  // eslint-disable-next-line no-console
  console.log(`Run script: ${args.join(' ')}`);

  if (process.pid) {
    startedCallback({ process: process.pid });
  }

  return new Promise((resolve, reject) => {
    process.on('close', (code) => {
      if (code === null || !process.pid) {
        return reject();
      }

      return resolve({ code, pid: process.pid });
    });
  });
}

export function isWindows() {
  const platform = os.platform();
  return platform === 'win32';
}

const ntsuspend = isWindows() ? require('ntsuspend') : null;

export function suspend(pid: number): boolean {
  if (isWindows()) {
    return ntsuspend.suspend(pid);
  }
  return process.kill(pid, 'SIGSTOP');
}

export function resume(pid: number): boolean {
  if (isWindows()) {
    return ntsuspend.resume(pid);
  }
  return process.kill(pid, 'SIGCONT');
}
