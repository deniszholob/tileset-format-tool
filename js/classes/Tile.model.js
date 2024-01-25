// Regex test
// https://regex101.com/
// ```
// 1
// 12
// 123
// 1_a
// 12_a
// 123_a
// 123_saerthaerh
// aergaerg_123
// -1
// -1_qw
// ```
export class Tile {
    id;
    variant;
    constructor(id = 0, variant) {
        this.id = id;
        this.variant = variant;
    }
    static getTileFromString(t) {
        if (t == null)
            return t;
        const regex = new RegExp('^([-]?\\d{1,3})_?(\\w*)', '');
        const result = regex.exec(t);
        return result ? new Tile(Number(result[1]), result[2]) : undefined;
    }
    toString() {
        return this.variant ? `${this.id}_${this.variant}` : `${this.id}`;
    }
}
