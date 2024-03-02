// ------------------------------------------------------------------ //
export class CSVConverter {
    static LINE_DELIMITER = '\n';
    static VALUE_DELIMITER = ',';
    static csvToMatrix(csv) {
        const result = csv
            .split(this.LINE_DELIMITER)
            .map((row) => row
            .trim()
            .split(this.VALUE_DELIMITER)
            .map((value) => value.trim()));
        return result;
    }
    static matrixToCsv(matrix, mapper) {
        return matrix
            .map((row) => row.map(mapper).join(this.VALUE_DELIMITER))
            .join(this.LINE_DELIMITER);
    }
}
