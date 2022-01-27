import { promises as fsp } from 'fs';

import { AsyncResult } from 'types/standard';

export const parseArgs = () => {
  const argMap: Record<string, string> = {};

  process.argv.forEach((arg, index, args) => {
    if (arg.startsWith('--')) {
      const nextArg = args[index + 1] || '';
      argMap[arg] = nextArg.startsWith('--') ? '' : nextArg;
    }
  });

  return argMap;
};

export async function getInputData<T>(): Promise<
  AsyncResult<T, { error: any }>
> {
  try {
    const processArgs = parseArgs() as {
      '--input': string;
    };
    const json = await fsp.readFile(processArgs['--input'], {
      encoding: 'utf8',
    });
    return {
      _tag: 'Success',
      result: JSON.parse(json),
    };
  } catch (e) {
    return {
      _tag: 'Error',
      error: e as any,
    };
  }
}
