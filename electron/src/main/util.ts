/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';

import { isWindows } from '../shared/process';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

export function suspend(pid: number): boolean {
  if (isWindows()) {
    const ntsuspend = require('ntsuspend');
    return ntsuspend.suspend(pid);
  }
  return process.kill(pid, 'SIGSTOP');
}

export function resume(pid: number): boolean {
  if (isWindows()) {
    const ntsuspend = require('ntsuspend');    
    return ntsuspend.resume(pid);
  }
  return process.kill(pid, 'SIGCONT');
}

