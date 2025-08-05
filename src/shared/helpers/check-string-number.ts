export function isStringNumber(value: any): boolean {
  return typeof value === 'string' && !isNaN(Number(value));
}
