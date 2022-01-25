export function leadingDigits(filename: string): string {
  const count = [...filename].findIndex((c) => c < '0' || c > '9');

  return filename.substring(0, count);
}

export function parseRarityStr(digitsStr: string): number {
  if (digitsStr === '10') return 1.0;

  return Number('0.' + digitsStr);
}
