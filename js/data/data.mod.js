export function arrToSrtArr(arr) {
    return arr.map((v) => v?.toString() ?? '');
}
