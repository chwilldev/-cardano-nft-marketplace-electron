// eslint-disable-next-line import/prefer-default-export
export function randomHex(length: number) {
  return [...Array(length)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');
}
