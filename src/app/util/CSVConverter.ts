// ------------------------------------------------------------------ //

export class CSVConverter {
  public static readonly LINE_DELIMITER = '\n';
  public static readonly VALUE_DELIMITER = ',';

  public static csvToMatrix(csv: string): string[][] {
    const result: string[][] = csv
      .split(this.LINE_DELIMITER)
      .map((row: string): string[] =>
        row
          .trim()
          .split(this.VALUE_DELIMITER)
          .map((value: string): string => value.trim()),
      );
    return result;
  }

  public static matrixToCsv<T>(
    matrix: T[][],
    mapper: (o: T) => string,
  ): string {
    return matrix
      .map((row: T[]): string => row.map(mapper).join(this.VALUE_DELIMITER))
      .join(this.LINE_DELIMITER);
  }
}
