export function arrToSrtArr(arr: (number | string | null)[]): string[] {
  return arr.map((v: string | number | null): string => v?.toString() ?? '');
}
